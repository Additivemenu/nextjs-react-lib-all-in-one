"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

export interface MovableDndProps {
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

function MovableDndInner({
  children,
  defaultPosition,
  defaultPositionOffset = 136,
  storageKey = "draggable-wrapper-position",
  zIndex = 10000,
}: MovableDndProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  // Track whether the current pointer sequence crossed the framer-motion drag
  // threshold so the follow-up click event can be suppressed (the browser
  // always dispatches a click after pointerUp, even at the end of a drag).
  const hasDraggedRef = useRef(false);

  const fallback = defaultPosition ?? {
    x: window.innerWidth - defaultPositionOffset,
    y: window.innerHeight - defaultPositionOffset,
  };
  const initial = loadStoredPosition(storageKey) ?? fallback;

  // framer-motion motion values drive the CSS transform directly, avoiding
  // React re-renders on every animation frame during a drag.
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);

  // dragConstraints tells framer-motion the live drag boundary, enforcing it
  // in real-time while the user is actively dragging the element.
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });

  // Recompute bounds from element dimensions and clamp the current motion
  // values so the element never sits outside the viewport (e.g. after resize
  // or when restoring a stored position from a larger screen).
  const updateBounds = useCallback(() => {
    const w = elementRef.current?.offsetWidth ?? FALLBACK_ELEMENT_SIZE;
    const h = elementRef.current?.offsetHeight ?? FALLBACK_ELEMENT_SIZE;
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;
    setDragConstraints({ left: 0, top: 0, right: maxX, bottom: maxY });
    x.set(clamp(x.get(), 0, maxX));
    y.set(clamp(y.get(), 0, maxY));
  }, [x, y]);

  // Measure after mount (element dimensions unavailable before then).
  useEffect(() => {
    updateBounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-clamp whenever the viewport is resized.
  useEffect(() => {
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [updateBounds]);

  const handleDragStart = useCallback(() => {
    hasDraggedRef.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    updateBounds();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ x: x.get(), y: y.get() }),
      );
    } catch (e) {
      console.error("Failed to save draggable position", e);
    }
  }, [updateBounds, storageKey, x, y]);

  // The browser dispatches a click after every pointerUp — including at the
  // end of a drag. Intercept it in the capture phase to stop it reaching child
  // interactive elements, then reset the flag for the next interaction.
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  }, []);

  return (
    <motion.div
      ref={elementRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        zIndex,
      }}
      whileDrag={{ cursor: "grabbing" }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClickCapture={handleClickCapture}
    >
      {children}
    </motion.div>
  );
}

/**
 * A wrapper that makes its children draggable anywhere on screen using
 * framer-motion. Position is persisted to localStorage between sessions.
 */
export function MovableDnd(props: MovableDndProps) {
  return <MovableDndInner {...props} />;
}
