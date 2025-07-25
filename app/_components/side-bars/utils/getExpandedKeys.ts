import { NavigationItem } from "@/scripts/generate-nav";

export const getExpandedKeys = (
  items: NavigationItem[],
  currentPath: string,
  parents: string[] = [],
): string[] => {
  for (const item of items) {
    if (item.path === currentPath) {
      return parents;
    }
    if (item.children) {
      const found = getExpandedKeys(item.children, currentPath, [
        ...parents,
        item.path,
      ]);
      if (found.length) return found;
    }
  }
  return [];
};
