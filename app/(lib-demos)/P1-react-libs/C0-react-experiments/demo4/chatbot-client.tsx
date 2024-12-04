"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ChatBot from "react-chatbotify";
import { observerCallback } from "./utils/observer-callback";
import { useSimpleFlow } from "./_hooks/use-simple-flow";

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

  useEffect(() => {
    // TODO: find the chatbotWindow and just observe its DOM changes as optimization
    // // setTimeout(() => {
    // // ! need to note chatbotWindow is only mounted after the chatbot is loaded
    // const chatbotWindow = document.querySelector(".rcb-chat-window");
    // console.log("chatbotWindow:", chatbotWindow);

    // if (!chatbotWindow) {
    //   alert("Chatbot window not found in DOM!");
    //   return;
    // }
    // // }, 1000);

    // Create and setup the observer ==================================================
    const observer = new MutationObserver(observerCallback);

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
          <ChatBot flow={flow} />
        </Suspense>
      )}
    </>
  );
};

export default ChatbotClient;
