import { put } from "@vercel/blob";

const EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

export function audioExtension(contentType: string) {
  const normalizedType = contentType.split(";")[0]?.trim().toLowerCase() ?? "";

  return EXTENSIONS[normalizedType] ?? "webm";
}

export async function uploadAudioBlob({
  file,
  pathname,
}: {
  file: File;
  pathname: string;
}) {
  return put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });
}
