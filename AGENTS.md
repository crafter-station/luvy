# AGENTS.md

## Commands

- Package manager: this repo has `bun.lock`; prefer `bun run <script>` and `bun install`.
- Dev server: `bun run dev` starts Next on `http://localhost:3000`.
- Verification: `bun run lint` runs `biome check`; `bun run build` is the only configured type/build check. There is no test script.
- Formatting: `bun run format` runs `biome format --write`.
- Drizzle: edit `src/db/schema.ts`, then run `bun run db:generate`; apply migrations with `bun run db:migrate`.

## App Shape

- Next is pinned to `16.2.6` with React `19.2.4`; verify Next API details instead of relying on older App Router memory.
- App entrypoints live in `src/app`; this repo uses Next 16 async `params`/`searchParams` promises in pages and route handlers.
- Auth is Clerk. `src/proxy.ts`, not `middleware.ts`, protects `/dashboard(.*)` and includes Clerk matchers.
- Database access is Drizzle over Neon HTTP from `src/db/index.ts`; schema and inferred row types live in `src/db/schema.ts`.
- Public race pages are `/:runnerSlug/:runSlug`; runner-owned pages are under `/dashboard`.
- Audio uploads go through `src/app/api/messages/route.ts`, store files in Vercel Blob, and require Node runtime. Playback redirects through `src/app/api/messages/[messageId]/audio/route.ts` after unlock/ownership checks.

## Environment

- Local work that hits auth/database/blob needs Clerk env, `DATABASE_URL`, and Vercel Blob credentials. `drizzle.config.ts` reads `DATABASE_URL` directly.
- `src/db/index.ts` falls back to a fake Postgres URL only to avoid import-time crashes; real DB operations still need `DATABASE_URL`.

## Conventions

- Imports use the `@/*` alias for `src/*`.
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss`; there is no `tailwind.config.*` file.
- UI components follow `components.json`: shadcn base-lyra style, RSC enabled, Phosphor icons.
- Biome owns linting, formatting, and import organization. It uses 2-space indentation and has Next/React recommended domains enabled.
- `CLAUDE.md` only delegates to this file, so keep shared agent guidance here.

## Agent skills

### Issue tracker

Issues and PRDs are tracked as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default triage label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo currently uses a single-context domain documentation layout. See `docs/agents/domain.md`.
