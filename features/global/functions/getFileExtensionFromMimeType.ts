export const getFileExtension = (mimeTypeOrUri: string): string | null => {
  // Check if the input is a MIME type
  if (mimeTypeOrUri.includes("/")) {
    const mimeTypeMap: { [key: string]: string } = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/bmp": "bmp",
      "image/svg+xml": "svg",
      "image/x-icon": "ico",
      "video/mp4": "mp4",
      "video/x-msvideo": "avi",
      "video/quicktime": "mov",
      "video/x-matroska": "mkv",
      "video/webm": "webm",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "audio/flac": "flac",
      "audio/aac": "aac",
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "text/plain": "txt",
      "text/csv": "csv",
      "application/json": "json",
      "application/xml": "xml",
      "application/zip": "zip",
      "application/vnd.rar": "rar",
      "application/x-7z-compressed": "7z",
      "application/x-tar": "tar",
      "application/gzip": "gz",
      "application/javascript": "js",
      "application/typescript": "ts",
      "text/html": "html",
      "text/css": "css",
      "application/vnd.android.package-archive": "apk",
      "application/x-msdownload": "exe",
      "application/octet-stream": "bin",
    };

    return mimeTypeMap[mimeTypeOrUri] || null; // Return extension if found, else null
  }

  // If it's a URI, extract the extension
  const extension = mimeTypeOrUri.split(".").pop()?.toLowerCase();
  return extension || null; // Return extension or null if not available
};
