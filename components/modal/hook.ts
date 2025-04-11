import React, { useCallback, useContext, useEffect, useMemo } from "react";

import { hideModalCallbacks, modalCallbacks } from "./callbacks";
import { ModalContext, ModalIdContext } from "./context";
import { register } from "./functions";
import { hide, remove, show } from "./handlers";
import { MODAL_REGISTRY } from "./registry";
import { ModalArgs, ModalHandler, ModalKey } from "./types";
import { getModalId } from "./utils";

export function useModal(): ModalHandler;
export function useModal(
  modal: string,
  args?: Record<string, unknown>,
): ModalHandler;
export function useModal<C, P extends Partial<ModalArgs<React.FC<C>>>>(
  modal: React.FC<C>,
  args?: P,
): Omit<ModalHandler, "show"> & {
  show: (args?: P) => Promise<unknown>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useModal(
  modal?: ModalKey,
  args?: Partial<ModalArgs<unknown>>,
): unknown {
  const context = useContext(ModalContext);
  const contextModalId = useContext(ModalIdContext);
  let modalId: string | null = null;
  const isUseComponent = modal && typeof modal !== "string";
  if (!modal) {
    modalId = contextModalId;
  } else {
    modalId = getModalId(modal);
  }

  // Only if contextModalId doesn't exist
  if (!modalId) throw new Error("No modal id found in Modal.useModal.");

  const mid = modalId as string;
  // If use a component directly, register it.
  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      register(mid, modal, args);
    }
  }, [isUseComponent, mid, modal, args]);

  const modalInfo = context.store[mid];

  const showCallback = useCallback(
    (args?: Record<string, unknown>) => show(mid, args),
    [mid],
  );
  const hideCallback = useCallback(() => hide(mid), [mid]);
  const removeCallback = useCallback(() => remove(mid), [mid]);
  const resolveCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.resolve(args);
      delete modalCallbacks[mid];
    },
    [mid],
  );
  const rejectCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.reject(args);
      delete modalCallbacks[mid];
    },
    [mid],
  );
  const resolveHide = useCallback(
    (args?: unknown) => {
      hideModalCallbacks[mid]?.resolve(args);
      delete hideModalCallbacks[mid];
    },
    [mid],
  );

  return useMemo(
    () => ({
      id: mid,
      args: modalInfo?.args,
      visible: !!modalInfo?.visible,
      keepMounted: !!modalInfo?.keepMounted,
      show: showCallback,
      hide: hideCallback,
      remove: removeCallback,
      resolve: resolveCallback,
      reject: rejectCallback,
      resolveHide,
    }),
    [
      mid,
      modalInfo?.args,
      modalInfo?.visible,
      modalInfo?.keepMounted,
      showCallback,
      hideCallback,
      removeCallback,
      resolveCallback,
      rejectCallback,
      resolveHide,
    ],
  );
}
