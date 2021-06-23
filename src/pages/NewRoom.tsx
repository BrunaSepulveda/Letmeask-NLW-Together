import { useState } from "react";
import { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useHistory } from "react-router-dom";

import ilistrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";

import { database } from "../services/firebase";

import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [nameRoom, setNameRoom] = useState("");

  async function createRoom(event: FormEvent) {
    event.preventDefault();

    if (nameRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: nameRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={createRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              alt="Nome da sala"
              onChange={({ target }) => setNameRoom(target.value)}
              value={nameRoom}
            />
            <Button type="submit">Criar sale</Button>
          </form>
          <p>
            Quer entrar em uma sala já existente?{" "}
            <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
