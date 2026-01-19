// src/components/NavBar/NavBar.style.js
import { styled } from "@mui/material/styles";
import { AppBar, Box, Typography, Button } from "@mui/material";

// Top navigation bar container
export const NavAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: "#F4F7FEB2", // white background
    color: theme.palette.primary.main, // primary color text
    boxShadow: 'none', // Remove box shadow
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
    color: theme.palette.primary.main,
    display: "block",
    textTransform: "none",
    fontSize: "20px",
}));

// Box that contains the avatar / user menu
export const UserBox = styled(Box)(() => ({
    flexGrow: 0,
}));

