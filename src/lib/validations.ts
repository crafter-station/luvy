import { z } from "zod";

import { isReservedSlug, isValidSlug, normalizeSlug } from "@/lib/slugs";
import { isSupportedTimezone } from "@/lib/timezones";

export const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
export const MAX_AUDIO_SECONDS = 120;

const slugSchema = z
  .string()
  .trim()
  .transform(normalizeSlug)
  .refine(isValidSlug, "Use 3-40 lowercase letters, numbers, or hyphens");

export const userSlugSchema = slugSchema.refine(
  (slug) => !isReservedSlug(slug),
  "That user slug is reserved",
);

export const runnerSlugSchema = userSlugSchema;

export const runSlugSchema = slugSchema;

export const sortSchema = z.enum(["asc", "desc"]).catch("desc");

export const runFormSchema = z.object({
  presetId: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required").max(120),
  raceDate: z.string().trim().min(1, "Race date is required"),
  raceTime: z.string().trim().min(1, "Race time is required"),
  raceTimezone: z
    .string()
    .trim()
    .min(1, "Timezone is required")
    .refine(isSupportedTimezone, "Choose a valid timezone"),
  location: z.string().trim().min(1, "Location is required").max(120),
});

export const runnerHandleFormSchema = z.object({
  userSlug: userSlugSchema,
});

export const profileFormSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(80),
  userSlug: userSlugSchema,
});

export const runLinkFormSchema = z.object({
  runSlug: runSlugSchema,
});

export const runDetailsFormSchema = runFormSchema
  .omit({ presetId: true })
  .extend({ runSlug: runSlugSchema });

export const messageFormSchema = z.object({
  userSlug: userSlugSchema,
  runSlug: runSlugSchema,
  visibility: z.enum(["public", "private"]),
  durationSeconds: z.coerce.number().int().min(1).max(MAX_AUDIO_SECONDS),
});

export function normalizeAudioType(contentType: string) {
  return contentType.split(";")[0]?.trim().toLowerCase() ?? "";
}

export function isAllowedAudioType(contentType: string) {
  return ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav"].includes(
    normalizeAudioType(contentType),
  );
}
