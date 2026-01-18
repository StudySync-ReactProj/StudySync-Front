import { styled } from "@mui/material/styles";

export const TimeDisplay = styled("div")(({ theme }) => ({
  fontSize: "90px",
  fontWeight: 600,
  letterSpacing: "2px",
  textAlign: "center",
  color: theme.palette.text.primary,
  marginTop: "-35px",
}));

export const Controls = styled("div")({
  marginTop: "12px",
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginTop:"-10px",
});

export const ControlButton = styled("button")(({ theme }) => ({
  fontSize: "20px",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0',
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark' ? '#42a5f5' : '#0D3682',
  },

  "&:active": {
    transform: "scale(0.95)",
  },
}));
