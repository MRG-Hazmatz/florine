import { useState } from "react";
import Frog from "./frog/Frog";
import { useFrogLore, type FrogId } from "../lib/frogLore";

/**
 * One of the three hidden frogs. Subtly findable: small and low-contrast, no
 * label, but spottable if you look. Clicking it gives a little "croâ" puff,
 * records the find, and — on the third unique frog — the store opens the comic.
 * Once found, it stays faintly marked so it can't be re-counted.
 */
export default function FrogSpot({
  id,
  className = "",
}: {
  id: FrogId;
  className?: string;
}) {
  const found = useFrogLore((s) => s.found.includes(id));
  const findFrog = useFrogLore((s) => s.findFrog);
  const [croak, setCroak] = useState(false);

  const onClick = () => {
    if (!found) {
      setCroak(true);
      window.setTimeout(() => setCroak(false), 700);
    }
    findFrog(id);
  };

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={found ? "A frog (found)" : "A small frog"}
        title={found ? "Croâ." : undefined}
        className={`transition-opacity ${croak ? "frog-croak" : ""} ${
          found
            ? "cursor-default text-bleu/40 opacity-50"
            : "text-ink/25 opacity-30 hover:opacity-90 hover:text-bleu"
        }`}
      >
        <Frog className="h-5 w-5" />
      </button>
      {croak && (
        <span
          aria-hidden
          className="frog-puff pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 select-none text-xs italic text-bleu"
        >
          croâ
        </span>
      )}
    </span>
  );
}
