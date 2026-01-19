// src/components/ThemedCard/ThemedCard.style.js
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const CardWrapper = styled(Box)(({ themeMode }) => ({
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: themeMode === "dark" ? "#111" : "#fff",
    color: themeMode === "dark" ? "#fff" : "#111",
}));
