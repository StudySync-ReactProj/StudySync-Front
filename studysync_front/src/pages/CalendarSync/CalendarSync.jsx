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
import { fetchEvents, createEventAsync, fetchGoogleCalendarEvents } from "../../store/eventsSlice";

// Styles
import { styles } from "./CalendarSync.style";

const CalendarSync = () => {
    const dispatch = useDispatch();

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    const [currentDate, setCurrentDate] = useState(new Date());
    const [isPollModalOpen, setIsPollModalOpen] = useState(false);

    // Get events and user data from Redux Store
    const { events } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth || state.user);

    // ============================================
    // EFFECTS - Data Fetching & OAuth Handling
    // ============================================

    // Fetch events from backend on component mount
    useEffect(() => {
        dispatch(fetchEvents());
        dispatch(fetchGoogleCalendarEvents()).catch(() => {
            // Silently ignore if Google Calendar not connected yet
        });
    }, [dispatch]);

    // Handle OAuth callback - refresh Google Calendar events after successful connection
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('googleConnected') === 'true') {
            // Remove the query parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refetch Google Calendar events with a small delay to ensure DB is updated
            setTimeout(() => {
                dispatch(fetchGoogleCalendarEvents());
            }, 800);
        }
    }, [dispatch]);

    // ============================================
    // HELPER FUNCTIONS - Event Formatting
    // ============================================

    /**
     * Format Google Calendar events for display in the scheduler
     * @param {Array} events - Raw events from Google Calendar API
     * @returns {Array} Formatted events with standardized structure
     */
    const formatGoogleEvents = (events) => {
        return events
            .filter(event => event.source === 'google')
            .map(event => {
                const startSource = event.start?.dateTime || event.start?.date || event.start;
                const endSource = event.end?.dateTime || event.end?.date || event.end;

                const startDate = new Date(startSource);
                const endDate = new Date(endSource);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.warn('Invalid Google event date:', event);
                    return null;
                }

                return {
                    event_id: `google-${event.id || event._id}`,
                    title: `🗓️ ${event.summary || event.title}`,
                    start: startDate,
                    end: endDate,
                    color: "#4285F4",
                    source: 'google'
                };
            })
            .filter(event => event !== null);
    };

    /**
     * Format database events (Meeting Polls) for display in the scheduler
     * @param {Array} events - Raw events from database
     * @returns {Array} Formatted events with standardized structure
     */
    const formatDBEvents = (events) => {
        return events
            .filter(event => event.source !== 'google')
            .map(event => {
                // Use startDateTime/endDateTime directly from event object (backend now saves these)
                const startSource = event.startDateTime || event.selectedSlot?.startDateTime || event.createdAt;
                const endSource = event.endDateTime || event.selectedSlot?.endDateTime;
                
                const startDate = new Date(startSource);
                const endDate = endSource ? new Date(endSource) : new Date(startDate.getTime() + 3600000);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.warn('Invalid DB event date:', event);
                    return null;
                }

                return {
                    event_id: event._id || event.id,
                    title: event.status === 'Draft' ? `🗳️ Poll: ${event.title}` : event.title,
                    start: startDate, // Scheduler library uses local timezone automatically
                    end: endDate,
                    description: event.description || '',
                    participants: event.participants || [],
                    color: event.status === 'Draft' ? "#ff9800" : "#2196f3",
                    source: 'local'
                };
            })
            .filter(event => event !== null);
    };

    // Combine Google Calendar events and database events into a single array
    const allEvents = [
        ...formatGoogleEvents(events || []),
        ...formatDBEvents(events || [])
    ];

    // ============================================
    // EVENT HANDLERS
    // ============================================

    // Meeting Poll Modal handlers
    const handleOpenPollModal = () => setIsPollModalOpen(true);
    const handleClosePollModal = () => setIsPollModalOpen(false);

    /**
     * Cleanup test events - Remove all events with test titles
     * This is a temporary utility to clear old draft events
     */
    const handleCleanupTestEvents = async () => {
        const testKeywords = ['test', 'please work', 'hello', 'djshcbbdsjb', 'hellp'];
        const eventsToDelete = events.filter(event => 
            event.source !== 'google' && 
            testKeywords.some(keyword => event.title?.toLowerCase().includes(keyword))
        );
        
        if (eventsToDelete.length === 0) {
            alert('No test events found to delete');
            return;
        }

        if (window.confirm(`Delete ${eventsToDelete.length} test event(s)?`)) {
            try {
                // You'll need to implement deleteEventAsync in your eventsSlice
                // For now, we'll log the IDs that should be deleted
                console.log('Events to delete:', eventsToDelete.map(e => e._id));
                alert(`Found ${eventsToDelete.length} test events. Backend delete endpoint needed.`);
            } catch (error) {
                console.error('Failed to delete events:', error);
            }
        }
    };

    /**
     * Handle meeting poll submission
     * Creates a new event with 'Draft' status and closes the modal
     */
    const handleSubmitMeetingPoll = (meetingData) => {
        dispatch(createEventAsync({
            ...meetingData,
            status: 'Draft'
        }));
        handleClosePollModal();
    };

    /**
     * Initiate Google Calendar OAuth connection flow
     * Fetches the authorization URL from backend and redirects the user
     */
    const handleConnectGoogle = async () => {
        try {
            const userId = "6978fee797b46e0b7967d68a";
            const url = `http://localhost:3000/api/google-calendar/auth-url?userId=${userId}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Could not get Google Auth URL from server.");
            }
        } catch (error) {
            console.error("Error connecting to Google:", error);
            alert("Check your Server/Console for errors.");
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <Wrapper>
            {/* Header Section - Title and Action Buttons */}
            <Box sx={styles.headerContainer}>
                <MainTitle title="CalendarSync" />

                <Box>
                    <ButtonCont
                        text="Create Meeting Poll"
                        onClick={handleOpenPollModal}
                    />
                </Box>
            </Box>

            {/* Main Calendar Section - Sidebar and Scheduler */}
            <Box sx={styles.mainContainer}>
                <CalendarSidebar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    events={allEvents}
                    onConnectGoogle={handleConnectGoogle}
                />

                <Box sx={styles.schedulerContainer}>
                    <MainScheduler
                        selectedDate={currentDate}
                        events={allEvents}
                    />
                </Box>
            </Box>

            {/* Meeting Poll Creation Modal */}
            <MeetingPollModal
                open={isPollModalOpen}
                onClose={handleClosePollModal}
                onSubmit={handleSubmitMeetingPoll}
            />
        </Wrapper>
    );
};

export default CalendarSync;