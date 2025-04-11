import { removeModalAction } from "../actions";
import { hideModalCallbacks, modalCallbacks } from "../callbacks";
import { runDispatch } from "../reducer";
import { ModalKey } from "../types";
import { getModalId } from "../utils";

export const remove = (modal: ModalKey): void => {
  const modalId = getModalId(modal);
  runDispatch(removeModalAction(modalId));
  delete modalCallbacks[modalId];
  delete hideModalCallbacks[modalId];
};
