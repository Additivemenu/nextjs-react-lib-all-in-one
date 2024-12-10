import { set } from "zod";
// import { updateChatStatus } from "./dom/update-chat-status";
import { createTaskElement } from "../utils/dom/create-task-element";
import { completeTask } from "../utils/dom/complete-task";
import { useEventSource } from "../_contexts/event-source-context";
import { useRef } from "react";
import { styledLog } from "@/lib/styled-log";

interface ChatbotEvent {
  timestamp: string;
  taskName: string | null;
  taskIndex: number | null;
  type: "task_start" | "task_completed" | "chat_start" | "chat_completed";
}

export const useMutationObserverCallback = () => {
  const eventSourceContext = useEventSource();
  const timesFoundTypingIndicator = useRef<number>(0);

  const observerCallback = (mutations: MutationRecord[]) => {
    styledLog("start of callback", {
      fontColor: "black",
      backgroundColor: "lightgreen",
      fontSize: "20px",
    });
    console.log("mutations", mutations);

    // ! rcb-bot-message-container > rcb-bot-message rcb-bot-message-entry > rcb-typing-indicator
    // while this observer only captures rcb-bot-message-container as addedNodes

    // Step1: identify the HTML structure pattern: rcb-bot-message-container > rcb-bot-message rcb-bot-message-entry > rcb-typing-indicator
    // (it seems there are specialized tools to help with this process)
    // level1: rcb-bot-message-container level
    mutations.forEach((mutation) => {
      if (mutation.type !== "childList") {
        return;
      }

      // console.log("mutation inside forEach", mutation);
      if (mutation.addedNodes.length !== 1) {
        return;
      }

      const chatbotMessageContainer = mutation.addedNodes[0];
      if (
        !(
          chatbotMessageContainer instanceof HTMLElement &&
          chatbotMessageContainer.classList.contains(
            "rcb-bot-message-container",
          )
        )
      ) {
        return;
      }
      console.log("found chatbotMessageContainer!", chatbotMessageContainer);

      // level2: rcb-bot-message level
      if (Array.from(chatbotMessageContainer.children).length !== 1) {
        return;
      }

      const chatbotMessage = Array.from(chatbotMessageContainer.children)[0];
      if (
        !(
          chatbotMessage instanceof HTMLElement &&
          chatbotMessage.classList.contains("rcb-bot-message")
        )
      ) {
        return;
      }
      console.log("found chatbotMessage!", chatbotMessage);

      // level3: rcb-typing-indicator level -> we want to replace this with our custom loader component
      if (Array.from(chatbotMessage.children).length !== 1) {
        return;
      }
      const typingIndicator = Array.from(chatbotMessage.children)[0];
      if (
        !(
          typingIndicator instanceof HTMLElement &&
          typingIndicator.classList.contains("rcb-typing-indicator")
        )
      ) {
        return;
      }

      timesFoundTypingIndicator.current += 1;
      console.warn(
        "",
        timesFoundTypingIndicator.current,
        "th time found typing indicator!",
        typingIndicator,
      );

      if (timesFoundTypingIndicator.current <= 1) {
        // avoid SSE connection when chatbot is loaded
        return;
      }

      // ! DOM change here
      // Step2: replace the typing indicator with our custom loader
      // case1: if no server-sent event, it would just be like the normal loader
      // TODO: how to avoid build connection if it is a conversation other than chatbot api calls ?
      // - one way is to auto close the existing connection when we want to create a new one
      // only detect this state from backend and close the connection early?

      // ! case2:  Set up SSE connection
      // FIXME: how to avoid load below when first render?
      eventSourceContext.connect("http://localhost:8000/api/sse/chat-session"); // !synchronous
      if (eventSourceContext.eventSourceRef.current) {
        eventSourceContext.eventSourceRef.current.onmessage = (event) => {
          const chatbotEvent: ChatbotEvent = JSON.parse(event.data);

          if (chatbotEvent.type === "chat_start") {
            // typingIndicator.style.display = "none";
            // chatbotMessage.style.flexDirection = "column";
          } else if (chatbotEvent.type === "chat_completed") {
            eventSourceContext.disconnect(); // ! close the connection synchronously
          } else if (
            chatbotEvent.type === "task_start" &&
            chatbotEvent.taskName &&
            chatbotEvent.taskIndex !== null
          ) {
            if (chatbotEvent.taskIndex === 1) {
              typingIndicator.style.display = "none";
              chatbotMessage.style.flexDirection = "column";
            }

            const taskEl = createTaskElement(
              chatbotEvent.taskName,
              chatbotEvent.taskIndex,
            );
            chatbotMessage.appendChild(taskEl);
          } else if (
            chatbotEvent.type === "task_completed" &&
            chatbotEvent.taskIndex !== null
          ) {
            completeTask(chatbotEvent.taskIndex);
          }
        };
      } else {
        console.error("no event source connection available");
      }
    });

    styledLog("end of callback", {
      fontColor: "black",
      backgroundColor: "lightgreen",
      fontSize: "20px",
    });
  };

  return { observerCallback };
};
