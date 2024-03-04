import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import Finished from "./Finished";

const storedHighscore = localStorage.getItem("highscore");
const initialHighscore = storedHighscore ? JSON.parse(storedHighscore) : 0;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: initialHighscore,
  secondsRemaining: 0,
};

const SECS_PER_SECOND = 30;

function reducer(state, action) {
  const question = state.questions.at(state.index);
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "prev":
      return {
        ...state,
        index: state.index > 0 ? state.index - 1 : state.index,
      };
    case "next":
      const hasNotReachedLimit = state.index < state.questions.length - 1;
      return {
        ...state,
        index: hasNotReachedLimit ? state.index + 1 : state.index,
        answer: hasNotReachedLimit ? null : state.answer,
        status: hasNotReachedLimit !== true ? "finished" : state.status,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_SECOND,
      };
    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "reset":
      return {
        ...state,
        status: "ready",
        index: initialState.index,
        answer: initialState.answer,
        points: initialState.points,
        secondsRemaining: initialState.secondsRemaining,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "store":
      localStorage.setItem("highscore", JSON.stringify(action.payload));

      return { ...state, highscore: action.payload };
    // case "finished":
    //   return { ...state, status: "finished" };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = state;

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  // function handlePrev() {
  //   console.log(number);
  //   if (number > 0) dispatch({ type: "prev" });
  // }

  // function handleNext() {
  //   console.log(number);
  //   console.log(questions.length);
  //   if (number === questions.length - 1) return;
  //   dispatch({ type: "next" });
  // }
  function handleStart() {
    dispatch({ type: "start" });
  }

  useEffect(
    function () {
      dispatch({ type: "store", payload: highscore });
    },
    [highscore]
  );

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Main>
          {/* <button onClick={handlePrev}>Prev</button>
          <button onClick={handleNext}>Next</button> */}

          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen
              questionsLength={questions.length}
              handleStart={handleStart}
            />
          )}
          {status === "active" && (
            <>
              <Progress
                index={index}
                numQuestions={questions.length}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />
              <Question
                currentQuestion={questions[index]}
                dispatch={dispatch}
                answer={answer}
                currentPoints={points}
                numQuestions={questions.length}
                index={index}
                secondsRemaining={secondsRemaining}
              />
            </>
          )}
          {status === "finished" && (
            <Finished
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highscore={highscore}
              dispatch={dispatch}
            />
          )}
        </Main>
      </main>
    </div>
  );
}
