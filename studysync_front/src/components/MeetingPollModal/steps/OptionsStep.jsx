import {
  Stack,
  Typography,
  Box,
  Checkbox,
} from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import ButtonCont from '../../ButtonCont/ButtonCont';

export default function OptionsStep({
  formData,
  availableSlots,
  onToggleSlot,
  onSchedule,
  onBack,
}) {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={600} color="primary.main">
        Available Time Slots
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Select one or more time slots that work for your meeting
      </Typography>

      <Stack spacing={1.5}>
        {availableSlots.map((slot) => (
          <Box
            key={slot.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: formData.selectedSlots.includes(slot.id)
                ? 'primary.main'
                : 'divider',
              bgcolor: formData.selectedSlots.includes(slot.id)
                ? 'primary.light'
                : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => onToggleSlot(slot.id)}
          >
            <Checkbox
              checked={formData.selectedSlots.includes(slot.id)}
              onChange={() => onToggleSlot(slot.id)}
              sx={{ mr: 2 }}
            />
            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
              <AccessTimeIcon color="action" />
              <Typography fontWeight={500}>
                {slot.date} — {slot.time}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
        <ButtonCont
          text="Back"
          variant="outlined"
          onClick={onBack}
        />
        <ButtonCont
          text="Schedule Meeting"
          onClick={onSchedule}
          disabled={formData.selectedSlots.length === 0}
        />
      </Stack>
    </Stack>
  );
}
