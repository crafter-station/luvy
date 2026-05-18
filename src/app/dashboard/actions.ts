"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureCurrentAppUser } from "@/lib/users";
import { profileFormSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsed = profileFormSchema.safeParse({
    displayName: formData.get("displayName"),
    userSlug: formData.get("userSlug"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile");
  }

  const user = await ensureCurrentAppUser(userId);
  const slugOwner = await db.query.users.findFirst({
    where: and(eq(users.slug, parsed.data.userSlug), ne(users.id, user.id)),
  });

  if (slugOwner) {
    throw new Error("That handle is already taken");
  }

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    firstName: parsed.data.displayName,
    lastName: "",
  });

  const updated = await db
    .update(users)
    .set({
      displayName: parsed.data.displayName,
      slug: parsed.data.userSlug,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning();

  if (!updated[0]) {
    notFound();
  }

  revalidatePath("/");
  revalidatePath("/profile");
}

export const updateRunnerHandle = updateProfile;
