import { useState, useEffect } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionTypes = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

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
    likes: Record<string, { authorId: string }>;
  }
>;

export function useRoom(roomIdFirebase: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionTypes[]>([]);
  const [title, setTitle] = useState("");
  const [authorIdRoom, setAuthorIdRoom] = useState("");

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
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      setTitle(databaseRoom.title);
      setAuthorIdRoom(databaseRoom.authorId);
      setQuestions(parsedQuestions);
    });
    return () => {
      roomRef.off("value");
    };
  }, [roomIdFirebase, user?.id]);

  return { questions, title, authorIdRoom };
}
