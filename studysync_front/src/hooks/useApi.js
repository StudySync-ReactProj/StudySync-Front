import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Unified custom hook for all API calls with comprehensive state management
 * 
 * Supports multiple usage patterns:
 * 1. Simple string URL:
 *    useApi("https://api.example.com/tasks")
 * 
 * 2. URL with query parameters:
 *    useApi("https://api.example.com/tasks", { _page: 1, _limit: 10 })
 * 
 * 3. URL with fetch options:
 *    useApi("https://api.example.com/tasks", {}, { headers: {...}, method: "GET" })
 * 
 * 4. Config object with params:
 *    useApi({ url: "https://api.example.com/tasks", params: { page: 1 } })
 * 
 * @param {string|object} urlOrConfig - URL string or { url, params } config object
 * @param {object} params - Query parameters (alternative to config.params)
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApi = (urlOrConfig, params, options) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Build the full URL - done directly to ensure stable dependencies
  let baseUrl;
  let queryParams = {};

  if (typeof urlOrConfig === "string") {
    baseUrl = urlOrConfig;
    queryParams = params || {};
  } else if (typeof urlOrConfig === "object" && urlOrConfig?.url) {
    baseUrl = urlOrConfig.url;
    queryParams = urlOrConfig.params || {};
  } else {
    throw new Error("useApi: Invalid URL configuration");
  }

  // Build full URL with query string
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const fetchData = useCallback(async () => {
    // Abort any previous request to prevent memory leaks
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...(options || {}),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      // Don't set error if request was aborted (component unmounted)
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to fetch data");
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [fullUrl, options]);

  // Fetch data when URL changes
  useEffect(() => {
    fetchData();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, fullUrl]);

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
