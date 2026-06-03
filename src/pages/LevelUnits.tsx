import { Link, useParams } from "react-router-dom";
import { getUnitsForLevel } from "../lib/content/load";
import { cefrLevelSchema } from "../lib/content/schema";
import { CEFR_LABELS } from "../lib/cefr";
import ReviewBadge from "../components/ReviewBadge";

export default function LevelUnits() {
  const { level } = useParams();
  const parsed = cefrLevelSchema.safeParse(level);

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

  const units = getUnitsForLevel(parsed.data);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{CEFR_LABELS[parsed.data]}</h1>
      {units.length === 0 ? (
        <p className="text-ink/60">No units yet for this level.</p>
      ) : (
        <ol className="space-y-2">
          {units.map((u) => (
            <li key={u.id}>
              <Link
                to={`/unit/${u.level}/${u.slug}`}
                className="flex items-center justify-between rounded-lg border border-marine/20 bg-white p-4 hover:border-marine"
              >
                <span>
                  <span className="mr-2 text-ink/40">{u.lesson.unitNumber}.</span>
                  {u.lesson.title}
                </span>
                <ReviewBadge status={u.review.status} />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
