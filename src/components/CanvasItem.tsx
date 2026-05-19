import { motion } from "framer-motion";
import { Play, Pause, Calendar, Mail, Check } from "lucide-react";
import type { PositionedItem, Viewport } from "@/lib/layoutEngine";

interface Props {
  item: PositionedItem;
  debug: boolean;
  viewport: Viewport;
  cornerRadius?: number;
  shadowAmount?: number; // 0–100
}

// Renders a single positioned item. Dumb on purpose so the same renderer
// works for rule-based or AI-driven (JSON) layouts.
export function CanvasItem({ item, debug, viewport, cornerRadius = 16, shadowAmount = 30 }: Props) {
  const { x, y, width, height, rotation, zIndex } = item;
  const isHero = item.layoutRole === "hero";
  const k = shadowAmount / 100;
  const blur1 = Math.round(6 + k * (isHero ? 60 : 30));
  const blur2 = Math.round(2 + k * (isHero ? 18 : 10));
  const y1 = Math.round(4 + k * (isHero ? 36 : 18));
  const y2 = Math.round(1 + k * 4);
  const a1 = (isHero ? 0.18 : 0.12) * k;
  const a2 = (isHero ? 0.10 : 0.07) * k;
  const boxShadow = shadowAmount === 0
    ? "none"
    : `0 ${y1}px ${blur1}px -${Math.round(blur1 / 3)}px rgba(15,15,20,${a1.toFixed(3)}), 0 ${y2}px ${blur2}px rgba(15,15,20,${a2.toFixed(3)})`;

  // Emerge from the center of the canvas
  const centerX = viewport.width / 2 - width / 2;
  const centerY = viewport.height / 2 - height / 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.4, rotate: 0, x: centerX, y: centerY, width, height }}
      animate={{ x, y, width, height, rotate: rotation, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4, x: centerX, y: centerY }}
      transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
      style={{
        position: "absolute",
        zIndex,
        top: 0,
        left: 0,
        borderRadius: `${cornerRadius}px`,
        overflow: (item.type === "section" || item.type === "storyboardFrame" || item.type === "video") ? "visible" : "hidden",
        boxShadow,
      }}
      className="will-change-transform"
    >
      <ItemContent item={item} cornerRadius={cornerRadius} />
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

function ItemContent({ item, cornerRadius }: { item: PositionedItem; cornerRadius: number }) {
  const shadow = ""; // box-shadow now applied on the outer motion.div via shadowAmount
  const radiusStyle = { borderRadius: `${cornerRadius}px` };
  const meta = (item.meta ?? {}) as Record<string, unknown>;

  switch (item.type) {
    case "image":
      return (
        <div
          className={`w-full h-full ${shadow} overflow-hidden bg-card`}
          style={{ ...radiusStyle, background: item.content }}
        />
      );

    case "video": {
      const title = String(meta.title ?? "");
      const duration = String(meta.duration ?? "");
      const hasCaption = Boolean(title || duration);
      const captionH = hasCaption ? 28 : 0;
      return (
        <div className="w-full h-full flex flex-col">
          <div
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{
              ...radiusStyle,
              height: `calc(100% - ${captionH}px)`,
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-30" style={{ background: item.content }} />
            <div className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </div>
          </div>
          {hasCaption && (
            <div className="pt-2 px-1 text-[11px] tracking-wider flex items-center justify-between text-foreground/75" style={{ height: captionH }}>
              <span className="font-medium truncate">{title}</span>
              <span className="tabular-nums opacity-70 shrink-0 ml-3">{duration}</span>
            </div>
          )}
        </div>
      );
    }

    case "text": {
      const area = item.width * item.height;
      const fontSize = Math.max(20, Math.min(96, Math.sqrt(area) / 7));
      return (
        <div
          className="w-full h-full flex items-center justify-center text-foreground leading-[1.05] text-center px-6"
          style={{ fontSize }}
        >
          {item.content}
        </div>
      );
    }

    case "quote": {
      const area = item.width * item.height;
      const fontSize = Math.max(20, Math.min(60, Math.sqrt(area) / 9));
      return (
        <div
          className={`w-full h-full ${shadow} bg-card p-8 flex flex-col justify-center font-serif-display text-foreground`}
          style={radiusStyle}
        >
          <div className="text-accent text-4xl leading-none mb-2">"</div>
          <p className="leading-[1.15] tracking-tight" style={{ fontSize }}>{item.content}</p>
        </div>
      );
    }

    case "document":
      return (
        <div className={`w-full h-full ${shadow} bg-card overflow-hidden flex flex-col`} style={radiusStyle}>
          <div className="px-8 pt-7 pb-3 border-b border-border/60">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Document</div>
            <h3 className="font-serif-display text-xl text-foreground mt-1">{String(meta.title ?? "Untitled")}</h3>
          </div>
          <div className="px-8 py-6 overflow-y-auto text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {item.content}
          </div>
        </div>
      );

    case "logo": {
      const color = (meta.color as string | undefined) ?? "#111";
      return (
        <div className={`w-full h-full ${shadow} bg-card flex items-center justify-center p-6`} style={radiusStyle}>
          <div className="font-display tracking-tight" style={{ color, fontSize: Math.max(24, Math.min(item.width, item.height) / 5) }}>
            {item.content}
          </div>
        </div>
      );
    }

    // -------- agent surfaces --------
    case "concept": {
      const title = String(meta.title ?? "");
      const tag = String(meta.tag ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card p-7 flex flex-col`} style={radiusStyle}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-accent">{tag}</div>
          <h3 className="font-serif-display text-2xl text-foreground mt-3 leading-tight">{title}</h3>
          <p className="text-sm text-foreground/75 leading-relaxed mt-4">{item.content}</p>
          <div className="mt-auto pt-4 text-[11px] text-muted-foreground tracking-widest uppercase">
            Pick this →
          </div>
        </div>
      );
    }

    case "brandMark": {
      const tagline = String(meta.tagline ?? "");
      const accent = String(meta.accent ?? "#c98664");
      return (
        <div
          className={`w-full h-full ${shadow} flex flex-col justify-center items-start px-10`}
          style={{ ...radiusStyle, background: `linear-gradient(135deg, ${accent}22 0%, transparent 70%)`, backgroundColor: "hsl(var(--card))" }}
        >
          <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>Brand</div>
          <h2 className="font-serif-display text-foreground mt-3 leading-[0.95]" style={{ fontSize: Math.min(item.height * 0.32, 76) }}>
            {item.content}
          </h2>
          {tagline && <p className="mt-4 text-foreground/70 text-base italic">{tagline}</p>}
        </div>
      );
    }

    case "palette": {
      const swatches = (meta.swatches as string[] | undefined) ?? [];
      return (
        <div className={`w-full h-full ${shadow} bg-card flex flex-col`} style={radiusStyle}>
          <div className="px-5 pt-4 pb-3 flex items-baseline justify-between">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Palette</div>
            <div className="text-sm text-foreground/80">{item.content}</div>
          </div>
          <div className="flex-1 flex">
            {swatches.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end p-2" style={{ background: c }}>
                <span className="text-[10px] font-mono" style={{ color: getReadable(c) }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "typeSample": {
      const display = String(meta.display ?? "Display");
      const body = String(meta.body ?? "Body");
      const sample = String(meta.sample ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card p-7 flex flex-col`} style={radiusStyle}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Typography</div>
          <div className="font-serif-display text-foreground mt-2 leading-none" style={{ fontSize: Math.min(item.height * 0.38, 110) }}>
            {item.content}
          </div>
          <div className="mt-auto space-y-2">
            <div className="text-sm text-foreground">{display} <span className="text-muted-foreground">/ Display</span></div>
            <div className="text-sm text-foreground">{body} <span className="text-muted-foreground">/ Body</span></div>
            {sample && <p className="text-foreground/70 text-sm italic mt-3">{sample}</p>}
          </div>
        </div>
      );
    }

    case "audio": {
      const title = String(meta.title ?? "Untitled");
      const artist = String(meta.artist ?? "");
      const duration = String(meta.duration ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card px-6 py-5 flex items-center gap-5`} style={radiusStyle}>
          <button className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground font-medium truncate">{title}</div>
            <div className="text-xs text-muted-foreground">{artist}</div>
            <div className="mt-3 flex items-end gap-[2px] h-8">
              {Array.from({ length: 48 }).map((_, i) => {
                const h = 30 + Math.sin(i * 0.6) * 30 + (i % 5) * 6;
                return <span key={i} className="w-[3px] bg-accent/70 rounded-full" style={{ height: `${Math.max(8, Math.min(100, h))}%` }} />;
              })}
            </div>
          </div>
          <div className="text-xs text-muted-foreground tabular-nums shrink-0">{duration}</div>
        </div>
      );
    }

    case "storyboardFrame": {
      const frame = Number(meta.frame ?? 0);
      const caption = String(meta.caption ?? "");
      const captionH = caption ? 44 : 0;
      return (
        <div className="w-full h-full flex flex-col">
          <div
            className="relative w-full overflow-hidden bg-card"
            style={{ ...radiusStyle, height: `calc(100% - ${captionH}px)`, background: item.content }}
          >
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/85 text-[11px] tabular-nums font-medium text-foreground">
              {String(frame).padStart(2, "0")}
            </div>
          </div>
          {caption && (
            <div className="pt-2 px-1 text-xs text-foreground/75 leading-snug" style={{ height: captionH }}>
              {caption}
            </div>
          )}
        </div>
      );
    }

    case "calendarSlot": {
      const day = String(meta.day ?? "");
      const duration = String(meta.duration ?? "");
      const status = String(meta.status ?? "open");
      const title = String(meta.title ?? "");
      const withWho = String(meta.with ?? "");
      const booked = status === "booked";
      return (
        <div
          className={`w-full h-full ${shadow} bg-card px-5 flex items-center gap-4 ${booked ? "" : "hover:bg-muted/40 transition cursor-pointer"}`}
          style={radiusStyle}
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${booked ? "bg-accent text-accent-foreground" : "bg-muted text-foreground/70"}`}>
            {booked ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{day}</div>
            <div className="text-base text-foreground font-medium">{item.content} <span className="text-muted-foreground text-sm font-normal">· {duration}</span></div>
            {(title || withWho) && (
              <div className="text-xs text-foreground/70 mt-0.5">{title}{withWho ? ` · with ${withWho}` : ""}</div>
            )}
          </div>
          {!booked && <div className="text-xs text-accent tracking-wider uppercase">Book →</div>}
          {booked && <div className="text-xs text-accent tracking-wider uppercase">Booked</div>}
        </div>
      );
    }

    case "email": {
      const to = String(meta.to ?? "");
      const subject = String(meta.subject ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card flex flex-col`} style={radiusStyle}>
          <div className="px-7 pt-6 pb-4 border-b border-border/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center"><Mail className="w-4 h-4" /></div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Email · sent</div>
              <div className="text-xs text-foreground/70">to {to}</div>
            </div>
          </div>
          <div className="px-7 py-5 flex-1">
            <h3 className="font-serif-display text-xl text-foreground leading-tight">{subject}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed mt-4 whitespace-pre-wrap">{item.content}</p>
          </div>
          <div className="px-7 py-3 border-t border-border/60 text-[11px] text-muted-foreground tracking-wider uppercase flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-accent" /> Delivered
          </div>
        </div>
      );
    }

    case "chatMessage": {
      const speaker = String(meta.speaker ?? "");
      const time = String(meta.time ?? "");
      const isYou = speaker.toLowerCase() === "you";
      return (
        <div className="w-full h-full flex" style={{ justifyContent: isYou ? "flex-end" : "flex-start" }}>
          <div className={`max-w-[78%] px-4 py-3 rounded-2xl ${isYou ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-60 mb-1">{speaker} · {time}</div>
            <div className="text-sm leading-snug">{item.content}</div>
          </div>
        </div>
      );
    }

    case "section":
      return (
        <div className="w-full h-full flex items-end pb-3 border-b border-border/60">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{item.content}</div>
        </div>
      );
  }
}

// crude readable text color for a swatch
function getReadable(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#fff";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#1a1a1a" : "#ffffffcc";
}

// Silence unused warning
void Pause;
