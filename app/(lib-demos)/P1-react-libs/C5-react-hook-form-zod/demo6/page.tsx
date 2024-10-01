"use client";

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define types for our book structure
type Line = string;
type Page = Line[];
type Book = Page[];

// Generate mock book data
const generateBook = (): Book => {
  const book: Book = [];
  for (let page = 1; page <= 20; page++) {
    const pageContent: Page = [];
    for (let line = 1; line <= 10; line++) {
      pageContent.push(`Page ${page}, Line ${line}: Some text content here.`);
    }
    book.push(pageContent);
  }
  return book;
};

// Define the schema for our form data
const formSchema = z
  .object({
    pageNumber: z.number().int().min(1).max(20),
    startingLineNumber: z.number().int().min(1).max(10),
    endingLineNumber: z.number().int().min(1).max(10),
  })
  .refine((data) => data.startingLineNumber <= data.endingLineNumber, {
    message: "Starting line must be less than or equal to ending line",
    path: ["endingLineNumber"],
  });

// Infer the type of our form data from the schema
type FormData = z.infer<typeof formSchema>;

// Define props for our BookViewer component
interface BookViewerProps {
  initialPage?: number;
}

const BookViewer: React.FC<BookViewerProps> = ({ initialPage = 1 }) => {
  const book: Book = generateBook();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filteredLines, setFilteredLines] = useState<Line[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageNumber: initialPage,
      startingLineNumber: 1,
      endingLineNumber: 10,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    const { pageNumber, startingLineNumber, endingLineNumber } = data;

    const newPageNumber = pageNumber;
    const newFilteredLines = book[newPageNumber - 1].slice(
      startingLineNumber - 1,
      endingLineNumber,
    );

    setCurrentPage(newPageNumber);
    setFilteredLines(newFilteredLines);

    alert(
      `Viewing page ${newPageNumber}, lines ${startingLineNumber} to ${endingLineNumber}`,
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book Viewer</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="flex flex-col space-y-4">
          <div>
            <Controller
              name="pageNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Page Number (1-20)"
                  className="border p-2 rounded"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(Number(e.target.value))
                  }
                />
              )}
            />
            {errors.pageNumber && (
              <p className="text-red-500">{errors.pageNumber.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="startingLineNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Starting Line (1-10)"
                  className="border p-2 rounded"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(Number(e.target.value))
                  }
                />
              )}
            />
            {errors.startingLineNumber && (
              <p className="text-red-500">
                {errors.startingLineNumber.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="endingLineNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Ending Line (1-10)"
                  className="border p-2 rounded"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(Number(e.target.value))
                  }
                />
              )}
            />
            {errors.endingLineNumber && (
              <p className="text-red-500">{errors.endingLineNumber.message}</p>
            )}
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            View
          </button>
        </div>
      </form>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Page {currentPage}</h2>
        {filteredLines.length > 0 ? (
          <ul>
            {filteredLines.map((line: Line, index: number) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>No lines to display. Please use the form to view page content.</p>
        )}
      </div>
    </div>
  );
};

export default BookViewer;
