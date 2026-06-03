import { Link, useParams } from "react-router-dom";
import { getUnit } from "../lib/content/load";
import type { ExerciseType } from "../lib/content/schema";

const TYPE_LABELS: Record<ExerciseType, string> = {
  "multiple-choice": "Multiple choice",
  "fill-blank": "Fill in the blank",
  reorder: "Sentence reordering",
  "match-pairs": "Match the pairs",
  listen: "Listen & answer",
  read: "Read & answer",
};

export default function ExerciseView() {
  const { level, slug } = useParams();
  const unit = level && slug ? getUnit(level, slug) : undefined;

  if (!unit) {
    return <p className="text-ink/60">Unit not found.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Exercises</h1>
        <Link
          to={`/unit/${unit.level}/${unit.slug}`}
          className="text-sm text-marine underline"
        >
          ← Back to unit
        </Link>
      </div>

      <p className="text-sm text-ink/60">
        Pass mark: {Math.round(unit.exercises.passThreshold * 100)}%. Interactive
        exercise components arrive in Phase 2 — this is the data-driven skeleton that
        reads straight from the content schema.
      </p>

      <ol className="space-y-3">
        {unit.exercises.exercises.map((ex, i) => (
          <li key={ex.id} className="rounded-lg border border-ink/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink/40">{i + 1}</span>
              <span className="rounded bg-marine/10 px-2 py-0.5 text-xs font-medium text-marine">
                {TYPE_LABELS[ex.type]}
              </span>
              <span className="ml-auto text-xs text-ink/40">{ex.skill}</span>
            </div>
            <p className="mt-2">{ex.prompt}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
