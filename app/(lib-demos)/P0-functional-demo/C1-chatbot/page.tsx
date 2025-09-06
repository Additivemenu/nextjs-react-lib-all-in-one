"use client";

import { useState } from "react";
import { ChatInterface } from "./components";
import { ChatProvider } from "./contexts";
import { Message } from "./types";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Claude, an AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  return (
    <div className="h-full bg-background">
      <ChatProvider initialMessages={messages}>
        <div className="container mx-auto max-w-4xl">
          <header className="border-b border-border p-4">
            <h1 className="text-2xl font-semibold text-foreground">
              🤖 Claude-like Chatbot Demo
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              A scalable chatbot UI similar to Claude with extensible
              interaction logic
            </p>
          </header>

          <ChatInterface />
        </div>
      </ChatProvider>
    </div>
  );
}
