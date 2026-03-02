// no local state here; timer state comes from useTimer
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
  // useTimer provides wall-clock accurate timing and control methods
  const { elapsedSeconds, isRunning, start, pause, reset, getElapsedMs } = useTimer(250);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { h, m, s } = formatHMS(elapsedSeconds);

  // Called when user presses replay/stop
  const handleStop = async () => {
    // Use getElapsedMs() to compute minutes at click time (accurate even
    // if the UI was slightly stale due to tick frequency).
    const ms = getElapsedMs();
    const minutes = Math.floor(ms / 60000);

    if (minutes > 0) {
      await API.post("/progress/session", { minutes });

      // 🔥 tell parent to refresh graphs
      if (onSessionSaved) onSessionSaved();
    }

    // Pause the timer after saving session
    pause();
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
          <ControlButton onClick={() => start()}>
            <img src={playIcon} alt="Play" />
          </ControlButton>
        ) : (
          <ControlButton onClick={() => pause()}>
            <img src={pauseIcon} alt="Pause" />
          </ControlButton>
        )}
        <ControlButton
          onClick={() => {
            handleStop();
            // reset after handleStop to ensure saved duration uses current time
            reset();
          }}
        >

          <img src={replayIcon} alt="Replay" />
        </ControlButton>
      </Controls>
    </TimerLayout>
  );

};
