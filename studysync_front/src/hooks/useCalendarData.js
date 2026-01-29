// src/hooks/useCalendarData.js

/**
 * =============================================================================
 * CALENDAR DATA HOOK
 * =============================================================================
 * 
 * Custom React hook that manages calendar data and operations.
 * 
 * What it provides:
 * - isLoading: Loading state from Redux events slice
 * - currentUser: Current logged-in user information
 * - handleDeleteEvent(): Function to delete events with confirmation
 * 
 * Purpose: Extracts Redux logic and event operations from components to
 * follow the separation of concerns principle. This hook encapsulates all
 * calendar-related data fetching and state management.
 * 
 * Used by: MainScheduler component
 * =============================================================================
 */

import { useSelector, useDispatch } from "react-redux";
import { deleteEventAsync } from "../store/eventsSlice";

/**
 * Custom hook for managing calendar data and operations
 * Handles Redux state, event deletion, and loading states
 */
export const useCalendarData = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.events);
  const currentUser = useSelector((state) => state.user?.user);

  /**
   * Delete an event with confirmation
   * @param {Object} event - Event to delete
   * @param {Function} closeViewer - Callback to close event viewer
   */
  const handleDeleteEvent = async (event, closeViewer) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await dispatch(deleteEventAsync(event.event_id)).unwrap();
        if (closeViewer) {
          closeViewer();
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  return {
    isLoading,
    currentUser,
    handleDeleteEvent
  };
};
