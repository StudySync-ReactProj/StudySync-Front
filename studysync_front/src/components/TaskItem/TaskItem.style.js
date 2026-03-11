// src/components/TaskItem/TaskItem.style.js

export const containerSx = (isCompleted, theme) => ({
    marginBottom: '12px',
    padding: 2,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: isCompleted ? 'line-through' : 'none',
    color: isCompleted ? theme.palette.text.disabled : theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
});

export const leftSectionSx = { display: 'flex', flexDirection: 'column' };

export const metaRowSx = { display: 'flex', alignItems: 'center', gap: 1, color: '#555', marginTop: 0.5 };

export const deleteButtonSx = { color: 'error.main', cursor: 'pointer', border: 'none', background: 'transparent' };

export const iconSx = { fontSize: 16 };
export const deleteTextSx = { color: 'error.main' };
