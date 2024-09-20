import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";

function useQuizzes() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside provider");
  return context;
}

export { useQuizzes };
