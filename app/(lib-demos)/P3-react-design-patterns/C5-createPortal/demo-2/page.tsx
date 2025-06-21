import React from "react";
import { ModalProvider } from "./contexts";
import { ModalRenderer } from "./renders";
import { ModalDemo } from "./demo";

// Main App Component that combines everything
const App: React.FC = () => {
  return (
    <ModalProvider>
      <ModalDemo />
      <ModalRenderer />
    </ModalProvider>
  );
};

export default App;
