// src/hooks/useCalendarData.js
import { useSelector, useDispatch } from "react-redux";
import { deleteEventAsync, updateEventAsync, createEventAsync } from "../store/eventsSlice";
import { getEventColor } from "../utils/eventUtils";
import { useNotification } from "../context/NotificationContext.jsx";
import { getSafeId } from "../utils/idUtils";

/*
  Custom hook to manage calendar data and actions
  - Provides loading state and current user info from Redux store 
    - useSelector for isLoading and currentUser and useDispatch for dispatching actions
  - Handles event deletion with confirmation
  - Handles event editing with API update and error handling
  - Accepts optional refetch callback to sync with external data sources (like useApi)
*/
export const useCalendarData = (refetchCallback = null) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.events);
  const currentUser = useSelector((state) => state.user?.user);
  const { showNotification } = useNotification();

  const handleDeleteEvent = async (event, closeViewer, options = {}) => {
    const { suppressNotifications = false } = options;
    try {
      const eventId = getSafeId(event);
      const currentUserId = getSafeId(currentUser);
      const eventCreatorId = getSafeId(event?.creator);

      if (!eventId) {
        if (!suppressNotifications) {
          showNotification({
            title: 'Delete failed',
            message: 'Missing event ID. Please refresh and try again.',
            severity: 'error',
          });
        }
        throw new Error('Missing event ID');
      }

      if (eventCreatorId && currentUserId && String(eventCreatorId) !== String(currentUserId)) {
        if (!suppressNotifications) {
          showNotification({
            title: 'Delete blocked',
            message: 'You can only delete events you created.',
            severity: 'error',
          });
        }
        throw new Error('Unauthorized delete attempt');
      }

      // making sure we are sending the correct ID field to the API
      await dispatch(deleteEventAsync(eventId)).unwrap();

      // Trigger refetch to update UI with latest data
      if (refetchCallback) {
        await refetchCallback();
      }

      if (closeViewer) {
        closeViewer();
      }
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      if (!suppressNotifications) {
        showNotification({
          title: 'Delete failed',
          message: 'Failed to delete event. Please try again.',
          severity: 'error',
        });
      }
      throw error; // throw error to prevent the scheduler from removing the event from the UI
    }
  };

  const handleCreateEvent = async (event) => {
    try {
      const payload = {
        title: event.title,
        description: event.subtitle,
        startDateTime: event.start,
        endDateTime: event.end,
        status: 'Scheduled'
      };

      const createdEvent = await dispatch(createEventAsync(payload)).unwrap();

      const returnedEvent = {
        ...event,
        event_id: createdEvent.id,
        start: new Date(createdEvent.startDateTime),
        end: new Date(createdEvent.endDateTime),
        color: getEventColor(createdEvent, currentUser?.id)
      };

      // Trigger refetch if callback provided
      if (refetchCallback) {
        refetchCallback();
      }

      return returnedEvent;

    } catch (error) {
      console.error('Failed to create event:', error);
      showNotification({
        title: 'Create failed',
        message: 'Failed to create event. Please try again.',
        severity: 'error',
      });
      throw error;
    }
  };

  const handleEditEvent = async (event) => {
    try {
      const eventId = getSafeId(event);
      if (!eventId) {
        showNotification({
          title: 'Update failed',
          message: 'Missing event ID. Please refresh and try again.',
          severity: 'error',
        });
        throw new Error('Missing event ID');
      }

      const updatedEventPayload = {
        ...event,
        startDateTime: event.start,
        endDateTime: event.end,
        id: eventId
      };

      const updatedEvent = await dispatch(updateEventAsync(updatedEventPayload)).unwrap();

      const returnedEvent = {
        ...event,
        ...updatedEvent,
        event_id: event.event_id,
        start: new Date(updatedEvent.startDateTime || event.start),
        end: new Date(updatedEvent.endDateTime || event.end)
      };

      // Trigger refetch if callback provided to sync with external data sources
      if (refetchCallback) {
        refetchCallback();
      }

      return returnedEvent;

    } catch (error) {
      console.error('Failed to update event:', error);
      showNotification({
        title: 'Update failed',
        message: 'Failed to update event. Please try again.',
        severity: 'error',
      });
      throw error;
    }
  };

  return {
    isLoading,
    currentUser,
    handleDeleteEvent,
    handleCreateEvent,
    handleEditEvent
  };
};