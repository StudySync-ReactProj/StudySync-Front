import { styled } from "@mui/material/styles";

export const SchedulerWrapper = styled("div")(({ theme }) => ({
    height: "800px",
    width: "100%",
    overflow: "visible",
    display: "flex",
    flexDirection: "column",

    /* All tabs (TODAY / MONTH / WEEK / DAY) */
    "& .rs__header .MuiTab-root": {
        color: `${theme.palette.text.secondary} !important`,
        fontWeight: 600,
        opacity: 1,
    },

    /* More aggressive hide - target all buttons in tabs container */
    "& .rs__header .MuiTabs-flexContainer button": {
        display: "none !important",
    },

    /* Re-show only Month and Week - they should be 3rd and 4th */
    "& .rs__header .MuiTabs-flexContainer button:nth-of-type(3)": {
        display: "inline-flex !important",
    },
    
    "& .rs__header .MuiTabs-flexContainer button:nth-of-type(4)": {
        display: "inline-flex !important",
    },

    /* hover */
    "& .rs__header .MuiTab-root:hover": {
        color: `${theme.palette.text.primary} !important`,
    },

    /* Selected tab */
    "& .rs__header .MuiTab-root.Mui-selected": {
        color: `${theme.palette.text.primary} !important`,
    },

    /* Remove the primary color underline */
    "& .rs__header .MuiTabs-indicator": {
        backgroundColor: `${theme.palette.text.primary} !important`,
    },

    /* Override any default primary colors */
    "& .MuiTab-textColorPrimary": {
        color: `${theme.palette.text.secondary} !important`,
    },

    "& .MuiTab-textColorPrimary.Mui-selected": {
        color: `${theme.palette.text.primary} !important`,
    },

    /* View navigator buttons */
    "& .rs__view_navigator button": {
        color: `${theme.palette.text.primary} !important`,
    },

    /* Calendar header dates - make them bigger */
    "& .rs__cell__header": {
        fontSize: "1.1rem !important",
    },

    "& .rs__cell__header > *": {
        fontSize: "1.1rem !important",
    },

    "& .rs__header__date": {
        fontSize: "1.1rem !important",
    },
}));