import { useState } from "react";
import Frog from "./frog/Frog";
import { useFrogLore } from "../lib/frogLore";

/**
 * One candidate hiding place for a frog. It only renders if THIS device's
 * current pattern includes this slot (so each device hides its frogs in
 * different places, and they move around as the game is replayed). Subtly
 * findable: small and low-contrast, no label.
 *
 * Tapping it kills the frog — eyes turn to X's and a little soul floats out —
 * and records the pop. The third pop unlocks and auto-launches the comic. A
 * popped frog stays slumped until it revives (relocated) a while later.
 */
export default function FrogSpot({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  const chosen = useFrogLore((s) => s.chosen.includes(slot));
  const popped = useFrogLore((s) => Boolean(s.popped[slot]));
  const popFrog = useFrogLore((s) => s.popFrog);
  const [dying, setDying] = useState(false);

  if (!chosen) return null;

  const dead = popped || dying;

  const onClick = () => {
    if (popped) return;
    setDying(true);
    popFrog(slot);
  };

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={dead ? "A frog (popped)" : "A small frog"}
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
