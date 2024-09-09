import React from "react";
import { RecipeForm } from "./(_components)/RecipeForm";

/**
 * React Hook Form: streamlining form management in React
 * + One of the key benefits of this library is that it simplifies state management, eliminating the need for multiple useState hooks.
 * + It has built-in validation and error handling, which makes it easier to manage form validation.
 * + It uses refs to manage form inputs, which makes it more efficient than using useState.
 *
 * https://claritydev.net/blog/managing-forms-with-react-hook-form
 * but this tutorial has some errors in the code, we have corrected them in this demo.
 * further tutorials:
 * - testing: https://claritydev.net/blog/testing-react-hook-form-with-react-testing-library
 * - validation in depth: https://claritydev.net/blog/form-validation-react-hook-form
 * - controlled vs. uncontrolled components: https://claritydev.net/blog/react-controlled-vs-uncontrolled-components
 *
 * * component encapsulation: Field, FieldSet
 *
 * * some important concepts regarding react-hook-form:
 * 1. the core hook: useForm
 * 2. dynamic form - useFieldArray hook
 * 3. controlled vs. uncontrolled components in react hook form
 *      - controlled components: Controlled components, on the other hand, use the useForm hook to register inputs and manage their state by being wrapped into the Controller component.
 *         - more flexible for custom complex validation logic
 *      - uncontrolled components: Uncontrolled components in React Hook Form refer to inputs that are registered using the register function and have their state managed by the DOM.
 *         - can be simpler to implement, especially for basic forms, but can be more difficult to customize for more complex use cases.
 *
 *
 *
 * @returns
 */
const Page = () => {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[500px]">
        <RecipeForm />
      </div>
    </div>
  );
};

export default Page;
