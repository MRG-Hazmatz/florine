import { Link, useParams } from "react-router-dom";
import { getUnitsForLevel } from "../lib/content/load";
import { cefrLevelSchema } from "../lib/content/schema";
import { CEFR_LABELS } from "../lib/cefr";
import ReviewBadge from "../components/ReviewBadge";
import { useProgress } from "../lib/storage/progress";
import { computeLevelView, type LevelUnitView } from "../lib/progressView";

function StatusIcon({ view }: { view: LevelUnitView }) {
  if (!view.unlocked) return <span title="Locked">🔒</span>;
  if (view.status === "completed") return <span className="text-emerald-600" title="Completed">✓</span>;
  if (view.status === "in-progress") return <span className="text-marine" title="In progress">◐</span>;
  return <span className="text-ink/30" title="Not started">○</span>;
}

export default function LevelUnits() {
  const { level } = useParams();
  const parsed = cefrLevelSchema.safeParse(level);
  const unitProgress = useProgress((s) => s.unitProgress);

  if (!parsed.success) {
    return (
      <p className="text-ink/60">
        Unknown level.{" "}
        <Link to="/levels" className="text-marine underline">
          Back to levels
        </Link>
      </p>
    );
  }

  const view = computeLevelView(getUnitsForLevel(parsed.data), unitProgress);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{CEFR_LABELS[parsed.data]}</h1>
      {view.length === 0 ? (
        <p className="text-ink/60">No units yet for this level.</p>
      ) : (
        <ol className="space-y-2">
          {view.map((v) => {
            const u = v.unit;
            const interactive = v.unlocked;
            const row = (
              <div
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  interactive
                    ? "border-marine/20 bg-white hover:border-marine"
                    : "border-ink/10 bg-ink/5 opacity-70"
                }`}
              >
                <span className="flex items-center gap-2">
                  <StatusIcon view={v} />
                  <span>
                    <span className="mr-2 text-ink/40">{u.lesson.unitNumber}.</span>
                    {u.lesson.title}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {v.status === "completed" && (
                    <span className="text-xs text-emerald-700">{Math.round(v.bestScore * 100)}%</span>
                  )}
                  <ReviewBadge status={u.review.status} />
                </span>
              </div>
            );
            return (
              <li key={u.id}>
                {interactive ? <Link to={`/unit/${u.level}/${u.slug}`}>{row}</Link> : row}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
