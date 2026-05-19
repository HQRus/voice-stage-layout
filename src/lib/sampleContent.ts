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
  "Light on the page.",
  "Hold the moment.",
];

const quotes = [
  "Design is intelligence made visible.",
  "Simplicity is the ultimate sophistication.",
  "What you make is who you are.",
  "The detail is not the detail. It makes the design.",
];

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n";

const logoMarks = [
  { title: "AXIS", color: "#1a1a1a" },
  { title: "novel.", color: "#c44d3a" },
  { title: "Ⓜ︎ MERIDIAN", color: "#2b5d4a" },
  { title: "form&", color: "#3a3a8a" },
  { title: "◆ NORTH", color: "#0d0d0d" },
];

let logoIdx = 0;
let textIdx = 0;
let gradIdx = 0;
let quoteIdx = 0;

export function makeItem(type: ItemType): MediaItem {
  switch (type) {
    case "image":
      return {
        id: id(),
        type,
        content: gradients[gradIdx++ % gradients.length],
      };
    case "video":
      return {
        id: id(),
        type,
        content: gradients[(gradIdx++ + 4) % gradients.length],
      };
    case "text":
      return {
        id: id(),
        type,
        content: shortTexts[textIdx++ % shortTexts.length],
      };
    case "quote":
      return {
        id: id(),
        type,
        content: quotes[quoteIdx++ % quotes.length],
      };
    case "document":
      return {
        id: id(),
        type,
        content: lorem.repeat(8),
      };
    case "logo": {
      const l = logoMarks[logoIdx++ % logoMarks.length];
      return { id: id(), type, content: l.title, meta: { color: l.color } };
    }
  }
}

export function randomMixedSet(count = 5): MediaItem[] {
  const types: ItemType[] = ["image", "video", "text", "quote", "image"];
  return Array.from({ length: count }, (_, i) => makeItem(types[i % types.length]));
}
