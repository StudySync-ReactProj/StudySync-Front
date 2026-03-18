import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { useAvailableSlots } from '../../hooks/useAvailableSlots';
import { SlotButtonSx, SlotGridSx } from './AvailabilityModal.style';

const AvailabilityModal = ({
  open,
  onClose,
  selectedDate,
  estimatedMinutes,
  onSlotSelect,
}) => {
  const theme = useTheme();
  const { slots, loading, error, fetchSlots } = useAvailableSlots();
  const [selectedSlot, setSelectedSlot] = React.useState(null);

  useEffect(() => {
    if (open && selectedDate && estimatedMinutes > 0) {
      const dateObj = new Date(selectedDate);
      const dateString = dateObj.toISOString().split('T')[0];
      fetchSlots(dateString, estimatedMinutes);
    }
  }, [open, selectedDate, estimatedMinutes, fetchSlots]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      const startDate = new Date(selectedSlot.start);
      const localDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      const datetimeLocalValue = localDate.toISOString().slice(0, 16);
      onSlotSelect(datetimeLocalValue);
      setSelectedSlot(null);
      onClose();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Available Time Slot</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && !loading && (
            <Alert severity="error">{error}</Alert>
          )}

          {!loading && !error && slots.length === 0 && (
            <Alert severity="info">
              No available slots found for the selected date and duration.
            </Alert>
          )}

          {!loading && slots.length > 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                Available slots ({slots.length}):
              </Typography>
              <Stack spacing={1} sx={SlotGridSx}>
                {slots.map((slot, idx) => (
                  <Button
                    key={idx}
                    variant={selectedSlot === slot ? 'contained' : 'outlined'}
                    color={selectedSlot === slot ? 'primary' : 'inherit'}
                    onClick={() => handleSelectSlot(slot)}
                    sx={SlotButtonSx(theme, selectedSlot === slot)}
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedSlot || loading}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvailabilityModal;
