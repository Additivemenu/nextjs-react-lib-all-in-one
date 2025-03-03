import { useState, useCallback } from "react";

interface UseCountProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * hook to manage a count value with increment, decrement and reset functionality
 * 
 * @param initialValue - the initial value of the count
 * @param min - the minimum value of the count
 * @param max - the maximum value of the count
 * @param step - the step value of the count
 * @returns the count value, the increment function, the decrement function, the reset function and the setCount function
 */
export const useCount = ({
  initialValue = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1
}: UseCountProps = {}) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + step;
      return next <= max ? next : prev;
    });
  }, [max, step]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = prev - step;
      return next >= min ? next : prev;
    });
  }, [min, step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  };
};
