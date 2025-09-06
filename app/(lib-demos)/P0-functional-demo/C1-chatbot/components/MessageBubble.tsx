"use client";

import { useState } from "react";
import { Message } from "../types";
import { useChat } from "../contexts";
import { formatTimestamp } from "../utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Copy, Trash2, Edit, User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { deleteMessage } = useChat();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isUser = message.role === "user";
  const isError = message.metadata?.error;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  const formatContent = (content: string) => {
    // Basic markdown-like formatting for code blocks
    const parts = content.split(/```(\w*)\n([\s\S]*?)```/g);

    return parts.map((part, index) => {
      if (index % 3 === 0) {
        // Regular text
        return part.split("\n").map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < part.split("\n").length - 1 && <br />}
          </span>
        ));
      } else if (index % 3 === 1) {
        // Language identifier (skip)
        return null;
      } else {
        // Code block
        return (
          <pre
            key={index}
            className="bg-muted rounded p-2 my-2 text-sm overflow-x-auto"
          >
            <code>{part}</code>
          </pre>
        );
      }
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser ? "justify-end" : "justify-start",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar - only show for assistant */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot size={16} className="text-primary" />
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm break-words",
            isUser
              ? "bg-primary text-primary-foreground"
              : cn(
                  "bg-muted text-foreground",
                  isError &&
                    "bg-destructive/10 text-destructive border border-destructive/20",
                ),
          )}
        >
          <div className="whitespace-pre-wrap">
            {formatContent(message.content)}
          </div>
        </div>

        {/* Timestamp and Actions */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
            isUser ? "flex-row-reverse" : "flex-row",
          )}
        >
          <span>{formatTimestamp(message.timestamp)}</span>

          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-muted"
                onClick={handleCopy}
                title="Copy message"
              >
                <Copy size={12} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-muted"
                onClick={handleDelete}
                title="Delete message"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
