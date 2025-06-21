"use client";

import { MarkdownViewer } from "@/components/viewers/markdown-view";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const markdown = `
# Hello World

This is a **markdown** example.

- List item 1
`;

const Page = () => {
  return (
    <div>
      {/* option1: a dedicated page for markdown */}
      <Link
        href="/markdown"
        className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        View README Documentation
      </Link>

      {/* option2: a dynamic markdown viewer */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Dynamic Markdown Viewer</h1>
        <MarkdownViewer filePath="README.md" />
      </div>
    </div>
  );
};

export default Page;
