import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { FollowButton } from "@/components/follow-button";
import { PublicMessagesSection } from "@/components/public-messages-section";
import { PublicRunHero } from "@/components/public-run-hero";
import { PublicShareButton } from "@/components/public-share-button";
import { SupporterMessageForm } from "@/components/supporter-message-form";
import { formatRaceTime, isUnlocked } from "@/lib/dates";
import { getRunByPublicSlugs } from "@/lib/runs";

export const dynamic = "force-static";
export const revalidate = 60;

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
