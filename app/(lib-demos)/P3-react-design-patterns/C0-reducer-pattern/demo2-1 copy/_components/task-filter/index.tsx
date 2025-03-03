import React from "react";
import { Category, Priority } from "../../type";
import { useTaskStore } from "../../_stores/task-store";

const TaskFilter = () => {
  const filter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);

  return (
    <div className="flex mb-4">
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
        aria-label="status-filter"
        name="statusFilter"
        value={filter.status}
        onChange={(e) =>
          setFilter({
            status: e.target.value as "all" | "active" | "completed",
          })
        }
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
        aria-label="priority-filter"
        name="priorityFilter"
        value={filter.priority}
        onChange={(e) =>
          setFilter({
            priority: e.target.value as Priority | "all",
          })
        }
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        aria-label="category-filter"
        name="categoryFilter"
        value={filter.category}
        onChange={(e) =>
          setFilter({
            category: e.target.value as Category | "all",
          })
        }
      >
        <option value="all">All Categories</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option>
        <option value="health">Health</option>
      </select>
    </div>
  );
};

export default TaskFilter;
