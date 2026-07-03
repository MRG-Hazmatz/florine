import { Link, useParams } from "react-router-dom";
import { getUnit, getUnitsForLevel } from "../lib/content/load";
import ExercisePlayer from "../components/exercises/ExercisePlayer";
import { useProgress } from "../lib/storage/progress";
import { isUnitUnlocked } from "../lib/progressView";

export default function ExerciseView() {
  const { level, slug } = useParams();
  const unit = level && slug ? getUnit(level, slug) : undefined;
  const unitProgress = useProgress((s) => s.unitProgress);

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

  if (!isUnitUnlocked(unit, getUnitsForLevel(unit.level), unitProgress)) {
    return (
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-ink/70">
          <img src="/icons/lock.png" alt="" className="h-6 w-6 object-contain" />
          These exercises are still locked — finish the previous unit first.
        </p>
        <Link to={`/levels/${unit.level}`} className="text-marine underline">
          Back to the level map
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{unit.lesson.title} — Exercises</h1>
        <Link
          to={`/unit/${unit.level}/${unit.slug}`}
          className="shrink-0 text-sm text-marine underline"
        >
          ← Back to unit
        </Link>
      </div>
      <ExercisePlayer unit={unit} />
    </section>
  );
}
