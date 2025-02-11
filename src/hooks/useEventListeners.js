import { useCallback, useRef, useEffect } from 'react';

export function useEventListeners() {
  const abortController = useRef(new AbortController());

  const clearEventListeners = useCallback(() => {
    abortController.current.abort();
    abortController.current = new AbortController();
  }, []);

  const addEventListener = useCallback((target, eventType, listener) => {
    target.addEventListener(eventType, listener, {
      signal: abortController.current.signal
    });
  }, []);

  // Cleanup event listeners on unmount
  useEffect(() => clearEventListeners, [clearEventListeners]);

  return { addEventListener, clearEventListeners };
} 