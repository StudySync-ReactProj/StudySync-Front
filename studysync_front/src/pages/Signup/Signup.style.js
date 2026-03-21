// src/pages/Login/Login.style.js
import { styled } from "@mui/material/styles";
import { Stack, Typography, Box } from "@mui/material";


// The stack that holds the form fields and button
export const LoginFormStack = styled(Stack)`
    margin-top: 20px;
    width: 100%;
`;

// Footer text at the bottom - "Don't have an account?"
export const FooterText = styled(Typography)(({ theme }) => ({
    marginTop: "24px",
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

// Footer link styled as a clickable text
export const FooterLink = styled(Box)(({ theme }) => {
    return {
        marginLeft: "4px",
        // In Dark Mode use a lighter shade of blue for better readability (Contrast)
        color: theme.palette.mode === 'dark' ? "rgb(224, 234, 252)" : theme.palette.primary.main,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-block",
        transition: "all 0.2s ease-in-out",

        "&:hover": {
            textDecoration: "underline",
            // Small hover effect adds a lot to the UI feel
            filter: theme.palette.mode === 'dark' ? "brightness(1.2)" : "brightness(0.8)",
        },
    };
});
