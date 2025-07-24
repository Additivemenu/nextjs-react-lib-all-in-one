"use client";

import React, { useState } from "react";
import { useFileUploadModal } from "./FileUploadModal";
import { Button } from "@/components/ui/button";

const FileUploadExample: React.FC = () => {
  const { FileUploadModal, openModalAndUploadFiles } = useFileUploadModal();
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const uploadedFile = await openModalAndUploadFiles();
      if (uploadedFile) {
        setUploadedFileName(uploadedFile.name);
        console.log("File uploaded:", uploadedFile.name);
        // Here you could process the file, e.g., send it to a server
        // For example:
        // await sendFileToServer(uploadedFile);
      } else {
        console.log("No file uploaded");
        setUploadedFileName(null);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">File Upload Example</h1>
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>

      <FileUploadModal />
      
      {uploadedFileName && (
        <p className="mt-4">
          Last uploaded file:{" "}
          <span className="font-semibold">{uploadedFileName}</span>
        </p>
      )}
    </div>
  );
};

export default FileUploadExample;
