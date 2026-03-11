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

    /* Target today cell header - aggressive approach to override library styles */
    "& .rs__today_cell p": {
        color: theme.palette.mode === 'dark' ? "#FFFFFF !important" : `${theme.palette.text.primary} !important`,
    },

}));

// Additional style helpers to be used inside MainScheduler component
export const controlsContainerSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    mb: 2,
    p: 1,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexShrink: 0
};

export const navIconButtonSx = {
    bgcolor: 'background.paper',
    color: 'text.primary',
    border: 1,
    borderColor: 'divider',
    '&:hover': { bgcolor: 'action.hover' },
    width: 32,
    height: 32
};

export const todayBoxSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    cursor: 'pointer',
    px: 1.5,
    py: 0.25,
    borderRadius: 1,
    '&:hover': { bgcolor: 'action.hover' }
};

export const todayIconSx = { fontSize: 18, color: 'text.primary' };
export const todayTitleSx = { fontWeight: 600, minWidth: 120, textAlign: 'center' };

export const schedulerContentSx = { position: 'relative', flex: 1, overflow: 'auto' };

// Small helpers for event title indicator
export const rsvpIndicatorSx = {
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
    mr: 1
};

export const rsvpTitleWrapSx = { display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' };

export default {};