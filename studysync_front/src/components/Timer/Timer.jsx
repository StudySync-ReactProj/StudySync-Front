import { useState } from "react";
import useTimer from "../../hooks/useTimer";
import {
  TimeDisplay,
  Controls,
  ControlButton,
} from "./Timer.style";


function formatHMS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);

  const { seconds, reset } = useTimer(isRunning ? 1000 : null);
  const { h, m, s } = formatHMS(seconds);

  return (
  <div>
    <TimeDisplay>
      {h}:{m}:{s}
    </TimeDisplay>

    <Controls>
      <ControlButton onClick={() => setIsRunning(true)}>
        ▶️
      </ControlButton>

      <ControlButton onClick={() => setIsRunning(false)}>
        ⏸️
      </ControlButton>

      <ControlButton
        onClick={() => {
          setIsRunning(false);
          reset();
        }}
      >
        🔄
      </ControlButton>
    </Controls>
  </div>
);
}
