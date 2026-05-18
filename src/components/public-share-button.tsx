"use client";

import { useUser } from "@clerk/nextjs";
import { ShareNetwork } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function PublicShareButton({
  path,
  raceTitle,
  runnerClerkUserId,
  runnerName,
}: {
  path: string;
  raceTitle: string;
  runnerClerkUserId: string | null;
  runnerName: string;
}) {
  const { user } = useUser();
  const isRunner = user?.id === runnerClerkUserId;

  async function sharePage() {
    const url = new URL(path, window.location.origin).toString();
    const title = isRunner
      ? `I'm running ${raceTitle}`
      : `${runnerName} is running ${raceTitle}`;
    const text = isRunner
      ? `Send me some love for ${raceTitle}: ${url}`
      : `Send ${runnerName} some love for ${raceTitle}: ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(text);
  }

  return (
    <Button
      aria-label="Share this race page"
      className="h-12 w-24 rounded-3xl px-3"
      onClick={() => void sharePage()}
      type="button"
      variant="outline"
    >
      <ShareNetwork className="size-5" weight="bold" />
    </Button>
  );
}
