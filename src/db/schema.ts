import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const messageVisibility = pgEnum("message_visibility", [
  "public",
  "private",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_slug_idx").on(table.slug)],
);

export const runs = pgTable(
  "runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    raceStartsAt: timestamp("race_starts_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    raceTimezone: text("race_timezone").notNull(),
    location: text("location"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("runs_user_slug_idx").on(table.userId, table.slug),
    index("runs_user_idx").on(table.userId),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    senderUserId: uuid("sender_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    visibility: messageVisibility("visibility").notNull(),
    blobUrl: text("blob_url").notNull(),
    blobPathname: text("blob_pathname").notNull(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    originalFilename: text("original_filename"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("messages_run_created_idx").on(table.runId, table.createdAt),
    index("messages_run_visibility_created_idx").on(
      table.runId,
      table.visibility,
      table.createdAt,
    ),
    index("messages_sender_created_idx").on(
      table.senderUserId,
      table.createdAt,
    ),
  ],
);

export const follows = pgTable(
  "follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerUserId: uuid("follower_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingUserId: uuid("following_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("follows_pair_idx").on(
      table.followerUserId,
      table.followingUserId,
    ),
    index("follows_follower_idx").on(table.followerUserId),
    index("follows_following_idx").on(table.followingUserId),
  ],
);

export type User = typeof users.$inferSelect;
export type Run = typeof runs.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type MessageVisibility = (typeof messageVisibility.enumValues)[number];
