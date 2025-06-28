
// action creator to show a modal
import {ModalAction, ModalArgs} from "./types";

export function showModalAction(modalId: string, args?: ModalArgs<unknown>): ModalAction {
  return {
    type: "modal/show",
    payload: {
      modalId,
      args,
    },
  };
}

// action creator to set flags of a modal
export function setModalFlagsAction(modalId: string, flags: Record<string, unknown>): ModalAction {
  return {
    type: "modal/set-flags",
    payload: {
      modalId,
      flags,
    },
  };
}

// action creator to hide a modal
export function hideModalAction(modalId: string): ModalAction {
  return {
    type: "modal/hide",
    payload: {
      modalId,
    },
  };
}

// action creator to remove a modal
export function removeModalAction(modalId: string): ModalAction {
  return {
    type: "modal/remove",
    payload: {
      modalId,
    },
  };
}