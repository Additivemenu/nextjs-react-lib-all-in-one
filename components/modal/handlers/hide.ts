import React from "react";

import { hideModalAction } from "../actions";
import { hideModalCallbacks, modalCallbacks } from "../callbacks";
import { runDispatch } from "../reducer";
import { ModalKey } from "../types";
import { getModalId } from "../utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function hide<T>(modal: ModalKey): Promise<T>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hide(modal: string | React.FC<unknown>) {
  const modalId = getModalId(modal);
  runDispatch(hideModalAction(modalId));
  // Should also delete the callback for modal.resolve #35
  delete modalCallbacks[modalId];
  if (!hideModalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void;
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }
  return hideModalCallbacks[modalId].promise;
}
