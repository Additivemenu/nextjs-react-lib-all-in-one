import React from "react";

export type ModalKey = string | React.FC<ModalHocProps>

export interface ModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  delayVisible?: boolean;
  keepMounted?: boolean;
}

export interface ModalStore {
  [key: string]: ModalState;
}

export interface ModalContextType {
  store: ModalStore;
  dispatch: React.Dispatch<ModalAction>;
}

export interface ModalAction {
  type: string;
  payload: {
    modalId: string;
    args?: ModalArgs<Record<string, unknown>>;
    flags?: Record<string, unknown>;
  };
}

export interface ModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void;
    reject: (args: unknown) => void;
    promise: Promise<unknown>;
  };
}

// Omit will not work if extends Record<string, unknown>, which is not needed here
export interface ModalHocProps {
  id: string;
  defaultVisible?: boolean;
  keepMounted?: boolean;
}

export interface RegistryItem<P extends ModalArgs<unknown>> {
  comp: React.FC<P>;
  props?: P;
}

export interface ModalRegistry {
  [key: string]: RegistryItem<ModalArgs<Record<string, unknown>>>;
}

export type ModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<unknown>
  ? React.ComponentProps<T>
  : Record<string, unknown>;

export interface ModalHandler<Props = Record<string, unknown>> extends ModalState {

  visible: boolean;

  keepMounted: boolean;

  show: (args?: Props) => Promise<unknown>;

  hide: () => Promise<unknown>;

  resolve: (args?: unknown) => void;

  reject: (args?: unknown) => void;

  remove: () => void;

  resolveHide: (args?: unknown) => void;
}
