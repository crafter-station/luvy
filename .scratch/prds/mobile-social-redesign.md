---
title: Mobile-Only Social Race Audio Redesign
labels:
  - needs-triage
status: draft
created: 2026-05-17
issue_type: prd
---

## Problem Statement

Luvy.run currently feels like a responsive desktop web app with forms and dashboards, but the intended product experience is a mobile app used in emotional, time-sensitive race contexts. Supporters should not have to navigate a long form to send love. Runners should not manage race-day audio through wide dashboard layouts. Everyone should experience the product as a focused mobile app, even when opened on desktop.

The current public race page allows anonymous message submission, stores a supporter name snapshot on messages, and treats runners as a separate domain concept. That no longer matches the desired product model. Every person using the app should be a signed-in user. Users can own races, send audio to other users' races, follow users through invite links, and manage their own profile through Clerk-backed identity.

The recording experience also needs to feel like a real mobile recording view. Users should see live audio levels while recording, review and play their audio before submitting, retry if needed, and choose visibility before sending. Race-day playback should similarly feel like a mobile-first playback view with large controls and clear access rules.

## Solution

Redesign the entire app around a centered mobile shell that applies on every route, including auth. Desktop users see the same phone-width app centered on the page. Normal app screens use a bottom navigation with Home, Races, Sent, and Profile. Focused flows, including auth, race creation, recording, review, and submit, replace the bottom navigation with a single contextual bottom action.

Replace anonymous posting with authenticated message sending. Public race pages remain visible to signed-out visitors, but starting the recording flow requires Clerk sign-in. Replace the runner-specific data model with a user-owned race model. Messages store only a sender user reference, never a name snapshot. User names and avatars are canonical profile data synced with Clerk through webhooks and in-app profile updates.

Add user-to-user following. Following starts from invite or shared race/profile links only. Home becomes a feed that pins the signed-in user's next owned race and shows upcoming races from followed users. Races shows races owned by the signed-in user. Sent shows audio messages the user has sent. Profile manages account identity, public slug, and sign-out.

Rebuild the supporter message experience as a guided mobile flow with separate views: context, recording, review playback/retry, and privacy/send. The recording view uses real microphone analyser data to render a live waveform. The review view lets users play the captured audio before submitting. The privacy/send view preserves public/private message semantics.

Rebuild race-day playback as a mobile-first player. Race owners can hear all unlocked messages for their races. Non-owner users can hear public unlocked messages only. Locked messages remain unavailable until race time.

## User Stories

1. As a signed-out visitor, I want to open a shared race link, so that I can understand who the race is for before signing in.
2. As a signed-out visitor, I want to see race title, owner, date, location, and message status, so that I know I am on the right race page.
3. As a signed-out visitor, I want to be prompted to sign in when I try to send audio, so that my message is tied to my account.
4. As a signed-out visitor, I want the sign-in screen to use the same mobile app layout, so that authentication feels like part of the product.
5. As a new user, I want Clerk sign-up to create my app user profile, so that I can send messages and follow people immediately.
6. As a signed-in user, I want my profile name and avatar to come from Clerk, so that my identity is consistent across the app.
7. As a signed-in user, I want in-app profile edits to update Clerk, so that Clerk remains the canonical identity source.
8. As a signed-in user, I want Clerk profile changes to sync into the app database, so that profile displays stay current without storing stale message snapshots.
9. As a signed-in user, I want a public user slug, so that my race pages can use a shareable URL.
10. As a signed-in user, I want race pages to keep the `/:userSlug/:raceSlug` URL shape, so that links remain simple and memorable.
11. As a signed-in user, I want to follow another user from their shared link, so that their upcoming races appear on my Home screen.
12. As a signed-in user, I want to unfollow a user from their shared page, so that I can control whose races appear in my feed.
13. As a signed-in user, I want follows to be user-to-user only, so that following someone brings their race activity into my app.
14. As a signed-in user, I want Home to show my next owned race first, so that I can quickly manage or share my most relevant race.
15. As a signed-in user, I want Home to show upcoming races from users I follow, so that I can send them support at the right time.
16. As a signed-in user, I want the Home feed to be useful even if I do not own races, so that I can primarily support other runners.
17. As a signed-in user, I want the Home feed to be useful even if I do not follow anyone yet, so that I know what to do next.
18. As a signed-in user, I want a Races tab, so that I can see and manage races I own.
19. As a signed-in user, I want to create a race from a focused mobile flow, so that race creation does not feel like filling out a desktop form.
20. As a signed-in user, I want to edit race details in a mobile view, so that managing my race works well on a phone.
21. As a signed-in user, I want to copy or open my race share link, so that I can invite people to follow me and send audio.
22. As a signed-in user, I want to see all messages for my owned race, so that I can moderate and manage submissions.
23. As a race owner, I want playback to unlock at race time, so that messages stay saved for the moment they matter.
24. As a race owner, I want to hear both public and private messages after unlock, so that private support reaches only me.
25. As a non-owner user, I want to hear public unlocked messages, so that shared race-day support can be experienced by others.
26. As a non-owner user, I do not want to hear private messages, so that the sender's privacy choice is respected.
27. As a user sending audio, I want to start from a race page, so that recording is tied to a specific race.
28. As a user sending audio, I want the recording flow to be a sequence of views, so that each step is focused and easy on mobile.
29. As a user sending audio, I want to understand who I am sending love to before recording, so that I can make the message personal.
30. As a user sending audio, I want to tap one large record button, so that recording is easy with one thumb.
31. As a user sending audio, I want to see a live waveform driven by my microphone, so that I know the app is hearing me.
32. As a user sending audio, I want to see an elapsed recording timer, so that I can keep my message concise.
33. As a user sending audio, I want the app to enforce the maximum audio duration, so that submissions stay within product limits.
34. As a user sending audio, I want the app to show microphone permission errors clearly, so that I know how to recover.
35. As a user sending audio, I want recording resources to stop when I finish or retry, so that my microphone is not left active.
36. As a user sending audio, I want to review my recording before sending, so that I can avoid submitting the wrong audio.
37. As a user sending audio, I want to play and pause the recorded audio during review, so that I can check the message.
38. As a user sending audio, I want to retry from the review step, so that I can replace a bad recording.
39. As a user sending audio, I want to choose public or private visibility, so that I control who can hear the message after unlock.
40. As a user sending audio, I want a clear final send action at the bottom of the screen, so that submitting feels deliberate.
41. As a user sending audio, I want to see a success view after submission, so that I know the message was saved.
42. As a user sending audio, I want failed uploads to show a recoverable error, so that I do not lose the flow without explanation.
43. As a user sending audio, I want the app to reject unsupported audio types, so that only playable audio is stored.
44. As a user sending audio, I want the app to reject oversized audio, so that uploads stay within product limits.
45. As a user sending audio, I want my sent messages to appear in Sent, so that I can remember who I supported.
46. As a user sending audio, I want Sent to show the race and recipient user, so that the history is meaningful.
47. As a user sending audio, I want Sent to show message visibility and duration, so that I understand what I sent.
48. As a user sending audio, I want Sent to respect unlock and playback permissions, so that the history does not bypass race-day rules.
49. As a runner, I want people who receive my link to follow me, so that future races appear in their Home feed.
50. As a runner, I want my race page to show a follow action, so that supporters can opt into future updates.
51. As a runner, I want my race page to show message counts and locked/open state, so that visitors understand the race-day mechanic.
52. As a runner, I want my manage-race screen to use the same mobile shell, so that the dashboard does not feel separate from the app.
53. As a runner, I want to delete inappropriate messages, so that I can moderate my race page.
54. As a runner, I want deleted messages to stop appearing in lists and playback, so that moderation is effective.
55. As a runner on race day, I want a large playback card, so that controls are easy while moving or tired.
56. As a runner on race day, I want next and previous controls, so that I can move through messages quickly.
57. As a runner on race day, I want a progress bar and current time, so that I know where I am in the current message.
58. As a runner on race day, I want an up-next list, so that I can anticipate upcoming messages.
59. As a runner on race day, I want playback to continue to the next message, so that the playlist feels continuous.
60. As a runner on race day, I want private and public messages to be visually understandable, so that I know what type of support I am hearing.
61. As a mobile user, I want every route to fit inside a mobile-width app shell, so that desktop and mobile experiences are consistent.
62. As a desktop user, I want the mobile app centered on the page, so that the product does not stretch into an unintended desktop dashboard.
63. As a mobile user, I want bottom navigation on normal screens, so that primary app sections are reachable with one thumb.
64. As a mobile user, I want focused flows to replace navigation with one CTA, so that I am not distracted while recording or submitting.
65. As a mobile user, I want cards, buttons, and controls to be large enough for touch, so that the app feels native to phone use.
66. As a mobile user, I want the Luvy mascot and warm visual style to appear in emotional moments, so that the product feels encouraging and personal.
67. As a product owner, I want the domain language to use users, races, messages, follows, and playback, so that implementation matches the intended model.
68. As a developer, I want recording logic separated from visual rendering, so that microphone behavior can be tested independently.
69. As a developer, I want playback access rules isolated in a deep module, so that public/private/owner behavior is easy to verify.
70. As a developer, I want feed construction isolated in a deep module, so that Home can evolve without scattering follow/race query logic.
71. As a developer, I want Clerk sync behavior isolated behind a small profile interface, so that webhooks and in-app profile edits share the same profile persistence rules.
72. As a developer, I want URL resolution isolated around user slug and race slug, so that public pages stay stable while the data model changes.

## Implementation Decisions

- Build a global mobile app shell that constrains all routes to a centered phone-width viewport, including auth routes.
- Normal app screens use a bottom nav with Home, Races, Sent, and Profile.
- Focused flows replace the bottom nav with one contextual bottom action.
- Recording remains contextual to a specific race page; there is no global Record tab.
- Public race pages remain viewable while signed out.
- Recording and submitting audio requires Clerk sign-in.
- Remove anonymous posting.
- Replace the runner domain model with a user domain model.
- Keep public race URLs shaped as `/:userSlug/:raceSlug`.
- Store message sender identity as a user reference only.
- Do not store sender display-name snapshots on messages.
- Add user-to-user follows.
- Do not add a people discovery directory in this PRD.
- Following starts from shared invite, public profile, or public race surfaces.
- Home shows the user's next owned race pinned above followed users' upcoming races.
- Races shows races owned by the signed-in user.
- Sent shows messages sent by the signed-in user.
- Profile manages user display name, avatar, public slug, and account controls.
- Clerk is the canonical source for display name and avatar.
- Clerk webhook events upsert and update local user profiles.
- In-app profile edits update Clerk through backend APIs and then update local app state.
- Race owner playback can access public and private messages after unlock.
- Non-owner playback can access public messages after unlock.
- Deleted messages are excluded from public lists, owner lists, Sent history where appropriate, and playback queues.
- The recording flow has four views: race context, live recording, review playback/retry, and privacy/send.
- The live recording view uses real microphone analyser data for waveform levels.
- The recording module must clean up media streams, audio contexts, animation frames, and recorder state on stop, retry, unmount, and error.
- The review view creates a local playable preview from the recorded audio before upload.
- The submit action uploads the audio through the server, validates size, validates content type, validates duration, and associates it with the signed-in sender.
- Race-day playback uses a mobile card player with large play/pause, next/previous, progress, and up-next controls.
- The upload and playback APIs continue to enforce unlock and authorization server-side.
- Deep module opportunity: a recording controller with a small interface for start, stop, retry, elapsed time, analyser levels, and resulting audio file.
- Deep module opportunity: a playback access policy that receives viewer, race owner, message visibility, deleted state, and unlock state, then returns allowed actions.
- Deep module opportunity: a feed builder that receives the signed-in user and returns pinned race plus followed-user race feed items.
- Deep module opportunity: a profile sync service that handles Clerk webhook updates and in-app profile changes through the same user profile semantics.
- Deep module opportunity: a public race resolver that resolves user slug and race slug to race, owner, messages, follow state, and viewer permissions.

## Testing Decisions

- Tests should verify external behavior and domain outcomes, not implementation details or component internals.
- Recording tests should focus on state transitions and cleanup behavior through a mocked media recorder/analyser boundary, not exact waveform drawing.
- Playback access tests should cover owner versus non-owner, public versus private, locked versus unlocked, and deleted versus active messages.
- Message submission tests should cover signed-out rejection, missing audio rejection, invalid audio type rejection, oversized audio rejection, race not found, and successful authenticated insertion with sender user reference.
- Feed tests should cover no owned race, pinned next owned race, followed users with upcoming races, and empty following state.
- Profile sync tests should cover Clerk webhook create/update, in-app profile update, slug uniqueness, and local profile persistence.
- Follow tests should cover follow, unfollow, self-follow prevention, duplicate follow idempotency, and feed visibility after follow changes.
- Route-level tests should verify that signed-out users can view public race context but cannot start recording without sign-in.
- UI tests should verify that normal screens expose the bottom nav and focused flows expose only the contextual bottom action.
- Prior art is limited because this repo currently has no configured test script. Verification should start with lint and build, and the implementation should add a test setup if the team wants automated coverage for the deep modules.
- The best first automated tests are pure domain tests for playback access, feed construction, follow behavior, and profile sync because those can be isolated from browser media APIs.

## Out of Scope

- A full people discovery directory is out of scope.
- Race-level follows are out of scope.
- Global recording without first choosing a race is out of scope.
- Native mobile app implementation is out of scope; this is a mobile-only web app layout.
- Push notifications are out of scope.
- Real-time race tracking or GPS integration is out of scope.
- Social reactions, comments, likes, and reposting are out of scope.
- Group/team accounts are out of scope.
- Payment, subscriptions, or monetization are out of scope.
- Advanced audio editing, trimming, filters, captions, and transcription are out of scope.
- A full desktop layout is explicitly out of scope.

## Further Notes

The redesign should preserve the warm Luvy visual language from the supplied mockups: cream backgrounds, purple primary actions, coral recording states, rounded cards, mascot-centered emotional moments, and large thumb-friendly controls.

This is intentionally a large redesign that combines layout, auth, schema, social graph, recording flow, and playback updates. Because the user requested one big redesign, implementation should still be structured around deep modules so the work remains reviewable and testable.

The current repo has no remote issue tracker configured. This PRD is therefore published as a local markdown issue with the `needs-triage` label.
