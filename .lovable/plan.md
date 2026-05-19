## Goal

Re-tune the layout testing utility so it reflects how a real AI agent (Russ) would present output during a multi-step creative session, not a random pile of media. The stage should fluidly move between recognisable "agent surfaces" — concept comparisons, brand boards, hero reveals, mascot sets, storyboards, media players, presentation kits, calendar pickers, action confirmations — all driven by the same layout engine and JSON contract.

## Mapping the demo flow to layouts

| Demo step | Stage state | New layout intent |
| --- | --- | --- |
| 3 brainstorm concepts | 3 equal cards w/ title + blurb | `concepts` (3-up compare) |
| Brand board | Name, tagline, palette, type, tone block | `brandBoard` |
| 3 visual directions | Overlapping floating images | `directions` (existing moodboard, tuned) |
| Pick one / premium hero | Big hero + small caption | `hero` (already exists, refined) |
| Mascot variations (sticker, poster, avatar) | Playful tiles of different aspect ratios | `mascotSet` |
| Storyboard | Horizontal numbered frames + captions | `storyboard` |
| Video ad | Centered video player w/ controls + title | `mediaPlayer` (video) |
| Music bed | Audio player card, waveform, transport | `mediaPlayer` (audio) |
| Launch kit presentation | Stacked sections, scrollable | `presentationKit` |
| Calendar slots | Day column with selectable time chips | `calendar` |
| Booked invite | Single confirmation card | `confirmation` |
| Sent email | Email preview card | `confirmation` (email variant) |
| Transcript | Chat bubble timeline | `transcript` |

## What I'll build

### 1. Coherent scenario presets (replaces "random mixed set")
Add a `scenarios` module with curated, related item sets that mirror the demo (cat-café flow + a couple more: product launch, travel itinerary). Each scenario is an ordered list of `{ intent, items }` states the user can step through with Prev/Next, so the stage always shows things that belong together.

Keep the "Add image / video / text / …" buttons for raw testing, but demote the random button — replace with a "Load scenario" picker.

### 2. New content item types
Extend `MediaItem` types with:
- `palette` — color swatches (array of hex)
- `audio` — title + duration + fake waveform
- `storyboardFrame` — frame number + still + caption
- `calendarSlot` — day + time + status
- `email` — to / subject / body preview
- `chatMessage` — speaker + text + timestamp

Each gets a dedicated renderer in `CanvasItem` so the same engine can compose them.

### 3. New layout intents in the engine
Add to `LayoutIntent` and implement in `layoutEngine.ts`:
- `concepts` — 3 equal cards, generous gutters, light tilt
- `brandBoard` — anchor name/tagline block, palette strip, type sample, tone notes laid out as a poster
- `mascotSet` — mixed-aspect tiles (square sticker, vertical poster, circular avatar) packed playfully
- `storyboard` — horizontal strip with numbered frames + captions under each
- `mediaPlayer` — single centered player (video or audio), optional caption beneath
- `presentationKit` — vertical scroll of grouped sections (brand → mascot → posters → video → links)
- `calendar` — left day header, vertical stack of time-slot pills
- `confirmation` — single centered card (calendar invite, sent email, etc.)
- `transcript` — left-aligned vertical chat-bubble column

Engine still infers intent when set to `auto`, now using item-type signals (e.g. any `storyboardFrame` → storyboard, any `calendarSlot` → calendar, all `concept` cards of count 3 → concepts).

### 4. Controls panel updates
- Replace "Mixed random set" with **Scenarios** dropdown (Cat Café Launch, Product Launch, Travel Plan) + **Prev / Next state** buttons.
- Keep Geometry sliders (overlap, radius, rotation) but cap rotation lower for "agent-output" mode since most agent surfaces should feel composed, not collaged.
- Add a small **State label** at the top of the panel showing which step of the scenario is active ("3 / 12 — Brand board").
- Keep raw "Add media" buttons under a collapsed **Manual test** section.

### 5. Stage polish to support real output
- `presentationKit` is the only intent that allows vertical scrolling — canvas gets an `overflow-y-auto` branch.
- Storyboard frames are numbered and connected by a hairline guide line so order reads instantly.
- Confirmation/email/calendar surfaces use the centered "single card" treatment with a soft backdrop dim of other potential items.

### 6. JSON contract still drives everything
The "AI layout JSON" panel keeps working — every new intent and item type is part of the same `PositionedItem` schema. Documented example JSONs for each new intent are added to the placeholder text and a tiny `examples` folder so the agent (or a real Russ backend) can target the same surface.

## Out of scope (for this pass)
- Real audio/video playback, real Google Calendar / Gmail calls — all surfaces use mocked content tuned to the demo.
- Drag-to-reorder items on the canvas.
- Saving scenarios to a database.

## Files I'll touch
- `src/lib/layoutEngine.ts` — new intents, inference rules, item types.
- `src/lib/sampleContent.ts` — new makers per type.
- `src/lib/scenarios.ts` *(new)* — Cat Café + 1–2 other ordered scenarios.
- `src/components/CanvasItem.tsx` — renderers for palette, audio, storyboard frame, calendar slot, email, chat message.
- `src/components/Canvas.tsx` — scroll branch for `presentationKit`, optional dim overlay for confirmation states.
- `src/components/ControlsPanel.tsx` — Scenarios picker, Prev/Next, state label, collapse Manual test.
- `src/routes/index.tsx` — wire scenario state machine.