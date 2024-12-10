"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { replaceLoadSpinner } from "./load-spinner";
import { useSimpleFlow } from "./_hooks/useSimpleFlow";
import "./load-spinner.css";

// import CustomChatHeader from "./_components/custom-chat-header";

const ChatBot = lazy(() => import("react-chatbotify"));

export default function ChatbotClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // track re-rendering count
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`Render count: ${renderCountRef.current}`);
  });

  // ! it seems this does not get triggered when typing indicator appears
  useEffect(() => {
    console.log("replace rcb loader effect");
    // debugger;
    replaceLoadSpinner();
  });

  const flow = useSimpleFlow();

  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot flow={flow} />
        </Suspense>
      )}
    </>
  );
}

