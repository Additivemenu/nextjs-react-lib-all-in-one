import { useEffect, useState } from "react";

export const useValidateAvailableHeaderOptionsEffect = (
  availableHeaderOptions: string[],
) => {
  const [
    availableHeaderOptionErrorMessage,
    setAvailableHeaderOptionErrorMessage,
  ] = useState<string>("");

  useEffect(() => {
    if (availableHeaderOptions.length === 0) {
      return;
    }

    // check if all headers in available headers are empty
    if (availableHeaderOptions.every((header) => header.trim() === "")) {
      setAvailableHeaderOptionErrorMessage(
        "Please use a different row that has concrete headers.",
      );
      return;
    }

    if (
      availableHeaderOptions.every((header) =>
        header.trim().startsWith("Unnamed"),
      )
    ) {
      setAvailableHeaderOptionErrorMessage(
        "All headers are unnamed! Please use a different row that has clearly named headers.",
      );
      return;
    }

    setAvailableHeaderOptionErrorMessage("");
  }, [availableHeaderOptions]);

  return {
    availableHeaderOptionErrorMessage,
  };
};
