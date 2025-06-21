"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  filePath?: string;
  content?: string;
}

export function MarkdownViewer({ filePath, content }: MarkdownViewerProps) {
  const [markdownContent, setMarkdownContent] = useState<string>(content || "");
  const [loading, setLoading] = useState<boolean>(!content);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (content) return; // If content is provided, don't fetch

    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/markdown?file=${filePath || "README.md"}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch markdown");
        }
        const text = await response.text();
        setMarkdownContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath, content]);

  if (loading) {
    return <div className="text-center py-8">Loading markdown...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="prose prose-lg max-w-none h-[600px] overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
          // Fix for main headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-6 mb-3 text-gray-800">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
              {children}
            </h3>
          ),

          // Fix for paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>
          ),

          // CRITICAL FIX: Proper list styling
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-4 space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="text-gray-600 leading-relaxed">{children}</li>
          ),

          // Fix for nested lists
          // "ul ul": ({ children }) => (
          //   <ul className="list-disc list-outside ml-6 mt-2 mb-2 space-y-1">
          //     {children}
          //   </ul>
          // ),

          // Fix for code styling
          code: ({ children }) => (
            <code
              className={
                "block bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-800"
              }
            >
              {children}
            </code>
          ),

          // Fix for links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          // Fix for blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700">
              {children}
            </blockquote>
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
