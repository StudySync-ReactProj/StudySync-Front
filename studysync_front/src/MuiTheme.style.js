import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode: mode,
        primary: {
            main: mode === 'dark' ? '#90caf9' : '#061738',
            dark: mode === 'dark' ? '#42a5f5' : '#0A2B6B',
        },
        background: {
            default: mode === 'dark' ? '#121212' : '#E0EAFC',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff'
        },
        text: {
            primary: mode === 'dark' ? '#ffffff' : '#000000',
            secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
        }
    },
    typography: {
        fontFamily: '"Rubik", sans-serif',
    },
});

// Default light theme for backwards compatibility
const Theme = getTheme('light');
export default Theme;