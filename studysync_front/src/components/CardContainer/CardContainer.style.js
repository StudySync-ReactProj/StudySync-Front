import { styled } from "@mui/material/styles";

export const CardContainer = styled("div")({
    display: "grid",
    gridTemplateColumns: "648px 648px",
    columnGap: "40px",
    rowGap: "40px",
    justifyContent: "center",
    marginTop: "40px",
});

/* size for each card*/
// clock
export const TimeBox = styled("div")({
    width: "648px",
    height: "189px",
});

// Today's tasks
export const TasksBox = styled("div")({
    width: "648px",
    height: "416px",
    gridRow: "1 / span 2",
    gridColumn: "2 / 3",
});

// Daily prog
export const DailyBox = styled("div")({
    width: "648px",
    height: "189px",
});

// weekly prog
export const WeeklyBox = styled("div")({
    width: "648px",
    height: "416px",
});

// upcoming sessions
export const SessionsBox = styled("div")({
    width: "648px",
    height: "416px",
});

// deadlines
export const DeadlinesBox = styled("div")({
    width: "1336px",
    height: "369px",
    gridColumn: "1 / span 2",
});

export const CardHeading = styled("h3")(({ theme }) => ({
    marginBottom: "20px",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: "1.2rem",
    fontWeight: 600,
}));

export const CardList = styled("ul")(({ theme }) => ({
    paddingLeft: "18px",
    listStyleType: "disc",

    "& li": {
        marginBottom: "10px",
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        lineHeight: 1.5,
    },
}));

