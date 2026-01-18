import { styled } from "@mui/material/styles";

// outer card (whole component)
export const WeeklyWrapper = styled("div")(() => ({
    borderRadius: "20px",
}));

export const WeeklyTopRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));
// Big inner card
export const ChartWrapper = styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    background: themeMode === 'dark' ? '#1e1e1e' : '#F6F7FB',
    border: `1px solid ${themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(27,43,97,0.08)'}`,
    borderRadius: "22px",
}));

// Legend row inside the chart wrapper
export const LegendRow = styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    display: "flex",
    alignItems: "center",
    gap: "22px",
    paddingBottom: "14px",
    borderBottom: `1px solid ${themeMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(27,43,97,0.06)'}`,
}));

export const LegendItem = styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "16px",
    marginTop: "10px",
    color: themeMode === 'dark' ? '#ffffff' : '#000000',
}));

export const LegendSwatch = styled("span", {
    shouldForwardProp: (prop) => prop !== "variant" && prop !== "themeMode",
})(({ variant, themeMode }) => ({
    width: "17px",
    height: "17px",
    marginLeft: "25px",
    borderRadius: "5px",
    display: "inline-block",
    backgroundColor: variant === "goal" 
        ? (themeMode === 'dark' ? '#9f93ff' : '#6D63FF')
        : (themeMode === 'dark' ? '#5f54a8' : '#CFCBFF'),
}));

// Inner chart area (the rounded box with bars)
export const InnerChart = styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    marginTop: "16px",
    border: `1px solid ${themeMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(27,43,97,0.06)'}`,
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
    shouldForwardProp: (prop) => prop !== "value" && prop !== "themeMode",
})(({ value, themeMode }) => ({
    position: "absolute",
    left: "0px",
    bottom: "0px",
    width: "100%",
    height: `${value}%`,
    borderRadius: "10px",
    backgroundColor: themeMode === 'dark' ? '#5f54a8CC' : '#E9E5FFCC',
    zIndex: 2,
    transition: "height 700ms ease",
}));

export const GoalBar = styled("div", {
    shouldForwardProp: (prop) => prop !== "value" && prop !== "offset" && prop !== "themeMode",
})(({ value, themeMode }) => ({
    position: "absolute",
    left: "0px",
    bottom: "0px",
    width: "100%",
    height: `${value}%`,
    borderRadius: "10px",
    backgroundColor: themeMode === 'dark' ? '#9f93ff' : '#7A6FF0',
    zIndex: 1,
    transition: "height 700ms ease",
}));


export const DayLabel = styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    color: themeMode === 'dark' ? '#b0b0b0' : '#8B8A8A',
    fontFamily: "Plus Jakarta Sans",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
}));