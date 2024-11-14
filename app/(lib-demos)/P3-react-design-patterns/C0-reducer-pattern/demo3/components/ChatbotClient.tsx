"use client";
import { lazy, Suspense, useEffect, useState } from "react";

const ChatBot = lazy(() => import("react-chatbotify"));

export default function ChatbotClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // a potential task: can we overwrite the style of the toggle button?  like we alway hide it, but use another button to trigger the chatbot

  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot />
        </Suspense>
      )}
    </>
  );
}
