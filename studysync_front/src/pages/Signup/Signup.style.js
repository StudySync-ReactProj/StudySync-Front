// src/pages/Login/Login.style.js
import { styled } from "@mui/material/styles";
import { Stack, Typography, Box } from "@mui/material";


// The stack that holds the form fields and button
export const LoginFormStack = styled(Stack)`
    margin-top: 20px;
    width: 100%;
    background-color: ${({ theme }) => theme.palette.background.default};
`;

// Footer text at the bottom - "Don't have an account?"
export const FooterText = styled(Typography)`
    margin-top: 24px;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.palette.text.secondary}
`;

// Footer link styled as a clickable text
export const FooterLink = styled(Box)`
    margin-left: 4px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;
