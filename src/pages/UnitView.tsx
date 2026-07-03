import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUnit, getAdjacentUnits, getUnitsForLevel } from "../lib/content/load";
import ReviewBadge from "../components/ReviewBadge";
import ConceptText from "../components/ConceptText";
import AudioButton from "../components/AudioButton";
import GuideStranger from "../components/GuideStranger";
import { useProgress } from "../lib/storage/progress";
import { isUnitUnlocked } from "../lib/progressView";
import { unitFaceIndex } from "../lib/characters";

export default function UnitView() {
  const { level, slug } = useParams();
  const unit = level && slug ? getUnit(level, slug) : undefined;
  const markVisited = useProgress((s) => s.markVisited);
  const unitProgress = useProgress((s) => s.unitProgress);

  const unlocked = unit ? isUnitUnlocked(unit, getUnitsForLevel(unit.level), unitProgress) : false;

  useEffect(() => {
    if (unit && unlocked) markVisited(unit.id);
  }, [unit, unlocked, markVisited]);

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

  if (!unlocked) {
    return (
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-ink/70">
          <img src="/icons/lock.png" alt="" className="h-6 w-6 object-contain" />
          This unit is still locked — finish the previous unit's exercises first.
        </p>
        <Link to={`/levels/${unit.level}`} className="text-marine underline">
          Back to the level map
        </Link>
      </div>
    );
  }

  const { lesson, review } = unit;
  const { prev, next } = getAdjacentUnits(unit);
  const nextUnlocked = unitProgress[unit.id]?.status === "completed";

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
          <ReviewBadge status={review.status} />
        </div>
        {lesson.titleFr && <p className="italic text-ink/50">{lesson.titleFr}</p>}
      </header>

      <GuideStranger face={unitFaceIndex(unit.level, lesson.unitNumber)} caption="leçon" />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Concept</h2>
        <ConceptText text={lesson.concept} />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          Vocabulary ({lesson.vocabulary.length})
        </h2>
        <ul className="divide-y divide-ink/10 rounded border border-ink/10 bg-card">
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
            <li key={e.id} className="flex items-start gap-2 rounded border border-ink/10 bg-card p-2">
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

      <nav className="flex justify-between gap-4 border-t border-ink/10 pt-4 text-sm">
        {prev ? (
          <Link to={`/unit/${prev.level}/${prev.slug}`} className="text-marine hover:underline">
            ← {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next && nextUnlocked ? (
          <Link
            to={`/unit/${next.level}/${next.slug}`}
            className="ml-auto text-right text-marine hover:underline"
          >
            {next.lesson.title} →
          </Link>
        ) : next ? (
          <span
            className="ml-auto inline-flex items-center gap-1.5 text-right text-ink/35"
            title="Finish this unit's exercises to unlock"
          >
            <img src="/icons/lock.png" alt="Locked" className="h-4 w-4 object-contain" />
            {next.lesson.title}
          </span>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
