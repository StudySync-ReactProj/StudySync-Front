import {
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import TextFieldComp from '../../TextFieldComp/TextFieldComp';
import ButtonCont from '../../ButtonCont/ButtonCont';

export default function ParticipantsStep({
  formData,
  updateForm,
  onNext,
  onBack,
  onAddParticipant,
  onRemoveParticipant,
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddParticipant();
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h5" fontWeight={600} color="primary.main">
        Duration & Participants
      </Typography>

      <Box>
        <Typography variant="subtitle1" fontWeight={500} mb={1.5}>
          Duration
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextFieldComp
            inputLabel="Hours"
            inputName="hours"
            inputValue={formData.hours}
            handleIChange={(e) => updateForm('hours', e.target.value)}
            type="number"
            inputProps={{ min: 0, max: 12 }}
            sx={{ width: '120px' }}
          />
          <TextFieldComp
            inputLabel="Minutes"
            inputName="minutes"
            inputValue={formData.minutes}
            handleIChange={(e) => updateForm('minutes', e.target.value)}
            type="number"
            inputProps={{ min: 0, max: 59 }}
            sx={{ width: '120px' }}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={500} mb={1.5}>
          Time Range
        </Typography>
        <ToggleButtonGroup
          value={formData.timeRange}
          exclusive
          onChange={(e, value) => value && updateForm('timeRange', value)}
          fullWidth
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            '& .MuiToggleButton-root': {
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
            },
          }}
        >
          <ToggleButton value="this-week">This Week</ToggleButton>
          <ToggleButton value="next-week">Next Week</ToggleButton>
          <ToggleButton value="this-month">This Month</ToggleButton>
          <ToggleButton value="next-month">Next Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={500} mb={1.5}>
          Participants
        </Typography>
        <Stack direction="column" spacing={1} mb={2}>
          <Box sx={{ flex: 1 }}>
            <TextFieldComp
              inputName="participantInput"
              inputValue={formData.participantInput}
              handleIChange={(e) => updateForm('participantInput', e.target.value)}
              placeholder="Enter an email"
              onKeyPress={handleKeyPress}
            />
          </Box>
          <ButtonCont
            text="Assign"
            onClick={onAddParticipant}
            sx={{ minWidth: '100px' }}
          />
        </Stack>

        {formData.participants.length > 0 && (
          <Stack spacing={1}>
            {formData.participants.map((participant) => (
              <Box
                key={participant.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {participant.avatar}
                  </Avatar>
                  <Typography>{participant.name}</Typography>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => onRemoveParticipant(participant.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
        <ButtonCont
          text="Back"
          variant="outlined"
          onClick={onBack}
        />
        <ButtonCont
          text="Find Available Times"
          onClick={onNext}
          disabled={formData.participants.length === 0}
        />
      </Stack>
    </Stack>
  );
}
