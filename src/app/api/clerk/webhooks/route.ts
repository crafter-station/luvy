import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { type NextRequest, NextResponse } from "next/server";

import { upsertUserFromClerk } from "@/lib/users";

type ClerkUserData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
  email_addresses?: { email_address: string; id: string }[];
  primary_email_address_id?: string | null;
};

function displayName(data: ClerkUserData) {
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");
  const email = data.email_addresses?.find(
    (item) => item.id === data.primary_email_address_id,
  )?.email_address;

  return fullName || data.username || email || "Luvy runner";
}

function slugBase(data: ClerkUserData) {
  const email = data.email_addresses?.find(
    (item) => item.id === data.primary_email_address_id,
  )?.email_address;

  return data.username || displayName(data) || email?.split("@")[0] || "runner";
}

export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request);

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ ok: true });
  }

  const data = event.data as ClerkUserData;

  await upsertUserFromClerk({
    clerkUserId: data.id,
    displayName: displayName(data),
    imageUrl: data.image_url ?? null,
    slugBase: slugBase(data),
  });

  return NextResponse.json({ ok: true });
}
