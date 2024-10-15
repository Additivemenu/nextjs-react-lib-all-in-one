"use client";
import { usePathname } from "next/navigation";

// pages/complex-form.tsx
import React from "react";

const demos = [
  {
    title: "Demo 1: Basic Form ",
    path: "/demo1/",
  },
  {
    title: "Demo 2: Pagination + Filtering Form",
    path: "/demo2/",
  },
  {
    title: "Demo 3: recipe form (dynamic form + react-hook-form devtool)", // https://claritydev.net/blog/managing-forms-with-react-hook-form
    path: "/demo3/",
    style: "text-red-500 underline",
  },
  {
    title:
      "Demo 4: a form with variants of form fields (need ts type union & type narrowing)", // https://claritydev.net/blog/managing-forms-with-react-hook-form
    path: "/demo4/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 5: conditional fields (watch a form state)", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo5/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 6-1: book viewer (book content change on submit)", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo6-1/",
    style: "text-red-500 underline",
  },
  {
    title: "Demo 6-2: book viewer (book content change on form field change)", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo6-2/",
    style: "text-purple-500 underline",
  },
  {
    title:
      "Demo 6-3: book viewer + line selection (upgrade version of demo6-2)", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo6-3/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 7-1: refine and superRefine", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo7/",
    style: "text-purple-500 underline",
  },
  {
    title: "Demo 7-2: refine and superRefine - range input", // official example: https://codesandbox.io/s/react-hook-form-conditional-fields-qgr41
    path: "/demo7-2/",
    style: "text-purple-500 underline",
  },
];

/**
 * use react-hook-form + zod:
 * - elegant form management & validation -> readable, maintainable, scalable code
 * - avoid unnecessary re-rendering as react-hook-form use ref
 *
 * 2 types of form -> representing 2 ways to define form:
 * - controlled form:
 *   - use the useForm hook to register inputs and manage their state by being wrapped into the Controller component.
 *   - they provide more granular control over the input state, allowing for easier integration with external  libraries and more complex validation logic.
 * - uncontrolled form:
 *   - inputs that are registered using the register function and have their state managed by the DOM.
 *   - Uncontrolled components can be simpler to implement, especially for basic forms, but can be more difficult to customize for more complex use cases.
 *
 * find more tutorials at https://react-hook-form.com/resources/articles
 *
 * ! many official examples (but many are in js, we will migrate those js example to ts): https://github.com/react-hook-form/react-hook-form/tree/master/examples
 *  - validation:
 *    - basic validation: https://codesandbox.io/s/react-hook-form-basic-validation-qdyye
 *    - custom validation -> register() config obj: https://codesandbox.io/p/sandbox/react-hook-form-custom-validation-8kuu7?file=%2Fsrc%2Findex.js%3A40%2C15
 *        - we can also use zod refine() for custom validation (see demo5 conditional fields)
 *    - ! compare field values-> getValues(): https://codesandbox.io/s/react-hook-form-getvalues-compare-field-values-orf0p
 *  - custom input:
 *    - use Controller component and `control` from useForm to integrate with custom input component
 *    - ! Controlled components: https://codesandbox.io/p/sandbox/react-hook-form-v7-controller-5h1q5?file=%2Fsrc%2FMui.js%3A35%2C18
 *
 * @returns
 */
export default function ComplexForm() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[500px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complex Form with React Hook Form + Zod
        </h1>
        <ul className="space-y-4">
          {demos.map((demo) => (
            <li key={demo.title}>
              <a
                href={pathname + demo.path}
                className={`text-blue-500 hover:underline ${demo.style}`}
              >
                {demo.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
