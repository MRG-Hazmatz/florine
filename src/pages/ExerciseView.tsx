import { Link, useParams } from "react-router-dom";
import { getUnit } from "../lib/content/load";
import ExercisePlayer from "../components/exercises/ExercisePlayer";

export default function ExerciseView() {
  const { level, slug } = useParams();
  const unit = level && slug ? getUnit(level, slug) : undefined;

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
