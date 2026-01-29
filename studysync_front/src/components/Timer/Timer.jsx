import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useTimer from "../../hooks/useTimer";
import {
  TimerLayout,
  TimeDisplay,
  Controls,
  ControlButton,
} from "./Timer.style";

// Import assets
import playLight from "../../assets/play-button_light.svg";
import playDark from "../../assets/play_dark.svg";
import pauseLight from "../../assets/pause_light.svg";
import pauseDark from "../../assets/pause-dark.svg";
import replayLight from "../../assets/replay_light.svg";
import replayDark from "../../assets/replay_dark.svg";
import API from "../../api/axiosConfig";


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

export default function Timer({ onSessionSaved }) {
  const [isRunning, setIsRunning] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { seconds, reset } = useTimer(isRunning ? 1000 : null);
  const { h, m, s } = formatHMS(seconds);

  // Called when user presses replay/stop
  const handleStop = async () => {
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      await API.post("/progress/session", { minutes });

      // 🔥 tell parent to refresh graphs
      if (onSessionSaved) onSessionSaved();
    }

    setIsRunning(false);
  };



  // Select appropriate icons based on theme
  const playIcon = isDark ? playDark : playLight;
  const pauseIcon = isDark ? pauseDark : pauseLight;
  const replayIcon = isDark ? replayDark : replayLight;


  return (
    <TimerLayout>

      <TimeDisplay>
        {h}:{m}:{s}
      </TimeDisplay>

      <Controls>
        {!isRunning ? (
          <ControlButton onClick={() => setIsRunning(true)}>
            <img src={playIcon} alt="Play" />
          </ControlButton>
        ) : (
          <ControlButton onClick={() => setIsRunning(false)}>
            <img src={pauseIcon} alt="Pause" />
          </ControlButton>
        )}
        <ControlButton
          onClick={() => {
            handleStop();
            reset();
          }}
        >

          <img src={replayIcon} alt="Replay" />
        </ControlButton>
      </Controls>
    </TimerLayout>
  );

}
