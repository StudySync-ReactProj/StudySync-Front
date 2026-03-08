import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";

// Custom Hook
import { useApi } from "../../hooks/useApi";
import API from "../../api/axiosConfig";

// Utilities
import { getEventColor } from "../../utils/eventUtils";

// Components
import MainScheduler from "../../components/CalendarMain/MainScheduler.jsx";
import CalendarSidebar from "../../components/CalendarSideBar/CalendarSidebar.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import MeetingPollModal from "../../components/MeetingPollModal/MeetingPollModal.jsx";

// Styles
import { styles } from "./CalendarSync.style";

const CalendarSync = () => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    const [currentDate, setCurrentDate] = useState(new Date());
    const [isPollModalOpen, setIsPollModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Get user data from Redux Store (state.user.user based on userSlice)
    const user = useSelector((state) => state.user?.user);

    // ============================================
    // DATA FETCHING WITH useApi HOOK
    // ============================================

    // Fetch events from backend
    const { data: events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useApi('/events');
    
    // Fetch Google Calendar events
    const { data: googleEvents, loading: googleLoading, error: googleError, refetch: refetchGoogleEvents } = useApi('/google-calendar/events', {
        skip: false,
        initialData: []
    });
    
    // Debug: Log when events change
    useEffect(() => {
        console.log('📊 CalendarSync: Events state updated. Count:', events?.length || 0);
    }, [events]);

    // ============================================
    // EFFECTS - OAuth Handling
    // ============================================

    // Handle OAuth callback - refresh Google Calendar events after successful connection
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('googleConnected') === 'true') {
            // Remove the query parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refetch Google Calendar events with a small delay to ensure DB is updated
            setTimeout(() => {
                refetchGoogleEvents();
            }, 800);
        }
    }, [refetchGoogleEvents]);

    // ============================================
    // HELPER FUNCTIONS - Event Formatting
    // ============================================

    /**
     * Format Google Calendar events for display in the scheduler
     * @param {Array} events - Raw events from Google Calendar API
     * @returns {Array} Formatted events with standardized structure
     */
    const formatGoogleEvents = (events) => {
        if (!events || !Array.isArray(events)) return [];
        
        return events
            .filter(event => event.source === 'google')
            .map(event => {
                const startSource = event.start?.dateTime || event.start?.date || event.start;
                const endSource = event.end?.dateTime || event.end?.date || event.end;

                // Parse dates - if they come with Z (UTC), they'll be converted to local time automatically
                // The Date object stores time in UTC internally but displays in local timezone
                const startDate = new Date(startSource);
                const endDate = new Date(endSource);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.warn('Invalid Google event date:', event);
                    return null;
                }

                return {
                    event_id: `google-${event.id || event._id}`,
                    title: `${event.summary || event.title}`,
                    start: startDate,
                    end: endDate,
                    description: event.description || '',
                    source: 'google',
                    isAllDay: event.isAllDay || false,
                    color: getEventColor({ ...event, source: 'google' }, user?._id)
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
        if (!events || !Array.isArray(events)) return [];
        
        return events
            .filter(event => event.source !== 'google')
            .map(event => {
                // Use startDateTime/endDateTime directly from event object (backend now saves these)
                const startSource = event.startDateTime || event.selectedSlot?.startDateTime || event.createdAt;
                const endSource = event.endDateTime || event.selectedSlot?.endDateTime;

                // Parse dates - Date constructor automatically converts UTC to local time
                const startDate = new Date(startSource);
                const endDate = endSource ? new Date(endSource) : new Date(startDate.getTime() + 3600000);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    console.warn('Invalid DB event date:', event);
                    return null;
                }

                return {
                    event_id: event._id || event.id,
                    title: event.status === 'Draft' ? `${event.title}` : event.title,
                    start: startDate,
                    end: endDate,
                    description: event.description || '',
                    participants: event.participants || [],
                    creator: event.creator,
                    isInvited: event.isInvited || false,
                    source: 'local',
                    color: getEventColor(event, user?._id)
                };
            })
            .filter(event => event !== null);
    };

    // Combine all events (from backend and Google Calendar)
    const allBackendEvents = events || [];
    const allGoogleEvents = googleEvents || [];
    const combinedEvents = [...allBackendEvents, ...allGoogleEvents];
    
    // Format combined events for display
    const allEvents = [
        ...formatGoogleEvents(combinedEvents),
        ...formatDBEvents(combinedEvents)
    ];

    // ============================================
    // EVENT HANDLERS
    // ============================================

    // Meeting Poll Modal handlers
    const handleOpenPollModal = () => setIsPollModalOpen(true);
    const handleClosePollModal = () => {
        setIsPollModalOpen(false);
        setEventToEdit(null); // Clear the event being edited
    };

    /**
     * Handle edit poll click - opens MeetingPollModal with event data
     */
    const handleEditPollClick = (event) => {
        setEventToEdit(event);
        setIsPollModalOpen(true);
    };

    /**
     * Cleanup test events - Remove all events with test titles
     * This is a temporary utility to clear old draft events
     */
    const handleCleanupTestEvents = async () => {
        const testKeywords = ['test', 'please work', 'hello', 'djshcbbdsjb', 'hellp'];
        const eventsToDelete = (events || []).filter(event =>
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
                alert(`Found ${eventsToDelete.length} test events. Backend delete endpoint needed.`);
            } catch (error) {
                console.error('Failed to delete events:', error);
            }
        }
    };

    /**
     * Handle meeting poll submission
     * Creates a new event or updates an existing one based on eventToEdit
     */
    const handleSubmitMeetingPoll = async (meetingData) => {
        console.log('🚀 CalendarSync: handleSubmitMeetingPoll called with:', meetingData);
        console.log('📝 eventToEdit:', eventToEdit);
        setActionLoading(true);
        
        try {
            let response;
            
            if (eventToEdit) {
                // UPDATE MODE: Edit existing event
                const eventId = eventToEdit._id || eventToEdit.event_id || eventToEdit.id;
                console.log('✏️ Updating event with ID:', eventId);
                
                response = await API.put(`/events/${eventId}`, {
                    ...meetingData,
                    status: eventToEdit.status || 'Draft' // Preserve original status or default to Draft
                });
                
                console.log('✅ CalendarSync: Event updated successfully:', response.data);
            } else {
                // CREATE MODE: Create new event
                console.log('➕ Creating new event');
                
                response = await API.post('/events', {
                    ...meetingData,
                    status: 'Draft'
                });
                
                console.log('✅ CalendarSync: Event created successfully:', response.data);
            }
            
            // Close modal immediately for better UX
            handleClosePollModal();
            
            // Small delay to ensure database transaction is complete
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Refetch events to update the calendar
            console.log('🔄 CalendarSync: Refetching events...');
            const result = await refetchEvents();
            console.log('✅ CalendarSync: Events refetched successfully. New count:', result?.data?.length);
            
        } catch (error) {
            console.error('❌ CalendarSync: Failed to save event:', error);
            alert(`Failed to ${eventToEdit ? 'update' : 'create'} meeting poll. Please try again.`);
        } finally {
            setActionLoading(false);
        }
    };

    /**
     * Initiate Google Calendar OAuth connection flow
     * Fetches the authorization URL from backend and redirects the user
     */
    const handleConnectGoogle = async () => {
        try {
            // Use environment variable with fallback
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            // Get userId from Redux user state instead of hardcoding
            const userId = user?._id || user?.id || localStorage.getItem('userId');
            
            if (!userId) {
                alert('User ID not found. Please log in again.');
                return;
            }
            
            const url = `${API_BASE_URL}/api/google-calendar/auth-url?userId=${userId}`;

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
    
    /**
     * Refresh Google Calendar events
     */
    const handleRefreshGoogle = () => {
        refetchGoogleEvents();
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <Wrapper>
            {/* Header Section - Title and Action Buttons */}
            <Box sx={styles.headerContainer}>
                <MainTitle title="CalendarSync" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh Google Calendar Events" arrow>
                        <span>
                            <IconButton
                                size="medium"
                                onClick={handleRefreshGoogle}
                                disabled={googleLoading || actionLoading}
                                sx={{
                                    bgcolor: 'background.paper',
                                    color: 'text.primary',
                                    border: 1,
                                    borderColor: 'divider',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                    '&:disabled': {
                                        bgcolor: 'action.disabledBackground',
                                        color: 'action.disabled',
                                    },
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Add Meeting Poll" arrow>
                        <span>
                            <IconButton
                                size="medium"
                                onClick={handleOpenPollModal}
                                disabled={actionLoading}
                                sx={{
                                    bgcolor: 'background.paper',
                                    color: 'text.primary',
                                    border: 1,
                                    borderColor: 'divider',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                    '&:disabled': {
                                        bgcolor: 'action.disabledBackground',
                                        color: 'action.disabled',
                                    },
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
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
                    {/* Color Legend */}
                    <Box sx={{
                        display: 'flex',
                        gap: 3,
                        mb: 2,
                        p: 1.5,
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        flexWrap: 'wrap'
                    }}>
                        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#2196f3', borderRadius: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Your Events</Typography>
                            </Box> */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#C98BB9', borderRadius: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>My Events</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#B0BEC5', borderRadius: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Invited Events</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 16, height: 16, backgroundColor: '#4285F4', borderRadius: 1 }} />
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Google Calendar</Typography>
                        </Box>
                    </Box>

                    <MainScheduler
                        selectedDate={currentDate}
                        onDateChange={setCurrentDate}
                        events={allEvents}
                        onEventUpdate={refetchEvents}
                        onEditPoll={handleEditPollClick}
                    />
                </Box>
            </Box>

            {/* Meeting Poll Creation/Edit Modal */}
            <MeetingPollModal
                open={isPollModalOpen}
                onClose={handleClosePollModal}
                onSubmit={handleSubmitMeetingPoll}
                eventToEdit={eventToEdit}
            />
        </Wrapper>
    );
};

export default CalendarSync;