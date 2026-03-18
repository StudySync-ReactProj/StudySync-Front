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

// Dark mode button styling for Save/Update button
export const SaveButtonSx = (theme) => ({
  ...(theme.palette.mode === 'dark' && {
    bgcolor: '#5E35B1',
    color: '#F3E5F5',
    border: 'none',
    '&:hover': {
      bgcolor: '#7E57C2',
      color: '#F3E5F5',
    },
    '&:disabled': {
      bgcolor: '#3F2C70',
      color: '#9575CD',
    },
  }),
  ...(theme.palette.mode === 'light' && {
    '&:disabled': {
      opacity: 0.6,
    },
  }),
});

// Dark mode button styling for Cancel button (outlined)
export const CancelButtonSx = (theme) => ({
  ...(theme.palette.mode === 'dark' && {
    borderColor: '#B39DDB',
    color: '#E1BEE7',
    '&:hover': {
      bgcolor: 'rgba(179, 157, 219, 0.08)',
      borderColor: '#CE93D8',
      color: '#F3E5F5',
    },
    '&:disabled': {
      borderColor: '#6A4C93',
      color: '#6A4C93',
    },
  }),
  ...(theme.palette.mode === 'light' && {
    '&:disabled': {
      opacity: 0.6,
    },
  }),
});
