import { useState } from "react";
import Frog from "./frog/Frog";
import { useFrogLore } from "../lib/frogLore";

/**
 * One candidate hiding place for a frog. It only actually renders if THIS
 * device's saved pattern chose this slot (so each device hides its 3 frogs in
 * different places). Subtly findable: small and low-contrast, no label.
 *
 * Tapping it kills the frog — eyes turn to X's and a little soul floats out of
 * the body (grim, on-brand) — and records the find. The third find unlocks and
 * auto-launches the comic. A dead frog stays faintly slumped and can't be
 * re-counted.
 */
export default function FrogSpot({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  const chosen = useFrogLore((s) => s.chosen.includes(slot));
  const found = useFrogLore((s) => s.found.includes(slot));
  const findFrog = useFrogLore((s) => s.findFrog);
  const [dying, setDying] = useState(false);

  if (!chosen) return null;

  const dead = found || dying;

  const onClick = () => {
    if (found) return;
    setDying(true);
    findFrog(slot);
  };

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={dead ? "A frog (found)" : "A small frog"}
        title={dead ? "…" : undefined}
        className={`transition-opacity ${dying ? "frog-croak" : ""} ${
          dead
            ? "cursor-default text-ink/30 opacity-50"
            : "text-ink/25 opacity-30 hover:opacity-90 hover:text-bleu"
        }`}
      >
        <Frog className="h-5 w-5" dead={dead} />
      </button>
      {dying && (
        <>
          {/* the little soul, leaving the body */}
          <span className="frog-soul pointer-events-none absolute -top-1 left-1/2 text-bleu/60">
            <Frog className="h-4 w-4" />
          </span>
          <span
            aria-hidden
            className="frog-puff pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none text-[10px] italic text-ink/50"
          >
            croâ…
          </span>
        </>
      )}
    </span>
  );
}
