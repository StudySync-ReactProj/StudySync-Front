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

// New styling for scheduling preview and container
export const SchedulingBox = (theme) => ({
  border: `1px dashed ${theme.palette.divider}`,
  p: 2,
  borderRadius: 1,
  mt: 1,
  bgcolor: theme.palette.background.default,
});

export const SchedulingInnerSx = { mt: 1 };

export const PreviewText = {
  color: '#555',
  fontSize: '0.9rem'
};

export const StartFieldSx = { mt: 0 };

export const AccessTimeIconSx = { mr: 1, fontSize: 18 };

export const ButtonsSx = { mt: 1 };
