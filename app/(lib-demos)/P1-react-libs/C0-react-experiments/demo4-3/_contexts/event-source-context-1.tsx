import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context state type
interface EventContextState {
  eventSource: EventSource | null;
  isConnected: boolean;
  lastEvent: any | null;
  error: Error | null;
}

// Define the context type including any methods
interface EventContextValue extends EventContextState {
  connect: (url: string) => void;
  disconnect: () => void;
}

// Create the context with initial values
const EventContext = createContext<EventContextValue>({
  eventSource: null,
  isConnected: false,
  lastEvent: null,
  error: null,
  connect: () => {},
  disconnect: () => {},
});

/**
 *
 * Create the context provider component
 * context represents a level of encapsulation
 *
 * @param param0
 * @returns
 */
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<EventContextState>({
    eventSource: null, // ! well, we should not treat eventSource as state
    isConnected: false,
    lastEvent: null,
    error: null,
  });

  const connect = (url: string) => {
    // Clean up any existing connection
    if (state.eventSource) {
      state.eventSource.close();
    }

    try {
      // ! other logic
      const newEventSource = new EventSource(url);

      newEventSource.onopen = () => {
        // ! state updates
        // setState((prev) => ({
        //   ...prev,
        //   isConnected: true,
        //   error: null,
        // }));
      };

      // ! TODO: how to provision the event handler in other components?
      newEventSource.onmessage = (event) => {
        console.log("in eventSource onmessage, the event data:", event.data);

        // ! state updates
        // setState((prev) => ({
        //   ...prev,
        //   lastEvent: JSON.parse(event.data),
        // }));
      };

      newEventSource.onerror = (error) => {
        // ! state updates
        // setState((prev) => ({
        //   ...prev,
        //   error: new Error("EventSource failed"),
        //   isConnected: false,
        // }));
      };

      // ! state updates
      setState((prev) => ({
        ...prev,
        eventSource: newEventSource,
      }));

      console.log(
        "%cEvent source connection established ",
        "color: blue; background: yellow; font-size: 16px; font-weight: bold;",
      );

      console.log("Event source connection established ********************");
    } catch (error) {
      console.error("error in eventSource connection:", error);

      // ! state updates
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isConnected: false,
      }));
    }
  };

  const disconnect = () => {
    debugger;

    if (state.eventSource) {
      // ! other logic
      state.eventSource.close();

      // ! state updates
      setState((prev) => ({
        ...prev,
        eventSource: null,
        isConnected: false,
      }));
      console.log(
        "%cEvent source connection closed ",
        "color: blue; background: yellow; font-size: 16px; font-weight: bold;",
      );
      console.warn("Event source connection closed");
    } else {
      // FIXME: why not found state.eventSource?
      console.warn("No event source connection to close");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (state.eventSource) {
        state.eventSource.close();
      }
    };
  }, []);

  return (
    <EventContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the context
export const useEventSource = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventSource must be used within an EventProvider");
  }
  return context;
};
