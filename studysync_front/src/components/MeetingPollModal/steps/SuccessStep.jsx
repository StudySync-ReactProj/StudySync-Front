import {
  Stack,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import ButtonCont from '../../ButtonCont/ButtonCont';

export default function SuccessStep({
  formData,
  availableSlots,
  onSendInvitations,
}) {
  return (
    <Stack spacing={3} alignItems="center" py={4}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />

      <Typography variant="h5" fontWeight={600} textAlign="center">
        Meeting Scheduled Successfully!
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center">
        Your meeting "{formData.title}" has been scheduled. Invitations are ready to be
        sent to all participants.
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="subtitle2" fontWeight={500} mb={1}>
          Selected Time Slots:
        </Typography>
        <Stack spacing={1}>
          {formData.selectedSlots.map((slotId) => {
            const slot = availableSlots.find((s) => s.id === slotId);
            return (
              <Chip
                key={slotId}
                label={`${slot.date} — ${slot.time}`}
                color="primary"
                variant="outlined"
              />
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="subtitle2" fontWeight={500} mb={1}>
          Participants: ({formData.participants.length})
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {formData.participants.map((participant) => (
            <Chip
              key={participant.id}
              avatar={<Avatar>{participant.avatar}</Avatar>}
              label={participant.name}
              size="small"
            />
          ))}
        </Stack>
      </Box>

      <ButtonCont
        text="Send Invitations"
        onClick={onSendInvitations}
        sx={{ mt: 3, px: 4 }}
      />
    </Stack>
  );
}
