import {ModalKey} from "./types";

const symModalId = Symbol("ModalId");
let uidSeed = 0;

export const getUid = () => `_modal_${uidSeed++}`;

export const getModalId = (modal: ModalKey): string => {
  if (typeof modal === "string") return modal as string;
  const modalAsRecord = modal as unknown as Record<symbol, string>;
  if (!modalAsRecord[symModalId]) {
    modalAsRecord[symModalId] = getUid();
  }
  return modalAsRecord[symModalId];
};