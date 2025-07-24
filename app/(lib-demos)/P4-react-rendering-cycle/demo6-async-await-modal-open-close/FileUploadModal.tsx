import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileUploadModalProps {
  onFileUpload: (file: File | null) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onFileUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    onFileUpload(selectedFile);
    setIsOpen(false);
  };

  const handleClose = () => {
    onFileUpload(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Open File Upload Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <input type="file" onChange={handleFileChange} />
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const useFileUploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const openModalAndUploadFiles = () => {
    return new Promise<File | null>((resolve) => {
      setIsOpen(true);
      setUploadedFile(null);

      const checkResult = () => {
        if (!isOpen) {
          resolve(uploadedFile);
        } else {
          setTimeout(checkResult, 100);
        }
      };

      checkResult();
    });
  };

  const onFileUpload = useCallback((file: File | null) => {
    setUploadedFile(file);
    setIsOpen(false);
  }, []);

  return {
    FileUploadModal: () => <FileUploadModal onFileUpload={onFileUpload} />,
    openModalAndUploadFiles,
  };
};

export default FileUploadModal;
