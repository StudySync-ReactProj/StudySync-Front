// src/components/AddTaskForm/AddTaskForm.style.js

export const AddTaskFormContainer = (theme) => ({
  mb: 3,
  p: 2,

  bgcolor: theme.palette.background.paper,
  color: theme.palette.text.primary,

  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,

  boxShadow: theme.palette.mode === "dark" ? "none" : "0 8px 24px rgba(0,0,0,0.06)",
});

export const PriorityFormControl = {
  minWidth: 150,
};

export const RowStack = {
  direction: "row",
  spacing: 2,
};

export const ButtonsRowStack = {
  direction: "row",
  spacing: 2,
};
