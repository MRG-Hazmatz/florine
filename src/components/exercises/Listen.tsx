import { useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { allOrNothing, setsEqual, type GradeResult } from "../../lib/exercises/grade";
import AudioButton from "../AudioButton";

type LI = Extract<Exercise, { type: "listen" }>;

export default function Listen({
  exercise,
  graded,
  onGrade,
}: {
  exercise: LI;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (graded) return;
    if (exercise.multiSelect) {
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    } else {
      setSelected([id]);
    }
  };

  const check = () => onGrade(allOrNothing(exercise.points, setsEqual(selected, exercise.correct)));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-ink/10 bg-card p-3">
        <AudioButton src={exercise.audio} label="Play the clip" />
        <span className="text-sm text-ink/50">Listen, then choose your answer.</span>
      </div>

      <ul className="space-y-2">
        {exercise.options.map((o) => {
          const isSel = selected.includes(o.id);
          const isCorrect = exercise.correct.includes(o.id);
          let cls = "border-ink/15 bg-card hover:border-marine";
          if (graded) {
            if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
            else if (isSel) cls = "border-rouge bg-rouge/5";
            else cls = "border-ink/10 bg-card opacity-60";
          } else if (isSel) {
            cls = "border-marine bg-marine/5";
          }
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => toggle(o.id)}
                disabled={graded}
                className={`flex w-full items-center rounded-lg border p-3 text-left transition-colors ${cls}`}
              >
                <span className="mr-2 text-ink/40">{isSel ? "●" : "○"}</span>
                <span>{o.text}</span>
                {graded && isCorrect && <span className="ml-auto text-emerald-700">✓</span>}
                {graded && isSel && !isCorrect && <span className="ml-auto text-rouge">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {graded && exercise.transcript && (
        <p className="text-sm text-ink/60">
          Transcript: <span className="text-marine">{exercise.transcript}</span>
        </p>
      )}

      {!graded && (
        <button
          type="button"
          onClick={check}
          disabled={selected.length === 0}
          className="rounded bg-marine px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Check
        </button>
      )}
    </div>
  );
}
