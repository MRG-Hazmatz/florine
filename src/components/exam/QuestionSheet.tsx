import type { ExamQuestion } from "../../lib/exams/schema";
import type { AnswerMap } from "../../lib/exams/grade";

/**
 * A block of exam questions rendered as an answer sheet: radio options, no
 * feedback, no correctness hints. `locked` freezes inputs after the section is
 * submitted (or the timer expires). In `correction` mode it colours the right
 * answer and the candidate's pick.
 */
export default function QuestionSheet({
  questions,
  answers,
  onAnswer,
  locked = false,
  correction = false,
  startNumber = 1,
}: {
  questions: ExamQuestion[];
  answers: AnswerMap;
  onAnswer: (qid: string, oid: string) => void;
  locked?: boolean;
  correction?: boolean;
  startNumber?: number;
}) {
  return (
    <ol className="space-y-5">
      {questions.map((q, i) => {
        const picked = answers[q.id];
        return (
          <li key={q.id} className="space-y-2">
            <p className="font-medium">
              <span className="mr-2 text-ink/40">{startNumber + i}.</span>
              {q.prompt}
              <span className="ml-2 text-xs text-ink/40">({q.points} pt{q.points > 1 ? "s" : ""})</span>
            </p>
            <div className="space-y-1.5">
              {q.options.map((o) => {
                const isPicked = picked === o.id;
                const isCorrect = q.correct.includes(o.id);
                let cls = "border-ink/15 bg-card";
                if (correction) {
                  if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                  else if (isPicked) cls = "border-rouge/50 bg-rouge/5";
                } else if (isPicked) {
                  cls = "border-marine bg-marine/10";
                }
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-start gap-2 rounded border p-2 text-sm transition-colors ${cls} ${
                      locked ? "cursor-default" : "hover:border-marine/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="mt-0.5"
                      checked={isPicked}
                      disabled={locked}
                      onChange={() => onAnswer(q.id, o.id)}
                    />
                    <span>{o.text}</span>
                    {correction && isCorrect && (
                      <span className="ml-auto text-xs font-semibold text-emerald-700">✓ réponse</span>
                    )}
                  </label>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
