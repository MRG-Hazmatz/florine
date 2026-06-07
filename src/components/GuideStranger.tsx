import { useState } from "react";
import type { ReactNode } from "react";
import { faceFor, strangerUrl } from "../lib/characters";
import { SPLASHES } from "../lib/splashes";

/**
 * The "guide" character: an uncanny woodcut face that delivers normal, helpful
 * copy. By default it shows a random splash line (Minecraft-style) per visit.
 * If `children` is given, `pinnedOdds` (0..1) is the chance it shows that pinned
 * message instead of a splash — the home guide pins a beloved line at high odds.
 */
export default function GuideStranger({
  seed,
  face,
  caption,
  children,
  pinnedOdds = 0,
}: {
  seed?: string;
  face?: number;
  caption?: string;
  children?: ReactNode;
  pinnedOdds?: number;
}) {
  const src = face !== undefined ? strangerUrl(face) : faceFor(seed ?? "florine");

  // Roll once on mount so the text is stable across re-renders.
  const [text] = useState<ReactNode>(() => {
    const usePinned = children !== undefined && Math.random() < pinnedOdds;
    return usePinned ? children : SPLASHES[Math.floor(Math.random() * SPLASHES.length)];
  });

  return (
    <div className="flex items-start gap-3">
      <figure className="shrink-0 -rotate-2">
        <div className="h-20 w-20 overflow-hidden border border-ink/70 bg-parchment shadow-[3px_3px_0_rgba(23,18,12,0.45)]">
          <img src={src} alt="" className="h-full w-full object-contain mix-blend-multiply" />
        </div>
        {caption && (
          <figcaption className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-ink/40">
            {caption}
          </figcaption>
        )}
      </figure>
      <div className="relative flex-1 self-center rounded-md border border-ink/25 bg-card/60 p-3 text-sm text-ink/80">
        <span className="absolute -left-1.5 top-5 h-3 w-3 rotate-45 border-b border-l border-ink/25 bg-card/60" />
        {text}
      </div>
    </div>
  );
}
