import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getAudioMessage } from "@/lib/messages";
import { getUserByClerkId } from "@/lib/users";

export async function GET(
  _request: Request,
  context: { params: Promise<{ messageId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({
      canDelete: false,
      canUpdateVisibility: false,
    });
  }

  const { messageId } = await context.params;
  const [row] = await getAudioMessage(messageId);

  if (!row) {
    return new NextResponse(null, { status: 404 });
  }

  const currentUser = await getUserByClerkId(userId);
  const isRunOwner = row.owner.clerkUserId === userId;
  const isMessageSender = currentUser?.id === row.message.senderUserId;

  return NextResponse.json({
    canDelete: isRunOwner || isMessageSender,
    canUpdateVisibility: isMessageSender,
  });
}
