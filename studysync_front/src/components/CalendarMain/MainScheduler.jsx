// src/components/Calendar/MainScheduler.jsx
import React, { useMemo, useRef, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import { SchedulerWrapper } from "./MainScheduler.style";
import { useCalendarData } from "../../hooks/useCalendarData";
import { getCurrentTime } from "../../utils/dateUtils";
import EventDetailsPopup from "./EventDetailsPopup";
import LoadingOverlay from "./LoadingOverlay";
import EmptyStateOverlay from "./EmptyStateOverlay";
import { enGB } from "date-fns/locale";
import API from "../../api/axiosConfig";
import { useNotification } from "../../context/NotificationContext.jsx";

/**
 * MainScheduler Component
 * Displays a weekly calendar scheduler with events
 * 
 * @param {Date} selectedDate - Currently selected date for the scheduler
 * @param {Function} onDateChange - Callback to update selected date
 * @param {Array} events - Array of events to display
 * @param {Function} onEventUpdate - Optional callback to trigger after edit/delete operations
 **/

const MainScheduler = ({ selectedDate, onDateChange, events = [], onEventUpdate, onEditPoll }) => {
  const { isLoading, currentUser, handleDeleteEvent, handleCreateEvent, handleEditEvent } = useCalendarData(onEventUpdate);
  const { showNotification } = useNotification();
  const scrollToTime = "08:00"; // Always scroll to 8 AM

  // Format events for the scheduler - ensure correct date types and ID field
  const formattedEvents = useMemo(() => {
    return events.map(event => {
      const hasParticipants = event.participants && event.participants.length > 0;
      const isGoogle = event.source === 'google';
      const isTask = event.source === 'task' || event.type === 'task';

      // Check if current user needs to RSVP (case-insensitive status check, email matching)
      const needsRsvp = event.participants?.some(
        p => p.email === currentUser?.email && p.status?.toLowerCase() === 'pending'
      );

      const displayTitle = event.title || 'Untitled Event';

      return {
        ...event,
        event_id: event.id || event.event_id,
        start: new Date(event.startDateTime || event.start),
        end: new Date(event.endDateTime || event.end),
        allDay: event.isAllDay || false,
        editable: isTask ? false : !hasParticipants && !isGoogle,
        deletable: isTask ? false : !isGoogle,
        draggable: isTask ? false : !isGoogle,
        title: needsRsvp ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'inline-block',
              flexShrink: 0
            }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayTitle}
            </span>
          </div>
        ) : displayTitle
      };
    });
  }, [events, currentUser]);

  // Use ref to always have access to latest formatted events (solves closure issue)
  const formattedEventsRef = useRef(formattedEvents);

  useEffect(() => {
    formattedEventsRef.current = formattedEvents;
  }, [formattedEvents]);

  //
  const onEventDelete = async (deletedId) => {
    const eventToDelete = formattedEventsRef.current.find(e => String(e.event_id) === String(deletedId));

    if (!eventToDelete) {
      console.error('Event not found');
      return Promise.reject('Event not found');
    }
    // Permission check
    if (eventToDelete.source === 'google') {
      showNotification({
        title: 'Delete blocked',
        message: 'Cannot delete Google Calendar events from this app.',
        severity: 'error',
      });
      return Promise.reject('Cannot delete Google Calendar events');
    }
    // If event has a creator field, check if it matches current user ID
    if (eventToDelete.creator && currentUser?.id && String(eventToDelete.creator) !== String(currentUser.id)) {
      showNotification({
        title: 'Delete blocked',
        message: 'You can only delete events you created.',
        severity: 'error',
      });
      return Promise.reject('Unauthorized');
    }

    try {
      // Await the delete operation to ensure it completes before allowing the scheduler to remove the event from the UI
      await handleDeleteEvent(eventToDelete);
      return deletedId; // Return the deleted ID to allow the scheduler to remove it from the UI
    } catch (error) {
      return Promise.reject(error); // if user cancels or if delete fails, reject to prevent the scheduler from removing the event from the UI
    }
  };

  // Handle create/edit/confirm action from scheduler's built-in button
  const onConfirmAction = async (event, action) => {
    if (action === "create") {
      return await handleCreateEvent(event);
    } else if (action === "edit") {
      // Permission check: Only allow editing local events created by current user (no Google events)
      if (event.source === 'google') {
        showNotification({
          title: 'Edit blocked',
          message: 'Cannot edit Google Calendar events from this app.',
          severity: 'error',
        });
        return Promise.reject('Cannot edit Google Calendar events');
      }
      // If event has a creator field, check if it matches current user ID
      if (event.creator && currentUser?.id && String(event.creator) !== String(currentUser.id)) {
        showNotification({
          title: 'Edit blocked',
          message: 'You can only edit events you created.',
          severity: 'error',
        });
        return Promise.reject('Unauthorized');
      }

      // Call the edit handler
      if (handleEditEvent) {
        return await handleEditEvent(event); // so the library can update the event with returned data
      }
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

  // Handle RSVP status update
  const handleRsvp = async (eventId, status) => {
    const currentEvent = formattedEventsRef.current.find((event) => String(event.event_id) === String(eventId));
    const eventEnd = currentEvent?.end ? new Date(currentEvent.end) : null;

    if (eventEnd && eventEnd.getTime() < Date.now()) {
      showNotification({
        title: 'RSVP unavailable',
        message: 'Cannot respond to an event that has already passed.',
        severity: 'error',
      });
      return;
    }

    try {
      await API.put(`/events/${eventId}/rsvp`, { status });

      // Trigger refetch to update the UI
      if (onEventUpdate) {
        await onEventUpdate();
      }
    } catch (error) {
      console.error('Failed to update RSVP status:', error);
      showNotification({
        title: 'RSVP failed',
        message: 'Failed to update your response. Please try again.',
        severity: 'error',
      });
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
              bgcolor: 'background.paper',
              color: 'text.primary',
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
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
            <Today sx={{ fontSize: 18, color: 'text.primary' }} />
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
              bgcolor: 'background.paper',
              color: 'text.primary',
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
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
        {formattedEvents.length === 0 && <EmptyStateOverlay />}

        <Scheduler
          key={`${selectedDate.toISOString()}-${formattedEvents.length}`}
          view="week"
          events={formattedEvents}
          selectedDate={selectedDate}
          scrollToTime={scrollToTime}
          hourHeight={40}
          hourFormat="24"
          locale={enGB} // Use English locale for date formatting and to replace the am/pm fomette in the modal

          // Enable built-in actions with conditional logic
          editable={true}
          deletable={true}
          draggable={false}

          // Hook into built-in delete action
          onDelete={onEventDelete}

          // Hook into built-in create/edit/confirm action
          onConfirm={onConfirmAction}

          // Keep cell/event click handlers (for future functionality)
          onCellClick={() => { }}
          onEventClick={() => { }}

          navigation={false}
          disableViewNavigator={true}

          // Custom content in the viewer popup (description + participants only)
          viewerExtraComponent={(fields, event) => {
            // Only show delete button in viewer if user is the creator
            const isCreator = currentUser?.id && event.creator === currentUser?.id;
            const isLocalEvent = event.source !== 'google';
            const hasParticipants = event.participants && event.participants.length > 0;

            return (
              <EventDetailsPopup
                event={event}
                // Don't pass onDeleteEvent - let the library handle it
                currentUser={currentUser}
                currentUserId={currentUser?.id}
                // Hide the library's delete button for non-creators or Google events
                showActions={isLocalEvent && isCreator}
                hasParticipants={hasParticipants}
                onEditClick={() => {
                  document.body.click();
                  if (onEditPoll) onEditPoll(event);
                }}
                onRsvp={handleRsvp}
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