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

  // ! watch chatbotWindow instead of the entire body
  // FIXME: but how to properly clean up the observer so that there is only 1 observer running at a time
  // useEffect(() => {
  //   let observer: MutationObserver | undefined;
  //   let isSetup = false; // Flag to track if observer was set up

  //   const waitForElement = async (selector: string): Promise<Element> => {
  //     console.log("Starting to wait for element:", selector);
  //     while (!document.querySelector(selector)) {
  //       await new Promise((resolve) => setTimeout(resolve, 500));
  //     }
  //     console.log("Element found:", selector);
  //     const ans = document.querySelector(selector)!;
  //     return ans;
  //   };

  //   const setupChatbotObserver = async () => {
  //     try {
  //       const chatbotWindow = await waitForElement(".rcb-chat-window");
  //       if (!chatbotWindow) {
  //         console.error("Chatbot window not found in DOM!");
  //         return;
  //       }
  //       console.warn("chatbotWindow found:", chatbotWindow);

  //       observer = new MutationObserver(observerCallback);
  //       observer.observe(chatbotWindow, {
  //         childList: true,
  //         subtree: true,
  //       });
  //       isSetup = true; // Mark as successfully set up
  //       console.log("Observer successfully set up");
  //     } catch (error) {
  //       console.error("Error setting up chatbot observer:", error);
  //     }
  //   };

  //   console.log("Effect running - setting up observer");
  //   setupChatbotObserver();

  //   // Cleanup function
  //   return () => {
  //     console.log("Cleanup function called");
  //     if (observer) {
  //       console.warn("Cleaning up observer!");
  //       observer.disconnect();
  //       observer = undefined;
  //       isSetup = false;
  //     } else {
  //       console.log("No observer to clean up");
  //     }
  //   };
  // }, []);

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

  // ! old way to register the observer -> watch the entire document.body
  // FIXME: how to just watch chatbotWindow instead of the entire body ? 
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
          <ChatBot flow={flow} settings={settings} />
        </Suspense>
      )}
    </>
  );
};

export default ChatbotClient;
