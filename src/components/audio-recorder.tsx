"use client";

import { Microphone, Stop } from "@phosphor-icons/react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MAX_AUDIO_SECONDS } from "@/lib/validations";

function toStoredDurationSeconds(seconds: number) {
  return Math.max(1, Math.floor(seconds));
}

export function AudioRecorder({
  onAudio,
}: {
  onAudio: (file: File, durationSeconds: number) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);

  async function startRecording() {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser does not support in-browser recording.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    startedAtRef.current = Date.now();

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const durationSeconds = toStoredDurationSeconds(
        (Date.now() - startedAtRef.current) / 1000,
      );
      const type = recorder.mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      const file = new File([blob], `message-${Date.now()}.webm`, { type });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setIsRecording(false);

      if (durationSeconds > MAX_AUDIO_SECONDS) {
        setError("Keep messages under 2 minutes.");
        return;
      }

      onAudio(file, durationSeconds);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  return (
    <div className="grid gap-2">
      <Button
        className="h-16 justify-start rounded-xl px-5 text-left"
        type="button"
        variant={isRecording ? "destructive" : "outline"}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-luvy-lavender text-luvy-purple">
          {isRecording ? <Stop weight="fill" /> : <Microphone weight="fill" />}
        </span>
        {isRecording ? "Stop recording" : "Record a voice note"}
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
