// scripts/generate-nav.ts
import fs from "fs";
import path from "path";

export interface NavigationItem {
  name: string;
  path: string;
  hasPage: boolean;
  children: NavigationItem[];
}

function formatName(name: string): string {
  // Handle special naming patterns like "P1-react-libs", "C0-error-boundary"
  return name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * recursively generates navigation structure from the Next.js app directory.
 * @param dir
 * @param basePath
 * @param currentDepth
 * @returns
 */
function generateNavigation(
  dir: string = "app",
  basePath: string = "",
  currentDepth: number = 0,
): NavigationItem[] {
  const items: NavigationItem[] = [];
  const fullPath = path.join(process.cwd(), dir);

  console.log(`Scanning directory: ${fullPath}`); // Debug log

  if (!fs.existsSync(fullPath)) {
    console.log(`Directory doesn't exist: ${fullPath}`);
    return items;
  }

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  console.log(`Found entries: ${entries.map((e) => e.name).join(", ")}`); // Debug log

  for (const entry of entries) {
    const entryPath = path.join(fullPath, entry.name);

    if (entry.isDirectory()) {
      // Skip special Next.js directories and non-demo folders
      if (
        entry.name.startsWith("_") ||
        entry.name === "api" ||
        entry.name === "globals.css" ||
        entry.name.startsWith(".")
      ) {
        continue;
      }

      // Handle route groups (folders with parentheses)
      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        // For route groups, merge their children into the current level
        const groupChildren = generateNavigation(
          path.join(dir, entry.name),
          basePath,
          currentDepth,
        );
        items.push(...groupChildren);
        continue;
      }

      const childPath = basePath
        ? `${basePath}/${entry.name}`
        : `/${entry.name}`;

      // Check for page files (including nested ones)
      const hasPageFile =
        fs.existsSync(path.join(entryPath, "page.tsx")) ||
        fs.existsSync(path.join(entryPath, "page.ts")) ||
        fs.existsSync(path.join(entryPath, "page.jsx")) ||
        fs.existsSync(path.join(entryPath, "page.js"));

      // Get children recursively
      const children = generateNavigation(
        path.join(dir, entry.name),
        childPath,
        currentDepth + 1,
      );

      // Only add the item if it has a page or has children with pages
      if (hasPageFile || children.length > 0) {
        const item: NavigationItem = {
          name: formatName(entry.name),
          path: childPath,
          hasPage: hasPageFile,
          children: children,
        };

        console.log(
          `Adding item: ${item.name} (${item.path}) - hasPage: ${item.hasPage}`,
        ); // Debug log
        items.push(item);
      }
    }
  }

  // Sort items to maintain consistent order
  items.sort((a, b) => {
    // Put items with pages first, then folders
    if (a.hasPage && !b.hasPage) return -1;
    if (!a.hasPage && b.hasPage) return 1;
    return a.name.localeCompare(b.name);
  });

  return items;
}

console.log("Generating navigation...");
const navigation = generateNavigation();
console.log("Generated navigation:", JSON.stringify(navigation, null, 2));

// Ensure lib directory exists
const libDir = path.join(process.cwd(), "lib");
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

fs.writeFileSync(
  "scripts/output/nav/navigation.json",
  JSON.stringify(navigation, null, 2),
);
console.log("Navigation generated successfully!");
