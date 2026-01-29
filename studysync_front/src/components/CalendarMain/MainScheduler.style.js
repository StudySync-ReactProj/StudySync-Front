import { styled } from "@mui/material/styles";

export const SchedulerWrapper = styled("div")(({ theme }) => ({
    height: "800px",
    width: "100%",
    overflow: "auto",

    /* All tabs (TODAY / MONTH / WEEK / DAY) */
    "& .rs__header .MuiTab-root": {
        color: `${theme.palette.text.secondary} !important`,
        fontWeight: 600,
        opacity: 1,
    },

    /* Hide TODAY tab - it's the first one */
    "& .rs__header .MuiTab-root:first-of-type": {
        display: "none",
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
}));
