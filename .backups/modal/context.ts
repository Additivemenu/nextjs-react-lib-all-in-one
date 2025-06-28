import React from "react";

import {ModalContextType} from "./types";

const initialState: ModalContextType = {
  store: {},
  dispatch: () => {
    throw new Error("No dispatch method detected, did you embed your app with Modal.Provider?");
  },
};

export const ModalIdContext = React.createContext<string | null>(null);
export const ModalContext = React.createContext<ModalContextType>(initialState);