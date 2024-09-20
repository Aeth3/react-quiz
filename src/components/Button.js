import { useQuizzes } from "../hooks/useQuiz";

export default function Button({ children, type, className}) {
  const {dispatch} = useQuizzes()
  return (
    <button className={className} onClick={() => dispatch(type)}>
      {children}
    </button>
  );
}
