import { useCallback, useEffect, useState } from "react";

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userInfoRaw = localStorage.getItem("userInfo");
      const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
      const token = userInfo?.token;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      // אם השרת מחזיר שגיאה (401/500 וכו')
      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const errJson = await res.json();
          msg = errJson?.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options.headers]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
