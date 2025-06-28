import React from "react";

import { useFormContext } from "react-hook-form";

import { ModalHandler } from "@/components/modal/types";

import { useFileOptionModalContext } from "../../_context";
import { FileOptionFormData } from "../../form";

interface ActionGroupProps {
  modal: ModalHandler<Record<string, unknown>>;
}

const ActionGroup: React.FC<ActionGroupProps> = ({ modal }) => {
  const methods = useFormContext<FileOptionFormData>();

  const { availableHeaderOptionErrorMessage, isReadingHeader } =
    useFileOptionModalContext();

  return (
    <>
      <button
        disabled={isReadingHeader}
        className="btn bordered btn-sm rounded-lg border-border-2 bg-transparent px-4 py-2 font-semibold text-primary-text hover:bg-ghost-hover"
        onClick={() => modal.remove()}
      >
        Cancel
      </button>
      <button
        className="btn bordered btn-sm rounded-lg border-transparent bg-neutral px-4 py-2 font-semibold text-white hover:bg-accent"
        data-onboarding="upload-file-step-4"
        type="submit"
        disabled={
          availableHeaderOptionErrorMessage !== "" ||
          !methods.formState.isValid ||
          isReadingHeader
        }
      >
        Apply
      </button>
    </>
  );
};

export default ActionGroup;
