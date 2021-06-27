import { ReactNode } from "react";
import cx from "classnames";
import "../styles/questions.scss";

type QuestionsProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighLinghted?: boolean;
};

export function Question({
  content,
  author,
  isAnswered = false,
  isHighLinghted = false,
  children,
}: QuestionsProps) {
  return (
    <div
      className={cx(
        "question",
        { answered: isAnswered },
        { highlinghted: isHighLinghted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={`Imagem ou foto de ${author.name}`} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
