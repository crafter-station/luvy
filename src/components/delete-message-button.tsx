import { Button } from "@/components/ui/button";

export function DeleteMessageButton({
  action,
  messageId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  messageId: string;
}) {
  return (
    <form action={action}>
      <input name="messageId" type="hidden" value={messageId} />
      <Button size="sm" type="submit" variant="destructive">
        Delete
      </Button>
    </form>
  );
}
