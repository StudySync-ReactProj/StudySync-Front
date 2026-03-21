import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    IconButton,
    Paper,
    Typography,
    Button,
    Checkbox,
    Chip,
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, EditCalendar as EditCalendarIcon } from '@mui/icons-material';
import { createEventAsync } from '../../store/eventsSlice';
import { fetchFreeBusyData } from '../../services/googleCalendarService';
import { useNotification } from '../../context/NotificationContext.jsx';

import DetailsStep from './steps/DetailsStep';
import ParticipantsStep from './steps/ParticipantsStep';
import OptionsStep from './steps/OptionsStep';
import ButtonCont from '../ButtonCont/ButtonCont';

const parseDateTimeValue = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'object') {
        const nestedValue = value.dateTime || value.date;
        if (!nestedValue) return null;
        const nestedDate = new Date(nestedValue);
        return Number.isNaN(nestedDate.getTime()) ? null : nestedDate;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getEventStartDate = (event) => {
    if (!event) return null;
    return parseDateTimeValue(event.start) || parseDateTimeValue(event.startDateTime);
};

const getEventEndDate = (event) => {
    if (!event) return null;
    return parseDateTimeValue(event.end) || parseDateTimeValue(event.endDateTime);
};

const normalizeParticipants = (participants = []) => participants
    .map((participant) => ({
        email: participant?.email || '',
        name: participant?.name || '',
        id: participant?.id || participant?.email || ''
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

const getSlotSignature = (slot) => {
    if (!slot || typeof slot !== 'object') return '';
    return `${slot.startDateTime || ''}|${slot.endDateTime || ''}|${slot.id || ''}`;
};

export default function MeetingPollModal({ open, onClose, onSubmit, eventToEdit }) {
    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    
    // Correctly access user from Redux store with fallback
    const user = useSelector((state) => state.user.user || state.user);
    
    // Helper function to decode JWT token and extract user ID
    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.id || decodedPayload.userId;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const [isLoadingBusyData, setIsLoadingBusyData] = useState(false);
    const [isCalculatingSlots, setIsCalculatingSlots] = useState(false);
    const [busyData, setBusyData] = useState(null);
    const [smartAvailableSlots, setSmartAvailableSlots] = useState([]);
    const [hasCalculatedSlots, setHasCalculatedSlots] = useState(false);
    const [showAssistant, setShowAssistant] = useState(false);
    const previousDurationRef = useRef(null);
    const initialEditFormRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        locationType: 'online',
        participants: [],
        selectedSlots: [],
        hours: '1',
        minutes: '0'
    });

    const updateForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Pre-fill form when editing an existing event
    useEffect(() => {
        if (open && eventToEdit) {
            console.log('📝 Pre-filling form with event data:', eventToEdit);
            
            // Calculate duration from event if available
            let hours = '1';
            let minutes = '0';
            if (eventToEdit.duration) {
                const totalMinutes = eventToEdit.duration.minutes || 60;
                hours = Math.floor(totalMinutes / 60).toString();
                minutes = (totalMinutes % 60).toString();
            } else {
                // Calculate from start/end times
                const startDate = getEventStartDate(eventToEdit);
                const endDate = getEventEndDate(eventToEdit);
                if (startDate && endDate) {
                    const totalMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
                    hours = Math.floor(totalMinutes / 60).toString();
                    minutes = (totalMinutes % 60).toString();
                }
            }

            // Create a slot object for the event's original time slot
            const originalStartDate = getEventStartDate(eventToEdit);
            const originalEndDate = getEventEndDate(eventToEdit);
            const originalSlot = (originalStartDate && originalEndDate)
                ? {
                    id: originalStartDate.getTime().toString(),
                    date: originalStartDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    time: `${originalStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${originalEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    startDateTime: originalStartDate.toISOString(),
                    endDateTime: originalEndDate.toISOString()
                }
                : null;

            // Ensure participants have an id field for proper removal
            const participantsWithIds = (eventToEdit.participants || []).map(p => ({
                ...p,
                id: p.id || p.email
            }));

            const prefilledForm = {
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                locationType: eventToEdit.locationType || 'online',
                participants: participantsWithIds,
                selectedSlots: originalSlot ? [originalSlot] : [],
                hours,
                minutes
            };

            previousDurationRef.current = `${hours}:${minutes}`;
            initialEditFormRef.current = {
                title: prefilledForm.title.trim(),
                description: prefilledForm.description.trim(),
                locationType: prefilledForm.locationType,
                hours: prefilledForm.hours,
                minutes: prefilledForm.minutes,
                selectedSlotSignature: getSlotSignature(prefilledForm.selectedSlots[0]),
                participants: normalizeParticipants(prefilledForm.participants)
            };

            setFormData(prefilledForm);

            // Also add the original slot to the available slots list
            setSmartAvailableSlots(originalSlot ? [originalSlot] : []);
            setHasCalculatedSlots(true);
            
            // When editing, hide the assistant initially
            setShowAssistant(false);
            
            console.log('🎯 Pre-selected original time slot:', originalSlot);
        } else if (open && !eventToEdit) {
            // When creating a new event, show the assistant
            initialEditFormRef.current = null;
            setShowAssistant(true);
        } else if (!open) {
            // Reset form when modal closes
            setFormData({
                title: '',
                description: '',
                locationType: 'online',
                participants: [],
                selectedSlots: [],
                hours: '1',
                minutes: '0'
            });
            setBusyData(null);
            setSmartAvailableSlots([]);
            setHasCalculatedSlots(false);
            setShowAssistant(false);
            previousDurationRef.current = null;
            initialEditFormRef.current = null;
        }
    }, [open, eventToEdit]);

    const handleClose = () => {
        setBusyData(null);
        setSmartAvailableSlots([]);
        setHasCalculatedSlots(false);
        previousDurationRef.current = null;
        initialEditFormRef.current = null;
        setFormData({
            title: '',
            description: '',
            locationType: 'online',
            participants: [],
            selectedSlots: [],
            hours: '1',
            minutes: '0'
        });
        onClose();
    };

    // Check participant availability using Google Calendar data
    const handleCheckAvailability = async () => {
        // Extract user ID from JWT token or direct property with safe fallback for ID refactor transition
        const currentUserId = user?.id || user?._id || getUserIdFromToken(user?.token);
        console.log('Final User ID:', currentUserId);
        console.log("🔍 Checking availability for user:", currentUserId);
        
        if (!currentUserId || formData.participants.length === 0) {
            console.log("⚠️ Aborting availability check: No user or no participants");
            showNotification({
                title: 'Missing participants',
                message: 'Please add participants to check availability.',
                severity: 'warning',
            });
            return;
        }

        setIsLoadingBusyData(true);
        try {
            const emails = formData.participants
                .map(p => p.email)
                .filter(e => e && e.includes('@'));
            
            const allEmails = [...new Set([user.email, ...emails])];
            console.log("📡 Fetching availability for:", allEmails);

            // Pass the current event ID to exclude it from availability check
            const excludeEventId = eventToEdit?.id || eventToEdit?.event_id || null;
            console.log("🔍 Excluding event from availability check:", excludeEventId);
            const data = await fetchFreeBusyData(currentUserId, allEmails, excludeEventId);
            
            if (data?.calendars) {
                console.log("✅ Busy data received:", data.calendars);
                setBusyData(data.calendars);
                setHasCalculatedSlots(false);
            }
        } catch (err) {
            console.error("❌ Sync error:", err);
            showNotification({
                title: 'Sync failed',
                message: 'Failed to sync calendars.',
                severity: 'error',
            });
        } finally {
            setIsLoadingBusyData(false);
        }
    };

    // הטריגר הקריטי - מאזין לכל שינוי באורך המערך
    useEffect(() => {
        if (open && formData.participants.length > 0) {
            console.log("🔄 Participants array updated. Length:", formData.participants.length);
            handleCheckAvailability();
        }
    }, [formData.participants.length, open]); // האזנה לאורך המערך מבטיחה זיהוי שינוי

    // Reset calculated slots when duration changes so users recalculate with updated duration
    useEffect(() => {
        if (!open) {
            previousDurationRef.current = null;
            return;
        }

        const currentDuration = `${formData.hours}:${formData.minutes}`;

        if (previousDurationRef.current === null) {
            previousDurationRef.current = currentDuration;
            return;
        }

        if (previousDurationRef.current !== currentDuration) {
            setSmartAvailableSlots([]);
            setHasCalculatedSlots(false);
            setFormData((prev) => ({ ...prev, selectedSlots: [] }));
        }

        previousDurationRef.current = currentDuration;
    }, [formData.hours, formData.minutes, open]);

    const currentSelectedSlot = formData.selectedSlots[0] || (() => {
        const startDate = getEventStartDate(eventToEdit);
        const endDate = getEventEndDate(eventToEdit);

        if (!startDate || !endDate) return null;

        return {
            id: startDate.getTime().toString(),
            date: startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString()
        };
    })();

    const hasRequiredFields = formData.title.trim().length > 0 && !!currentSelectedSlot;

    const isEditDirty = (() => {
        if (!eventToEdit || !initialEditFormRef.current) return true;

        const currentSnapshot = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            locationType: formData.locationType,
            hours: formData.hours,
            minutes: formData.minutes,
            selectedSlotSignature: getSlotSignature(currentSelectedSlot),
            participants: normalizeParticipants(formData.participants)
        };

        const initialSnapshot = initialEditFormRef.current;

        return (
            currentSnapshot.title !== initialSnapshot.title ||
            currentSnapshot.description !== initialSnapshot.description ||
            currentSnapshot.locationType !== initialSnapshot.locationType ||
            currentSnapshot.hours !== initialSnapshot.hours ||
            currentSnapshot.minutes !== initialSnapshot.minutes ||
            currentSnapshot.selectedSlotSignature !== initialSnapshot.selectedSlotSignature ||
            JSON.stringify(currentSnapshot.participants) !== JSON.stringify(initialSnapshot.participants)
        );
    })();

    const handleFindAvailableTimes = () => {
        if (!busyData) return;
        setIsCalculatingSlots(true);
        setTimeout(() => {
            const duration = parseInt(formData.hours) * 60 + parseInt(formData.minutes);
            const slots = calculateFreeSlots(busyData, duration || 60);
            setSmartAvailableSlots(slots);
            setHasCalculatedSlots(true);
            setIsCalculatingSlots(false);
        }, 600);
    };

    const calculateFreeSlots = (data, duration) => {
        const slots = [];
        const now = new Date();
        const durationMs = duration * 60 * 1000;
        const allBusy = [];
        for (const id in data) {
            (data[id].busy || []).forEach(b => {
                allBusy.push({ start: new Date(b.start).getTime(), end: new Date(b.end).getTime() });
            });
        }

        let current = new Date(now);
        current.setHours(8, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const dayEnd = new Date(current);
            dayEnd.setHours(23, 0, 0, 0);

            let scan = new Date(current);
            if (scan.toDateString() === now.toDateString()) {
                // Use the later of 8 AM or current time
                scan = new Date(Math.max(scan.getTime(), now.getTime()));
                
                // Round up to the nearest 30-minute interval (e.g., 21:03 -> 21:30, 21:31 -> 22:00)
                const coeff = 1000 * 60 * 30; // 30 minutes in milliseconds
                scan = new Date(Math.ceil(scan.getTime() / coeff) * coeff);
            }

            while (scan.getTime() + durationMs <= dayEnd.getTime()) {
                const sStart = scan.getTime();
                const sEnd = sStart + durationMs;
                if (!allBusy.some(b => sStart < b.end && sEnd > b.start)) {
                    slots.push({
                        id: sStart.toString(),
                        date: scan.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                        time: `${scan.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(sEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                        startDateTime: new Date(sStart).toISOString(),
                        endDateTime: new Date(sEnd).toISOString()
                    });
                }
                scan = new Date(scan.getTime() + 30 * 60 * 1000);
            }
            current.setDate(current.getDate() + 1);
            current.setHours(8, 0, 0, 0);
        }
        return slots;
    };

    const handleSendInvitations = async () => {
        const selectedSlot = currentSelectedSlot;
        if (!selectedSlot) {
            console.log('⚠️ No slot selected');
            return;
        }

        console.log('🔍 Selected slot object:', selectedSlot);
        console.log('📆 Start DateTime from slot:', selectedSlot.startDateTime);
        console.log('📆 End DateTime from slot:', selectedSlot.endDateTime);

        const meetingData = {
            title: formData.title,
            description: formData.description,
            locationType: formData.locationType,
            startDateTime: selectedSlot.startDateTime,
            endDateTime: selectedSlot.endDateTime,
            date: selectedSlot.date, // Add display date
            time: selectedSlot.time, // Add display time
            participants: formData.participants.map(p => ({ email: p.email, name: p.name })),
            availableSlots: formData.selectedSlots.map(slot => ({
                date: slot.date,
                time: slot.time,
                startDateTime: slot.startDateTime,
                endDateTime: slot.endDateTime,
                votes: 0
            })),
            status: 'Draft'
        };

        console.log('📅 Meeting payload before dispatch:', meetingData);

        try {
            // If parent component provides onSubmit callback, use it (CalendarSync does this)
            if (onSubmit) {
                console.log('✅ Using parent onSubmit callback');
                await onSubmit(meetingData);
                handleClose();
            } else {
                // Fallback to Redux dispatch if no callback provided
                console.log('✅ Using Redux dispatch (fallback)');
                const result = await dispatch(createEventAsync(meetingData)).unwrap();
                console.log('✅ Full server response:', JSON.stringify(result, null, 2));
                console.log('📆 Event created with startDateTime:', result.startDateTime);
                console.log('📆 Event created with endDateTime:', result.endDateTime);
                console.log('⏰ Duration object:', result.duration);
                handleClose();
            }
        } catch (err) { 
            console.error('❌ Save error:', err);
            showNotification({
                title: 'Create failed',
                message: 'Failed to create meeting poll. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <Box sx={{ position: 'relative' }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1, color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 0, height: '75vh', display: 'flex', overflow: 'hidden' }}>
                    <Box sx={{ width: '35%', p: 3, borderRight: '1px solid #eee', overflowY: 'auto' }}>
                        <DetailsStep formData={formData} updateForm={updateForm} />
                        <ParticipantsStep 
                            formData={formData} 
                            updateForm={updateForm}
                            onAddParticipant={(p) => {
                                setFormData(prev => ({ ...prev, participants: [...prev.participants, p] }));
                                // Show assistant when adding a new participant
                                setShowAssistant(true);
                            }}
                            onRemoveParticipant={(idOrEmail) => {
                                setFormData(prev => ({
                                    ...prev,
                                    participants: prev.participants.filter(p => p.id !== idOrEmail && p.email !== idOrEmail)
                                }));
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '65%', p: 3, bgcolor: 'background.default', overflowY: 'auto' }}>
                        {!showAssistant && eventToEdit ? (
                            // Show current meeting time when editing and assistant is hidden
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                                    Current Meeting Time
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    This meeting is currently scheduled for:
                                </Typography>
                                
                                {/* Main Container with Selected Time Slot */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        bgcolor: '#F4F8FB',
                                        p: 2,
                                        borderRadius: 2,
                                        mb: 2,
                                    }}
                                >
                                    {/* Left Side: Checkbox + Date/Time */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Checkbox
                                            checked={true}
                                            disabled
                                            sx={{
                                                color: '#112240',
                                                '&.Mui-checked': {
                                                    color: '#112240',
                                                },
                                                '&.Mui-disabled': {
                                                    color: '#112240',
                                                },
                                            }}
                                        />
                                        <Box>
                                            {currentSelectedSlot && (() => {
                                                const slot = currentSelectedSlot;
                                                const startDate = new Date(slot.startDateTime);
                                                const endDate = new Date(slot.endDateTime);
                                                
                                                // Format date: "Tue, Mar 3"
                                                const formattedDate = startDate.toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                });
                                                
                                                // Format time: "13:30 - 14:30"
                                                const formattedTime = `${startDate.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })} - ${endDate.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}`;
                                                
                                                return (
                                                    <>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                fontSize: '1.1rem',
                                                                color: 'text.primary',
                                                                lineHeight: 1.2,
                                                            }}
                                                        >
                                                            {formattedDate}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '0.95rem',
                                                                color: 'text.primary',
                                                                fontWeight: 400,
                                                            }}
                                                        >
                                                            {formattedTime}
                                                        </Typography>
                                                    </>
                                                );
                                            })()}
                                        </Box>
                                    </Box>

                                    {/* Right Side: Available Badge */}
                                    <Chip
                                        icon={<CheckCircleIcon sx={{ fontSize: '1rem', color: '#2E7D32' }} />}
                                        label="Available"
                                        sx={{
                                            bgcolor: 'background.paper',
                                            border: '1px solid #2E7D32',
                                            color: '#2E7D32',
                                            fontWeight: 500,
                                            fontSize: '0.85rem',
                                            '& .MuiChip-icon': {
                                                color: '#2E7D32',
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Change Time Button */}
                                <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={<EditCalendarIcon />}
                                    onClick={() => setShowAssistant(true)}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Change Time
                                </Button>
                            </Box>
                        ) : (
                            // Show the regular Scheduling Assistant
                            <OptionsStep 
                                formData={formData}
                                availableSlots={smartAvailableSlots}
                                onToggleSlot={(slot) => {
                                    const isSelected = formData.selectedSlots.some((selectedSlot) => selectedSlot.id === slot.id);
                                    updateForm('selectedSlots', isSelected ? [] : [slot]);
                                }}
                                isLoadingBusyData={isLoadingBusyData}
                                isCalculatingSlots={isCalculatingSlots}
                                hasCalculatedSlots={hasCalculatedSlots}
                                hasBusyData={!!busyData}
                                onFindAvailableTimes={handleFindAvailableTimes}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
                    <ButtonCont text="Cancel" variant="outlined" onClick={handleClose} />
                    <ButtonCont 
                        text="Send Invitations" 
                        onClick={handleSendInvitations}
                        disabled={!hasRequiredFields || (eventToEdit && !isEditDirty)}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
}