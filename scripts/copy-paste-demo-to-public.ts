// this script runs at build time
// it scans all the files under app/(lib-demos) folder and capture the "demo" folder within it
// it will record 1) the path to the demo folder 2) the list of files under the demo folder
// then it will copy the demo folder and its files to the public/demons folder
// maintaining the same relative path structure
// e.g. app/(lib-demos)/P0-HTML-CSS-JS-demo/js/01-thumbs-up/demo -> public/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/
// all files under 
// "app/(lib-demos)/P0-HTML-CSS-JS-demo/js/01-thumbs-up/demo" folder will be copied to 
// "public/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/" folder

import fs from "fs";
import path from "path";

interface DemoInfo {
  sourcePath: string;
  relativePath: string;
  files: string[];
}

/**
 * Recursively scans a directory to find all "demo" folders
 * @param dir - Directory to scan
 * @param baseDir - Base directory for calculating relative paths
 * @param demoFolders - Array to collect demo folder information
 */
function findDemoFolders(
  dir: string,
  baseDir: string,
  demoFolders: DemoInfo[] = [],
): DemoInfo[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // If this is a "demo" folder, record it
      if (entry.name === "demo") {
        const files = fs.readdirSync(fullPath);
        const relativePath = path.relative(baseDir, path.dirname(fullPath));

        demoFolders.push({
          sourcePath: fullPath,
          relativePath,
          files,
        });

        console.log(`Found demo folder: ${fullPath}`);
        console.log(`  Relative path: ${relativePath}`);
        console.log(`  Files: ${files.join(", ")}`);
      } else {
        // Recursively scan subdirectories
        findDemoFolders(fullPath, baseDir, demoFolders);
      }
    }
  }

  return demoFolders;
}

/**
 * Copies files from demo folders to the public/demos directory
 * @param demoInfo - Information about the demo folder
 * @param publicDemosDir - Target public/demos directory
 */
function copyDemoFiles(demoInfo: DemoInfo, publicDemosDir: string): void {
  const targetDir = path.join(publicDemosDir, demoInfo.relativePath);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy each file
  for (const file of demoInfo.files) {
    const sourcePath = path.join(demoInfo.sourcePath, file);
    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`  Copied: ${file} -> ${targetPath}`);
    }
  }
}

// Main execution
console.log("Starting demo files copy process...\n");

const appDemosDir = path.join(process.cwd(), "app", "(lib-demos)");
const publicDemosDir = path.join(process.cwd(), "public", "demos");

// Check if source directory exists
if (!fs.existsSync(appDemosDir)) {
  console.error(`Error: Source directory not found: ${appDemosDir}`);
  process.exit(1);
}

// Ensure public/demos directory exists
if (!fs.existsSync(publicDemosDir)) {
  fs.mkdirSync(publicDemosDir, { recursive: true });
  console.log(`Created public/demos directory: ${publicDemosDir}\n`);
}

// Find all demo folders
const demoFolders = findDemoFolders(appDemosDir, appDemosDir);

console.log(`\nFound ${demoFolders.length} demo folder(s)\n`);

// Copy files from each demo folder
let totalFilesCopied = 0;
for (const demoInfo of demoFolders) {
  console.log(`Copying files from: ${demoInfo.relativePath}`);
  copyDemoFiles(demoInfo, publicDemosDir);
  totalFilesCopied += demoInfo.files.length;
  console.log("");
}

console.log(
  `✅ Successfully copied ${totalFilesCopied} file(s) from ${demoFolders.length} demo folder(s)!`,
);
