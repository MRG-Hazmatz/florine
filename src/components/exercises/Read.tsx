import { useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { partial, setsEqual, type GradeResult } from "../../lib/exercises/grade";

type RD = Extract<Exercise, { type: "read" }>;

export default function Read({
  exercise,
  graded,
  onGrade,
}: {
  exercise: RD;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showEn, setShowEn] = useState(false);

  const toggle = (qid: string, oid: string, multi: boolean) => {
    if (graded) return;
    setAnswers((a) => {
      const cur = a[qid] ?? [];
      if (multi) {
        return { ...a, [qid]: cur.includes(oid) ? cur.filter((x) => x !== oid) : [...cur, oid] };
      }
      return { ...a, [qid]: [oid] };
    });
  };

  const allAnswered = exercise.questions.every((q) => (answers[q.id]?.length ?? 0) > 0);

  const check = () => {
    const correctCount = exercise.questions.filter((q) =>
      setsEqual(answers[q.id] ?? [], q.correct),
    ).length;
    onGrade(partial(exercise.points, correctCount, exercise.questions.length));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-ink/10 bg-card p-4">
        <p className="whitespace-pre-line text-marine">{exercise.passageFr}</p>
        {exercise.passageEn && graded && (
          <div className="mt-2">
            {showEn ? (
              <p className="whitespace-pre-line text-sm text-ink/50">{exercise.passageEn}</p>
            ) : (
              <button
                type="button"
                onClick={() => setShowEn(true)}
                className="text-xs text-marine underline"
              >
                Show translation
              </button>
            )}
          </div>
        )}
      </div>

      {exercise.questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.prompt}</p>
          <ul className="space-y-1">
            {q.options.map((o) => {
              const sel = (answers[q.id] ?? []).includes(o.id);
              const isCorrect = q.correct.includes(o.id);
              let cls = "border-ink/15 bg-card hover:border-marine";
              if (graded) {
                if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                else if (sel) cls = "border-rouge bg-rouge/5";
                else cls = "border-ink/10 bg-card opacity-60";
              } else if (sel) {
                cls = "border-marine bg-marine/5";
              }
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => toggle(q.id, o.id, q.multiSelect)}
                    disabled={graded}
                    className={`flex w-full items-center rounded-lg border p-2 text-left text-sm transition-colors ${cls}`}
                  >
                    <span className="mr-2 text-ink/40">{sel ? "●" : "○"}</span>
                    <span>{o.text}</span>
                    {graded && isCorrect && <span className="ml-auto text-emerald-700">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {!graded && (
        <button
          type="button"
          onClick={check}
          disabled={!allAnswered}
          className="rounded bg-marine px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Check
        </button>
      )}
    </div>
  );
}
