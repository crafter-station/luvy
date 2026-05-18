import type { User as ClerkUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { generateUniqueSlug } from "@/lib/slugs";

function clerkDisplayName(clerkUser: ClerkUser | null) {
  return (
    clerkUser?.fullName ||
    clerkUser?.username ||
    clerkUser?.primaryEmailAddress?.emailAddress ||
    "Luvy runner"
  );
}

function clerkSlugBase(clerkUser: ClerkUser | null) {
  return (
    clerkUser?.username ||
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "runner"
  );
}

export async function getUserByClerkId(clerkUserId: string) {
  return db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });
}

export async function getUserBySlug(slug: string) {
  return db.query.users.findFirst({ where: eq(users.slug, slug) });
}

export async function ensureCurrentAppUser(clerkUserId: string) {
  const existing = await getUserByClerkId(clerkUserId);
  const clerkUser = await currentUser();

  if (existing) {
    const displayName = clerkDisplayName(clerkUser);
    const imageUrl = clerkUser?.imageUrl ?? null;

    if (
      existing.displayName === displayName &&
      existing.imageUrl === imageUrl
    ) {
      return existing;
    }

    const [updated] = await db
      .update(users)
      .set({ displayName, imageUrl, updatedAt: new Date() })
      .where(eq(users.id, existing.id))
      .returning();

    return updated;
  }

  const slug = await generateUniqueSlug({
    base: clerkSlugBase(clerkUser),
    fallback: "runner",
    reserved: true,
    exists: async (candidate) => {
      const user = await getUserBySlug(candidate);

      return Boolean(user);
    },
  });

  const [created] = await db
    .insert(users)
    .values({
      clerkUserId,
      displayName: clerkDisplayName(clerkUser),
      imageUrl: clerkUser?.imageUrl ?? null,
      slug,
    })
    .returning();

  return created;
}

export async function isUserSlugAvailable(slug: string, userId: string) {
  const owner = await db.query.users.findFirst({
    where: and(eq(users.slug, slug), ne(users.id, userId)),
  });

  return !owner;
}

export async function upsertUserFromClerk({
  clerkUserId,
  displayName,
  imageUrl,
  slugBase,
}: {
  clerkUserId: string;
  displayName: string | null;
  imageUrl: string | null;
  slugBase: string;
}) {
  const existing = await getUserByClerkId(clerkUserId);

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({ displayName, imageUrl, updatedAt: new Date() })
      .where(eq(users.id, existing.id))
      .returning();

    return updated;
  }

  const slug = await generateUniqueSlug({
    base: slugBase,
    fallback: "runner",
    reserved: true,
    exists: async (candidate) => Boolean(await getUserBySlug(candidate)),
  });

  const [created] = await db
    .insert(users)
    .values({ clerkUserId, displayName, imageUrl, slug })
    .returning();

  return created;
}
