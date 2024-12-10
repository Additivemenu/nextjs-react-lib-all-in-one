import { Flow } from "react-chatbotify";

export const useSimpleFlow = () => {
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

  return flow;
};
