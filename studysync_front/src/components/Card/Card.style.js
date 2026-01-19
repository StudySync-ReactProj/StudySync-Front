import { styled } from "@mui/material/styles";

export const CardWrapper = styled("div")(({ theme }) => ({
    borderRadius: "20px",

    background: theme.palette.background.paper,
    color: theme.palette.text.primary,

    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "15px 40px 40px"

}));