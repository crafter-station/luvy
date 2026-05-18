import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { updateProfile } from "@/app/dashboard/actions";
import { AppHeader } from "@/components/app-header";
import { RunnerHandleForm } from "@/components/runner-handle-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ensureCurrentAppUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await ensureCurrentAppUser(userId);

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <section className="grid gap-4">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              // Clerk image hosts vary by environment, so use the raw URL here.
              // biome-ignore lint/performance/noImgElement: Clerk already serves an optimized avatar image.
              <img
                alt="Profile avatar"
                className="size-16 rounded-full border object-cover"
                src={user.imageUrl}
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-luvy-lavender font-bold text-luvy-purple text-xl">
                {(user.displayName || user.slug).slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                Profile
              </p>
              <h1 className="text-3xl font-bold tracking-[-0.03em]">
                {user.displayName || user.slug}
              </h1>
            </div>
          </div>
          <p className="break-all font-mono text-muted-foreground text-xs">
            /{user.slug}/your-race
          </p>
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Public identity
            </h2>
          </div>
          <RunnerHandleForm
            action={updateProfile}
            currentSlug={user.slug}
            displayName={user.displayName}
          />
        </section>

        <section className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Appearance</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-6">
              Switch between light and dark mode.
            </p>
          </div>
          <ThemeToggle />
        </section>
      </main>
    </>
  );
}
