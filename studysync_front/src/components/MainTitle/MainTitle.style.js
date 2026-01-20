import { styled } from "@mui/material/styles";

export const Title = styled("h2")(({ theme }) => ({
  color: theme.palette.text.primary, 
  textAlign: "left",
  fontFamily: "Prompt",
  fontSize: "35px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "normal",
  marginTop: "23px",
  marginBottom: "17px",
}));
