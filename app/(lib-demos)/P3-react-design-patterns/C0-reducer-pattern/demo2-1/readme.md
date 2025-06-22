# Task Manager with Zustand + React Hook Form

This demo showcases a modern approach to state management using **Zustand** instead of the traditional Context + useReducer pattern, combined with **React Hook Form** for form handling.

## 🎯 Key Insights

### 1. **Zustand vs Context + useReducer**

**Benefits of Zustand:**

- **Simpler boilerplate** - No need for context providers wrapping components
- **Built-in state selection optimization** - Components only re-render when their specific state slice changes
- **More flexible state updates** - Direct state mutations without reducer switch statements
- **Better debugging** - Built-in Redux DevTools integration
- **Superior performance** - Internal optimizations and automatic memoization

### 2. **State Management Architecture**

```typescript
interface TaskStore extends TaskState {
  // Actions as methods instead of reducer actions
  addTask: (task: TaskFormData) => void;
  toggleTask: (id: number) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  setFilter: (filter: Partial<TaskState["filter"]>) => void;
  undo: () => void;
  redo: () => void;
}
```

### 3. **Immutable State Updates**

Every state mutation follows immutable patterns:

```typescript
// Example: Adding a task
const newTasks = [...state.tasks, newTask];
const newHistory = [
  ...state.history.slice(0, state.historyIndex + 1),
  newTasks,
];
```

### 4. **Undo/Redo Implementation**

The demo implements a sophisticated undo/redo system:

- **History tracking**: Maintains an array of task states
- **History index**: Tracks current position in history
- **Branching support**: When undoing and making new changes, old branches are pruned

### 5. **Form Validation with Zod**

```typescript
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum(["work", "personal", "shopping", "health"]),
  dueDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return parsedDate > new Date();
  }, "Due date must be in the future"),
});
```

### 6. **Component Architecture**

- **Separation of concerns**: Form logic, state management, and UI are cleanly separated
- **Reusable components**: Each feature is in its own component directory
- **FormProvider pattern**: Uses React Hook Form's FormProvider for form state sharing

### 7. **Testing Strategy**

The demo includes comprehensive tests covering:

- **Component rendering**: Verifies all UI elements are present
- **User interactions**: Tests form submission, filtering, and undo/redo
- **State verification**: Directly tests Zustand store state
- **Edge cases**: Future date validation, form reset behavior

### 8. **Performance Optimizations**

- **Selective subscriptions**: Components only subscribe to relevant state slices
- **DevTools integration**: Built-in debugging with Redux DevTools
- **Immutable updates**: Prevents unnecessary re-renders

## 🏗️ Architecture Overview

```
TaskManager (page.tsx)
├── FormProvider (react-hook-form)
├── AddTaskForm (form handling)
├── TaskFilter (filtering logic)
├── TaskList (task display)
└── RedoUndo (history management)
```

## 🔧 Key Technologies

- **Zustand**: State management
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Jest + Testing Library**: Testing

## 💡 Best Practices Demonstrated

1. **Type Safety**: Comprehensive TypeScript interfaces and Zod schemas
2. **Immutability**: All state updates create new objects/arrays
3. **Separation of Concerns**: Clear boundaries between form, state, and UI logic
4. **Testing**: Comprehensive test coverage with realistic user scenarios
5. **Developer Experience**: DevTools integration and clear error messages
6. **Performance**: Optimized re-renders through selective state subscriptions

## 🚀 Getting Started

1. Install dependencies
2. Run the development server
3. Open the demo page
4. Try adding tasks, filtering, and using undo/redo functionality
5. Open Redux DevTools to inspect state changes

This demo demonstrates how modern React patterns can simplify complex state management while maintaining excellent developer experience and performance.
