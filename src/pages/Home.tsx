import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import ilistrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import { Button } from "../components/Button";
import { database } from "../services/firebase";
import "../styles/auth.scss";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) {
      alert("Sala não existe.");
      return;
    }
    if (roomRef.val().endedAt) {
      alert("Sala já encerrada!");
      return;
    }
    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={ilistrationImg}
          alt="ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="logo da aplicação - Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo Google" />
            Crie sua sala com sua conta Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              alt="Digite o código da sala"
              value={roomCode}
              onChange={({ target }) => setRoomCode(target.value)}
            />
            <Button type="submit">Entrar na sale</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
