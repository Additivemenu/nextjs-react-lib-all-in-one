Here are the core design principles and thinking behind this modal manager:

## 🏗️ **Core Design Principles**

### **1. Stack-Based Architecture**
```typescript
// Each modal gets a unique ID and z-index position
const modal: ModalData = {
  id: modalId,
  component: modalComponent,
  props: modalProps,
  zIndex: 1000 + modals.length  // Auto-incrementing z-index
};
```
**Thinking**: Modals should behave like a stack (LIFO) - the last opened should be on top and first to close. This mimics natural user expectations and operating system behavior.

### **2. Centralized State Management**
```typescript
// Single source of truth for all modals
const [modals, setModals] = useState<ModalData[]>([]);
```
**Thinking**: Instead of each modal managing its own state, centralize everything. This enables:
- Global operations (close all, count modals)
- Consistent z-index management
- Easy debugging and state inspection

### **3. Declarative API**
```typescript
// Simple, declarative modal opening
openModal(ConfirmModal, {
  title: "Delete Item",
  onConfirm: () => handleDelete()
});
```
**Thinking**: Developers should describe *what* they want (open a confirm modal) rather than *how* to do it (create portal, manage DOM, handle cleanup). This reduces boilerplate and errors.

### **4. Component Isolation**
```typescript
// Each modal is a self-contained React component
<ModalComponent onClose={() => closeModal(modal.id)} {...modal.props} />
```
**Thinking**: Modals should be regular React components that don't know about the modal system. This enables:
- Easy testing in isolation
- Reusability outside the modal system
- Standard React patterns

### **5. Portal-Based Rendering**
```typescript
return createPortal(modalElement, document.body);
```
**Thinking**: Render modals at the document root to avoid:
- CSS stacking context issues
- Overflow hidden problems
- Z-index conflicts with parent elements

## 🧠 **Key Design Decisions**

### **Event Handling Strategy**
```typescript
// ESC only closes top modal, click-outside closes specific modal
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && modals.length > 0) {
    closeTopModal(); // Only top modal
  }
};

onClick={(e) => {
  if (e.target === e.currentTarget) {
    closeModal(modal.id); // Specific modal
  }
}}
```
**Thinking**: Different interaction patterns for different intentions:
- **ESC key**: User wants to "go back" → close top modal
- **Click outside**: User wants to close "this specific modal" → close that one

### **Progressive Backdrop Opacity**
```typescript
backgroundColor: `rgba(0, 0, 0, ${0.1 + (modals.indexOf(modal) * 0.1)})`
```
**Thinking**: Visual feedback that modals are stacking. Each layer adds more darkness, making it clear which modal is "deeper" in the stack.

### **Flexible Component Props**
```typescript
const openModal = <T extends Record<string, any>>(
  modalComponent: ComponentType<T & { onClose: () => void }>, 
  modalProps?: T
) => string;
```
**Thinking**: Type-safe flexibility - any component can be a modal as long as it accepts `onClose`. This enables:
- Custom modal types
- Third-party components
- Future extensibility

## 🎯 **Architecture Benefits**

### **Separation of Concerns**
- **ModalContext**: State management + business logic
- **ModalRenderer**: Rendering + DOM management  
- **ModalComponents**: UI + user interactions
- **Demo**: Usage examples

### **Inversion of Control**
```typescript
// Framework controls the "how", developer controls the "what"
openModal(MyCustomModal, { data: user, onSave: handleSave });
```
The modal manager handles opening/closing/stacking, while developers focus on modal content and behavior.

### **Composability**
```typescript
// Modals can open other modals naturally
const ParentModal = ({ onClose }) => (
  <div>
    <button onClick={() => openModal(ChildModal)}>
      Open Child Modal
    </button>
  </div>
);
```

### **Memory Management**
```typescript
// Automatic cleanup when modals close
closeModal(modalId) // Removes from array, React handles cleanup
```
No memory leaks - when modals are removed from state, React automatically unmounts components and cleans up event listeners.

## 🔧 **Error Prevention by Design**

### **Context Boundary**
```typescript
if (!context) {
  throw new Error('useModal must be used within a ModalProvider');
}
```
**Thinking**: Fail fast with clear error messages rather than mysterious undefined behavior.

### **Event Propagation Control**
```typescript
onClick={(e) => e.stopPropagation()} // Prevent modal content clicks from closing modal
```
**Thinking**: Prevent accidental modal closure when interacting with modal content.

### **TypeScript Constraints**
```typescript
ComponentType<T & { onClose: () => void }>
```
**Thinking**: Compiler enforces that modal components must accept `onClose`, preventing runtime errors.

## 🚀 **Scalability Considerations**

- **Performance**: Only renders active modals, no hidden DOM nodes
- **Bundle size**: Modular exports, import only what you need
- **Extensibility**: Easy to add new modal types without touching core code
- **Testing**: Each component can be tested in isolation
- **Maintenance**: Clear separation makes debugging and updates easier

This design creates a robust, scalable modal system that feels natural to use while handling the complex edge cases that make modal management challenging.