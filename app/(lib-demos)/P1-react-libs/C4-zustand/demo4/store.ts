// // src/store.ts
// import { create } from "zustand";
// import * as O from "optics-ts";
// import { TodoState, Todo } from "./types";

// const initialState: TodoState = {
//   todos: [],
//   selectedTodoId: null,
//   filter: "all",
// };

// // State transformations
// const $addTodo =
//   (text: string) =>
//   (state: TodoState): TodoState => {
//     const todosOptic = O.optic<TodoState>().prop("todos");
//     const newTodo: Todo = {
//       id: Math.random().toString(36).substr(2, 9),
//       text,
//       completed: false,
//       priority: "medium",
//     };

//     return O.modify(todosOptic, (todos) => [...todos, newTodo])(state);
//   };

// const $toggleTodo =
//   (id: string) =>
//   (state: TodoState): TodoState => {
//     const todosOptic = O.optic<TodoState>().prop("todos");
//     return O.modify(todosOptic, (todos) =>
//       todos.map((todo) =>
//         todo.id === id ? { ...todo, completed: !todo.completed } : todo,
//       ),
//     )(state);
//   };

// const $updatePriority =
//   (id: string, priority: Todo["priority"]) =>
//   (state: TodoState): TodoState => {
//     const todosOptic = O.optic<TodoState>().prop("todos");
//     return O.modify(todosOptic, (todos) =>
//       todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo)),
//     )(state);
//   };

// const $removeTodo =
//   (id: string) =>
//   (state: TodoState): TodoState => {
//     const todosOptic = O.optic<TodoState>().prop("todos");
//     return O.modify(todosOptic, (todos) =>
//       todos.filter((todo) => todo.id !== id),
//     )(state);
//   };

// const $setFilter =
//   (filter: TodoState["filter"]) =>
//   (state: TodoState): TodoState => {
//     const filterOptic = O.optic<TodoState>().prop("filter");
//     return O.set(filterOptic, filter)(state);
//   };

// const $selectTodo =
//   (id: string | null) =>
//   (state: TodoState): TodoState => {
//     const selectedOptic = O.optic<TodoState>().prop("selectedTodoId");
//     return O.set(selectedOptic, id)(state);
//   };

// // Create store
// interface TodoStore extends TodoState {
//   addTodo: (text: string) => void;
//   toggleTodo: (id: string) => void;
//   updatePriority: (id: string, priority: Todo["priority"]) => void;
//   removeTodo: (id: string) => void;
//   setFilter: (filter: TodoState["filter"]) => void;
//   selectTodo: (id: string | null) => void;
// }

// const useTodoStore = create<TodoStore>((set) => ({
//   ...initialState,
//   addTodo: (text) => set((state) => $addTodo(text)(state)),
//   toggleTodo: (id) => set((state) => $toggleTodo(id)(state)),
//   updatePriority: (id, priority) =>
//     set((state) => $updatePriority(id, priority)(state)),
//   removeTodo: (id) =>
//     set((state) => {
//       // Example of composing transformations
//       return $selectTodo(null)($removeTodo(id)(state));
//     }),
//   setFilter: (filter) => set((state) => $setFilter(filter)(state)),
//   selectTodo: (id) => set((state) => $selectTodo(id)(state)),
// }));

// export default useTodoStore;
