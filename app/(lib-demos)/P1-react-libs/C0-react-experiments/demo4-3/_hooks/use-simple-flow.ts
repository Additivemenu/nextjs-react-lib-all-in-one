import { Flow } from "react-chatbotify";
import { useEventSource } from "../_contexts/event-source-context";

export const useSimpleFlow = () => {
  const eventSourceContext = useEventSource();

  const flow: Flow = {
    start: {
      message: "Hello there! What is your name?",
      path: "loop",
    },
    loop: {
      message: async (params) => {
        console.log(
          "**************** inside chatbot flow: loop block message start****************",
        );

        if (params.userInput === "sleep") {
          // FIXME:  a problem is that, the observer callback gets triggered before any code runs in this block
          // eventSourceContext.connect(
          //   "http://localhost:8000/api/sse/chat-session",
          // );

          await new Promise((resolve) => setTimeout(resolve, 20000)); // simulate chat api call

          // TODO: should trigger closing connection with SSE api here
          // eventSourceContext.disconnect();

          return "Ok, have a good day!";
        }

        console.log(
          "**************** inside chatbot flow: loop block message end ****************",
        );

        return `Nice to meet you ${params.userInput}, what is your age?`;
      },
      path: "loop",
    },
  };

  return flow;
};
