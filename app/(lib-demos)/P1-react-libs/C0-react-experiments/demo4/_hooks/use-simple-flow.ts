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
          await new Promise((resolve) => setTimeout(resolve, 10000));

          return "Ok, have a good day!";
        }

        return `Nice to meet you ${params.userInput}, what is your age?`;
      },
      path: "loop",
    },
  };

  return flow;
};
