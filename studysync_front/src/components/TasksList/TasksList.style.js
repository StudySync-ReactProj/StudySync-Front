import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

/** Main container that holds the list of cards */
export const TasksWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "50%",
  margin: "20px 0",
}));

/** Individual card styling */
export const StyledTaskCard = styled(Paper)(({ theme }) => ({
  padding: "16px 24px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  border: "1px solid #E2E8F0",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)",
  },
}));

/** Priority Badge */
export const PriorityBadge = styled(Box)(({ priority }) => {
  const colors = {
    critical: { bg: "#F5F3FF", text: "#5B21B6" }, // Deep purple (looks premium and urgent)
    high: { bg: "#E0F2FE", text: "#0369A1" }, // Strong sea blue
    medium: { bg: "#F0FDF4", text: "#166534" }, // Dark green
    low: { bg: "#F8FAFC", text: "#475569" }, // Steel gray (neutral)
  };
  const config = colors[priority?.toLowerCase()] || colors.low;
  return {
    backgroundColor: config.bg,
    color: config.text,
    padding: "2px 10px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    textTransform: "capitalize",
  };
});