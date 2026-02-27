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
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  // reduced padding so legend sits closer to the title above
  padding: "12px",
}));

// Legend row inside the chart wrapper
export const LegendRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "16px",
  // bring legend closer to title
  marginBottom: "6px",
  color: theme.palette.text.secondary,
}));

export const LegendItem = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "16px",
  marginTop: "2px",
}));

export const LegendSwatch = styled("span")(({ variant }) => ({
  width: "17px",
  height: "17px",
  marginLeft: "25px",
  borderRadius: "5px",
  display: "inline-block",
  backgroundColor: variant === "goal" ? "#6D63FF" : "#CFCBFF",
}));

// Container for Y-axis labels and chart area
export const ChartContainer = styled("div")(() => ({
  display: "flex",
  gap: "12px",
  marginTop: "50px",
}));

// Y-axis labels (hours: 10, 8, 6, 4, 2, 0)
export const YAxisLabels = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-end",
  minWidth: "35px",
  paddingRight: "8px",
  fontSize: "12px",
  color: theme.palette.text.secondary,
  fontWeight: 500,
  height: "200px",
}));

export const YAxisLabel = styled("span")(() => ({
  height: "1px", // minimal height, flex justifies spacing
  display: "flex",
  alignItems: "center",
}));

// Inner chart area (the rounded box with bars and grid)
export const InnerChart = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "14px",
  padding: "16px",
  position: "relative",
  flex: 1,
}));

// Grid lines container (absolutely positioned behind bars)
export const GridContainer = styled("div")(() => ({
  position: "absolute",
  top: "0",
  left: "0t",
  right: "0",
  bottom: "0",
  pointerEvents: "none",
  borderRadius: "14px",
  overflow: "hidden",
}));

// Individual grid line
export const GridLine = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "0",
  right: "0",
  height: "1px",
  backgroundColor: theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.08)",
  zIndex: 1,
}));

// Bars row container (positioned relative to overlay on grid)
export const BarsRow = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "28px",
  position: "relative",
  zIndex: 2,
  height: "200px",
}));

export const DayCol = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  flex: "1",
}));

/* ===== Bars ===== */
export const BarStack = styled("div")(() => ({
  position: "relative",
  width: "24px",
  height: "200px",
  borderRadius: "999px",
  overflow: "visible",
  background: "transparent",
}));

// Studied bar - dark purple, scaled to actual time
export const StudiedBar = styled("div", {
  shouldForwardProp: (prop) => prop !== "heightPercent",
})(({ heightPercent }) => ({
  position: "absolute",
  left: "0px",
  bottom: "0px",
  width: "100%",
  height: `${heightPercent}%`,
  borderRadius: "10px",
  backgroundColor: "#7A6FF0",
  zIndex: 2,
  transition: "height 700ms ease",
}));

// Goal bar - light purple, scaled to day's specific goal
export const GoalBar = styled("div", {
  shouldForwardProp: (prop) => prop !== "heightPercent",
})(({ heightPercent }) => ({
  position: "absolute",
  left: "0px",
  bottom: "0px",
  width: "100%",
  height: `${heightPercent}%`,
  borderRadius: "10px",
  backgroundColor: "#E9E5FF",
  zIndex: 1,
  transition: "height 700ms ease",
  opacity: 0.7,
}));

export const DayLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "isToday",
})(({ theme, isToday }) => ({
  marginTop: "8px",
  fontSize: "12px",
  color: isToday ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: isToday ? 700 : 400,
}));