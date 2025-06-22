import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, normalize, relative } from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file") || "README.md";

  // Security: Only allow markdown files under (lib-demos) directory
  const allowedDirectories = ["(lib-demos)"];
  const allowedExtensions = [".md", ".markdown"];

  try {
    // Normalize the file path to prevent directory traversal
    const normalizedPath = normalize(fileName);

    // Check if the path contains any directory traversal attempts
    if (
      normalizedPath.includes("..") ||
      normalizedPath.startsWith("/") ||
      normalizedPath.startsWith("\\")
    ) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
    }

    // Check if the file is under an allowed directory
    const isUnderAllowedDirectory = allowedDirectories.some(
      (dir) =>
        normalizedPath.startsWith(dir) || normalizedPath.includes(`/${dir}/`),
    );

    if (!isUnderAllowedDirectory) {
      return NextResponse.json(
        {
          error: "File must be under (lib-demos) directory",
          allowed: "Only files under (lib-demos) directory are allowed",
        },
        { status: 403 },
      );
    }

    // Check if the file has an allowed extension
    const hasAllowedExtension = allowedExtensions.some((ext) =>
      normalizedPath.toLowerCase().endsWith(ext),
    );

    if (!hasAllowedExtension) {
      return NextResponse.json(
        {
          error: "Only markdown files are allowed",
          allowed: allowedExtensions.join(", "),
        },
        { status: 403 },
      );
    }

    // Use app directory as the base path since files are in app/(lib-demos)
    const basePath = join(process.cwd(), "app");
    const filePath = join(basePath, normalizedPath);

    // Additional security check: ensure the resolved path is still under allowed directories
    const relativePath = relative(basePath, filePath);
    const finalIsUnderAllowedDirectory = allowedDirectories.some(
      (dir) =>
        relativePath.startsWith(dir) || relativePath.includes(`/${dir}/`),
    );

    if (!finalIsUnderAllowedDirectory) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        {
          error: "File not found",
          path: filePath,
          normalizedPath: normalizedPath,
        },
        { status: 404 },
      );
    }

    const content = await readFile(filePath, "utf8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
