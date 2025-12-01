// src/components/FormContainer/FormContainer.style.js
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

// The full page wrapper
export const ContainerWrapper = styled(Box)(({ theme }) => ({
    height: "100vh",                     // full screen height
    display: "flex",
    alignItems: "center",                // vertical center
    justifyContent: "center",            // horizontal center
    backgroundColor: theme.palette.background.default, // page bg (light blue)
}));

// The white "card" that holds the login form
export const FormCard = styled(Paper)(({ theme }) => ({
    width: 420,
    padding: theme.spacing(5),           // inner padding
    borderRadius: 24,
    textAlign: "center",
    backgroundColor: theme.palette.background.default,   // card bg
    boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.15)", // subtle card shadow
}));

// The big "StudySync" title - REMOVE AFTER LOGO IS READY
export const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,   // dark blue
    fontSize: "3rem",
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    letterSpacing: "-0.02em",
    backgroundColor: "transparent",      // make sure there's no colored bar
}));

// The "Sign-in" subtitle
export const Subtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 400,
    marginBottom: theme.spacing(4),
    backgroundColor: "transparent",      // no background strip here either
}));
