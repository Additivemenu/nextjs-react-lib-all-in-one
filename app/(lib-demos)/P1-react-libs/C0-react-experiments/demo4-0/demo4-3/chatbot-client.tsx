"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { RcbPostLoadChatBotEvent, Settings } from "react-chatbotify";
// import { observerCallback } from "./utils/observer-callback";
import { useSimpleFlow } from "./_hooks/use-simple-flow";
import { useMutationObserverCallback } from "./_hooks/use-mutation-observer-callback";

const ChatBot = lazy(() => import("react-chatbotify"));

const ChatbotClient = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [findWindow, setFindWindow] = useState(false);

  // track re-rendering count
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`Render count: ${renderCountRef.current}`);
  });

  const flow = useSimpleFlow();
  const settings: Settings = {
    event: {
      rcbPostLoadChatBot: true,
    },
  };

  const { observerCallback } = useMutationObserverCallback();

  // FIXME: it seems the observer callback gets triggered before SSE connection is established
  // FIXME: how to just watch chatbotWindow instead of the entire body ?
  useEffect(() => {
    // TODO: find the chatbotWindow and just observe its DOM changes as optimization

    // Create and setup the observer ==================================================
    const observer = new MutationObserver(observerCallback); // ! when observed DOM has mutations, call the callback

    // Start observing with specific configuration
    observer.observe(document.body, {
      childList: true, // Watch for child elements being added/removed
      subtree: true, // Watch all descendants, not just direct children
    });

    // Cleanup function
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot flow={flow} settings={settings} />
        </Suspense>
      )}
    </>
  );
};

export default ChatbotClient;
