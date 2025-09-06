"use client";

import { useChat } from "../contexts";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Download } from "lucide-react";

export function ChatActions() {
  const { messages, clearChat } = useChat();

  const handleExportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearChat = () => {
    if (
      messages.length > 0 &&
      window.confirm("Are you sure you want to clear all messages?")
    ) {
      clearChat();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportChat}
          disabled={messages.length === 0}
          title="Export chat history"
        >
          <Download size={14} className="mr-1" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          disabled={messages.length === 0}
          title="Clear all messages"
        >
          <Trash2 size={14} className="mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
}
