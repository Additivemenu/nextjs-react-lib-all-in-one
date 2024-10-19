"use client";

import { EffectCounter } from "./components/EffectCounter";
import { useSubscriber } from "./hooks/use-subscriber";

// Main page component
const Page: React.FC = () => {
  const subscriberLog = useSubscriber();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Zustand subscribe vs React useEffect
      </h1>
      <EffectCounter />

      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Subscriber Logs:</h2>
        <ul>
          {subscriberLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
