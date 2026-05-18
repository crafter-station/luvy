"use client";

import { Pause, Play, SkipForward } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  createSeededWaveBars,
  formatAudioTime,
  loadAudioWaveBars,
  type WaveBar,
} from "@/components/audio-wave-player";
import { Button } from "@/components/ui/button";

type PlaylistMessage = {
  id: string;
  name: string;
  durationSeconds: number;
  visibility: "public" | "private";
};

type AudioPlayEvent = CustomEvent<{ audio: HTMLAudioElement }>;

export function RunnerPlaylist({ messages }: { messages: PlaylistMessage[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentMessage = messages[currentIndex];
  const audioUrl = currentMessage
    ? `/api/messages/${currentMessage.id}/audio`
    : "";
  const fallbackBars = useMemo(
    () => createSeededWaveBars(currentMessage?.id ?? "playlist"),
    [currentMessage?.id],
  );
  const [bars, setBars] = useState<WaveBar[]>(fallbackBars);
  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    if (!audioRef.current || !currentMessage) {
      return;
    }

    audioRef.current.src = audioUrl;
    setCurrentTime(0);
    setDuration(currentMessage.durationSeconds);

    if (isPlaying) {
      void audioRef.current.play();
    }
  }, [audioUrl, currentMessage, isPlaying]);

  useEffect(() => {
    setBars(fallbackBars);
  }, [fallbackBars]);

  useEffect(() => {
    function pauseWhenAnotherAudioPlays(event: Event) {
      const { audio } = (event as AudioPlayEvent).detail;

      if (audio !== audioRef.current) {
        audioRef.current?.pause();
      }
    }

    window.addEventListener("luvy:audio-play", pauseWhenAnotherAudioPlays);

    return () => {
      window.removeEventListener("luvy:audio-play", pauseWhenAnotherAudioPlays);
    };
  }, []);

  useEffect(() => {
    if (!currentMessage || currentMessage.visibility !== "public") {
      return;
    }

    let cancelled = false;

    loadAudioWaveBars(audioUrl, currentMessage.id)
      .then((realBars) => {
        if (!cancelled) {
          setBars(realBars);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBars(fallbackBars);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [audioUrl, currentMessage, fallbackBars]);

  if (messages.length === 0) {
    return null;
  }

  function playIndex(index: number) {
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  function pause() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function playAll() {
    playIndex(0);
  }

  function playNext() {
    if (currentIndex + 1 >= messages.length) {
      setIsPlaying(false);
      return;
    }

    playIndex(currentIndex + 1);
  }

  function seekToPointer(clientX: number, target: HTMLButtonElement) {
    const bounds = target.getBoundingClientRect();
    const nextProgress = Math.min(
      1,
      Math.max(0, (clientX - bounds.left) / bounds.width),
    );
    const nextTime = nextProgress * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }

    setCurrentTime(nextTime);
  }

  return (
    <section className="grid gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Race-day playlist
          </h2>
          <p className="mt-1 text-muted-foreground text-sm leading-6">
            Play every unlocked message in the current sort order. Treat each
            one like a tiny gift for the hard miles.
          </p>
        </div>
        <Button type="button" onClick={playAll}>
          <Play />
          Play all
        </Button>
      </div>
      <div className="grid gap-2">
        {messages.map((message, index) => (
          <button
            className="flex items-center justify-between gap-3 py-2 text-left text-sm transition-colors hover:text-luvy-purple"
            key={message.id}
            type="button"
            onClick={() => playIndex(index)}
          >
            <span>
              <span className="block font-medium">{message.name}</span>
              <span className="text-muted-foreground text-xs">
                {message.visibility} · {message.durationSeconds}s
              </span>
            </span>
            <Play className="size-4 text-luvy-blue" weight="fill" />
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        <p className="font-bold text-sm">
          Now playing: {currentMessage?.name ?? "Nothing yet"}
        </p>
        <button
          aria-label="Seek race-day playlist"
          className="flex h-16 w-full items-center gap-0.5 overflow-hidden rounded-xl border bg-muted/40 px-4"
          type="button"
          onClick={(event) => seekToPointer(event.clientX, event.currentTarget)}
        >
          {bars.map((bar, index) => {
            const isPlayed = index / bars.length <= progress;

            return (
              <span
                className={
                  isPlayed
                    ? "flex-1 rounded-full bg-luvy-purple"
                    : "flex-1 rounded-full bg-luvy-blue/35"
                }
                key={bar.id}
                style={{ height: `${bar.height}px` }}
              />
            );
          })}
        </button>
        <div className="flex items-center justify-between text-muted-foreground text-xs tabular-nums">
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(duration)}</span>
        </div>
        <audio
          ref={audioRef}
          onDurationChange={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) {
              setDuration(event.currentTarget.duration);
            }
          }}
          onEnded={(event) => {
            const endedDuration = Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : duration;

            setCurrentTime(endedDuration);
            playNext();
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={(event) => {
            window.dispatchEvent(
              new CustomEvent("luvy:audio-play", {
                detail: { audio: event.currentTarget },
              }) satisfies AudioPlayEvent,
            );
            setIsPlaying(true);
          }}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
        >
          <track kind="captions" src="data:text/vtt,WEBVTT" />
        </audio>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={isPlaying ? pause : () => playIndex(currentIndex)}
          >
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button type="button" variant="outline" onClick={playNext}>
            <SkipForward />
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
