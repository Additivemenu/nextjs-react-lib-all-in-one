// getInitialFormValues.ts
import { getFileType } from "../_utils/get-file-type";
import { FileOptionFormData } from "../form";

export function getNewInitialFormValues(fileToUpload: File): FileOptionFormData {
  if (!fileToUpload) {
    throw new Error("No file uploaded");
  }

  const fileType = getFileType(fileToUpload);

  switch (fileType) {
    case "csv":
      return {
        fileType: "csv",
        headerRowNumber: 1,
        selectedHeaders: [], // we cannot know the headers until the file is read -> the value gets populated when file option modal is opened
      };
    case "excel":
      return {
        fileType: "excel",
        headerRowNumber: 1,
        isCellRangeCheckboxOn: false,
        startingCell: "",
        endingCell: "",
        selectedHeaders: [], // we cannot know the headers until the file is read -> the value gets populated when file option modal is opened
      };
    default:
      throw new Error(
        "Unknown file type to upload. Only csv and excel files are supported.",
      );
  }
}
