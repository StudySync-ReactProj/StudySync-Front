// src/components/Calendar/MainScheduler.jsx
import React, { useMemo } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import { SchedulerWrapper } from "./MainScheduler.style";
import { useCalendarData } from "../../hooks/useCalendarData";
import { getCurrentTime } from "../../utils/dateUtils";
import EventDetailsPopup from "./EventDetailsPopup";
import LoadingOverlay from "./LoadingOverlay";
import EmptyStateOverlay from "./EmptyStateOverlay";

/**
 * MainScheduler Component
 * Displays a weekly calendar scheduler with events
 * 
 * @param {Date} selectedDate - Currently selected date for the scheduler
 * @param {Function} onDateChange - Callback to update selected date
 * @param {Array} events - Array of events to display
 * @param {Function} onEventUpdate - Optional callback to trigger after edit/delete operations
 **/

const MainScheduler = ({ selectedDate, onDateChange, events = [], onEventUpdate }) => {
  const { isLoading, currentUser, handleDeleteEvent, handleEditEvent } = useCalendarData(onEventUpdate);
  const scrollToTime = "08:00"; // Always scroll to 8 AM

  // Format events for the scheduler - ensure correct date types and ID field
  const formattedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      event_id: event._id || event.event_id || event.id,
      start: new Date(event.startDateTime || event.start),
      end: new Date(event.endDateTime || event.end),
    }));
  }, [events]);

  //
  const onEventDelete = async (deletedId) => {
    const eventToDelete = events.find(e => e.event_id === deletedId);

    if (!eventToDelete) {
      console.error('Event not found');
      return Promise.reject('Event not found');
    }

    if (eventToDelete.source === 'google') {
      alert('Cannot delete Google Calendar events from this app');
      return Promise.reject('Cannot delete Google Calendar events');
    }

    if (eventToDelete.creator !== currentUser?._id) {
      alert('You can only delete events you created');
      return Promise.reject('Unauthorized');
    }

    // Call the delete handler which will handle confirmation and API call
    await handleDeleteEvent(eventToDelete);
    return deletedId; // Return the ID to confirm deletion to the library
  };

  // Handle edit/confirm action from scheduler's built-in button
  const onEventEdit = async (event, action) => {
    // Permission check: Only allow editing local events created by current user (no Google events)
    if (event.source === 'google') {
      alert('Cannot edit Google Calendar events from this app');
      return Promise.reject('Cannot edit Google Calendar events');
    }
    // If event has a creator field, check if it matches current user ID
    if (event.creator && currentUser?._id && String(event.creator) !== String(currentUser._id)) {
      alert('You can only edit events you created');
      return Promise.reject('Unauthorized');
    }

    // Call the edit handler
    if (handleEditEvent) {
      return await handleEditEvent(event); // so the library can update the event with returned data
    }

    return event;
  };

  // Week navigation handlers
  const handlePreviousWeek = () => {
    if (onDateChange) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      onDateChange(newDate);
    }
  };

  const handleNextWeek = () => {
    if (onDateChange) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    if (onDateChange) {
      onDateChange(new Date());
    }
  };

  // Show loading overlay while fetching events
  if (isLoading) {
    return (
      <SchedulerWrapper>
        <LoadingOverlay />
      </SchedulerWrapper>
    );
  }

  return (
    <SchedulerWrapper>
      {/* Week Navigation Controls - Fixed at top */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        mb: 2,
        p: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flexShrink: 0,
      }}>
        <Tooltip title="Previous Week" arrow>
          <IconButton
            onClick={handlePreviousWeek}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: 32,
              height: 32,
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Go to Today" arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              cursor: 'pointer',
              px: 1.5,
              py: 0.25,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={handleToday}
          >
            <Today sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                minWidth: 120,
                textAlign: 'center',
              }}
            >
              {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Next Week" arrow>
          <IconButton
            onClick={handleNextWeek}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: 32,
              height: 32,
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Scrollable calendar content */}
      <Box sx={{ position: 'relative', flex: 1, overflow: 'auto' }}>
        {/* Show empty state overlay when no events exist */}
        {events.length === 0 && <EmptyStateOverlay />}

        <Scheduler
          key={selectedDate.toISOString()}
          view="week"
          events={events || []}
          selectedDate={selectedDate}
          scrollToTime={scrollToTime}
          hourHeight={40}

          // Enable built-in actions with conditional logic
          editable={true}
          deletable={true}
          draggable={false}

          // Hook into built-in delete action
          onDelete={onEventDelete}

          // Hook into built-in edit/confirm action
          onConfirm={onEventEdit}

          // Disable custom editor, use built-in viewer with action buttons
          // customEditor={() => false}

          // Keep cell/event click handlers (for future functionality)
          onCellClick={() => { }}
          onEventClick={() => { }}

          navigation={false}
          disableViewNavigator={true}

          // Custom content in the viewer popup (description + participants only)
          viewerExtraComponent={(fields, event) => {
            // Only show delete button in viewer if user is the creator
            const isCreator = currentUser?._id && event.creator === currentUser?._id;
            const isLocalEvent = event.source !== 'google';

            return (
              <EventDetailsPopup
                event={event}
                close={fields.close}
                // Don't pass onDeleteEvent - let the library handle it
                currentUserId={currentUser?._id}
                // Hide the library's delete button for non-creators or Google events
                showActions={isLocalEvent && isCreator}
              />
            );
          }}

          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: 6,
            endHour: 24,
            step: 60,
          }}
        />
      </Box>
    </SchedulerWrapper>
  );
};

export default MainScheduler;