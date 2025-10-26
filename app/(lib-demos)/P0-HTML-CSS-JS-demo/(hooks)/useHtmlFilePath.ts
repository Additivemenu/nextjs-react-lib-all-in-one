import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useHtmlFilePath = () => {
  const pathname = usePathname();

  const htmlFilePath = useMemo(() => {
    const arr = pathname
      .split("/")
      .filter((item) => item.trim() !== "")
      .map((item) => item.trim());
    arr.shift();

    return `/demos/${arr.join("/")}/index.html`;
  }, [pathname]);

  return htmlFilePath;
};
