// Generative layout engine
// ------------------------------------------------------------
// Pure, deterministic functions that take an item list + viewport
// and return absolute frames (x, y, width, height, rotation, zIndex).
//
// The same renderer can later be driven by AI-generated layout JSON —
// just bypass `generateLayout` and feed positioned items directly.

export type ItemType =
  | "image"
  | "video"
  | "text"
  | "document"
  | "logo"
  | "quote";

export type LayoutIntent =
  | "auto"
  | "equal"
  | "hero"
  | "editorial"
  | "moodboard"
  | "logos"
  | "document"
  | "presentation";

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
  // Optional metadata used by the renderer
  meta?: { color?: string; title?: string };
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

// ------------------------------------------------------------
// Intent inference
// ------------------------------------------------------------
export function inferIntent(items: MediaItem[]): LayoutIntent {
  if (items.length === 0) return "auto";
  const counts = items.reduce<Record<ItemType, number>>(
    (acc, it) => ({ ...acc, [it.type]: (acc[it.type] || 0) + 1 }),
    {} as Record<ItemType, number>,
  );
  const logos = counts.logo || 0;
  const docs = counts.document || 0;
  const images = (counts.image || 0) + (counts.video || 0);
  const texts = (counts.text || 0) + (counts.quote || 0);

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
  // Tiny seeded RNG so the same item id always rotates the same way
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
  }
};

// ------------------------------------------------------------
// Per-intent layout strategies
// Each returns a list of frames in the same order as `items`.
// All work inside a padded "stage" inset from the viewport edges.
// ------------------------------------------------------------
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

function heroLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
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
        rotation: tilt(it.id, 2),
        zIndex: 10,
      },
    ];
  }
  // hero + supporting
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
    rotation: tilt(hero.id, 2),
    zIndex: 10,
  };
  const colX = s.x + heroW + s.w * 0.04;
  const colW = s.w - heroW - s.w * 0.04;
  const itemH = (s.h - (rest.length - 1) * 24) / Math.max(rest.length, 1);
  const support = rest.map<PositionedItem>((it, i) => ({
    ...it,
    focusWeight: 0.6,
    layoutRole: "supporting",
    x: colX,
    y: s.y + i * (itemH + 24),
    width: colW,
    height: itemH,
    rotation: tilt(it.id, 2.5),
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
  opts: { square?: boolean } = {},
): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  const cols = Math.ceil(Math.sqrt(n * (s.w / s.h)));
  const rows = Math.ceil(n / cols);
  const gap = 28;
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

function editorialLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
  const visual = items.find((i) => i.type === "image" || i.type === "video");
  const others = items.filter((i) => i !== visual);
  if (!visual) return moodboardLayout(items, v);
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
      rotation: tilt(visual.id, 1.5),
      zIndex: 8,
    },
  ];
  const colX = s.x + heroW + s.w * 0.05;
  const colW = s.w - heroW - s.w * 0.05;
  others.forEach((it, i) => {
    const h = it.type === "document" ? s.h * 0.7 : s.h * 0.35;
    frames.push({
      ...it,
      focusWeight: 0.7,
      layoutRole: "supporting",
      x: colX,
      y: s.y + i * (h + 24) + 20,
      width: colW,
      height: h,
      rotation: tilt(it.id, 2),
      zIndex: 5 - i,
    });
  });
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function moodboardLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
  const n = items.length;
  // Pack via weighted "shelves" — feels like a desktop, not a strict grid.
  // Sort by weight to anchor the strongest item, then distribute.
  const ordered = items
    .map((it, i) => ({ it, i, w: baseWeight(it.type) + rand(seedFromId(it.id)) * 0.2 }))
    .sort((a, b) => b.w - a.w);

  // Grid columns scale gently with item count.
  const cols = n <= 2 ? n : n <= 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const gap = 32;
  const cellW = (s.w - gap * (cols - 1)) / cols;
  const cellH = (s.h - gap * (rows - 1)) / rows;

  const frames: PositionedItem[] = [];
  ordered.forEach(({ it, i: origIdx, w: weight }, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    // Slight random scale + jitter for organic feel
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
      rotation: tilt(it.id, 3.5),
      zIndex: Math.round(weight * 10),
    });
  });
  // Return in original order for stable React keys
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function documentLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  const s = stage(v);
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
      rotation: tilt(doc.id, 1.2),
      zIndex: 10,
    },
  ];
  const colX = s.x + docW + s.w * 0.04;
  const colW = s.w - docW - s.w * 0.04;
  others.forEach((it, i) => {
    const h = (s.h - (others.length - 1) * 24) / Math.max(others.length, 1);
    frames.push({
      ...it,
      focusWeight: 0.6,
      layoutRole: "supporting",
      x: colX,
      y: s.y + i * (h + 24),
      width: colW,
      height: h,
      rotation: tilt(it.id, 2),
      zIndex: 5 - i,
    });
  });
  return frames.sort(
    (a, b) =>
      items.findIndex((i) => i.id === a.id) -
      items.findIndex((i) => i.id === b.id),
  );
}

function presentationLayout(items: MediaItem[], v: Viewport): PositionedItem[] {
  // Centered title-style composition: one big focal item + balanced supports
  const s = stage(v);
  if (items.length <= 1) return heroLayout(items, v);
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
  const gap = 24;
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
      rotation: tilt(it.id, 1.5),
      zIndex: 5,
    });
  });
  return frames;
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
export function generateLayout(
  items: MediaItem[],
  viewport: Viewport,
  options: LayoutOptions,
): PositionedItem[] {
  if (items.length === 0) return [];
  let intent = options.intent;
  if (intent === "auto") intent = inferIntent(items);

  if (options.equalSpacing) return equalLayout(items, viewport);

  let frames: PositionedItem[];
  switch (intent) {
    case "hero":
      frames = heroLayout(items, viewport);
      break;
    case "equal":
      frames = equalLayout(items, viewport);
      break;
    case "logos":
      frames = equalLayout(items, viewport, { square: true });
      break;
    case "editorial":
      frames = editorialLayout(items, viewport);
      break;
    case "document":
      frames = documentLayout(items, viewport);
      break;
    case "presentation":
      frames = presentationLayout(items, viewport);
      break;
    case "moodboard":
    default:
      frames = moodboardLayout(items, viewport);
  }

  if (!options.allowOverlap) {
    // Flatten rotations & remove jitter for a clean grid feel
    frames = frames.map((f) => ({ ...f, rotation: 0 }));
  }
  return frames;
}
