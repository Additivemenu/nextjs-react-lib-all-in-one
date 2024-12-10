"use client";

import React from "react";
import ChatbotClient from "./chatbot-client";
import { EventProvider } from "./_contexts/event-source-context";

const WrappedChatbot = () => {
  return (
    <div>
      <EventProvider>
        <ChatbotClient />
      </EventProvider>
    </div>
  );
};

export default WrappedChatbot;
