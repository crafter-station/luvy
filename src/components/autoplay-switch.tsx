"use client";

import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";

type AudioEndedEvent = CustomEvent<{ autoplayId: string }>;
type AutoplayPlayEvent = CustomEvent<{ autoplayId: string }>;

export function AutoplaySwitch({ disabled = false }: { disabled?: boolean }) {
  const [enabled, setEnabled] = useState(true);
  const switchId = "autoplay-switch";

  useEffect(() => {
    if (!enabled || disabled) {
      return;
    }

    function playNext(event: Event) {
      const { autoplayId } = (event as AudioEndedEvent).detail;
      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          "[data-audio-autoplay-id]",
        ),
      );
      const currentIndex = buttons.findIndex(
        (button) => button.dataset.audioAutoplayId === autoplayId,
      );
      const nextButton = buttons[currentIndex + 1];

      if (!nextButton) {
        return;
      }

      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("luvy:audio-autoplay-play", {
            detail: { autoplayId: nextButton.dataset.audioAutoplayId ?? "" },
          }) satisfies AutoplayPlayEvent,
        );
      }, 150);
    }

    window.addEventListener("luvy:audio-ended", playNext);

    return () => {
      window.removeEventListener("luvy:audio-ended", playNext);
    };
  }, [disabled, enabled]);

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <label className="cursor-pointer font-bold text-xs" htmlFor={switchId}>
        Autoplay
      </label>
      <Switch
        checked={enabled}
        disabled={disabled}
        id={switchId}
        size="sm"
        onCheckedChange={setEnabled}
      />
    </div>
  );
}
