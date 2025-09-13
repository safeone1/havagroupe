// lib/actions/uploadpic.ts
"use server";

import { writeFile, mkdir, readdir, readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function uploadFile(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate hash of file content to check for duplicates
    const fileHash = crypto.createHash("md5").update(buffer).digest("hex");

    // Define upload directory path
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      // Ensure upload directory exists
      await mkdir(uploadDir, { recursive: true });

      // Check if file with same content already exists
      const existingFiles = await readdir(uploadDir);
      for (const existingFile of existingFiles) {
        const existingFilePath = path.join(uploadDir, existingFile);
        try {
          const existingBuffer = await readFile(existingFilePath);
          const existingHash = crypto
            .createHash("md5")
            .update(existingBuffer)
            .digest("hex");

          if (existingHash === fileHash) {
            // File already exists, return existing URL
            console.log(`File already exists: ${existingFile}`);
            return `/uploads/${existingFile}`;
          }
        } catch {
          // Skip files that can't be read (might be directories or corrupted files)
          continue;
        }
      }

      // File doesn't exist, proceed with upload
      // Generate unique filename with proper extension
      const fileExtension = file.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExtension}`;

      const filePath = path.join(uploadDir, filename);

      // Write file to public/uploads directory
      await writeFile(filePath, buffer);

      // Return the public URL (relative to domain)
      console.log(`New file uploaded: ${filename}`);
      return `/uploads/${filename}`;
    } catch (fileError) {
      console.error("File operation error:", fileError);
      throw new Error(
        `Upload failed: ${
          fileError instanceof Error ? fileError.message : "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("File upload error:", error);
    throw error instanceof Error ? error : new Error("Upload failed");
  }
}
