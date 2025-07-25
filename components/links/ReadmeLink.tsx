import { generateReadmeURL } from "@/lib/utils";
import React from "react";

interface Props {
  readmePath: string;
}

const ReadmeLink: React.FC<Props> = ({ readmePath }) => {
  return (
    <a
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded shadow hover:from-blue-600 hover:to-purple-600 transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
      href={generateReadmeURL(readmePath)}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Check README!
    </a>
  );
};

export default ReadmeLink;
