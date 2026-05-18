"use client";

import { Pause, Play } from "@phosphor-icons/react";
import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

const BAR_COUNT = 48;

const waveformCache = new Map<string, WaveBar[]>();
const waveformPromiseCache = new Map<string, Promise<WaveBar[]>>();

export type WaveBar = {
  id: string;
  height: number;
};

type AutoplayPlayEvent = CustomEvent<{ autoplayId: string }>;
type AudioPlayEvent = CustomEvent<{ audio: HTMLAudioElement }>;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createSeededWaveBars(
  seed: string,
  count = BAR_COUNT,
): WaveBar[] {
  let value = hashString(seed);

  return Array.from({ length: count }, (_, index) => {
    value = Math.imul(value ^ (value >>> 15), 2246822519);
    value = Math.imul(value ^ (value >>> 13), 3266489917);

    return {
      id: `${seed}-bar-${index + 1}`,
      height: 16 + ((value >>> 0) % 34),
    };
  });
}

export function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export async function loadAudioWaveBars(
  audioUrl: string,
  seed: string,
  count = BAR_COUNT,
) {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContextClass();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerBar = Math.max(1, Math.floor(channelData.length / count));

    return Array.from({ length: count }, (_, barIndex) => {
      const start = barIndex * samplesPerBar;
      const end = Math.min(start + samplesPerBar, channelData.length);
      let total = 0;

      for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
        total += Math.abs(channelData[sampleIndex] ?? 0);
      }

      const average = total / Math.max(1, end - start);

      return {
        id: `${seed}-bar-${barIndex + 1}`,
        height: 12 + Math.min(42, Math.round(average * 150)),
      };
    });
  } finally {
    void audioContext.close();
  }
}

function getWaveformCacheKey(
  audioUrl: string,
  seed: string,
  count = BAR_COUNT,
) {
  return `${audioUrl}|${seed}|${count}`;
}

function getCachedWaveBars(cacheKey: string) {
  return waveformCache.get(cacheKey);
}

function loadCachedAudioWaveBars(
  audioUrl: string,
  seed: string,
  count = BAR_COUNT,
) {
  const cacheKey = getWaveformCacheKey(audioUrl, seed, count);
  const cachedBars = waveformCache.get(cacheKey);

  if (cachedBars) {
    return Promise.resolve(cachedBars);
  }

  const cachedPromise = waveformPromiseCache.get(cacheKey);

  if (cachedPromise) {
    return cachedPromise;
  }

  const nextPromise = loadAudioWaveBars(audioUrl, seed, count)
    .then((bars) => {
      waveformCache.set(cacheKey, bars);
      waveformPromiseCache.delete(cacheKey);

      return bars;
    })
    .catch((error: unknown) => {
      waveformPromiseCache.delete(cacheKey);

      throw error;
    });

  waveformPromiseCache.set(cacheKey, nextPromise);

  return nextPromise;
}

export function AudioWavePlayer({
  audioUrl,
  durationSeconds,
  label,
  seed,
  autoplayId,
  useRealWaveform,
  onPlaybackError,
}: {
  audioUrl: string;
  durationSeconds: number;
  label: string;
  seed: string;
  autoplayId?: string;
  useRealWaveform: boolean;
  onPlaybackError?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef(false);
  const fallbackBars = useMemo(() => createSeededWaveBars(seed), [seed]);
  const waveformCacheKey = getWaveformCacheKey(audioUrl, seed);
  const [bars, setBars] = useState(
    () => getCachedWaveBars(waveformCacheKey) ?? fallbackBars,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = duration > 0 ? currentTime / duration : 0;
  const remainingTime = Math.max(0, duration - currentTime);

  useEffect(() => {
    setBars(getCachedWaveBars(waveformCacheKey) ?? fallbackBars);
  }, [fallbackBars, waveformCacheKey]);

  useEffect(() => {
    if (audioRef.current?.getAttribute("src") === audioUrl) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentTime(0);
    setDuration(durationSeconds);
    setIsPlaying(false);
  }, [audioUrl, durationSeconds]);

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
    if (!autoplayId) {
      return;
    }

    function playFromStart(event: Event) {
      const { autoplayId: requestedAutoplayId } = (event as AutoplayPlayEvent)
        .detail;

      if (requestedAutoplayId !== autoplayId || !audioRef.current) {
        return;
      }

      audioRef.current.currentTime = 0;
      setCurrentTime(0);

      audioRef.current.play().catch(() => {
        onPlaybackError?.();
      });
    }

    window.addEventListener("luvy:audio-autoplay-play", playFromStart);

    return () => {
      window.removeEventListener("luvy:audio-autoplay-play", playFromStart);
    };
  }, [autoplayId, onPlaybackError]);

  useEffect(() => {
    if (!useRealWaveform) {
      return;
    }

    let cancelled = false;

    loadCachedAudioWaveBars(audioUrl, seed)
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
  }, [audioUrl, fallbackBars, seed, useRealWaveform]);

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

  function seekBy(seconds: number) {
    const nextTime = Math.min(duration, Math.max(0, currentTime + seconds));

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }

    setCurrentTime(nextTime);
  }

  function startSeek(event: PointerEvent<HTMLButtonElement>) {
    isSeekingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekToPointer(event.clientX, event.currentTarget);
  }

  function moveSeek(event: PointerEvent<HTMLButtonElement>) {
    if (!isSeekingRef.current) {
      return;
    }

    seekToPointer(event.clientX, event.currentTarget);
  }

  function stopSeek(event: PointerEvent<HTMLButtonElement>) {
    isSeekingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleSeekKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      seekBy(-5);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      seekBy(5);
    }
  }

  async function togglePlayback() {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch {
        onPlaybackError?.();
      }
      return;
    }

    audioRef.current.pause();
  }

  return (
    <div className="flex w-full items-center gap-3">
      <Button
        aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
        className="size-10 shrink-0 rounded-full"
        data-audio-autoplay-id={autoplayId}
        size="icon"
        type="button"
        onClick={() => void togglePlayback()}
      >
        {isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}
      </Button>
      <button
        aria-label={`Seek ${label}`}
        aria-valuemax={Math.round(duration)}
        aria-valuemin={0}
        aria-valuenow={Math.round(currentTime)}
        className="flex h-14 min-w-0 flex-1 touch-none items-center gap-0.5 overflow-hidden rounded-xl"
        role="slider"
        type="button"
        onKeyDown={handleSeekKeyDown}
        onPointerCancel={stopSeek}
        onPointerDown={startSeek}
        onPointerMove={moveSeek}
        onPointerUp={stopSeek}
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
      <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
        {formatAudioTime(isPlaying ? remainingTime : duration)}
      </span>
      <audio
        preload="metadata"
        ref={audioRef}
        src={audioUrl}
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
          setIsPlaying(false);

          if (autoplayId) {
            window.dispatchEvent(
              new CustomEvent("luvy:audio-ended", {
                detail: { autoplayId },
              }),
            );
          }
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
    </div>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
