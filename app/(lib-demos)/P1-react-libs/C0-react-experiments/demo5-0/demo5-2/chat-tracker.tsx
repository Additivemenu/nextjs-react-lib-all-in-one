"use client";

import React, { useEffect, useRef } from "react";
import { AlertCircle, MessageSquare } from "lucide-react";
import { completeTask } from "./utils/complete-task";
import { createTaskElement } from "./utils/create-task-element";
import { updateChatStatus } from "./utils/update-chat-status";

interface ChatbotEvent {
  timestamp: string;
  taskName: string | null;
  taskIndex: number | null;
  type: "task_start" | "task_completed" | "chat_start" | "chat_completed";
}

/**
 * same as demo5-1: find the server code in my-django-project > my_sse_app
 * @returns 
 */
const ChatTracker = () => {
  const trackerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackerRef.current || !statusRef.current) return;

    //!  Set up SSE connection
    const eventSource = new EventSource(
      "http://localhost:8000/api/sse/chat-session",
    );

    eventSource.onmessage = (event) => {
      const chatbotEvent: ChatbotEvent = JSON.parse(event.data);

      if (
        chatbotEvent.type === "chat_start" ||
        chatbotEvent.type === "chat_completed"
      ) {
        updateChatStatus(chatbotEvent.type);
      } else if (
        chatbotEvent.type === "task_start" &&
        chatbotEvent.taskName &&
        chatbotEvent.taskIndex !== null
      ) {
        const taskEl = createTaskElement(
          chatbotEvent.taskName,
          chatbotEvent.taskIndex,
        );
        trackerRef.current?.appendChild(taskEl);
      } else if (
        chatbotEvent.type === "task_completed" &&
        chatbotEvent.taskIndex !== null
      ) {
        completeTask(chatbotEvent.taskIndex);
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Chat Status</h2>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-lg">
          <div ref={statusRef} id="chat-status-board" className="text-gray-500">
            Waiting for chat to start...
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Task Tracker</h2>
        </div>
        <div ref={trackerRef} className="space-y-4">
          {/* Tasks will be inserted here using DOM manipulation */}
        </div>
      </div>
    </div>
  );
};

export default ChatTracker;
