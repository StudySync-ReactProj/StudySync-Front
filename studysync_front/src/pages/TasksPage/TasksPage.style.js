// src/pages/TasksPage/TasksPage.style.js

export const styles = {
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
    },

    addFormWrapper: {
        mb: 4,
        width: '100%',
        maxWidth: '800px',
        margin: '0 0 32px 0'
    },

    tasksListContainer: {
        mt: 2,
        width: '100%',
        maxWidth: '800px',
        margin: 0
    },

    alertMargin: {
        mb: 2
    },

    spinnerBox: {
        display: 'flex',
        justifyContent: 'center',
        mt: 4
    }
};

export const topActionButtonSx = (theme) => ({
    ...(theme.palette.mode === 'dark' && {
        bgcolor: '#5E35B1',
        color: '#F3E5F5',
        border: 'none',
        '&:hover': {
            bgcolor: '#7E57C2',
            color: '#F3E5F5',
        },
        '&:disabled': {
            bgcolor: '#3F2C70',
            color: '#9575CD',
        },
    }),
    ...(theme.palette.mode === 'light' && {
        '&:disabled': {
            opacity: 0.6,
        },
    }),
});
