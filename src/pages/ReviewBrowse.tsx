/**
 * The card collection: every flashcard in the app, grouped by level and unit.
 *
 * Cards already in the learner's personal review deck are dimmed ("collected"),
 * and each card can be added to or removed from the deck — so a curious learner
 * can pull one advanced word into their daily cycle, or undo an accidental add,
 * without ever facing the whole 900+ collection as "due".
 */
import { Link } from "react-router-dom";
import { getAllUnits } from "../lib/content/load";
import { useProgress, vocabKey } from "../lib/storage/progress";
import { CEFR_LABELS } from "../lib/cefr";
import AudioButton from "../components/AudioButton";
import FrogSpot from "../components/FrogSpot";

export default function ReviewBrowse() {
  const vocabState = useProgress((s) => s.vocab);
  const addVocabCard = useProgress((s) => s.addVocabCard);
  const removeVocabCard = useProgress((s) => s.removeVocabCard);

  const units = getAllUnits();
  const levels = [...new Set(units.map((u) => u.level))];
  const deckSize = Object.keys(vocabState).length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icons/review.png" alt="" className="h-14 object-contain mix-blend-multiply" />
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">The card collection</h1>
            <p className="text-sm text-ink/50">
              {deckSize} card{deckSize === 1 ? "" : "s"} in your review deck · dimmed cards are
              already collected
            </p>
          </div>
          <FrogSpot slot="review-browse" className="self-start" />
        </div>
        <Link to="/review" className="text-sm text-marine underline-offset-2 hover:underline">
          ← Back to review
        </Link>
      </div>

      {levels.map((level) => (
        <div key={level} className="space-y-2">
          <h2 className="text-lg font-semibold text-ink/80">{CEFR_LABELS[level]}</h2>
          {units
            .filter((u) => u.level === level)
            .map((u) => {
              const inDeck = u.lesson.vocabulary.filter(
                (v) => vocabState[vocabKey(u.id, v.id)],
              ).length;
              return (
                <details
                  key={u.id}
                  className="group rounded-lg border border-ink/10 bg-card open:border-marine/30"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm">
                    <span className="font-medium text-ink/85">{u.lesson.title}</span>
                    <span
                      className={`shrink-0 text-xs ${
                        inDeck === u.lesson.vocabulary.length ? "text-marine" : "text-ink/40"
                      }`}
                    >
                      {inDeck}/{u.lesson.vocabulary.length} collected
                    </span>
                  </summary>
                  <ul className="divide-y divide-ink/10 border-t border-ink/10">
                    {u.lesson.vocabulary.map((v) => {
                      const key = vocabKey(u.id, v.id);
                      const collected = Boolean(vocabState[key]);
                      return (
                        <li
                          key={v.id}
                          className={`flex items-center gap-3 px-4 py-2 ${
                            collected ? "bg-ink/5 opacity-60" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-marine">{v.fr}</span>
                            <span className="ml-2 text-sm text-ink/60">{v.en}</span>
                            {v.exampleFr && (
                              <p className="truncate text-xs italic text-ink/45">
                                {v.exampleFr}
                                {v.exampleEn ? ` — ${v.exampleEn}` : ""}
                              </p>
                            )}
                          </div>
                          <AudioButton src={v.audio} label={`Play ${v.fr}`} />
                          {collected ? (
                            <button
                              type="button"
                              onClick={() => removeVocabCard(key)}
                              title="Remove from your review deck"
                              className="shrink-0 rounded border border-rouge/30 px-2.5 py-1 text-xs font-medium text-rouge transition-all hover:scale-105 hover:bg-rouge/10"
                            >
                              ✓ In deck · remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addVocabCard(key)}
                              title="Add to your review deck (due today)"
                              className="shrink-0 rounded border border-marine/30 px-2.5 py-1 text-xs font-medium text-marine transition-all hover:scale-105 hover:bg-marine/10"
                            >
                              + Add
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
        </div>
      ))}
    </section>
  );
}
