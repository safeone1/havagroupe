"use client";

import {
  AlertCircleIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
  CheckIcon,
} from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/actions/uploadpic";
import { toast } from "sonner";
import Image from "next/image";
import { useState, useImperativeHandle, forwardRef, useEffect } from "react";

interface UploaderProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  maxSizeMB?: number;
  initialImageUrl?: string; // URL of existing image to display
}

export interface UploaderRef {
  uploadSelectedFile: () => Promise<string | null>;
  getSelectedFile: () => File | null;
  clearSelectedFile: () => void;
  clearExistingImage: () => void;
}

const Uploader = forwardRef<UploaderRef, UploaderProps>(
  (
    {
      onFileSelect,
      onUploadComplete,
      maxSizeMB = 5,
      initialImageUrl,
    }: UploaderProps,
    ref
  ) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(
      initialImageUrl || null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const maxSize = maxSizeMB * 1024 * 1024;

    const [
      { files, isDragging, errors },
      {
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        openFileDialog,
        removeFile,
        clearFiles,
        getInputProps,
      },
    ] = useFileUpload({
      accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
      maxSize,
      multiple: false,
      onFilesAdded: (addedFiles) => {
        if (addedFiles.length > 0) {
          const file = addedFiles[0].file as File;
          setSelectedFile(file);
          onFileSelect?.(file);
        }
      },
    });

    // Update uploadedUrl when initialImageUrl changes
    useEffect(() => {
      if (initialImageUrl) {
        setUploadedUrl(initialImageUrl);
      }
    }, [initialImageUrl]);

    const handleUpload = async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const url = await uploadFile(formData);
        setUploadedUrl(url);
        onUploadComplete?.(url);
        toast.success("File uploaded successfully!");
        return url;
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error instanceof Error ? error.message : "Upload failed");
        throw error;
      } finally {
        setUploading(false);
      }
    };

    const handleRemoveFile = (fileId: string) => {
      removeFile(fileId);
      setSelectedFile(null);
    };

    const handleClearFiles = () => {
      clearFiles();
      setSelectedFile(null);
    };

    const handleClearExistingImage = () => {
      setUploadedUrl(null);
      setSelectedFile(null);
      clearFiles();
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      uploadSelectedFile: async () => {
        if (selectedFile) {
          return await handleUpload(selectedFile);
        }
        return null;
      },
      getSelectedFile: () => selectedFile,
      clearSelectedFile: () => {
        handleClearFiles();
      },
      clearExistingImage: () => {
        handleClearExistingImage();
      },
    }));

    return (
      <div className="flex flex-col gap-2">
        {/* Upload status / Existing image */}
        {uploadedUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckIcon className="size-4 text-green-600" />
              <span className="text-sm text-green-700">
                {initialImageUrl && uploadedUrl === initialImageUrl
                  ? "Current image:"
                  : "File uploaded successfully!"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-accent aspect-square shrink-0 rounded">
                <Image
                  src={uploadedUrl}
                  alt="Uploaded image"
                  width={60}
                  height={60}
                  className="size-15 rounded-[inherit] object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {uploadedUrl.split("/").pop()}
                </p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View full size
                </a>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearExistingImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        )}

        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          data-files={files.length > 0 || undefined}
          className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            {uploading ? (
              <>
                <p className="mb-1.5 text-sm font-medium">Uploading...</p>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <p className="mb-1.5 text-sm font-medium">
                  Drop your images here
                </p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={openFileDialog}
                  disabled={uploading}
                >
                  <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                  Select images
                </Button>
              </>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}

        {/* File list - show selected file */}
        {files.length > 0 && !uploadedUrl && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-accent aspect-square shrink-0 rounded">
                    <Image
                      src={file.preview || "/placeholder.png"}
                      alt={file.file.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-[inherit] object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-[13px] font-medium">
                      {file.file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(file.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 font-medium">
                    Ready to upload
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                    onClick={() => handleRemoveFile(file.id)}
                    aria-label="Remove file"
                    disabled={uploading}
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Clear files button */}
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFiles}
                disabled={uploading}
              >
                Remove file
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Uploader.displayName = "Uploader";

export default Uploader;
