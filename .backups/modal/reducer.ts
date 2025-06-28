// Modal reducer used in useReducer hook.
import React from "react";

import {ALREADY_MOUNTED} from "./registry";
import {ModalAction, ModalStore} from "./types";

const initialState: ModalStore = {};

export const reducer = (
  state: ModalStore = initialState,
  action: ModalAction,
): ModalStore => {
  switch (action.type) {
    case "modal/show": {
      const { modalId, args } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
        },
      };
    }
    case "modal/hide": {
      const { modalId } = action.payload;
      if (!state[modalId]) return state;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false,
        },
      };
    }
    case "modal/remove": {
      const { modalId } = action.payload;
      const newState = { ...state };
      delete newState[modalId];
      return newState;
    }
    case "modal/set-flags": {
      const { modalId, flags } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      };
    }
    default:
      return state;
  }
};

let sharedDispatcher: React.Dispatch<ModalAction> | null = null;

export const updateSharedDispatcher = (dispatcher: React.Dispatch<ModalAction>) => {
  sharedDispatcher = dispatcher;
};

export const runDispatch = (action: ModalAction) => {
  if (!sharedDispatcher) throw new Error("No shared dispatcher found in modal reducer.");
  return sharedDispatcher(action);
};