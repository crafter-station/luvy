"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { followUser, unfollowUser } from "@/lib/follows";
import { getAudioMessage } from "@/lib/messages";
import {
  ensureCurrentAppUser,
  getUserByClerkId,
  getUserBySlug,
} from "@/lib/users";

export async function deleteMessage(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const messageId = String(formData.get("messageId") ?? "");
  const [row] = await getAudioMessage(messageId);

  if (!row) {
    notFound();
  }

  const isRunOwner = row.owner.clerkUserId === userId;
  const currentUser = isRunOwner ? null : await getUserByClerkId(userId);
  const isMessageSender = currentUser?.id === row.message.senderUserId;

  if (!isRunOwner && !isMessageSender) {
    notFound();
  }

  await db
    .update(messages)
    .set({ deletedAt: new Date() })
    .where(and(eq(messages.id, messageId), eq(messages.runId, row.run.id)));

  revalidatePath(`/${row.owner.slug}/${row.run.slug}`);
  revalidatePath(`/dashboard/runs/${row.run.id}`);
  revalidatePath("/sent");
}

export async function updateMessageVisibility(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const messageId = String(formData.get("messageId") ?? "");
  const visibility = String(formData.get("visibility") ?? "");

  if (visibility !== "public" && visibility !== "private") {
    throw new Error("Invalid audio privacy");
  }

  const [row] = await getAudioMessage(messageId);

  if (!row) {
    notFound();
  }

  const currentUser = await getUserByClerkId(userId);

  if (currentUser?.id !== row.message.senderUserId) {
    notFound();
  }

  await db
    .update(messages)
    .set({ visibility })
    .where(and(eq(messages.id, messageId), eq(messages.runId, row.run.id)));

  revalidatePath(`/${row.owner.slug}/${row.run.slug}`);
  revalidatePath(`/dashboard/runs/${row.run.id}`);
  revalidatePath("/sent");
}

export async function toggleFollow(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const targetSlug = String(formData.get("targetSlug") ?? "");
  const returnPath = String(formData.get("returnPath") ?? "/");
  const nextAction = String(formData.get("nextAction") ?? "follow");
  const targetUser = await getUserBySlug(targetSlug);

  if (!targetUser) {
    return;
  }

  const currentUser = await ensureCurrentAppUser(userId);

  if (nextAction === "unfollow") {
    await unfollowUser(currentUser.id, targetUser.id);
  } else {
    await followUser(currentUser.id, targetUser.id);
  }

  revalidatePath(returnPath);
  revalidatePath("/");
}
