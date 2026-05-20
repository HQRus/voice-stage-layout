// Generative layout engine
// ------------------------------------------------------------
// Pure, deterministic functions that take an item list + viewport
// and return absolute frames (x, y, width, height, rotation, zIndex).
//
// Designed for AI-agent output: each layout maps to a recognisable
// "surface" the agent might emit (concepts, brand board, storyboard,
// media player, calendar, etc.). The same renderer can also be driven
// directly by AI-generated layout JSON.

export type ItemType =
  // generic media
  | "image"
  | "video"
  | "text"
  | "document"
  | "logo"
  | "quote"
  // agent surfaces
  | "concept"
  | "palette"
  | "typeSample"
  | "audio"
  | "storyboardFrame"
  | "calendarSlot"
  | "email"
  | "section"
  // iconic AI widgets
  | "weather"
  | "stock"
  | "map"
  | "link"
  | "metric"
  | "chart"
  | "code"
  | "checklist"
  | "product"
  | "flight"
  | "poll";

export type LayoutIntent =
  | "auto"
  // generic
  | "equal"
  | "hero"
  | "editorial"
  | "moodboard"
  | "logos"
  | "document"
  | "presentation"
  // agent surfaces
  | "concepts"
  | "brandBoard"
  | "directions"
  | "mascotSet"
  | "storyboard"
  | "mediaPlayer"
  | "presentationKit"
  | "calendar"
  | "confirmation"
  | "transcript";

export type LayoutRole =
  | "hero"
  | "supporting"
  | "equal"
  | "background"
  | "document";

export interface MediaItem {
  id: string;
  type: ItemType;
  content: string;
  meta?: Record<string, unknown>;
  focusWeight?: number;
}

export interface PositionedItem extends MediaItem {
  focusWeight: number;
  layoutRole: LayoutRole;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface LayoutOptions {
  intent: LayoutIntent;
  equalSpacing?: boolean;
  overlapAmount?: number;
  rotationAmount?: number;
}

export interface LayoutResult {
  frames: PositionedItem[];
  contentHeight: number; // can exceed viewport for scrollable intents
  scrollable: boolean;
}

// ------------------------------------------------------------
// Intent inference — biased toward agent surfaces
// ------------------------------------------------------------
export function inferIntent(items: MediaItem[]): LayoutIntent {
  if (items.length === 0) return "auto";
  const has = (t: ItemType) => items.some((i) => i.type === t);
  const all = (t: ItemType) => items.every((i) => i.type === t);
  const count = (t: ItemType) => items.filter((i) => i.type === t).length;

  if (has("storyboardFrame")) return "storyboard";
  if (has("calendarSlot")) return "calendar";
  if (has("chatMessage")) return "transcript";
  if (has("email") && items.length === 1) return "confirmation";
  if (has("audio") && items.length === 1) return "mediaPlayer";
  if (has("video") && items.length === 1) return "mediaPlayer";
  if (has("section")) return "presentationKit";
  if (has("brandMark") || (has("palette") && has("typeSample"))) return "brandBoard";
  if (all("concept") && items.length === 3) return "concepts";

  // iconic widgets — single → centered card, multi → moodboard
  const widgetTypes: ItemType[] = ["weather","stock","map","link","metric","chart","code","checklist","product","flight","poll"];
  const isWidget = (t: ItemType) => widgetTypes.includes(t);
  if (items.length === 1 && isWidget(items[0].type)) return "confirmation";
  if (items.every((i) => isWidget(i.type))) return "moodboard";

  const logos = count("logo");
  const docs = count("document");
  const images = count("image") + count("video");
  const texts = count("text") + count("quote");

  if (logos >= 2 && logos === items.length) return "logos";
  if (docs >= 1 && items.length <= 2) return "document";
  if (items.length === 1) return "hero";
  if (images === 1 && texts >= 1 && items.length <= 3) return "editorial";
  if (items.length >= 5) return "moodboard";
  if (images >= 1 && texts === 0) return "hero";
  return "moodboard";
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const rand = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const seedFromId = (id: string) =>
  id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

const tilt = (id: string, max = 3.5) => (rand(seedFromId(id)) * 2 - 1) * max;

const baseWeight = (t: ItemType): number => {
  switch (t) {
    case "image":
    case "video":
      return 1.0;
    case "quote":
      return 0.85;
    case "document":
      return 0.9;
    case "logo":
      return 0.7;
    case "text":
      return 0.6;
    default:
      return 0.7;
  }
};

function stage(viewport: Viewport) {
  const padX = Math.min(160, viewport.width * 0.08);
  const padY = Math.min(120, viewport.height * 0.1);
  return {
    x: padX,
    y: padY,
    w: viewport.width - padX * 2,
    h: viewport.height - padY * 2,
  };
}

// ------------------------------------------------------------
// Generic intents (kept for raw testing)
// ------------------------------------------------------------
function heroLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const overlap = opts.overlapAmount ?? 0;
  if (items.length === 1) {
    const it = items[0];
    const isText = it.type === "text" || it.type === "quote";
    const w = isText ? s.w * 0.7 : Math.min(s.w * 0.6, s.h * 0.95);
    const h = isText ? s.h * 0.55 : Math.min(s.h * 0.85, w * 1.1);
    return [
      {
        ...it,
        focusWeight: 1,
        layoutRole: "hero",
        x: s.x + (s.w - w) / 2,
        y: s.y + (s.h - h) / 2,
        width: w,
        height: h,
        rotation: tilt(it.id, opts.rotationAmount ?? 2),
        zIndex: 10,
      },
    ];
  }
  const [hero, ...rest] = [...items].sort(
    (a, b) => baseWeight(b.type) - baseWeight(a.type),
  );
  const heroW = s.w * 0.55;
  const heroH = s.h * 0.8;
  const heroFrame: PositionedItem = {
    ...hero,
    focusWeight: 1,
    layoutRole: "hero",
    x: s.x,
    y: s.y + (s.h - heroH) / 2,
    width: heroW,
    height: heroH,
    rotation: tilt(hero.id, opts.rotationAmount ?? 2),
    zIndex: 10,
  };
  const colX = s.x + heroW + s.w * 0.04 - overlap;
  const colW = s.w - heroW - s.w * 0.04 + overlap;
  const itemH = (s.h - (rest.length - 1) * Math.max(4, 24 - overlap)) / Math.max(rest.length, 1);
  const support = rest.map<PositionedItem>((it, i) => ({
    ...it,
    focusWeight: 0.6,
    layoutRole: "supporting",
    x: colX,
    y: s.y + i * (itemH + Math.max(4, 24 - overlap)),
    width: colW,
    height: itemH,
    rotation: tilt(it.id, opts.rotationAmount ?? 2.5),
    zIndex: 5 - i,
  }));
  return [heroFrame, ...support].sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function equalLayout(
  items: MediaItem[],
  v: Viewport,
  opts: LayoutOptions & { square?: boolean } = { intent: "auto" },
): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const cols = Math.ceil(Math.sqrt(n * (s.w / s.h)));
  const rows = Math.ceil(n / cols);
  const gap = Math.max(0, 28 - (opts.overlapAmount ?? 0));
  const cellW = (s.w - gap * (cols - 1)) / cols;
  const cellH = (s.h - gap * (rows - 1)) / rows;
  const side = opts.square ? Math.min(cellW, cellH) : null;
  return items.map<PositionedItem>((it, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const w = side ?? cellW;
    const h = side ?? cellH;
    return {
      ...it,
      focusWeight: 0.5,
      layoutRole: "equal",
      x: s.x + c * (cellW + gap) + (cellW - w) / 2,
      y: s.y + r * (cellH + gap) + (cellH - h) / 2,
      width: w,
      height: h,
      rotation: 0,
      zIndex: 1,
    };
  });
}

function editorialLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const overlap = opts.overlapAmount ?? 0;
  const visual = items.find((i) => i.type === "image" || i.type === "video");
  const others = items.filter((i) => i !== visual);
  if (!visual) return moodboardLayout(items, v, opts);
  const heroW = s.w * 0.58;
  const heroH = s.h * 0.85;
  const frames: PositionedItem[] = [
    {
      ...visual,
      focusWeight: 1,
      layoutRole: "hero",
      x: s.x,
      y: s.y + (s.h - heroH) / 2,
      width: heroW,
      height: heroH,
      rotation: tilt(visual.id, opts.rotationAmount ?? 1.5),
      zIndex: 8,
    },
  ];
  const colX = s.x + heroW + s.w * 0.05 - overlap;
  const colW = s.w - heroW - s.w * 0.05 + overlap;
  others.forEach((it, i) => {
    const h = it.type === "document" ? s.h * 0.7 : s.h * 0.35;
    frames.push({
      ...it,
      focusWeight: 0.7,
      layoutRole: "supporting",
      x: colX,
      y: s.y + i * (h + Math.max(4, 24 - overlap)) + 20,
      width: colW,
      height: h,
      rotation: tilt(it.id, opts.rotationAmount ?? 2),
      zIndex: 5 - i,
    });
  });
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function moodboardLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const overlap = opts.overlapAmount ?? 0;
  const ordered = items
    .map((it, i) => ({ it, i, w: baseWeight(it.type) + rand(seedFromId(it.id)) * 0.2 }))
    .sort((a, b) => b.w - a.w);

  const cols = n <= 2 ? n : n <= 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const gap = Math.max(0, 32 - overlap);
  const cellW = (s.w - gap * (cols - 1)) / cols;
  const cellH = (s.h - gap * (rows - 1)) / rows;

  const frames: PositionedItem[] = [];
  ordered.forEach(({ it, w: weight }, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    const scale = 0.82 + Math.min(weight, 1.2) * 0.18 + rand(seedFromId(it.id) + 7) * 0.1;
    const w = cellW * Math.min(scale, 1.05);
    const h = cellH * Math.min(scale, 1.05);
    const jitterX = (rand(seedFromId(it.id) + 11) - 0.5) * gap * 0.6;
    const jitterY = (rand(seedFromId(it.id) + 13) - 0.5) * gap * 0.6;
    frames.push({
      ...it,
      focusWeight: weight,
      layoutRole: idx === 0 ? "hero" : "supporting",
      x: s.x + c * (cellW + gap) + (cellW - w) / 2 + jitterX,
      y: s.y + r * (cellH + gap) + (cellH - h) / 2 + jitterY,
      width: w,
      height: h,
      rotation: tilt(it.id, opts.rotationAmount ?? 3.5),
      zIndex: Math.round(weight * 10),
    });
  });
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function documentLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const overlap = opts.overlapAmount ?? 0;
  const doc = items.find((i) => i.type === "document") ?? items[0];
  const others = items.filter((i) => i !== doc);
  const docW = others.length > 0 ? s.w * 0.6 : Math.min(s.w * 0.55, 720);
  const docH = s.h * 0.92;
  const frames: PositionedItem[] = [
    {
      ...doc,
      focusWeight: 1,
      layoutRole: "document",
      x: s.x + (others.length > 0 ? 0 : (s.w - docW) / 2),
      y: s.y + (s.h - docH) / 2,
      width: docW,
      height: docH,
      rotation: tilt(doc.id, opts.rotationAmount ?? 1.2),
      zIndex: 10,
    },
  ];
  const colX = s.x + docW + s.w * 0.04 - overlap;
  const colW = s.w - docW - s.w * 0.04 + overlap;
  others.forEach((it, i) => {
    const h = (s.h - (others.length - 1) * Math.max(4, 24 - overlap)) / Math.max(others.length, 1);
    frames.push({
      ...it,
      focusWeight: 0.6,
      layoutRole: "supporting",
      x: colX,
      y: s.y + i * (h + Math.max(4, 24 - overlap)),
      width: colW,
      height: h,
      rotation: tilt(it.id, opts.rotationAmount ?? 2),
      zIndex: 5 - i,
    });
  });
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function presentationLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const overlap = opts.overlapAmount ?? 0;
  if (items.length <= 1) return heroLayout(items, v, opts);
  const [first, ...rest] = items;
  const titleH = s.h * 0.35;
  const frames: PositionedItem[] = [
    {
      ...first,
      focusWeight: 1,
      layoutRole: "hero",
      x: s.x + s.w * 0.1,
      y: s.y,
      width: s.w * 0.8,
      height: titleH,
      rotation: 0,
      zIndex: 10,
    },
  ];
  const restY = s.y + titleH + 32;
  const restH = s.h - titleH - 32;
  const cols = rest.length;
  const gap = Math.max(0, 24 - overlap);
  const cw = (s.w - gap * (cols - 1)) / cols;
  rest.forEach((it, i) => {
    frames.push({
      ...it,
      focusWeight: 0.6,
      layoutRole: "supporting",
      x: s.x + i * (cw + gap),
      y: restY,
      width: cw,
      height: restH,
      rotation: tilt(it.id, opts.rotationAmount ?? 1.5),
      zIndex: 5,
    });
  });
  return frames;
}

// ------------------------------------------------------------
// Agent-surface intents
// ------------------------------------------------------------

// 3 brainstorm concept cards
function conceptsLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const gap = Math.max(16, 56 - (opts.overlapAmount ?? 0));
  const cw = (s.w - gap * (n - 1)) / n;
  const ch = Math.min(s.h * 0.78, cw * 1.25);
  return items.map((it, i) => ({
    ...it,
    focusWeight: 0.8,
    layoutRole: "equal",
    x: s.x + i * (cw + gap),
    y: s.y + (s.h - ch) / 2,
    width: cw,
    height: ch,
    rotation: tilt(it.id, Math.min(opts.rotationAmount ?? 1.5, 2)),
    zIndex: 5,
  }));
}

// Brand board: name/tagline anchor, palette strip, type sample, tone notes
function brandBoardLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const find = (t: ItemType) => items.find((i) => i.type === t);
  const brand = find("brandMark");
  const palette = find("palette");
  const type = find("typeSample");
  const tone = items.find((i) => i.type === "text" || i.type === "quote");
  const frames: PositionedItem[] = [];
  const colGap = 24;
  const rowGap = 24;
  const leftW = s.w * 0.58;
  const rightW = s.w - leftW - colGap;

  if (brand) {
    frames.push({
      ...brand,
      focusWeight: 1,
      layoutRole: "hero",
      x: s.x,
      y: s.y,
      width: leftW,
      height: s.h * 0.55,
      rotation: 0,
      zIndex: 10,
    });
  }
  if (palette) {
    frames.push({
      ...palette,
      focusWeight: 0.7,
      layoutRole: "supporting",
      x: s.x,
      y: s.y + s.h * 0.55 + rowGap,
      width: leftW,
      height: s.h * 0.45 - rowGap,
      rotation: 0,
      zIndex: 8,
    });
  }
  if (type) {
    frames.push({
      ...type,
      focusWeight: 0.7,
      layoutRole: "supporting",
      x: s.x + leftW + colGap,
      y: s.y,
      width: rightW,
      height: s.h * 0.55,
      rotation: 0,
      zIndex: 8,
    });
  }
  if (tone) {
    frames.push({
      ...tone,
      focusWeight: 0.6,
      layoutRole: "supporting",
      x: s.x + leftW + colGap,
      y: s.y + s.h * 0.55 + rowGap,
      width: rightW,
      height: s.h * 0.45 - rowGap,
      rotation: 0,
      zIndex: 8,
    });
  }
  // Anything else falls back to moodboard slots in remaining space
  const placed = new Set(frames.map((f) => f.id));
  const leftovers = items.filter((i) => !placed.has(i.id));
  if (leftovers.length > 0) {
    return [...frames, ...moodboardLayout(leftovers, v, opts)];
  }
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

// 3 overlapping floating visual directions
function directionsLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const baseW = Math.min(s.w / Math.max(n, 1) * 1.25, s.h * 0.85);
  const baseH = baseW * 1.15;
  const step = (s.w - baseW) / Math.max(n - 1, 1);
  return items.map((it, i) => ({
    ...it,
    focusWeight: 0.85,
    layoutRole: i === Math.floor(n / 2) ? "hero" : "supporting",
    x: s.x + i * step,
    y: s.y + (s.h - baseH) / 2 + (i % 2 ? 16 : -16),
    width: baseW,
    height: baseH,
    rotation: tilt(it.id, opts.rotationAmount ?? 4),
    zIndex: i === Math.floor(n / 2) ? 10 : 5 + i,
  }));
}

// Mascot variations: mixed aspect tiles
function mascotSetLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  // Predefined aspects cycle: square, vertical, circle (square), wide
  const aspects = [1, 0.75, 1, 1.6];
  const labels: Array<"sticker" | "poster" | "avatar" | "banner"> = ["sticker", "poster", "avatar", "banner"];
  const n = items.length;
  const cols = Math.min(n, 4);
  const gap = Math.max(16, 32 - (opts.overlapAmount ?? 0));
  const cellW = (s.w - gap * (cols - 1)) / cols;
  return items.map((it, i) => {
    const aspect = aspects[i % aspects.length];
    const w = cellW;
    const h = Math.min(w / aspect, s.h * 0.8);
    const yOff = (i % 2 ? 24 : -24);
    return {
      ...it,
      focusWeight: 0.8,
      layoutRole: "equal",
      meta: { ...(it.meta ?? {}), variant: labels[i % labels.length] },
      x: s.x + i * (cellW + gap),
      y: s.y + (s.h - h) / 2 + yOff,
      width: w,
      height: h,
      rotation: tilt(it.id, opts.rotationAmount ?? 3),
      zIndex: 5 + i,
    };
  });
}

// Horizontal storyboard strip
function storyboardLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const gap = Math.max(12, 28 - (opts.overlapAmount ?? 0));
  const cw = (s.w - gap * (n - 1)) / n;
  const ch = Math.min(cw * 0.7 + 64, s.h * 0.78); // includes caption area
  return items.map((it, i) => ({
    ...it,
    focusWeight: 0.7,
    layoutRole: "equal",
    meta: { ...(it.meta ?? {}), frameIndex: i + 1, frameTotal: n },
    x: s.x + i * (cw + gap),
    y: s.y + (s.h - ch) / 2,
    width: cw,
    height: ch,
    rotation: 0,
    zIndex: 5,
  }));
}

// Single centered media player (video or audio)
function mediaPlayerLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const it = items[0];
  if (!it) return [];
  const isAudio = it.type === "audio";
  const w = isAudio ? Math.min(s.w * 0.55, 720) : Math.min(s.w * 0.72, s.h * 1.6);
  const h = isAudio ? 200 : Math.min(s.h * 0.85, w * 9 / 16);
  const main: PositionedItem = {
    ...it,
    focusWeight: 1,
    layoutRole: "hero",
    x: s.x + (s.w - w) / 2,
    y: s.y + (s.h - h) / 2,
    width: w,
    height: h,
    rotation: 0,
    zIndex: 10,
  };
  const captions = items.slice(1).filter((i) => i.type === "text" || i.type === "quote");
  const out: PositionedItem[] = [main];
  captions.forEach((c, i) => {
    out.push({
      ...c,
      focusWeight: 0.4,
      layoutRole: "supporting",
      x: s.x + (s.w - w) / 2,
      y: s.y + (s.h - h) / 2 + h + 24 + i * 56,
      width: w,
      height: 48,
      rotation: 0,
      zIndex: 5,
    });
  });
  return out;
}

// Calendar slot picker
function calendarLayout(items: MediaItem[], v: Viewport, opts: LayoutOptions): PositionedItem[] {
  const s = stage(v);
  const w = Math.min(s.w * 0.5, 520);
  const slotH = 72;
  const gap = 12;
  const totalH = items.length * slotH + (items.length - 1) * gap;
  const startY = s.y + Math.max(0, (s.h - totalH) / 2);
  const x = s.x + (s.w - w) / 2;
  return items.map((it, i) => ({
    ...it,
    focusWeight: 0.6,
    layoutRole: "equal",
    x,
    y: startY + i * (slotH + gap),
    width: w,
    height: slotH,
    rotation: 0,
    zIndex: 5,
  }));
}

// Centered confirmation card (calendar invite, sent email, etc.)
function confirmationLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
  const it = items[0];
  if (!it) return [];
  const w = Math.min(s.w * 0.55, 620);
  const h = Math.min(s.h * 0.7, 460);
  return [
    {
      ...it,
      focusWeight: 1,
      layoutRole: "hero",
      x: s.x + (s.w - w) / 2,
      y: s.y + (s.h - h) / 2,
      width: w,
      height: h,
      rotation: 0,
      zIndex: 10,
    },
  ];
}

// Chat transcript column
function transcriptLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
  const colW = Math.min(s.w * 0.7, 720);
  const x = s.x + (s.w - colW) / 2;
  const gap = 12;
  const rowH = 76;
  // contentHeight may exceed s.h — caller will switch to scroll mode
  return items.map((it, i) => ({
    ...it,
    focusWeight: 0.5,
    layoutRole: "equal",
    x,
    y: s.y + i * (rowH + gap),
    width: colW,
    height: rowH,
    rotation: 0,
    zIndex: 5,
  }));
}

// Presentation kit: vertical scrollable stack of sections
function presentationKitLayout(items: MediaItem[], v: Viewport): { frames: PositionedItem[]; contentHeight: number } {
  const s = stage(v);
  const colW = Math.min(s.w * 0.9, 1100);
  const x = s.x + (s.w - colW) / 2;
  const gap = 32;
  let y = s.y;
  const frames: PositionedItem[] = [];
  items.forEach((it) => {
    // section heights based on type
    let h = 220;
    if (it.type === "section") h = 80;
    else if (it.type === "brandMark") h = 240;
    else if (it.type === "video") h = Math.min(colW * 9 / 16, 480);
    else if (it.type === "audio") h = 160;
    else if (it.type === "palette") h = 140;
    else if (it.type === "image") h = 260;
    else if (it.type === "document") h = 360;
    else if (it.type === "email") h = 260;
    frames.push({
      ...it,
      focusWeight: 0.6,
      layoutRole: it.type === "section" ? "background" : "supporting",
      x,
      y,
      width: colW,
      height: h,
      rotation: 0,
      zIndex: 5,
    });
    y += h + gap;
  });
  return { frames, contentHeight: y + s.y };
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
export function generateLayout(
  items: MediaItem[],
  viewport: Viewport,
  options: LayoutOptions,
): LayoutResult {
  if (items.length === 0) {
    return { frames: [], contentHeight: viewport.height, scrollable: false };
  }
  let intent = options.intent;
  if (intent === "auto") intent = inferIntent(items);

  if (options.equalSpacing) {
    return {
      frames: equalLayout(items, viewport, options),
      contentHeight: viewport.height,
      scrollable: false,
    };
  }

  if (intent === "presentationKit") {
    const r = presentationKitLayout(items, viewport);
    return { frames: r.frames, contentHeight: r.contentHeight, scrollable: true };
  }

  let frames: PositionedItem[];
  switch (intent) {
    case "hero":
      frames = heroLayout(items, viewport, options); break;
    case "equal":
      frames = equalLayout(items, viewport, options); break;
    case "logos":
      frames = equalLayout(items, viewport, { ...options, square: true }); break;
    case "editorial":
      frames = editorialLayout(items, viewport, options); break;
    case "document":
      frames = documentLayout(items, viewport, options); break;
    case "presentation":
      frames = presentationLayout(items, viewport, options); break;
    case "concepts":
      frames = conceptsLayout(items, viewport, options); break;
    case "brandBoard":
      frames = brandBoardLayout(items, viewport, options); break;
    case "directions":
      frames = directionsLayout(items, viewport, options); break;
    case "mascotSet":
      frames = mascotSetLayout(items, viewport, options); break;
    case "storyboard":
      frames = storyboardLayout(items, viewport, options); break;
    case "mediaPlayer":
      frames = mediaPlayerLayout(items, viewport, options); break;
    case "calendar":
      frames = calendarLayout(items, viewport, options); break;
    case "confirmation":
      frames = confirmationLayout(items, viewport); break;
    case "transcript": {
      frames = transcriptLayout(items, viewport);
      const last = frames[frames.length - 1];
      const contentHeight = Math.max(viewport.height, (last?.y ?? 0) + (last?.height ?? 0) + 80);
      return { frames, contentHeight, scrollable: contentHeight > viewport.height };
    }
    case "moodboard":
    default:
      frames = moodboardLayout(items, viewport, options);
  }

  return { frames, contentHeight: viewport.height, scrollable: false };
}
