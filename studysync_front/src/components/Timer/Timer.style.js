import { styled } from "@mui/material/styles";

export const TimeDisplay = styled("div")({
  fontSize: "90px",
  fontWeight: 600,
  letterSpacing: "2px",
  textAlign: "center",
  color: "#061738",
  marginTop: "-35px",
});

export const Controls = styled("div")({
  marginTop: "12px",
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginTop:"-10px",
});

export const ControlButton = styled("button")({
  fontSize: "20px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",


  "&:hover": {
    backgroundColor: "#0D3682",
  },

  "&:active": {
    transform: "scale(0.95)",
  },
});
