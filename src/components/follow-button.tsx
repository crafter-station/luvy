"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useEffect, useState, useTransition } from "react";

import { toggleFollow } from "@/app/[runnerSlug]/[runSlug]/actions";
import { Button } from "@/components/ui/button";

export function FollowButton({
  ownerClerkUserId,
  returnPath,
  targetSlug,
}: {
  ownerClerkUserId: string | null;
  returnPath: string;
  targetSlug: string;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setIsFollowing(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/follows/${targetSlug}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!cancelled) {
          setIsFollowing(Boolean(body?.isFollowing));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsFollowing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, targetSlug]);

  if (!isLoaded) {
    return (
      <Button className="w-full" disabled type="button">
        Follow
      </Button>
    );
  }

  if (user?.id === ownerClerkUserId) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="redirect">
        <Button className="w-full" type="button">
          Follow
        </Button>
      </SignInButton>
    );
  }

  const nextIsFollowing = !isFollowing;

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          setIsFollowing(nextIsFollowing);
          await toggleFollow(formData);
        });
      }}
    >
      <input name="targetSlug" type="hidden" value={targetSlug} />
      <input name="returnPath" type="hidden" value={returnPath} />
      <input
        name="nextAction"
        type="hidden"
        value={isFollowing ? "unfollow" : "follow"}
      />
      <Button
        className="w-full"
        disabled={isPending}
        type="submit"
        variant={isFollowing ? "outline" : "default"}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </form>
  );
}
