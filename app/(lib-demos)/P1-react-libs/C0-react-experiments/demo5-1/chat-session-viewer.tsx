"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react";

// Types
type EventType =
  | "task_start"
  | "task_completed"
  | "chat_start"
  | "chat_completed";

interface ChatbotEvent {
  timestamp: string;
  taskName: string | null;
  taskIndex: number | null;
  type: EventType;
}

interface TaskStatus {
  taskName: string;
  taskIndex: number;
  status: "pending" | "completed";
  startTime: string;
  endTime?: string;
}

/**
 * find the counter part server code in my-django-project > my_sse_app
 * @returns 
 */
const ChatSessionViewer = () => {
  const [events, setEvents] = useState<ChatbotEvent[]>([]);
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [chatStatus, setChatStatus] = useState<
    "inactive" | "active" | "completed"
  >("inactive");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/api/sse/chat-session",
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const newEvent: ChatbotEvent = JSON.parse(event.data);
      setEvents((prev) => [...prev, newEvent]);

      // Update chat status
      if (newEvent.type === "chat_start") {
        setChatStatus("active");
      } else if (newEvent.type === "chat_completed") {
        setChatStatus("completed");
        eventSource.close();
      }

      // Update tasks
      if (
        newEvent.type === "task_start" &&
        newEvent.taskName &&
        newEvent.taskIndex !== null
      ) {
        setTasks((prev) => [
          ...prev,
          {
            taskName: newEvent.taskName!,
            taskIndex: newEvent.taskIndex!,
            status: "pending",
            startTime: newEvent.timestamp,
          },
        ]);
      } else if (
        newEvent.type === "task_completed" &&
        newEvent.taskName &&
        newEvent.taskIndex !== null
      ) {
        setTasks((prev) =>
          prev.map((task) =>
            task.taskIndex === newEvent.taskIndex
              ? { ...task, status: "completed", endTime: newEvent.timestamp }
              : task,
          ),
        );
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? "Connected to event stream" : "Disconnected"}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Chat Session Status</h2>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-lg">
          {chatStatus === "inactive" && (
            <span className="text-gray-500">Waiting for chat to start...</span>
          )}
          {chatStatus === "active" && (
            <span className="text-green-500">Chat session in progress</span>
          )}
          {chatStatus === "completed" && (
            <span className="text-blue-500">Chat session completed</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Tasks Progress</h2>
        </div>
        {tasks.map((task) => (
          <div key={task.taskIndex} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {task.status === "pending" ? (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <span className="font-medium">{task.taskName}</span>
              </div>
              <span className="text-sm text-gray-500">
                Task {task.taskIndex}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Start: {new Date(task.startTime).toLocaleTimeString()}</div>
              {task.endTime && (
                <div>End: {new Date(task.endTime).toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Event Log</h2>
        </div>
        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="text-sm mb-2">
              <span className="text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              {" - "}
              <span className="font-medium">{event.type}</span>
              {event.taskName && (
                <span className="text-gray-600"> - {event.taskName}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSessionViewer;
