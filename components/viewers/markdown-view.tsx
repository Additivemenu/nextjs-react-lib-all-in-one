"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  filePath?: string | (() => string); // used for constructing the API URL to fetch markdown content
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
    <div className="bg-[#0d1117] p-4 prose prose-lg max-w-none h-[600px] overflow-y-auto">
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        // ! Next.js aggresively removes all the default styles, so we need to add them back manually
        // components={{
        //   // Fix for main headings
        //   h1: ({ children }) => (
        //     <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
        //       {children}
        //     </h1>
        //   ),
        //   h2: ({ children }) => (
        //     <h2 className="text-xl font-bold mt-6 mb-3 text-gray-800">
        //       {children}
        //     </h2>
        //   ),
        //   h3: ({ children }) => (
        //     <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
        //       {children}
        //     </h3>
        //   ),

        //   // Fix for paragraphs
        //   p: ({ children }) => (
        //     <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>
        //   ),

        //   // CRITICAL FIX: Proper list styling
        //   ul: ({ children }) => (
        //     <ul className="list-disc list-outside ml-6 mb-4 space-y-1">
        //       {children}
        //     </ul>
        //   ),

        //   ol: ({ children }) => (
        //     <ol className="list-decimal list-outside ml-6 mb-4 space-y-1">
        //       {children}
        //     </ol>
        //   ),

        //   li: ({ children }) => (
        //     <li className="text-gray-600 leading-relaxed">{children}</li>
        //   ),

        //   // Fix for nested lists
        //   // "ul ul": ({ children }) => (
        //   //   <ul className="list-disc list-outside ml-6 mt-2 mb-2 space-y-1">
        //   //     {children}
        //   //   </ul>
        //   // ),

        //   // Fix for code styling
        //   code: ({ children }) => (
        //     <code
        //       className={
        //         "block bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-800"
        //       }
        //     >
        //       {children}
        //     </code>
        //   ),

        //   // Fix for links
        //   a: ({ href, children }) => (
        //     <a
        //       href={href}
        //       className="text-blue-600 underline hover:text-blue-800 transition-colors"
        //       target={href?.startsWith("http") ? "_blank" : undefined}
        //       rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        //     >
        //       {children}
        //     </a>
        //   ),

        //   // Fix for blockquotes
        //   blockquote: ({ children }) => (
        //     <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700">
        //       {children}
        //     </blockquote>
        //   ),
        // }}
        components={{
          // github dark mode styles

          // GitHub-style headings with proper hierarchy
          h1: ({ children }) => (
            <h1 className="text-3xl font-semibold mt-6 mb-4 text-[#f0f6fc] border-b border-[#21262d] pb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-[#f0f6fc] border-b border-[#21262d] pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 text-[#f0f6fc]">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mt-6 mb-3 text-[#f0f6fc]">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mt-6 mb-3 text-[#f0f6fc]">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mt-6 mb-3 text-[#8b949e] uppercase tracking-wide">
              {children}
            </h6>
          ),

          // GitHub-style paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-[#e6edf3] leading-7 text-base">
              {children}
            </p>
          ),

          // GitHub-style lists with proper bullets and spacing
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-[#e6edf3] marker:text-[#7d8590]">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-[#e6edf3] marker:text-[#7d8590]">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="text-[#e6edf3] leading-7 pl-1">{children}</li>
          ),

          // GitHub-style code blocks and inline code
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            return (
              <div className="relative mb-4">
                {language && (
                  <div className="absolute top-0 right-0 bg-[#21262d] text-[#7d8590] text-xs px-3 py-1 rounded-bl-md rounded-tr-md border-l border-b border-[#30363d]">
                    {language}
                  </div>
                )}
                <pre className="bg-[#161b22] border border-[#30363d] rounded-md p-4 overflow-x-auto">
                  <code
                    className="text-[#e6edf3] text-sm font-mono leading-6"
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // GitHub-style links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[#58a6ff] hover:text-[#79c0ff] hover:underline transition-colors"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),

          // GitHub-style blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#30363d] bg-[#161b2208] pl-4 py-1 my-4 text-[#8b949e]">
              {children}
            </blockquote>
          ),

          // GitHub-style tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-[#30363d] rounded-md">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-[#161b22]">{children}</thead>
          ),

          th: ({ children, style, ...props }) => (
            <th
              className="border border-[#30363d] px-3 py-2 text-left font-semibold text-[#f0f6fc] bg-[#161b22]"
              {...props}
            >
              {children}
            </th>
          ),

          td: ({ children, style, ...props }) => (
            <td
              className="border border-[#30363d] px-3 py-2 text-[#e6edf3]"
              {...props}
            >
              {children}
            </td>
          ),

          // GitHub-style horizontal rules
          hr: () => <hr className="border-0 border-t border-[#21262d] my-6" />,

          // GitHub-style images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-md my-4 border border-[#30363d]"
            />
          ),

          // GitHub-style strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-[#f0f6fc]">{children}</strong>
          ),

          // GitHub-style emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-[#e6edf3]">{children}</em>
          ),

          // GitHub-style task lists (checkboxes)
          input: ({ type, checked, disabled }) =>
            type === "checkbox" ? (
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                className="mr-2 accent-[#58a6ff] bg-[#21262d] border-[#30363d]"
              />
            ) : null,
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
