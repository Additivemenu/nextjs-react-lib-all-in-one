"use client";

import ChatBot from "react-chatbotify";
import { Flow } from "react-chatbotify";
import LoaderReplacer from "./loader-replacer";

const MyComponent = () => {
  const flow: Flow = {
    start: {
      message: "Hello there! What is your name?",
      path: "loop",
    },
    loop: {
      message: async (params) => {
        if (params.userInput === "sleep") {
          await new Promise((resolve) => setTimeout(resolve, 3600000));

          return "Ok, have a good day!";
        }

        return `Nice to meet you ${params.userInput}, what is your age?`;
      },
      path: "ask_pet",
    },
  };

  return (
    <div>
      <LoaderReplacer />
      <ChatBot flow={flow} />;
    </div>
  );
};

export default MyComponent;
