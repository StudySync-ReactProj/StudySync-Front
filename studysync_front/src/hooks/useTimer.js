import { useState, useEffect } from "react";

export default function useTimer(interval) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (interval === null) return;

    const id = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, interval);

    return () => clearInterval(id);
  }, [interval]);

  const reset = () => setSeconds(0);

  return { seconds, reset };
}
