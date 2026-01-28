import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEventAsync } from '../../store/eventsSlice';
import { fetchFreeBusyData } from '../../services/googleCalendarService';

import DetailsStep from './steps/DetailsStep';
import ParticipantsStep from './steps/ParticipantsStep';
import OptionsStep from './steps/OptionsStep';
import ButtonCont from '../ButtonCont/ButtonCont';

export default function MeetingPollModal({ open, onClose }) {
    const dispatch = useDispatch();
    
    // Fix: Correctly access user from Redux store with fallback
    const user = useSelector((state) => state.user.user || state.user);
    
    // Helper function to decode JWT token and extract user ID
    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.id || decodedPayload._id || decodedPayload.userId;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const [isLoadingBusyData, setIsLoadingBusyData] = useState(false);
    const [isCalculatingSlots, setIsCalculatingSlots] = useState(false);
    const [busyData, setBusyData] = useState(null);
    const [alert, setAlert] = useState(null);
    const [smartAvailableSlots, setSmartAvailableSlots] = useState([]);
    const [hasCalculatedSlots, setHasCalculatedSlots] = useState(false);

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

    const handleClose = () => {
        setBusyData(null);
        setSmartAvailableSlots([]);
        setHasCalculatedSlots(false);
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

    // פונקציית הסנכרון
    const handleCheckAvailability = async () => {
        // Extract user ID from JWT token or direct property
        const currentUserId = user?._id || user?.id || getUserIdFromToken(user?.token);
        console.log('Final User ID:', currentUserId);
        console.log("🔍 Checking availability for user:", currentUserId);
        
        if (!currentUserId || formData.participants.length === 0) {
            console.log("⚠️ Aborting sync: No user or no participants");
            return;
        }

        setIsLoadingBusyData(true);
        try {
            const emails = formData.participants
                .map(p => p.email)
                .filter(e => e && e.includes('@'));
            
            const allEmails = [...new Set([user.email, ...emails])];
            console.log("📡 Calling fetchFreeBusyData for:", allEmails);

            const data = await fetchFreeBusyData(currentUserId, allEmails);
            
            if (data?.calendars) {
                console.log("✅ Busy data received:", data.calendars);
                setBusyData(data.calendars);
                setHasCalculatedSlots(false);
            }
        } catch (err) {
            console.error("❌ Sync error:", err);
            setAlert("Failed to sync calendars.");
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
                scan = new Date(Math.max(scan.getTime(), now.getTime()));
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
        const selectedSlot = formData.selectedSlots[0];
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
            const result = await dispatch(createEventAsync(meetingData)).unwrap();
            console.log('✅ Full server response:', JSON.stringify(result, null, 2));
            console.log('📆 Event created with startDateTime:', result.startDateTime);
            console.log('📆 Event created with endDateTime:', result.endDateTime);
            console.log('⏰ Duration object:', result.duration);
            handleClose();
        } catch (err) { 
            console.error('❌ Save error:', err); 
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <Box sx={{ position: 'relative' }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 0, height: '75vh', display: 'flex', overflow: 'hidden' }}>
                    <Box sx={{ width: '35%', p: 3, borderRight: '1px solid #eee', overflowY: 'auto' }}>
                        <DetailsStep formData={formData} updateForm={updateForm} />
                        <ParticipantsStep 
                            formData={formData} 
                            updateForm={updateForm}
                            onAddParticipant={(p) => setFormData(prev => ({ ...prev, participants: [...prev.participants, p] }))}
                            onRemoveParticipant={(id) => setFormData(prev => ({ ...prev, participants: prev.participants.filter(p => p.id !== id) }))}
                        />
                    </Box>
                    <Box sx={{ width: '65%', p: 3, bgcolor: '#fafafa', overflowY: 'auto' }}>
                        <OptionsStep 
                            formData={formData}
                            availableSlots={smartAvailableSlots}
                            onToggleSlot={(id) => updateForm('selectedSlots', formData.selectedSlots.includes(id) ? [] : [id])}
                            isLoadingBusyData={isLoadingBusyData}
                            isCalculatingSlots={isCalculatingSlots}
                            hasCalculatedSlots={hasCalculatedSlots}
                            hasBusyData={!!busyData}
                            onFindAvailableTimes={handleFindAvailableTimes}
                            alert={alert}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
                    <ButtonCont text="Cancel" variant="outlined" onClick={handleClose} />
                    <ButtonCont 
                        text="Send Invitations" 
                        onClick={handleSendInvitations}
                        disabled={!formData.title.trim() || formData.selectedSlots.length === 0}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
}