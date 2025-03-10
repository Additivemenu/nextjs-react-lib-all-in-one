import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TaskManager from "./page";

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
      screen.getByText(/Task Manager \(react-hook-form \+ zod\)/i),
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
      "description",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /priority/i }),
      "high",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      "work",
    );
    await setDueDateToTomorrow(user);

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Verify task was added
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("high")).toBeInTheDocument();
      expect(screen.getByText("work")).toBeInTheDocument();
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
      screen.getByRole("combobox", { name: /priority/i }),
      "high",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      "work",
    );
    await setDueDateToTomorrow(user);
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Delete the task
    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      user.click(deleteButton);
    });

    // Verify task is deleted
    await waitFor(() => {
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });

    // Test undo
    await user.click(screen.getByRole("button", { name: /undo/i }));

    // Verify task is restored
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    // Test redo
    await user.click(screen.getByRole("button", { name: /redo/i }));

    // Verify task is removed again
    await waitFor(() => {
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });
  });
});
