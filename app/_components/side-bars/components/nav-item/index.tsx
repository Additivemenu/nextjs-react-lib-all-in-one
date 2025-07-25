"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/scripts/generate-nav";

interface NavItemProps {
  item: NavigationItem;
  level?: number;
}

/**
 * ! a recursive component
 *
 * @param param0
 * @returns
 */
function NavItem({ item, level = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(level < 0); // Auto-expand first 0 levels
  const hasChildren = item.children && item.children.length > 0;

  const pathname = usePathname();
  const isActive = pathname === item.path; // ! sync with URL path
  if (isActive) {
    console.warn(
      "pathname",
      pathname,
      "item.path",
      item.path,
      "isActive",
      isActive,
    );
  }

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

export default NavItem;
