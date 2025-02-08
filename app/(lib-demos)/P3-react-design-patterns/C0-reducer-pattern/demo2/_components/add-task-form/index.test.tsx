import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { TaskProvider } from "../../context/provider";
import AddTaskForm from "./index";
import { TaskFormData, INITIAL_FORM_VALUE } from "../../form";
import "@testing-library/jest-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../../form";

/**
 * ! Unit test for this form component is not that easy, but this kind of tests are very common!
 *
 * @param component
 * @returns
 */
const renderWithProviders = (component: React.ReactNode) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<TaskFormData>({
      defaultValues: INITIAL_FORM_VALUE,
      // ! Add validation rules
      resolver: zodResolver(taskSchema),
    });
    return (
      <FormProvider {...methods}>
        <TaskProvider>{children}</TaskProvider>
      </FormProvider>
    );
  };

  return render(<Wrapper>{component}</Wrapper>);
};

describe("AddTaskForm", () => {
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

    // Form should be reset after submission
    await waitFor(() => {
      expect(
        screen.queryByText(/due date must be in the future/i),
      ).toBeInTheDocument();
      expect(titleInput).toHaveValue("Test Task");
      expect(descriptionInput).toHaveValue("Test Description");
      expect(prioritySelect).toHaveValue("high");
      expect(categorySelect).toHaveValue("work");
    });
  });

  it("should successfully submit form with valid data", async () => {
    renderWithProviders(<AddTaskForm />);

    const titleInput = screen.getByPlaceholderText(/task title/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const prioritySelect = screen.getByRole("combobox", { name: /priority/i });
    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    const submitButton = screen.getByRole("button", { name: /add task/i });
    const dueDateInput = screen.getByLabelText(/due date/i);

    await userEvent.type(titleInput, "Test Task");
    await userEvent.type(descriptionInput, "Test Description");
    await userEvent.selectOptions(prioritySelect, "high");
    await userEvent.selectOptions(categorySelect, "work");

    // ! input date -> a bit tricky in userEvent
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    // Type the date character by character
    await userEvent.clear(dueDateInput);
    for (const char of formattedDate) {
      await userEvent.type(dueDateInput, char);
    }
    // Ensure validation by triggering blur
    await userEvent.tab();

    await userEvent.click(submitButton);

    // Form should be reset after submission
    await waitFor(() => {
      expect(
        screen.queryByText(/due date must be in the future/i),
      ).not.toBeInTheDocument();
      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  });
});
