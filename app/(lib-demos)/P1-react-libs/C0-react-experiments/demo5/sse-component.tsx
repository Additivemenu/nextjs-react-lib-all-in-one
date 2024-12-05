"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Message {
  timestamp: string;
  value: number;
}

/**
 * find the counter part server code in my-django-project > myapp
 * one of the great benefit of using SSE over websocket is that it is easy to implement, no need to add any extra library and configuration
 * since it is based on HTTP, it is easy to implement and can be used with any server-side technology
 * but SSE only supports one-way communication, from server to client
 *
 * @returns
 */
const SSEComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSSE = () => {
    const eventSource = new EventSource("http://localhost:8000/api/myapp/sse");

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages.slice(-9), data]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      setIsConnected(false);
      setError("Connection failed. Please try again.");
      eventSource.close();
    };

    return eventSource;
  };

  const testEndpoint = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/myapp/event");
      const data = await response.json();

      setMessages((prevMessages) => [...prevMessages.slice(-9), data]);
      setError(null);
    } catch (err) {
      setError("Failed to fetch single event");
    }
  };

  useEffect(() => {
    const eventSource = startSSE();
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Real-time Updates
          <span
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Connected" : "Disconnected"}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <Button onClick={testEndpoint} className="mr-2">
            Get Single Event
          </Button>
          <Button
            onClick={() => {
              setMessages([]);
              startSSE();
            }}
          >
            Restart Stream
          </Button>
        </div>

        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="p-2 bg-gray-100 rounded flex justify-between items-center"
            >
              <span className="text-sm text-gray-600">{msg.timestamp}</span>
              <span className="font-medium">Value: {msg.value}</span>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              No events received yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SSEComponent;
