import { useCallback, useEffect, useRef, useState } from "react";
import { useFrogLore } from "../lib/frogLore";
import { COMIC_PAGES } from "../lib/frogComicPanels";

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

  // The book mounts fresh each time it opens, so splash/page state never needs
  // an imperative reset.
  return open ? <ComicBook onClose={closeComic} /> : null;
}

function ComicBook({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [view, setView] = useState<{ i: number; dir: "next" | "prev" }>({ i: 0, dir: "next" });
  const overlayRef = useRef<HTMLDivElement>(null);

  const last = COMIC_PAGES.length - 1;
  const pg = COMIC_PAGES[view.i];

  const go = useCallback(
    (delta: number) => {
      setView((v) => {
        const n = Math.min(last, Math.max(0, v.i + delta));
        return n === v.i ? v : { i: n, dir: delta > 0 ? "next" : "prev" };
      });
    },
    [last],
  );

  // Auto-advance the splash into the comic.
  useEffect(() => {
    if (phase !== "splash") return;
    const t = window.setTimeout(() => setPhase("reading"), 1700);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Warm the next page's image so the page-turn never lands on a blank sheet.
  useEffect(() => {
    const next = COMIC_PAGES[view.i + 1];
    if (next) {
      const img = new Image();
      img.src = next.src;
    }
  }, [view.i]);

  // Lock background scroll + wire keyboard while mounted (= while open).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [phase, go, onClose]);

  // Open the comic in real fullscreen for the dramatic effect (and so the
  // controls never get clipped by the browser chrome). The open paths are
  // user-gesture driven (tapping the third frog, the footer link), so the
  // request is allowed; if it's ever blocked (e.g. deep-linked /grenouille) we
  // just stay windowed — the layout fits either way. Esc/F11 exits fullscreen
  // without closing the book; closing the book exits fullscreen.
  useEffect(() => {
    const el = overlayRef.current;
    if (el?.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center overflow-hidden bg-ink/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="La Complainte de la Grenouille"
    >
      {phase === "splash" ? (
        <div className="flex flex-1 items-center justify-center">
          <SplashBurst onDone={() => setPhase("reading")} />
        </div>
      ) : (
        <>
          {/* top bar */}
          <div className="flex w-full max-w-5xl shrink-0 items-center justify-between px-4 pt-4 text-xs text-parchment/70">
            <span className="uppercase tracking-[0.3em]">La Complainte de la Grenouille</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 py-1 text-parchment/70 hover:text-parchment hover:underline"
            >
              Passer ✕
            </button>
          </div>

          {/* the page — the printed edition; spreads are landscape, covers portrait */}
          <div className="flex w-full min-h-0 flex-1 items-center justify-center px-4 py-2">
            <div className="comic-stage flex max-h-full max-w-5xl items-center justify-center">
              <article
                key={pg.id}
                className={`overflow-hidden rounded-md border-[3px] border-ink bg-card shadow-[6px_8px_0_rgba(0,0,0,0.45)] ${
                  view.dir === "next" ? "comic-page-next" : "comic-page-prev"
                }`}
              >
                <img
                  src={pg.src}
                  alt={pg.alt}
                  className="block h-auto w-auto max-w-full select-none object-contain"
                  style={{ maxHeight: "calc(100dvh - 200px)" }}
                  draggable={false}
                />
              </article>
            </div>
          </div>

          {/* dots */}
          <div className="flex w-full max-w-5xl shrink-0 flex-wrap items-center justify-center gap-1.5 px-4 pt-2">
            {COMIC_PAGES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Page ${idx + 1}`}
                onClick={() =>
                  setView((v) => (idx === v.i ? v : { i: idx, dir: idx > v.i ? "next" : "prev" }))
                }
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === view.i ? "bg-parchment" : "bg-parchment/35 hover:bg-parchment/60"
                }`}
              />
            ))}
          </div>

          {/* controls */}
          <div className="flex shrink-0 items-center gap-3 px-4 pb-5 pt-3">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={view.i === 0}
              className="rounded border border-parchment/30 px-4 py-2 text-sm font-medium text-parchment/80 transition-colors hover:bg-parchment/10 disabled:opacity-30"
            >
              ← Précédent
            </button>
            {view.i < last ? (
              <button
                type="button"
                onClick={() => go(1)}
                className="rounded bg-parchment px-5 py-2 text-sm font-semibold text-ink hover:bg-parchment/90"
              >
                {view.i === 0 ? "Ouvrir →" : "Suivant →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
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
