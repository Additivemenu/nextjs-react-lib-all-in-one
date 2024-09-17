"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .max(50, "Max 50 characters"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .max(50, "Max 50 characters"),
  email: z.string().email("Invalid email address"),
  moreDetail: z.boolean(),
  Interests: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length > 0, {
      // ! refine() is a powerful method to add custom validation logic
      message: "Interests cannot be empty if provided",
    }),
});

type IFormInput = z.infer<typeof formSchema>;

/**
 * check original example at:  https://codesandbox.io/p/sandbox/react-hook-form-conditional-fields-qgr41
 * where it is in js and not having zod validation
 *
 * @returns
 */
function App() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const moreDetail = watch("moreDetail"); // ! 这里是关键: watch a form state

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      {/* First Name */}
      <div className="mb-4">
        <label
          htmlFor="firstName"
          className="block text-gray-700 font-bold mb-2"
        >
          First Name
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Bill"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label
          htmlFor="lastName"
          className="block text-gray-700 font-bold mb-2"
        >
          Last Name
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Luo"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email
        </label>
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="bluebill1049@hotmail.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* More Details */}
      <div className="mb-4">
        <label
          htmlFor="moreDetail"
          className="block text-gray-700 font-bold mb-2"
        >
          More Details
        </label>
        <input
          type="checkbox"
          {...register("moreDetail")}
          className="mr-2 leading-tight"
        />
        <span>Check for more details</span>
      </div>

      {/* Interests - displayed only if "moreDetail" is true */}
      {moreDetail && (
        <div className="mb-4">
          <label
            htmlFor="Interests"
            className="block text-gray-700 font-bold mb-2"
          >
            Interests
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("Interests")}
          />
          {errors.Interests && (
            <p className="text-red-500 text-sm">{errors.Interests?.message}</p>
          )}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default App;
