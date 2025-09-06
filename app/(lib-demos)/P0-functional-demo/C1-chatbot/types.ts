export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  metadata?: {
    typing?: boolean;
    error?: boolean;
    attachments?: Attachment[];
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentInput: string;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setCurrentInput: (input: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
}

export type ChatContextType = ChatState & ChatActions;
