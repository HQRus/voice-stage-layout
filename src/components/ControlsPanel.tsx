import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LayoutIntent } from "@/lib/layoutEngine";
import { scenarios } from "@/lib/scenarios";

export type PanelMode = "agent" | "manual";

interface Props {
  mode: PanelMode;
  onModeChange: (m: PanelMode) => void;

  // Manual add controls
  onAdd: (type:
    | "image" | "video" | "text" | "document" | "logo" | "quote"
    | "concept" | "palette" | "typeSample" | "audio"
    | "storyboardFrame" | "calendarSlot" | "email" | "section"
    | "weather" | "stock" | "map" | "link" | "metric" | "chart"
    | "code" | "checklist" | "product" | "flight" | "poll"
    | "script" | "shotList" | "reel" | "adVariant" | "caption"
    | "thumbnail" | "timeline" | "subtitleStrip" | "gallery" | "transition") => void;
  onRemoveLast: () => void;
  onShuffle: () => void;
  onClear: () => void;

  // Scenario playback (agent mode)
  scenarioId: string | null;
  scenarioStep: number;
  scenarioStateLabel: string | null;
  scenarioStateCount: number;
  scenarioPrompt: string | null;
  onLoadScenario: (id: string) => void;
  onScenarioStep: (delta: number) => void;
  onJumpToStep: (step: number) => void;

  intent: LayoutIntent;
  onIntent: (i: LayoutIntent) => void;
  debug: boolean;
  onDebug: (v: boolean) => void;
  equalSpacing: boolean;
  onEqualSpacing: (v: boolean) => void;
  overlapAmount: number;
  onOverlapAmount: (v: number) => void;
  cornerRadius: number;
  onCornerRadius: (v: number) => void;
  shadowAmount: number;
  onShadowAmount: (v: number) => void;
  rotationAmount: number;
  onRotationAmount: (v: number) => void;
  onApplyJson: (json: string) => void;
  onClearJson: () => void;
  jsonActive: boolean;
  itemCount: number;
}

const intents: { value: LayoutIntent; label: string }[] = [
  { value: "auto", label: "Auto (infer)" },
  { value: "concepts", label: "Concepts (3-up)" },
  { value: "brandBoard", label: "Brand board" },
  { value: "directions", label: "Directions (overlap)" },
  { value: "hero", label: "Hero focus" },
  { value: "mascotSet", label: "Mascot set" },
  { value: "storyboard", label: "Storyboard" },
  { value: "mediaPlayer", label: "Media player" },
  { value: "presentationKit", label: "Presentation kit" },
  { value: "calendar", label: "Calendar" },
  { value: "confirmation", label: "Confirmation" },
  { value: "transcript", label: "Transcript" },
  { value: "equal", label: "Equal grid" },
  { value: "editorial", label: "Editorial" },
  { value: "moodboard", label: "Moodboard" },
  { value: "logos", label: "Logos" },
  { value: "document", label: "Document" },
  { value: "presentation", label: "Presentation slide" },
  { value: "reelStack", label: "Reel stack (9:16)" },
  { value: "adVariants", label: "Ad variants" },
  { value: "editTimeline", label: "Edit timeline" },
];

export function ControlsPanel(p: Props) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");

  return (
    <aside className="w-[340px] shrink-0 h-full border-l border-border bg-card/85 backdrop-blur flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="font-display text-2xl text-foreground leading-tight">Voice StagE</h1>
        <div className="text-xs text-muted-foreground mt-1.5">
          {p.mode === "agent" && p.scenarioStateLabel
            ? `${p.scenarioStep + 1} / ${p.scenarioStateCount} — ${p.scenarioStateLabel}`
            : `${p.itemCount} item${p.itemCount === 1 ? "" : "s"} on canvas`}
        </div>

        {/* Mode switch */}
        <div className="mt-4 flex p-1 rounded-xl bg-muted/60">
          <ModeTab active={p.mode === "agent"} onClick={() => p.onModeChange("agent")}>
            Agent (AI)
          </ModeTab>
          <ModeTab active={p.mode === "manual"} onClick={() => p.onModeChange("manual")}>
            Manual
          </ModeTab>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {p.mode === "agent" ? (
          <>
            <Section title="Scenario">
              <div className="text-[11px] text-muted-foreground mb-2 leading-snug">
                The agent generates items + layout intent together. Pick a scenario and step through Russ's responses.
              </div>
              <select
                value={p.scenarioId ?? ""}
                onChange={(e) => p.onLoadScenario(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="">— Load a scenario —</option>
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {p.scenarioId && (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => p.onScenarioStep(-1)}
                      disabled={p.scenarioStep <= 0}
                      className="py-2 rounded-xl border border-border bg-background text-sm text-foreground hover:bg-muted transition flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      onClick={() => p.onScenarioStep(1)}
                      disabled={p.scenarioStep >= p.scenarioStateCount - 1}
                      className="py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {p.scenarioPrompt && (
                    <div className="mt-3 px-3 py-2.5 rounded-xl bg-muted/60 text-xs text-foreground/80 italic leading-snug">
                      "{p.scenarioPrompt}"
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Array.from({ length: p.scenarioStateCount }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => p.onJumpToStep(i)}
                        className={`w-6 h-6 rounded-md text-[10px] tabular-nums ${i === p.scenarioStep ? "bg-foreground text-background" : "bg-muted text-foreground/60 hover:bg-muted/70"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Active intent: <span className="text-foreground/80 normal-case tracking-normal">{p.intent}</span>
                  </div>
                </>
              )}
            </Section>

            <Section title="AI layout JSON">
              <div className="text-[11px] text-muted-foreground mb-2 leading-snug">
                Paste a layout the AI generated to render it directly on the stage.
              </div>
              <button
                onClick={() => setJsonOpen((v) => !v)}
                className="w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:bg-muted transition"
              >
                {jsonOpen ? "Hide" : "Paste layout JSON"}
              </button>
              {jsonOpen && (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='[{"id":"a","type":"image","content":"...","x":0,"y":0,"width":400,"height":300,"rotation":-2,"zIndex":1,"layoutRole":"hero","focusWeight":1}]'
                    className="w-full h-32 p-2 rounded-lg border border-border bg-background text-[11px] font-mono text-foreground/80 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                  <Grid>
                    <Btn onClick={() => p.onApplyJson(jsonText)}>Apply</Btn>
                    <Btn onClick={p.onClearJson}>{p.jsonActive ? "Stop override" : "Clear"}</Btn>
                  </Grid>
                  {p.jsonActive && (
                    <div className="text-[10px] text-accent uppercase tracking-widest">● AI JSON layout active</div>
                  )}
                </div>
              )}
            </Section>
          </>
        ) : (
          <>
            <Section title="Layout intent">
              <select
                value={p.intent}
                onChange={(e) => p.onIntent(e.target.value as LayoutIntent)}
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                {intents.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </Section>

            <Section title="Add items">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Generic</div>
              <Grid>
                <Btn onClick={() => p.onAdd("image")}>Image</Btn>
                <Btn onClick={() => p.onAdd("video")}>Video</Btn>
                <Btn onClick={() => p.onAdd("text")}>Text</Btn>
                <Btn onClick={() => p.onAdd("quote")}>Quote</Btn>
                <Btn onClick={() => p.onAdd("document")}>Document</Btn>
                <Btn onClick={() => p.onAdd("logo")}>Logo</Btn>
              </Grid>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-3">Agent surfaces</div>
              <Grid>
                <Btn onClick={() => p.onAdd("concept")}>Concept</Btn>
                <Btn onClick={() => p.onAdd("palette")}>Palette</Btn>
                <Btn onClick={() => p.onAdd("typeSample")}>Type</Btn>
                <Btn onClick={() => p.onAdd("audio")}>Audio</Btn>
                <Btn onClick={() => p.onAdd("storyboardFrame")}>Frame</Btn>
                <Btn onClick={() => p.onAdd("calendarSlot")}>Slot</Btn>
                <Btn onClick={() => p.onAdd("email")}>Email</Btn>
                <Btn onClick={() => p.onAdd("section")}>Section</Btn>
              </Grid>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-3">AI widgets</div>
              <Grid>
                <Btn onClick={() => p.onAdd("weather")}>Weather</Btn>
                <Btn onClick={() => p.onAdd("stock")}>Stock</Btn>
                <Btn onClick={() => p.onAdd("map")}>Map</Btn>
                <Btn onClick={() => p.onAdd("link")}>Link</Btn>
                <Btn onClick={() => p.onAdd("metric")}>Metric</Btn>
                <Btn onClick={() => p.onAdd("chart")}>Chart</Btn>
                <Btn onClick={() => p.onAdd("code")}>Code</Btn>
                <Btn onClick={() => p.onAdd("checklist")}>Checklist</Btn>
                <Btn onClick={() => p.onAdd("product")}>Product</Btn>
                <Btn onClick={() => p.onAdd("flight")}>Flight</Btn>
                <Btn onClick={() => p.onAdd("poll")}>Poll</Btn>
              </Grid>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-3">Video creation</div>
              <Grid>
                <Btn onClick={() => p.onAdd("script")}>Script</Btn>
                <Btn onClick={() => p.onAdd("shotList")}>Shot list</Btn>
                <Btn onClick={() => p.onAdd("reel")}>Reel</Btn>
                <Btn onClick={() => p.onAdd("adVariant")}>Ad variant</Btn>
                <Btn onClick={() => p.onAdd("caption")}>Caption</Btn>
                <Btn onClick={() => p.onAdd("thumbnail")}>Thumbnail</Btn>
                <Btn onClick={() => p.onAdd("timeline")}>Timeline</Btn>
                <Btn onClick={() => p.onAdd("subtitleStrip")}>Subtitle</Btn>
                <Btn onClick={() => p.onAdd("gallery")}>Gallery</Btn>
                <Btn onClick={() => p.onAdd("transition")}>Transition</Btn>
              </Grid>
              <div className="pt-3">
                <Grid>
                  <Btn onClick={p.onShuffle}>Shuffle</Btn>
                  <Btn onClick={p.onRemoveLast}>Remove last</Btn>
                </Grid>
                <button
                  onClick={p.onClear}
                  className="mt-2 w-full py-2.5 rounded-xl border border-border text-sm text-foreground/70 hover:bg-muted transition"
                >
                  Clear all
                </button>
              </div>
            </Section>
          </>
        )}

        <Section title="Modes">
          <Toggle label="Debug outlines" value={p.debug} onChange={p.onDebug} />
          <Toggle label="Equal spacing" value={p.equalSpacing} onChange={p.onEqualSpacing} />
        </Section>

        <Section title="Geometry">
          <Slider label="Overlap" value={p.overlapAmount} min={0} max={200} unit="px" onChange={p.onOverlapAmount} />
          <Slider label="Corner radius" value={p.cornerRadius} min={0} max={120} unit="px" onChange={p.onCornerRadius} />
          <Slider label="Rotation" value={p.rotationAmount} min={0} max={20} unit="°" step={0.5} onChange={p.onRotationAmount} />
          <Slider label="Shadow" value={p.shadowAmount} min={0} max={100} unit="%" onChange={p.onShadowAmount} />
        </Section>
      </div>

      <div className="px-6 py-3 border-t border-border text-[10px] text-muted-foreground tracking-wider">
        Voice StagE — agent surface preview
      </div>
    </aside>
  );
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="py-2 rounded-xl border border-border bg-background text-sm text-foreground hover:bg-muted transition">
      {children}
    </button>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between py-2 text-sm text-foreground">
      <span>{label}</span>
      <span className={`relative w-9 h-5 rounded-full transition ${value ? "bg-accent" : "bg-muted"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition ${value ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

function Slider({ label, value, min, max, unit, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; unit: string; step?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted"
        style={{ accentColor: "hsl(var(--accent))" }}
      />
    </div>
  );
}
