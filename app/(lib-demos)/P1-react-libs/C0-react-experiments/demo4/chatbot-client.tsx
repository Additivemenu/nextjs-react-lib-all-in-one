"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { RcbPostLoadChatBotEvent, Settings } from "react-chatbotify";
import { observerCallback } from "./utils/observer-callback";
import { useSimpleFlow } from "./_hooks/use-simple-flow";

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

  useEffect(() => {
    let observer: MutationObserver | undefined;

    const waitForElement = async (selector: string): Promise<Element> => {
      while (!document.querySelector(selector)) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      const ans = document.querySelector(selector)!;
      return ans;
    };

    // Function to wait for and observe chatbot window
    const setupChatbotObserver = async () => {
      // Function to wait for element to be available in DOM
      try {
        // Wait for chatbot window to be mounted
        const chatbotWindow = await waitForElement(".rcb-chat-window");
        if (!chatbotWindow) {
          console.error("Chatbot window not found in DOM!");
          return;
        }
        console.warn("chatbotWindow:", chatbotWindow);

        // Create and setup the observer
        observer = new MutationObserver(observerCallback);

        // Start observing the chatbot window
        observer.observe(chatbotWindow, {
          childList: true, // Watch for child elements being added/removed
          subtree: true, // Watch all descendants, not just direct children
        });
      } catch (error) {
        console.error("Error setting up chatbot observer:", error);
      }
    };

    // Call the setup function
    setupChatbotObserver();

    // Return cleanup function directly from useEffect
    return () => {
      if (observer) {
        console.warn("clean up observer!");
        observer.disconnect();
      }
    };
  }, []);

  // TODO: get the chatbotWindow but not working
  // useEffect(() => {
  //   const handlePostLoadChatBot = (
  //     event: CustomEvent<RcbPostLoadChatBotEvent>,
  //   ) => {
  //     // handle the post load chatbot event

  //     alert("chatbot loaded!");

  //     const chatbotWindow = document.querySelector(".rcb-chat-window");
  //     console.log("chatbotWindow:", chatbotWindow);

  //   };

  //   window.addEventListener("rcb-post-load-chatbot", handlePostLoadChatBot);
  //   return () => {
  //     window.removeEventListener(
  //       "rcb-post-load-chatbot",
  //       handlePostLoadChatBot,
  //     );
  //   };
  // }, []);

  // ! old way to register the observer
  // useEffect(() => {
  //   // TODO: find the chatbotWindow and just observe its DOM changes as optimization
  //   // // setTimeout(() => {
  //   // // ! need to note chatbotWindow is only mounted after the chatbot is loaded
  //   // const chatbotWindow = document.querySelector(".rcb-chat-window");
  //   // console.log("chatbotWindow:", chatbotWindow);

  //   // if (!chatbotWindow) {
  //   //   alert("Chatbot window not found in DOM!");
  //   //   return;
  //   // }
  //   // // }, 1000);

  //   // // Create and setup the observer ==================================================
  //   // const observer = new MutationObserver(observerCallback);

  //   // // Start observing with specific configuration
  //   // observer.observe(document.body, {
  //   //   childList: true, // Watch for child elements being added/removed
  //   //   subtree: true, // Watch all descendants, not just direct children
  //   // });

  //   // // Cleanup function
  //   // return () => observer.disconnect();
  // }, []);

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
