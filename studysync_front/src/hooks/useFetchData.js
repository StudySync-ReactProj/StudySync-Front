import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for fetching data with comprehensive error handling
 * @param {string | object} urlOrConfig - URL string or config object { url, params }
 * @param {object} options - Optional fetch configuration (headers, method, etc.)
 * @returns {object} - { data, loading, error, refetch }
 *
 * Usage:
 *   useFetchData("https://api.example.com/tasks")
 *   useFetchData("https://api.example.com/tasks", { headers: {...} })
 *   useFetchData({ url: "https://api.example.com/tasks", params: { page: 1, limit: 10 } })
 */
export const useFetchData = (urlOrConfig, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle both signature styles
  const getUrlWithParams = useCallback(() => {
    let baseUrl;
    let params = {};

    if (typeof urlOrConfig === "string") {
      baseUrl = urlOrConfig;
    } else if (typeof urlOrConfig === "object" && urlOrConfig.url) {
      baseUrl = urlOrConfig.url;
      params = urlOrConfig.params || {};
    } else {
      throw new Error("Invalid URL configuration");
    }

    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [urlOrConfig]);

  // Store abort controller for cleanup
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const url = getUrlWithParams();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
        signal: abortControllerRef.current.signal,
      });

      // Handle non-2xx responses
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
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [getUrlWithParams, options]);

  // Fetch when URL or params change
  useEffect(() => {
    fetchData();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
