import { useState } from "react";
import type { Exercise } from "../../lib/content/schema";
import { answerMatches } from "../../lib/exercises/normalize";
import { partial, type GradeResult } from "../../lib/exercises/grade";

type FB = Extract<Exercise, { type: "fill-blank" }>;

interface Part {
  text: string;
  blankId?: string;
}

function parseTemplate(t: string): Part[] {
  const parts: Part[] = [];
  const re = /\{\{(\w+)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t)) !== null) {
    if (m.index > last) parts.push({ text: t.slice(last, m.index) });
    parts.push({ text: "", blankId: m[1] });
    last = re.lastIndex;
  }
  if (last < t.length) parts.push({ text: t.slice(last) });
  return parts;
}

export default function FillBlank({
  exercise,
  graded,
  onGrade,
}: {
  exercise: FB;
  graded: boolean;
  onGrade: (r: GradeResult) => void;
}) {
  const parts = parseTemplate(exercise.template);
  const [values, setValues] = useState<Record<string, string>>({});
  const blanksById = Object.fromEntries(exercise.blanks.map((b) => [b.id, b]));

  const allFilled = exercise.blanks.every((b) => (values[b.id] ?? "").trim().length > 0);

  const check = () => {
    const correctCount = exercise.blanks.filter((b) =>
      answerMatches(values[b.id] ?? "", b.accept),
    ).length;
    onGrade(partial(exercise.points, correctCount, exercise.blanks.length));
  };

  const fieldCls = (ok: boolean) =>
    graded
      ? ok
        ? "border-emerald-400 bg-emerald-50"
        : "border-rouge bg-rouge/5"
      : "border-marine/40 focus:border-marine";

  return (
    <div className="space-y-3">
      <p className="text-lg leading-loose">
        {parts.map((p, i) => {
          if (!p.blankId) return <span key={i}>{p.text}</span>;
          const bid = p.blankId;
          const b = blanksById[bid];
          const val = values[bid] ?? "";
          const ok = answerMatches(val, b.accept);
          if (exercise.inputMode === "dropdown" && b.options) {
            return (
              <select
                key={i}
                value={val}
                disabled={graded}
                onChange={(e) => setValues((v) => ({ ...v, [bid]: e.target.value }))}
                className={`mx-1 rounded border px-2 py-1 outline-none ${fieldCls(ok)}`}
              >
                <option value="">—</option>
                {b.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          }
          return (
            <input
              key={i}
              value={val}
              disabled={graded}
              onChange={(e) => setValues((v) => ({ ...v, [bid]: e.target.value }))}
              onKeyDown={(e) => {
                if (graded || !allFilled) return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  check();
                } else if (e.key === " " && (values[bid] ?? "").endsWith(" ")) {
                  e.preventDefault();
                  check();
                }
              }}
              placeholder="…"
              className={`mx-1 w-32 rounded border px-2 py-1 outline-none ${fieldCls(ok)}`}
            />
          );
        })}
      </p>
      {graded && (
        <p className="text-sm text-ink/60">
          Accepted answer{exercise.blanks.length > 1 ? "s" : ""}:{" "}
          {exercise.blanks.map((b) => b.accept[0]).join(", ")}
        </p>
      )}
      {!graded && (
        <div className="space-y-2">
          <p className="text-xs text-ink/45">
            Tip: double-tap the spacebar (or press Enter) to submit.
          </p>
          <button
            type="button"
            onClick={check}
            disabled={!allFilled}
            className="rounded bg-marine px-4 py-2 font-medium text-white disabled:opacity-40"
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
