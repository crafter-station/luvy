import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CalendarHeart,
  CheckCircle,
  Heart,
  LockSimple,
  Microphone,
  PlayCircle,
  ShareNetwork,
  Sparkle,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { LuvyMascot } from "@/components/luvy-mascot";
import { Button } from "@/components/ui/button";
import { formatRaceTime } from "@/lib/dates";
import { getHomeFeed } from "@/lib/runs";
import { ensureCurrentAppUser } from "@/lib/users";

function RaceFeedCard({
  eyebrow,
  href,
  ownerName,
  raceStartsAt,
  raceTimezone,
  title,
}: {
  eyebrow: string;
  href: string;
  ownerName: string;
  raceStartsAt: Date;
  raceTimezone: string;
  title: string;
}) {
  return (
    <article className="grid gap-4 py-2">
      <div>
        <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          {ownerName} · {formatRaceTime(raceStartsAt, raceTimezone)}
        </p>
      </div>
      <Link href={href}>
        <Button className="w-full">Open race</Button>
      </Link>
    </article>
  );
}

function LandingHeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -left-6 top-14 h-32 w-32 rounded-full bg-luvy-blue/25 blur-3xl" />
      <div className="absolute -right-4 bottom-8 h-40 w-40 rounded-full bg-luvy-coral/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border bg-linear-to-br from-white via-luvy-panel to-luvy-lavender/70 p-4 shadow-[0_30px_80px_rgb(91_53_200_/_18%)] dark:from-card dark:via-card dark:to-luvy-lavender">
        <div className="rounded-[1.5rem] bg-background/80 p-4 shadow-inner">
          <div className="flex items-center justify-between gap-3 rounded-3xl bg-luvy-purple px-4 py-3 text-primary-foreground shadow-lg">
            <div>
              <p className="font-bold text-xs uppercase tracking-[0.18em] opacity-80">
                Mile 21 unlock
              </p>
              <p className="mt-1 font-bold text-lg">Mom sent you love</p>
            </div>
            <PlayCircle className="size-10" weight="fill" />
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
            <div className="grid gap-3">
              {[
                ["wave-coral-tall", "h-14", "bg-luvy-coral"],
                ["wave-purple-short", "h-8", "bg-luvy-purple"],
                ["wave-blue-peak", "h-20", "bg-luvy-blue"],
                ["wave-coral-mid", "h-12", "bg-luvy-coral"],
                ["wave-purple-mid", "h-16", "bg-luvy-purple"],
                ["wave-blue-short", "h-10", "bg-luvy-blue"],
              ].map(([id, height, color]) => (
                <div className="flex items-center gap-2" key={id}>
                  <span className="h-2 w-2 rounded-full bg-foreground/25" />
                  <span
                    className={`${height} w-full rounded-full ${color} opacity-80`}
                  />
                </div>
              ))}
            </div>
            <LuvyMascot className="h-60 w-44 sm:h-72 sm:w-52" pose="hi" />
          </div>
          <div className="mt-5 grid gap-3 rounded-3xl border bg-card p-4 sm:grid-cols-3">
            {[
              [CalendarHeart, "Race page"],
              [Microphone, "Voice notes"],
              [LockSimple, "Timed unlocks"],
            ].map(([Icon, label]) => (
              <div className="flex items-center gap-2" key={label as string}>
                <Icon className="size-5 text-luvy-purple" weight="fill" />
                <span className="font-bold text-sm">{label as string}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <>
      <AppHeader showBottomNav={false} wide />
      <main className="overflow-hidden">
        <section className="relative px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-b from-luvy-lavender/70 to-transparent" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <p className="flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-2 font-bold text-luvy-purple text-xs uppercase tracking-[0.18em] shadow-sm">
                <Heart className="size-4" weight="fill" />
                Voice notes for race day
              </p>
              <h1 className="mt-6 text-balance font-bold text-5xl tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                Love that shows up at the hard mile.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-8 sm:text-xl">
                Create a race page, invite your people to record audio, and let
                Luvy unlock their voices when the run gets tough.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SignUpButton mode="redirect">
                  <Button size="lg">
                    Create your race page
                    <ArrowRight />
                  </Button>
                </SignUpButton>
                <SignInButton mode="redirect">
                  <Button size="lg" variant="outline">
                    Sign in
                  </Button>
                </SignInButton>
              </div>
              <div className="mt-8 grid gap-3 text-muted-foreground text-sm sm:grid-cols-3">
                {[
                  "No app download for supporters",
                  "Private audio until unlock",
                  "Built for real race-day emotion",
                ].map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <CheckCircle
                      className="size-5 text-luvy-coral"
                      weight="fill"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <LandingHeroArt />
          </div>
        </section>

        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              [
                ShareNetwork,
                "Share one warm link",
                "Send friends and family to a race page that explains what to record and when it unlocks.",
              ],
              [
                Waveform,
                "Collect real voices",
                "Supporters can leave quick encouragement, stories, prayers, jokes, or full pep talks.",
              ],
              [
                Sparkle,
                "Deliver the boost",
                "Runners open messages when they need them most, not buried in a group chat.",
              ],
            ].map(([Icon, title, body]) => (
              <article
                className="rounded-[1.75rem] border bg-card p-6 shadow-sm"
                key={title as string}
              >
                <Icon className="size-7 text-luvy-purple" weight="fill" />
                <h2 className="mt-8 font-bold text-2xl tracking-tight">
                  {title as string}
                </h2>
                <p className="mt-3 text-muted-foreground leading-7">
                  {body as string}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-8 rounded-[2rem] bg-luvy-warm-panel p-6 sm:p-8 lg:grid-cols-[0.8fr_1fr] lg:p-10">
            <div className="relative min-h-64 overflow-hidden rounded-[1.5rem] bg-card">
              <LuvyMascot
                className="absolute bottom-0 left-1/2 h-72 w-56 -translate-x-1/2"
                pose="sitting"
              />
            </div>
            <div>
              <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                Built for runners and their people
              </p>
              <h2 className="mt-4 max-w-2xl font-bold text-4xl tracking-[-0.04em] sm:text-5xl">
                Turn race support into something they can actually carry.
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-8">
                Luvy keeps the setup simple for runners and the recording flow
                simple for supporters, so the emotional part gets all the
                attention.
              </p>
              <div className="mt-7">
                <SignUpButton mode="redirect">
                  <Button size="lg" variant="secondary">
                    Start sending love
                    <ArrowRight />
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <LandingPage />;
  }

  await ensureCurrentAppUser(userId);
  const { pinnedRun, followedRuns } = await getHomeFeed(userId);

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <section className="grid gap-4">
          <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
            Home
          </p>
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.04em]">
              Race love, ready when it matters.
            </h1>
            <p className="mt-3 text-muted-foreground text-sm leading-6">
              Your next race and the upcoming races from people you follow live
              here.
            </p>
          </div>
        </section>

        {pinnedRun ? (
          <RaceFeedCard
            eyebrow="Your next race"
            href={`/${pinnedRun.user.slug}/${pinnedRun.run.slug}`}
            ownerName="You"
            raceStartsAt={pinnedRun.run.raceStartsAt}
            raceTimezone={pinnedRun.run.raceTimezone}
            title={pinnedRun.run.title}
          />
        ) : (
          <section className="grid gap-4">
            <Microphone className="size-7 text-luvy-coral" weight="fill" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                No upcoming race yet.
              </h2>
              <p className="mt-2 text-muted-foreground text-sm leading-6">
                Create your first race page and invite people to send audio.
              </p>
            </div>
            <Link href="/dashboard/runs/new">
              <Button className="w-full">Create race</Button>
            </Link>
          </section>
        )}

        <section className="grid gap-3">
          <div>
            <h2 className="font-bold text-xl tracking-tight">Following</h2>
            <p className="text-muted-foreground text-xs">
              Upcoming races from people you follow.
            </p>
          </div>
          {followedRuns.length === 0 ? (
            <div className="text-muted-foreground text-sm leading-6">
              Follow someone from their invite link and their upcoming races
              will show up here.
            </div>
          ) : (
            followedRuns.map(({ run, user }) => (
              <RaceFeedCard
                eyebrow="Upcoming"
                href={`/${user.slug}/${run.slug}`}
                key={run.id}
                ownerName={user.displayName || user.slug}
                raceStartsAt={run.raceStartsAt}
                raceTimezone={run.raceTimezone}
                title={run.title}
              />
            ))
          )}
        </section>
      </main>
    </>
  );
}
