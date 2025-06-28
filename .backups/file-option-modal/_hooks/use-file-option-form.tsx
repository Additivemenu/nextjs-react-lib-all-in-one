import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetUploadInStore } from "../store/workflow/add-file-modal/hooks";

import {
  FileOptionFormData,
  fileOptionFormSchema,
  parseStoreToFormData,
} from "../form";

import { getNewInitialFormValues } from "./get-init-form-values";

export function useFileOptionForm(fileToUpload: File) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadInStore = useGetUploadInStore(fileToUpload!);
  const formInitialValues = uploadInStore?.isConfigured
    ? parseStoreToFormData(uploadInStore)
    : getNewInitialFormValues(fileToUpload);

  const methods = useForm<FileOptionFormData>({
    resolver: zodResolver(fileOptionFormSchema),
    defaultValues: formInitialValues, // this is crucial to avoid bugs in useEffect
    mode: "onChange",
  });

  return { methods, isLoading, error };
}
