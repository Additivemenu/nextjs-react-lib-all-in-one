import { createCustomLoader } from "./replaceLoader";

export const observerCallback = (mutations: MutationRecord[]) => {
  console.log("mutations -------------------------------------", mutations);

  // ! rcb-bot-message-container > rcb-bot-message rcb-bot-message-entry > rcb-typing-indicator
  // while this observer only captures rcb-bot-message-container as addedNodes

  // Step1: identify the HTML structure: rcb-bot-message-container > rcb-bot-message rcb-bot-message-entry > rcb-typing-indicator
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
        chatbotMessageContainer.classList.contains("rcb-bot-message-container")
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

    console.warn("found typing indicator!", typingIndicator);

    // Step2: replace the typing indicator with our custom loader
    // TODO: there are 2 mode of the loader
    // 1. default loading spinner -> for normal conversations
    // 2. a step by step information that reveals backend tasks, which should be triggered by server event -> for chatbot api calls

    // // ! DOM change here
    // typingIndicator.style.display = "none";
    // // Add our custom loader
    // chatbotMessage.appendChild(createCustomLoader());
    // // TODO: add websocket or server event trigger status change of the loader and add new task tracker?

  
  });

  console.log("end of callback -------------------------------------");
};
