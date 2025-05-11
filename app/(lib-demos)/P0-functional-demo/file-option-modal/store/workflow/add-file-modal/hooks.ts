import { useUploadStore } from ".";

export const useUploads = () => {
  return useUploadStore((state) => state.uploads);
};

export const useUploadActions = () => {
  return useUploadStore((state) => state.uploadActions);
};

export const useGetUploadInStore = (file: File ) => {
  
  const uploads = useUploads();
  return uploads.find((u) => u.fileToUpload.name === file.name);
};
