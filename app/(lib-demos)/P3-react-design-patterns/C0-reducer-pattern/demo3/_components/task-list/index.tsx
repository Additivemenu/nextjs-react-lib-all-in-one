import React from "react";
import { useTaskContext } from "../../context/context";

const TaskList = () => {
  const { state, dispatch } = useTaskContext();

  const filteredTasks = state.tasks.filter((task) => {
    const statusMatch =
      state.filter.status === "all" ||
      (state.filter.status === "active" && !task.completed) ||
      (state.filter.status === "completed" && task.completed);

    const priorityMatch =
      state.filter.priority === "all" ||
      task.priority === state.filter.priority;

    const categoryMatch =
      state.filter.category === "all" ||
      task.category === state.filter.category;

    return statusMatch && priorityMatch && categoryMatch;
  });

  return (
    <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {filteredTasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between border-b border-gray-200 py-3"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch({ type: "TOGGLE_TASK", payload: task.id })
              }
              className="mr-2"
            />
            <span
              className={`font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              } mr-2`}
            >
              {task.priority}
            </span>
            <span className="text-sm text-gray-600 mr-2">{task.category}</span>
            <span className="text-sm text-gray-600 mr-2">{task.dueDate}</span>
            <button
              onClick={() =>
                dispatch({ type: "DELETE_TASK", payload: task.id })
              }
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
