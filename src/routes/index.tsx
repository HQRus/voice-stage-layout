import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  const [items, setItems] = useState<MediaItem[]>(() => randomMixedSet(4));
  const [intent, setIntent] = useState<LayoutIntent>("auto");
  const [debug, setDebug] = useState(false);
  const [equalSpacing, setEqualSpacing] = useState(false);
  const [allowOverlap, setAllowOverlap] = useState(true);
  const [jsonOverride, setJsonOverride] = useState<PositionedItem[] | null>(
    null,
  );

  const add = (t: MediaItem["type"]) => {
    setJsonOverride(null);
    setItems((prev) => [...prev, makeItem(t)]);
  };

  const addRandom = () => {
    setJsonOverride(null);
    setItems((prev) => [...prev, ...randomMixedSet(3 + Math.floor(Math.random() * 3))]);
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
      setItems(parsed.map((p) => ({ id: p.id, type: p.type, content: p.content, meta: p.meta })));
      setJsonOverride(parsed);
    } catch (e) {
      alert("Invalid layout JSON: " + (e as Error).message);
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <section className="flex-1 h-full">
        <Canvas
          items={items}
          intent={intent}
          debug={debug}
          equalSpacing={equalSpacing}
          allowOverlap={allowOverlap}
          overrideFrames={jsonOverride}
        />
      </section>
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
    </main>
  );
}
