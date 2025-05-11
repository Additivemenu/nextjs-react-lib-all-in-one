"use client";

import { useContext } from "react";

import { FileOptionModalContext } from "./context";
import { FileOptionModalProvider } from "./provider";

const useFileOptionModalContext = () => useContext(FileOptionModalContext);
export { useFileOptionModalContext, FileOptionModalProvider };

