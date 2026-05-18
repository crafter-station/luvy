"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { runs } from "@/db/schema";
import { zonedDateTimeToUtc } from "@/lib/dates";
import { getRunPreset } from "@/lib/run-presets";
import { generateUniqueSlug } from "@/lib/slugs";
import { ensureCurrentAppUser } from "@/lib/users";
import { runFormSchema } from "@/lib/validations";

export async function createRun(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsed = runFormSchema.safeParse({
    presetId: formData.get("presetId") || undefined,
    title: formData.get("title"),
    raceDate: formData.get("raceDate"),
    raceTime: formData.get("raceTime"),
    raceTimezone: formData.get("raceTimezone"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid run details");
  }

  const data = parsed.data;
  const preset = getRunPreset(data.presetId);
  const raceStartsAt = zonedDateTimeToUtc(
    data.raceDate,
    data.raceTime,
    data.raceTimezone,
  );
  const user = await ensureCurrentAppUser(userId);

  const runSlug = await generateUniqueSlug({
    base: preset?.slugBase ?? data.title,
    fallback: "run",
    exists: async (slug) => {
      const existing = await db.query.runs.findFirst({
        where: and(eq(runs.userId, user.id), eq(runs.slug, slug)),
      });

      return Boolean(existing);
    },
  });

  const [newRun] = await db
    .insert(runs)
    .values({
      userId: user.id,
      slug: runSlug,
      title: data.title,
      raceStartsAt,
      raceTimezone: data.raceTimezone,
      location: data.location,
    })
    .returning();

  redirect(`/dashboard/runs/${newRun.id}`);
}
