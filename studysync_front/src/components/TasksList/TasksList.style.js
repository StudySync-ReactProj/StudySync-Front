import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

/** Main container that holds the list of cards */
export const TasksWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  margin: "20px 0 0",
}));

/** Individual card styling */
export const StyledTaskCard = styled(Paper)(() => ({
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

// Additional style helpers to avoid inline sx objects in TasksList.jsx
export const titleTypographySx = (isCompleted) => ({
  fontWeight: 600,
  color: 'text.primary',
  textDecoration: isCompleted ? 'line-through' : 'none',
  opacity: isCompleted ? 0.6 : 1
});

export const metaRowSx = {
  mt: 0.5,
  color: 'text.secondary',
  display: 'flex',
  gap: 2,
  alignItems: 'center'
};

export const smallIconSx = { fontSize: 14 };

export const formControlSx = { minWidth: 120 };

export const selectSx = {
  fontSize: '0.75rem',
  height: '24px',
  '& .MuiSelect-select': { py: 0 }
};

export const dueStackSx = { display: 'flex', alignItems: 'center', gap: 0.5 };

export const taskCardInnerSx = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

export const deleteButtonSx = { color: 'error.main' };