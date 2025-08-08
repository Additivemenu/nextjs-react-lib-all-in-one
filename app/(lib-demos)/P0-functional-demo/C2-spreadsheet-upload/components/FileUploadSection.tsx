import React from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FieldError } from "react-hook-form";

interface FileUploadSectionProps {
  register: any;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    file?: FieldError | any;
  };
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  register,
  handleFileChange,
  errors,
}) => {
  return (
    <div>
      <label htmlFor="file" className="block text-sm font-medium mb-2">
        Select File (CSV or Excel)
      </label>
      <Input
        id="file"
        type="file"
        accept=".csv,.xlsx,.xls"
        {...register("file")}
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {errors.file && (
        <Alert className="mt-2">
          <AlertDescription>
            {typeof errors.file.message === "string"
              ? errors.file.message
              : "Please select a valid file"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
