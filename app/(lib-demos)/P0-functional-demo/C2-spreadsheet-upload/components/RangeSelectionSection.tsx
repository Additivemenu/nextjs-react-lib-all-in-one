import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RangeSelectionSectionProps {
  rangeInput: string;
  setRangeInput: (value: string) => void;
  isValidRange: boolean;
  onUpdateSelection: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
}

export const RangeSelectionSection: React.FC<RangeSelectionSectionProps> = ({
  rangeInput,
  setRangeInput,
  isValidRange,
  onUpdateSelection,
  onClearSelection,
  hasSelection,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="range" className="block text-sm font-medium mb-2">
        Select Cell Range (e.g., A1:C10 or A1) - Enter range manually to select
        data
      </label>
      <div className="flex gap-2">
        <Input
          id="range"
          type="text"
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          placeholder="Enter range like A1:C10"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={onUpdateSelection}
          disabled={!isValidRange || !rangeInput.trim()}
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
      {rangeInput && !isValidRange && (
        <Alert className="mt-2">
          <AlertDescription>
            Invalid range format. Use formats like A1, A1:C10, or A:C
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
