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
  const stageRef = useRef<HTMLDivElement>(null);
  // Measured size of the reading area. The sheet is sized in JS from this and
  // the page's real pixel dimensions — an exact fit-to-window like the design
  // viewer: the WHOLE spread is always visible, never clipped, never distorted.
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  // True pixel size of each loaded image, keyed by src. The manifest values are
  // the pre-load estimate; onLoad overwrites them with the browser's real
  // measurement, so a stale/wrong manifest dimension can never misfit a page.
  const [natural, setNatural] = useState<Record<string, { w: number; h: number }>>({});

  const last = COMIC_PAGES.length - 1;
  const pg = COMIC_PAGES[view.i];

  // Plain measurement (scheduled tick + window resize) rather than
  // ResizeObserver: RO delivery rides the rendering pipeline, which some
  // embedded renderers throttle; resize events and timers always fire. The
  // stage only changes size with the window, so this is complete coverage.
  useEffect(() => {
    if (phase !== "reading") return;
    const measure = () => {
      const el = stageRef.current;
      if (el) {
        setBox((b) =>
          b.w === el.clientWidth && b.h === el.clientHeight
            ? b
            : { w: el.clientWidth, h: el.clientHeight },
        );
      }
    };
    const t = window.setTimeout(measure, 0);
    // Change-guarded slow poll as a safety net for environments where the
    // resize event is unreliable; setBox bails out when nothing changed.
    const iv = window.setInterval(measure, 1000);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(iv);
      window.removeEventListener("resize", measure);
    };
  }, [phase]);

  // Contain-fit inside the stage, minus a little breathing room + the frame.
  // Prefer the browser's measured natural size over the manifest estimate.
  const dim = natural[pg.src] ?? { w: pg.w, h: pg.h };
  const pad = 12;
  const scale = Math.min((box.w - pad) / dim.w, (box.h - pad) / dim.h);
  const fitW = Math.max(1, Math.floor(dim.w * scale));
  const fitH = Math.max(1, Math.floor(dim.h * scale));

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

          {/* the page — an exact fit-to-window, like the design viewer: the
              sheet's display size is computed from the measured stage and the
              page's intrinsic dimensions, so the WHOLE spread is always on
              screen with the controls below it. */}
          <div
            ref={stageRef}
            className="comic-stage flex w-full min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-2"
          >
            {box.w > 0 && (
              <img
                key={pg.id}
                src={pg.src}
                alt={pg.alt}
                width={fitW}
                height={fitH}
                style={{ width: fitW, height: fitH }}
                onLoad={(e) => {
                  const el = e.currentTarget;
                  const cur = natural[pg.src];
                  if (!cur || cur.w !== el.naturalWidth || cur.h !== el.naturalHeight) {
                    setNatural((m) => ({
                      ...m,
                      [pg.src]: { w: el.naturalWidth, h: el.naturalHeight },
                    }));
                  }
                }}
                className={`flex-none select-none rounded-md border-[3px] border-ink bg-card shadow-[6px_8px_0_rgba(0,0,0,0.45)] ${
                  view.dir === "next" ? "comic-page-next" : "comic-page-prev"
                }`}
                draggable={false}
              />
            )}
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
          <div className="flex shrink-0 items-center gap-3 px-4 pb-2 pt-3">
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

          {/* printed-page caption, like the design viewer */}
          <p className="shrink-0 pb-3 text-center text-xs italic text-parchment/45">
            {view.i === 0
              ? "couverture"
              : view.i === last
                ? "quatrième de couverture"
                : `pages ${2 * view.i}–${2 * view.i + 1}`}
            {" · La Complainte de la Grenouille · Florine Comics"}
          </p>
        </>
      )}
    </div>
  );
}
