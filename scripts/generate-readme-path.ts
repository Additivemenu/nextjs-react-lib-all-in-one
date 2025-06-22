import { readdir, stat, writeFile, access } from "fs/promises";
import { join, relative } from "path";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function scanDirectory(
  dirPath: string,
  basePath: string = "app",
): Promise<void> {
  try {
    const entries = await readdir(dirPath);

    // Check if this directory has both page.tsx and readme.md
    const hasPageTsx = await fileExists(join(dirPath, "page.tsx"));
    const hasReadmeMd = await fileExists(join(dirPath, "readme.md"));

    if (hasPageTsx && hasReadmeMd) {
      // Calculate the relative path from the app directory
      const relativePath = relative(join(process.cwd(), "app"), dirPath);
      const readmePath = `app/${relativePath}/readme.md`;

      // Create readme-path.ts content
      const content = `export const readmePath = "${readmePath}";\n`;

      // Write the readme-path.ts file
      const readmePathFile = join(dirPath, "readme-path.ts");
      await writeFile(readmePathFile, content, "utf8");

      console.log(`✅ Generated: ${readmePathFile}`);
    }

    // Recursively scan subdirectories
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        await scanDirectory(fullPath, basePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

async function main() {
  const appDir = join(process.cwd(), "app");

  console.log("🔍 Scanning app directory for page.tsx and readme.md files...");

  try {
    await scanDirectory(appDir);
    console.log("✅ Script completed successfully!");
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
}

// Run the script
main();
