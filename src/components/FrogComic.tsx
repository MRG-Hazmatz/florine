import { useCallback, useEffect, useRef, useState } from "react";
import { useFrogLore } from "../lib/frogLore";
import { COMIC_PANELS } from "../lib/frogComicPanels";

type Phase = "splash" | "reading";

/** A comic-book "SFX" starburst — fires when the third frog is tapped. */
function SplashBurst({ onDone }: { onDone: () => void }) {
  // jagged star: alternate outer/inner radius around the circle
  const pts: string[] = [];
  const spikes = 16;
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 56 : 100;
    pts.push(`${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`);
  }
  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Continue"
      className="splash-pop relative flex items-center justify-center"
    >
      <svg viewBox="0 0 200 200" className="h-72 w-72 max-w-[80vw]">
        <polygon
          points={pts.join(" ")}
          fill="var(--color-rouge)"
          stroke="var(--color-ink)"
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <polygon
          points={pts.join(" ")}
          fill="none"
          stroke="var(--color-parchment)"
          strokeWidth={1.5}
          opacity={0.5}
          style={{ transform: "scale(0.9)", transformOrigin: "center" }}
        />
      </svg>
      <span className="absolute font-display text-5xl font-bold uppercase tracking-wider text-parchment drop-shadow-[2px_2px_0_rgba(23,18,12,0.6)]">
        Croâ !
      </span>
    </button>
  );
}

/**
 * "La Complainte de la Grenouille" — the hidden origin comic, framed like a
 * real comic book: a comic-SFX splash, then a cryptic COVER, the story PANELS,
 * and a self-referential BACK COVER. Page-turn between pages; ←/→ navigate,
 * Space advances, Esc / "Passer" closes.
 */
export default function FrogComic() {
  const open = useFrogLore((s) => s.open);
  const closeComic = useFrogLore((s) => s.closeComic);

  const [phase, setPhase] = useState<Phase>("splash");
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const iRef = useRef(0);
  iRef.current = i;

  const last = COMIC_PANELS.length - 1;
  const panel = COMIC_PANELS[i];

  const go = useCallback(
    (delta: number) => {
      const n = Math.min(last, Math.max(0, iRef.current + delta));
      if (n !== iRef.current) {
        setDir(delta > 0 ? "next" : "prev");
        setI(n);
      }
    },
    [last],
  );

  // Reset to the splash + first page each time it opens.
  useEffect(() => {
    if (open) {
      setPhase("splash");
      setI(0);
      setDir("next");
    }
  }, [open]);

  // Auto-advance the splash into the comic.
  useEffect(() => {
    if (!open || phase !== "splash") return;
    const t = window.setTimeout(() => setPhase("reading"), 1700);
    return () => window.clearTimeout(t);
  }, [open, phase]);

  // Lock background scroll + wire keyboard while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeComic();
      else if (phase === "splash") setPhase("reading");
      else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, phase, go, closeComic]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-y-auto bg-ink/85 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="La Complainte de la Grenouille"
    >
      {phase === "splash" ? (
        <SplashBurst onDone={() => setPhase("reading")} />
      ) : (
        <>
          {/* top bar */}
          <div className="flex w-full max-w-xl items-center justify-between text-xs text-parchment/70">
            <span className="uppercase tracking-[0.3em]">La Complainte de la Grenouille</span>
            <button
              type="button"
              onClick={closeComic}
              className="rounded px-2 py-1 text-parchment/70 hover:text-parchment hover:underline"
            >
              Passer ✕
            </button>
          </div>

          {/* the page */}
          <div className="comic-stage mt-3 w-full max-w-xl">
            <article
              key={panel.id}
              className={`overflow-hidden rounded-md border-[3px] border-ink bg-card shadow-[6px_8px_0_rgba(0,0,0,0.45)] ${
                dir === "next" ? "comic-page-next" : "comic-page-prev"
              }`}
            >
              <div className="relative aspect-[4/3] w-full bg-parchment">
                {panel.art}
                <span className="comic-vignette pointer-events-none absolute inset-0" />
              </div>
              {panel.kind === "story" && (
                <div className="space-y-2 border-t-2 border-ink/70 px-5 py-4 text-center">
                  {panel.title && (
                    <p className="font-display text-lg font-bold tracking-wide text-rouge">
                      {panel.title}
                    </p>
                  )}
                  <p className="font-display text-base italic leading-snug text-ink">{panel.fr}</p>
                  <p className="text-sm leading-relaxed text-ink/65">{panel.en}</p>
                </div>
              )}
            </article>
          </div>

          {/* dots */}
          <div className="mt-4 flex max-w-xl flex-wrap items-center justify-center gap-1.5">
            {COMIC_PANELS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Page ${idx + 1}`}
                onClick={() => {
                  setDir(idx > i ? "next" : "prev");
                  setI(idx);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === i ? "bg-parchment" : "bg-parchment/35 hover:bg-parchment/60"
                }`}
              />
            ))}
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={i === 0}
              className="rounded border border-parchment/30 px-4 py-2 text-sm font-medium text-parchment/80 transition-colors hover:bg-parchment/10 disabled:opacity-30"
            >
              ← Précédent
            </button>
            {i < last ? (
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded bg-parchment px-5 py-2 text-sm font-semibold text-ink hover:bg-parchment/90"
              >
                {i === 0 ? "Ouvrir →" : "Suivant →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={closeComic}
                className="rounded bg-rouge px-5 py-2 text-sm font-semibold text-white hover:bg-rouge/90"
              >
                Fermer le livre (Croâ)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
