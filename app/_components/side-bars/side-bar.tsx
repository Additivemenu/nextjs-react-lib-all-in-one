// components/Sidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/scripts/generate-nav";

// Import with error handling
let navigation: NavigationItem[] = [];
try {
  navigation =
    require("@/scripts/output/nav/navigation.json") as NavigationItem[];
} catch (error) {
  console.error("Failed to load navigation.json:", error);
}

interface NavItemProps {
  item: NavigationItem;
  level?: number;
}

function NavItem({ item, level = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(level < 0); // Auto-expand first 0 levels
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  const paddingLeft = level * 16; // 16px per level instead of Tailwind classes

  return (
    <div style={{ paddingLeft: `${paddingLeft}px` }}>
      {item.hasPage ? (
        <div className={``}>
          <Link
            href={item.path}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full py-2 px-3 rounded mb-1 transition-colors flex items-center ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <span className="flex items-center">📄 {item.name}</span>
            {hasChildren && (
              <span className="ml-auto text-xs">{isOpen ? "▼" : "▶"}</span>
            )}
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded flex items-center text-gray-300 mb-1"
        >
          <span className="flex items-center">📁 {item.name}</span>
          {hasChildren && (
            <span className="ml-auto text-xs">{isOpen ? "▼" : "▶"}</span>
          )}
        </button>
      )}

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children.map((child, index) => (
            <NavItem
              key={`${item.path}-${index}`}
              item={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  if (!navigation || navigation.length === 0) {
    return (
      <div className="w-full bg-gray-900 text-white p-4 h-full overflow-y-auto border-r border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-white">React Demos</h2>
        <p className="text-gray-400">
          No navigation found. Run `npm run generate-nav` first.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white p-4 h-full overflow-y-auto border-r border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-white">React Demos</h2>
      <nav className="space-y-1">
        {navigation.map((item, index) => (
          <NavItem key={`root-${index}`} item={item} />
        ))}
      </nav>
    </div>
  );
}
