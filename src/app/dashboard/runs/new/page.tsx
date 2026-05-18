import Link from "next/link";
import { createRun } from "@/app/dashboard/runs/new/actions";
import { AppHeader } from "@/components/app-header";
import { RunCreateForm } from "@/components/run-create-form";
import { Button } from "@/components/ui/button";
import { getSupportedTimezones } from "@/lib/timezones";

export const dynamic = "force-dynamic";

export default function NewRunPage() {
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const supportedTimezones = getSupportedTimezones();
  const timezones = supportedTimezones.includes(defaultTimezone)
    ? supportedTimezones
    : [defaultTimezone, ...supportedTimezones];

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
              New race
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em]">
              Create your love link
            </h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
        <section>
          <RunCreateForm
            action={createRun}
            defaultTimezone={defaultTimezone}
            timezones={timezones}
          />
        </section>
      </main>
    </>
  );
}
