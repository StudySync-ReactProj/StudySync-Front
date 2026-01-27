import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

// Optional styled components for additional customization

export const StyledModalBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '400px',
}));

export const StepIndicator = styled(Box)(({ theme, active }) => ({
  width: 40,
  height: 4,
  borderRadius: 2,
  backgroundColor: active ? theme.palette.primary.main : theme.palette.divider,
  transition: 'all 0.3s ease',
}));

export const TimeSlotCard = styled(Box)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ParticipantCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
}));

export const RoundedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  padding: theme.spacing(1, 3),
}));
