import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUnit } from "../lib/content/load";
import ReviewBadge from "../components/ReviewBadge";
import AudioButton from "../components/AudioButton";
import GuideStranger from "../components/GuideStranger";
import { useProgress } from "../lib/storage/progress";

export default function UnitView() {
  const { level, slug } = useParams();
  const unit = level && slug ? getUnit(level, slug) : undefined;
  const markVisited = useProgress((s) => s.markVisited);

  useEffect(() => {
    if (unit) markVisited(unit.id);
  }, [unit, markVisited]);

  if (!unit) {
    return (
      <p className="text-ink/60">
        Unit not found.{" "}
        <Link to="/levels" className="text-marine underline">
          Back to levels
        </Link>
      </p>
    );
  }

  const { lesson, review } = unit;
  const unreviewed = review.status !== "approved";

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
          <ReviewBadge status={review.status} />
        </div>
        {lesson.titleFr && <p className="italic text-ink/50">{lesson.titleFr}</p>}
      </header>

      {unreviewed && (
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          ⚠ This unit has not been approved by a native speaker yet. Per Florine's
          content rule, unreviewed material is for development preview only and may
          contain errors.
        </div>
      )}

      <GuideStranger seed={unit.id} caption="leçon">
        Read the notes, play the audio for each word, then test yourself. Aim for{" "}
        {Math.round(unit.exercises.passThreshold * 100)}% to pass and unlock what's next.
      </GuideStranger>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Concept</h2>
        <p className="max-w-prose whitespace-pre-line text-ink/80">{lesson.concept}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          Vocabulary ({lesson.vocabulary.length})
        </h2>
        <ul className="divide-y divide-ink/10 rounded border border-ink/10 bg-white">
          {lesson.vocabulary.map((v) => (
            <li key={v.id} className="flex items-center gap-3 p-2">
              <span className="font-medium text-marine">{v.fr}</span>
              <span className="text-sm text-ink/60">{v.en}</span>
              <span className="ml-auto">
                <AudioButton src={v.audio} label={`Play ${v.fr}`} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Examples</h2>
        <ul className="space-y-2">
          {lesson.examples.map((e) => (
            <li key={e.id} className="flex items-start gap-2 rounded border border-ink/10 bg-white p-2">
              <AudioButton src={e.audio} label={`Play: ${e.fr}`} />
              <div>
                <p className="text-marine">{e.fr}</p>
                <p className="text-sm text-ink/60">{e.en}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div>
        <Link
          to={`/unit/${unit.level}/${unit.slug}/exercises`}
          className="rounded bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90"
        >
          Go to exercises ({unit.exercises.exercises.length}) →
        </Link>
      </div>
    </article>
  );
}
