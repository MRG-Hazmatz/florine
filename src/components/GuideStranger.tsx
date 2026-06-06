import type { ReactNode } from "react";
import { faceFor, strangerUrl } from "../lib/characters";

/**
 * The "guide" character: an uncanny woodcut face that delivers normal, helpful
 * copy. Creepy aesthetic, clean pedagogy — the face unsettles, the words don't.
 */
export default function GuideStranger({
  seed,
  face,
  caption,
  children,
}: {
  seed?: string;
  face?: number;
  caption?: string;
  children: ReactNode;
}) {
  const src = face !== undefined ? strangerUrl(face) : faceFor(seed ?? "florine");
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
        {children}
      </div>
    </div>
  );
}
