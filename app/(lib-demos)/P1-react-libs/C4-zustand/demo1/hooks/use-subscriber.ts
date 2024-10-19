import { useEffect, useState } from "react";
import { useStore } from "../store/counter";

// Custom hook for subscriber
export const useSubscriber = (): string[] => {
  const [subscriberLog, setSubscriberLog] = useState<string[]>([]);

  useEffect(() => {
    // ! still, subscribe to the store is a side effect that should be attached in useEffect
    const unsubscribe = useStore.subscribe((curState, prevState) => {
      // when the store state changes, run below code
      const newLog = `Subscriber: Count is previously ${JSON.stringify(
        prevState,
      )}, now is ${JSON.stringify(curState)}`;
      setSubscriberLog((prev) => [...prev, newLog]);
      console.log(newLog);
    });

    return () => unsubscribe();
  }, []);

  return subscriberLog;
};
