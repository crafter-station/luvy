const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "profile",
  "races",
  "sent",
  "sign-in",
  "sign-up",
  "_next",
  "favicon.ico",
]);

export function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

export function slugify(value: string, fallback = "run") {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
    .replace(/^-|-$/g, "");

  return slug || fallback;
}

export function isValidSlug(value: string) {
  return /^(?!-)[a-z0-9-]{3,40}(?<!-)$/.test(value);
}

export function isReservedSlug(value: string) {
  return RESERVED_SLUGS.has(normalizeSlug(value));
}

export async function generateUniqueSlug({
  base,
  fallback,
  exists,
  reserved = false,
}: {
  base: string;
  fallback: string;
  exists: (slug: string) => Promise<boolean>;
  reserved?: boolean;
}) {
  const baseSlug = slugify(base, fallback);

  for (let index = 0; index < 100; index += 1) {
    const suffix = index === 0 ? "" : `-${index + 1}`;
    const slug = slugify(`${baseSlug}${suffix}`, fallback);

    if (reserved && isReservedSlug(slug)) {
      continue;
    }

    if (!(await exists(slug))) {
      return slug;
    }
  }

  return `${slugify(baseSlug, fallback).slice(0, 31)}-${crypto.randomUUID().slice(0, 8)}`;
}
