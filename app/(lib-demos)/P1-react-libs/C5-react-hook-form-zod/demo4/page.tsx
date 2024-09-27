"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schemas for each form type
const gameSchema = z.object({
  selection: z.literal("Game"),
  gameName: z.string().min(1, "Game name is required"),
  gamePrice: z
    .number()
    .min(20, "Price must be at least $20")
    .max(100, "Price must not exceed $100"),
});

const movieSchema = z.object({
  selection: z.literal("Movie"),
  seats: z.array(z.string()).min(1, "Please select at least one seat"),
  movieDate: z.string().min(1, "Date is required"),
});

const tvShowSchema = z.object({
  selection: z.literal("TV show"),
  showName: z.enum(["show1", "show2", "show3"]),
  comment: z.string().min(1, "Comment is required"),
});

// Union schema for all forms
const schema = z.union([gameSchema, movieSchema, tvShowSchema]);

type FormValues = z.infer<typeof schema>;

/**
 * ! 这里最核心的问题可能是 ts类型编程: type narrowing
 *
 * @returns
 */
const DynamicForm: React.FC = () => {
  const [selection, setSelection] = useState<
    "Game" | "Movie" | "TV show" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="mb-4">
        <label
          htmlFor="selection"
          className="block text-gray-700 font-bold mb-2"
        >
          Select an option:
        </label>
        <select
          id="selection"
          {...register("selection")}
          onChange={(e) =>
            setSelection(e.target.value as "Game" | "Movie" | "TV show")
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Select --</option>
          <option value="Game">Game</option>
          <option value="Movie">Movie</option>
          <option value="TV show">TV show</option>
        </select>
        {errors.selection && (
          <p className="text-red-500 text-sm">{errors.selection.message}</p>
        )}
      </div>

      {/* Game form */}
      {selection === "Game" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="gameName"
              className="block text-gray-700 font-bold mb-2"
            >
              Game Name:
            </label>
            <input
              id="gameName"
              {...register("gameName")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {/* ! 需要做type narrowing ! */}
            {"gameName" in errors && (
              <p className="text-red-500 text-sm">{errors.gameName?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="gamePrice"
              className="block text-gray-700 font-bold mb-2"
            >
              Game Price:
            </label>
            <input
              id="gamePrice"
              type="number"
              {...register("gamePrice", { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {/* ! 需要做type narrowing ! */}
            {"gamePrice" in errors && (
              <p className="text-red-500 text-sm">
                {errors.gamePrice?.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Movie form */}
      {selection === "Movie" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="seats"
              className="block text-gray-700 font-bold mb-2"
            >
              Choose Seats:
            </label>
            <select
              id="seats"
              {...register("seats")}
              multiple
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="A3">A3</option>
            </select>
            {/* ! 需要做type narrowing ! */}
            {"seats" in errors && (
              <p className="text-red-500 text-sm">{errors.seats?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="movieDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Select Date:
            </label>
            <input
              id="movieDate"
              type="date"
              {...register("movieDate")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {/* ! 需要做type narrowing ! */}
            {"movieDate" in errors && (
              <p className="text-red-500 text-sm">
                {errors.movieDate?.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* TV show form */}
      {selection === "TV show" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="showName"
              className="block text-gray-700 font-bold mb-2"
            >
              Select TV Show:
            </label>
            <select
              id="showName"
              {...register("showName")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="show1">Show 1</option>
              <option value="show2">Show 2</option>
              <option value="show3">Show 3</option>
            </select>
            {/* ! 需要做type narrowing ! */}
            {"showName" in errors && (
              <p className="text-red-500 text-sm">{errors.showName?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-gray-700 font-bold mb-2"
            >
              Comment:
            </label>
            <textarea
              id="comment"
              {...register("comment")}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
            {/* ! 需要做type narrowing ! */}
            {"comment" in errors && (
              <p className="text-red-500 text-sm">{errors.comment?.message}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
