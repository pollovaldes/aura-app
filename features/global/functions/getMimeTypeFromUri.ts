import { Platform } from "react-native";

export const getMimeTypeFromUri = async (uri: string): Promise<string> => {
  if (Platform.OS === "web") {
    // Web: Use fetch to get MIME type
    const response = await fetch(uri);
    const mimeType = response.headers.get("Content-Type");
    if (!mimeType) {
      throw new Error("Unable to determine MIME type");
    }
    return mimeType;
  } else {
    // React Native: Use file extension mapping
    const extension = uri.split(".").pop()?.toLowerCase();
    switch (extension) {
      // Image types
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "gif":
        return "image/gif";
      case "bmp":
        return "image/bmp";
      case "svg":
        return "image/svg+xml";
      case "ico":
        return "image/x-icon";

      // Video types
      case "mp4":
        return "video/mp4";
      case "avi":
        return "video/x-msvideo";
      case "mov":
        return "video/quicktime";
      case "mkv":
        return "video/x-matroska";
      case "webm":
        return "video/webm";
      case "flv":
        return "video/x-flv";

      // Audio types
      case "mp3":
        return "audio/mpeg";
      case "wav":
        return "audio/wav";
      case "ogg":
        return "audio/ogg";
      case "flac":
        return "audio/flac";
      case "aac":
        return "audio/aac";

      // Document types
      case "pdf":
        return "application/pdf";
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "xls":
        return "application/vnd.ms-excel";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "ppt":
        return "application/vnd.ms-powerpoint";
      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "txt":
        return "text/plain";
      case "csv":
        return "text/csv";
      case "json":
        return "application/json";
      case "xml":
        return "application/xml";

      // Archive types
      case "zip":
        return "application/zip";
      case "rar":
        return "application/vnd.rar";
      case "7z":
        return "application/x-7z-compressed";
      case "tar":
        return "application/x-tar";
      case "gz":
        return "application/gzip";

      // Code file types
      case "js":
        return "application/javascript";
      case "ts":
        return "application/typescript";
      case "html":
        return "text/html";
      case "css":
        return "text/css";

      // Miscellaneous
      case "apk":
        return "application/vnd.android.package-archive";
      case "exe":
        return "application/x-msdownload";
      case "bin":
        return "application/octet-stream";

      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }
  }
};
