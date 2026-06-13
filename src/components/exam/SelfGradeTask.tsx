import type { OpenTask } from "../../lib/exams/schema";
import { countWords } from "./OpenTask";

export type RubricScores = Record<string, number>; // rubricLineId -> points awarded

/**
 * Correction view for one production task: shows what the candidate produced,
 * the model answer / talking points, and the official-style grading grid. The
 * candidate awards themselves points per criterion (0…max in 0.5 steps) —
 * honest about the fact that software can't grade open production, so it hands
 * the rubric to the learner the way a teacher hands back a grid.
 */
export default function SelfGradeTask({
  task,
  writing,
  recorded,
  scores,
  onScore,
}: {
  task: OpenTask;
  writing: string;
  recorded: boolean;
  scores: RubricScores;
  onScore: (lineId: string, points: number) => void;
}) {
  const awarded = task.rubric.reduce((n, l) => n + (scores[l.id] ?? 0), 0);

  return (
    <section className="space-y-3 rounded-lg border border-ink/15 bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{task.title}</h3>
        <span className="text-sm font-semibold text-marine">
          {awarded} / {task.points} pts
        </span>
      </div>

      {/* What the candidate produced */}
      {task.kind === "ensemble" ? (
        task.consigne && <p className="text-sm text-ink/60">{task.consigne}</p>
      ) : task.kind === "speaking" ? (
        <p className="text-sm text-ink/60">
          {recorded ? "You recorded an answer." : "No recording was made for this task."}
        </p>
      ) : (
        <details open className="rounded border border-ink/10 bg-parchment/60 p-2 text-sm">
          <summary className="cursor-pointer text-ink/60">
            Your answer ({countWords(writing)} mots)
          </summary>
          <p className="mt-2 whitespace-pre-line text-ink/80">
            {writing.trim() || "(left blank)"}
          </p>
        </details>
      )}

      {/* Model answer / talking points */}
      <details className="rounded border border-ink/10 bg-emerald-50/50 p-2 text-sm">
        <summary className="cursor-pointer font-medium text-emerald-800">
          Model {task.kind === "speaking" ? "talking points" : "answer"}
        </summary>
        <p className="mt-2 whitespace-pre-line text-ink/80">{task.modelAnswer}</p>
      </details>

      {/* The grading grid */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-ink/40">
          Grille d'évaluation — award yourself points honestly
        </p>
        {task.rubric.map((line) => {
          const val = scores[line.id] ?? 0;
          const steps = Math.round(line.points / 0.5);
          return (
            <div key={line.id} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-ink/80">{line.label}</span>
                <span className="shrink-0 font-medium text-ink/60">
                  {val} / {line.points}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={steps}
                step={1}
                value={Math.round(val / 0.5)}
                onChange={(e) => onScore(line.id, (Number(e.target.value) * 0.5))}
                className="w-full accent-marine"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
