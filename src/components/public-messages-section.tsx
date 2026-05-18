"use client";

import { useEffect, useMemo, useState } from "react";

import { AutoplaySwitch } from "@/components/autoplay-switch";
import { MessageActionsMenu } from "@/components/message-actions-menu";
import { MessageList } from "@/components/message-list";
import { SortSelect, type SortValue } from "@/components/sort-select";
import type { Message, User } from "@/db/schema";

type PublicMessage = { message: Message; sender: User };

function getCreatedAtTime(message: PublicMessage) {
  return new Date(message.message.createdAt).getTime();
}

function reviveMessageDates(item: PublicMessage): PublicMessage {
  return {
    message: {
      ...item.message,
      createdAt: new Date(item.message.createdAt),
      deletedAt: item.message.deletedAt
        ? new Date(item.message.deletedAt)
        : null,
    },
    sender: {
      ...item.sender,
      createdAt: new Date(item.sender.createdAt),
      updatedAt: new Date(item.sender.updatedAt),
    },
  };
}

function removeMessageById(messages: PublicMessage[], messageId: string) {
  return messages.filter((item) => item.message.id !== messageId);
}

function isPublicMessage(item: PublicMessage) {
  return item.message.visibility === "public";
}

export function PublicMessagesSection({
  canPlay,
  messages,
  runSlug,
  runnerSlug,
}: {
  canPlay: boolean;
  messages: PublicMessage[];
  runSlug: string;
  runnerSlug: string;
}) {
  const [publicMessages, setPublicMessages] = useState(messages);
  const [sort, setSort] = useState<SortValue>("desc");
  const [privateAwareMessages, setPrivateAwareMessages] = useState<
    PublicMessage[] | null
  >(null);
  const [playableMessageIds, setPlayableMessageIds] = useState<Set<string>>(
    () => new Set(),
  );
  const visibleMessages = privateAwareMessages ?? publicMessages;

  useEffect(() => {
    setPublicMessages(messages);
  }, [messages]);

  useEffect(() => {
    let ignore = false;

    async function loadOwnerMessages() {
      try {
        const response = await fetch(
          `/api/runs/${encodeURIComponent(runnerSlug)}/${encodeURIComponent(runSlug)}/owner-messages`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          canSeePrivateMessages: boolean;
          messages: PublicMessage[];
          playableMessageIds: string[];
        };

        if (!ignore && data.canSeePrivateMessages) {
          setPrivateAwareMessages(data.messages.map(reviveMessageDates));
          setPlayableMessageIds(new Set(data.playableMessageIds));
        }
      } catch {
        // Keep the static public list if the owner-only refresh fails.
      }
    }

    void loadOwnerMessages();

    return () => {
      ignore = true;
    };
  }, [runSlug, runnerSlug]);

  const sortedMessages = useMemo(
    () =>
      [...visibleMessages].sort((left, right) => {
        const diff = getCreatedAtTime(left) - getCreatedAtTime(right);

        return sort === "asc" ? diff : -diff;
      }),
    [visibleMessages, sort],
  );

  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Messages</h2>
          <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
            {visibleMessages.length}{" "}
            {visibleMessages.length === 1 ? "message" : "messages"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <SortSelect value={sort} onValueChange={setSort} />
          <AutoplaySwitch
            disabled={
              sortedMessages.filter(
                (item) =>
                  canPlay &&
                  (isPublicMessage(item) ||
                    playableMessageIds.has(item.message.id)),
              ).length < 2
            }
          />
        </div>
      </div>
      <MessageList
        canPlay={(item) => {
          const message = "message" in item ? item.message : item;

          return (
            canPlay &&
            (message.visibility === "public" ||
              playableMessageIds.has(message.id))
          );
        }}
        getActions={(item) => {
          const message = "message" in item ? item.message : item;

          return (
            <MessageActionsMenu
              messageId={message.id}
              onDeleted={(messageId) => {
                setPublicMessages((current) =>
                  removeMessageById(current, messageId),
                );
                setPrivateAwareMessages((current) =>
                  current ? removeMessageById(current, messageId) : null,
                );
              }}
              visibility={message.visibility}
            />
          );
        }}
        messages={sortedMessages}
        showVisibility={privateAwareMessages !== null}
      />
    </section>
  );
}
