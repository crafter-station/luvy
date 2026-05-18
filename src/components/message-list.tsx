import type { ReactNode } from "react";
import type { MessageCardItem } from "@/components/message-card";
import { MessageCard } from "@/components/message-card";

function messageKey(message: MessageCardItem) {
  return "message" in message ? message.message.id : message.id;
}

type CanPlayMessage = boolean | ((message: MessageCardItem) => boolean);

function canPlayMessage(canPlay: CanPlayMessage, message: MessageCardItem) {
  return typeof canPlay === "function" ? canPlay(message) : canPlay;
}

export function MessageList({
  messages,
  canPlay,
  lockedLabel,
  getActions,
  showVisibility = false,
}: {
  messages: MessageCardItem[];
  canPlay: CanPlayMessage;
  lockedLabel?: string | null;
  getActions?: (message: MessageCardItem) => ReactNode;
  showVisibility?: boolean;
}) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        <p className="font-bold text-foreground text-xl tracking-tight">
          No messages yet.
        </p>
        <p className="mt-2">Be the first voice in the final miles.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {messages.map((message) => (
        <MessageCard
          actions={getActions?.(message)}
          canPlay={canPlayMessage(canPlay, message)}
          key={messageKey(message)}
          lockedLabel={lockedLabel}
          message={message}
          showVisibility={showVisibility}
        />
      ))}
    </div>
  );
}
