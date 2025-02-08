import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TaskManager from "./page";

describe("TaskManager", () => {
  it.skip("should render all components", () => {
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

  it.skip("should handle task creation workflow", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Fill out the form
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

    // Submit the form
    await user.click(screen.getByRole("button", { name: /add/i }));

    // Verify task was added
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  it.skip("should handle undo/redo operations", async () => {
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
