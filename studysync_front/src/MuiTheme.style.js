// src/MuiTheme.style.js
import { createTheme } from "@mui/material/styles";

export default function getMuiTheme(mode = "light") {
    const isDark = mode === "dark";

    return createTheme({
        typography: {
            fontFamily: '"Rubik", sans-serif',
        },
        palette: {
            mode,

            primary: {
                main: "#061738",
                dark: "#0A2B6B",
            },

            background: {
                default: isDark ? "#0B1220" : "#E0EAFC", // page background
                paper: isDark ? "#111B2D" : "#ffffff",   // cards background
            },

            text: {
                primary: isDark ? "#EAF0FF" : "#061738",
                secondary: isDark ? "#B9C7E6" : "#2E3A59",
            },

            divider: isDark ? "rgba(255,255,255,0.10)" : "rgba(6, 23, 56, 0.08)",
        },

        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        boxShadow: "none",
                    }),
                },
            },
        },
    });
}
