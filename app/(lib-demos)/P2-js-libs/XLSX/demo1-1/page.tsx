"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { readHeaderValuesAsync } from "./util/read-headers";

interface ExcelSingleRowReaderProps {
  onDataRead?: (data: any[]) => void;
}

const ExcelSingleRowReader: React.FC<ExcelSingleRowReaderProps> = ({
  onDataRead,
}) => {
  const [rowData, setRowData] = useState<string[]>([]);
  const [rowNumber, setRowNumber] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isReadingHeader, setIsReadingHeader] = useState(false);

  // Effect to handle row number or file changes
  useEffect(() => {
    const updateRowData = async () => {
      if (selectedFile) {
        setIsReadingHeader(true);
        const newHeaders = await readHeaderValuesAsync(selectedFile, rowNumber);
        setIsReadingHeader(false);
        setRowData(newHeaders);
      }
    };

    updateRowData();
  }, [rowNumber, selectedFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRowNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value) || 1;
    setRowNumber(Math.max(1, value));
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Row Number
          </label>
          <input
            type="number"
            min="1"
            value={rowNumber}
            onChange={handleRowNumberChange}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {selectedFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      {rowData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Row {rowNumber} Data
            {rowNumber <= 100 && (
              <span className="text-sm text-gray-500"> (from cache)</span>
            )}
          </h3>

          {isReadingHeader && (
            <div className="text-sm text-red-400"> loading headers... </div>
          )}
          {!isReadingHeader && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <tbody>
                  <tr>
                    {rowData.map((cell: any, index: number) => (
                      <td
                        key={index}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelSingleRowReader;
