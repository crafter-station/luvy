import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isUnlocked } from "@/lib/dates";
import { canPublicPlayMessage, getAudioMessage } from "@/lib/messages";
import { getUserByClerkId } from "@/lib/users";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await context.params;
  const [row] = await getAudioMessage(messageId);

  if (!row) {
    return new NextResponse(null, { status: 404 });
  }

  if (canPublicPlayMessage(row.message, row.run.raceStartsAt)) {
    return NextResponse.redirect(row.message.blobUrl);
  }

  const { userId } = await auth();
  const currentUser = userId ? await getUserByClerkId(userId) : null;
  const canPlayPrivate =
    isUnlocked(row.run.raceStartsAt) &&
    (userId === row.owner.clerkUserId ||
      currentUser?.id === row.message.senderUserId);

  if (!canPlayPrivate) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.redirect(row.message.blobUrl);
}
