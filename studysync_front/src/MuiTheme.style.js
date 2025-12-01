import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    typography: {
        fontFamily: '"Oxanium", sans-serif',
    },
    palette: {
        primary: {
            main: '#0D3682',
            dark: '#0A2B6B',
        },
        background: {
            default: '#E0EAFC',
            paper: '#ffffff'
        }
    },
});

export default Theme;