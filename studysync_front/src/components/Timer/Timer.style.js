import { styled } from "@mui/material/styles";

/* contains all timer*/
export const TimerLayout = styled("div")({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",
});

/* time itself*/
export const TimeDisplay = styled("div")({
  fontSize: "90px",
  fontWeight: 600,
  letterSpacing: "2px",
  lineHeight: 1,
  textAlign: "center",
  color: "#061738",
});

/* buttons layout*/
export const Controls = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  paddingBottom: "35px"
});

/* one button */
export const ControlButton = styled("button")({
  width: "44px",
  height: "44px",
  fontSize: "20px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#F1F4FA",

  "&:hover": {
    backgroundColor: "#E3E9F6",
  },

  "&:active": {
    transform: "scale(0.95)",
  },
});
