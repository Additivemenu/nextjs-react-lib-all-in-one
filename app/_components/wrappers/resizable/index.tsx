import React, {
  useState,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
} from "react";

export interface Dimensions {
  width: number;
  height: number;
}

export interface ResizableWrapperProps {
  children: ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  style?: CSSProperties;
  onResize?: (dimensions: Dimensions) => void;
}

type ResizeDirection = "width" | "height" | "both";

interface ResizeHandleProps {
  direction: ResizeDirection;
  className: string;
  children: ReactNode;
  onMouseDown: (
    e: React.MouseEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  className: handleClassName,
  children,
  onMouseDown,
}) => (
  <div
    className={`absolute ${handleClassName} group cursor-${
      direction === "both"
        ? "nw-resize"
        : direction === "width"
        ? "ew-resize"
        : "ns-resize"
    } flex items-center justify-center transition-all duration-200 hover:bg-blue-500 hover:bg-opacity-20`}
    onMouseDown={(e) => onMouseDown(e, direction)}
  >
    {children}
  </div>
);

/**
 * A wrapper component that allows the user to resize the container.
 *! unusual case where we handle some effects inside a callback function instead of a useEffect hook
 * @param param0
 * @returns
 */
export const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  children,
  initialWidth = 300,
  initialHeight = 200,
  minWidth = 100,
  minHeight = 100,
  maxWidth = 800,
  maxHeight = 600,
  className = "",
  style = {},
  onResize = () => {},
}) => {
  //! controls the dimensions of the container
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: initialWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startDimensions = useRef<Dimensions>({ width: 0, height: 0 });

  //! mouse down -> initialize the resizing set up
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);

    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };

    //! note when registering event listeners, need to make sure they refer to the latest
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    const cursor =
      direction === "both"
        ? "nw-resize"
        : direction === "width"
        ? "ew-resize"
        : "ns-resize";
    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";

    console.log(
      "mouse down",
      direction,
      startPos.current,
      startDimensions.current,
    );
  };

  //! mouse move -> resizing process
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    let newWidth = startDimensions.current.width;
    let newHeight = startDimensions.current.height;

    console.log("mouse move", deltaX, deltaY, resizeDirection);

    if (
      resizeDirection === "width"
      //  || resizeDirection === "both"
    ) {
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startDimensions.current.width + deltaX),
      );
    }

    if (
      resizeDirection === "height"
      // || resizeDirection === "both"
    ) {
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startDimensions.current.height + deltaY),
      );
    }

    const newDimensions: Dimensions = { width: newWidth, height: newHeight };
    setDimensions(newDimensions);
    onResize(newDimensions);
  };

  //! mouse up -> clear up
  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    console.log("mouse up");
  };

  return (
    <div
      ref={containerRef}
      className={`relative border-2 border-gray-300 rounded-lg ${
        isResizing ? "border-blue-500" : "hover:border-gray-400"
      } transition-colors ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        ...style,
      }}
    >
      {/* Main content */}
      <div className="w-full h-full p-4 overflow-hidden">{children}</div>

      {/* Resize handles */}
      {/* Right edge - width only */}
      <ResizeHandle
        direction="width"
        className="right-0 top-0 h-full w-2 -mr-1"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-6 bg-gray-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-blue-500 transition-all" />
      </ResizeHandle>

      {/* Bottom edge - height only */}
      <ResizeHandle
        direction="height"
        className="bottom-0 left-0 w-full h-2 -mb-1"
        onMouseDown={handleMouseDown}
      >
        <div className="h-1 w-6 bg-gray-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-blue-500 transition-all" />
      </ResizeHandle>

      {/* Bottom-right corner - both width and height */}
      <ResizeHandle
        direction="both"
        className="bottom-0 right-0 w-4 h-4 -mb-1 -mr-1"
        onMouseDown={handleMouseDown}
      >
        <div className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-all">
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full text-gray-400 group-hover:text-blue-500"
          >
            <path
              fill="currentColor"
              d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"
            />
          </svg>
        </div>
      </ResizeHandle>

      {/* Resize indicator when resizing */}
      {isResizing && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono">
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}
    </div>
  );
};
