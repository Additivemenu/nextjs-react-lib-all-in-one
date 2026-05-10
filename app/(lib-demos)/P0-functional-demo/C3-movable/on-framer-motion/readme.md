# 1. MovableDnd — Framer-Motion Draggable Wrapper

A framer-motion alternative to the pointer-events `Movable` wrapper. Instead of handling raw pointer events manually, it delegates drag mechanics to `motion.div` — getting momentum-free, constraint-bound dragging with far less boilerplate.

## 1. Why framer-motion?

| Concern                     | Pointer-events (`Movable`)        | Framer-motion (`MovableDnd`)                      |
| --------------------------- | --------------------------------- | ------------------------------------------------- |
| Drag mechanics              | Manual `onPointerMove` math       | `drag` prop on `motion.div`                       |
| Render perf during drag     | `useState` → re-render each frame | `useMotionValue` → CSS transform, zero re-renders |
| Cursor style while dragging | Controlled via `isDragging` state | Declarative `whileDrag={{ cursor: 'grabbing' }}`  |
| Pointer capture             | Manual `setPointerCapture`        | Handled internally by framer-motion               |

## 2. Key concepts

### 2.1 `useMotionValue` — render-free motion state

`useMotionValue` stores a value that drives a CSS property directly through framer-motion's style system. Reading or writing it does **not** trigger a React re-render.

```ts
const x = useMotionValue(initial.x);
const y = useMotionValue(initial.y);

// Reading
x.get(); // current pixel value

// Writing (no re-render)
x.set(clamp(x.get(), 0, maxX));
```

### 2.2 `dragConstraints` — live viewport bounds

The `dragConstraints` prop accepts `{ left, top, right, bottom }` in pixels. It is computed from the element's measured size and updated on every `resize` event.

```ts
const [dragConstraints, setDragConstraints] = useState({
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
});

const updateBounds = useCallback(() => {
  const w = elementRef.current?.offsetWidth ?? FALLBACK_ELEMENT_SIZE;
  const h = elementRef.current?.offsetHeight ?? FALLBACK_ELEMENT_SIZE;
  const maxX = window.innerWidth - w;
  const maxY = window.innerHeight - h;
  setDragConstraints({ left: 0, top: 0, right: maxX, bottom: maxY });
  // Also clamp motion values in case the viewport shrank
  x.set(clamp(x.get(), 0, maxX));
  y.set(clamp(y.get(), 0, maxY));
}, [x, y]);
```

### 2.3 `dragMomentum={false}` and `dragElastic={0}`

- **`dragMomentum={false}`** — disables the post-release inertia animation so the element stops exactly where the user releases it.
- **`dragElastic={0}`** — disables rubber-band overshoot beyond the constraint boundary.

### 2.4 Click suppression

Identical pattern to the pointer-events version: framer-motion internally triggers `onDragStart` only after its own drag threshold is crossed. `hasDraggedRef` is set to `true` there, and `onClickCapture` consumes the follow-up `click` the browser always fires after `pointerUp`.

```ts
const handleClickCapture = (e: React.MouseEvent) => {
  if (hasDraggedRef.current) {
    e.stopPropagation();
    e.preventDefault();
    hasDraggedRef.current = false;
  }
};
```

### 2.5 Position persistence

On `onDragEnd`, the current `x.get()` / `y.get()` values are JSON-serialised into `localStorage`. On mount, the stored value is read back and used as the initial `useMotionValue`.

## 3. Props

| Prop                    | Type        | Default                        | Description                                                     |
| ----------------------- | ----------- | ------------------------------ | --------------------------------------------------------------- |
| `children`              | `ReactNode` | —                              | Content to make draggable                                       |
| `defaultPosition`       | `{ x, y }`  | bottom-right corner            | Initial position when no stored position exists                 |
| `defaultPositionOffset` | `number`    | `136`                          | Distance from bottom-right used when no `defaultPosition` given |
| `storageKey`            | `string`    | `'draggable-wrapper-position'` | `localStorage` key for position persistence                     |
| `zIndex`                | `number`    | `10000`                        | CSS `z-index` of the fixed overlay                              |

## 4. Comparison with `Movable` (pointer-events)

Both wrappers expose the same props and behave identically from the outside. The difference is entirely in the implementation:

- **`Movable`** — zero dependencies beyond React; handles every pointer event manually.
- **`MovableDnd`** — depends on framer-motion; shorter implementation, render-free motion values, and declarative animation variants (`whileDrag`).
