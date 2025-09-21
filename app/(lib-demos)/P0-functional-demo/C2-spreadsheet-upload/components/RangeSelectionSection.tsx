import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RangeSelectionSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  onUpdateSelection: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
  cellRangeValue: string;
}

export function RangeSelectionSection({
  register,
  errors,
  onUpdateSelection,
  onClearSelection,
  hasSelection,
  cellRangeValue,
}: RangeSelectionSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cell-range" className="text-sm font-medium">
          Cell Range (e.g., A1:C10)
        </label>
        <Input
          id="cell-range"
          type="text"
          placeholder="A1:C10"
          {...register("cellRange")}
        />
        {errors.cellRange && (
          <p className="text-sm text-red-500 mt-1">
            {String(errors.cellRange?.message || "Invalid cell range")}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter a cell range to select specific data (e.g., A1:C10, B2:D15)
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={onUpdateSelection}
          disabled={!cellRangeValue.trim()}
        >
          Update Selection
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClearSelection}
          disabled={!hasSelection}
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
