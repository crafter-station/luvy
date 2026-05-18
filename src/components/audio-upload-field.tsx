"use client";

import { UploadSimple } from "@phosphor-icons/react";

import { MAX_AUDIO_BYTES, MAX_AUDIO_SECONDS } from "@/lib/validations";

function toStoredDurationSeconds(seconds: number) {
  return Math.max(1, Math.floor(seconds));
}

export function AudioUploadField({
  onAudio,
  onError,
}: {
  onAudio: (file: File, durationSeconds: number) => void;
  onError: (message: string) => void;
}) {
  async function handleFile(file: File) {
    if (file.size > MAX_AUDIO_BYTES) {
      onError("Audio must be 15 MB or smaller.");
      return;
    }

    if (!file.type.startsWith("audio/")) {
      onError("Upload an audio file.");
      return;
    }

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const durationSeconds = toStoredDurationSeconds(audio.duration);

      if (durationSeconds > MAX_AUDIO_SECONDS) {
        onError("Keep messages under 2 minutes.");
        return;
      }

      onAudio(file, durationSeconds);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      onError("Could not read that audio file.");
    };
  }

  return (
    <label className="flex h-16 cursor-pointer items-center justify-start gap-3 font-bold text-sm transition-colors hover:text-luvy-purple">
      <span className="flex size-9 items-center justify-center rounded-full bg-luvy-peach text-luvy-coral">
        <UploadSimple className="size-4" weight="fill" />
      </span>
      Upload audio
      <input
        accept="audio/*"
        className="sr-only"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
        }}
      />
    </label>
  );
}
