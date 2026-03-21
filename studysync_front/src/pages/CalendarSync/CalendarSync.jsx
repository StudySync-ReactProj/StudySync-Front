import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
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
import { useNotification } from "../../context/NotificationContext.jsx";

// Redux
import { updateUser } from "../../store/userSlice";

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

    // Local google loading state to avoid ReferenceError and to control loading during manual refetch
    const [googleLoading, setGoogleLoading] = useState(false);

    // Get user data from Redux Store (state.user.user based on userSlice)
    const user = useSelector((state) => state.user?.user);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    // ============================================
    // DATA FETCHING WITH useApi HOOK
    // ============================================

    // Helper function to calculate month start and end dates in ISO format
    const getMonthDateRange = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Start of month (midnight UTC)
        const monthStart = new Date(year, month, 1);
        const timeMin = monthStart.toISOString();
        
        // End of month (last second of last day in UTC)
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const timeMax = monthEnd.toISOString();
        
        return { timeMin, timeMax };
    };

    // Calculate month range for the current date and build the API URL with query parameters
    const { timeMin, timeMax } = getMonthDateRange(currentDate);
    const googleEventsUrl = `/google-calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;

    // Fetch events from backend
    const { data: events, refetch: refetchEvents } = useApi('/events');

    // Fetch Google Calendar events with month-based date range
    const { data: googleEvents, refetch: refetchGoogleEvents } = useApi(googleEventsUrl, {
        skip: false,
        initialData: []
    });

    // Fetch tasks so scheduled tasks can be shown on calendar
    const { data: tasksData, refetch: refetchTasks } = useApi('/tasks', { initialData: [] });

    // Debug: Log when events change
    useEffect(() => {
        console.log('📊 CalendarSync: Events state updated. Count:', events?.length || 0);
    }, [events]);

    // Wrapper to refetch Google events with explicit loading state
    const refetchGoogleEventsWrapped = useCallback(async () => {
        setGoogleLoading(true);
        try {
            await refetchGoogleEvents();
            return true;
        } catch (err) {
            console.error('Failed to refetch Google events', err);
            showNotification('Failed to load Google Calendar events.', 'error');
            return false;
        } finally {
            setGoogleLoading(false);
        }
    }, [refetchGoogleEvents, showNotification]);

    // ============================================
    // EFFECTS - OAuth Handling
    // ============================================

    // Handle OAuth callback - refresh Google Calendar events after successful connection
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('googleConnected') === 'true') {
            // Update Redux store to persist Google connection status
            dispatch(updateUser({ hasGoogleCalendar: true }));
            // Remove the query parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refetch Google Calendar events with a small delay to ensure DB is updated
            setTimeout(async () => {
                const refreshed = await refetchGoogleEventsWrapped();
                if (refreshed) {
                    showNotification('Google Calendar connected and refreshed successfully!', 'success');
                }
            }, 800);
        }
    }, [refetchGoogleEventsWrapped, showNotification, dispatch]);

    // Listen for task updates from other parts of the app (e.g., after creating a scheduled task)
    useEffect(() => {
        const handler = () => {
            // Refetch tasks and events so scheduled tasks appear immediately
            refetchTasks();
            refetchEvents();
            // Also refresh google events safely
            refetchGoogleEventsWrapped();
        };

        window.addEventListener('studySync:tasksUpdated', handler);
        return () => window.removeEventListener('studySync:tasksUpdated', handler);
    }, [refetchTasks, refetchEvents, refetchGoogleEventsWrapped]);

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
            .filter(event => event && (event.source === 'google' || event.source === 'google-calendar' || event.source === 'google_events'))
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
            .filter(event => event && event.source !== 'google')
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

    /**
     * Format scheduled tasks into calendar events
     */
    const formatScheduledTasks = (tasks) => {
        if (!tasks || !Array.isArray(tasks)) return [];
        return tasks
            .filter(t => t && t.scheduledStart && t.scheduledEnd)
            .map(task => {
                const start = new Date(task.scheduledStart);
                const end = new Date(task.scheduledEnd);
                if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
                return {
                    event_id: task._id,
                    title: task.title,
                    start,
                    end,
                    description: task.description || '',
                    source: 'task',
                    color: '#8BC34A',
                    type: 'task'
                };
            })
            .filter(e => e !== null);
    };

    // Prepare arrays and format events for display
    const allBackendEvents = events || [];
    const allGoogleEvents = googleEvents || [];
    const allTasks = tasksData || [];

    const allEvents = [
        ...formatGoogleEvents(allGoogleEvents),
        ...formatDBEvents(allBackendEvents),
        ...formatScheduledTasks(allTasks)
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

            showNotification('Meeting poll saved successfully!', 'success');

        } catch (error) {
            console.error('❌ CalendarSync: Failed to save event:', error);
            showNotification(`Failed to ${eventToEdit ? 'update' : 'create'} meeting poll. Please try again.`, 'error');
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
                showNotification('User ID not found. Please log in again.', 'error');
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
                showNotification("Could not get Google Auth URL from server.", 'error');
            }
        } catch (error) {
            console.error("Error connecting to Google:", error);
            showNotification("Check your Server/Console for errors.", 'error');
        }
    };

    /**
     * Refresh Google Calendar events
     */
    const handleRefreshGoogle = async () => {
        const refreshed = await refetchGoogleEventsWrapped();
        if (refreshed) {
            showNotification('Google Calendar refreshed successfully!', 'success');
        }
    };

    // ============================================
    // RENDER
    // ============================================

    const theme = useTheme();
    const isGoogleConnected = Boolean(user?.hasGoogleCalendar);

    return (
        <Wrapper>
            {/* Header Section - Title and Action Buttons */}
            <Box sx={styles.headerContainer}>
                <MainTitle title="CalendarSync" />
                <Box sx={styles.headerButtonsContainer}>
                    <Tooltip
                        title={isGoogleConnected ? "Refresh Google Calendar Events" : "Connect Google Calendar first"}
                        arrow
                    >
                        <span>
                            <IconButton
                                size="medium"
                                onClick={handleRefreshGoogle}
                                disabled={!isGoogleConnected || googleLoading || actionLoading}
                                sx={styles.actionButton(theme)}
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
                                sx={styles.actionButton(theme)}
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
                    <Box sx={styles.legendContainer}>
                        <Box sx={styles.legendItem}>
                            <Box sx={styles.legendColorBox('#C98BB9')} />
                            <Typography variant="body2">My Events</Typography>
                        </Box>
                        <Box sx={styles.legendItem}>
                            <Box sx={styles.legendColorBox('#B0BEC5')} />
                            <Typography variant="body2">Invited Events</Typography>
                        </Box>
                        <Box sx={styles.legendItem}>
                            <Box sx={styles.legendColorBox('#4285F4')} />
                            <Typography variant="body2">Google Calendar</Typography>
                        </Box>
                        <Box sx={styles.legendItem}>
                            <Box sx={styles.legendColorBox('#8BC34A')} />
                            <Typography variant="body2">Scheduled Tasks</Typography>
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