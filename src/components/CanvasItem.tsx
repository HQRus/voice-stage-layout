import { motion } from "framer-motion";
import { Play, Pause, Calendar, Mail, Check, CloudSun, TrendingUp, TrendingDown, MapPin, Link2, BarChart3, Code as CodeIcon, CheckSquare, Square, Plane, Star } from "lucide-react";
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

  // For visible-overflow types (video, storyboardFrame, section), the inner
  // child renders the visible rectangle, so the shadow must be applied there.
  const innerHandlesShadow = item.type === "section" || item.type === "storyboardFrame";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.4, rotate: 0, x: centerX, y: centerY, width, height }}
      animate={{ x, y, width, height, rotate: rotation, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4, x: centerX, y: centerY }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 1.1, delay: 0.2 }}
      style={{
        position: "absolute",
        zIndex,
        top: 0,
        left: 0,
        borderRadius: `${cornerRadius}px`,
        overflow: innerHandlesShadow ? "visible" : "hidden",
        boxShadow: innerHandlesShadow ? "none" : boxShadow,
      }}
      className="will-change-transform"
    >
      <ItemContent item={item} cornerRadius={cornerRadius} boxShadow={boxShadow} />
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

function ItemContent({ item, cornerRadius, boxShadow }: { item: PositionedItem; cornerRadius: number; boxShadow: string }) {
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
      return (
        <div className="w-full h-full flex flex-col">
          <div
            className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden"
            style={{
              ...radiusStyle,
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
              boxShadow,
            }}
          >
            <div className="absolute inset-0 opacity-30" style={{ background: item.content }} />
            <div className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            </div>
          </div>
          {hasCaption && (
            <div className="pt-3 px-1 text-sm font-display font-medium flex items-center justify-between text-foreground/80 shrink-0">
              <span className="truncate">{title}</span>
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
      const fontSize = Math.max(28, Math.min(80, Math.sqrt(area) / 7));
      return (
        <div
          className={`w-full h-full ${shadow} bg-card p-8 flex flex-col justify-center font-display text-foreground`}
          style={radiusStyle}
        >
          <div className="text-accent text-5xl leading-none mb-2 font-display font-bold">"</div>
          <p className="leading-[1.1] tracking-tight font-semibold" style={{ fontSize }}>{item.content}</p>
        </div>
      );
    }

    case "document":
      return (
        <div className={`w-full h-full ${shadow} bg-card overflow-hidden flex flex-col`} style={radiusStyle}>
          <div className="px-8 pt-7 pb-4 border-b border-border/60">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Document</div>
            <h3 className="font-display font-bold text-3xl text-foreground mt-1 tracking-tight">{String(meta.title ?? "Untitled")}</h3>
          </div>
          <div className="px-8 py-6 overflow-y-auto text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap font-display">
            {item.content}
          </div>
        </div>
      );

    case "logo": {
      const color = (meta.color as string | undefined) ?? "#111";
      return (
        <div className={`w-full h-full ${shadow} bg-card flex items-center justify-center p-6`} style={radiusStyle}>
          <div className="font-display tracking-tight font-bold" style={{ color, fontSize: Math.max(28, Math.min(item.width, item.height) / 4.5) }}>
            {item.content}
          </div>
        </div>
      );
    }

    // -------- agent surfaces --------
    case "concept": {
      const title = String(meta.title ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card p-8 flex flex-col`} style={radiusStyle}>
          <h3 className="font-display font-bold text-5xl text-foreground leading-[1.05] tracking-tight">{title}</h3>
          <p className="text-lg text-foreground/75 leading-snug mt-5 font-display">{item.content}</p>
          <div className="mt-auto pt-4 text-[11px] text-muted-foreground tracking-widest uppercase">
            Pick this →
          </div>
        </div>
      );
    }

    case "palette": {
      const swatches = (meta.swatches as string[] | undefined) ?? [];
      return (
        <div className={`w-full h-full ${shadow} bg-card flex flex-col`} style={radiusStyle}>
          <div className="px-5 pt-4 pb-3 flex items-baseline justify-between">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Palette</div>
            <div className="text-base font-display font-semibold text-foreground/80">{item.content}</div>
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
      const alphabetSize = Math.max(22, Math.min(item.width / 14, item.height * 0.18));
      return (
        <div className={`w-full h-full ${shadow} bg-card p-8 flex flex-col justify-between`} style={radiusStyle}>
          <div
            className="font-display font-bold text-foreground leading-[1.05] tracking-tight break-words"
            style={{ fontSize: alphabetSize }}
          >
            ABCDEFGHIJKLM
            <br />
            NOPQRSTUVWXYZ
            <br />
            abcdefghijklm
            <br />
            nopqrstuvwxyz
          </div>
          <div className="mt-6 pt-4 border-t border-border/60 text-base font-display font-semibold text-foreground tracking-tight">
            {display}
          </div>
        </div>
      );
    }

    case "audio": {
      const title = String(meta.title ?? "Untitled");
      const artist = String(meta.artist ?? "");
      const duration = String(meta.duration ?? "");
      const w = item.width;
      const h = item.height;

      // Size tiers based on the dynamic bounding box
      const tier: "micro" | "compact" | "regular" | "wide" =
        w < 180 || h < 70 ? "micro"
        : w < 280 ? "compact"
        : w < 460 ? "regular"
        : "wide";

      const pad = tier === "micro" ? "px-3 py-2" : tier === "compact" ? "px-4 py-3" : "px-6 py-5";
      const gap = tier === "micro" ? "gap-2" : tier === "compact" ? "gap-3" : "gap-5";
      const btn = tier === "micro" ? 32 : tier === "compact" ? 40 : 48;
      const titleSize = tier === "micro" ? "text-xs" : tier === "compact" ? "text-sm" : "text-sm";
      const showArtist = tier !== "micro" && h >= 72;
      const showWave = h >= 80 && w >= 200;
      const showDuration = tier !== "micro" && w >= 240;
      // wave bar count scales with width
      const barCount = Math.max(12, Math.min(64, Math.floor((w - btn - 80) / 5)));
      const waveH = Math.max(18, Math.min(40, h * 0.28));

      return (
        <div className={`w-full h-full ${shadow} bg-card ${pad} flex items-center ${gap} min-w-0`} style={radiusStyle}>
          <button
            className="rounded-full bg-foreground text-background flex items-center justify-center shrink-0"
            style={{ width: btn, height: btn }}
          >
            <Play style={{ width: btn * 0.42, height: btn * 0.42 }} className="fill-current ml-[1px]" />
          </button>
          <div className="flex-1 min-w-0">
            <div className={`${titleSize} text-foreground font-medium truncate`}>{title}</div>
            {showArtist && artist && (
              <div className="text-xs text-muted-foreground truncate">{artist}</div>
            )}
            {showWave && (
              <div className="mt-2 flex items-end gap-[2px]" style={{ height: waveH }}>
                {Array.from({ length: barCount }).map((_, i) => {
                  const hh = 30 + Math.sin(i * 0.6) * 30 + (i % 5) * 6;
                  return <span key={i} className="w-[3px] bg-accent/70 rounded-full" style={{ height: `${Math.max(8, Math.min(100, hh))}%` }} />;
                })}
              </div>
            )}
          </div>
          {showDuration && duration && (
            <div className="text-xs text-muted-foreground tabular-nums shrink-0">{duration}</div>
          )}
        </div>
      );
    }

    case "storyboardFrame": {
      const frame = Number(meta.frame ?? 0);
      const caption = String(meta.caption ?? "");
      return (
        <div className="w-full h-full flex flex-col">
          <div
            className="relative flex-1 min-h-0 w-full overflow-hidden bg-card"
            style={{ ...radiusStyle, background: item.content, boxShadow }}
          >
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 text-xs tabular-nums font-display font-semibold text-foreground">
              {String(frame).padStart(2, "0")}
            </div>
          </div>
          {caption && (
            <div className="pt-3 px-1 text-sm text-foreground/75 leading-snug font-display shrink-0">
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
            <div className="text-base text-foreground font-display font-semibold">{item.content} <span className="text-muted-foreground text-sm font-normal">· {duration}</span></div>
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
            <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center"><Mail className="w-5 h-5" /></div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Email · sent</div>
              <div className="text-sm text-foreground/70 truncate font-display">to {to}</div>
            </div>
          </div>
          <div className="px-7 py-6 flex-1">
            <h3 className="font-display font-bold text-2xl text-foreground leading-tight tracking-tight">{subject}</h3>
            <p className="text-lg text-foreground/80 leading-relaxed mt-4 whitespace-pre-wrap font-display">{item.content}</p>
          </div>
          <div className="px-7 py-3 border-t border-border/60 text-[10px] text-muted-foreground tracking-[0.14em] uppercase flex items-center gap-1.5">
            <Check className="w-3 h-3 text-accent" /> Delivered
          </div>
        </div>
      );
    }



    case "section":
      return (
        <div className="w-full h-full flex items-end pb-3 px-1 border-b border-border/60">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{item.content}</div>
        </div>
      );

    // -------- iconic AI widgets --------
    case "weather": {
      const location = String(meta.location ?? "");
      const condition = String(meta.condition ?? "");
      const high = meta.high as number | undefined;
      const low = meta.low as number | undefined;
      return (
        <div className={`w-full h-full ${shadow} bg-card p-6 flex flex-col justify-between`} style={radiusStyle}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{location}</div>
              <div className="text-sm text-foreground/80 mt-1">{condition}</div>
            </div>
            <CloudSun className="w-10 h-10 text-accent" strokeWidth={1.4} />
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display font-bold text-foreground leading-none" style={{ fontSize: Math.min(item.height * 0.45, 96) }}>
              {item.content}
            </div>
            {(high !== undefined || low !== undefined) && (
              <div className="text-xs text-muted-foreground tabular-nums">H {high}° · L {low}°</div>
            )}
          </div>
        </div>
      );
    }

    case "stock": {
      const name = String(meta.name ?? "");
      const price = String(meta.price ?? "");
      const change = String(meta.change ?? "");
      const changePct = String(meta.changePct ?? "");
      const up = Boolean(meta.up);
      const spark = (meta.spark as number[] | undefined) ?? [];
      const max = Math.max(...spark, 1);
      const min = Math.min(...spark, 0);
      const range = Math.max(max - min, 1);
      const w = 100;
      const h = 30;
      const points = spark.map((v, i) => `${(i / (spark.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
      const accentColor = up ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";
      return (
        <div className={`w-full h-full ${shadow} bg-card p-6 flex flex-col`} style={radiusStyle}>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-mono text-base text-foreground font-medium">{item.content}</div>
              <div className="text-xs text-muted-foreground truncate">{name}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-foreground tabular-nums" style={{ fontSize: Math.min(item.height * 0.22, 32) }}>${price}</div>
              <div className="text-xs flex items-center justify-end gap-1 tabular-nums" style={{ color: accentColor }}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change} ({changePct})
              </div>
            </div>
          </div>
          {spark.length > 1 && (
            <div className="flex-1 mt-3 min-h-0">
              <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
                <polyline points={points} fill="none" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      );
    }

    case "map": {
      const location = String(meta.location ?? "");
      const subtitle = String(meta.subtitle ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card flex flex-col overflow-hidden`} style={radiusStyle}>
          <div
            className="relative flex-1 min-h-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.94 0.02 220) 0%, oklch(0.88 0.03 200) 100%)",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 24px, oklch(0.7 0.02 220 / 0.18) 24px 25px), repeating-linear-gradient(90deg, transparent 0 24px, oklch(0.7 0.02 220 / 0.18) 24px 25px)",
            }}
          >
            {/* fake roads */}
            <div className="absolute inset-x-0 top-[55%] h-[3px] bg-white/80 -rotate-3" />
            <div className="absolute inset-y-0 left-[40%] w-[3px] bg-white/80 rotate-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <MapPin className="w-8 h-8 text-accent fill-accent/30" strokeWidth={2} />
            </div>
          </div>
          <div className="px-5 py-3 border-t border-border/60">
            <div className="text-sm font-medium text-foreground">{item.content}</div>
            {(location || subtitle) && (
              <div className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle || location}</div>
            )}
          </div>
        </div>
      );
    }

    case "link": {
      const domain = String(meta.domain ?? "");
      const description = String(meta.description ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card p-5 flex flex-col gap-2`} style={radiusStyle}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded bg-accent/20 text-accent flex items-center justify-center">
              <Link2 className="w-3 h-3" />
            </div>
            <span className="truncate">{domain}</span>
          </div>
          <div className="text-base text-foreground font-medium leading-snug line-clamp-2">{item.content}</div>
          {description && (
            <div className="text-xs text-foreground/70 leading-relaxed line-clamp-3">{description}</div>
          )}
        </div>
      );
    }

    case "metric": {
      const label = String(meta.label ?? "");
      const delta = String(meta.delta ?? "");
      const up = Boolean(meta.up);
      const sub = String(meta.sub ?? "");
      const deltaColor = up ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)";
      return (
        <div className={`w-full h-full ${shadow} bg-card p-6 flex flex-col justify-center`} style={radiusStyle}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
          <div className="font-display font-bold text-foreground mt-2 leading-none tabular-nums" style={{ fontSize: Math.min(item.height * 0.42, 80) }}>
            {item.content}
          </div>
          {delta && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-medium tabular-nums flex items-center gap-1" style={{ color: deltaColor }}>
                {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {delta}
              </span>
              {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
            </div>
          )}
        </div>
      );
    }

    case "chart": {
      const bars = (meta.bars as Array<{ l: string; v: number }> | undefined) ?? [];
      const max = Math.max(...bars.map((b) => b.v), 1);
      return (
        <div className={`w-full h-full ${shadow} bg-card p-5 flex flex-col`} style={radiusStyle}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-accent" />
            <div className="text-xs text-foreground/80 font-medium">{item.content}</div>
          </div>
          <div className="flex-1 flex items-end gap-2 mt-4 min-h-0">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                <div className="w-full bg-accent/80 rounded-t" style={{ height: `${(b.v / max) * 100}%` }} />
                <div className="text-[10px] text-muted-foreground">{b.l}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "code": {
      const language = String(meta.language ?? "");
      const filename = String(meta.filename ?? "");
      return (
        <div className={`w-full h-full ${shadow} flex flex-col overflow-hidden`} style={{ ...radiusStyle, background: "#0f1419" }}>
          <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <CodeIcon className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/80 font-mono">{filename || language}</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
              <span className="w-2 h-2 rounded-full bg-white/15" />
            </div>
          </div>
          <pre className="flex-1 overflow-auto p-4 text-[12px] leading-relaxed font-mono text-white/85 whitespace-pre">{item.content}</pre>
        </div>
      );
    }

    case "checklist": {
      const list = (meta.items as Array<{ t: string; d: boolean }> | undefined) ?? [];
      return (
        <div className={`w-full h-full ${shadow} bg-card p-8 flex flex-col`} style={radiusStyle}>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Checklist</div>
          <div className="text-2xl text-foreground font-semibold mt-1">{item.content}</div>
          <div className="mt-6 space-y-4 overflow-y-auto">
            {list.map((it, i) => (
              <div key={i} className="flex items-center gap-4 text-lg">
                {it.d
                  ? <CheckSquare className="w-6 h-6 text-accent shrink-0" />
                  : <Square className="w-6 h-6 text-muted-foreground shrink-0" />}
                <span className={it.d ? "text-muted-foreground line-through" : "text-foreground"}>{it.t}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "product": {
      const price = String(meta.price ?? "");
      const rating = meta.rating as number | undefined;
      const image = String(meta.image ?? "");
      const brand = String(meta.brand ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card flex flex-col overflow-hidden`} style={radiusStyle}>
          <div className="flex-1 min-h-0" style={{ background: image || "var(--muted)" }} />
          <div className="px-5 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {brand && <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{brand}</div>}
              <div className="text-sm text-foreground font-medium truncate">{item.content}</div>
              {rating !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Star className="w-3 h-3 fill-accent text-accent" /> {rating.toFixed(1)}
                </div>
              )}
            </div>
            <div className="text-sm text-foreground tabular-nums font-medium shrink-0">{price}</div>
          </div>
        </div>
      );
    }

    case "flight": {
      const from = String(meta.from ?? "");
      const to = String(meta.to ?? "");
      const fromTime = String(meta.fromTime ?? "");
      const toTime = String(meta.toTime ?? "");
      const duration = String(meta.duration ?? "");
      const airline = String(meta.airline ?? "");
      const date = String(meta.date ?? "");
      return (
        <div className={`w-full h-full ${shadow} bg-card p-6 flex flex-col justify-between`} style={radiusStyle}>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{airline} · {item.content}</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center justify-between gap-4 my-3">
            <div className="text-center">
              <div className="font-display font-bold text-foreground leading-none" style={{ fontSize: Math.min(item.height * 0.22, 40) }}>{from}</div>
              <div className="text-xs text-muted-foreground tabular-nums mt-1">{fromTime}</div>
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex-1 border-t border-dashed border-border" />
              <Plane className="w-4 h-4 text-accent rotate-90 shrink-0" />
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-foreground leading-none" style={{ fontSize: Math.min(item.height * 0.22, 40) }}>{to}</div>
              <div className="text-xs text-muted-foreground tabular-nums mt-1">{toTime}</div>
            </div>
          </div>
          {duration && <div className="text-center text-xs text-muted-foreground">{duration} · nonstop</div>}
        </div>
      );
    }

    case "poll": {
      const opts = (meta.options as Array<{ l: string; v: number }> | undefined) ?? [];
      const total = opts.reduce((s, o) => s + o.v, 0) || 1;
      return (
        <div className={`w-full h-full ${shadow} bg-card p-6 flex flex-col`} style={radiusStyle}>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Poll</div>
          <div className="text-base text-foreground font-medium mt-1 leading-snug">{item.content}</div>
          <div className="mt-4 space-y-3">
            {opts.map((o, i) => {
              const pct = Math.round((o.v / total) * 100);
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-foreground">{o.l}</span>
                    <span className="text-muted-foreground tabular-nums">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
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
