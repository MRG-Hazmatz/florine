import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllUnits } from "../lib/content/load";
import { useProgress, vocabKey } from "../lib/storage/progress";
import { isDue, type Rating } from "../lib/srs/sm2";
import { shuffle } from "../lib/util";
import AudioButton from "../components/AudioButton";
import FrogSpot from "../components/FrogSpot";
import type { VocabItem } from "../lib/content/schema";

interface Card {
  key: string;
  vocab: VocabItem;
}

/**
 * Rating buttons, themed to the manuscript palette: each gets its own ink,
 * a soft matching glow, and a gentle lift on hover.
 */
const RATINGS: { rating: Rating; label: string; cls: string }[] = [
  {
    rating: "again",
    label: "Again",
    cls: "border-rouge/40 bg-rouge/10 text-rouge shadow-[0_0_10px_-2px_rgba(124,21,23,0.45)] hover:shadow-[0_0_14px_-2px_rgba(124,21,23,0.65)]",
  },
  {
    rating: "hard",
    label: "Hard",
    cls: "border-amber-700/40 bg-amber-700/10 text-amber-900 shadow-[0_0_10px_-2px_rgba(146,90,20,0.45)] hover:shadow-[0_0_14px_-2px_rgba(146,90,20,0.65)]",
  },
  {
    rating: "good",
    label: "Good",
    cls: "border-bleu/50 bg-bleu/10 text-bleu shadow-[0_0_10px_-2px_rgba(63,90,99,0.5)] hover:shadow-[0_0_14px_-2px_rgba(63,90,99,0.7)]",
  },
  {
    rating: "easy",
    label: "Easy",
    cls: "border-emerald-800/40 bg-emerald-800/10 text-emerald-900 shadow-[0_0_10px_-2px_rgba(6,78,59,0.4)] hover:shadow-[0_0_14px_-2px_rgba(6,78,59,0.6)]",
  },
];

export default function Review() {
  const vocabState = useProgress((s) => s.vocab);
  const reviewVocab = useProgress((s) => s.reviewVocab);

  const allCards: Card[] = getAllUnits().flatMap((u) =>
    u.lesson.vocabulary.map((v) => ({ key: vocabKey(u.id, v.id), vocab: v })),
  );
  const cardByKey = Object.fromEntries(allCards.map((c) => [c.key, c]));

  // Due queue: ONLY cards in the learner's personal deck (cards they've
  // actually reviewed or added) — never the whole 900+ collection.
  const [queue, setQueue] = useState<string[]>(() =>
    shuffle(
      Object.keys(vocabState).filter((k) => cardByKey[k] && isDue(vocabState[k])),
    ),
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (allCards.length === 0) {
    return <p className="text-ink/60">No vocabulary to review yet.</p>;
  }

  const startPractice = () => {
    setQueue(shuffle(allCards.map((c) => c.key)));
    setIndex(0);
    setRevealed(false);
  };

  // Between rounds (due queue cleared, or finished a practice round).
  if (queue.length === 0 || index >= queue.length) {
    const reviewed = queue.length;
    return (
      <section className="space-y-4 py-10 text-center">
        <img src="/icons/popper.png" alt="" className="mx-auto h-20 object-contain mix-blend-multiply" />
        <p className="font-fancy text-3xl font-bold uppercase tracking-wide">
          {reviewed > 0 ? "Review complete" : "All caught up"}
        </p>
        <p className="mx-auto max-w-sm text-ink/60">
          {reviewed > 0
            ? `You got through ${reviewed} card${reviewed === 1 ? "" : "s"}. Keep the momentum — practise as much as you like.`
            : "Nothing is scheduled right now, but you never have to wait. Practise any time, or browse the collection and pick your next words."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={startPractice}
            className="rounded bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90"
          >
            Practice all words
          </button>
          <Link
            to="/review/browse"
            className="rounded border border-marine/30 px-5 py-2.5 font-medium text-marine hover:bg-marine/10"
          >
            Browse by module
          </Link>
        </div>
      </section>
    );
  }

  const card = cardByKey[queue[index]];

  const rate = (rating: Rating) => {
    reviewVocab(card.key, rating);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icons/review.png" alt="" className="h-14 object-contain mix-blend-multiply" />
          <h1 className="font-display text-2xl font-bold text-ink">Vocabulary review</h1>
          <FrogSpot slot="review-heading" className="self-start" />
        </div>
        <div className="flex items-center gap-4">
          <Link to="/review/browse" className="text-sm text-marine underline-offset-2 hover:underline">
            Browse by module
          </Link>
          <span className="text-sm text-ink/50">
            {index + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Tarot-style flashcard: thick outer frame + thin inner rule + hard offset shadow */}
      <div className="mx-auto max-w-sm">
        <div className="ornate-frame bg-card">
          <div className="flex min-h-72 flex-col items-center justify-between px-5 py-6 text-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-ink/40">
              Carte · Français
            </span>

            <div className="flex flex-col items-center gap-3">
              <span className="font-display text-4xl text-marine">{card.vocab.fr}</span>
              <AudioButton src={card.vocab.audio} label={`Play ${card.vocab.fr}`} />
            </div>

            <div className="min-h-16 w-full">
              {revealed ? (
                <div className="reveal-anim space-y-2">
                  <div className="mx-auto h-px w-16 bg-ink/25" />
                  <p className="text-lg text-ink/80">{card.vocab.en}</p>
                  {card.vocab.exampleFr && (
                    <p className="text-sm italic text-ink/60">{card.vocab.exampleFr}</p>
                  )}
                  {card.vocab.exampleEn && (
                    <p className="text-xs text-ink/40">{card.vocab.exampleEn}</p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="rounded bg-marine px-6 py-2 font-medium text-white hover:bg-marine/90"
                >
                  Show answer
                </button>
              )}
            </div>

            <span className="text-[10px] uppercase tracking-[0.35em] text-ink/30">Florine</span>
          </div>
        </div>
      </div>

      {revealed && (
        <div className="reveal-anim mx-auto grid max-w-sm grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.rating}
              type="button"
              onClick={() => rate(r.rating)}
              className={`rounded-lg border px-2 py-2 text-sm font-medium transition-all duration-150 hover:scale-105 ${r.cls}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
