"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <>
      <h2 className="text-red-500"> XLSX demo</h2>
    </>
  );
}
