import { useState } from "react";
import { Link } from "react-router-dom";
import type { Exercise, Unit } from "../../lib/content/schema";
import type { GradeResult } from "../../lib/exercises/grade";
import { useProgress } from "../../lib/storage/progress";
import MultipleChoice from "./MultipleChoice";
import FillBlank from "./FillBlank";
import Reorder from "./Reorder";
import MatchPairs from "./MatchPairs";
import Listen from "./Listen";
import Read from "./Read";

function assertNever(x: never): never {
  throw new Error("Unhandled exercise type: " + JSON.stringify(x));
}

function renderExercise(ex: Exercise, graded: boolean, onGrade: (r: GradeResult) => void) {
  switch (ex.type) {
    case "multiple-choice":
      return <MultipleChoice exercise={ex} graded={graded} onGrade={onGrade} />;
    case "fill-blank":
      return <FillBlank exercise={ex} graded={graded} onGrade={onGrade} />;
    case "reorder":
      return <Reorder exercise={ex} graded={graded} onGrade={onGrade} />;
    case "match-pairs":
      return <MatchPairs exercise={ex} graded={graded} onGrade={onGrade} />;
    case "listen":
      return <Listen exercise={ex} graded={graded} onGrade={onGrade} />;
    case "read":
      return <Read exercise={ex} graded={graded} onGrade={onGrade} />;
    default:
      return assertNever(ex);
  }
}

export default function ExercisePlayer({ unit }: { unit: Unit }) {
  const exercises = unit.exercises.exercises;
  const passThreshold = unit.exercises.passThreshold;

  const recordScore = useProgress((s) => s.recordScore);
  const addSkillXp = useProgress((s) => s.addSkillXp);
  const touchStreak = useProgress((s) => s.touchStreak);
  const addStudyMinutes = useProgress((s) => s.addStudyMinutes);

  const [attempt, setAttempt] = useState(0);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<(GradeResult | null)[]>(() => exercises.map(() => null));
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(() => Date.now());

  if (exercises.length === 0) {
    return <p className="text-ink/60">No exercises in this unit yet.</p>;
  }

  const sum = (key: "earned" | "max") =>
    results.reduce((n, r) => n + (r ? r[key] : 0), 0);

  if (finished) {
    const max = sum("max");
    const pct = max === 0 ? 0 : Math.round((sum("earned") / max) * 100);
    const passed = pct >= passThreshold * 100;
    return (
      <div className="space-y-5 text-center">
        <div
          className={`rounded-xl border p-6 ${
            passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"
          }`}
        >
          <p className="text-sm uppercase tracking-wide text-ink/50">Your score</p>
          <p className="font-fancy text-6xl font-bold tracking-wide">{pct}%</p>
          {passed ? (
            <div className="mt-2 space-y-1">
              <img
                src="/icons/popper.png"
                alt=""
                className="mx-auto h-14 object-contain mix-blend-multiply"
              />
              <p className="font-fancy text-xl font-bold uppercase tracking-widest text-emerald-800">
                Passed!
              </p>
            </div>
          ) : (
            <p className="mt-2 text-lg">
              Pass mark is {Math.round(passThreshold * 100)}% — give it another go.
            </p>
          )}
        </div>
        <div className="mx-auto max-w-md rounded-lg border border-ink/15 bg-card p-4 text-left">
          <p className="mb-2 text-center font-display text-sm uppercase tracking-[0.2em] text-ink/50">
            Marksheet
          </p>
          <ol className="space-y-1.5 text-sm">
            {exercises.map((e, i) => (
              <li key={e.id} className="flex items-center gap-2">
                <img
                  src={results[i]?.correct ? "/icons/correct.png" : "/icons/wrong.png"}
                  alt={results[i]?.correct ? "correct" : "wrong"}
                  className="h-6 w-6 shrink-0 object-contain mix-blend-multiply"
                />
                <span className="text-ink/70">
                  {i + 1}. {e.prompt}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setResults(exercises.map(() => null));
              setCurrent(0);
              setFinished(false);
              setStartTime(Date.now());
              setAttempt((a) => a + 1);
            }}
            className="rounded bg-marine px-5 py-2.5 font-medium text-white"
          >
            Retry
          </button>
          <Link
            to={`/unit/${unit.level}/${unit.slug}`}
            className="rounded border border-marine/30 px-5 py-2.5 font-medium text-marine"
          >
            Back to unit
          </Link>
        </div>
      </div>
    );
  }

  const ex = exercises[current];
  const result = results[current];

  const handleGrade = (r: GradeResult) => {
    setResults((rs) => {
      const nextResults = [...rs];
      nextResults[current] = r;
      return nextResults;
    });
    if (r.earned > 0) addSkillXp(ex.skill, Math.round(r.earned * 10));
  };

  const goNext = () => {
    if (current < exercises.length - 1) {
      setCurrent((c) => c + 1);
      return;
    }
    const max = sum("max");
    recordScore(unit.id, max === 0 ? 0 : sum("earned") / max);
    touchStreak();
    addStudyMinutes(Math.max(1, Math.round((Date.now() - startTime) / 60000)));
    setFinished(true);
  };

  const verdict = result?.correct
    ? { text: "Correct!", cls: "text-emerald-700" }
    : (result?.earned ?? 0) > 0
      ? { text: "Partly right", cls: "text-amber-700" }
      : { text: "Not quite", cls: "text-rouge" };

  const progressPct = ((current + (result ? 1 : 0)) / exercises.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-ink/50">
        <span>
          Exercise {current + 1} of {exercises.length}
        </span>
        <span className="capitalize">{ex.skill}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded bg-ink/10">
        <div className="h-full bg-marine transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div>
        <p className="mb-1 text-lg font-medium">{ex.prompt}</p>
        {ex.promptFr && <p className="mb-3 text-sm italic text-ink/50">{ex.promptFr}</p>}
        <div key={`${attempt}-${ex.id}`}>{renderExercise(ex, result !== null, handleGrade)}</div>
      </div>

      {result && (
        <div className="space-y-2 rounded-lg border border-ink/10 bg-parchment p-3">
          <p className={`font-semibold ${verdict.cls}`}>{verdict.text}</p>
          {ex.explanation && <p className="text-sm text-ink/70">{ex.explanation}</p>}
          <button
            type="button"
            onClick={goNext}
            className="rounded bg-marine px-4 py-2 font-medium text-white"
          >
            {current < exercises.length - 1 ? "Next →" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}
