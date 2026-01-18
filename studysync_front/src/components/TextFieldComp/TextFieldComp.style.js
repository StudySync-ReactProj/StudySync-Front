import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

//Styled text field used in login forms
export const StyledTextField = styled(TextField)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' 
        ? "rgba(255, 255, 255, 0.05)" 
        : "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,

    "& .MuiFilledInput-root": {
        backgroundColor: theme.palette.mode === 'dark' 
            ? "rgba(255, 255, 255, 0.05)" 
            : "rgba(255, 255, 255, 0.8)",
        borderRadius: 8,

        "&:hover": {
            backgroundColor: theme.palette.mode === 'dark' 
                ? "rgba(255, 255, 255, 0.08)" 
                : "rgba(255, 255, 255, 0.9)",
        },

        "&.Mui-focused": {
            backgroundColor: theme.palette.mode === 'dark' 
                ? "rgba(255, 255, 255, 0.08)" 
                : "rgba(255, 255, 255, 0.9)",
        },

        // remove the default filled underline
        "&:before, &:after": {
            display: "none",
        },
    },

    // label (Email / Password) default state
    "& .MuiInputLabel-root": {
        backgroundColor: "transparent",
        padding: "0 4px",
        color: theme.palette.text.secondary,
    },

    // label when focused
    "& .MuiInputLabel-root.Mui-focused": {
        color: theme.palette.primary.main,
        backgroundColor: "transparent",
    },
}));
