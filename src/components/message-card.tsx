import { LockKey } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { AudioWavePlayer } from "@/components/audio-wave-player";
import { WaveformLocked } from "@/components/waveform-locked";
import type { Message, User } from "@/db/schema";
import { formatShortDateTime } from "@/lib/dates";

export type MessageCardItem = Message | { message: Message; sender: User };

function unwrapMessage(item: MessageCardItem) {
  if ("message" in item) {
    return item;
  }

  return { message: item, sender: null };
}

export function MessageCard({
  message,
  canPlay,
  lockedLabel,
  actions,
  showVisibility = false,
}: {
  message: MessageCardItem;
  canPlay: boolean;
  lockedLabel?: string | null;
  actions?: ReactNode;
  showVisibility?: boolean;
}) {
  const { message: audioMessage, sender } = unwrapMessage(message);
  const name = sender?.displayName || "Luvy supporter";
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <article className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {sender?.imageUrl ? (
            // Clerk image hosts vary by environment, so use the raw URL here.
            // biome-ignore lint/performance/noImgElement: Clerk already serves an optimized avatar image.
            <img
              alt={`${name} avatar`}
              className="size-11 shrink-0 rounded-full border object-cover"
              src={sender.imageUrl}
            />
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-luvy-lavender font-bold text-luvy-purple text-sm">
              {initial}
            </div>
          )}
          <div className="flex min-w-0 flex-col text-left">
            <h3 className="truncate font-bold text-base">{name}</h3>
            <p className="text-muted-foreground text-xs">
              {formatShortDateTime(audioMessage.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          {showVisibility && audioMessage.visibility === "private" ? (
            <span className="text-muted-foreground" title="Private message">
              <span className="sr-only">Private message</span>
              <LockKey className="size-3.5" weight="fill" />
            </span>
          ) : null}
          {actions}
        </div>
      </div>
      {canPlay ? (
        <AudioWavePlayer
          audioUrl={`/api/messages/${audioMessage.id}/audio`}
          autoplayId={audioMessage.id}
          durationSeconds={audioMessage.durationSeconds}
          label={`${name}'s message`}
          seed={audioMessage.id}
          useRealWaveform={audioMessage.visibility === "public"}
        />
      ) : (
        <WaveformLocked label={lockedLabel ?? null} seed={audioMessage.id} />
      )}
    </article>
  );
}
