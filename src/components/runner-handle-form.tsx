import { RunnerHandleSubmitButton } from "@/components/runner-handle-submit-button";
import { Input } from "@/components/ui/input";

export function RunnerHandleForm({
  action,
  currentSlug,
  displayName,
}: {
  action: (formData: FormData) => void | Promise<void>;
  currentSlug: string;
  displayName?: string | null;
}) {
  return (
    <form action={action} className="grid gap-3">
      <div className="grid gap-2">
        <label className="text-xs font-medium" htmlFor="displayName">
          Display name
        </label>
        <Input
          id="displayName"
          name="displayName"
          required
          defaultValue={displayName ?? ""}
          autoComplete="name"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-medium" htmlFor="userSlug">
          Public handle
        </label>
        <Input
          id="userSlug"
          name="userSlug"
          required
          defaultValue={currentSlug}
          autoComplete="off"
        />
      </div>
      <p className="text-muted-foreground text-xs leading-5">
        Changing your handle changes every race link. Old links will stop
        working, so reshare your race pages after saving.
      </p>
      <RunnerHandleSubmitButton />
    </form>
  );
}
