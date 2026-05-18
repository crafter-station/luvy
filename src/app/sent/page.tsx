import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { MessageActionsMenu } from "@/components/message-actions-menu";
import { MessageCard } from "@/components/message-card";
import { Button } from "@/components/ui/button";
import { isUnlocked } from "@/lib/dates";
import { getSentMessages } from "@/lib/messages";
import { ensureCurrentAppUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function SentPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await ensureCurrentAppUser(userId);
  const sentMessages = await getSentMessages(userId);

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <section className="grid gap-4">
          <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
            Sent
          </p>
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.04em]">
              Audio you sent with love.
            </h1>
            <p className="mt-3 text-muted-foreground text-sm leading-6">
              Your sent messages stay tied to your Luvy account.
            </p>
          </div>
        </section>

        {sentMessages.length === 0 ? (
          <section className="grid gap-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              No sent audio yet.
            </h2>
            <p className="text-muted-foreground text-sm leading-6">
              Open a race link from someone you love and record the first one.
            </p>
            <Link href="/">
              <Button variant="outline">Go home</Button>
            </Link>
          </section>
        ) : (
          <section className="grid gap-3">
            {sentMessages.map(({ message, owner, run }) => (
              <div className="grid gap-2" key={message.id}>
                <p className="px-1 font-bold text-muted-foreground text-xs">
                  To {owner.displayName || owner.slug} · {run.title}
                </p>
                <MessageCard
                  actions={
                    <MessageActionsMenu
                      messageId={message.id}
                      visibility={message.visibility}
                    />
                  }
                  canPlay={isUnlocked(run.raceStartsAt)}
                  lockedLabel="This race has not unlocked yet"
                  message={{ message, sender: user }}
                  showVisibility
                />
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
