import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';

  return {
    // General root styling
    borderRadius: 8,

    "& .MuiOutlinedInput-root": {
      backgroundColor: isDarkMode 
        ? "rgba(40, 45, 60, 0.6)" // Slightly darker than card background
        : "rgba(210, 224, 245, 0.9)", // Slightly darker than card background
      borderRadius: 8,
      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

      // Border color in normal state
      "& fieldset": {
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },

      // Hover state
      "&:hover fieldset": {
        borderColor: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
      },

      // Focused state
      "&.Mui-focused": {
        backgroundColor: isDarkMode ? "rgba(40, 40, 60, 0.9)" : "rgba(224, 234, 252, 1)",
        "& fieldset": {
          borderWidth: '2px',
          borderColor: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
        },
      },

      // Text color inside the field
      "& input": {
        color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
      },
    },

    // Label styling (the text that describes the field)
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "rgba(255, 255, 255, 0.6)" : theme.palette.text.secondary,
      "&.Mui-focused": {
        color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
      },
    },

    // Handle icons if present (like eye icon for password)
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "inherit",
    },
  };
});