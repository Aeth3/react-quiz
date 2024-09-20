import { useQuizzes } from "../hooks/useQuiz";

export default function Progress() {
  const { index, questions, points, maxPossiblePoints, answer } = useQuizzes();
  return (
    <header className="progress">
      <progress
        max={questions.length}
        value={index + Number(answer !== null)}
      />
      <p>
        Question{" "}
        <strong>
          {index + 1} / {questions.length}
        </strong>
      </p>
      <p>
        <strong>{points} </strong>/ {maxPossiblePoints}
      </p>
    </header>
  );
}
