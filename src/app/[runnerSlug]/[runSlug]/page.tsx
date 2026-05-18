import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { FollowButton } from "@/components/follow-button";
import { PublicMessagesSection } from "@/components/public-messages-section";
import { PublicRunHero } from "@/components/public-run-hero";
import { PublicShareButton } from "@/components/public-share-button";
import { SupporterMessageForm } from "@/components/supporter-message-form";
import { formatRaceTime, isUnlocked } from "@/lib/dates";
import { getRunByPublicSlugs, getRunDetailsByPublicSlugs } from "@/lib/runs";

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ runnerSlug: string; runSlug: string }>;
}): Promise<Metadata> {
  const { runnerSlug, runSlug } = await params;
  const data = await getRunDetailsByPublicSlugs(runnerSlug, runSlug);

  if (!data) {
    return {};
  }

  const runnerName = data.user.displayName ?? data.user.slug;
  const raceDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: data.run.raceTimezone,
  }).format(data.run.raceStartsAt);
  const description = `${runnerName} is running in the ${data.run.title} on ${raceDate}. Show them some love.`;
  const path = `/${runnerSlug}/${runSlug}`;

  return {
    title: `${runnerName} is running ${data.run.title}`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${runnerName} is running ${data.run.title}`,
      description,
      images: [
        {
          url: `${path}/opengraph-image`,
          width: 600,
          height: 315,
          type: "image/png",
        },
      ],
      url: path,
      siteName: "Luvy.run",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${runnerName} is running ${data.run.title}`,
      description,
      images: [`${path}/opengraph-image`],
    },
  };
}

export default async function PublicRunPage({
  params,
}: {
  params: Promise<{ runnerSlug: string; runSlug: string }>;
}) {
  const { runnerSlug, runSlug } = await params;
  const data = await getRunByPublicSlugs(runnerSlug, runSlug, "desc");

  if (!data) {
    notFound();
  }

  const raceTime = formatRaceTime(data.run.raceStartsAt, data.run.raceTimezone);
  const runnerName = data.user.displayName ?? data.user.slug;
  const publicPath = `/${runnerSlug}/${runSlug}`;
  const unlocked = isUnlocked(data.run.raceStartsAt);
  const lockedLabel = `Audio unlocks at race time: ${raceTime}`;
  const publicMessages = data.messages.filter(
    ({ message }) => message.visibility === "public",
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto grid w-full max-w-md gap-6 px-4 pb-28 pt-5">
        <PublicRunHero
          raceTitle={data.run.title}
          runnerImageUrl={data.user.imageUrl}
          runnerName={runnerName}
          followButton={
            <FollowButton
              ownerClerkUserId={data.user.clerkUserId}
              returnPath={publicPath}
              targetSlug={runnerSlug}
            />
          }
        />

        <SupporterMessageForm
          audioUnlockLabel={!unlocked ? lockedLabel : undefined}
          runSlug={runSlug}
          shareButton={
            <PublicShareButton
              path={publicPath}
              raceTitle={data.run.title}
              runnerClerkUserId={data.user.clerkUserId}
              runnerName={runnerName}
            />
          }
          userSlug={runnerSlug}
        />

        <PublicMessagesSection canPlay={unlocked} messages={publicMessages} />
      </main>
    </>
  );
}
