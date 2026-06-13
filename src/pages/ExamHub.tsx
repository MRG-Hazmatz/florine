import { Link } from "react-router-dom";
import { getExamGroups } from "../lib/exams/load";
import { examDurationMinutes, examTotalPoints } from "../lib/exams/schema";
import { useProgress } from "../lib/storage/progress";
import FrogSpot from "../components/FrogSpot";

/**
 * Exam hub — lists the mock papers grouped by exam, with best scores, and
 * credits delfdalf.fr as the format reference (where learners can also find the
 * official sample papers).
 */
export default function ExamHub() {
  const groups = getExamGroups();
  const examResults = useProgress((s) => s.examResults);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold">
          <img src="/icons/exams.png" alt="" className="h-14 object-contain mix-blend-multiply" />
          Salle d'examen
          <FrogSpot slot="exams-heading" className="self-start" />
        </h1>
        <p className="text-sm text-ink/60">
          Full mock papers in the authentic DELF/DALF format — fullscreen, timed, invigilated. Sit
          one start to finish to rehearse the real thing.
        </p>
      </header>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-ink/15 bg-card p-6 text-center text-ink/60">
          No exam papers yet — the first ones are on the way.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.examName} className="space-y-3">
              <h2 className="font-display text-xl font-semibold text-rouge">{group.examName}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {group.papers.map((exam) => {
                  const r = examResults[exam.id];
                  return (
                    <li key={exam.id}>
                      <Link
                        to={`/exams/${exam.id}`}
                        className="block h-full rounded-lg border border-marine/30 bg-card p-4 transition-colors hover:border-marine"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{exam.title}</span>
                          <span className="text-xs text-ink/45">
                            {examDurationMinutes(exam)} min · /{examTotalPoints(exam)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink/60">{exam.description}</p>
                        {r && (
                          <p className="mt-2 text-xs">
                            {r.total != null ? (
                              <span
                                className={
                                  r.passed ? "font-medium text-emerald-700" : "text-amber-700"
                                }
                              >
                                Best: {r.total % 1 === 0 ? r.total : r.total.toFixed(1)}/100
                                {r.passed ? " · admis" : ""}
                              </span>
                            ) : (
                              <span className="text-ink/50">
                                Best auto: {r.autoPoints}/{r.autoMax} (production not yet self-graded)
                              </span>
                            )}
                            <span className="text-ink/40">
                              {" "}
                              · {r.attempts} attempt{r.attempts > 1 ? "s" : ""}
                            </span>
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      <footer className="rounded-lg border border-ink/15 bg-parchment/60 p-4 text-sm text-ink/70">
        <p>
          <span className="font-semibold">Format reference.</span> Florine's papers are original
          content built to the authentic post-2020 DELF/DALF format. For the official sample papers,
          see{" "}
          <a
            href="https://www.delfdalf.fr/delf-sample-papers.html"
            target="_blank"
            rel="noreferrer noopener"
            className="text-marine underline"
          >
            delfdalf.fr
          </a>{" "}
          (© Yann Perrot / France Éducation International) — we credit it as our format reference and
          never copy its sujets.
          <FrogSpot slot="exams-footer" className="ml-1 align-middle" />
        </p>
      </footer>
    </section>
  );
}
