import { createContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
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
function QuizProvider({ children }) {
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
  function handleStart() {
    dispatch({ type: "start" });
  }
  useEffect(
    function () {
      dispatch({ type: "store", payload: highscore });
    },
    [highscore]
  );
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        handleStart,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export { QuizProvider, QuizContext };
