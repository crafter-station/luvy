import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { follows } from "@/db/schema";

export async function isFollowing(
  followerUserId: string,
  followingUserId: string,
) {
  const follow = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerUserId, followerUserId),
      eq(follows.followingUserId, followingUserId),
    ),
  });

  return Boolean(follow);
}

export async function followUser(
  followerUserId: string,
  followingUserId: string,
) {
  if (followerUserId === followingUserId) {
    return;
  }

  await db
    .insert(follows)
    .values({ followerUserId, followingUserId })
    .onConflictDoNothing();
}

export async function unfollowUser(
  followerUserId: string,
  followingUserId: string,
) {
  await db
    .delete(follows)
    .where(
      and(
        eq(follows.followerUserId, followerUserId),
        eq(follows.followingUserId, followingUserId),
      ),
    );
}
