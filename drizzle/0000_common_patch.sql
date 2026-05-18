CREATE TYPE "public"."message_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_id" uuid NOT NULL,
	"visibility" "message_visibility" NOT NULL,
	"supporter_name" text,
	"blob_url" text NOT NULL,
	"blob_pathname" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"duration_seconds" integer NOT NULL,
	"original_filename" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "runners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"slug" text NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "runners_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "runners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"runner_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"race_starts_at" timestamp with time zone NOT NULL,
	"race_timezone" text NOT NULL,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_runner_id_runners_id_fk" FOREIGN KEY ("runner_id") REFERENCES "public"."runners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "messages_run_created_idx" ON "messages" USING btree ("run_id","created_at");--> statement-breakpoint
CREATE INDEX "messages_run_visibility_created_idx" ON "messages" USING btree ("run_id","visibility","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "runners_slug_idx" ON "runners" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "runs_runner_slug_idx" ON "runs" USING btree ("runner_id","slug");--> statement-breakpoint
CREATE INDEX "runs_runner_idx" ON "runs" USING btree ("runner_id");