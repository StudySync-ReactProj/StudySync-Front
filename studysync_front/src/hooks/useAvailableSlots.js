import { useCallback, useState } from "react";
import API from "../api/axiosConfig";

/**
 * Hook for fetching available time slots for a given date and duration
 * 
 * @returns {Object} { slots, loading, error, fetchSlots }
 * - slots: Array of available slot objects with { start, end } times
 * - loading: Boolean indicating loading state
 * - error: Error message or null
 * - fetchSlots: Function to trigger fetching slots for a specific date and duration
 */
export function useAvailableSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = useCallback(async (dateString, durationMinutes) => {
    // Validate inputs
    if (!dateString || !durationMinutes || durationMinutes <= 0) {
      setSlots([]);
      setError(null);
      return { success: false, slots: [] };
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure durationMinutes is a number
      const duration = Number(durationMinutes);

      // Build the query string explicitly to ensure correct format
      // Expected format: /api/tasks/available-slots?date=2026-03-21&duration=90
      const queryString = `?date=${encodeURIComponent(dateString)}&duration=${duration}`;
      const url = `/tasks/available-slots${queryString}`;

      console.log('📡 Fetching available slots:', url);

      const response = await API.get(url);

      const fetchedSlots = response.data.slots || response.data || [];
      console.log('✅ Slots fetched successfully:', fetchedSlots);

      setSlots(fetchedSlots);
      return { success: true, slots: fetchedSlots };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch available slots";

      console.error('❌ Error fetching slots:', {
        status: err.response?.status,
        message: errorMessage,
        url: err.config?.url,
      });

      setError(errorMessage);
      setSlots([]);
      return { success: false, error: errorMessage, slots: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    slots,
    loading,
    error,
    fetchSlots,
  };
}
