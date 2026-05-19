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
import { makeItem, randomMixedSet } from "@/lib/sampleContent";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Composition Lab — Generative Layout Tester" },
      {
        name: "description",
        content:
          "Test generative widescreen layouts: hero, editorial, moodboard, document, logo comparison, and presentation compositions with smooth motion.",
      },
    ],
  }),
});

function Index() {
  // Start empty to avoid SSR/CSR hydration mismatch from random ids/content.
  const [items, setItems] = useState<MediaItem[]>([]);
  const [intent, setIntent] = useState<LayoutIntent>("auto");
  const [debug, setDebug] = useState(false);
  const [equalSpacing, setEqualSpacing] = useState(false);
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [jsonOverride, setJsonOverride] = useState<PositionedItem[] | null>(
    null,
  );
  const [panelOpen, setPanelOpen] = useState(true);

  // Seed an initial composition on the client only.
  useEffect(() => {
    setItems(randomMixedSet(4));
  }, []);

  const add = (t: MediaItem["type"]) => {
    setJsonOverride(null);
    setItems((prev) => [...prev, makeItem(t)]);
  };

  const addRandom = () => {
    setJsonOverride(null);
    setItems((prev) => [
      ...prev,
      ...randomMixedSet(3 + Math.floor(Math.random() * 3)),
    ]);
  };

  const removeLast = () => setItems((prev) => prev.slice(0, -1));
  const shuffle = () =>
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  const clear = () => {
    setItems([]);
    setJsonOverride(null);
  };

  const applyJson = (txt: string) => {
    try {
      const parsed = JSON.parse(txt) as PositionedItem[];
      if (!Array.isArray(parsed)) throw new Error("expected array");
      setItems(
        parsed.map((p) => ({
          id: p.id,
          type: p.type,
          content: p.content,
          meta: p.meta,
        })),
      );
      setJsonOverride(parsed);
    } catch (e) {
      alert("Invalid layout JSON: " + (e as Error).message);
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Canvas
        items={items}
        intent={intent}
        debug={debug}
        equalSpacing={equalSpacing}
        allowOverlap={allowOverlap}
        overrideFrames={jsonOverride}
      />

      {/* Floating toggle button — always visible */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-card/90 backdrop-blur border border-border shadow-desk flex items-center justify-center text-foreground hover:bg-card transition"
        aria-label={panelOpen ? "Close controls" : "Open controls"}
      >
        {panelOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <PanelRight className="w-5 h-5" />
        )}
      </button>

      {/* Overlay controls panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="fixed top-0 right-0 h-full z-40 shadow-desk-hero"
          >
            <ControlsPanel
              onAdd={add}
              onAddRandom={addRandom}
              onRemoveLast={removeLast}
              onShuffle={shuffle}
              onClear={clear}
              intent={intent}
              onIntent={(i) => {
                setJsonOverride(null);
                setIntent(i);
              }}
              debug={debug}
              onDebug={setDebug}
              equalSpacing={equalSpacing}
              onEqualSpacing={setEqualSpacing}
              allowOverlap={allowOverlap}
              onAllowOverlap={setAllowOverlap}
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
