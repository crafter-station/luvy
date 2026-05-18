import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RunLinkForm({
  action,
  currentSlug,
  runId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  currentSlug: string;
  runId: string;
}) {
  return (
    <form action={action} className="grid gap-3">
      <input name="runId" type="hidden" value={runId} />
      <div className="grid gap-2">
        <label className="text-xs font-medium" htmlFor="runSlug">
          Race link slug
        </label>
        <Input
          id="runSlug"
          name="runSlug"
          required
          defaultValue={currentSlug}
          autoComplete="off"
        />
      </div>
      <p className="text-muted-foreground text-xs leading-5">
        Changing this slug changes this race page link. Old links will stop
        working, so reshare the new link after saving.
      </p>
      <Button className="w-fit" type="submit" variant="outline">
        Save race link
      </Button>
    </form>
  );
}
