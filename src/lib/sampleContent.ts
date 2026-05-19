import type { ItemType, MediaItem } from "./layoutEngine";

const id = () => Math.random().toString(36).slice(2, 9);

const gradients = [
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
  "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)",
  "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
];

const shortTexts = [
  "Less, but better.",
  "Form follows feeling.",
  "Quiet confidence.",
  "Make it inevitable.",
];

const quotes = [
  "Design is intelligence made visible.",
  "Simplicity is the ultimate sophistication.",
];

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n";

const logoMarks = [
  { title: "AXIS", color: "#1a1a1a" },
  { title: "novel.", color: "#c44d3a" },
  { title: "form&", color: "#3a3a8a" },
];

let logoIdx = 0;
let textIdx = 0;
let gradIdx = 0;
let quoteIdx = 0;

export function makeItem(type: ItemType): MediaItem {
  const base = { id: id(), type } as const;
  switch (type) {
    case "image":
      return { ...base, content: gradients[gradIdx++ % gradients.length] };
    case "video":
      return { ...base, content: gradients[(gradIdx++ + 4) % gradients.length], meta: { title: "Untitled clip", duration: "0:15" } };
    case "text":
      return { ...base, content: shortTexts[textIdx++ % shortTexts.length] };
    case "quote":
      return { ...base, content: quotes[quoteIdx++ % quotes.length] };
    case "document":
      return { ...base, content: lorem.repeat(8), meta: { title: "Brief" } };
    case "logo": {
      const l = logoMarks[logoIdx++ % logoMarks.length];
      return { ...base, content: l.title, meta: { color: l.color } };
    }
    case "concept":
      return { ...base, content: "A calm, designy café where adoptable cats lounge like little art critics.", meta: { title: "Concept", tag: "Idea" } };
    case "brandMark":
      return { ...base, content: "Studio Whiskers", meta: { tagline: "Slow mornings, soft purrs.", accent: "#c98664" } };
    case "palette":
      return { ...base, content: "Calm warmth", meta: { swatches: ["#f7f1ea", "#e6d5c1", "#c98664", "#3a2e26", "#1a1614"] } };
    case "typeSample":
      return { ...base, content: "Aa", meta: { display: "Söhne Breit", body: "Inter", sample: "Soft mornings begin with a quiet purr." } };
    case "audio":
      return { ...base, content: gradients[2], meta: { title: "Soft jazz bed", artist: "Russ AI", duration: "1:42" } };
    case "storyboardFrame":
      return { ...base, content: gradients[gradIdx++ % gradients.length], meta: { caption: "Shot", frame: 1 } };
    case "calendarSlot":
      return { ...base, content: "3:00 PM", meta: { day: "Tomorrow", duration: "30 min", status: "open" } };
    case "email":
      return { ...base, content: "Sharing the cat café launch concept and a quick meeting note. Let me know what you think.", meta: { to: "boss@studio.com", subject: "Cat café concept + Wed 3pm" } };
    case "chatMessage":
      return { ...base, content: "Help me make a tiny brand for a pop-up cat café.", meta: { speaker: "You", time: "now" } };
    case "section":
      return { ...base, content: "Section", meta: {} };
  }
}

export function randomMixedSet(count = 5): MediaItem[] {
  const types: ItemType[] = ["image", "video", "text", "quote", "image"];
  return Array.from({ length: count }, (_, i) => makeItem(types[i % types.length]));
}

// --- Builders used by scenarios ---
export const make = {
  concept: (title: string, body: string, tag: string) => ({
    id: id(), type: "concept" as const, content: body, meta: { title, tag },
  }),
  brand: (name: string, tagline: string, accent = "#c98664") => ({
    id: id(), type: "brandMark" as const, content: name, meta: { tagline, accent },
  }),
  palette: (name: string, swatches: string[]) => ({
    id: id(), type: "palette" as const, content: name, meta: { swatches },
  }),
  typeSample: (display: string, body: string, sample: string) => ({
    id: id(), type: "typeSample" as const, content: "Aa", meta: { display, body, sample },
  }),
  text: (s: string) => ({ id: id(), type: "text" as const, content: s }),
  quote: (s: string) => ({ id: id(), type: "quote" as const, content: s }),
  image: (grad?: string) => ({
    id: id(), type: "image" as const,
    content: grad ?? gradients[gradIdx++ % gradients.length],
  }),
  video: (title: string, duration = "0:15") => ({
    id: id(), type: "video" as const,
    content: gradients[3], meta: { title, duration },
  }),
  audio: (title: string, artist: string, duration: string) => ({
    id: id(), type: "audio" as const, content: "", meta: { title, artist, duration },
  }),
  storyFrame: (n: number, caption: string, grad?: string) => ({
    id: id(), type: "storyboardFrame" as const,
    content: grad ?? gradients[(n - 1) % gradients.length],
    meta: { frame: n, caption },
  }),
  slot: (day: string, time: string, duration = "30 min") => ({
    id: id(), type: "calendarSlot" as const, content: time, meta: { day, duration, status: "open" },
  }),
  email: (to: string, subject: string, body: string) => ({
    id: id(), type: "email" as const, content: body, meta: { to, subject },
  }),
  chat: (speaker: string, text: string, time: string) => ({
    id: id(), type: "chatMessage" as const, content: text, meta: { speaker, time },
  }),
  section: (title: string) => ({
    id: id(), type: "section" as const, content: title, meta: {},
  }),
};
