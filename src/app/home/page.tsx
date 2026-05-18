import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  CalendarHeart,
  Heart,
  LockSimple,
  Microphone,
  PlayCircle,
  ShareNetwork,
  Sparkle,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import plate from "@/app/public/assets/plate.png";
import { AppHeader } from "@/components/app-header";
import {
  LandingCreateRaceButton,
  LandingFooterAuthLink,
  LandingHeroCtas,
} from "@/components/landing-auth-links";
import { LuvyMascot } from "@/components/luvy-mascot";
import { RabbitEarsLogo } from "@/components/rabbit-ears-logo";
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
    <div className="relative mx-auto min-h-[32rem] w-full max-w-lg sm:min-h-[36rem] lg:max-w-none lg:min-h-[38rem]">
      <div className="absolute left-0 top-8 h-64 w-64 rounded-full bg-luvy-blue/20 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-luvy-coral/20 blur-3xl" />
      <Image
        alt="Luvy race plate"
        className="absolute -right-8 top-12 w-56 rotate-[-7deg] drop-shadow-[0_28px_50px_rgb(91_53_200_/_18%)] sm:right-0 sm:top-2 sm:w-72 lg:top-4 lg:w-80"
        priority
        sizes="(min-width: 1024px) 352px, 288px"
        src={plate}
      />
      <LuvyMascot
        className="absolute bottom-2 -right-3 h-48 w-40 drop-shadow-[0_30px_50px_rgb(40_30_50_/_18%)] sm:right-2 sm:h-64 sm:w-52 lg:h-72 lg:w-56"
        pose="hi"
      />
      <div className="absolute bottom-6 left-0 z-20 grid w-48 gap-2 sm:bottom-12 sm:left-6 sm:w-72 sm:gap-3 lg:bottom-16">
        {[
          [
            "unlock",
            "Mile 21 unlock",
            "Mom sent you love",
            "bg-primary text-primary-foreground shadow-[0_20px_50px_rgb(91_53_200_/_25%)]",
          ],
          [
            "dad",
            "Dad",
            "Save a kick for the last hill. You have done harder things.",
            "ml-4 bg-luvy-blue text-white shadow-[0_16px_40px_rgb(95_156_246_/_24%)] sm:ml-8",
          ],
          [
            "crew",
            "Group chat",
            "We are screaming from the curb. Go get it.",
            "mr-5 bg-luvy-coral text-white shadow-[0_16px_40px_rgb(255_120_107_/_22%)] sm:mr-10",
          ],
          [
            "friend",
            "Best friend",
            "Breathe, smile, one more mile. We love you.",
            "ml-6 bg-card text-card-foreground shadow-[0_16px_40px_rgb(40_30_50_/_14%)] dark:bg-luvy-lavender sm:ml-12",
          ],
        ].map(([id, eyebrow, message, className]) => (
          <div
            className={`rounded-[1.15rem] px-3 py-2.5 sm:rounded-[1.5rem] sm:px-5 sm:py-4 ${className}`}
            key={id}
          >
            <p className="font-bold text-[0.54rem] uppercase tracking-[0.18em] opacity-75 sm:text-[0.68rem]">
              {eyebrow}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2 sm:gap-4">
              <p className="font-bold text-xs leading-snug sm:text-base">
                {message}
              </p>
              {id === "unlock" ? (
                <PlayCircle
                  className="size-7 shrink-0 sm:size-9"
                  weight="fill"
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="text-muted-foreground text-sm transition-colors hover:text-foreground"
      href={href}
    >
      {children}
    </Link>
  );
}

export function LandingPage() {
  return (
    <div className="relative left-1/2 w-dvw -translate-x-1/2 bg-background">
      <AppHeader showBottomNav={false} wide />
      <main className="overflow-hidden">
        <section className="relative px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-24">
          <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-linear-to-b from-luvy-lavender/70 via-luvy-peach/30 to-transparent dark:from-luvy-lavender/45 dark:via-transparent" />
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <p className="flex w-fit items-center gap-2 font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                <Heart className="size-4" weight="fill" />
                Open-source race day support
              </p>
              <h1 className="mt-6 text-balance font-bold text-5xl tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                Turn every hard mile into a voice from home.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-8 sm:text-xl">
                Luvy helps runners collect personal audio notes before race day,
                then unlocks them when motivation matters most.
              </p>
              <LandingHeroCtas />
              <div className="mt-8 grid max-w-xl gap-3 text-muted-foreground text-sm sm:grid-cols-3">
                {[
                  "Supporters record in the browser",
                  "Messages stay private until unlock",
                  "MIT-licensed and open source",
                ].map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <span className="size-2 rounded-full bg-luvy-coral" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <LandingHeroArt />
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                The problem
              </p>
              <h2 className="mt-4 text-balance font-bold text-4xl tracking-[-0.05em] sm:text-5xl">
                Race-day encouragement usually arrives too early, too late, or
                buried in a group chat.
              </h2>
            </div>
            <div className="grid content-start gap-8 text-lg leading-8 text-muted-foreground">
              <p>
                Texts are easy to miss when you are focused, tired, or out on
                the course. Luvy turns support into a simple ritual: one invite
                link, real voices, and unlock moments built around the run.
              </p>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  [ShareNetwork, "Invite"],
                  [Microphone, "Record"],
                  [LockSimple, "Unlock"],
                ].map(([Icon, label]) => (
                  <div
                    className="flex items-center gap-3"
                    key={label as string}
                  >
                    <Icon className="size-6 text-luvy-purple" weight="fill" />
                    <span className="font-bold text-foreground">
                      {label as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="relative min-h-80 overflow-hidden sm:min-h-96">
              <Image
                alt="Luvy race plate"
                className="absolute left-1 top-2 w-52 rotate-6 opacity-90 sm:left-8 sm:w-72 lg:w-80"
                sizes="(min-width: 640px) 320px, 256px"
                src={plate}
              />
              <LuvyMascot
                className="absolute bottom-0 right-1 h-56 w-44 drop-shadow-[0_28px_45px_rgb(40_30_50_/_18%)] sm:right-8 sm:h-[21rem] sm:w-64"
                pose="sitting"
              />
            </div>
            <div>
              <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                How it converts support into momentum
              </p>
              <h2 className="mt-4 max-w-2xl font-bold text-4xl tracking-[-0.04em] sm:text-5xl">
                A lightweight funnel for every runner and every supporter.
              </h2>
              <ol className="mt-8 grid gap-6">
                {[
                  [
                    "Create a race page",
                    "Add the race name, date, and unlock timing in a few fields.",
                  ],
                  [
                    "Share one link",
                    "Friends and family record encouragement without downloading an app.",
                  ],
                  [
                    "Run with voices ready",
                    "Messages become a private playlist for the moments that need a boost.",
                  ],
                ].map(([title, body], index) => (
                  <li className="grid grid-cols-[auto_1fr] gap-4" key={title}>
                    <span className="flex size-9 items-center justify-center rounded-full bg-luvy-purple font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-bold text-xl tracking-tight">
                        {title}
                      </span>
                      <span className="mt-1 block text-muted-foreground leading-7">
                        {body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <LandingCreateRaceButton>
                  Start sending love
                  <ArrowRight />
                </LandingCreateRaceButton>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 border-y py-10 md:grid-cols-3 md:gap-8">
              {[
                [
                  Waveform,
                  "For runners",
                  "Create one emotional home base before the race starts.",
                ],
                [
                  CalendarHeart,
                  "For supporters",
                  "Leave a note that feels more personal than another text.",
                ],
                [
                  Sparkle,
                  "For builders",
                  "Fork the app, inspect the code, and adapt the idea for your own events.",
                ],
              ].map(([Icon, title, body]) => (
                <article key={title as string}>
                  <Icon className="size-7 text-luvy-coral" weight="fill" />
                  <h2 className="mt-5 font-bold text-2xl tracking-tight">
                    {title as string}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-7">
                    {body as string}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="font-bold text-luvy-purple text-xs uppercase tracking-[0.18em]">
                Open source
              </p>
              <h2 className="mt-4 text-balance font-bold text-4xl tracking-[-0.05em] sm:text-6xl">
                Built in public for people who want race support to feel human.
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-8">
                Luvy is open source. Review the code, suggest improvements, or
                fork the project for your own endurance community.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="https://github.com/crafter-station/luvy">
                  <Button size="lg" variant="secondary">
                    View on GitHub
                    <ArrowRight />
                  </Button>
                </Link>
                <LandingCreateRaceButton variant="outline">
                  Create a race page
                </LandingCreateRaceButton>
              </div>
            </div>
            <div className="relative min-h-72">
              <LuvyMascot
                className="absolute bottom-0 left-1/2 h-64 w-52 -translate-x-1/2 drop-shadow-[0_30px_50px_rgb(40_30_50_/_18%)] sm:h-72 sm:w-56"
                pose="hi"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="flex items-center gap-2 font-bold tracking-tight text-foreground"
            href="/home"
          >
            <RabbitEarsLogo className="size-7" />
            <span className="text-2xl">luvy</span>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            <FooterLink href="/dashboard/runs/new">Create race page</FooterLink>
            <LandingFooterAuthLink />
            <FooterLink href="/races">Races</FooterLink>
            <FooterLink href="https://github.com/crafter-station/luvy">
              GitHub
            </FooterLink>
          </nav>
        </div>
      </footer>
    </div>
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
