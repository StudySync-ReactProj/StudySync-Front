import { styled } from "@mui/material/styles";

export const CardContainer = styled("div")({
    display: "grid",
    gridTemplateColumns: "600px 600px",
    columnGap: "40px",
    rowGap: "40px",
    justifyContent: "center",
    marginTop: "40px",
});

/* size for each card*/
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

// upcoming sessions
export const DeadlinesBox = styled("div")({
    width: "600px",
    height: "400px",
});

// deadlines
// export const DeadlinesBox = styled("div")({
//     width: "1336px",
//     height: "369px",
//     gridColumn: "1 / span 2",
// });

export const CardHeading = styled("h3")(({ theme }) => ({
    marginBottom: "15px",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: "1.5rem",
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

