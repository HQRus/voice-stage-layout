// Catalog of Voice Stage item types the AI can compose with.
// Each entry tells the model: what the type is for, what `content` holds,
// and which `meta` fields its renderer in CanvasItem.tsx actually reads.
// Keep this in sync with src/components/CanvasItem.tsx.

export const ITEM_CATALOG = `STAGE ITEM TYPES — pick the one that fits the data. Every item has a
rendered surface (card background, typography, icons, layout). Do NOT default
to "text" — that renders as bare text on a transparent background and looks
broken. Use a specific type whenever the data even loosely matches.

Each frame: { id, type, content, x, y, width, height, rotation, zIndex,
focusWeight, layoutRole, meta }. \`content\` is the primary string. \`meta\`
is an object whose fields are described per type below.

— GENERIC —
- text        bare large text on transparent bg. Last resort.
- quote       card. content = the quote.
- document    card with title + body. meta: { title }
- logo        card with wordmark. meta: { color? }
- image       solid color/gradient placeholder. content = CSS color or gradient.
- video       video card with play button. meta: { title?, duration? }

— AGENT SURFACES —
- concept     idea card. meta: { title }
- palette     color strip. meta: { swatches: string[] (hex) }. content = name.
- typeSample  alphabet specimen. meta: { display } (font name).
- audio       audio player. meta: { title, artist?, duration? }
- storyboardFrame  film frame. meta: { frame: number, caption? }. content = bg color.
- calendarSlot     booking slot. meta: { day, duration, status: "open"|"booked", title?, with? }
- email       email card. meta: { to, subject }. content = body.
- section     thin label/divider. content = label.

— ICONIC WIDGETS (use these for structured data!) —
- weather     content = big temp like "23°". meta: { location, condition, high?, low? }
- stock       content = ticker. meta: { name, price, change, changePct, up: boolean, spark: number[] }
- map         meta: { place, lat?, lon? }
- link        link preview. meta: { url, title, source? }
- metric      huge KPI number. content = number. meta: { label, delta?, up? }
- chart       meta: { kind: "bar"|"line", data: number[], labels?: string[] }
- code        meta: { language }. content = code.
- checklist   meta: { items: { text, done }[] }
- product     meta: { brand, price }. content = product name.
- flight      meta: { from, to, depart, arrive, airline?, flight? }
- poll        meta: { options: { label, pct }[] }

— VIDEO CREATION —
- script, shotList, reel, adVariant, caption, thumbnail, timeline,
  subtitleStrip, gallery, transition

RULES
- For weather data → use \`weather\` per day, or one big \`weather\` + small
  \`metric\` cards for high/low/humidity/wind.
- For lists of numbers → \`metric\` or \`chart\`.
- For prose → \`document\` (always supply meta.title) or \`quote\`.
- For a single primary number/value, prefer \`metric\` or \`weather\` over \`text\`.
- ALWAYS populate the relevant \`meta\` fields. A weather item without
  \`meta.location\` and \`meta.condition\` will look empty.
- \`content\` must be a string. Put structured data in \`meta\`.`;
