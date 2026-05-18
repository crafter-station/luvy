import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/db";
import { follows, messages, runs, users } from "@/db/schema";
import type { SortDirection } from "@/lib/messages";

export async function getRunByPublicSlugs(
  userSlug: string,
  runSlug: string,
  sort: SortDirection,
) {
  const row = await getRunDetailsByPublicSlugs(userSlug, runSlug);

  if (!row) {
    return null;
  }

  const runMessages = await db
    .select({ message: messages, sender: users })
    .from(messages)
    .innerJoin(users, eq(messages.senderUserId, users.id))
    .where(and(eq(messages.runId, row.run.id), isNull(messages.deletedAt)))
    .orderBy(
      sort === "asc" ? asc(messages.createdAt) : desc(messages.createdAt),
    );

  return { ...row, messages: runMessages };
}

export async function getRunDetailsByPublicSlugs(
  userSlug: string,
  runSlug: string,
) {
  const [row] = await db
    .select({ user: users, run: runs })
    .from(runs)
    .innerJoin(users, eq(runs.userId, users.id))
    .where(and(eq(users.slug, userSlug), eq(runs.slug, runSlug)))
    .limit(1);

  return row ?? null;
}

export async function getRunnerRuns(clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return { user: null, runs: [] };
  }

  const userRuns = await db.query.runs.findMany({
    where: eq(runs.userId, user.id),
    orderBy: desc(runs.createdAt),
  });

  return { user, runs: userRuns };
}

export async function getOwnedRun(runId: string, clerkUserId: string) {
  const [row] = await db
    .select({ user: users, run: runs })
    .from(runs)
    .innerJoin(users, eq(runs.userId, users.id))
    .where(and(eq(runs.id, runId), eq(users.clerkUserId, clerkUserId)))
    .limit(1);

  return row ?? null;
}

export async function getHomeFeed(clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return { user: null, pinnedRun: null, followedRuns: [] };
  }

  const [pinnedRun] = await db
    .select({ run: runs, user: users })
    .from(runs)
    .innerJoin(users, eq(runs.userId, users.id))
    .where(and(eq(runs.userId, user.id), gt(runs.raceStartsAt, new Date())))
    .orderBy(asc(runs.raceStartsAt))
    .limit(1);

  const followedRuns = await db
    .select({ run: runs, user: users })
    .from(follows)
    .innerJoin(users, eq(follows.followingUserId, users.id))
    .innerJoin(runs, eq(runs.userId, follows.followingUserId))
    .where(
      and(
        eq(follows.followerUserId, user.id),
        gt(runs.raceStartsAt, new Date()),
      ),
    )
    .orderBy(asc(runs.raceStartsAt))
    .limit(20);

  return { user, pinnedRun: pinnedRun ?? null, followedRuns };
}
