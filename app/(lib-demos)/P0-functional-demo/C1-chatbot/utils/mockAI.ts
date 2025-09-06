import { Message } from "../types";

// Mock AI responses to simulate Claude-like behavior
const mockResponses = [
  "That's an interesting question! Let me think about that...",
  "I understand what you're asking. Here's my perspective on this:",
  "That's a great point. Let me elaborate on that topic:",
  "I'd be happy to help you with that. Here's what I think:",
  "That's a thoughtful question. Let me break this down for you:",
  "I can definitely help you understand this better:",
  "That's something I can assist with. Here's my analysis:",
  "Good question! Let me provide you with some insights:",
  "I see what you're getting at. Here's how I would approach this:",
  "That's an excellent question. Let me share my thoughts:",
];

const topicResponses: Record<string, string[]> = {
  code: [
    "Here's how you could approach this coding problem:",
    "Let me help you with that code. Here's a solution:",
    "That's a good programming question. Here's my suggestion:",
    "I can help you debug this. Let's look at the issue:",
  ],
  math: [
    "Let me solve this mathematical problem step by step:",
    "Here's how to approach this math problem:",
    "I'll walk you through the mathematical solution:",
    "Let me break down this calculation for you:",
  ],
  help: [
    "I'm here to help! What specifically would you like assistance with?",
    "I'd be happy to help you with that. Could you provide more details?",
    "I'm designed to assist with various tasks. How can I help you today?",
    "I'm ready to help! What would you like to know?",
  ],
  hello: [
    "Hello! It's nice to meet you. How can I assist you today?",
    "Hi there! I'm Claude, and I'm here to help. What can I do for you?",
    "Greetings! How can I help you today?",
    "Hello! What would you like to chat about?",
  ],
  default: mockResponses,
};

function detectTopic(message: string): keyof typeof topicResponses {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("program") ||
    lowerMessage.includes("function")
  ) {
    return "code";
  }
  if (
    lowerMessage.includes("math") ||
    lowerMessage.includes("calculate") ||
    lowerMessage.includes("equation")
  ) {
    return "math";
  }
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("assist") ||
    lowerMessage.includes("support")
  ) {
    return "help";
  }
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "hello";
  }

  return "default";
}

function addContextualContent(topic: string, userMessage: string): string {
  const examples: Record<string, string> = {
    code: `

\`\`\`javascript
// Example code
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

This demonstrates a basic function structure. Would you like me to explain any specific part?`,
    math: `

For example:
- Step 1: Identify the variables
- Step 2: Apply the relevant formula  
- Step 3: Solve systematically

Would you like me to work through a specific problem?`,
    help: `

I can assist with:
- Programming and coding questions
- Mathematical problems
- General information and explanations
- Creative writing and brainstorming
- Analysis and research

What specific area interests you?`,
    default: `

Based on your message "${userMessage.substring(0, 50)}${
      userMessage.length > 50 ? "..." : ""
    }", I think this topic has several interesting aspects we could explore further.

Would you like me to dive deeper into any particular aspect?`,
  };

  return examples[topic] || examples.default;
}

export async function generateMockResponse(
  userMessage: string,
  conversationHistory: Message[] = [],
): Promise<string> {
  const topic = detectTopic(userMessage);
  const responses = topicResponses[topic];
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];

  // Add some contextual content based on the topic
  const contextualContent = addContextualContent(topic, userMessage);

  // Sometimes add a follow-up question to make it more conversational
  const followUpQuestions = [
    "Is there anything specific about this you'd like me to clarify?",
    "Would you like me to elaborate on any particular aspect?",
    "Do you have any other questions related to this?",
    "Is this helpful, or would you like me to approach it differently?",
    "Would you like to explore this topic further?",
  ];

  const shouldAddFollowUp = Math.random() > 0.4; // 60% chance
  const followUp = shouldAddFollowUp
    ? `\n\n${
        followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]
      }`
    : "";

  return `${baseResponse}${contextualContent}${followUp}`;
}

// Helper function to format timestamps
export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
