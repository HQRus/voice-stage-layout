import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRight, X } from "lucide-react";
import { Canvas } from "@/components/Canvas";
import { ControlsPanel } from "@/components/ControlsPanel";
import {
  type LayoutIntent,
  type MediaItem,
  type PositionedItem,
} from "@/lib/layoutEngine";
import { makeItem } from "@/lib/sampleContent";
import { scenarios } from "@/lib/scenarios";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Voice StagE — Agent surface preview" },
      {
        name: "description",
        content:
          "Preview how an AI agent's visual output composes on a generative stage: concepts, brand boards, storyboards, media players, calendars, transcripts.",
      },
    ],
  }),
});

function Index() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [intent, setIntent] = useState<LayoutIntent>("auto");
  const [debug, setDebug] = useState(false);
  const [equalSpacing, setEqualSpacing] = useState(false);
  const [overlapAmount, setOverlapAmount] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(16);
  const [shadowAmount, setShadowAmount] = useState(35);
  const [rotationAmount, setRotationAmount] = useState(2);
  const [jsonOverride, setJsonOverride] = useState<PositionedItem[] | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // Scenario playback
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? null;
  const activeState = scenario?.states[scenarioStep] ?? null;

  // Auto-load the cat café scenario on mount (client-only) to showcase
  useEffect(() => {
    loadScenario("cat-cafe");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadScenario(id: string) {
    const s = scenarios.find((x) => x.id === id);
    if (!s) {
      setScenarioId(null);
      return;
    }
    setScenarioId(id);
    setScenarioStep(0);
    setJsonOverride(null);
    setIntent(s.states[0].intent);
    setItems(s.states[0].items);
  }

  function stepScenario(delta: number) {
    if (!scenario) return;
    const next = Math.max(0, Math.min(scenario.states.length - 1, scenarioStep + delta));
    jumpToStep(next);
  }

  function jumpToStep(step: number) {
    if (!scenario) return;
    const st = scenario.states[step];
    if (!st) return;
    setScenarioStep(step);
    setJsonOverride(null);
    setIntent(st.intent);
    setItems(st.items);
  }

  const add = (t: MediaItem["type"]) => {
    setJsonOverride(null);
    setScenarioId(null);
    setItems((prev) => [...prev, makeItem(t)]);
  };

  const removeLast = () => setItems((prev) => prev.slice(0, -1));
  const shuffle = () => setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  const clear = () => {
    setItems([]);
    setJsonOverride(null);
    setScenarioId(null);
  };

  const applyJson = (txt: string) => {
    try {
      const parsed = JSON.parse(txt) as PositionedItem[];
      if (!Array.isArray(parsed)) throw new Error("expected array");
      setItems(parsed.map((p) => ({ id: p.id, type: p.type, content: p.content, meta: p.meta })));
      setJsonOverride(parsed);
      setScenarioId(null);
    } catch (e) {
      alert("Invalid layout JSON: " + (e as Error).message);
    }
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-background"
      onClick={() => setPanelOpen(false)}
    >
      <Canvas
        items={items}
        intent={intent}
        debug={debug}
        equalSpacing={equalSpacing}
        overlapAmount={overlapAmount}
        rotationAmount={rotationAmount}
        cornerRadius={cornerRadius}
        shadowAmount={shadowAmount}
        overrideFrames={jsonOverride}
      />

      <button
        onClick={(e) => { e.stopPropagation(); setPanelOpen((v) => !v); }}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-card/90 backdrop-blur border border-border shadow-desk flex items-center justify-center text-foreground hover:bg-card transition"
        aria-label={panelOpen ? "Close controls" : "Open controls"}
      >
        {panelOpen ? <X className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed top-0 right-0 h-full z-40 shadow-desk-hero"
            onClick={(e) => e.stopPropagation()}
          >
            <ControlsPanel
              onAdd={add}
              onRemoveLast={removeLast}
              onShuffle={shuffle}
              onClear={clear}
              scenarioId={scenarioId}
              scenarioStep={scenarioStep}
              scenarioStateLabel={activeState?.label ?? null}
              scenarioStateCount={scenario?.states.length ?? 0}
              scenarioPrompt={activeState?.prompt ?? null}
              onLoadScenario={loadScenario}
              onScenarioStep={stepScenario}
              onJumpToStep={jumpToStep}
              intent={intent}
              onIntent={(i) => { setJsonOverride(null); setIntent(i); }}
              debug={debug}
              onDebug={setDebug}
              equalSpacing={equalSpacing}
              onEqualSpacing={setEqualSpacing}
              overlapAmount={overlapAmount}
              onOverlapAmount={setOverlapAmount}
              cornerRadius={cornerRadius}
              onCornerRadius={setCornerRadius}
              rotationAmount={rotationAmount}
              onRotationAmount={setRotationAmount}
              onApplyJson={applyJson}
              onClearJson={() => setJsonOverride(null)}
              jsonActive={jsonOverride !== null}
              itemCount={items.length}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
