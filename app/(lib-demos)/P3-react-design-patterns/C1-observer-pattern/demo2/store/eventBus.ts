// src/store/eventBus.ts
import { create } from "zustand";

type EventCallback = (...args: any[]) => void;

interface EventBusStore {
  events: Record<string, EventCallback[]>;
  subscribe: (eventName: string, callback: EventCallback) => void;
  unsubscribe: (eventName: string, callback: EventCallback) => void;
  emit: (eventName: string, ...args: any[]) => void;
}

export const useEventBus = create<EventBusStore>((set, get) => ({
  events: {},
  subscribe: (eventName, callback) => {
    set((state) => ({
      events: {
        ...state.events,
        [eventName]: [...(state.events[eventName] || []), callback],
      },
    }));
  },
  unsubscribe: (eventName, callback) => {
    set((state) => ({
      events: {
        ...state.events,
        [eventName]: (state.events[eventName] || []).filter(
          (cb) => cb !== callback,
        ),
      },
    }));
  },
  emit: (eventName, ...args) => {
    const { events } = get();
    (events[eventName] || []).forEach((callback) => callback(...args));
  },
}));
