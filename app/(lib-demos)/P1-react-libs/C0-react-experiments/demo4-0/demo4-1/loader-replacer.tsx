import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import "./load-spinner.css";
import { replaceLoadSpinner } from "./load-spinner";

export const useReplaceLoadSpinnerEffect = () => {
  useEffect(() => {
    replaceLoadSpinner();
  });
};
