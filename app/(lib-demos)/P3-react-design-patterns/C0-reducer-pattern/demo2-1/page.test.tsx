import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TaskManager from "./page";
import { useTaskStore } from "./_stores/task-store";

// Reset Zustand store between tests
beforeEach(() => {
  useTaskStore.setState({
    tasks: [],
    filter: { status: "all", priority: "all", category: "all" },
    history: [[]],
    historyIndex: 0,
  });
});

const setDueDateToTomorrow = async (userEvent: UserEvent) => {
  // !Set future date -> a bit tricky
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split("T")[0];
  const dueDateInput = screen.getByTestId("due-date-input");
  await userEvent.clear(dueDateInput);
  for (const char of formattedDate) {
    await userEvent.type(dueDateInput, char);
  }
  await userEvent.tab();
};

describe("TaskManager", () => {
  it("should render all components", () => {
    render(<TaskManager />);

    // Check for main components
    expect(
      screen.getByText(/Task Manager \(react-hook-form \+ zustand\)/i),
    ).toBeInTheDocument();

    // Check if main components are rendered
    expect(screen.getByPlaceholderText(/task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redo/i })).toBeInTheDocument();
  });

  it("should handle task creation workflow", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/task title/i), "Test Task");
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "Test Description",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority-select/i }),
      "high",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /category-select/i }),
      "work",
    );

    // !Set future date -> a bit tricky
    await setDueDateToTomorrow(user);

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Verify task was added
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("high")).toBeInTheDocument();
      expect(screen.getByText("work")).toBeInTheDocument();

      // ! Verify store state
      const state = useTaskStore.getState();
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe("Test Task");
      expect(state.tasks[0].description).toBe("Test Description");
    });
  });

  it("should handle undo/redo operations", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Add a task
    await user.type(screen.getByPlaceholderText(/task title/i), "Test Task");
    await user.type(
      screen.getByPlaceholderText(/description/i),
      "Test Description",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority-select/i }),
      "high",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /category-select/i }),
      "work",
    );
    await setDueDateToTomorrow(user);
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Delete the task
    await waitFor(async () => {
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);
    });

    // Verify task is deleted
    await waitFor(() => {
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    // Test undo
    await user.click(screen.getByRole("button", { name: /undo/i }));

    // Verify task is restored
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(useTaskStore.getState().tasks).toHaveLength(1);
    });

    // Test redo
    await user.click(screen.getByRole("button", { name: /redo/i }));

    // Verify task is removed again
    await waitFor(() => {
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  it("should handle task filtering", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Add two tasks with different priorities
    // First task
    await user.type(
      screen.getByRole("textbox", { name: /title-input/i }),
      "High Priority Task",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority-select/i }),
      "high",
    );
    await setDueDateToTomorrow(user);
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Second task
    await user.type(
      screen.getByPlaceholderText(/task title/i),
      "Low Priority Task",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority-select/i }),
      "low",
    );
    await setDueDateToTomorrow(user);
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Filter by high priority
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority-filter/i }),
      "high",
    );

    // Verify filter works
    await waitFor(() => {
      expect(screen.getByText("High Priority Task")).toBeInTheDocument();
      expect(screen.queryByText("Low Priority Task")).not.toBeInTheDocument();
      expect(useTaskStore.getState().filter.priority).toBe("high");
    });
  });
});
