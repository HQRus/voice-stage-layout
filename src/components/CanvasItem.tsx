import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { PositionedItem, Viewport } from "@/lib/layoutEngine";

interface Props {
  item: PositionedItem;
  debug: boolean;
  viewport: Viewport;
}

// Renders a single positioned media item.
// All position/size/rotation come from the layout engine; this component is
// dumb on purpose so the same renderer works for rule-based or AI-driven layouts.
export function CanvasItem({ item, debug, viewport }: Props) {
  const { x, y, width, height, rotation, zIndex } = item;

  // Emerge from the center of the canvas
  const centerX = viewport.width / 2 - width / 2;
  const centerY = viewport.height / 2 - height / 2;

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.4,
        rotate: 0,
        x: centerX,
        y: centerY,
        width,
        height,
      }}
      animate={{
        x,
        y,
        width,
        height,
        rotate: rotation,
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.4,
        x: centerX,
        y: centerY,
      }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 22,
        mass: 0.9,
      }}
      style={{ position: "absolute", zIndex, top: 0, left: 0 }}
      className="will-change-transform"
    >
      <ItemContent item={item} />
      {debug && (
        <div className="absolute -top-3 -left-1 text-[10px] uppercase tracking-widest bg-foreground text-background px-1.5 py-0.5 rounded-sm">
          {item.type} · {item.layoutRole}
        </div>
      )}
      {debug && (
        <div className="absolute inset-0 border border-dashed border-accent/60 rounded-[inherit] pointer-events-none" />
      )}
    </motion.div>
  );
}

function ItemContent({ item }: { item: PositionedItem }) {
  const radius = "rounded-3xl";
  const shadow =
    item.layoutRole === "hero" ? "shadow-desk-hero" : "shadow-desk";

  switch (item.type) {
    case "image":
      return (
        <div
          className={`w-full h-full ${radius} ${shadow} overflow-hidden bg-card`}
          style={{ background: item.content }}
        />
      );

    case "video":
      return (
        <div
          className={`w-full h-full ${radius} ${shadow} overflow-hidden relative flex items-center justify-center`}
          style={{
            background:
              "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-30" style={{ background: item.content }} />
          <div className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </div>
          <div className="absolute bottom-4 left-4 text-white/70 text-xs tracking-widest uppercase">
            ● Recording
          </div>
        </div>
      );

    case "text": {
      const area = item.width * item.height;
      const fontSize = Math.max(28, Math.min(120, Math.sqrt(area) / 6));
      return (
        <div
          className="w-full h-full flex items-center justify-center text-foreground font-display leading-[0.95] text-center px-6"
          style={{ fontSize }}
        >
          {item.content}
        </div>
      );
    }

    case "quote": {
      const area = item.width * item.height;
      const fontSize = Math.max(24, Math.min(72, Math.sqrt(area) / 8));
      return (
        <div
          className={`w-full h-full ${radius} ${shadow} bg-card p-10 flex flex-col justify-center font-serif-display text-foreground`}
        >
          <div className="text-accent text-5xl leading-none mb-2">"</div>
          <p className="leading-[1.1] tracking-tight" style={{ fontSize }}>
            {item.content}
          </p>
        </div>
      );
    }

    case "document":
      return (
        <div
          className={`w-full h-full ${radius} ${shadow} bg-card overflow-hidden flex flex-col`}
        >
          <div className="px-8 pt-7 pb-3 border-b border-border/60">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Document
            </div>
            <h3 className="font-serif-display text-xl text-foreground mt-1">
              On the practice of seeing
            </h3>
          </div>
          <div className="px-8 py-6 overflow-y-auto text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {item.content}
          </div>
        </div>
      );

    case "logo": {
      const color = item.meta?.color ?? "#111";
      return (
        <div
          className={`w-full h-full ${radius} ${shadow} bg-card flex items-center justify-center p-6`}
        >
          <div
            className="font-display tracking-tight"
            style={{
              color,
              fontSize: Math.max(24, Math.min(item.width, item.height) / 5),
            }}
          >
            {item.content}
          </div>
        </div>
      );
    }
  }
}
