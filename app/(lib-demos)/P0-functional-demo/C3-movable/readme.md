# Movable — Draggable Wrapper

A generic `Movable` wrapper component that makes any child element freely draggable anywhere on screen using Pointer Events. The dragged position is persisted to `localStorage` and validated against the current viewport on mount.

## Key concepts

### Drag vs click distinction

Movement must exceed `DRAG_THRESHOLD` (2 px) before a drag is registered. Sub-threshold pointer-ups are treated as normal clicks and propagate to children unchanged.

### Pointer capture

`setPointerCapture()` is called once the threshold is exceeded, so `pointermove` events keep arriving even when the cursor leaves the element mid-drag.

```ts
if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
  hasDraggedRef.current = true;
  containerRef.current?.setPointerCapture(e.pointerId);
}
```

### Click suppression (capture phase)

The browser always fires a `click` event after `pointerup`. An `onClickCapture` handler intercepts and cancels it when a drag just finished, preventing accidental button activations inside the widget.

```ts
const handleClickCapture = (e: React.MouseEvent) => {
  if (hasDraggedRef.current) {
    e.stopPropagation();
    e.preventDefault();
    hasDraggedRef.current = false;
  }
};

<div onClickCapture={handleClickCapture}>…</div>
```

### Position persistence

Position is written to `localStorage` on drag-end via `onPointerUp`. On the next mount the stored value is read back and validated — if it falls outside the current viewport it is replaced with the default.

### Viewport clamping on resize

A `resize` event listener clamps the position to `[0, windowWidth - elementWidth]` × `[0, windowHeight - elementHeight]` whenever the window is resized.

### `useLayoutEffect` for bounds validation

Bounds checking runs inside `useLayoutEffect` (not `useEffect`) so any out-of-bounds correction happens synchronously after DOM paint but before the browser renders — making the jump invisible to the user.

```ts
useLayoutEffect(() => {
  const w = containerRef.current?.offsetWidth ?? FALLBACK_ELEMENT_SIZE;
  const h = containerRef.current?.offsetHeight ?? FALLBACK_ELEMENT_SIZE;
  if (!isPositionInBounds(positionRef.current, w, h)) {
    setPosition(fallback);
  }
}, []);
```

## Props

| Prop                    | Type        | Default                        | Description                                                     |
| ----------------------- | ----------- | ------------------------------ | --------------------------------------------------------------- |
| `children`              | `ReactNode` | —                              | Content to make draggable                                       |
| `defaultPosition`       | `{ x, y }`  | bottom-right corner            | Initial position when no stored position exists                 |
| `defaultPositionOffset` | `number`    | `136`                          | Distance from bottom-right used when no `defaultPosition` given |
| `storageKey`            | `string`    | `'draggable-wrapper-position'` | `localStorage` key for position persistence                     |
| `zIndex`                | `number`    | `10000`                        | CSS `z-index` of the fixed overlay                              |
