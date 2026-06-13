import { useState } from "react";
import { ALMANAC, almanacEntry } from "../lib/almanac";
import { strangerUrl } from "../lib/characters";
import FrogSpot from "../components/FrogSpot";

/**
 * L'Almanach des Inconnus — a suburban-almanac-style index of the app's guide
 * faces (format borrowed with love from a certain lawn-defense game): a grid
 * of portraits, and a detail card for whoever is selected.
 */
export default function Almanac() {
  const [face, setFace] = useState(1);
  const entry = almanacEntry(face);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">L'Almanach des Inconnus</h1>
        <p className="mt-1 text-sm text-ink/60">
          The twenty strangers who watch over your lessons. Tap a face; everyone here has a
          story, a favourite word, and far too much time.
          <FrogSpot slot="almanac-subtitle" className="ml-1 align-middle" />
        </p>
      </header>

      <article className="rounded-lg border border-ink/25 bg-card/60 p-5">
        <div className="flex flex-col gap-5 sm:flex-row">
          <figure className="shrink-0 self-center -rotate-2 sm:self-start">
            <div className="h-40 w-40 overflow-hidden border border-ink/70 bg-parchment shadow-[4px_4px_0_rgba(23,18,12,0.45)]">
              <img
                src={strangerUrl(entry.face)}
                alt={entry.name}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
            <figcaption className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-ink/40">
              Nº {String(entry.face).padStart(2, "0")} / {ALMANAC.length}
            </figcaption>
          </figure>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-rouge">{entry.name}</h2>
              <p className="text-sm font-semibold text-ink/70">{entry.title}</p>
            </div>
            <p className="text-sm text-ink/80">
              <span className="font-semibold text-marine">Special:</span> {entry.special}
            </p>
            <p className="text-sm text-ink/80">
              <span className="font-semibold text-marine">Favourite word:</span>{" "}
              <span className="font-semibold">« {entry.word.fr} »</span>
              <span className="text-ink/60"> — {entry.word.en}</span>
            </p>
            <p className="text-sm italic text-ink/70">
              <span className="font-semibold not-italic text-marine">Motto:</span> «{" "}
              {entry.motto.fr} » <span className="text-ink/50">— {entry.motto.en}</span>
            </p>
            <p className="border-t border-ink/15 pt-3 text-sm leading-relaxed text-ink/80">
              {entry.bio}
            </p>
          </div>
        </div>
      </article>

      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {ALMANAC.map((e, i) => (
          <li key={e.face}>
            <button
              type="button"
              onClick={() => setFace(e.face)}
              title={e.name}
              aria-label={`View ${e.name}`}
              className={`group block w-full ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
            >
              <div
                className={`mx-auto aspect-square w-full max-w-20 overflow-hidden border bg-parchment transition-all ${
                  e.face === face
                    ? "border-rouge shadow-[3px_3px_0_rgba(155,34,38,0.4)]"
                    : "border-ink/40 shadow-[3px_3px_0_rgba(23,18,12,0.25)] group-hover:border-marine group-hover:shadow-[3px_3px_0_rgba(27,59,111,0.35)]"
                }`}
              >
                <img
                  src={strangerUrl(e.face)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </div>
              <span
                className={`mt-1 block truncate text-center text-[11px] ${
                  e.face === face ? "font-semibold text-rouge" : "text-ink/55"
                }`}
              >
                {e.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

    </section>
  );
}
