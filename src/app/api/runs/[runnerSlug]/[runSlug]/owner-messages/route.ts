import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getRunByPublicSlugs } from "@/lib/runs";
import { getUserByClerkId } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ runnerSlug: string; runSlug: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { canSeePrivateMessages: false, messages: [], playableMessageIds: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const { runnerSlug, runSlug } = await context.params;
  const data = await getRunByPublicSlugs(runnerSlug, runSlug, "desc");

  if (!data) {
    return new NextResponse(null, { status: 404 });
  }

  const isOwner = data.user.clerkUserId === userId;
  const currentUser = isOwner ? null : await getUserByClerkId(userId);
  const visibleMessages = isOwner
    ? data.messages
    : data.messages.filter(
        ({ message }) =>
          message.visibility === "public" ||
          message.senderUserId === currentUser?.id,
      );
  const playableMessageIds = visibleMessages
    .filter(
      ({ message }) => isOwner || message.senderUserId === currentUser?.id,
    )
    .map(({ message }) => message.id);
  const canSeePrivateMessages =
    isOwner ||
    visibleMessages.some(({ message }) => message.visibility === "private");

  return NextResponse.json(
    {
      canSeePrivateMessages,
      messages: canSeePrivateMessages ? visibleMessages : [],
      playableMessageIds,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
