import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SelectedDataDisplayProps {
  selectedData: any[];
  selectedRange: string;
  onCopyData: () => void;
  onDownloadData: () => void;
}

export const SelectedDataDisplay: React.FC<SelectedDataDisplayProps> = ({
  selectedData,
  selectedRange,
  onCopyData,
  onDownloadData,
}) => {
  if (selectedData.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Selected Data ({selectedRange}) - {selectedData.length} rows
          </h3>
          <div className="flex gap-2">
            <Button onClick={onCopyData} variant="outline" size="sm">
              Copy Data
            </Button>
            <Button onClick={onDownloadData} variant="outline" size="sm">
              Download CSV
            </Button>
          </div>
        </div>
        <div className="max-h-60 overflow-auto">
          <pre className="text-xs bg-gray-50 p-2 rounded">
            {JSON.stringify(selectedData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
