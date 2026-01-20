// src/components/NavBar/NavBar.style.js
import { styled } from "@mui/material/styles";
import { AppBar, Box, Typography, Button } from "@mui/material";

// Top navigation bar container
export const NavAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper, // במקום צבע קשיח
    color: theme.palette.text.primary,
    boxShadow: "none",
    height: "90px",
}));
// Logo (desktop) 
export const BrandDesktop = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: "none",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",

    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

// Logo (mobile)
export const BrandMobile = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: "flex",
    flexGrow: 1,
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",

    [theme.breakpoints.up("md")]: {
        display: "none",
    },
}));


// Box that wraps the mobile hamburger menu - Visible only on small screens
export const MobileNavBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: "flex",

    [theme.breakpoints.up("md")]: {
        display: "none",
    },
}));

// Box that wraps the desktop navigation links - Visible from md and up
export const DesktopNavBox = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: "none",
    boxShadow: "none",
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

// Navigation tabs (desktop links)
export const NavButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2, 2, 0.5, 0),
    color: theme.palette.text.primary, // במקום primary.main קבוע
    display: "block",
    textTransform: "none",
    fontSize: "20px",

    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
    },
}));

// Box that contains the avatar / user menu
export const UserBox = styled(Box)(() => ({
    flexGrow: 0,
}));

