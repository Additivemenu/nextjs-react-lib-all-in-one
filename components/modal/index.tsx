"use client";
import React, { PropsWithChildren, useContext, useReducer } from "react";

import { Dialog } from "@/components/ui/dialog";
import { warn } from "@/lib/log";

import { ModalContext } from "./context";
import { clear, create, register } from "./functions";
import { hide, remove, show } from "./handlers";
import { useModal } from "./hook";
import { reducer, updateSharedDispatcher } from "./reducer";
import { ALREADY_MOUNTED, MODAL_REGISTRY } from "./registry";
import { ModalArgs, ModalStore } from "./types";

const initialState: ModalStore = {};

// Get modal component by modal id
function getModal(modalId: string): React.FC<ModalArgs<unknown>> | undefined {
  return MODAL_REGISTRY[modalId]?.comp;
}

// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there's been modal info
const ModalPlaceholder: React.FC = () => {
  const context = useContext(ModalContext);
  const visibleModalIds = Object.keys(context.store).filter(
    (id) =>
      !!context.store[id] &&
      (context.store[id].visible || context.store[id].delayVisible),
  );
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      warn(
        `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`,
      );
      return;
    }
  });

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id],
    }));

  const closeCallbackForId = (id: string) => () => remove(id);
  return (
    <>
      {toRender.map((t) => (
        <Dialog
          key={t.id}
          defaultCloseCallback={closeCallbackForId(t.id)}
          open={true}
        >
          <t.comp id={t.id} {...t.props} />
        </Dialog>
      ))}
    </>
  );
};

interface ProviderProps extends PropsWithChildren {
  manualPlaceholder?: boolean;
}

const Provider: React.FC<ProviderProps> = ({ manualPlaceholder, children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  updateSharedDispatcher(dispatch);

  return (
    <ModalContext.Provider value={{ store, dispatch }}>
      {children}
      {/* {!manualPlaceholder && <ModalPlaceholder />} */}
    </ModalContext.Provider>
  );
};

const ModalManager = {
  Provider,
  ModalContext,
  ModalPlaceholder,
  create,
  register,
  getModal,
  show,
  clear,
  hide,
  remove,
  useModal,
  reducer,
};

export default ModalManager;
