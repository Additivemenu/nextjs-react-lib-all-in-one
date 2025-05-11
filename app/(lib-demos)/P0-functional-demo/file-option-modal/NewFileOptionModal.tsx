"use client";
import React from "react";

// import { DevTool as ReactHookFormDevTool } from "@hookform/devtools";
import { FormProvider, type SubmitHandler } from "react-hook-form";

import ModalManager from "@/components/modal";
import { useModal } from "@/components/modal/hook";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { log } from "@/lib/log";
import { useUploadActions } from "./store/workflow/add-file-modal/hooks";

import ActionGroup from "./_components/action-group";
import CellRange from "./_components/cell-range";
import ColumnSelection from "./_components/column-selection";
import HeaderRow from "./_components/header-row";
import { FileOptionModalProvider } from "./_context";
import { useFileOptionForm } from "./_hooks/use-file-option-form";
import { FileOptionFormData, parseFormDataToStore } from "./form";

/**
 * allow user to configure the dataset file option for uploading
 * key tech stack used:
 *  - zod for schema validation (a really complex form with multiple fields that has inter-dependencies)
 *  - react-hook-form for form handling
 *  - zustand for store
 *  - shadcn/ui for dialog
 *  - web worker and cache mechanism for large file loading
 *
 */
const NewFileOptionModal = ModalManager.create(
  ({ fileToUpload }: { fileToUpload: File }) => {
    const modal = useModal();
    const uploadActions = useUploadActions();
    const { methods } = useFileOptionForm(fileToUpload); // also set form initial form values

    // apply file option to the upload store
    const onSubmit: SubmitHandler<FileOptionFormData> = (data) => {
      log(data);

      uploadActions.updateUpload(fileToUpload, parseFormDataToStore(data));

      modal.remove();
    };

    return (
      <DialogContent className="h-auto max-w-[620px] bg-white text-primary-text">
        <div>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {fileToUpload.name ?? "No file name"}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            Choose options to upload your file
          </DialogDescription>

          <FormProvider {...methods}>
            <FileOptionModalProvider fileToUpload={fileToUpload}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mt-2 space-x-6 rounded-md bg-[#F2F3F6] p-4 md:flex">
                  <div className="flex flex-col space-y-4 md:flex-1">
                    <HeaderRow />
                    <CellRange />
                  </div>

                  <div className="md:flex-1">
                    <ColumnSelection />
                  </div>
                </div>

                <div className="mt-4 h-[1px] w-full bg-slate-300" />

                <div className="mt-5 flex justify-end space-x-3">
                  <ActionGroup modal={modal} />
                </div>
              </form>

              {/* <ReactHookFormDevTool control={methods.control} />
              <button
                className="btn bordered btn-sm rounded-lg border-transparent bg-neutral px-4 py-2 font-semibold text-white hover:bg-accent"
                data-onboarding="upload-file-step-4"
                type="button"
                onClick={() => {
                  console.log(methods.formState);
                }}
              >
                check
              </button> */}
            </FileOptionModalProvider>
          </FormProvider>
        </div>
      </DialogContent>
    );
  },
);

export default NewFileOptionModal;
