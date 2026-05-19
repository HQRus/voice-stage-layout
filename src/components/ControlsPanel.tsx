import { useState } from "react";
import type { LayoutIntent } from "@/lib/layoutEngine";

interface Props {
  onAdd: (type:
    | "image"
    | "video"
    | "text"
    | "document"
    | "logo"
    | "quote") => void;
  onAddRandom: () => void;
  onRemoveLast: () => void;
  onShuffle: () => void;
  onClear: () => void;
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
  rotationAmount: number;
  onRotationAmount: (v: number) => void;
  onApplyJson: (json: string) => void;
  onClearJson: () => void;
  jsonActive: boolean;
  itemCount: number;
}

const intents: { value: LayoutIntent; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "equal", label: "Equal comparison" },
  { value: "hero", label: "Hero focus" },
  { value: "editorial", label: "Editorial story" },
  { value: "moodboard", label: "Moodboard" },
  { value: "logos", label: "Logo options" },
  { value: "document", label: "Text-heavy document" },
  { value: "presentation", label: "Presentation slide" },
];

export function ControlsPanel(p: Props) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");

  return (
    <aside className="w-[320px] shrink-0 h-full border-l border-border bg-card/70 backdrop-blur flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="font-display text-2xl text-foreground mt-1 leading-tight">
          Voice StagE
        </h1>
        <div className="text-xs text-muted-foreground mt-2">
          {p.itemCount} item{p.itemCount === 1 ? "" : "s"} on canvas
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <Section title="Add media">
          <Grid>
            <Btn onClick={() => p.onAdd("image")}>Image</Btn>
            <Btn onClick={() => p.onAdd("video")}>Video</Btn>
            <Btn onClick={() => p.onAdd("text")}>Short text</Btn>
            <Btn onClick={() => p.onAdd("document")}>Document</Btn>
            <Btn onClick={() => p.onAdd("logo")}>Logo</Btn>
            <Btn onClick={() => p.onAdd("quote")}>Quote</Btn>
          </Grid>
          <button
            onClick={p.onAddRandom}
            className="w-full mt-2 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition"
          >
            + Mixed random set
          </button>
        </Section>

        <Section title="Arrange">
          <Grid>
            <Btn onClick={p.onShuffle}>Shuffle</Btn>
            <Btn onClick={p.onRemoveLast}>Remove last</Btn>
          </Grid>
          <button
            onClick={p.onClear}
            className="w-full mt-2 py-2.5 rounded-xl border border-border text-sm text-foreground/70 hover:bg-muted transition"
          >
            Clear all
          </button>
        </Section>

        <Section title="Layout intent">
          <select
            value={p.intent}
            onChange={(e) => p.onIntent(e.target.value as LayoutIntent)}
            className="w-full py-2.5 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {intents.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Section>

        <Section title="Modes">
          <Toggle label="Debug outlines" value={p.debug} onChange={p.onDebug} />
          <Toggle
            label="Equal spacing"
            value={p.equalSpacing}
            onChange={p.onEqualSpacing}
          />
        </Section>

        <Section title="Geometry">
          <Slider
            label="Overlap"
            value={p.overlapAmount}
            min={0}
            max={200}
            unit="px"
            onChange={p.onOverlapAmount}
          />
          <Slider
            label="Corner radius"
            value={p.cornerRadius}
            min={0}
            max={120}
            unit="px"
            onChange={p.onCornerRadius}
          />
          <Slider
            label="Rotation"
            value={p.rotationAmount}
            min={0}
            max={20}
            unit="°"
            step={0.5}
            onChange={p.onRotationAmount}
          />
        </Section>

        <Section title="AI layout JSON">
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
                <Btn onClick={p.onClearJson}>
                  {p.jsonActive ? "Stop override" : "Clear"}
                </Btn>
              </Grid>
              {p.jsonActive && (
                <div className="text-[10px] text-accent uppercase tracking-widest">
                  ● AI JSON layout active
                </div>
              )}
            </div>
          )}
        </Section>
      </div>

      <div className="px-6 py-3 border-t border-border text-[10px] text-muted-foreground tracking-wider">
        Widescreen layout testing utility
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

function Btn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="py-2 rounded-xl border border-border bg-background text-sm text-foreground hover:bg-muted transition"
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between py-2 text-sm text-foreground"
    >
      <span>{label}</span>
      <span
        className={`relative w-9 h-5 rounded-full transition ${
          value ? "bg-accent" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
            value ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted"
        style={{ accentColor: "hsl(var(--accent))" }}
      />
    </div>
  );
}
