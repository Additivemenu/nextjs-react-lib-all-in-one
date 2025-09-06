# Claude-like Chatbot Demo

A React-based chatbot interface that mimics Claude's UI and behavior patterns. This implementation focuses on scalability and extensibility for adding new interaction logic.

## Features

### Core Functionality

- **Real-time messaging interface** with user and assistant messages
- **Typing indicators** to simulate AI thinking time
- **Message management** (copy, delete messages)
- **Auto-scrolling** to latest messages
- **Responsive design** with proper mobile support

### UI Components

- **Message bubbles** with distinct styling for user vs assistant
- **Auto-resizing input** that grows with content
- **Chat actions bar** for managing conversation
- **Export functionality** to save chat history

### Architecture

- **Context-based state management** using React Context + useReducer
- **Type-safe** implementation with TypeScript interfaces
- **Modular component structure** for easy maintenance
- **Mock AI responses** with topic detection and contextual replies

## Project Structure

```
C1-chatbot/
├── page.tsx                 # Main page component
├── types.ts                 # TypeScript type definitions
├── contexts/
│   └── ChatContext.tsx      # Global chat state management
├── components/
│   ├── ChatInterface.tsx    # Main chat UI container
│   ├── MessageBubble.tsx    # Individual message display
│   ├── ChatInput.tsx        # Message input with auto-resize
│   ├── TypingIndicator.tsx  # Loading animation
│   └── ChatActions.tsx      # Chat management controls
└── utils/
    └── mockAI.ts            # AI response simulation
```

## Key Design Patterns

### 1. Unidirectional Data Flow

- Data flows down from ChatContext to components
- Events bubble up through action dispatchers
- Clear separation between state and presentation

### 2. Context + Reducer Pattern

- Centralized state management with `useReducer`
- Predictable state updates through action dispatchers
- Easy to test and debug state changes

### 3. Component Composition

- Small, focused components with single responsibilities
- Reusable UI elements following shadcn/ui patterns
- Clean separation of concerns

### 4. Extensible Message System

- Flexible message interface supporting metadata
- Easy to add new message types (error, typing, attachments)
- Scalable for future enhancements

## Customization & Extension

### Adding New AI Response Types

Modify `utils/mockAI.ts` to add new topic detection or response patterns:

```typescript
const newTopicResponses = {
  science: ["From a scientific perspective...", "The research shows that..."],
};
```

### Adding New Message Features

Extend the `Message` interface in `types.ts`:

```typescript
interface Message {
  // ... existing fields
  metadata?: {
    typing?: boolean;
    error?: boolean;
    attachments?: Attachment[];
    reactions?: Reaction[]; // New feature
  };
}
```

### Integrating Real AI APIs

Replace the mock response logic in `ChatContext.tsx`:

```typescript
const sendMessage = async (content: string) => {
  // Replace generateMockResponse with actual API call
  const response = await fetch("/api/ai-chat", {
    method: "POST",
    body: JSON.stringify({ message: content }),
  });
  const data = await response.json();
  // Handle real API response...
};
```

## Technical Highlights

### Performance Optimizations

- **Auto-virtualization ready** - message list can handle large conversations
- **Efficient re-renders** with proper React patterns
- **Optimistic updates** for better UX

### Accessibility

- **Keyboard navigation** support
- **Screen reader friendly** with proper ARIA labels
- **Focus management** for smooth interactions

### Developer Experience

- **Full TypeScript coverage** for type safety
- **Clear component boundaries** for easy debugging
- **Extensible architecture** for feature additions

## Future Enhancements

### Planned Features

1. **File attachments** support
2. **Message reactions** and threading
3. **Conversation persistence** with local storage
4. **Real-time collaboration** with WebSockets
5. **Plugin system** for custom interactions
6. **Voice input/output** capabilities

### Integration Points

- **Authentication system** for user management
- **Backend API** for real AI integration
- **Database persistence** for chat history
- **Analytics tracking** for usage insights

## Usage Examples

### Basic Chat Flow

1. User types message and presses Enter
2. Message appears immediately in chat
3. Typing indicator shows while AI "thinks"
4. AI response appears with contextual content
5. Chat scrolls automatically to new messages

### Advanced Features

- **Shift+Enter** for multi-line messages
- **Export chat** to JSON for backup
- **Clear conversation** with confirmation
- **Copy individual messages** to clipboard

This implementation provides a solid foundation for building sophisticated chatbot interfaces while maintaining clean, maintainable code.
