# Auto-Expand Navigation Algorithm Guide

## Overview

This document explains how to implement auto-expand functionality for a navigation sidebar based on URL pathname in React/Next.js applications.

:white_check_mark: [Algorithms behind the scenes](./docs/algorithms-behind.md)

## 1. Core Components Overview

The solution involves three main parts working together:

- **Sidebar Component**: Manages the expanded state and triggers updates when pathname changes
- **getExpandedKeys Utility**: Finds which parent items need to be expanded for a given path
- **NavItem Component**: Renders items based on the controlled expanded state

## 2. The Flow Step by Step

### Step 1: Pathname Change Detection

```typescript
// In Sidebar component
const pathname = usePathname(); // Next.js hook to get current URL path

useEffect(() => {
  // Triggers whenever the URL pathname changes
  const keysToExpand = getExpandedKeys(navigation, pathname);
  setExpandedKeys(new Set(keysToExpand));
}, [pathname]); // Dependency array ensures this runs on pathname change
```

### Step 2: Finding Parent Paths to Expand

```typescript
// The getExpandedKeys utility function
export const getExpandedKeys = (
  items: NavigationItem[],
  currentPath: string,
  parents: string[] = [], // Accumulates parent paths as we traverse
): string[] => {
  for (const item of items) {
    // If we found the current page, return all its parents
    if (item.path === currentPath) {
      return parents; // This contains all parent paths that need expanding
    }

    // If this item has children, search recursively
    if (item.children && item.children.length > 0) {
      const found = getExpandedKeys(item.children, currentPath, [
        ...parents,
        item.path, // Add current item as a parent for deeper search
      ]);

      // If found in children, return the path
      if (found.length > 0) {
        return found;
      }
    }
  }
  return [];
};
```

### Step 3: State Management & Propagation

```typescript
// Sidebar manages the expanded state
const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

// Passes controlled state down to all NavItem components
<NavItem
  item={item}
  expandedKeys={expandedKeys} // Controlled state
  onToggleExpand={(itemPath: string) => {
    // Manual toggle functionality
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
/>;
```

### Step 4: Controlled Rendering

```typescript
// In NavItem component
const isOpen = expandedKeys ? expandedKeys.has(item.path) : localIsOpen;

// Each NavItem checks if its path is in the expandedKeys set
// If yes → render as expanded
// If no → render as collapsed
```

## 3. Example Walkthrough

Let's say the user navigates to `/P1-react-libs/C0-error-boundary/page1`:

1. **Pathname Changes**: useEffect detects the new pathname
2. **Tree Traversal**: getExpandedKeys recursively searches the navigation tree:
   - Finds the target path at `/P1-react-libs/C0-error-boundary/page1`
   - Returns the parent paths: `["/P1-react-libs", "/P1-react-libs/C0-error-boundary"]`
3. **State Update**: `setExpandedKeys(new Set(["/P1-react-libs", "/P1-react-libs/C0-error-boundary"]))`
4. **Re-render**: All NavItem components re-render and check `expandedKeys.has(item.path)`
   - `/P1-react-libs` → `isOpen = true` (expanded)
   - `/P1-react-libs/C0-error-boundary` → `isOpen = true` (expanded)
   - Other items → `isOpen = false` (collapsed)

## 4. Key Benefits of This Approach

- **Automatic**: Works without user interaction when navigating via URL
- **Efficient**: Only expands the necessary parent items, not everything
- **Consistent**: Works whether user clicks links or navigates via browser/bookmarks
- **Controlled State**: Single source of truth for expansion state
- **Manual Override**: Users can still manually expand/collapse items

## 5. The Recursive Magic

The getExpandedKeys function uses recursion with parent path accumulation:

- **Base Case**: When it finds the target path, return all accumulated parents
- **Recursive Case**: For each item with children, search deeper while adding current item to parents
- **Backtracking**: If not found in a branch, try the next branch

This ensures we find the exact path from root to the current page and return all the intermediate parents that need to be expanded to show that path in the UI.

The beauty of this solution is that it's **declarative** - we tell the UI "these items should be expanded" rather than imperatively walking through and expanding each one individually!

## 6. Algorithm Analysis

### Primary Algorithm: Depth-First Search (DFS) with Path Tracking

The core algorithm in `getExpandedKeys` is a **Depth-First Search (DFS)** with path accumulation:

```typescript
export const getExpandedKeys = (
  items: NavigationItem[],
  currentPath: string,
  parents: string[] = [], // Path accumulation
): string[] => {
  for (const item of items) {
    // Base case: target found
    if (item.path === currentPath) {
      return parents; // Return accumulated path
    }

    // Recursive case: DFS into children
    if (item.children && item.children.length > 0) {
      const found = getExpandedKeys(item.children, currentPath, [
        ...parents,
        item.path, // Add current node to path
      ]);

      if (found.length > 0) {
        return found; // Early termination when found
      }
    }
  }
  return []; // Not found in this branch
};
```

---

_This guide provides a complete understanding of implementing auto-expand navigation functionality using efficient algorithms and React best practices._
