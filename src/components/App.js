import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import Finished from "./Finished";
import { useQuizzes } from "../hooks/useQuiz";

export default function App() {
  const { status } = useQuizzes();
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

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Main>
          {/* <button onClick={handlePrev}>Prev</button>
          <button onClick={handleNext}>Next</button> */}

          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && <StartScreen />}
          {status === "active" && (
            <>
              <Progress />
              <Question />
            </>
          )}
          {status === "finished" && <Finished />}
        </Main>
      </main>
    </div>
  );
}
