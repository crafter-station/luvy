import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { LuvyMascot } from "@/components/luvy-mascot";
import { Button } from "@/components/ui/button";
import { formatRaceTime } from "@/lib/dates";
import { getRunnerRuns } from "@/lib/runs";
import { ensureCurrentAppUser } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await ensureCurrentAppUser(userId);
  const { user, runs } = await getRunnerRuns(userId);

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <section className="grid gap-6">
          <div>
            <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
              Your races
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">
              Your race-day love hub
            </h1>
            <p className="mt-3 text-muted-foreground text-base leading-7">
              Create a link, collect voice notes, and unlock the playlist when
              the race starts.
            </p>
          </div>
          <Link href="/dashboard/runs/new">
            <Button className="w-full" size="lg">
              New race
            </Button>
          </Link>
        </section>

        {runs.length === 0 ? (
          <section className="grid justify-items-center gap-4 text-center">
            <LuvyMascot className="h-44" pose="sitting" />
            <h2 className="text-2xl font-bold tracking-tight">
              No race pages yet.
            </h2>
            <p className="max-w-md text-muted-foreground text-sm leading-6">
              Start with one upcoming race and share it with your people.
            </p>
            <Link href="/dashboard/runs/new">
              <Button>Create your first page</Button>
            </Link>
          </section>
        ) : (
          <section className="grid gap-3">
            {runs.map((run) => {
              const sharePath = `/${user?.slug}/${run.slug}`;

              return (
                <article
                  className="grid gap-4 py-2 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={run.id}
                >
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {run.title}
                    </h2>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {formatRaceTime(run.raceStartsAt, run.raceTimezone)}
                    </p>
                    <p className="mt-3 break-all rounded-2xl bg-muted px-3 py-2 font-mono text-xs">
                      {sharePath}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={sharePath}>
                      <Button className="w-full" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/runs/${run.id}`}>
                      <Button className="w-full">Manage</Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
