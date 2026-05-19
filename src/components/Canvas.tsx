import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  generateLayout,
  type LayoutIntent,
  type MediaItem,
  type PositionedItem,
} from "@/lib/layoutEngine";
import { CanvasItem } from "./CanvasItem";

interface Props {
  items: MediaItem[];
  intent: LayoutIntent;
  debug: boolean;
  equalSpacing: boolean;
  overlapAmount: number;
  rotationAmount: number;
  cornerRadius: number;
  overrideFrames?: PositionedItem[] | null;
}

export function Canvas({
  items,
  intent,
  debug,
  equalSpacing,
  overlapAmount,
  rotationAmount,
  cornerRadius,
  overrideFrames,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1200, height: 700 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const result = overrideFrames
    ? { frames: overrideFrames, contentHeight: size.height, scrollable: false }
    : generateLayout(items, size, { intent, equalSpacing, overlapAmount, rotationAmount });

  const { frames, contentHeight, scrollable } = result;

  return (
    <div
      ref={ref}
      className={`relative w-full h-full bg-background ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
    >
      {debug && (
        <>
          <div className="absolute inset-x-0 top-1/2 h-px bg-accent/20" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-accent/20" />
        </>
      )}

      <div className="relative w-full" style={{ height: scrollable ? contentHeight : "100%" }}>
        <AnimatePresence mode="popLayout">
          {frames.map((f) => (
            <CanvasItem key={f.id} item={f} debug={debug} viewport={size} cornerRadius={cornerRadius} />
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-sm text-muted-foreground tracking-wide">The stage is empty</div>
        </div>
      )}
    </div>
  );
}
