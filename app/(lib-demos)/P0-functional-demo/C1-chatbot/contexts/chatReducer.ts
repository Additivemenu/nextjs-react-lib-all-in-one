import { Message, ChatState } from "../types";

// Initial state
export const initialChatState: ChatState = {
  messages: [],
  isTyping: false,
  currentInput: "",
};

// Action types
export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "SET_CURRENT_INPUT"; payload: string }
  | { type: "CLEAR_CHAT" }
  | { type: "DELETE_MESSAGE"; payload: string }
  | { type: "EDIT_MESSAGE"; payload: { id: string; content: string } }
  | { type: "SET_MESSAGES"; payload: Message[] };

// Chat reducer function
export function chatReducer(state: ChatState, action: ChatAction): ChatState {
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
