"use client";

import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <>
      <nav className="h-top-nav w-full shadow-xl p-12 flex items-center">
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          Home
        </button>
      </nav>
      <div className="relative h-main-content w-full flex">
        <div className="h-full flex flex-col shadow-lg p-4 min-w-[var(--left-sidebar-width)] grow">
          left side bar
        </div>
        <div className="flex flex-col justify-center items-center p-6 grow-[5]">
          {children}
        </div>
      </div>
    </>
  );
}
