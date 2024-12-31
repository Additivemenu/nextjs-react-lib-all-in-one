import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeForm } from "./RecipeForm";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom"; // Ensure this is imported

describe.skip("RecipeForm", () => {
  // Test if the form renders properly
  it("renders the form correctly", () => {
    render(<RecipeForm />);

    // Check if the form heading and basic fields exist
    expect(screen.getByText(/new recipe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
  });

  // Test validation errors
  it("shows validation errors when required fields are not filled", async () => {
    const user = userEvent.setup();
    render(<RecipeForm />);

    const saveButton = screen.getByRole("button", { name: /save/i });

    // Try submitting the form without filling fields
    await act(async () => {
      await user.click(saveButton);
    });

    // Check for validation error messages
    expect(screen.getByText(/recipe name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/description cannot be longer than 100 characters/i),
    ).toBeInTheDocument();
  });

  // Test adding and removing ingredients
  it("can add and remove ingredients dynamically", async () => {
    const user = userEvent.setup();
    render(<RecipeForm />);

    const addIngredientButton = screen.getByRole("button", {
      name: /add ingredient/i,
    });

    // Add an ingredient
    await act(async () => {
      await user.click(addIngredientButton);
    });

    // Check if ingredient fields are added
    expect(screen.getAllByLabelText(/name/i)).toHaveLength(2); // 1 for name field and 1 for ingredient
    expect(screen.getAllByLabelText(/amount/i)).toHaveLength(2); // 1 for servings field and 1 for ingredient

    const removeButton = screen.getByLabelText(/remove ingredient/i);

    // Remove the added ingredient
    await act(async () => {
      await user.click(removeButton);
    });

    // Ensure the ingredient field is removed
    expect(screen.getAllByLabelText(/name/i)).toHaveLength(1); // Only the name field should be present now
    expect(screen.getAllByLabelText(/amount/i)).toHaveLength(1); // Only the servings field should be present now
  });

  // Test a successful form submission
  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    render(<RecipeForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const servingsInput = screen.getByLabelText(/servings/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Fill the fields with valid data
    await act(async () => {
      await user.type(nameInput, "Pizza");
      await user.type(descriptionInput, "Delicious pizza");
      await user.type(servingsInput, "4");
      await user.click(saveButton);
    });

    // Since you're using console.log in submitForm, you can mock console.log to test form submission.
    const consoleSpy = jest.spyOn(console, "log");

    expect(consoleSpy).toHaveBeenCalledWith({
      name: "Pizza",
      description: "Delicious pizza",
      amount: 4,
      ingredients: [], // no ingredients added in this test
    });

    consoleSpy.mockRestore(); // Restore the original console.log behavior
  });
});
