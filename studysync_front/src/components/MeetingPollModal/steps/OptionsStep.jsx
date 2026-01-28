import React from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Checkbox, 
    CircularProgress,
    Alert,
    Chip,
    Button
} from '@mui/material';
import { CheckCircle as AvailableIcon, Search as SearchIcon } from '@mui/icons-material';

const OptionsStep = ({ 
    formData, 
    availableSlots, 
    onToggleSlot,
    isLoadingBusyData,
    isCalculatingSlots,
    hasCalculatedSlots,
    hasBusyData,
    alert,
    onFindAvailableTimes
}) => {
    return (
        <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Scheduling Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Find the best times when all participants are available.
            </Typography>

            {/* Loading indicator for fetching busy data */}
            {isLoadingBusyData && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="primary">
                        Syncing with Google Calendar...
                    </Typography>
                </Box>
            )}

            {/* Find Available Times Button - Compact */}
            {!isLoadingBusyData && hasBusyData && !hasCalculatedSlots && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="medium"
                        startIcon={<SearchIcon />}
                        onClick={onFindAvailableTimes}
                        sx={{ 
                            px: 3, 
                            py: 1,
                            textTransform: 'none',
                            fontSize: '0.875rem'
                        }}
                    >
                        Find Available Times
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                        Analyze calendars for mutual free time
                    </Typography>
                </Box>
            )}

            {/* Loading indicator while calculating slots - Compact */}
            {isCalculatingSlots && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 1.5, 
                    py: 4 
                }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="primary">
                        Analyzing calendars...
                    </Typography>
                </Box>
            )}

            {alert && !isCalculatingSlots && <Alert severity="warning" sx={{ mb: 1.5 }}>{alert}</Alert>}

            {!isLoadingBusyData && !hasBusyData && !isCalculatingSlots && (
                <Alert severity="info" sx={{ mb: 1.5 }}>
                    Add participants to start finding available times
                </Alert>
            )}

            {/* Recommended Times List - Fixed height with scroll */}
            {hasCalculatedSlots && availableSlots.length > 0 && !isCalculatingSlots && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="success.main">
                            Recommended Times ({availableSlots.length})
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<SearchIcon fontSize="small" />}
                            onClick={onFindAvailableTimes}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                            Refresh
                        </Button>
                    </Box>
                    
                    <List sx={{ 
                        width: '100%', 
                        bgcolor: 'background.paper', 
                        maxHeight: '450px', 
                        overflow: 'auto',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                        },
                    }}>
                        {availableSlots.map((slot) => {
                            const isSelected = formData.selectedSlots.some(s => s.id === slot.id);

                            return (
                                <ListItem
                                    key={slot.id}
                                    disablePadding
                                    sx={{ 
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        '&:last-child': {
                                            borderBottom: 0
                                        }
                                    }}
                                >
                                    <ListItemButton 
                                        onClick={() => onToggleSlot(slot)}
                                        dense
                                        sx={{
                                            py: 0.75,
                                            bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                                            '&:hover': {
                                                bgcolor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={isSelected}
                                                tabIndex={-1}
                                                disableRipple
                                                size="small"
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" fontWeight={500}>
                                                    {slot.date}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    {slot.time}
                                                </Typography>
                                            }
                                        />
                                        
                                        {/* All recommended slots are pre-verified as available */}
                                        <Chip 
                                            icon={<AvailableIcon fontSize="small" />} 
                                            label="Available" 
                                            color="success" 
                                            variant="outlined" 
                                            size="small"
                                            sx={{ fontSize: '0.7rem', height: '24px' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}
        </Box>
    );
};

export default OptionsStep;