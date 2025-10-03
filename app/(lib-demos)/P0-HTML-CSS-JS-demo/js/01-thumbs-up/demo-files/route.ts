import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file") || "index.html";

    // Security: only allow specific files
    const allowedFiles = ["index.html", "index.css", "index.js"];
    if (!allowedFiles.includes(file)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const demoPath = join(
      process.cwd(),
      "app/(lib-demos)/P0-HTML-CSS-JS-demo/js/01-thumbs-up/demo",
    );

    if (file === "index.html") {
      // For HTML, inject CSS and JS directly
      const htmlContent = await readFile(join(demoPath, "index.html"), "utf-8");
      const cssContent = await readFile(join(demoPath, "index.css"), "utf-8");
      const jsContent = await readFile(join(demoPath, "index.js"), "utf-8");

      // Inject CSS and JS into the HTML
      const finalHtml = htmlContent
        .replace("/* CSS will be injected here */", cssContent)
        .replace("// JavaScript will be injected here", jsContent);

      return new NextResponse(finalHtml, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    } else {
      // For individual CSS/JS files (if needed for debugging)
      const content = await readFile(join(demoPath, file), "utf-8");
      const contentTypes: Record<string, string> = {
        "index.css": "text/css",
        "index.js": "application/javascript",
      };

      return new NextResponse(content, {
        headers: {
          "Content-Type": contentTypes[file] || "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("Error serving demo file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
