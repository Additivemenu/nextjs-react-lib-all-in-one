import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readFile } from "fs/promises";
import { join } from "path";

async function getMarkdownContent(): Promise<string> {
  try {
    // Adjust the path based on where your README.md is located
    const filePath = join(process.cwd(), "README.md");
    const content = await readFile(filePath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading markdown file:", error);
    return "# Error\n\nCould not load markdown content.";
  }
}

export default async function MarkdownPage() {
  const markdownContent = await getMarkdownContent();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Map `h1` (`# heading`) to use `h2`s.
            h1: "h2",
            // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
            em(props) {
              const { node, ...rest } = props;
              return <i style={{ color: "red" }} {...rest} />;
            },

            // Custom styling for code blocks
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },

            // Custom styling for links
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
