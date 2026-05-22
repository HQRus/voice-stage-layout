import { createServerFn } from "@tanstack/react-start";
import { STAGE_PROMPT } from "./stagePrompt";
import { ITEM_CATALOG } from "./itemCatalog";

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
  prompt?: string;
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
    const model = data.model || "google/gemini-2.5-flash";
    const basePrompt = (data.prompt && data.prompt.trim()) ? data.prompt : STAGE_PROMPT;

    const systemPrompt = `${basePrompt}

${ITEM_CATALOG}

The stage viewport is ${width}px wide by ${height}px tall. All frames MUST fit
inside it (x >= 0, y >= 0, x+width <= ${width}, y+height <= ${height}).
Aim for 3-9 frames unless the theme demands more.

Always respond by calling the compose_stage_layout tool with the chosen theme,
intent, and frames. Never reply with plain text. Never use type "text" when a
more specific type (weather, metric, document, chart, etc.) fits the data.`;

    const userPrompt = `Compose a Stage layout for the following data. First decide the theme, then lay it out.

DATA:
${data.data}`;

    const tool = {
      type: "function",
      function: {
        name: "compose_stage_layout",
        description: "Return the composed Stage layout (theme, intent, frames).",
        parameters: {
          type: "object",
          properties: {
            theme: { type: "string", description: "Short label for the chosen theme." },
            intent: {
              type: "string",
              enum: [
                "auto","equal","hero","editorial","moodboard","logos","document","presentation",
                "concepts","brandBoard","directions","mascotSet","storyboard","mediaPlayer",
                "presentationKit","calendar","confirmation","transcript",
                "reelStack","adVariants","editTimeline",
              ],
            },
            frames: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string", enum: ALLOWED_TYPES },
                  content: { type: "string" },
                  x: { type: "number" },
                  y: { type: "number" },
                  width: { type: "number" },
                  height: { type: "number" },
                  rotation: { type: "number" },
                  zIndex: { type: "number" },
                  focusWeight: { type: "number" },
                  layoutRole: { type: "string", enum: ALLOWED_ROLES },
                },
                required: ["id","type","content","x","y","width","height","rotation","zIndex","focusWeight","layoutRole"],
                additionalProperties: true,
              },
            },
          },
          required: ["theme", "intent", "frames"],
          additionalProperties: false,
        },
      },
    };

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
        tools: [tool],
        tool_choice: { type: "function", function: { name: "compose_stage_layout" } },
        max_tokens: 8192,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text.slice(0, 500));
      if (resp.status === 429) throw new Error("Rate limited by Lovable AI. Try again in a moment.");
      if (resp.status === 402) throw new Error("Lovable AI credits exhausted. Add funds in Settings → Workspace → Usage.");
      throw new Error(`AI gateway error ${resp.status}`);
    }

    const json = await resp.json();
    const choice = json?.choices?.[0];
    const toolCall = choice?.message?.tool_calls?.[0];
    const rawContent: string = choice?.message?.content ?? "";
    const argStr: string = toolCall?.function?.arguments ?? rawContent ?? "";

    const finishReason = choice?.finish_reason;
    if (finishReason === "length") {
      console.error("AI response truncated (finish_reason=length)");
      throw new Error("AI response was truncated. Try shorter data or a simpler request.");
    }

    function extractJSON(raw: string): any {
      let cleaned = raw
        .replace(/^```json\s*/im, "")
        .replace(/^```\s*/im, "")
        .replace(/```\s*$/im, "")
        .trim();
      if (!cleaned) throw new Error("empty");
      if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
        const objStart = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (objStart !== -1 && end > objStart) {
          cleaned = cleaned.slice(objStart, end + 1);
        }
      }
      return JSON.parse(cleaned);
    }

    let parsed: any;
    try {
      parsed = extractJSON(argStr);
    } catch (e) {
      console.error("AI returned unparseable output. finish_reason=", finishReason, "raw=", argStr.slice(0, 1000));
      throw new Error("AI did not return valid JSON");
    }

    const frames = Array.isArray(parsed?.frames) ? parsed.frames : [];
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
