import { Link } from "react-router-dom";
import { getLevelSummaries } from "../lib/content/load";
import { CEFR_LABELS, EXAM_FOR_LEVEL } from "../lib/cefr";

export default function LevelSelect() {
  const summaries = getLevelSummaries();

  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Choose your level</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {summaries.map((s) => {
          const enabled = s.unitCount > 0;
          const card = (
            <div
              className={`h-full rounded-lg border p-4 ${
                enabled
                  ? "border-marine/30 bg-card hover:border-marine"
                  : "border-ink/10 bg-ink/5 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{CEFR_LABELS[s.level]}</span>
                {EXAM_FOR_LEVEL[s.level] && (
                  <span className="text-xs text-rouge">{EXAM_FOR_LEVEL[s.level]}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-ink/60">
                {enabled
                  ? `${s.unitCount} unit${s.unitCount === 1 ? "" : "s"} · ${s.approvedCount} approved`
                  : "Coming soon"}
              </p>
            </div>
          );

          return (
            <li key={s.level}>
              {enabled ? <Link to={`/levels/${s.level}`}>{card}</Link> : card}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
