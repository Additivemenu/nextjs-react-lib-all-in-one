import React from "react";

const FallbackPanel: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <h2 className="text-xl font-bold p-4">Fallback Panel</h2>
      <p className="px-4">
        Something went wrong. Please try again by clicking the button below.
        Error message: {error.message}
      </p>
      <button
        onClick={() => {
          alert("You clicked the button.");
          resetErrorBoundary();
        }}
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
      >
        Click me
      </button>
    </div>
  );
};

export default FallbackPanel;
