import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    typography: {
        fontFamily: '"Rubik", sans-serif',
    },
    palette: {
        primary: {
            main: '#061738',
            dark: '#0A2B6B',
        },
        background: {
            default: '#E0EAFC',
            paper: '#ffffff'
        }
    },
});

export default Theme;