import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileUploadSectionProps {
  register?: UseFormRegister<any>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHeaderRowChange?: (headerRowIndex: number) => void;
  errors: FieldErrors<any>;
  hasData?: boolean;
  headerRowIndex?: number;
}

/**
 * component for file selection and client-side data loading
 * @param param0
 * @returns
 */
export function FileUploadSection({
  register,
  onFileChange,
  onHeaderRowChange,
  errors,
  hasData = false,
  headerRowIndex = 0,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="file-upload" className="text-sm font-medium">
          Upload Spreadsheet
        </label>
        <Input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileChange}
        />
        {errors.file && (
          <p className="text-sm text-red-500 mt-1">
            {String(errors.file?.message || "File is required")}
          </p>
        )}
      </div>

      {hasData && (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="header-row-index" className="text-sm font-medium">
              Header Row Index
            </label>
            <Input
              id="header-row-index"
              type="number"
              min="0"
              placeholder="0"
              value={headerRowIndex}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onHeaderRowChange?.(value);
              }}
            />
            {errors.headerRowIndex && (
              <p className="text-sm text-red-500 mt-1">
                {String(
                  errors.headerRowIndex?.message || "Invalid header row index",
                )}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Row index that contains column headers (0-based)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
