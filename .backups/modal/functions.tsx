import React, { useContext, useEffect } from "react";

import { ModalContext, ModalIdContext } from "./context";
import { setFlags } from "./handlers";
import { useModal } from "./hook";
import { ALREADY_MOUNTED, MODAL_REGISTRY } from "./registry";
import { ModalArgs, ModalHocProps } from "./types";

export const create = <P,>(
  Comp: React.ComponentType<P>
): React.FC<P & ModalHocProps> => {
  return function ModalComponent({
    defaultVisible,
    keepMounted,
    id,
    ...props
  }) {
    const { args, show } = useModal(id);

    // If there's modal state, then should mount it.
    const context = useContext(ModalContext);
    const shouldMount = !!context.store[id];

    useEffect(() => {
      // If defaultVisible, show it after mounted.
      if (defaultVisible) {
        show();
      }

      ALREADY_MOUNTED[id] = true;

      return () => {
        delete ALREADY_MOUNTED[id];
      };
    }, [id, show, defaultVisible]);

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true });
    }, [id, keepMounted]);

    const delayVisible = context.store[id]?.delayVisible;
    // If modal.show is called
    //  1. If modal was mounted, should make it visible directly
    //  2. If modal has not been mounted, should mount it first, then make it visible
    useEffect(() => {
      if (delayVisible) {
        // delayVisible: false => true, it means the modal.show() is called, should show it.
        show(args);
      }
    }, [delayVisible, args, show]);

    if (!shouldMount) return null;
    return (
      <ModalIdContext.Provider value={id}>
        <Comp {...(props as unknown as P)} {...args} />
      </ModalIdContext.Provider>
    );
  };
};

// All registered modals will be rendered in modal placeholder
export const register = <T extends React.FC<unknown>>(
  id: string,
  comp: T,
  props?: Partial<ModalArgs<T>>
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

/**
 * Unregister a modal.
 * @param id - The id of the modal.
 */
export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id];
};

/**
 * Clear all registered modals.
 */
export const clear = (): void => {
  Object.keys(MODAL_REGISTRY).forEach((id) => {
    delete MODAL_REGISTRY[id];
  });
};
