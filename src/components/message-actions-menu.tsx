"use client";

import { useUser } from "@clerk/nextjs";
import {
  DotsThreeVertical,
  Eye,
  EyeSlash,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  deleteMessage,
  updateMessageVisibility,
} from "@/app/[runnerSlug]/[runSlug]/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MessageVisibility } from "@/db/schema";
import { cn } from "@/lib/utils";

type MessagePermissions = {
  canDelete: boolean;
  canUpdateVisibility: boolean;
};

export function MessageActionsMenu({
  messageId,
  onDeleted,
  visibility,
}: {
  messageId: string;
  onDeleted?: (messageId: string) => void;
  visibility: MessageVisibility;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [permissions, setPermissions] = useState<MessagePermissions | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState(visibility);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLoading = !isLoaded || (isSignedIn && permissions === null);
  const canDelete = Boolean(permissions?.canDelete);
  const canUpdateVisibility = Boolean(permissions?.canUpdateVisibility);
  const nextVisibility = currentVisibility === "public" ? "private" : "public";
  const PrivacyIcon = currentVisibility === "public" ? EyeSlash : Eye;

  useEffect(() => {
    setCurrentVisibility(visibility);
  }, [visibility]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setPermissions({ canDelete: false, canUpdateVisibility: false });
      return;
    }

    let cancelled = false;

    setPermissions(null);
    fetch(`/api/messages/${messageId}/permissions`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!cancelled) {
          setPermissions({
            canDelete: Boolean(body?.canDelete),
            canUpdateVisibility: Boolean(body?.canUpdateVisibility),
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPermissions({ canDelete: false, canUpdateVisibility: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, messageId]);

  if (isDeleted || isLoading || !(canDelete || canUpdateVisibility)) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="Message actions"
              className="size-9 rounded-full"
              disabled={isPending}
              size="icon"
              type="button"
              variant="ghost"
            />
          }
        >
          <DotsThreeVertical className="size-5" weight="bold" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
          {canUpdateVisibility ? (
            <button
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs outline-hidden transition-colors hover:bg-muted focus:bg-muted"
              onClick={() => {
                setMenuOpen(false);
                setPrivacyOpen(true);
              }}
              type="button"
            >
              <PrivacyIcon className="size-4" />
              Change privacy
            </button>
          ) : null}
          {canDelete ? (
            <button
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-destructive text-xs outline-hidden transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
              onClick={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
              type="button"
            >
              <Trash className="size-4" />
              Delete
            </button>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canUpdateVisibility ? (
        <Drawer open={privacyOpen} onOpenChange={setPrivacyOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Change audio privacy</DrawerTitle>
              <DrawerDescription>
                This audio is currently {currentVisibility}. Switch it to{" "}
                {nextVisibility} to control who can see and play it from the
                race page.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <form
                action={(formData) => {
                  startTransition(async () => {
                    await updateMessageVisibility(formData);
                    setCurrentVisibility(nextVisibility);
                    setPrivacyOpen(false);
                  });
                }}
                className="grid gap-2"
              >
                <input name="messageId" type="hidden" value={messageId} />
                <input name="visibility" type="hidden" value={nextVisibility} />
                <Button className="w-full" disabled={isPending} type="submit">
                  Make {nextVisibility}
                </Button>
              </form>
              <DrawerClose
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                disabled={isPending}
                type="button"
              >
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}

      {canDelete ? (
        <Drawer open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Delete this audio?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone. The audio will be removed from
                this race page and from your sent audio.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <form
                action={(formData) => {
                  startTransition(async () => {
                    await deleteMessage(formData);
                    onDeleted?.(messageId);
                    setIsDeleted(true);
                    setDeleteOpen(false);
                    router.refresh();
                  });
                }}
                className="grid gap-2"
              >
                <input name="messageId" type="hidden" value={messageId} />
                <Button
                  className="w-full"
                  disabled={isPending}
                  type="submit"
                  variant="destructive"
                >
                  Delete audio
                </Button>
              </form>
              <DrawerClose
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                disabled={isPending}
                type="button"
              >
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
}
