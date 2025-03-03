import { Controller, useFormContext } from "react-hook-form";
import { TaskFormData } from "../../form";
import { useTaskStore } from "../../_stores/task-store";

const AddTaskForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext<TaskFormData>();

  const addTask = useTaskStore((state) => state.addTask);

  const onSubmit = (data: TaskFormData) => {
    addTask(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Task title"
                aria-label="title-input"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </>
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Description"
                aria-label="description-input"
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </>
          )}
        />
      </div>
      <div className="flex mb-4">
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              aria-label="priority-select"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              aria-label="category-select"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
            </select>
          )}
        />
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                aria-label="due-date-input"
                data-testid="due-date-input"
                type="date"
                className="due-date-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.dueDate && (
                <span className="text-red-500 text-xs">
                  {errors.dueDate.message}
                </span>
              )}
            </>
          )}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
