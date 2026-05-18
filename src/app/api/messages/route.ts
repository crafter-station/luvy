import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { audioExtension, uploadAudioBlob } from "@/lib/blob";
import { getRunByPublicSlugs } from "@/lib/runs";
import { ensureCurrentAppUser } from "@/lib/users";
import {
  isAllowedAudioType,
  MAX_AUDIO_BYTES,
  messageFormSchema,
} from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to send audio" },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("audio");

  const parsed = messageFormSchema.safeParse({
    userSlug: formData.get("userSlug"),
    runSlug: formData.get("runSlug"),
    visibility: formData.get("visibility"),
    durationSeconds: formData.get("durationSeconds"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message" },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Audio is required" }, { status: 400 });
  }

  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Audio must be 15 MB or smaller" },
      { status: 400 },
    );
  }

  if (!isAllowedAudioType(file.type)) {
    return NextResponse.json(
      { error: "Unsupported audio type" },
      { status: 400 },
    );
  }

  const runData = await getRunByPublicSlugs(
    parsed.data.userSlug,
    parsed.data.runSlug,
    "desc",
  );

  if (!runData) {
    return NextResponse.json({ error: "Race not found" }, { status: 404 });
  }

  const sender = await ensureCurrentAppUser(userId);
  const pathname = `runs/${runData.run.id}/messages/${randomUUID()}.${audioExtension(file.type)}`;
  const blob = await uploadAudioBlob({ file, pathname });

  await db.insert(messages).values({
    runId: runData.run.id,
    senderUserId: sender.id,
    visibility: parsed.data.visibility,
    blobUrl: blob.url,
    blobPathname: blob.pathname,
    contentType: file.type,
    sizeBytes: file.size,
    durationSeconds: parsed.data.durationSeconds,
    originalFilename: file.name,
  });

  revalidatePath(`/${parsed.data.userSlug}/${parsed.data.runSlug}`);
  revalidatePath("/sent");

  return NextResponse.json({ ok: true });
}
