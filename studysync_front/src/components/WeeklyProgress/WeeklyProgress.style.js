import { styled } from "@mui/material/styles";

/* ===== Outer card (whole component) ===== */
export const WeeklyWrapper = styled("div")(() => ({
    borderRadius: "20px",
}));

export const WeeklyTopRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));

/* ===== Big inner card ===== */
export const ChartWrapper = styled("div")(() => ({
    background: "#F6F7FB",
    border: "1px solid rgba(27,43,97,0.08)",
    borderRadius: "22px",
}));

/* ===== Legend row inside the chart wrapper ===== */
export const LegendRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: "22px",
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(27,43,97,0.06)",
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

/* ===== Inner chart area (the rounded box with bars) ===== */
export const InnerChart = styled("div")(() => ({
    marginTop: "16px",
    border: "1px solid rgba(27,43,97,0.06)",
    borderRadius: "24px",
    padding: "26px 22px 20px",
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


export const DayLabel = styled("div")(() => ({
    color: "#8B8A8A",
    fontFamily: "Plus Jakarta Sans",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
}));