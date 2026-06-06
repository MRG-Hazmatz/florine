import { useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { allOrNothing, orderedEqual, type GradeResult } from "../../lib/exercises/grade";
import { shuffle } from "../../lib/util";

type RO = Extract<Exercise, { type: "reorder" }>;

export default function Reorder({
  exercise,
  graded,
  onGrade,
}: {
  exercise: RO;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const textById = Object.fromEntries(exercise.tokens.map((t) => [t.id, t.text]));
  const [pool] = useState<string[]>(() => shuffle(exercise.tokens.map((t) => t.id)));
  const [chosen, setChosen] = useState<string[]>([]);
  const remaining = pool.filter((id) => !chosen.includes(id));

  const add = (id: string) => {
    if (!graded) setChosen((c) => [...c, id]);
  };
  const removeAt = (i: number) => {
    if (!graded) setChosen((c) => c.toSpliced(i, 1));
  };

  const isCorrect = orderedEqual(chosen, exercise.correctOrder);
  const check = () => onGrade(allOrNothing(exercise.points, isCorrect));

  const answerBorder = graded
    ? isCorrect
      ? "border-emerald-400 bg-emerald-50"
      : "border-rouge bg-rouge/5"
    : "border-marine/30 bg-card";

  return (
    <div className="space-y-4">
      <div className={`flex min-h-12 flex-wrap gap-2 rounded-lg border-2 border-dashed p-3 ${answerBorder}`}>
        {chosen.length === 0 && (
          <span className="text-ink/30">Tap the words below, in order…</span>
        )}
        {chosen.map((id, i) => (
          <button
            key={`${id}-${i}`}
            type="button"
            onClick={() => removeAt(i)}
            disabled={graded}
            className="rounded bg-marine/10 px-3 py-1 text-marine hover:bg-marine/20"
          >
            {textById[id]}
          </button>
        ))}
      </div>

      {!graded && remaining.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {remaining.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => add(id)}
              className="rounded border border-ink/15 bg-card px-3 py-1 hover:border-marine"
            >
              {textById[id]}
            </button>
          ))}
        </div>
      )}

      {graded && !isCorrect && (
        <p className="text-sm text-ink/60">
          Correct order: {exercise.correctOrder.map((id) => textById[id]).join(" ")}
        </p>
      )}

      {!graded && (
        <button
          type="button"
          onClick={check}
          disabled={chosen.length !== exercise.tokens.length}
          className="rounded bg-marine px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Check
        </button>
      )}
    </div>
  );
}
