"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/scripts/generate-nav";

interface NavItemProps {
  item: NavigationItem;
  level?: number;
  expandedKeys?: Set<string>;
  onToggleExpand?: (itemPath: string) => void;
}

/**
 * ! a recursive component
 *
 * @param param0
 * @returns
 */
function NavItem({
  item,
  level = 0,
  expandedKeys,
  onToggleExpand,
}: NavItemProps) {
  // Use controlled state from parent if provided, otherwise fallback to local state
  const [localIsOpen, setLocalIsOpen] = useState(level < 0);
  const isOpen = expandedKeys ? expandedKeys.has(item.path) : localIsOpen;
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

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand(item.path);
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };

  const paddingLeft = level * 16; // 16px per level instead of Tailwind classes

  return (
    <div style={{ paddingLeft: `${paddingLeft}px` }}>
      {item.hasPage && !hasChildren ? (
        // Leaf node with a page - render as Link
        <div className={``}>
          <Link
            href={item.path}
            className={`w-full py-2 px-3 rounded mb-1 transition-colors flex items-center ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
          >
            <span className="flex items-center">📄 {item.name}</span>
          </Link>
        </div>
      ) : (
        // Parent node or folder - render as button
        <button
          onClick={() => handleToggle()}
          className="w-full text-left py-2 px-3 hover:bg-gray-700 rounded flex items-center text-gray-300 mb-1"
        >
          <span className="flex items-center">
            {item.hasPage ? "📄" : "📁"} {item.name}
          </span>
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
              expandedKeys={expandedKeys}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NavItem;
