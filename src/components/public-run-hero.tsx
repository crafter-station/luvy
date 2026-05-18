import Image from "next/image";
import type { ReactNode } from "react";

import { RabbitEarsLogo } from "@/components/rabbit-ears-logo";

export function PublicRunHero({
  raceTitle,
  runnerImageUrl,
  runnerName,
  followButton,
}: {
  raceTitle: string;
  runnerImageUrl: string | null;
  runnerName: string;
  followButton?: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="grid text-center">
        <div className="mx-auto grid justify-items-center gap-1.5">
          {runnerImageUrl ? (
            <Image
              alt={runnerName}
              className="size-20 rounded-full object-cover"
              height={80}
              src={runnerImageUrl}
              unoptimized
              width={80}
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-luvy-peach text-luvy-coral">
              <RabbitEarsLogo className="size-12" />
            </div>
          )}
          <h1 className="mt-2 font-bold text-2xl tracking-[-0.03em]">
            {runnerName}
          </h1>
          <p className="text-muted-foreground text-sm">is running</p>
          <p className="max-w-xs text-balance font-bold text-xl tracking-[-0.03em]">
            {raceTitle}
          </p>
          <p className="text-muted-foreground text-sm">Send some love</p>
          {followButton ? (
            <div className="mt-1 w-36">{followButton}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
