// src/hooks/useCalendarData.js
import { useSelector, useDispatch } from "react-redux";
import { deleteEventAsync, updateEventAsync } from "../store/eventsSlice";

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

  const handleDeleteEvent = async (event, closeViewer) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) {
      throw new Error('User cancelled deletion');
    }
    try {
      // making sure we sending the correct ID field to the API
      await dispatch(deleteEventAsync(event._id || event.event_id || event.id)).unwrap();

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
      alert('Failed to delete event. Please try again.');
      throw error; // throw error to prevent the scheduler from removing the event from the UI
    }
  };

  const handleEditEvent = async (event) => {
    try {
      const updatedEventPayload = {
        ...event,
        startDateTime: event.start,
        endDateTime: event.end,
        _id: event.event_id || event._id || event.id
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
      alert('Failed to update event. Please try again.');
      throw error;
    }
  };

  return {
    isLoading,
    currentUser,
    handleDeleteEvent,
    handleEditEvent
  };
};