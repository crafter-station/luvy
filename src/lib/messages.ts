import { and, asc, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { type Message, messages, runs, users } from "@/db/schema";
import { isUnlocked } from "@/lib/dates";

export type SortDirection = "asc" | "desc";

export type MessageWithRun = Message & {
  run: typeof runs.$inferSelect;
  user: typeof users.$inferSelect;
};

export function canPublicPlayMessage(message: Message, raceStartsAt: Date) {
  return (
    message.visibility === "public" &&
    message.deletedAt === null &&
    isUnlocked(raceStartsAt)
  );
}

export async function getMessagesForRun(runId: string, sort: SortDirection) {
  return db
    .select({ message: messages, sender: users })
    .from(messages)
    .innerJoin(users, eq(messages.senderUserId, users.id))
    .where(and(eq(messages.runId, runId), isNull(messages.deletedAt)))
    .orderBy(
      sort === "asc" ? asc(messages.createdAt) : desc(messages.createdAt),
    );
}

export async function getAudioMessage(messageId: string) {
  return db
    .select({ message: messages, run: runs, owner: users })
    .from(messages)
    .innerJoin(runs, eq(messages.runId, runs.id))
    .innerJoin(users, eq(runs.userId, users.id))
    .where(and(eq(messages.id, messageId), isNull(messages.deletedAt)))
    .limit(1);
}

export async function getSentMessages(clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return [];
  }

  return db
    .select({ message: messages, run: runs, owner: users })
    .from(messages)
    .innerJoin(runs, eq(messages.runId, runs.id))
    .innerJoin(users, eq(runs.userId, users.id))
    .where(and(eq(messages.senderUserId, user.id), isNull(messages.deletedAt)))
    .orderBy(desc(messages.createdAt));
}
