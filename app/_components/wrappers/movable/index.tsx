"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface Position {
  x: number;
  y: number;
}

export interface DraggableWrapperProps {
  children: React.ReactNode;
  /**
   * Initial position when no stored position exists.
   * Defaults to bottom-right corner offset by `defaultPositionOffset` pixels from each edge.
   */
  defaultPosition?: Position;
  /**
   * Distance in pixels from the bottom-right corner used to compute the
   * default position when no `defaultPosition` prop and no stored position exist.
   * Defaults to 136.
   */
  defaultPositionOffset?: number;
  /**
   * localStorage key used to persist the dragged position across sessions.
   * Defaults to 'draggable-wrapper-position'.
   */
  storageKey?: string;
  zIndex?: number;
}

const DRAG_THRESHOLD = 2;
const FALLBACK_ELEMENT_SIZE = 48;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function loadStoredPosition(storageKey: string): Position | null {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as Position;
    }
  } catch (e) {
    console.error("Failed to load draggable position", e);
  }
  return null;
}

function isPositionInBounds(
  position: Position,
  elementWidth: number,
  elementHeight: number,
): boolean {
  const maxX = window.innerWidth - elementWidth;
  const maxY = window.innerHeight - elementHeight;
  return (
    position.x >= 0 &&
    position.x <= maxX &&
    position.y >= 0 &&
    position.y <= maxY
  );
}

/**
 * A wrapper that makes its children draggable anywhere on screen using
 * pointer events. Position is persisted to localStorage between sessions.
 *
 * Distinguishes between a click and a drag — clicks with less than
 * DRAG_THRESHOLD pixels of movement are passed through to children normally.
 */
export function Movable({
  children,
  defaultPosition,
  defaultPositionOffset = 136,
  storageKey = "draggable-wrapper-position",
  zIndex = 10000,
}: DraggableWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    elemX: number;
    elemY: number;
    pointerId: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hasDraggedRef = useRef(false);
  const positionRef = useRef<Position>({ x: 0, y: 0 });

  const [position, setPosition] = useState<Position>(() => {
    const fallback = defaultPosition ?? {
      x: window.innerWidth - defaultPositionOffset,
      y: window.innerHeight - defaultPositionOffset,
    };
    const initial = loadStoredPosition(storageKey) ?? fallback;
    positionRef.current = initial;
    return initial;
  });

  useLayoutEffect(() => {
    const fallback = defaultPosition ?? {
      x: window.innerWidth - defaultPositionOffset,
      y: window.innerHeight - defaultPositionOffset,
    };
    const w = containerRef.current?.offsetWidth ?? FALLBACK_ELEMENT_SIZE;
    const h = containerRef.current?.offsetHeight ?? FALLBACK_ELEMENT_SIZE;
    if (!isPositionInBounds(positionRef.current, w, h)) {
      positionRef.current = fallback;
      setPosition(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMaxBounds = useCallback(() => {
    const w = containerRef.current?.offsetWidth ?? FALLBACK_ELEMENT_SIZE;
    const h = containerRef.current?.offsetHeight ?? FALLBACK_ELEMENT_SIZE;
    return {
      maxX: window.innerWidth - w,
      maxY: window.innerHeight - h,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        elemX: positionRef.current.x,
        elemY: positionRef.current.y,
        pointerId: e.pointerId,
      };
      hasDraggedRef.current = false;
      setIsDragging(true);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStartRef.current) return;

      const dx = e.clientX - dragStartRef.current.pointerX;
      const dy = e.clientY - dragStartRef.current.pointerY;

      if (
        !hasDraggedRef.current &&
        (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)
      ) {
        hasDraggedRef.current = true;
        containerRef.current?.setPointerCapture(dragStartRef.current.pointerId);
      }

      if (hasDraggedRef.current) {
        const { maxX, maxY } = getMaxBounds();
        const newPos: Position = {
          x: clamp(dragStartRef.current.elemX + dx, 0, maxX),
          y: clamp(dragStartRef.current.elemY + dy, 0, maxY),
        };
        positionRef.current = newPos;
        setPosition(newPos);
      }
    },
    [getMaxBounds],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (hasDraggedRef.current) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(positionRef.current));
        } catch (e) {
          console.error("Failed to save draggable position", e);
        }
        if (containerRef.current?.hasPointerCapture(e.pointerId)) {
          containerRef.current.releasePointerCapture(e.pointerId);
        }
      }

      dragStartRef.current = null;
      setIsDragging(false);
    },
    [storageKey],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        hasDraggedRef.current &&
        containerRef.current?.hasPointerCapture(e.pointerId)
      ) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
      dragStartRef.current = null;
      hasDraggedRef.current = false;
      setIsDragging(false);
    },
    [],
  );

  const handleClickCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (hasDraggedRef.current) {
        e.stopPropagation();
        e.preventDefault();
        hasDraggedRef.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    const handleResize = () => {
      const { maxX, maxY } = getMaxBounds();
      setPosition((prev) => {
        const clamped: Position = {
          x: clamp(prev.x, 0, maxX),
          y: clamp(prev.y, 0, maxY),
        };
        positionRef.current = clamped;
        return clamped;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getMaxBounds]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        zIndex,
      }}
    >
      {children}
    </div>
  );
}
