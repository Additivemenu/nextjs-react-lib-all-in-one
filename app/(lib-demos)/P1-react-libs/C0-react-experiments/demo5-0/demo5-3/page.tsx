import { TaskManager } from "./components/TaskManager";

/**
 * ! still doing, but not sure why only complete 1 subtask, is it because of early close of the eventSource?
 * @returns
 */
const App: React.FC = () => {
  return (
    <div className=" bg-gray-100 py-8">
      <TaskManager />
    </div>
  );
};

export default App;
