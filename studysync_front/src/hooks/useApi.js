import { useCallback, useEffect, useState } from "react";
import API from "../api/axiosConfig";

/**
 * Generic useApi hook for handling API requests
 * Supports GET, POST, PUT, DELETE with loading, error, and data states
 * 
 * @param {string} url - API endpoint (relative to base URL)
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE). Default: GET
 * @param {boolean} options.skip - Skip automatic fetching on mount. Default: false
 * @param {boolean} options.manual - Require manual trigger (don't auto-fetch). Default: false
 * @param {Object} options.initialData - Initial data state. Default: null
 * 
 * @returns {Object} { data, loading, error, refetch, execute }
 * - data: Response data or null
 * - loading: Boolean indicating loading state
 * - error: Error message or null
 * - refetch: Function to refetch data (for GET)
 * - execute: Function to manually trigger request with payload (for POST/PUT/DELETE)
 */
export function useApi(url, options = {}) {
  const {
    method = "GET",
    skip = false,
    manual = false,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!manual && !skip);
  const [error, setError] = useState(null);

  /**
   * Execute API request with optional payload
   * @param {Object} payload - Request body for POST/PUT/DELETE
   */
  const execute = useCallback(async (payload = null) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (method.toUpperCase()) {
        case "GET":
          response = await API.get(url);
          break;
        case "POST":
          response = await API.post(url, payload);
          break;
        case "PUT":
          response = await API.put(url, payload);
          break;
        case "DELETE":
          response = await API.delete(url, { data: payload });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      // Extract user-friendly error message
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error ||
        err.message || 
        "Something went wrong. Please try again.";
      
      setError(errorMessage);
      
      // If initialData was provided, keep it instead of setting to null
      if (initialData !== null && initialData !== undefined) {
        setData(initialData);
      } else {
        setData(null);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  /**
   * Refetch data (alias for execute, mainly for GET requests)
   */
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  // Auto-fetch on mount for GET requests (unless manual or skip is true)
  useEffect(() => {
    if (method.toUpperCase() === "GET" && !manual && !skip) {
      execute();
    }
  }, [execute, method, manual, skip]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    execute 
  };
}
