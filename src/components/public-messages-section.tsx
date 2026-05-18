"use client";

import { useMemo, useState } from "react";

import { AutoplaySwitch } from "@/components/autoplay-switch";
import { MessageActionsMenu } from "@/components/message-actions-menu";
import { MessageList } from "@/components/message-list";
import { SortSelect, type SortValue } from "@/components/sort-select";
import type { Message, User } from "@/db/schema";

type PublicMessage = { message: Message; sender: User };

function getCreatedAtTime(message: PublicMessage) {
  return new Date(message.message.createdAt).getTime();
}

export function PublicMessagesSection({
  canPlay,
  messages,
}: {
  canPlay: boolean;
  messages: PublicMessage[];
}) {
  const [sort, setSort] = useState<SortValue>("desc");
  const sortedMessages = useMemo(
    () =>
      [...messages].sort((left, right) => {
        const diff = getCreatedAtTime(left) - getCreatedAtTime(right);

        return sort === "asc" ? diff : -diff;
      }),
    [messages, sort],
  );

  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Messages</h2>
          <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <SortSelect value={sort} onValueChange={setSort} />
          <AutoplaySwitch disabled={!canPlay || sortedMessages.length < 2} />
        </div>
      </div>
      <MessageList
        canPlay={canPlay}
        getActions={(item) => {
          const message = "message" in item ? item.message : item;

          return (
            <MessageActionsMenu
              messageId={message.id}
              visibility={message.visibility}
            />
          );
        }}
        messages={sortedMessages}
      />
    </section>
  );
}
