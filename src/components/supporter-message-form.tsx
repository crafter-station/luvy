"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  CheckCircle,
  Microphone,
  Stop,
  Trash,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState, useTransition } from "react";

import { AudioWavePlayer } from "@/components/audio-wave-player";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MAX_AUDIO_BYTES, MAX_AUDIO_SECONDS } from "@/lib/validations";

type FlowStep = "intro" | "record" | "review" | "visibility" | "success";

const INITIAL_LEVELS = Array.from({ length: 28 }, () => 8);

function toStoredDurationSeconds(seconds: number) {
  return Math.max(1, Math.floor(seconds));
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function SupporterMessageForm({
  userSlug,
  runSlug,
  audioUnlockLabel,
  shareButton,
}: {
  userSlug: string;
  runSlug: string;
  audioUnlockLabel?: string;
  shareButton?: ReactNode;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [step, setStep] = useState<FlowStep>("intro");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [levels, setLevels] = useState(INITIAL_LEVELS);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // The refs inside cleanupRecording are stable; this effect should only clean up
  // resources for the current component lifetime and preview URL.
  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup refs are intentionally read at teardown time.
  useEffect(() => {
    return () => {
      cleanupRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  function cleanupRecording() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;

    void audioContextRef.current?.close();
    audioContextRef.current = null;
  }

  function resetRecording() {
    cleanupRecording();
    recorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setElapsedSeconds(0);
    setLevels(INITIAL_LEVELS);
  }

  function resetAudio() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudio(null);
    setAudioUrl(null);
    setDurationSeconds(0);
    resetRecording();
  }

  function startAnalyser(stream: MediaStream) {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);
    audioContextRef.current = context;

    const values = new Uint8Array(analyser.frequencyBinCount);

    function tick() {
      analyser.getByteFrequencyData(values);
      const nextLevels = Array.from({ length: 28 }, (_, index) => {
        const value = values[index % values.length] ?? 0;
        return Math.max(8, Math.round((value / 255) * 56));
      });

      setLevels(nextLevels);
      animationRef.current = requestAnimationFrame(tick);
    }

    tick();
  }

  async function startRecording() {
    setError(null);
    resetAudio();
    setStep("record");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser does not support in-browser recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : undefined;
      const recorder = new MediaRecorder(
        stream,
        type ? { mimeType: type } : {},
      );

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const nextDuration = toStoredDurationSeconds(
          (Date.now() - startedAtRef.current) / 1000,
        );
        const contentType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: contentType });
        const file = new File([blob], `message-${Date.now()}.webm`, {
          type: contentType,
        });

        cleanupRecording();
        setIsRecording(false);

        if (nextDuration > MAX_AUDIO_SECONDS) {
          setError("Keep messages under 2 minutes.");
          setStep("record");
          return;
        }

        if (file.size > MAX_AUDIO_BYTES) {
          setError("Audio must be 15 MB or smaller.");
          setStep("record");
          return;
        }

        const url = URL.createObjectURL(file);
        setAudio(file);
        setAudioUrl(url);
        setDurationSeconds(nextDuration);
        setStep("review");
      };

      startAnalyser(stream);
      recorder.start();
      setIsRecording(true);
      setElapsedSeconds(0);

      intervalRef.current = window.setInterval(() => {
        const nextElapsedMs = Date.now() - startedAtRef.current;
        const nextElapsed = Math.floor(nextElapsedMs / 1000);
        setElapsedSeconds(nextElapsed);

        if (
          nextElapsedMs >= MAX_AUDIO_SECONDS * 1000 &&
          recorder.state !== "inactive"
        ) {
          recorder.stop();
        }
      }, 250);
    } catch {
      cleanupRecording();
      setStep("intro");
      setError("Could not access your microphone. Check browser permissions.");
    }
  }

  function stopRecording() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      setIsRecording(false);
      recorder.stop();
    }
  }

  async function submit() {
    setError(null);

    if (!audio) {
      setError("Record audio before sending.");
      return;
    }

    const formData = new FormData();
    formData.set("userSlug", userSlug);
    formData.set("runSlug", runSlug);
    formData.set("visibility", visibility);
    formData.set("durationSeconds", String(durationSeconds));
    formData.set("audio", audio);

    const response = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save your message.");
      return;
    }

    resetAudio();
    setVisibility("public");
    router.refresh();
    startTransition(() => setStep("success"));
  }

  function withShareButton(action: ReactNode) {
    if (!shareButton) {
      return action;
    }

    return (
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        {action}
        {shareButton}
      </div>
    );
  }

  const bottomAction = (() => {
    if (!isLoaded) {
      return withShareButton(
        <Button className="w-full" disabled size="lg" type="button">
          <Microphone weight="fill" />
          Start recording
        </Button>,
      );
    }

    if (!isSignedIn) {
      return withShareButton(
        <SignInButton mode="redirect">
          <Button className="w-full" size="lg" type="button">
            <Microphone weight="fill" />
            Start recording
          </Button>
        </SignInButton>,
      );
    }

    if (step === "intro") {
      return withShareButton(
        <Button
          className="w-full"
          size="lg"
          type="button"
          onClick={() => void startRecording()}
        >
          <Microphone weight="fill" />
          Start recording
        </Button>,
      );
    }

    if (step === "review") {
      return (
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={() => {
              resetAudio();
              void startRecording();
            }}
          >
            <Trash />
            Retry
          </Button>
          <Button
            className="w-full"
            type="button"
            onClick={() => setStep("visibility")}
          >
            Continue
          </Button>
        </div>
      );
    }

    if (step === "visibility") {
      return (
        <Button
          className="w-full"
          disabled={isPending}
          size="lg"
          type="button"
          onClick={() => void submit()}
        >
          {isPending ? "Sending..." : "Send with love"}
        </Button>
      );
    }

    if (step === "success") {
      return (
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={() => setStep("intro")}
        >
          Send another
        </Button>
      );
    }

    return null;
  })();

  function BottomAction() {
    if (!bottomAction) {
      return null;
    }

    return (
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 bg-gradient-to-t from-background via-background to-background/0 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-8">
        {bottomAction}
        {step === "intro" && audioUnlockLabel ? (
          <p className="mt-3 text-center text-muted-foreground text-xs">
            {audioUnlockLabel}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {isSignedIn && error && step === "intro" ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : null}

      {step !== "intro" ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-background px-4 pb-32 pt-6">
          <section className="mx-auto grid min-h-[calc(100svh-10rem)] w-full max-w-md content-center gap-5">
            {step === "record" ? (
              <div className="grid gap-8 text-center">
                <div>
                  <p className="font-bold text-luvy-coral text-xs uppercase tracking-[0.18em]">
                    Recording
                  </p>
                  <p className="mt-3 font-bold text-7xl tabular-nums tracking-[-0.06em] text-luvy-purple">
                    {formatDuration(elapsedSeconds)}
                  </p>
                </div>
                <div className="flex h-36 items-center justify-center gap-1 rounded-[2rem] bg-luvy-lavender px-5 shadow-inner">
                  {levels.map((height, index) => (
                    <span
                      className="w-1.5 rounded-full bg-luvy-purple odd:bg-luvy-blue"
                      key={`${index}-${height}`}
                      style={{ height }}
                    />
                  ))}
                </div>
                <div className="mx-auto flex size-28 items-center justify-center rounded-[2rem] bg-luvy-coral text-white shadow-[0_18px_44px_rgb(255_120_107_/_35%)]">
                  <Microphone className="size-14" weight="fill" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Say only what matters. Stop when your message feels complete.
                </p>
                <Button
                  className="mx-auto w-full max-w-xs bg-luvy-coral text-white hover:bg-luvy-coral/90"
                  size="lg"
                  type="button"
                  onClick={stopRecording}
                >
                  <Stop weight="fill" />
                  {isRecording ? "Stop recording" : "Stopping..."}
                </Button>
              </div>
            ) : null}

            {step === "review" ? (
              <div className="grid gap-5 text-center">
                <div>
                  <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                    Review
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Listen before sending.
                  </h2>
                </div>
                <div>
                  {audioUrl ? (
                    <AudioWavePlayer
                      audioUrl={audioUrl}
                      durationSeconds={durationSeconds}
                      label="recorded message preview"
                      seed={audio?.name ?? audioUrl}
                      useRealWaveform
                      onPlaybackError={() =>
                        setError("Could not play that preview.")
                      }
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === "visibility" ? (
              <div className="grid gap-5">
                <button
                  className="flex w-fit items-center gap-2 text-muted-foreground text-sm"
                  type="button"
                  onClick={() => setStep("review")}
                >
                  <ArrowLeft />
                  Back to review
                </button>
                <div>
                  <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                    Privacy
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">
                    Who can hear it after unlock?
                  </h2>
                </div>
                <RadioGroup
                  className="grid gap-3"
                  value={visibility}
                  onValueChange={setVisibility}
                >
                  <label
                    className="flex items-start gap-3 rounded-2xl border border-transparent p-3 text-sm transition-colors has-[[data-checked]]:border-luvy-purple has-[[data-checked]]:bg-luvy-lavender"
                    htmlFor="visibility-public"
                  >
                    <RadioGroupItem id="visibility-public" value="public" />
                    <span>
                      <span className="block font-bold">Public</span>
                      <span className="text-muted-foreground text-xs">
                        Other signed-in visitors can play it after race time.
                      </span>
                    </span>
                  </label>
                  <label
                    className="flex items-start gap-3 rounded-2xl border border-transparent p-3 text-sm transition-colors has-[[data-checked]]:border-luvy-purple has-[[data-checked]]:bg-luvy-lavender"
                    htmlFor="visibility-private"
                  >
                    <RadioGroupItem id="visibility-private" value="private" />
                    <span>
                      <span className="block font-bold">Private</span>
                      <span className="text-muted-foreground text-xs">
                        Only the race owner can play it after race time.
                      </span>
                    </span>
                  </label>
                </RadioGroup>
              </div>
            ) : null}

            {step === "success" ? (
              <div className="grid justify-items-center gap-4 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-luvy-lavender text-luvy-purple">
                  <CheckCircle className="size-9" weight="fill" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Message saved.
                  </h2>
                  <p className="mt-2 text-muted-foreground text-sm leading-6">
                    Luvy will keep it safe until race day.
                  </p>
                </div>
              </div>
            ) : null}

            {error ? <p className="text-destructive text-sm">{error}</p> : null}
          </section>
        </div>
      ) : null}
      <BottomAction />
    </>
  );
}
