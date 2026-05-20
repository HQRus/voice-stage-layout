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
    case "section":
      return { ...base, content: "Section", meta: {} };
    case "weather":
      return { ...base, content: "72°", meta: { location: "San Francisco", condition: "Partly cloudy", high: 74, low: 58, icon: "cloud-sun" } };
    case "stock":
      return { ...base, content: "AAPL", meta: { name: "Apple Inc.", price: "212.48", change: "+2.14", changePct: "+1.02%", up: true, spark: [10,12,11,14,13,16,15,18,17,20,22,21,24] } };
    case "map":
      return { ...base, content: "Ferry Building", meta: { location: "San Francisco, CA", subtitle: "1 Ferry Building · Pier 1" } };
    case "link":
      return { ...base, content: "How AI is changing design", meta: { domain: "nytimes.com", description: "A long read on the rise of AI tooling in creative work.", url: "https://nytimes.com/…" } };
    case "metric":
      return { ...base, content: "$42.8k", meta: { label: "Monthly revenue", delta: "+18.2%", up: true, sub: "vs. last month" } };
    case "chart":
      return { ...base, content: "Weekly signups", meta: { bars: [{ l: "M", v: 32 }, { l: "T", v: 48 }, { l: "W", v: 41 }, { l: "T", v: 65 }, { l: "F", v: 72 }, { l: "S", v: 58 }, { l: "S", v: 80 }] } };
    case "code":
      return { ...base, content: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet('world');", meta: { language: "javascript", filename: "greet.js" } };
    case "checklist":
      return { ...base, content: "Launch checklist", meta: { items: [{ t: "Write copy", d: true }, { t: "Ship landing page", d: true }, { t: "Email beta list", d: false }, { t: "Schedule tweet", d: false }] } };
    case "product":
      return { ...base, content: "Linen Throw Blanket", meta: { price: "$148", rating: 4.7, image: gradients[1], brand: "Hearth & Loom" } };
    case "flight":
      return { ...base, content: "UA 256", meta: { from: "SFO", to: "JFK", fromTime: "8:15 AM", toTime: "4:42 PM", duration: "5h 27m", airline: "United", date: "Fri Jun 14" } };
    case "poll":
      return { ...base, content: "Where should we go for dinner?", meta: { options: [{ l: "Italian", v: 48 }, { l: "Sushi", v: 30 }, { l: "Tacos", v: 22 }] } };
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
  weather: (location: string, temp: string, condition: string, high: number, low: number, icon = "cloud-sun") => ({
    id: id(), type: "weather" as const, content: temp, meta: { location, condition, high, low, icon },
  }),
  stock: (symbol: string, name: string, price: string, change: string, changePct: string, up: boolean, spark: number[]) => ({
    id: id(), type: "stock" as const, content: symbol, meta: { name, price, change, changePct, up, spark },
  }),
  map: (place: string, location: string, subtitle?: string) => ({
    id: id(), type: "map" as const, content: place, meta: { location, subtitle },
  }),
  link: (title: string, domain: string, description: string, url: string) => ({
    id: id(), type: "link" as const, content: title, meta: { domain, description, url },
  }),
  metric: (value: string, label: string, delta: string, up: boolean, sub?: string) => ({
    id: id(), type: "metric" as const, content: value, meta: { label, delta, up, sub },
  }),
  chart: (title: string, bars: Array<{ l: string; v: number }>) => ({
    id: id(), type: "chart" as const, content: title, meta: { bars },
  }),
  code: (code: string, language: string, filename: string) => ({
    id: id(), type: "code" as const, content: code, meta: { language, filename },
  }),
  checklist: (title: string, items: Array<{ t: string; d: boolean }>) => ({
    id: id(), type: "checklist" as const, content: title, meta: { items },
  }),
  product: (title: string, brand: string, price: string, rating: number, image?: string) => ({
    id: id(), type: "product" as const, content: title,
    meta: { brand, price, rating, image: image ?? gradients[gradIdx++ % gradients.length] },
  }),
  flight: (num: string, from: string, to: string, fromTime: string, toTime: string, duration: string, airline: string, date: string) => ({
    id: id(), type: "flight" as const, content: num, meta: { from, to, fromTime, toTime, duration, airline, date },
  }),
  poll: (question: string, options: Array<{ l: string; v: number }>) => ({
    id: id(), type: "poll" as const, content: question, meta: { options },
  }),
};
