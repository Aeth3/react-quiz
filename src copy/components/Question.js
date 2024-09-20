import Options from "./Options";
import Button from "./Button";
import Timer from "./Timer";
import Footer from "./Footer";

export default function Question({
  currentQuestion,
  dispatch,
  answer,
  currentPoints,
  numQuestions,
  index,
  secondsRemaining,
  
}) {
  const { question, options, id, correctOption, points } = currentQuestion;
  const hasAnswered = answer !== null;

  return (
    <div>
      <h4>Score: {currentPoints}</h4>
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
        <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
        {hasAnswered && (
          <Button
            className={"btn btn-ui"}
            dispatch={dispatch}
            type={{ type: "next" }}
          >
            {index === numQuestions - 1 ? "Finish" : "Next"}
          </Button>
        )}
      </Footer>

      {/* <Button dispatch={dispatch} type={{ type: "prev" }}>
            Prev
          </Button> */}
    </div>
  );
}
