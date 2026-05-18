import { LockKey } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

const BAR_COUNT = 48;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function lockedBars(seed: string) {
  let value = hashString(seed);

  return Array.from({ length: BAR_COUNT }, (_, index) => {
    value = Math.imul(value ^ (value >>> 15), 2246822519);
    value = Math.imul(value ^ (value >>> 13), 3266489917);

    return {
      id: `locked-bar-${index + 1}`,
      height: 12 + ((value >>> 0) % 34),
    };
  });
}

export function WaveformLocked({
  label = "Locked until race time",
  seed = "locked",
  actions,
}: {
  label?: string | null;
  seed?: string;
  actions?: ReactNode;
}) {
  const bars = lockedBars(seed);

  return (
    <div className="grid w-full gap-3">
      <div className="flex h-14 w-full items-center gap-3 rounded-xl border bg-muted/50 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
          {bars.map((bar) => (
            <span
              className="flex-1 rounded-full bg-luvy-purple/40 odd:bg-luvy-blue/45"
              key={bar.id}
              style={{ height: `${bar.height}px` }}
            />
          ))}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {label ? (
        <p className="flex items-center gap-1.5 text-muted-foreground text-xs leading-5">
          <LockKey className="size-3.5 text-luvy-coral" weight="fill" />
          {label}
        </p>
      ) : null}
    </div>
  );
}
