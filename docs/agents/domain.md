# Domain Docs

This repo currently uses a single-context domain documentation layout.

There is no root `CONTEXT.md` or `docs/adr/` directory yet. Until those exist, agents should infer domain language from the codebase and user conversation, then use the following product vocabulary consistently:

- A user is any signed-in Clerk account.
- A race is a user-owned event page with a public share URL.
- A race page is addressed by `/:userSlug/:raceSlug`.
- A message is an audio note sent by a signed-in user to a race.
- A private message is playable by the race owner after unlock.
- A public message is playable by non-owners after unlock.
- Following is user-to-user only.
- Race-day playback is the unlocked listening experience for race messages.

If `CONTEXT.md` or ADRs are added later, agents should read those first and let them override this inferred vocabulary.
