import { SimpleModal, SimpleModalProps } from "./simple-modal";
import { ConfirmModal, ConfirmModalProps } from "./confirm-modal";
import { FormModal, FormModalProps, FormField } from "./form-modal";

// Base modal props that all modals should have
export interface BaseModalProps {
  onClose: () => void;
}

export {
  SimpleModal,
  ConfirmModal,
  FormModal,
  type FormField,
  type SimpleModalProps,
  type ConfirmModalProps,
  type FormModalProps,
};
