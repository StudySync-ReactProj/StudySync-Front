// src/components/FormContainer/FormContainer.style.js
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";

// Full screen wrapper
export const ContainerWrapper = styled(Box)(({ theme }) => ({
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Use default background from Theme
    backgroundColor: theme.palette.background.default, 
    // Adding a very subtle gradient in Dark Mode gives a sense of depth
    backgroundImage: theme.palette.mode === 'dark' 
        ? "radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, transparent 100%)" 
        : "none",
}));

// The white/dark card that holds the form
export const FormCard = styled(Paper)(({ theme }) => {
    const isDarkMode = theme.palette.mode === 'dark';
    
    return {
        width: 420,
        padding: theme.spacing(5),
        borderRadius: 24,
        textAlign: "center",
        // In Dark Mode the card should be slightly lighter than the page background
        backgroundColor: isDarkMode 
            ? "#1e293b" // Deep dark blue (Slate 800)
            : theme.palette.background.default,
        
        // Adapted shadows
        boxShadow: isDarkMode 
            ? "0px 20px 50px rgba(0, 0, 0, 0.6)" 
            : "0px 10px 30px rgba(15, 23, 42, 0.15)",
            
        // Adding a thin border in Dark Mode helps separate the card from the background
        border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
    };
});

// StudySync title
export const Title = styled(Typography)(({ theme }) => ({
    // In Dark Mode use Primary.light color for better readability
    color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
    fontSize: "3rem",
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    letterSpacing: "-0.02em",
}));

// Sign-in subtitle
export const Subtitle = styled(Typography)(({ theme }) => ({
    // Secondary text in Dark Mode should be slightly softer
    color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : theme.palette.primary.main,
    fontWeight: 400,
    marginBottom: theme.spacing(4),
}));