"use client";

import styled from "@emotion/styled";

import { Field } from "./Field";
import { FieldSet } from "./FieldSet";
import { Recipe } from "../types";

import { useFieldArray, useForm } from "react-hook-form";
import { DevTool as ReactHookFormDevTool } from "@hookform/devtools";

export const RecipeForm = () => {
  const {
    register, // the second argument is an object that contains the validation rules
    formState: { errors },
    handleSubmit,
    control, // ! this is a fairly essential prop that comes from the useForm hook
  } = useForm<Recipe>();

  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control, // ! note this comes from useForm hook
  });

  const submitForm = (formData: Recipe) => {
    console.log(formData);
  };

  return (
    <Container>
      <h1>New recipe</h1>
      <form onSubmit={handleSubmit(submitForm)}>
        <FieldSet label="Basics">
          <Field label="Name" error={errors.name?.message}>
            <Input
              {...register("name", { required: "Recipe name is required" })}
              type="text"
              id="name"
            />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <TextArea
              {...register("description", {
                maxLength: {
                  value: 100,
                  message: "Description cannot be longer than 100 characters",
                },
              })}
              id="description"
              rows={10}
            />
          </Field>
          <Field label="Servings" error={errors.amount?.message}>
            <Input
              {...register("amount", {
                valueAsNumber: true, // ! this converts the input value to a number before submitting the form.
                max: {
                  value: 10,
                  message: "Maximum number of servings is 10",
                },
                validate: (value) => value % 2 === 0, // ! custom validation, but how to specify the error message?
              })}
              type="number"
              id="amount"
            />
          </Field>
        </FieldSet>

        {/* dynamic form:  */}
        <FieldSet label="Ingredients">
          {fields.map((field, index) => {
            return (
              <Row key={field.id}>
                <Field label="Name">
                  <Input
                    type="text"
                    {...register(`ingredients.${index}.name`)}
                    id={`ingredients[${index}].name`}
                  />
                </Field>
                <Field label="Amount">
                  <Input
                    type="text"
                    {...register(`ingredients.${index}.amount`)}
                    defaultValue={field.amount}
                    id={`ingredients[${index}].amount`}
                  />
                </Field>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ingredient ${index}`}
                >
                  &#8722;
                </Button>
              </Row>
            );
          })}
          <Button
            type="button"
            onClick={() => append({ name: "", amount: "" })}
          >
            Add ingredient
          </Button>
        </FieldSet>

        <Field>
          <Button variant="primary">Save</Button>
        </Field>
      </form>

      {/* With this on, you can see a devtool panel on top right, 
          and it will show which field is invalid and why based on your validation rule,
          and you can quickly locate the HTML part in the page by hitting native button */}
      <ReactHookFormDevTool control={control} />
    </Container>
  );
};

// ! css-in-js (styled-component): https://emotion.sh/docs/styled
const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
`;

const Input = styled.input`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  padding: 4px 11px;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  font-size: 14px;
  cursor: pointer;
  padding: 0.6em 1.2em;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  margin-right: auto;
  background-color: ${({ variant }) =>
    variant === "primary" ? "#3b82f6" : "white"};
  color: ${({ variant }) => (variant === "primary" ? "white" : "#213547")};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > * {
    margin-right: 20px;
  }

  button {
    margin: 25px 0 0 8px;
  }
`;
