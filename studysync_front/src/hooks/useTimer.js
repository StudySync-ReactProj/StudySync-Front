import { useState, useRef, useEffect, useCallback } from "react";

// Wall-clock based timer hook. Uses Date.now() to compute elapsed time so
// the timer stays accurate even if the browser throttles setInterval in
// background tabs. We still use a lightweight UI tick (default 250ms)
// so the UI updates smoothly but the authoritative time is computed
// from startTimestamp + accumulatedMs.
export default function useTimer(pollInterval = 250) {
  const [renderMs, setRenderMs] = useState(0);
  const accumulatedRef = useRef(0); // ms accumulated while paused
  const startTsRef = useRef(null); // timestamp when timer was started (ms)
  const intervalIdRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const computeElapsedMs = useCallback(() => {
    // Use Date.now() (wall-clock) rather than relying on interval ticks.
    // This prevents background-tab throttling from producing stale time.
    const now = Date.now();
    let ms = accumulatedRef.current;
    if (startTsRef.current !== null) ms += now - startTsRef.current;
    return ms;
  }, []);

  const updateRender = useCallback(() => {
    setRenderMs(computeElapsedMs());
  }, [computeElapsedMs]);

  useEffect(() => {
    if (isRunning) {
      // Lightweight ticking to refresh the UI. Exact elapsed time comes
      // from computeElapsedMs(), so throttled intervals only affect
      // UI frequency, not correctness.
      intervalIdRef.current = setInterval(updateRender, pollInterval);
      // Schedule an immediate asynchronous update so we don't call setState
      // synchronously inside the effect (avoids cascading renders warning).
      setTimeout(updateRender, 0);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      // Schedule async update to reflect accumulated time while paused
      setTimeout(updateRender, 0);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isRunning, pollInterval, updateRender]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        // Force an immediate recompute when tab becomes visible again so
        // the displayed time is correct after browser throttling.
        updateRender();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [updateRender]);

  const start = useCallback(() => {
    if (isRunning) return;
    startTsRef.current = Date.now();
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    const now = Date.now();
    accumulatedRef.current += now - (startTsRef.current || now);
    startTsRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    accumulatedRef.current = 0;
    startTsRef.current = null;
    setIsRunning(false);
    setRenderMs(0);
  }, []);

  const getElapsedMs = useCallback(() => computeElapsedMs(), [computeElapsedMs]);

  const elapsedSeconds = Math.floor(renderMs / 1000);

  return { elapsedSeconds, isRunning, start, pause, reset, getElapsedMs };
}
