import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file") || "README.md";

  // Security: Only allow certain file names to prevent directory traversal
  const allowedFiles = ["README.md", "CHANGELOG.md", "CONTRIBUTING.md"];

  if (!allowedFiles.includes(fileName)) {
    return NextResponse.json({ error: "File not allowed" }, { status: 403 });
  }

  try {
    const filePath = join(process.cwd(), fileName);
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
