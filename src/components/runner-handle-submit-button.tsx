"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function RunnerHandleSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-live="polite"
      className="w-fit"
      disabled={pending}
      type="submit"
      variant="outline"
    >
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}
