import React from "react";
import IconButton from "@mui/material/IconButton";

export default function ThemeToggleButton({ theme, setTheme }) {
    const isDark = theme === "dark";

    const toggleTheme = () => {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    };

    return (
        <IconButton onClick={toggleTheme} aria-label="toggle theme">
            {isDark ? "🌞" : "🌜"}
        </IconButton>
    );
}
