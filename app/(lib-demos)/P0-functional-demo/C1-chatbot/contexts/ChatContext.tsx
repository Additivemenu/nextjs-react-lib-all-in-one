"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Message, ChatContextType, ChatState } from "../types";
import { generateMockResponse } from "../utils";

// Initial state
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  currentInput: "",
};

// Action types
type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_CURRENT_INPUT"; payload: string }
  | { type: "CLEAR_CHAT" }
  | { type: "DELETE_MESSAGE"; payload: string }
  | { type: "EDIT_MESSAGE"; payload: { id: string; content: string } }
  | { type: "SET_MESSAGES"; payload: Message[] };

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_TYPING":
      return {
        ...state,
        isTyping: action.payload,
      };
    case "SET_CURRENT_INPUT":
      return {
        ...state,
        currentInput: action.payload,
      };
    case "CLEAR_CHAT":
      return {
        ...state,
        messages: [],
      };
    case "DELETE_MESSAGE":
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };
    case "EDIT_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content }
            : msg,
        ),
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    default:
      return state;
  }
}

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
    ...initialState,
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
