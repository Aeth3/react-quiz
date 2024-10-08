import Options from "./Options";
import Button from "./Button";
import Timer from "./Timer";
import Footer from "./Footer";
import { useQuizzes } from "../hooks/useQuiz";

export default function Question() {
  const { questions, index, dispatch, answer, points } = useQuizzes();
  const currentQuestion = questions[index];
  const { question, options, correctOption } = currentQuestion;
  const hasAnswered = answer !== null;

  return (
    <div>
      <h4>Score: {points}</h4>
      <h4>{question}</h4>
      {options.map((option, i) => (
        <Options key={i}>
          <button
            className={`btn btn-option ${i === answer ? "answer" : ""} ${
              hasAnswered ? (i === correctOption ? "correct" : "wrong") : ""
            }`}
            onClick={() => {
              dispatch({
                type: "newAnswer",
                payload: i,
              });
            }}
            disabled={hasAnswered}
          >
            {option}
          </button>
        </Options>
      ))}
      <Footer>
        <Timer />
        {hasAnswered && (
          <Button className={"btn btn-ui"} type={{ type: "next" }}>
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        )}
      </Footer>

      {/* <Button dispatch={dispatch} type={{ type: "prev" }}>
            Prev
          </Button> */}
    </div>
  );
}
