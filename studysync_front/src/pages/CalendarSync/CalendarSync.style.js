export const styles = {
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2
    },
    headerButtonsContainer: {
        display: 'flex',
        gap: 1
    },
    actionButton: {
        bgcolor: 'background.paper',
        color: 'text.primary',
        border: 1,
        borderColor: 'divider',
        '&:hover': { bgcolor: 'action.hover' },
        '&:disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' },
        width: 40,
        height: 40,
        borderRadius: 2
    },

    buttonsContainer: {
        display: "flex",
        gap: 2
    },

    mainContainer: {
        display: "flex",
        height: "100%",
        bgcolor: "background.default"
    },

    schedulerContainer: {
        flex: 1,
        marginLeft: 3,
        overflow: "hidden"
    },

    legendContainer: {
        display: 'flex',
        gap: 3,
        mb: 2,
        p: 1.5,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
    },

    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 1
    },

    legendColorBox: (color) => ({
        width: 16,
        height: 16,
        backgroundColor: color,
        borderRadius: 1
    }),

    alertMargin: {
        mb: 2
    }
};
