import { createServerFn } from "@tanstack/react-start";
import { STAGE_PROMPT } from "./stagePrompt";

const ALLOWED_TYPES = [
  "image","video","text","document","logo","quote",
  "concept","palette","typeSample","audio","storyboardFrame","calendarSlot","email","section",
  "weather","stock","map","link","metric","chart","code","checklist","product","flight","poll",
  "script","shotList","reel","adVariant","caption","thumbnail","timeline","subtitleStrip","gallery","transition",
];

const ALLOWED_ROLES = ["hero", "supporting", "equal", "background", "document"];

export type GenerateLayoutInput = {
  data: string;
  viewport: { width: number; height: number };
  model?: string;
};

export const generateLayoutFromData = createServerFn({ method: "POST" })
  .inputValidator((input: GenerateLayoutInput) => {
    if (!input || typeof input.data !== "string" || !input.data.trim()) {
      throw new Error("`data` must be a non-empty string");
    }
    if (!input.viewport || typeof input.viewport.width !== "number" || typeof input.viewport.height !== "number") {
      throw new Error("`viewport` must include width and height");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const { width, height } = data.viewport;
    const model = data.model || "google/gemini-2.5-pro";

    const systemPrompt = `${STAGE_PROMPT}

────────────────────────────────────────
OUTPUT CONTRACT (must follow exactly)

Return a single JSON object — no prose, no markdown — shaped like:

{
  "theme": "short label you chose for this composition",
  "intent": "one of: auto | equal | hero | editorial | moodboard | logos | document | presentation | concepts | brandBoard | directions | mascotSet | storyboard | mediaPlayer | presentationKit | calendar | confirmation | transcript | reelStack | adVariants | editTimeline",
  "frames": [
    {
      "id": "unique-string",
      "type": "one of: ${ALLOWED_TYPES.join(" | ")}",
      "content": "the visible text / caption / label for this item",
      "x": number,         // px, top-left within the stage
      "y": number,         // px, top-left within the stage
      "width": number,     // px
      "height": number,    // px
      "rotation": number,  // degrees, usually -6..6
      "zIndex": number,    // higher = on top
      "focusWeight": number, // 0..1, hero ≈ 1, captions ≈ 0.2
      "layoutRole": "one of: ${ALLOWED_ROLES.join(" | ")}",
      "meta": { } // optional, any extra fields the item type needs
    }
  ]
}

The stage viewport is ${width}px wide by ${height}px tall. All frames MUST fit
inside that viewport (x >= 0, y >= 0, x+width <= ${width}, y+height <= ${height}).
Aim for 3–9 frames unless the theme demands more. Pick types that match the
content — text/quote/image/metric/chart/weather/product/etc.
Do NOT return any keys other than the ones listed.`;

    const userPrompt = `Compose a Stage layout for the following data. First decide the theme, then lay it out.

DATA:
${data.data}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (resp.status === 429) throw new Error("Rate limited by Lovable AI. Try again in a moment.");
      if (resp.status === 402) throw new Error("Lovable AI credits exhausted. Add funds in Settings → Workspace → Usage.");
      throw new Error(`AI gateway error ${resp.status}: ${text.slice(0, 200)}`);
    }

    const json = await resp.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("AI did not return valid JSON");
    }

    const frames = Array.isArray(parsed?.frames) ? parsed.frames : [];
    // Light sanitization so the renderer can't blow up.
    const safeFrames = frames.map((f: any, i: number) => ({
      id: String(f.id ?? `ai-${i}`),
      type: ALLOWED_TYPES.includes(f.type) ? f.type : "text",
      content: String(f.content ?? ""),
      x: Number(f.x ?? 0),
      y: Number(f.y ?? 0),
      width: Number(f.width ?? 200),
      height: Number(f.height ?? 200),
      rotation: Number(f.rotation ?? 0),
      zIndex: Number(f.zIndex ?? i + 1),
      focusWeight: Number(f.focusWeight ?? 0.5),
      layoutRole: ALLOWED_ROLES.includes(f.layoutRole) ? f.layoutRole : "supporting",
      meta: f.meta && typeof f.meta === "object" ? f.meta : undefined,
    }));

    return {
      theme: String(parsed?.theme ?? ""),
      intent: String(parsed?.intent ?? "auto"),
      frames: safeFrames,
    };
  });
