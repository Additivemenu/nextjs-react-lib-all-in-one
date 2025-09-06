"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Message, ChatContextType } from "../types";
import { generateMockResponse } from "../utils";
import { chatReducer, initialChatState, type ChatAction } from "./chatReducer";

// Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider props
interface ChatProviderProps {
  children: ReactNode;
  initialMessages?: Message[];
}

// Provider component
export function ChatProvider({
  children,
  initialMessages = [],
}: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialChatState,
    messages: initialMessages,
  });

  // Actions
  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_TYPING", payload: true });
    dispatch({ type: "SET_CURRENT_INPUT", payload: "" });

    try {
      // Simulate API delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000),
      );

      const assistantResponse = await generateMockResponse(
        content,
        state.messages,
      );
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        metadata: { error: true },
      };
      dispatch({ type: "ADD_MESSAGE", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_TYPING", payload: false });
    }
  };

  const clearChat = () => {
    dispatch({ type: "CLEAR_CHAT" });
  };

  const setCurrentInput = (input: string) => {
    dispatch({ type: "SET_CURRENT_INPUT", payload: input });
  };

  const deleteMessage = (messageId: string) => {
    dispatch({ type: "DELETE_MESSAGE", payload: messageId });
  };

  const editMessage = (messageId: string, newContent: string) => {
    dispatch({
      type: "EDIT_MESSAGE",
      payload: { id: messageId, content: newContent },
    });
  };

  const value: ChatContextType = {
    ...state,
    sendMessage,
    clearChat,
    setCurrentInput,
    deleteMessage,
    editMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
