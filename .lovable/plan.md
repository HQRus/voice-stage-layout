## Goal

Make all items chunky, simple, larger, fully sans-serif. Fix layout bugs on video/frame/concept/email. Remove brand and chat items. Simplify type sample.

## Global typography

- Strip every `font-serif-display` usage in `CanvasItem.tsx` (quote, document title, concept title, brandMark, palette, typeSample, email subject, weather temp, metric value, etc.) and replace with `font-display` (sans, tight tracking).
- Bump base sizes across items roughly +30–100% — chunkier headers, larger body. Tighten leading. Use `font-semibold`/`font-bold` for titles instead of relying on serif weight.
- Eyebrow uppercase labels: reduce visual noise — slightly larger but less tracking; some removed (see per-item).

## Per-item changes (CanvasItem.tsx)

**video**
- Bug: inner dark video div has `borderRadius` + a `captionH` reservation, but the outer motion wrapper also has `borderRadius` and `overflow: visible`, so the rounded video sits above a transparent caption strip that still casts the parent shadow → looks like a gap.
- Fix: when there is no caption, render a single full-bleed video div (no flex column, no inner radius reservation). When there IS a caption: make the caption float *outside* the rounded video (same pattern as new storyboardFrame fix), and set the outer wrapper `overflow: visible` only there. Ensure the shadow source is the video rectangle itself, not the wrapper — apply `boxShadow` to the inner video div and set wrapper `boxShadow: none` for video type (handled by passing a flag, or by moving shadow application into ItemContent for video/frame/section).

**quote**
- Remove `font-serif-display`, use `font-display font-semibold`. Drop the giant `"` ornament or keep small. Increase body font min/max (e.g. 28–80).

**document**
- Double body text size (`text-sm` → `text-lg`, leading relaxed).
- Title: switch to `font-display font-bold`, bump to `text-3xl`.
- Eyebrow stays small.

**concept**
- Remove the `tag` eyebrow ("IDEA") entirely.
- Title `text-2xl` → `text-5xl font-display font-bold`.
- Body `text-sm` → `text-lg`.
- Keep "PICK THIS →" footer at current small size.

**brandMark**
- Remove case entirely from `ItemContent` switch.
- Remove from `ItemType` union in `layoutEngine.ts`.
- Remove `make.brand` from `sampleContent.ts` and any `makeItem("brandMark")` branch.
- Remove from `ControlsPanel` add-item list.
- Update `scenarios.ts` to drop any `make.brand(...)` calls (replace with another existing item or omit).

**typeSample** — redesign
- Drop the giant "Aa" hero. Instead, render the full alphabet `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz` (or two lines) at a large size, then the font name beneath in small caps.
- Show 1 sample per item (display font). Drop the body/sample second block — simpler.

**storyboardFrame**
- Same shadow/overflow issue as video: outer wrapper has shadow + visible overflow, inner image is shorter → shadow appears below image. Fix by moving the box-shadow to the inner image div and clearing wrapper shadow for this type.
- Frame number badge: increase padding (`px-3 py-1`), slightly larger text (`text-xs`), to balance the larger corner radius of the parent.
- Caption: render *outside/below* the image with margin-top (it already is below — confirm it sits clearly outside, not touching the rounded corner). Use `text-sm` and `text-foreground/70`.

**email**
- Bump body text (`text-sm` → `text-base`/`text-lg`, leading-relaxed).
- Subject: `font-serif-display text-xl` → `font-display font-bold text-2xl`.
- "Email · sent" / "to …" / "Delivered" footer: shrink tracking & size — "DELIVERED" currently looks oversized due to uppercase + wide tracking. Reduce to `text-[10px] tracking-[0.14em]` and lowercase the label or drop the uppercase.

**chatMessage**
- Remove case from switch.
- Remove from `ItemType` union, `makeItem`, `make.chat`, ControlsPanel list, and any scenario references.

## Shadow handling note

For `video` and `storyboardFrame`, the outer wrapper currently sets `overflow: visible` + `boxShadow`. After the fix the shadow should follow the visible rectangle (the image/video), so:
- In `CanvasItem` outer wrapper, set `boxShadow: none` when `item.type` ∈ {video, storyboardFrame, section}.
- Apply the computed `boxShadow` inside `ItemContent` on the actual image/video div for those two types (pass `boxShadow` as a prop to `ItemContent`).

## Files touched

- `src/components/CanvasItem.tsx` — all type/render changes, shadow refactor for video/frame.
- `src/lib/layoutEngine.ts` — drop `brandMark` and `chatMessage` from `ItemType`.
- `src/lib/sampleContent.ts` — remove brand/chat from `makeItem`, `make`, default sets.
- `src/lib/scenarios.ts` — replace any brand/chat usages.
- `src/components/ControlsPanel.tsx` — remove brand/chat from "add item" buttons.

No styles.css changes needed (font-display already defined as sans).
