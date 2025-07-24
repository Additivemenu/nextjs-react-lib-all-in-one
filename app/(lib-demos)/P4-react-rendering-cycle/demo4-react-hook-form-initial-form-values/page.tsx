"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { watch } from "fs";

// Simulated async function to fetch user data
const fetchUserData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
  return {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
  };
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function FormComparison() {
  const [isLoading, setIsLoading] = useState(true);

  // Form with pre-defined default values ================================
  const {
    register: registerPre,
    handleSubmit: handleSubmitPre,
    formState: formStatePre,
    watch: watchPre,
  } = useForm<FormValues>({
    // ! this is setting the initial form value for initial render
    defaultValues: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
    },
  });

  // Form with async-fetched values ======================================
  const {
    register: registerAsync,
    handleSubmit: handleSubmitAsync,
    reset,
    formState: formStateAsync,
    watch: watchAsync,
  } = useForm<FormValues>();

  useEffect(() => {
    const loadAsyncValues = async () => {
      // ! inspect form value
      console.log("watch pre", watchPre()); // !this is not empty in initial render
      console.log("watch async", watchAsync()); // !this is empty in initial render

      try {
        const userData = await fetchUserData();
        reset(userData); // ! this is not actually setting the initial form value for initial render, but setting the value after the form is rendered
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsyncValues();
  }, [reset]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="flex  gap-8 p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Pre-defined Default Values
        </h2>
        <form onSubmit={handleSubmitPre(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="preFirstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="preFirstName"
              {...registerPre("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="preLastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="preLastName"
              {...registerPre("lastName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="preEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="preEmail"
              type="email"
              {...registerPre("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Pre-defined
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Async-Fetched Values
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <form onSubmit={handleSubmitAsync(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="asyncFirstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="asyncFirstName"
                {...registerAsync("firstName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="asyncLastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                id="asyncLastName"
                {...registerAsync("lastName")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="asyncEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="asyncEmail"
                type="email"
                {...registerAsync("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Async
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
