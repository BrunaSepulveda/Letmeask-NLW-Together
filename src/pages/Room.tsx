import { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import logoImg from "../assets/images/logo.svg";

import "../styles/room.scss";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const [newQts, setNewQts] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  const params = useParams<RoomParams>();
  const roomIdFirebase = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomIdFirebase}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const fibaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(fibaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isAnswered: value.isAnswered,
            isHighlighted: value.isHighlighted,
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomIdFirebase]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQts.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Sem permissão para mandar perguntas");
    }

    const question = {
      content: newQts,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLinghted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomIdFirebase}/questions`).push(question);

    setNewQts("");
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo letmeask" />
          <RoomCode code={roomIdFirebase} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={({ target }) => setNewQts(target.value)}
            value={newQts}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={`Imagem ou foto de ${user.name}`} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Envie sua pergunta.
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
