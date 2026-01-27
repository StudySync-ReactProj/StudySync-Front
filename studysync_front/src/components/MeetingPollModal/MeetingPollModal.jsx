import { useState } from 'react';
import { useDispatch } from 'react-redux'; // הוספת דיספאץ'
import {
    Dialog,
    DialogContent,
    Box,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { createEventAsync } from '../../store/eventsSlice'; // ייבוא הפעולה מהסלייס

import DetailsStep from './steps/DetailsStep';
import ParticipantsStep from './steps/ParticipantsStep';
import OptionsStep from './steps/OptionsStep';
import SuccessStep from './steps/SuccessStep';

export default function MeetingPollModal({ open, onClose }) {
    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        locationType: 'online',
        hours: '1',
        minutes: '0',
        timeRange: 'this-week',
        participants: [],
        participantInput: '',
        selectedSlots: [],
    });

    const [availableSlots] = useState([
        {
            id: 1,
            date: 'Thu, Jan 29',
            time: '2:00 PM–4:00 PM',
            // שדות חדשים שהיומן צריך
            startDateTime: '2026-01-29T14:00:00',
            endDateTime: '2026-01-29T16:00:00'
        },
        {
            id: 2,
            date: 'Fri, Jan 30',
            time: '10:00 AM–12:00 PM',
            startDateTime: '2026-01-30T10:00:00',
            endDateTime: '2026-01-30T12:00:00'
        },
        {
            id: 3,
            date: 'Sat, Jan 31',
            time: '3:00 PM–5:00 PM',
            startDateTime: '2026-01-31T15:00:00',
            endDateTime: '2026-01-31T17:00:00'
        },
    ]);

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleAddParticipant = () => {
        if (formData.participantInput.trim()) {
            const newParticipant = {
                id: Date.now(),
                name: formData.participantInput.split('@')[0],
                email: formData.participantInput,
                avatar: formData.participantInput[0].toUpperCase(),
            };
            setFormData(prev => ({
                ...prev,
                participants: [...prev.participants, newParticipant],
                participantInput: '',
            }));
        }
    };

    const handleRemoveParticipant = (id) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p.id !== id),
        }));
    };

    const handleToggleSlot = (id) => {
        setFormData(prev => ({
            ...prev,
            selectedSlots: prev.selectedSlots.includes(id)
                ? prev.selectedSlots.filter(s => s !== id)
                : [...prev.selectedSlots, id],
        }));
    };

    const handleSendInvitations = async () => {
        // מוצאים את האובייקטים המלאים של הסלוטים שנבחרו
        const selectedSlotsData = formData.selectedSlots.map(slotId => {
            return availableSlots.find(s => s.id === slotId);
        });

        const meetingData = {
            title: formData.title,
            description: formData.description,
            locationType: formData.locationType,
            duration: {
                hours: parseInt(formData.hours) || 0,
                minutes: parseInt(formData.minutes) || 0,
            },
            timeRange: formData.timeRange,
            participants: formData.participants.map(p => ({
                name: p.name,
                email: p.email,
                status: 'Pending'
            })),
            // שומרים את כל המידע כולל התאריכים התקניים
            availableSlots: selectedSlotsData.map(slot => ({
                date: slot.date,
                time: slot.time,
                startDateTime: slot.startDateTime,
                endDateTime: slot.endDateTime
            })),
            // כדי שהיומן יציג משהו, נשים את הסלוט הראשון כ"זמן מוצע"
            selectedSlot: {
                startDateTime: selectedSlotsData[0]?.startDateTime,
                endDateTime: selectedSlotsData[0]?.endDateTime
            },
            status: 'Draft'
        };

        try {
            await dispatch(createEventAsync(meetingData)).unwrap();
            onClose();
            setCurrentStep(1);
        } catch (err) {
            console.error("Failed to save meeting:", err);
        }
    };

    const handleClose = () => {
        onClose();
        setCurrentStep(1);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent>
                    {currentStep === 1 && (
                        <DetailsStep formData={formData} updateForm={updateForm} onNext={handleNext} onCancel={handleClose} />
                    )}
                    {currentStep === 2 && (
                        <ParticipantsStep
                            formData={formData}
                            updateForm={updateForm}
                            onNext={handleNext}
                            onBack={handleBack}
                            onAddParticipant={handleAddParticipant}
                            onRemoveParticipant={handleRemoveParticipant}
                        />
                    )}
                    {currentStep === 3 && (
                        <OptionsStep
                            formData={formData}
                            availableSlots={availableSlots}
                            onToggleSlot={handleToggleSlot}
                            onSchedule={handleNext}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 4 && (
                        <SuccessStep
                            formData={formData}
                            availableSlots={availableSlots}
                            onSendInvitations={handleSendInvitations}
                        />
                    )}
                </DialogContent>
            </Box>
        </Dialog>
    );
}