import { useState, useEffect, useRef, useCallback } from "react";

/**
 * A hook that debounces a value
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay is over
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A hook that returns a debounced version of the provided function
 *
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);

  // Update the callback reference when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create a memoized version of the debounced function
  return useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [delay],
  );
}

/**
 * A hook that throttles a function
 *
 * @param callback The function to throttle
 * @param delay The delay in milliseconds
 * @returns The throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<T>(callback);

  // Update the callback reference when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = delay - (now - lastRan.current);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (remaining <= 0) {
        // If enough time has passed, execute immediately
        lastRan.current = now;
        callbackRef.current(...args);
      } else {
        // Otherwise, schedule execution after the remaining time
        timeoutRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          callbackRef.current(...args);
        }, remaining);
      }
    },
    [delay],
  );
}
