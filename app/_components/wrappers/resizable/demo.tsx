import { useState } from "react";
import { Dimensions, ResizableWrapper } from ".";

// Demo component
const ResizableDemo: React.FC = () => {
  const [resizeCount, setResizeCount] = useState<number>(0);

  const handleResize = (dims: Dimensions) => {
    setResizeCount((c) => c + 1);
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Resizable Wrapper Demo
      </h1>

      <div className="space-y-8">
        <ResizableWrapper
          initialWidth={400}
          initialHeight={300}
          minWidth={200}
          minHeight={150}
          maxWidth={600}
          maxHeight={400}
          onResize={handleResize}
        >
          <div className="bg-gradient-to-br from-blue-400 to-purple-600 text-white p-6 rounded h-full flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-2">Resizable Content</h2>
            <p className="text-center mb-4">
              Drag the handles to resize this container!
            </p>
            <p className="text-sm opacity-90">Resize events: {resizeCount}</p>
          </div>
        </ResizableWrapper>

        <ResizableWrapper
          initialWidth={300}
          initialHeight={200}
          className="bg-white shadow-lg"
        >
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Another Example
            </h3>
            <div className="flex-1 bg-gray-100 rounded p-4 overflow-auto">
              <p className="text-gray-600 mb-2">
                This is a resizable container with:
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Drag the right edge to resize width</li>
                <li>• Drag the bottom edge to resize height</li>
                <li>• Drag the corner to resize both dimensions</li>
                <li>• Visual feedback during resize</li>
                <li>• Configurable min/max constraints</li>
              </ul>
            </div>
          </div>
        </ResizableWrapper>
      </div>

      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          TypeScript Features:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>• Fully typed props and state</div>
          <div>• Type-safe event handlers</div>
          <div>• Proper interface definitions</div>
          <div>• Generic type constraints</div>
          <div>• IntelliSense support</div>
          <div>• Compile-time error checking</div>
        </div>
      </div>
    </div>
  );
};

export default ResizableDemo;
