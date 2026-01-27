// src/pages/CalendarSync/steps/ParticipantsStep.jsx

import { useEffect, useState } from "react"; // Added useEffect & useState
import API from "../../../api/axiosConfig"; // Import your API instance
import {
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import { Close as CloseIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
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
  // ========== NEW: CONTACTS STATE & FETCHING ==========
  const [savedContacts, setSavedContacts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const { data } = await API.get('/users/contacts');
        setSavedContacts(data);
      } catch (err) {
        console.error("Failed to load contacts", err);
      }
    };
    loadContacts();
  }, []);

  // Filter contacts based on what the user is typing
  const filteredContacts = savedContacts.filter(contact =>
    contact.email.toLowerCase().includes(formData.participantInput.toLowerCase()) ||
    contact.name.toLowerCase().includes(formData.participantInput.toLowerCase())
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddParticipant();
      setShowSuggestions(false);
    }
  };

  const selectContact = (contact) => {
    updateForm('participantInput', contact.email);
    setShowSuggestions(false);
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h5" fontWeight={600} color="primary.main">
        Duration & Participants
      </Typography>

      {/* Duration Section */}
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

      {/* Time Range Section */}
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

      {/* Participants Section with Suggestions */}
      <Box sx={{ position: 'relative' }}>
        <Typography variant="subtitle1" fontWeight={500} mb={1.5}>
          Participants
        </Typography>
        <Stack direction="column" spacing={1} mb={2}>
          <Box sx={{ flex: 1 }}>
            <TextFieldComp
              inputName="participantInput"
              inputValue={formData.participantInput}
              handleIChange={(e) => {
                updateForm('participantInput', e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Enter an email or name"
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
            />
          </Box>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && formData.participantInput && filteredContacts.length > 0 && (
            <Paper sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 10, 
              maxHeight: 200, 
              overflow: 'auto',
              mt: -1.5
            }}>
              <List>
                {filteredContacts.map((contact) => (
                  <ListItem 
                    button 
                    key={contact.email} 
                    onClick={() => selectContact(contact)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{contact.avatar || contact.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={contact.name} secondary={contact.email} />
                    <PersonAddIcon color="action" />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <ButtonCont
            text="Assign"
            onClick={() => {
              onAddParticipant();
              setShowSuggestions(false);
            }}
            sx={{ minWidth: '100px' }}
          />
        </Stack>

        {/* Selected Participants List */}
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