import WrappedChatbot from "./wrapped-chatbot";

/**
 *
 * a few challenges:
 * 1. mutation observer callback runs before chatbot flow message block
 *     -> difficulty in differentiating chat API response from other normal conversations
 * 2. optimization - how to only observe the chatbot window DOM mutations
 *     - how to get the chatbot window and then run the mutation observer registration
 *
 * @returns
 */
const Page = () => {
  return (
    <div>
      <WrappedChatbot />
    </div>
  );
};

export default Page;
