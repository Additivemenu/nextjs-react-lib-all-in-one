# Modal Manager

A complete modal management system built as a composite component pattern using React Context and Portals.

## Features

- ✅ **Modal Stacking**: Multiple modals can stack on top of each other
- ✅ **HTML & Tailwind CSS**: Built with vanilla HTML elements and Tailwind CSS
- ✅ **Portal Rendering**: Modals are rendered at document.body level
- ✅ **Context-based API**: Control modals using the `useModalManager()` hook
- ✅ **Backdrop Click**: Close modals by clicking the backdrop (configurable)
- ✅ **Escape Key**: Press ESC to close the topmost modal
- ✅ **Body Scroll Lock**: Prevents background scrolling when modals are open
- ✅ **Z-index Management**: Automatic z-index calculation for proper stacking

## Installation

All components are located in `/app/_components/modals/modal-manager/`:

```tsx
import { Modal, ModalContent, useModalManager } from "./modal-manager";
```

## Usage

### Basic Example

```tsx
import { Modal, ModalContent, useModalManager } from "./modal-manager";

function MyComponent() {
  const { openModal, closeModal } = useModalManager();

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => openModal("my-modal")}>Open Modal</button>

      {/* Modal content */}
      <ModalContent id="my-modal">
        <div className="bg-white p-8 rounded-lg">
          <h2>My Modal</h2>
          <button onClick={() => closeModal("my-modal")}>Close</button>
        </div>
      </ModalContent>
    </>
  );
}

function App() {
  return (
    <Modal>
      <MyComponent />
    </Modal>
  );
}
```

### Stacked Modals Example

```tsx
function MyComponent() {
  const { openModal, closeModal } = useModalManager();

  return (
    <>
      <button onClick={() => openModal("modal1")}>Open Modal 1</button>

      <ModalContent id="modal1">
        <div className="bg-white p-8 rounded-lg">
          <h2>First Modal</h2>
          <button onClick={() => openModal("modal2")}>Open Second Modal</button>
          <button onClick={() => closeModal("modal1")}>Close</button>
        </div>
      </ModalContent>

      <ModalContent id="modal2">
        <div className="bg-white p-8 rounded-lg">
          <h2>Second Modal</h2>
          <p>This stacks on top of the first modal</p>
          <button onClick={() => closeModal("modal2")}>Close</button>
        </div>
      </ModalContent>
    </>
  );
}

function App() {
  return (
    <Modal>
      <MyComponent />
    </Modal>
  );
}
```

## API Reference

### Components

#### `<Modal>`

The provider component that manages modal state. Wrap your app or component tree with this.

```tsx
<Modal>{children}</Modal>
```

#### `<ModalContent>`

Individual modal wrapper component.

**Props:**

- `id` (string, required): Unique identifier for the modal
- `children` (ReactNode, required): Modal content to render
- `onBackdropClick` (function, optional): Callback when backdrop is clicked
- `closeOnBackdropClick` (boolean, optional): Whether to close on backdrop click (default: `true`)
- `className` (string, optional): Additional CSS classes for the modal container

```tsx
<ModalContent
  id="my-modal"
  closeOnBackdropClick={true}
  onBackdropClick={() => console.log("Backdrop clicked")}
>
  {/* Your modal content */}
</ModalContent>
```

### API

#### `useModalManager()`

React hook that provides access to the modal manager context. Must be used within a `<Modal>` provider.

**Returns:**

- `openModal(id: string)` - Opens a modal by ID
- `closeModal(id: string)` - Closes a modal by ID
- `closeAllModals()` - Closes all open modals
- `isModalOpen(id: string)` - Checks if a modal is open
- `activeModalIds` - Array of currently open modal IDs

```tsx
function MyComponent() {
  const { openModal, closeModal, closeAllModals, isModalOpen, activeModalIds } =
    useModalManager();

  // Check if a modal is open
  const isOpen = isModalOpen("modal1");

  // Get all open modal IDs
  console.log(activeModalIds); // ['modal1', 'modal2']

  return (
    <>
      <button onClick={() => openModal("modal1")}>Open Modal 1</button>
      <button onClick={() => closeModal("modal1")}>Close Modal 1</button>
      <button onClick={closeAllModals}>Close All</button>
    </>
  );
}
```

## Implementation Details

### File Structure

```text
modal-manager/
├── index.ts                    # Main exports
├── Modal.tsx                   # Provider component
├── ModalContent.tsx            # Individual modal component
├── ModalManagerContext.tsx     # Context definition
├── demo.tsx                    # Demo/example usage
└── readme.md                   # This file
```

### How It Works

1. **State Management**: The `Modal` provider maintains an array of active modal IDs in React state
2. **Context API**: The `useModalManager` hook provides access to modal control functions via React Context
3. **Portal Rendering**: Each `ModalContent` uses `createPortal` to render at `document.body`
4. **Z-index Calculation**: Modals calculate z-index based on their position in the stack (1000, 1010, 1020, etc.)
5. **Escape Key**: Only the topmost modal responds to ESC key press
6. **Body Scroll**: Prevents scrolling when any modal is open

### Styling

Modals use Tailwind CSS classes:

- `fixed inset-0`: Full-screen overlay
- `flex items-center justify-center`: Centers content
- `bg-black/50`: Semi-transparent backdrop
- `max-h-[90vh] max-w-[90vw]`: Constrains modal size
- `overflow-auto`: Allows scrolling for large content

You can customize by:

1. Adding `className` prop to `ModalContent`
2. Styling your modal content directly
3. Modifying the component's default styles

## Demo

See `demo.tsx` for a complete working example with multiple stacked modals.

## Notes

- Modals must have unique IDs
- The `Modal` provider should wrap your component tree at an appropriate level
- Opening the same modal ID twice has no effect (prevents duplicates)
- Only one `Modal` provider should be used per app (unless you need isolated modal contexts)
