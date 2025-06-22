"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { INITIAL_FORM_VALUE, TaskFormData, taskSchema } from "./form";
import AddTaskForm from "./_components/add-task-form";
import TaskFilter from "./_components/task-filter";
import TaskList from "./_components/task-list";
import RedoUndo from "./_components/redo-undo";

import { readmePath } from "./readme-path";
import SimpleModalTrigger from "@/app/_components/modals/simple-modal";
import { MarkdownViewer } from "@/components/viewers/markdown-view";

/**
 *
 *
 * Key benefits of using Zustand over Context + useReducer:
 * 1. Simpler boilerplate - no need for context providers
 * 2. Built-in state selection optimization
 * 3. More flexible state updates without reducer switch statements
 * 4. Easier testing and debugging with devtools
 * 5. Better performance due to internal optimizations
 *
 *
 * @returns
 */
const TaskManager: React.FC = () => {
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: INITIAL_FORM_VALUE,
  });

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Task Manager (react-hook-form + zustand)
        </h1>
        <SimpleModalTrigger
          triggerText="see notes"
          modal={{
            title: "Simple Modal",
            content: <MarkdownViewer filePath={readmePath} />,
          }}
        />
        <div className="h-0.5 bg-gray-200 mt-2 mb-4" />

        <AddTaskForm />
        <TaskFilter />
        <TaskList />
        <RedoUndo />
      </div>
    </FormProvider>
  );
};

export default TaskManager;
