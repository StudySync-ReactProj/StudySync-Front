export const SlotGridSx = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 1,
  maxHeight: '300px',
  overflowY: 'auto',
};

export const SlotButtonSx = (theme, isSelected) => ({
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '10px 16px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  ...(isSelected && {
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 0 8px rgba(206, 147, 216, 0.4)'
      : '0 0 8px rgba(126, 87, 194, 0.3)',
  }),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(206, 147, 216, 0.12)'
      : 'rgba(126, 87, 194, 0.08)',
  },
});
