ALTER TABLE "runs" DROP CONSTRAINT IF EXISTS "runs_runner_id_runners_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "runners_slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "runs_runner_slug_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "runs_runner_idx";--> statement-breakpoint
ALTER TABLE "runners" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" RENAME CONSTRAINT "runners_clerk_user_id_unique" TO "users_clerk_user_id_unique";--> statement-breakpoint
ALTER TABLE "users" RENAME CONSTRAINT "runners_slug_unique" TO "users_slug_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "runs" RENAME COLUMN "runner_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "users" ("id", "clerk_user_id", "slug", "display_name", "image_url")
VALUES ('00000000-0000-0000-0000-000000000001', 'legacy-supporter', 'legacy-supporter', 'Legacy supporter', NULL)
ON CONFLICT ("clerk_user_id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "sender_user_id" uuid;--> statement-breakpoint
UPDATE "messages" SET "sender_user_id" = '00000000-0000-0000-0000-000000000001' WHERE "sender_user_id" IS NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "supporter_name";--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_slug_idx" ON "users" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "runs_user_slug_idx" ON "runs" USING btree ("user_id","slug");--> statement-breakpoint
CREATE INDEX "runs_user_idx" ON "runs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_sender_created_idx" ON "messages" USING btree ("sender_user_id","created_at");--> statement-breakpoint
CREATE TABLE "follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"follower_user_id" uuid NOT NULL,
	"following_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_user_id_users_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_users_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "follows_pair_idx" ON "follows" USING btree ("follower_user_id","following_user_id");--> statement-breakpoint
CREATE INDEX "follows_follower_idx" ON "follows" USING btree ("follower_user_id");--> statement-breakpoint
CREATE INDEX "follows_following_idx" ON "follows" USING btree ("following_user_id");
