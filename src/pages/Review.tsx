import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllUnits } from "../lib/content/load";
import { useProgress, vocabKey } from "../lib/storage/progress";
import { isDue, initialCard, type Rating } from "../lib/srs/sm2";
import AudioButton from "../components/AudioButton";
import type { VocabItem } from "../lib/content/schema";

interface Card {
  key: string;
  vocab: VocabItem;
}

const RATINGS: { rating: Rating; label: string; cls: string }[] = [
  { rating: "again", label: "Again", cls: "border-rouge/30 bg-rouge/10 text-rouge" },
  { rating: "hard", label: "Hard", cls: "border-amber-300 bg-amber-100 text-amber-800" },
  { rating: "good", label: "Good", cls: "border-marine/30 bg-marine/10 text-marine" },
  { rating: "easy", label: "Easy", cls: "border-emerald-300 bg-emerald-100 text-emerald-800" },
];

export default function Review() {
  const vocabState = useProgress((s) => s.vocab);
  const reviewVocab = useProgress((s) => s.reviewVocab);

  const allCards: Card[] = getAllUnits().flatMap((u) =>
    u.lesson.vocabulary.map((v) => ({ key: vocabKey(u.id, v.id), vocab: v })),
  );
  const cardByKey = Object.fromEntries(allCards.map((c) => [c.key, c]));

  // Snapshot the due queue once at mount so reviewing doesn't reshuffle mid-session.
  const [queue] = useState<string[]>(() =>
    allCards.filter((c) => isDue(vocabState[c.key] ?? initialCard())).map((c) => c.key),
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (allCards.length === 0) {
    return <p className="text-ink/60">No vocabulary to review yet.</p>;
  }

  if (queue.length === 0 || index >= queue.length) {
    const done = queue.length > 0;
    return (
      <section className="space-y-3 py-12 text-center">
        <img src="/icons/review.png" alt="" className="mx-auto h-28 object-contain mix-blend-multiply" />
        <p className="font-display text-3xl">{done ? "Review complete! 🎉" : "All caught up! 🎉"}</p>
        <p className="text-ink/60">
          {done
            ? `You reviewed ${queue.length} card${queue.length === 1 ? "" : "s"}.`
            : "Nothing is due right now. Come back tomorrow."}
        </p>
        <Link to="/" className="text-marine underline">
          Home
        </Link>
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
    <section className="space-y-6">
      <img src="/icons/review.png" alt="Révision" className="mx-auto h-24 object-contain mix-blend-multiply" />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Vocabulary review</h1>
        <span className="text-sm text-ink/50">
          {index + 1} / {queue.length}
        </span>
      </div>

      <div className="mx-auto flex min-h-56 max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-ink/15 bg-card p-8 text-center">
        <div className="flex items-center gap-2">
          <span className="font-display text-3xl text-marine">{card.vocab.fr}</span>
          <AudioButton src={card.vocab.audio} label={`Play ${card.vocab.fr}`} />
        </div>
        {revealed ? (
          <>
            <hr className="w-16 border-ink/15" />
            <p className="text-lg text-ink/80">{card.vocab.en}</p>
            {card.vocab.exampleFr && (
              <p className="text-sm italic text-ink/50">{card.vocab.exampleFr}</p>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-2 rounded bg-marine px-5 py-2 font-medium text-white"
          >
            Show answer
          </button>
        )}
      </div>

      {revealed && (
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.rating}
              type="button"
              onClick={() => rate(r.rating)}
              className={`rounded-lg border px-2 py-2 text-sm font-medium ${r.cls}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
