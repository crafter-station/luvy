# Luvy — Visual Style Reference

## 1. Core Aesthetic

**Race-Day Love Courier**

Luvy is a warm, emotional race-day app where friends and family send voice notes to runners, and runners hear them exactly when they need encouragement most.

The product should feel like a tiny support crew in your pocket: soft, personal, loving, and race-day ready.

### Visual mood

- Plush, warm, emotional
- Mobile-first and iconic
- Soft 3D mascot-led branding
- Race-day energy without looking too sporty
- Encouragement over competition
- Voice notes as emotional artifacts
- Sunrise warmth, family love, and calm motivation

### Brand personality

Luvy should feel like:

- A friend cheering quietly but powerfully
- A love note that arrives while you’re running
- A plush mascot delivering emotional fuel
- A race-day companion, not a performance tracker
- Warm enough for families, polished enough for runners

---

## 2. Product Name

### App name

**Luvy**

### Domain

**Luvy.run**

### Mascot name

**Luvy**

### Brand line options

- Love runs with you.
- Voice notes for race day.
- Send love. They’ll hear it when it matters.
- Tiny messages. Big miles.
- Your people, in your ears.
- Race day feels less lonely with Luvy.

### App description

Luvy lets friends and family record audio messages for a runner. On race day, the runner hears those messages as emotional encouragement during the run.

---

## 3. Mascot System

## Luvy

### Species

Tiny plush bunny love courier.

### Personality

Luvy is a gentle little courier who carries voice notes from the people who love you and delivers them when the race gets hard.

### Role in the product

Luvy is not a coach, pacer, doctor, robot, or athlete.

Luvy is:

- The emotional mascot
- The message courier
- The onboarding guide
- The empty-state companion
- The race-day encouragement avatar
- The notification character
- The app icon hero

### Key visual traits

- Soft cream plush bunny
- Big kind brown eyes
- Tiny peach-pink nose
- Small gentle smile
- Warm peach inner ears
- Rounded plush body
- Tiny blue headphones
- Purple heart-shaped pouch for voice notes
- Small race bib
- Tiny sound-wave charm
- Soft paw pads
- Simple silhouette readable at small sizes

### What to avoid

- No aggressive athletic styling
- No superhero cape
- No medical/therapy look
- No robot elements
- No overly complex accessories
- No hard sci-fi audio visuals
- No competitive “go faster” energy
- No sharp tech/neon UI

---

## 4. Mascot Color Palette

### Luvy Plush Colors

| Token | Hex | Usage |
|---|---:|---|
| `plush-cream` | `#FFF1D8` | Main bunny fur |
| `warm-fur-shadow` | `#F6D7AE` | Fur depth and soft shadows |
| `inner-ear-peach` | `#FFA889` | Bunny inner ears and paw pads |
| `blush-peach` | `#FFB7A0` | Cheeks, soft emotional warmth |
| `nose-coral` | `#FF8A78` | Nose and tiny facial accents |
| `eye-brown` | `#3B2417` | Eyes |
| `eye-highlight` | `#FFFFFF` | Eye shine |

### Luvy Accessory Colors

| Token | Hex | Usage |
|---|---:|---|
| `heart-pouch-purple` | `#9B7AE6` | Voice-note heart pouch |
| `heart-pouch-deep` | `#7654C9` | Pouch shadows and stitching |
| `headphone-blue` | `#6AA3F5` | Headphones |
| `headphone-deep-blue` | `#3F72CC` | Headphone shadows |
| `soundwave-white` | `#FFFFFF` | Waveform marks |
| `bib-coral` | `#FF8A70` | Race bib top strip |
| `bib-paper` | `#FFF8F0` | Race bib base |
| `charm-blue` | `#4F8FE8` | Small audio charm |
| `strap-purple` | `#8F69D8` | Cross-body strap |

---

## 5. Brand Color Palette

### Light Mode

| Token | Hex | Usage |
|---|---:|---|
| `background-cream` | `#FFF7EF` | Main app background |
| `surface-white` | `#FFFFFF` | Modals and inputs |
| `surface-peach` | `#FFE1CC` | Mascot moments and emotional accents |
| `surface-lavender` | `#EFE8FF` | Mascot staging, message unlock areas |
| `text-primary` | `#281E32` | Main headings and body text |
| `text-secondary` | `#665B70` | Descriptions and helper text |
| `text-muted` | `#9A90A6` | Metadata, placeholders |
| `brand-purple` | `#7B55E7` | Primary CTA, active states |
| `brand-purple-dark` | `#5B35C8` | Pressed CTA, strong accent |
| `pacer-blue` | `#5F9CF6` | Audio, headphones, route dots |
| `cheer-coral` | `#FF786B` | Hearts, emotional accents |
| `sunrise-peach` | `#FFB985` | Warm highlights |
| `heart-red` | `#FF525F` | Alerts, unread message pings |

### Dark Mode

| Token | Hex | Usage |
|---|---:|---|
| `dark-background` | `#12121C` | Main dark background |
| `dark-surface` | `#1C1B2B` | Navigation, modals, and controls |
| `dark-surface-raised` | `#27253A` | Active controls and overlays |
| `dark-warm-panel` | `#2B211F` | Warm mascot staging accents |
| `dark-border` | `#38364E` | Dividers and control borders |
| `dark-text-primary` | `#FFF4E8` | Main text |
| `dark-text-secondary` | `#DAD5EA` | Body text |
| `dark-text-muted` | `#9D97B3` | Metadata |
| `dark-brand-purple` | `#8B6BFF` | Primary CTA |
| `dark-brand-purple-pressed` | `#6E52E8` | Pressed state |
| `dark-pacer-blue` | `#83B3FF` | Audio highlights |
| `dark-cheer-coral` | `#FF927F` | Hearts and warmth |
| `dark-heart-red` | `#FF5A65` | Alerts |

---

## 6. Gradient System

### Primary CTA Gradient

Use for main actions like “Record a message”, “Send love”, or “Play messages”.

```css
linear-gradient(135deg, #7B55E7 0%, #5F9CF6 100%)
````

### Love Moment Gradient

Use for emotional moments, onboarding, and message unlock screens.

```css
linear-gradient(135deg, #FFF7EF 0%, #FFE1CC 48%, #EFE8FF 100%)
```

### Coral Heart Gradient

Use for hearts, pings, message badges, and celebration details.

```css
linear-gradient(135deg, #FF786B 0%, #FFB985 100%)
```

### Dark Race-Day Glow

Use in dark mode hero sections.

```css
linear-gradient(135deg, #12121C 0%, #1C1B2B 50%, #2B211F 100%)
```

---

## 7. Typography

### Primary font

Use **Space Grotesk**.

```ts
import { Space_Grotesk } from "next/font/google";
```

### Type style

Space Grotesk gives the product a modern and memorable feel. Because the mascot is very soft and plush, the typography can be slightly more structured without feeling cold.

### Headings

* Font: Space Grotesk
* Weight: `700`
* Mobile hero size: `40–52px`
* Section heading size: `28–36px`
* Tracking: `-0.03em`
* Color light: `#281E32`
* Color dark: `#FFF4E8`

### Body

* Weight: `400–500`
* Size: `17–22px`
* Line height: `1.4–1.55`
* Color light: `#665B70`
* Color dark: `#DAD5EA`

### Buttons

* Weight: `700`
* Size: `18–22px`
* Primary text color: `#FFFFFF`

### Metadata

Use for timers, message counts, upload status, and race info.

* Weight: `500–600`
* Use tabular numbers
* Color light: `#9A90A6`
* Color dark: `#9D97B3`

---

## 8. Icon Style

Icons should feel rounded, soft, and friendly.

### Icon principles

* Rounded corners
* No sharp edges
* Filled or semi-filled style
* Simple shapes
* Soft emotional feel
* Works at `16px`, `24px`, and `32px`

### Core icons

* Heart
* Microphone
* Play
* Pause
* Waveform
* Headphones
* Share
* Lock
* Gift
* Route dot
* Runner
* Calendar
* Message bubble
* Race bib

### Icon colors

* Primary: `#7B55E7`
* Audio: `#5F9CF6`
* Love: `#FF786B`
* Muted: `#9A90A6`
* Dark mode muted: `#9D97B3`

---

## 9. UI Shape Language

### Border radius

| Element       |    Radius |
| ------------- | --------: |
| Small chips   |   `999px` |
| Buttons       |   `999px` |
| Audio players | `28–36px` |
| App icon      |  `28–30%` |
| Bottom nav    | `32–40px` |

### Shadows

Use shadows sparingly and only when an element is intentionally floating above the page, such as bottom navigation or modal overlays. Do not use shadows to turn normal page sections into boxed cards.

```css
box-shadow: 0 20px 60px rgba(91, 53, 200, 0.12);
```

Avoid default section shadows.

### Page structure

Do not wrap headings, intro copy, forms, empty states, or ordinary content groups in bordered background cards. Prefer direct layout on the app background with clear type hierarchy, compact spacing, and action buttons.

Use boxes only when the shape is the interaction itself, such as inputs, buttons, audio controls, radio options, popovers, dialogs, and bottom navigation.

---

## 10. Key Product Screens

### App Icon

Luvy’s face centered on a soft purple or peach background.

Must include:

* Bunny face
* Blue headphones
* Kind eyes
* Tiny smile
* Optional heart pouch visible at bottom
* Simple silhouette readable at small sizes

Recommended background:

```css
linear-gradient(135deg, #FFE1CC 0%, #EFE8FF 100%)
```

### Onboarding

Luvy appears full-body, holding the heart pouch.

Screen mood:

* Warm
* Emotional
* Simple
* Clear

Example headline:

**Love runs with you.**

Example copy:

Record voice notes from friends and family. Luvy delivers them to your runner on race day.

Primary CTA:

**Start sending love**

### Public Runner Page

Main action should be obvious.

Priority:

1. Runner name
2. Race name and date
3. Luvy illustration
4. “Record a message” CTA
5. Supporter message count
6. Share link

Example CTA:

**Record a voice note**

### Recording Screen

Should feel safe and low-pressure.

Use:

* Big rounded microphone button
* Soft waveform
* Luvy listening nearby
* Simple recording timer
* Friendly instruction text

Example copy:

**Say something they’ll need to hear mid-race.**

### Message Received Moment

When a runner receives a message, Luvy should appear with:

* Eyes closed or soft happy expression
* Headphones on
* Heart pouch glowing
* Rounded sound waves around the character
* Tiny hearts floating nearby

Mood:

* Emotional
* Quietly powerful
* Not loud or gamified

### Empty State

Use Luvy sitting with the heart pouch open.

Example copy:

**No messages yet.**

Secondary copy:

Share your page so your people can send you love before race day.

CTA:

**Invite supporters**

### Post-Race Memory Page

Luvy appears relaxed and proud.

Use:

* Keepsake-style message lists
* Race date
* Total messages heard
* Favorite message highlight
* Download/share memory option

Example headline:

**You carried their voices to the finish.**

---

## 11. Mascot Asset List

Create the mascot assets as separate images on clean white backgrounds.

### Required mascot poses

1. **Standing hero Luvy**

   * Full-body
   * Holding heart pouch
   * Looking forward
   * Used for onboarding and marketing

2. **App icon Luvy**

   * Close-up face
   * Headphones visible
   * Heart pouch partially visible
   * Used for app icon and avatar

3. **Running courier Luvy**

   * Small gentle running pose
   * Heart pouch bouncing softly
   * Used for loading states and race-day screens

4. **Message received Luvy**

   * Sitting
   * Eyes closed
   * Holding heart pouch
   * Sound waves and hearts around
   * Used during playback and unlock moments

5. **Empty-state Luvy**

   * Sitting calmly
   * Heart pouch open or held
   * Gentle hopeful expression
   * Used when no messages have arrived yet

6. **Celebration Luvy**

   * Happy expression
   * Tiny confetti/hearts
   * Used after sending a message or finishing a race

7. **Listening Luvy**

   * Head tilted
   * Headphones on
   * Calm expression
   * Used while audio plays

8. **Invite Luvy**

   * Waving
   * Heart pouch visible
   * Used for sharing and inviting supporters

### Required prop assets

1. Heart-shaped voice-note pouch
2. Blue sound-wave charm
3. Race bib
4. Tiny headphones
5. Heart message bubble
6. Rounded waveform
7. Finish-line ribbon
8. Supporter avatar heart icon
9. Mini route dot
10. Audio play button

---

## 12. Image Generation Prompts

### Main mascot prompt

```txt
Soft 3D plush bunny mascot named Luvy for a mobile app called Luvy, domain Luvy.run, tiny race-day love courier, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, gentle tiny smile, rounded body, wearing soft pacer-blue headphones, carrying a love-relay-purple heart-shaped pouch with a white audio waveform symbol, small race bib, tiny blue sound-wave charm, soft paw pads, emotionally supportive and playful, comforting not competitive, simple silhouette, mobile app icon friendly, visible plush fibers, soft studio lighting, clean white background, high-quality 3D character render, warm pastel colors, no text, no watermark, no complex accessories
```

### App icon prompt

```txt
Close-up app icon of Luvy, a soft 3D plush bunny mascot for the mobile app Luvy, domain Luvy.run, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, gentle smile, pacer-blue headphones, love-relay-purple heart pouch partially visible at bottom with white audio waveform, centered composition, rounded square icon framing, soft peach and lavender gradient background, simple readable silhouette, plush fibers, warm soft lighting, high-quality mobile app icon, no text, no watermark
```

### Message moment prompt

```txt
Soft 3D plush bunny mascot Luvy sitting peacefully with eyes closed, wearing pacer-blue headphones, hugging a love-relay-purple heart-shaped voice-note pouch with a white waveform symbol, warm cream fluffy fur, peach inner ears, tiny coral nose, glowing soft heart-shaped sound waves around the mascot, emotional race-day encouragement mood, comforting and warm, clean white background, visible plush texture, mobile app illustration style, no text, no watermark
```

### Empty state prompt

```txt
Soft 3D plush bunny mascot Luvy sitting on a clean white background, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, soft hopeful smile, wearing pacer-blue headphones, holding a love-relay-purple heart-shaped voice-note pouch, small race bib and blue sound-wave charm, lots of empty space above for UI text, comforting mobile app empty-state illustration, plush texture, soft diffused lighting, no text, no watermark
```

### Running courier prompt

```txt
Soft 3D plush bunny mascot Luvy in a gentle running pose, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, small smile, pacer-blue headphones, love-relay-purple heart-shaped pouch bouncing softly across the body, tiny race bib, small blue sound-wave charm, plush paw pads, supportive race-day love courier energy, playful but not competitive, clean white background, visible plush fibers, soft studio lighting, mobile app illustration style, no text, no watermark
```

### Celebration prompt

```txt
Soft 3D plush bunny mascot Luvy celebrating warmly, happy expression, tiny hearts and soft confetti around, warm cream fluffy fur, peach inner ears, big kind brown eyes, pacer-blue headphones, love-relay-purple heart-shaped voice-note pouch, small race bib, blue sound-wave charm, plush texture, comforting and joyful race-day mobile app mascot, clean white background, soft lighting, no text, no watermark
```

### Listening prompt

```txt
Soft 3D plush bunny mascot Luvy listening calmly with a slight head tilt, wearing pacer-blue headphones, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, gentle smile, holding a love-relay-purple heart-shaped pouch with white waveform, subtle heart-shaped audio waves floating nearby, emotional support companion, clean white background, plush texture, soft mobile app illustration style, no text, no watermark
```

### Invite prompt

```txt
Soft 3D plush bunny mascot Luvy waving kindly, warm cream fluffy fur, peach inner ears, big kind brown eyes, tiny coral nose, gentle smile, pacer-blue headphones, love-relay-purple heart-shaped voice-note pouch, small race bib, tiny blue sound-wave charm, friendly invitation pose for a mobile app, clean white background, visible plush fibers, soft lighting, no text, no watermark
```

---

## 13. Brand Motifs

### Main motifs

* Heart-shaped voice notes
* Rounded sound waves
* Soft message bubbles
* Tiny race bibs
* Headphones
* Route dots
* Finish-line ribbons
* Warm sunrise glow
* Floating hearts
* Plush stitches

### Pattern system

Create a subtle repeating pattern using:

* Tiny hearts
* Waveforms
* Music notes
* Route dots
* Message bubbles
* Mini Luvy paw marks

Pattern colors:

* `#FF786B`
* `#7B55E7`
* `#5F9CF6`
* `#FFB985`
* `#EFE8FF`

Use at very low opacity on onboarding backgrounds and celebration states.

---

## 14. Motion Direction

### Luvy animations

* Gentle bounce on loading
* Ear wiggle on message sent
* Heart pouch glow when audio unlocks
* Small wave when inviting supporters
* Breathing idle animation
* Tiny hop when a message is received
* Headphones pulse softly during playback

### UI motion

* Audio rows float in softly
* Waveforms draw from left to right
* Hearts drift upward slowly
* CTAs compress gently on press
* Mascot scales slightly on success
* Message unlock should feel magical, not explosive

---

## 15. Design Rules

### Do

* Make everything feel soft and touchable
* Use Luvy as emotional continuity
* Keep UI spacious and mobile-first
* Keep content open and space-efficient; avoid boxed sections
* Treat voice notes like precious gifts
* Make race day feel supported, not tracked
* Keep mascot accessories simple and iconic
* Use purple for action, coral for love, blue for audio

### Don’t

* Don’t make it look like a fitness tracker
* Don’t overuse medals, speed, pace, or metrics
* Don’t make Luvy look childish or babyish
* Don’t use harsh neon colors
* Don’t make the audio UI too technical
* Don’t clutter the mascot with props
* Don’t use sharp corners or aggressive shadows
* Don’t make the app feel clinical, robotic, or productivity-like
* Don’t wrap titles, forms, empty states, or lists in bordered background cards

---

## 16. Implementation Tokens

```ts
export const luvyColors = {
  light: {
    backgroundCream: "#FFF7EF",
    surfaceWhite: "#FFFFFF",
    surfacePeach: "#FFE1CC",
    surfaceLavender: "#EFE8FF",
    textPrimary: "#281E32",
    textSecondary: "#665B70",
    textMuted: "#9A90A6",
    brandPurple: "#7B55E7",
    brandPurpleDark: "#5B35C8",
    pacerBlue: "#5F9CF6",
    cheerCoral: "#FF786B",
    sunrisePeach: "#FFB985",
    heartRed: "#FF525F",
  },
  dark: {
    background: "#12121C",
    surface: "#1C1B2B",
    surfaceRaised: "#27253A",
    warmPanel: "#2B211F",
    border: "#38364E",
    textPrimary: "#FFF4E8",
    textSecondary: "#DAD5EA",
    textMuted: "#9D97B3",
    brandPurple: "#8B6BFF",
    brandPurplePressed: "#6E52E8",
    pacerBlue: "#83B3FF",
    cheerCoral: "#FF927F",
    heartRed: "#FF5A65",
  },
  mascot: {
    plushCream: "#FFF1D8",
    warmFurShadow: "#F6D7AE",
    innerEarPeach: "#FFA889",
    blushPeach: "#FFB7A0",
    noseCoral: "#FF8A78",
    eyeBrown: "#3B2417",
    eyeHighlight: "#FFFFFF",
    heartPouchPurple: "#9B7AE6",
    heartPouchDeep: "#7654C9",
    headphoneBlue: "#6AA3F5",
    headphoneDeepBlue: "#3F72CC",
    soundwaveWhite: "#FFFFFF",
    bibCoral: "#FF8A70",
    bibPaper: "#FFF8F0",
    charmBlue: "#4F8FE8",
    strapPurple: "#8F69D8",
  },
};
```
