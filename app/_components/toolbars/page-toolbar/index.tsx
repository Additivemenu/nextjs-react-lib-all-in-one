import LinkButton from "@/components/links/LinkButton";
import React from "react";

interface PageToolbarProps {
  readmePath?: string;
  htmlFilePath?: string;
}

const PageToolbar: React.FC<PageToolbarProps> = ({
  readmePath,
  htmlFilePath,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 border-b w-96 rounded-tl-lg rounded-tr-lg">
      {readmePath && <LinkButton filePath={readmePath} />}
      {htmlFilePath && (
        <LinkButton filePath={htmlFilePath} label="source code" />
      )}
    </div>
  );
};

export default PageToolbar;
