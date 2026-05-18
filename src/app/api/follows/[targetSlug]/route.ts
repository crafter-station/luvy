import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isFollowing } from "@/lib/follows";
import { getUserByClerkId, getUserBySlug } from "@/lib/users";

export async function GET(
  _request: Request,
  context: { params: Promise<{ targetSlug: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ isFollowing: false });
  }

  const { targetSlug } = await context.params;
  const [currentUser, targetUser] = await Promise.all([
    getUserByClerkId(userId),
    getUserBySlug(targetSlug),
  ]);

  if (!currentUser || !targetUser || currentUser.id === targetUser.id) {
    return NextResponse.json({ isFollowing: false });
  }

  return NextResponse.json({
    isFollowing: await isFollowing(currentUser.id, targetUser.id),
  });
}
