import { create } from "zustand";

export type UploadProblemType = "unnamed-columns" | null;

// TODO: add a flag field to indicate if header is problematic
export interface Upload {
  fileToUpload: File;
  useCols: string; // json string of the string[] for headers e.g. '["age","name","email"]', easier state update than string[]
  headerRowNumber: number;
  cellRange: string; // e.g. 'A1:Z100', only applies to excel files
  isConfigured: boolean;
  problemType: UploadProblemType;
}

interface UploadActions {
  addUploads: (
    rawUploads: {
      fileToUpload: File;
      problemType: UploadProblemType;
    }[],
  ) => void;
  updateUpload: (file: File, data: Partial<Upload>) => void;
  clearUploads: () => void;
  removeUpload: (files: File) => void;
}

interface UploadStore {
  uploads: Upload[];
  uploadActions: UploadActions;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],
  uploadActions: {
    addUploads: (
      rawUploads: {
        fileToUpload: File;
        problemType: UploadProblemType;
      }[],
    ) =>
      set((state) => {
        const newUploads = rawUploads.map((upload) => ({
          fileToUpload: upload.fileToUpload,
          headerRowNumber: 1,
          useCols: "",
          cellRange: "",
          isConfigured: false,
          problemType: upload.problemType,
        }));

        return { uploads: [...state.uploads, ...newUploads] };
      }),
    updateUpload: (file, data: Partial<Upload>) =>
      set((state) => ({
        uploads: state.uploads.map((upload) =>
          upload.fileToUpload.name === file.name
            ? { ...upload, ...data, isConfigured: true }
            : upload,
        ),
      })),
    clearUploads: () => set({ uploads: [] }),
    removeUpload: (file: File) =>
      set((state) => ({
        uploads: state.uploads.filter(
          (upload) => upload.fileToUpload.name !== file.name,
        ),
      })),
  },
}));
