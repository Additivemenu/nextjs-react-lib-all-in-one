"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * The form using refine() will show an error message only on the lower bound field when the validation fails.
 */
const schemaWithRefine = z
  .object({
    lowerBound: z.number(),
    upperBound: z.number(),
  })
  .refine((data) => data.lowerBound < data.upperBound, {
    message: "Lower bound must be less than upper bound",
    path: ["lowerBound"], // This will associate the error with the lowerBound field
  });

/**
 * The form using superRefine() will show error messages on both fields when the validation fails, providing more context to the user.
 */
const schemaWithSuperRefine = z
  .object({
    lowerBound: z.number(),
    upperBound: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.lowerBound >= data.upperBound) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lower bound must be less than upper bound",
        path: ["lowerBound"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Upper bound must be greater than lower bound",
        path: ["upperBound"],
      });
    }
  });

type FormData = z.infer<typeof schemaWithRefine>;

/**
 * 
 * The mode configuration in useForm is an important option that determines when validation should occur in your form.
onSubmit: Errors only show when you try to submit the form.
onBlur: Errors show when you move focus away from a field.
onChange: Errors show immediately as you type.
onTouched: Errors show after the first blur and then on every change.
all: Errors show on both change and blur events.
 * 
 * @param param0 
 * @returns 
 */
const FormComponent: React.FC<{
  schema: z.ZodType<FormData>;
  title: string;
}> = ({ schema, title }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="lowerBound"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Lower Bound:
          </label>
          <input
            id="lowerBound"
            type="number"
            {...register("lowerBound", { valueAsNumber: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.lowerBound && (
            <span className="text-red-500 text-xs italic">
              {errors.lowerBound.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="upperBound"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Upper Bound:
          </label>
          <input
            id="upperBound"
            type="number"
            {...register("upperBound", { valueAsNumber: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.upperBound && (
            <span className="text-red-500 text-xs italic">
              {errors.upperBound.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Bound Comparison Forms
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <FormComponent schema={schemaWithRefine} title="Form with refine()" />
        <FormComponent
          schema={schemaWithSuperRefine}
          title="Form with superRefine()"
        />
      </div>
    </div>
  );
}
