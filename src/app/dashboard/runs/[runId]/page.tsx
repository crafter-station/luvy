import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { updateRunDetails } from "@/app/dashboard/runs/[runId]/actions";
import { AppHeader } from "@/components/app-header";
import { LuvyMascot } from "@/components/luvy-mascot";
import { RunDetailsForm } from "@/components/run-details-form";
import { Button } from "@/components/ui/button";
import { formatRaceTime, zonedDateTimeFields } from "@/lib/dates";
import { getOwnedRun } from "@/lib/runs";
import { getSupportedTimezones } from "@/lib/timezones";

export const dynamic = "force-dynamic";

export default async function RunnerRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { runId } = await params;
  const ownedRun = await getOwnedRun(runId, userId);

  if (!ownedRun) {
    notFound();
  }

  const sharePath = `/${ownedRun.user.slug}/${ownedRun.run.slug}`;
  const raceFields = zonedDateTimeFields(
    ownedRun.run.raceStartsAt,
    ownedRun.run.raceTimezone,
  );
  const supportedTimezones = getSupportedTimezones();
  const timezones = supportedTimezones.includes(ownedRun.run.raceTimezone)
    ? supportedTimezones
    : [ownedRun.run.raceTimezone, ...supportedTimezones];

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <section className="grid gap-6">
          <div className="grid gap-4">
            <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
              Manage race
            </p>
            <h1 className="text-4xl font-bold tracking-[-0.03em]">
              {ownedRun.run.title}
            </h1>
            <p className="text-muted-foreground text-base leading-7">
              Race starts{" "}
              {formatRaceTime(
                ownedRun.run.raceStartsAt,
                ownedRun.run.raceTimezone,
              )}
              {ownedRun.run.location ? ` in ${ownedRun.run.location}` : ""}.
            </p>
            <div className="grid gap-3 text-sm">
              <p className="break-all font-mono">{sharePath}</p>
              <Link href={sharePath}>
                <Button className="w-full" variant="outline">
                  Open public page
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <LuvyMascot className="h-52" pose="hi" />
          </div>
        </section>

        <section className="grid gap-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Race details</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-6">
              Update the page slug, race name, date, time, timezone, and
              location. Audio playback and message moderation live on the public
              page.
            </p>
            <p className="mt-3 break-all font-mono text-muted-foreground text-xs">
              {sharePath}
            </p>
          </div>
          <RunDetailsForm
            action={updateRunDetails}
            defaultValues={{
              title: ownedRun.run.title,
              runSlug: ownedRun.run.slug,
              raceDate: raceFields.date,
              raceTime: raceFields.time,
              raceTimezone: ownedRun.run.raceTimezone,
              location: ownedRun.run.location ?? "",
            }}
            runId={ownedRun.run.id}
            timezones={timezones}
          />
        </section>
      </main>
    </>
  );
}
