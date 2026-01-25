// src/hooks/useFetch.js
import { useState, useEffect } from "react";

// The Hook receives a URL and options (like POST or GET method)
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Variable that helps us prevent updates if the component has already unmounted
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url, options);
        
        // Check if the server returned an error (like 404 or 500)
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        
        const json = await response.json();
        
        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [url]); // Re-run only if the URL changes

  // Return the state so the component can use it
  return { data, loading, error };
}