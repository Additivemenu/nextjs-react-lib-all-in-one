"use client";

import React, { useEffect, useMemo } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  SubmitHandler,
} from "react-hook-form";
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

// Input Field component
const InputField: React.FC<{ name: keyof FormData; placeholder: string }> = ({
  name,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            placeholder={placeholder}
            className="border p-2 rounded"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              field.onChange(Number(e.target.value))
            }
          />
        )}
      />
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

// Form component
const BookForm: React.FC = () => {
  const {
    handleSubmit,
    formState: { isValid },
  } = useFormContext<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form submitted with data:", data);
    alert(
      `Form submitted! Current view: Page ${data.pageNumber}, Lines ${data.startingLineNumber}-${data.endingLineNumber}`,
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <div className="flex flex-col space-y-4">
        <InputField name="pageNumber" placeholder="Page Number (1-20)" />
        <InputField
          name="startingLineNumber"
          placeholder="Starting Line (1-10)"
        />
        <InputField name="endingLineNumber" placeholder="Ending Line (1-10)" />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={!isValid}
        >
          Save View
        </button>
      </div>
    </form>
  );
};

// Book Content component
const BookContent: React.FC = () => {
  const book = useMemo(() => generateBook(), []);
  const {
    watch,
    formState: { isValid },
  } = useFormContext<FormData>();
  const { pageNumber, startingLineNumber, endingLineNumber } = watch();
  const [filteredLines, setFilteredLines] = React.useState<Line[]>([]);

  useEffect(() => {
    if (isValid && pageNumber && startingLineNumber && endingLineNumber) {
      const newFilteredLines =
        book[pageNumber - 1]?.slice(startingLineNumber - 1, endingLineNumber) ||
        [];
      if (JSON.stringify(newFilteredLines) !== JSON.stringify(filteredLines)) {
        setFilteredLines(newFilteredLines);
      }
    } else if (filteredLines.length > 0) {
      setFilteredLines([]);
    }
  }, [
    isValid,
    pageNumber,
    startingLineNumber,
    endingLineNumber,
    book,
    filteredLines,
  ]);

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">Page {pageNumber}</h2>
      {filteredLines.length > 0 ? (
        <ul>
          {filteredLines.map((line: Line, index: number) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      ) : (
        <p>
          No lines to display. Please ensure all form inputs are valid and
          within range.
        </p>
      )}
    </div>
  );
};

// // ! Book Content component -> this triggers infinite re-rendering
// const BookContent: React.FC = () => {
//   const book = generateBook();
//   const {
//     watch,
//     formState: { isValid },
//   } = useFormContext<FormData>();
//   const watchAllFields = watch();
//   const [filteredLines, setFilteredLines] = React.useState<Line[]>([]);

//   useEffect(() => {
//     const { pageNumber, startingLineNumber, endingLineNumber } = watchAllFields;

//     if (isValid && pageNumber && startingLineNumber && endingLineNumber) {
//       setFilteredLines(
//         book[pageNumber - 1]?.slice(startingLineNumber - 1, endingLineNumber) ||
//           [],
//       );
//     } else {
//       setFilteredLines([]);
//     }
//   }, [watchAllFields, book, isValid]);

//   return (
//     <div className="border p-4 rounded">
//       <h2 className="text-xl font-semibold mb-2">
//         Page {watchAllFields.pageNumber}
//       </h2>
//       {filteredLines.length > 0 ? (
//         <ul>
//           {filteredLines.map((line: Line, index: number) => (
//             <li key={index}>{line}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>
//           No lines to display. Please ensure all form inputs are valid and
//           within range.
//         </p>
//       )}
//     </div>
//   );
// };

// Main BookViewer component
const BookViewer: React.FC<BookViewerProps> = ({ initialPage = 1 }) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageNumber: initialPage,
      startingLineNumber: 1,
      endingLineNumber: 10,
    },
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Book Viewer</h1>
        <BookForm />
        <BookContent />
      </div>
    </FormProvider>
  );
};

export default BookViewer;
