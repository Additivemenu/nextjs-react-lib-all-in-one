"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useChat } from "../contexts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

export function ChatInput() {
  const { sendMessage, currentInput, setCurrentInput, isTyping } = useChat();
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedInput = currentInput.trim();
    if (!trimmedInput || isTyping) return;

    await sendMessage(trimmedInput);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    // Auto-resize textarea
    const lineCount = value.split("\n").length;
    const newRows = Math.min(Math.max(lineCount, 1), 8); // Max 8 rows
    setRows(newRows);
  };

  // Auto-focus the input
  useEffect(() => {
    if (!isTyping && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isTyping]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isTyping
                ? "Claude is thinking..."
                : "Type your message... (Shift+Enter for new line)"
            }
            disabled={isTyping}
            rows={rows}
            className="min-h-[44px] max-h-[200px] resize-none pr-12"
            style={{
              height: "auto",
              minHeight: `${Math.max(rows * 20 + 24, 44)}px`,
            }}
          />

          {/* Attachment button (placeholder for future functionality) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-foreground"
            title="Attach files (coming soon)"
          >
            <Paperclip size={14} />
          </Button>
        </div>

        <div className="flex flex-col justify-end">
          <Button
            type="submit"
            disabled={!currentInput.trim() || isTyping}
            size="icon"
            className="h-11 w-11"
            title="Send message"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>

      {/* Input hints */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {isTyping
          ? "Claude is typing..."
          : "Press Enter to send, Shift+Enter for new line"}
      </div>
    </div>
  );
}
