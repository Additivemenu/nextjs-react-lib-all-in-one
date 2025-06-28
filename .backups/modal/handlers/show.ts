import React from "react";

import { showModalAction } from "../actions";
import { modalCallbacks } from "../callbacks";
import { register } from "../functions";
import { runDispatch } from "../reducer";
import { MODAL_REGISTRY } from "../registry";
import { ModalArgs, ModalKey } from "../types";
import { getModalId } from "../utils";

export function show<T, C, P extends Partial<ModalArgs<React.FC<C>>>>(
  modal: React.FC<C>,
  args?: P,
): Promise<T>;

export function show<T>(
  modal: string,
  args?: Record<string, unknown>,
): Promise<T>;
export function show<T, P>(modal: string, args: P): Promise<T>;

export function show(
  modal: ModalKey,
  args?: ModalArgs<React.FC<Record<string, unknown>>> | Record<string, unknown>,
) {
  const modalId = getModalId(modal);
  if (typeof modal !== "string" && !MODAL_REGISTRY[modalId]) {
    // @ts-expect-error
    register(modalId, modal, args);
  }

  runDispatch(showModalAction(modalId, args));
  if (!modalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void;
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }
  return modalCallbacks[modalId].promise;
}
