# luvy

luvy is a race-day voice note app. Runners create a public race page, share it with supporters, and collect audio messages that unlock when the race starts. Supporters can leave public or private encouragement without needing a separate app.

## Stack

- Next.js 16 App Router with React 19
- TypeScript
- Clerk authentication
- Drizzle ORM with Neon Postgres
- Vercel Blob for audio storage
- Tailwind CSS v4
- Biome for linting and formatting
- Bun for package management

## Core Features

- Public race pages at `/:runnerSlug/:runSlug`
- Runner dashboard for creating and managing race pages
- Supporter audio recording and upload flow
- Public and private audio message visibility
- Race-time audio unlock behavior
- Runner playlist and sent-message views
- Follow relationships for home feed discovery

## Project Structure

```txt
src/app/                  Next.js routes, pages, and API handlers
src/app/api/messages/     Audio upload and playback endpoints
src/components/           App and UI components
src/db/                   Drizzle client, schema, and inferred row types
src/lib/                  Domain logic for runs, users, messages, dates, blobs
drizzle/                  Generated database migrations
```

Important routes:

- `/home` - landing page for signed-out visitors and home feed for signed-in users
- `/dashboard` - runner dashboard
- `/dashboard/runs/new` - create a race page
- `/dashboard/runs/[runId]` - manage a race page
- `/profile` - runner profile and handle setup
- `/races` - followed/upcoming race discovery
- `/sent` - messages sent by the signed-in user
- `/:runnerSlug/:runSlug` - public race page

Protected routes are configured in `src/proxy.ts` with Clerk middleware.

## Requirements

- Bun
- Node.js version compatible with Next.js 16
- Clerk application
- Neon Postgres database
- Vercel Blob store

## Environment Variables

Create a local `.env.local` with the services you need for the work you are doing:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=
BLOB_READ_WRITE_TOKEN=

NEXT_PUBLIC_APP_URL=http://localhost:3000

CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Notes:

- `DATABASE_URL` is required for real database reads/writes and Drizzle commands.
- `BLOB_READ_WRITE_TOKEN` is required for audio uploads to Vercel Blob.
- Clerk keys are required for authenticated dashboard, profile, upload, and feed flows.

## Local Development

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Open `http://localhost:3000`. The root route redirects to `/home`.

## Database Workflow

The schema lives in `src/db/schema.ts` and migrations are generated into `drizzle/`.

After changing the schema, generate a migration:

```bash
bun run db:generate
```

Apply migrations:

```bash
bun run db:migrate
```

Current domain tables:

- `users` - app user profile linked to Clerk user IDs
- `runs` - runner-owned race pages
- `messages` - uploaded supporter audio messages
- `follows` - follower relationships between users

## Verification

Run Biome checks:

```bash
bun run lint
```

Run the production build and type check:

```bash
bun run build
```

Format files:

```bash
bun run format
```

There is no configured test script yet.

## Audio Flow

Supporters submit audio through `POST /api/messages`. The handler:

- Requires a signed-in Clerk user
- Validates race slugs, visibility, duration, file type, and file size
- Uploads the file to Vercel Blob under `runs/{runId}/messages/{uuid}.{ext}`
- Stores message metadata in Postgres
- Revalidates the public race page and sent-message page

Playback goes through `src/app/api/messages/[messageId]/audio/route.ts`, which performs ownership and unlock checks before redirecting to the Blob URL.

## Deployment

The app is designed for Vercel:

- Set the same environment variables in Vercel project settings.
- Provision Neon and Vercel Blob before enabling audio flows.
- Run Drizzle migrations against the production database before relying on new schema changes.
- `src/app/api/messages/route.ts` uses the Node runtime because audio upload handling requires it.

## Development Notes

- Use `bun run <script>` rather than npm/yarn/pnpm commands.
- App Router route params use Next 16 promise-style `params` and `searchParams`.
- Tailwind CSS v4 is configured through PostCSS; there is no `tailwind.config.*` file.
- UI components follow the shadcn configuration in `components.json`.
- Keep database types sourced from `src/db/schema.ts` inferred exports where possible.
