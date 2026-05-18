"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { runs } from "@/db/schema";
import { zonedDateTimeToUtc } from "@/lib/dates";
import { getOwnedRun } from "@/lib/runs";
import { runDetailsFormSchema, runLinkFormSchema } from "@/lib/validations";

export async function updateRunSlug(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const runId = String(formData.get("runId") ?? "");
  const parsed = runLinkFormSchema.safeParse({
    runSlug: formData.get("runSlug"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid race link");
  }

  const ownedRun = await getOwnedRun(runId, userId);

  if (!ownedRun) {
    notFound();
  }

  const existing = await db.query.runs.findFirst({
    where: and(
      eq(runs.userId, ownedRun.user.id),
      eq(runs.slug, parsed.data.runSlug),
    ),
  });

  if (existing && existing.id !== ownedRun.run.id) {
    throw new Error("That race link is already used by another race");
  }

  await db
    .update(runs)
    .set({ slug: parsed.data.runSlug, updatedAt: new Date() })
    .where(eq(runs.id, ownedRun.run.id));

  revalidatePath(`/dashboard/runs/${ownedRun.run.id}`);
  revalidatePath(`/${ownedRun.user.slug}/${ownedRun.run.slug}`);
  revalidatePath(`/${ownedRun.user.slug}/${parsed.data.runSlug}`);
}

export async function updateRunDetails(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const runId = String(formData.get("runId") ?? "");
  const parsed = runDetailsFormSchema.safeParse({
    title: formData.get("title"),
    runSlug: formData.get("runSlug"),
    raceDate: formData.get("raceDate"),
    raceTime: formData.get("raceTime"),
    raceTimezone: formData.get("raceTimezone"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid race details");
  }

  const ownedRun = await getOwnedRun(runId, userId);

  if (!ownedRun) {
    notFound();
  }

  const existing = await db.query.runs.findFirst({
    where: and(
      eq(runs.userId, ownedRun.user.id),
      eq(runs.slug, parsed.data.runSlug),
    ),
  });

  if (existing && existing.id !== ownedRun.run.id) {
    throw new Error("That race link is already used by another race");
  }

  const raceStartsAt = zonedDateTimeToUtc(
    parsed.data.raceDate,
    parsed.data.raceTime,
    parsed.data.raceTimezone,
  );

  await db
    .update(runs)
    .set({
      slug: parsed.data.runSlug,
      title: parsed.data.title,
      raceStartsAt,
      raceTimezone: parsed.data.raceTimezone,
      location: parsed.data.location,
      updatedAt: new Date(),
    })
    .where(eq(runs.id, ownedRun.run.id));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/runs/${ownedRun.run.id}`);
  revalidatePath(`/${ownedRun.user.slug}/${ownedRun.run.slug}`);
  revalidatePath(`/${ownedRun.user.slug}/${parsed.data.runSlug}`);
}
