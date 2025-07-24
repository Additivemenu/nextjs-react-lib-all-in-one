import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReadmeURL(readmePath: string): string {
  const baseURL =
    "https://github.com/Additivemenu/nextjs-react-lib-all-in-one/blob/main/";

  return `${baseURL}/${readmePath}`;
}
