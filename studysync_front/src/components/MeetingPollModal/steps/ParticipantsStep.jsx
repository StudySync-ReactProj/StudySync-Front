import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton,
    Paper,
    InputAdornment,
    Stack
} from '@mui/material';
import { 
    Delete as DeleteIcon, 
    PersonAdd as AddIcon,
    Email as EmailIcon 
} from '@mui/icons-material';

const ParticipantsStep = ({ 
    formData, 
    onAddParticipant, 
    onRemoveParticipant,
    updateForm
}) => {
    const [emailInput, setEmailInput] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const handleAdd = () => {
        if (!emailInput) {
            setError('Please enter an email address');
            return;
        }
        if (!validateEmail(emailInput)) {
            setError('Please enter a valid email address');
            return;
        }

        onAddParticipant({
            id: Date.now().toString(),
            email: emailInput,
            name: emailInput.split('@')[0]
        });

        setEmailInput('');
        setError('');
    };

    return (
        <Box sx={{ mt: 1.5 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Participants
            </Typography>

            {/* Duration inputs in one row */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                    label="Hours"
                    type="number"
                    size="small"
                    value={formData.hours}
                    onChange={(e) => updateForm('hours', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: 23 } }}
                    sx={{ width: '50%' }}
                />
                <TextField
                    label="Minutes"
                    type="number"
                    size="small"
                    value={formData.minutes}
                    onChange={(e) => updateForm('minutes', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: 59, step: 15 } }}
                    sx={{ width: '50%' }}
                />
            </Stack>
            
            {/* Input Row: Email field and Assign button on same line */}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField
                    fullWidth
                    label="Email address"
                    variant="outlined"
                    size="small"
                    value={emailInput}
                    onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (error) setError('');
                    }}
                    error={!!error}
                    helperText={error}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Button 
                    variant="contained" 
                    onClick={handleAdd}
                    size="small"
                    sx={{ minWidth: '90px', whiteSpace: 'nowrap' }}
                >
                    Assign
                </Button>
            </Stack>

            {/* Selected Participants List - Dense and compact */}
            {formData.participants.length > 0 && (
                <Paper variant="outlined" sx={{ mt: 1, maxHeight: 150, overflow: 'auto' }}>
                    <List dense disablePadding>
                        {formData.participants.map((participant) => (
                            <ListItem
                                key={participant.id}
                                sx={{ py: 0.5 }}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        size="small"
                                        onClick={() => onRemoveParticipant(participant.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemText 
                                    primary={participant.email} 
                                    primaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default ParticipantsStep;