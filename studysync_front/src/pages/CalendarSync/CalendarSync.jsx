import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";

// Components
import MainScheduler from "../../components/CalendarMain/MainScheduler.jsx";
import CalendarSidebar from "../../components/CalendarSideBar/CalendarSidebar.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import ButtonCont from "../../components/ButtonCont/ButtonCont.jsx";
import MeetingPollModal from "../../components/MeetingPollModal/MeetingPollModal.jsx";

// Store Actions
import { fetchEvents, createEventAsync } from "../../store/eventsSlice";

const CalendarSync = () => {
    const dispatch = useDispatch();

    // UI State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isPollModalOpen, setIsPollModalOpen] = useState(false);

    // 1. Get events from Redux Store
    const { events } = useSelector((state) => state.events);

    // 2. Fetch events from Backend on mount
    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    /**
     * Fix for "getTime" error: 
     * We map the events from MongoDB to the format expected by the Scheduler.
     * Every event MUST have 'start' and 'end' as JS Date objects.
     */

    const formattedEvents = (events || []).map(event => {
        // לוגיקה למציאת התאריכים - בודק כמה אפשרויות כדי שלא יחזור undefined
        const startVal = event.start || event.selectedSlot?.startDateTime || event.createdAt;
        const endVal = event.end || event.selectedSlot?.endDateTime;

        return {
            event_id: event._id,
            title: event.title || "No Title",
            // חובה להפוך לאובייקט Date של JS כדי שהספרייה תציג אותם
            start: new Date(startVal),
            end: endVal ? new Date(endVal) : new Date(new Date(startVal).getTime() + 3600000),
            description: event.description || "",
            color: event.status === 'Draft' ? '#ffa726' : '#2196f3'
        };
    });

    const handleOpenPollModal = () => setIsPollModalOpen(true);
    const handleClosePollModal = () => setIsPollModalOpen(false);

    const handleSubmitMeetingPoll = (meetingData) => {
        dispatch(createEventAsync({
            ...meetingData,
            status: 'Draft' // Ensure polls start as Drafts
        }));
        handleClosePollModal();
    };
    console.log("Raw events from Redux:", events);
    console.log("Formatted events for Scheduler:", formattedEvents);
    return (
        <Wrapper>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <MainTitle title="CalendarSync" />
                <Box sx={{ maxWidth: "200px" }}>
                    <ButtonCont
                        text="Create Meeting Poll"
                        onClick={handleOpenPollModal}
                    />
                </Box>
            </Box>

            <Box sx={{ display: "flex", height: "calc(100vh - 150px)", bgcolor: "background.default" }}>
                <CalendarSidebar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    events={formattedEvents}
                />

                <Box sx={{ flex: 1, marginLeft: 3, overflow: "hidden" }}>
                    <MainScheduler
                        selectedDate={currentDate}
                        events={formattedEvents}
                    />
                </Box>
            </Box>

            <MeetingPollModal
                open={isPollModalOpen}
                onClose={handleClosePollModal}
                onSubmit={handleSubmitMeetingPoll}
            />
        </Wrapper>
    );
};

export default CalendarSync;