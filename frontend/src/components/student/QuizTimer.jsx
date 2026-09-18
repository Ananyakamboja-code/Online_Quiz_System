import { useEffect, useRef, useState } from "react";

/**
 * Countdown timer for taking a quiz. Frontend-only.
 *
 * - Displays remaining time as MM:SS.
 * - Updates every second.
 * - Never goes negative (clamped at 0).
 * - Calls onTimeUp() once when it reaches zero (e.g. to auto-submit).
 *
 * @param {number} durationMinutes total quiz duration in minutes
 * @param {() => void} onTimeUp called once when the timer hits zero
 */
function QuizTimer({ durationMinutes, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, Math.round(durationMinutes * 60))
  );
  const firedRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onTimeUp?.();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isDanger = secondsLeft <= 30;

  return (
    <span className={`quiz-timer ${isDanger ? "danger" : ""}`}>
      <i className="bi bi-clock me-1"></i>
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

export default QuizTimer;
