import { styled } from "@mui/material/styles";

export const CardContainer = styled("div")({
    display: "grid",
    gridTemplateColumns: "600px 600px",
    columnGap: "40px",
    rowGap: "40px",
    justifyContent: "center",
    marginTop: "40px",
});

/* size for each card */
// clock
export const TimeBox = styled("div")({
    width: "600px",
    height: "179px",
});

// Today's tasks
export const TasksBox = styled("div")({
    width: "600px",
    height: "416px",
    gridRow: "1 / span 2",
    gridColumn: "2 / 3",
});

// Daily prog
export const DailyBox = styled("div")({
    width: "600px",
    height: "179px",
});

// weekly prog
export const WeeklyBox = styled("div")({
    width: "600px",
    height: "400px",
});

// deadlines
export const DeadlinesBox = styled("div")({
    width: "600px",
    height: "400px",
});

export const CardHeading = styled("h3")(({ theme }) => ({
    marginBottom: "15px",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: "1.5rem",
    fontWeight: 600,
}));

export const ErrorText = styled("p")({
    margin: 0,
    color: "red",
});

export const CardList = styled("ul")(({ theme }) => ({
    paddingLeft: "18px",
    listStyleType: "disc",

    "& li": {
        marginBottom: "10px",
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        lineHeight: 1.5,
        fontSize: "1.2rem",
    },

    // Completed task style (no inline styles)
    "& li[data-status='Completed']": {
        textDecoration: "line-through",
        opacity: 0.6,
    },
}));

/* ---- Daily goal UI ---- */
export const GoalRow = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: "-15px",
});

export const GoalLabel = styled("span")(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.95rem",
}));

export const GoalInput = styled("input")(({ theme }) => ({
    width: 90,
    borderRadius: 10,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    outline: "none",
    textAlign: "center",
}));

export const GoalButton = styled("button")(({ theme }) => ({
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
}));

export const GoalHint = styled("p")(({ theme }) => ({
    marginTop: 0,
    marginBottom: 12,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.95rem",
}));

