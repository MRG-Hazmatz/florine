import { useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { partial, type GradeResult } from "../../lib/exercises/grade";
import { shuffle } from "../../lib/util";

type MP = Extract<Exercise, { type: "match-pairs" }>;

export default function MatchPairs({
  exercise,
  graded,
  onGrade,
}: {
  exercise: MP;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const rightTextById = Object.fromEntries(exercise.pairs.map((p) => [p.id, p.right]));
  const [rightOrder] = useState<string[]>(() => shuffle(exercise.pairs.map((p) => p.id)));
  const [sel, setSel] = useState<string | null>(null); // selected left pair id
  const [assign, setAssign] = useState<Record<string, string>>({}); // leftId -> rightPairId

  const usedRights = new Set(Object.values(assign));

  const clickLeft = (id: string) => {
    if (graded) return;
    if (assign[id]) {
      // already matched -> clicking again unmatches it (frees this pair)
      setAssign((a) => {
        const next = { ...a };
        delete next[id];
        return next;
      });
      setSel(null);
      return;
    }
    setSel((cur) => (cur === id ? null : id));
  };
  const clickRight = (rid: string) => {
    if (graded) return;
    if (!sel) {
      // nothing selected -> clicking an already-matched right unmatches it
      const owner = Object.keys(assign).find((k) => assign[k] === rid);
      if (owner) {
        setAssign((a) => {
          const next = { ...a };
          delete next[owner];
          return next;
        });
      }
      return;
    }
    const left = sel;
    setAssign((a) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(a)) if (v !== rid) next[k] = v;
      next[left] = rid;
      return next;
    });
    setSel(null);
  };

  const correctCount = exercise.pairs.filter((p) => assign[p.id] === p.id).length;
  const allAssigned = Object.keys(assign).length === exercise.pairs.length;
  const check = () => onGrade(partial(exercise.points, correctCount, exercise.pairs.length));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {exercise.pairs.map((p) => {
            const assigned = assign[p.id];
            const ok = graded && assigned === p.id;
            const bad = graded && assigned !== undefined && assigned !== p.id;
            let cls = "border-ink/15 bg-card hover:border-marine";
            if (sel === p.id) cls = "border-marine bg-marine/10";
            if (ok) cls = "border-emerald-400 bg-emerald-50";
            if (bad) cls = "border-rouge bg-rouge/5";
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => clickLeft(p.id)}
                  disabled={graded}
                  className={`w-full rounded-lg border p-2 text-left ${cls}`}
                >
                  <span className="font-medium text-marine">{p.left}</span>
                  {assigned && (
                    <span className="ml-2 text-sm text-ink/50">→ {rightTextById[assigned]}</span>
                  )}
                  {graded &&
                    (ok ? (
                      <span className="ml-2 text-emerald-700">✓</span>
                    ) : (
                      <span className="ml-2 text-rouge">✗</span>
                    ))}
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2">
          {rightOrder.map((rid) => {
            const used = usedRights.has(rid);
            return (
              <li key={rid}>
                <button
                  type="button"
                  onClick={() => clickRight(rid)}
                  disabled={graded || !sel}
                  className={`w-full rounded-lg border p-2 text-left transition-colors ${
                    used
                      ? "border-ink/10 bg-ink/5 text-ink/40"
                      : "border-ink/15 bg-card hover:border-marine"
                  }`}
                >
                  {rightTextById[rid]}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {!graded && (
        <p className="text-xs text-ink/50">
          Tap a French word, then its English match. Tap a matched item again to undo it.
        </p>
      )}
      {!graded && (
        <button
          type="button"
          onClick={check}
          disabled={!allAssigned}
          className="rounded bg-marine px-4 py-2 font-medium text-white disabled:opacity-40"
        >
          Check
        </button>
      )}
    </div>
  );
}
