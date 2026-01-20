import { styled } from "@mui/material/styles";

// outer card (whole component)
export const WeeklyWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "20px",
  color: theme.palette.text.primary,
  marginTop: "-10px"
}));

export const WeeklyTopRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));
// Big inner card
export const ChartWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: "16px",
  padding: "16px",
}));

// Legend row inside the chart wrapper
export const LegendRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "16px",
  marginBottom: "12px",
  color: theme.palette.text.secondary,
}));

export const LegendItem = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "16px",
    marginTop: "10px",
}));

export const LegendSwatch = styled("span")(({ variant }) => ({
    width: "17px",
    height: "17px",
    marginLeft: "25px",
    borderRadius: "5px",
    display: "inline-block",
    backgroundColor: variant === "goal" ? "#6D63FF" : "#CFCBFF",
}));

// Inner chart area (the rounded box with bars)
export const InnerChart = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "14px",
  padding: "16px",
}));

export const BarsRow = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "28px",
}));

export const DayCol = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    flex: "1px",
}));

/* ===== Bars ===== */
export const BarStack = styled("div")(() => ({
    position: "relative",
    width: "24px",
    height: "170px",
    borderRadius: "999px",
    overflow: "hidden",
    background: "transparent",
}));

export const StudiedBar = styled("div", {
    shouldForwardProp: (prop) => prop !== "value",
})(({ value }) => ({
    position: "absolute",
    left: "0px",
    bottom: "0px",
    width: "100%",
    height: `${value}%`,
    borderRadius: "10px",
    backgroundColor: "#E9E5FFCC",
    zIndex: 2,
    transition: "height 700ms ease",
}));

export const GoalBar = styled("div", {
    shouldForwardProp: (prop) => prop !== "value" && prop !== "offset",
})(({ value }) => ({
    position: "absolute",
    left: "0px",
    bottom: "0px",
    width: "100%",
    height: `${value}%`,
    borderRadius: "10px",
    backgroundColor: "#7A6FF0",
    zIndex: 1,
    transition: "height 700ms ease",
}));


export const DayLabel = styled("span")(({ theme }) => ({
  marginTop: "8px",
  fontSize: "12px",
  color: theme.palette.text.secondary,
}));