// components/Sidebar.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/scripts/generate-nav";
import NavItem from "./components/nav-item";
import { getExpandedKeys } from "./utils/getExpandedKeys";

// Import with error handling
let navigation: NavigationItem[] = [];
try {
  navigation =
    require("@/scripts/output/nav/navigation.json") as NavigationItem[];
} catch (error) {
  console.error("Failed to load navigation.json:", error);
}

/**
 * TODO: navbar states should sync with URL all the time
 * @returns
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto expand sidebar items based on current path
    const keysToExpand = getExpandedKeys(navigation, pathname);
    console.log("Current pathname:", pathname);
    console.log("Keys to expand:", keysToExpand);
    setExpandedKeys(new Set(keysToExpand));
  }, [pathname]);

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
          <NavItem
            key={`root-${index}`}
            item={item}
            expandedKeys={expandedKeys}
            onToggleExpand={(itemPath: string) => {
              setExpandedKeys((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(itemPath)) {
                  newSet.delete(itemPath);
                } else {
                  newSet.add(itemPath);
                }
                return newSet;
              });
            }}
          />
        ))}
      </nav>
    </div>
  );
}
