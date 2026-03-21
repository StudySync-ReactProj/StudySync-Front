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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const OptionsStep = ({
    formData,
    availableSlots,
    onToggleSlot,
    isLoadingBusyData,
    isCalculatingSlots,
    hasCalculatedSlots,
    hasBusyData,
    onFindAvailableTimes
}) => {
    return (
        <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
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

            {!isLoadingBusyData && !hasBusyData && !isCalculatingSlots && (
                <Alert severity="info" sx={{ mb: 1.5 }}>
                    Add participants to start finding available times
                </Alert>
            )}

            {/* Recommended Times List - Fixed height with scroll */}
            {hasCalculatedSlots && availableSlots.length > 0 && !isCalculatingSlots && (
                <>
                    <List sx={{
                        width: '100%',
                        bgcolor: (theme) => theme.palette.background.paper,
                        color: (theme) => theme.palette.text.primary,
                        maxHeight: '450px',
                        overflow: 'auto',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: (theme) => theme.palette.divider,
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: (theme) => theme.palette.text.disabled,
                        },
                    }}>
                        {availableSlots.map((slot, index, array) => {
                            const isSelected = formData.selectedSlots.some(s => s.id === slot.id);

                            // Detect gap between this slot and the next slot
                            const nextSlot = array[index + 1];
                            let hasGap = false;
                            let isDayChange = false;

                            if (nextSlot) {
                                const currentEnd = new Date(slot.endDateTime);
                                const nextStart = new Date(nextSlot.startDateTime);

                                // If the next slot starts strictly after the current slot ends, there is a gap
                                if (nextStart.getTime() > currentEnd.getTime()) {
                                    hasGap = true;
                                    // Check if the day actually changed
                                    if (currentEnd.toDateString() !== nextStart.toDateString()) {
                                        isDayChange = true;
                                    }
                                }
                            }

                            return (
                                <React.Fragment key={slot.id}>
                                    <ListItem
                                        disablePadding
                                        sx={{
                                            borderBottom: hasGap ? 0 : 1,
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
                                                color: 'text.primary',
                                                bgcolor: isSelected ? 'action.selected' : 'inherit',
                                                '&:hover': {
                                                    bgcolor: 'action.hover'
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
                                                    icon={
                                                        <CheckBoxOutlineBlankIcon
                                                            sx={{
                                                                color: (theme) =>
                                                                    theme.palette.mode === "dark"
                                                                        ? "rgba(255,255,255,0.70)"
                                                                        : theme.palette.text.secondary
                                                            }}
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <CheckBoxIcon
                                                            sx={{
                                                                color: (theme) =>
                                                                    theme.palette.mode === "dark"
                                                                        ? theme.palette.primary.light
                                                                        : theme.palette.primary.main
                                                            }}
                                                        />
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight={500} color="text.primary">
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

                                    {/* Gap indicator - different styles for day changes vs intra-day gaps */}
                                    {hasGap && (
                                        <Box
                                            sx={{
                                                height: isDayChange ? '4px' : '2px',
                                                backgroundColor: isDayChange ? '#64748B' : '#94A3B8', // Dark slate for day change, solid gray for intra-day
                                                my: 2,
                                                mx: 2,
                                                borderRadius: '2px',
                                                opacity: 1,
                                                border: 'none' // Ensure there are no dashed borders overriding the background
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </>
            )}
        </Box>
    );
};

export default OptionsStep;