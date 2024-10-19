// src/components/ComponentB.tsx
import React, { useEffect, useState } from "react";
import { useEventBus } from "../store/eventBus";

export const ComponentB: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const { subscribe, unsubscribe, emit } = useEventBus();

  useEffect(() => {
    const handleMessage = (msg: string) => {
      setMessage(msg);
    };

    subscribe("newMessage", handleMessage);

    return () => {
      unsubscribe("newMessage", handleMessage);
    };
  }, [subscribe, unsubscribe]);

  const sendMessage = () => {
    emit("newMessage", "Hello from Component B!");
  };

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Component B</h2>
      <button
        onClick={sendMessage}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send Message
      </button>
      <p className="mt-2">Received: {message}</p>
    </div>
  );
};
