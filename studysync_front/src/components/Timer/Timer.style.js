import { styled } from "@mui/material/styles";

/* contains all timer*/
export const TimerLayout = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "10px",

  // let text color adapt to dark/light mode
  color: theme.palette.text.primary,
}));

/* time itself*/
export const TimeDisplay = styled("div")(({ theme }) => ({
  fontSize: "90px",
  fontWeight: 600,
  letterSpacing: "2px",
  lineHeight: 1,
  textAlign: "center",
  marginBottom: "16px",

  // instead of hardcoded colors, adapt to dark/light mode:
  color: theme.palette.text.primary,
}));

/* buttons layout*/
export const Controls = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  paddingBottom: "35px",
}));

/* one button */
export const ControlButton = styled("button")(({ theme }) => ({
  width: "30px",
  height: "30px",
  fontSize: "20px",
  borderRadius: "50px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "15px",
  padding: "0",

  // dark/light mode support
  color: theme.palette.text.primary,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.04)",

  border: `1px solid ${theme.palette.divider}`,

  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.14)"
        : "rgba(0,0,0,0.08)",
  },

  "&:active": {
    transform: "scale(0.95)",
  },

  "& img": {
    width: "30px",
    height: "30px",
    display: "block",
  },
}));
