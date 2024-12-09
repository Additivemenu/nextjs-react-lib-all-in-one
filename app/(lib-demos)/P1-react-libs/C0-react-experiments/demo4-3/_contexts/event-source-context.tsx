import { styledLog } from "@/lib/styled-log";
import React, { createContext, useContext, useRef } from "react";

interface EventContextValue {
  eventSourceRef: React.RefObject<EventSource | null>;
  connect: (url: string) => void;
  disconnect: () => void;
}

/**
 * ! should keep event source obj as ref, instead of state
 */
const EventContext = createContext<EventContextValue>({
  eventSourceRef: { current: null },
  connect: () => {},
  disconnect: () => {},
});

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = (url: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const newEventSource = new EventSource(url);
      eventSourceRef.current = newEventSource;

      styledLog("Event source connection established");
    } catch (error) {
      console.error("Error in eventSource connection:", error);
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;

      styledLog("Event source connection closed");
    } else {
      console.warn("No event source connection to close");
    }
  };

  return (
    <EventContext.Provider
      value={{
        eventSourceRef,
        connect,
        disconnect,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventSource = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventSource must be used within an EventProvider");
  }
  return context;
};
