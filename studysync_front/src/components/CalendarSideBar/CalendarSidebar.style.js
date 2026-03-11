// src/components/CalendarSideBar/CalendarSidebar.style.js

export const styles = {
    paperContainer: {
        width: 320,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider'
    },

    headerBox: {
        p: 2,
        textAlign: 'center'
    },

    connectButtonSx: (theme) => ({
        textTransform: 'none',
        borderRadius: '8px',
        borderColor: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
        color: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
        '&:hover': {
            borderColor: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.08)' : 'rgba(66, 133, 244, 0.04)'
        },
        fontWeight: 'bold'
    }),

    calendarContainer: {},

    eventsBox: {
        p: 2,
        overflowY: 'auto',
        flex: 1
    },

    dateTitleTypography: {
        color: 'text.primary',
        fontWeight: 'bold'
    },

    noEventsText: {
        mt: 2,
        color: 'text.secondary'
    },

    listItemSx: {
        mb: 2
    },

    primaryTypographyProps: {
        fontWeight: 'bold',
        fontSize: '0.85rem'
    }
};