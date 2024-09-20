import { useEffect } from "react";

export default function Timer({ secondsRemaining, dispatch}) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);
  useEffect(
    function () {
      const tickInterval = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      return function () {
        clearInterval(tickInterval);
      };
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}
