"use client";

import React, { useReducer } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";

import { INITIAL_FORM_VALUE, TaskFormData, taskSchema } from "./form";
import { TaskState, TaskAction, Priority, Category, Task } from "./type";
import { taskReducer } from "./_reducers/task-reducer";
import { TaskProvider } from "./context/provider";
import AddTaskForm from "./_components/add-task-form";
import TaskFilter from "./_components/task-filter";
import TaskList from "./_components/task-list";
import RedoUndo from "./_components/redo-undo";

// Component
const TaskManager: React.FC = () => {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: INITIAL_FORM_VALUE,
  });

  return (
    <FormProvider {...methods}>
      <TaskProvider>
        <div className="container mx-auto p-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Task Manager (react-hook-form + zod)
          </h1>

          <p>should use Zustand for managing complex state (TODO)</p>

          <AddTaskForm />
          <TaskFilter />
          <TaskList />
          <RedoUndo />

          {/* <DevTool control={control} /> */}
        </div>
      </TaskProvider>
    </FormProvider>
  );
};

export default TaskManager;
