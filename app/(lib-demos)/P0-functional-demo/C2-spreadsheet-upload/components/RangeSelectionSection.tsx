import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadFormData } from "../types";

interface RangeSelectionSectionProps {
  register: UseFormRegister<UploadFormData>;
  errors: FieldErrors<UploadFormData>;
  onUpdateSelection: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
  cellRangeValue: string;
}

export const RangeSelectionSection: React.FC<RangeSelectionSectionProps> = ({
  register,
  errors,
  onUpdateSelection,
  onClearSelection,
  hasSelection,
  cellRangeValue,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="cellRange" className="block text-sm font-medium mb-2">
        Select Cell Range (e.g., A1:C10 or A1) - Enter range manually to select
        data
      </label>
      <div className="flex gap-2">
        <Input
          id="cellRange"
          type="text"
          {...register("cellRange")}
          placeholder="Enter range like A1:C10"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={onUpdateSelection}
          disabled={!cellRangeValue?.trim()}
          className="whitespace-nowrap"
        >
          Update Selection
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClearSelection}
          disabled={!hasSelection}
          className="whitespace-nowrap"
        >
          Clear Selection
        </Button>
      </div>
      {errors.cellRange && (
        <Alert className="mt-2">
          <AlertDescription>{errors.cellRange.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
