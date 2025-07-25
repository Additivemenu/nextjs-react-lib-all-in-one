import { NavigationItem } from "@/scripts/generate-nav";

export const getExpandedKeys = (
  items: NavigationItem[],
  currentPath: string,
  parents: string[] = [],
): string[] => {
  for (const item of items) {
    // If this is the current path, return all the parent paths
    if (item.path === currentPath) {
      return parents;
    }

    // If this item has children, search recursively
    if (item.children && item.children.length > 0) {
      const found = getExpandedKeys(item.children, currentPath, [
        ...parents,
        item.path,
      ]);

      // If found in children, return the found path which includes current item as parent
      if (found.length > 0) {
        return found;
      }
    }
  }
  return [];
};
