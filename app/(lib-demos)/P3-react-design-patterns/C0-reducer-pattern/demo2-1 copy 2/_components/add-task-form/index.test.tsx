import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import AddTaskForm from "./index";
import { TaskFormData, INITIAL_FORM_VALUE, taskSchema } from "../../form";
import { useTaskStore } from "../../_stores/task-store";
import "@testing-library/jest-dom";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Helper function to render component with necessary providers
 */
const renderWithProviders = (component: React.ReactNode) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<TaskFormData>({
      defaultValues: INITIAL_FORM_VALUE,
      resolver: zodResolver(taskSchema),
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return render(<Wrapper>{component}</Wrapper>);
};

describe("AddTaskForm", () => {
  // Reset Zustand store before each test
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      filter: { status: "all", priority: "all", category: "all" },
      history: [[]],
      historyIndex: 0,
    });
  });

  it("should render all form fields", () => {
    renderWithProviders(<AddTaskForm />);

    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /priority/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /category/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });

  it("should show validation error for required title field", async () => {
    renderWithProviders(<AddTaskForm />);

    const submitButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      // Verify store wasn't updated
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  it("should show validation error for due date field", async () => {
    renderWithProviders(<AddTaskForm />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const prioritySelect = screen.getByRole("combobox", { name: /priority/i });
    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await userEvent.type(titleInput, "Test Task");
    await userEvent.type(descriptionInput, "Test Description");
    await userEvent.selectOptions(prioritySelect, "high");
    await userEvent.selectOptions(categorySelect, "work");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/due date must be in the future/i),
      ).toBeInTheDocument();
      expect(titleInput).toHaveValue("Test Task");
      expect(descriptionInput).toHaveValue("Test Description");
      expect(prioritySelect).toHaveValue("high");
      expect(categorySelect).toHaveValue("work");
      // Verify store wasn't updated
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  it("should successfully submit form with valid data", async () => {
    renderWithProviders(<AddTaskForm />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const prioritySelect = screen.getByRole("combobox", { name: /priority/i });
    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    const submitButton = screen.getByRole("button", { name: /add task/i });
    const dueDateInput = screen.getByTestId("due-date-input");

    await userEvent.type(titleInput, "Test Task");
    await userEvent.type(descriptionInput, "Test Description");
    await userEvent.selectOptions(prioritySelect, "high");
    await userEvent.selectOptions(categorySelect, "work");

    // Set tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    await userEvent.clear(dueDateInput);
    for (const char of formattedDate) {
      await userEvent.type(dueDateInput, char);
    }
    await userEvent.tab();

    await userEvent.click(submitButton);

    // Verify form reset and store update
    await waitFor(() => {
      // Check form reset
      expect(
        screen.queryByText(/due date must be in the future/i),
      ).not.toBeInTheDocument();
      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");

      // Verify store state
      const store = useTaskStore.getState();
      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0]).toMatchObject({
        title: "Test Task",
        description: "Test Description",
        priority: "high",
        category: "work",
        completed: false,
      });
      // Verify history was updated
      expect(store.history).toHaveLength(2); // Initial empty state + new task
      expect(store.historyIndex).toBe(1);
    });
  });

  it("should update history when adding a task", async () => {
    renderWithProviders(<AddTaskForm />);

    const titleInput = screen.getByRole("textbox", {
      name: /title-input/i,
    });
    const dueDateInput = screen.getByTestId("due-date-input");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    // Add task
    await userEvent.type(titleInput, "Test Task");

    // Set future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    await userEvent.clear(dueDateInput);
    for (const char of formattedDate) {
      await userEvent.type(dueDateInput, char);
    }
    await userEvent.tab();

    await userEvent.click(submitButton);

    await waitFor(() => {
      const store = useTaskStore.getState();
      expect(store.history).toHaveLength(2);
      expect(store.historyIndex).toBe(1);
      expect(store.history[1]).toHaveLength(1); // New history entry with one task
    });
  });
});
