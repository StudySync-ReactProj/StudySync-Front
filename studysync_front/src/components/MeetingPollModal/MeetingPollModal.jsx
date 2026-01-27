import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Stack,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DetailsStep from './steps/DetailsStep';
import ParticipantsStep from './steps/ParticipantsStep';
import OptionsStep from './steps/OptionsStep';
import SuccessStep from './steps/SuccessStep';

export default function MeetingPollModal({ open, onClose, onSubmit }) {
    // State management
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

    // Sample available time slots (will come from backend)
    const [availableSlots] = useState([
        { id: 1, date: 'Tue, Dec 9', time: '2:00 PM–4:00 PM' },
        { id: 2, date: 'Wed, Dec 10', time: '10:00 AM–12:00 PM' },
        { id: 3, date: 'Thu, Dec 11', time: '3:00 PM–5:00 PM' },
        { id: 4, date: 'Fri, Dec 12', time: '1:00 PM–3:00 PM' },
    ]);

    // Update form data
    const updateForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddParticipant = () => {
        if (formData.participantInput.trim()) {
            const newParticipant = {
                id: Date.now(),
                name: formData.participantInput.trim(),
                avatar: formData.participantInput.charAt(0).toUpperCase(),
            };
            setFormData((prev) => ({
                ...prev,
                participants: [...prev.participants, newParticipant],
                participantInput: '',
            }));
        }
    };

    const handleRemoveParticipant = (id) => {
        setFormData((prev) => ({
            ...prev,
            participants: prev.participants.filter((p) => p.id !== id),
        }));
    };

    const handleToggleSlot = (slotId) => {
        setFormData((prev) => ({
            ...prev,
            selectedSlots: prev.selectedSlots.includes(slotId)
                ? prev.selectedSlots.filter((id) => id !== slotId)
                : [...prev.selectedSlots, slotId],
        }));
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        setFormData({
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
        onClose();
    };

    const handleScheduleMeeting = () => {
        setCurrentStep(4);
    };

    const handleSendInvitations = () => {
        const meetingData = {
            title: formData.title,
            description: formData.description,
            locationType: formData.locationType,
            duration: {
                hours: parseInt(formData.hours),
                minutes: parseInt(formData.minutes),
            },
            timeRange: formData.timeRange,
            participants: formData.participants.map((p) => p.name),
            selectedSlots: formData.selectedSlots,
        };

        if (onSubmit) {
            onSubmit(meetingData);
        }

        handleClose();
    };
    // console.log("Form Data:", formData);
    
    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth 
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            PaperProps={{ 
                sx: { borderRadius: 3, p: 2 },
                tabIndex: -1
            }}
            BackdropProps={{
                sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                    <CloseIcon />
                </IconButton>

                <DialogContent sx={{ pt: 4 }}>
                    {/* Step indicator */}
                    {currentStep < 4 && (
                        <Stack direction="row" spacing={1} justifyContent="center" mb={3}>
                            {[1, 2, 3].map((step) => (
                                <Box
                                    key={step}
                                    sx={{
                                        width: 40,
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: currentStep >= step ? 'primary.main' : 'divider',
                                        transition: 'all 0.3s',
                                    }}
                                />
                            ))}
                        </Stack>
                    )}

                    {/* Render current step components based on currentStep state */}
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
                            onSchedule={handleScheduleMeeting}
                            onBack={handleBack}
                        />
                    )}
                    {currentStep === 4 && (
                        <SuccessStep formData={formData} availableSlots={availableSlots} onSendInvitations={handleSendInvitations} />
                    )}
                </DialogContent>
            </Box>
        </Dialog>
    );
}