import { toast } from "sonner";
import { processFile } from "./file-processor";
import { SpreadsheetAction } from "../../types";

export const useFileUpload = (dispatch: React.Dispatch<SpreadsheetAction>) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Processing file...");

      //! bottleneck here, as it reads the file and processes it
      const result = await processFile(file);

      // extract colDef building logic from the result

      dispatch({
        type: "SET_DATA",
        payload: {
          data: result.data,
          columnDefs: result.columnDefs,
        },
      });

      toast.dismiss();
      toast.success(
        `File uploaded successfully! ${result.data.length} rows loaded.`,
      );
    } catch (error) {
      toast.dismiss();
      toast.error(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return { handleFileChange };
};
