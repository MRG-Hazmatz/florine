import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Exam, ExamSection } from "../../lib/exams/schema";
import { useExamSession } from "../../lib/exams/session";
import { gradeExam, autoTotals, type AnswerMap } from "../../lib/exams/grade";
import {
  useExamGuard,
  useCountdown,
  formatClock,
  requestExamFullscreen,
  exitExamFullscreen,
} from "../../lib/exams/useExamGuard";
import { useProgress } from "../../lib/storage/progress";
import ListeningDocBlock from "./ListeningDoc";
import QuestionSheet from "./QuestionSheet";
import OpenTaskBlock from "./OpenTask";
import SelfGradeTask, { type RubricScores } from "./SelfGradeTask";

type Phase = "intro" | "running" | "correction";

const SKILL_FR: Record<string, string> = {
  listening: "Compréhension de l'oral",
  reading: "Compréhension des écrits",
  writing: "Production écrite",
  speaking: "Production orale",
};

export default function ExamRunner({ exam }: { exam: Exam }) {
  const recordExamResult = useProgress((s) => s.recordExamResult);

  const [phase, setPhase] = useState<Phase>("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionLive, setSectionLive] = useState(false); // briefing vs clock running
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [writing, setWriting] = useState<Record<string, string>>({});
  const [recorded, setRecorded] = useState<Record<string, boolean>>({});
  const [rubric, setRubric] = useState<Record<string, RubricScores>>({});
  const [saved, setSaved] = useState(false);

  const guard = useExamGuard(phase === "running");
  const section = exam.sections[sectionIndex];

  // Seal the exam hall (hide site nav) only while a section's clock is live.
  const setLive = useExamSession((s) => s.setLive);
  const hallSealed = phase === "running" && sectionLive;
  useEffect(() => {
    setLive(hallSealed);
    return () => setLive(false);
  }, [hallSealed, setLive]);

  const advance = () => {
    if (sectionIndex < exam.sections.length - 1) {
      setSectionIndex((i) => i + 1);
      setSectionLive(false);
    } else {
      exitExamFullscreen();
      setPhase("correction");
    }
  };

  const remaining = useCountdown(
    section ? Math.round(section.durationMinutes * 60) : 0,
    phase === "running" && sectionLive,
    advance,
  );

  const setAnswer = (qid: string, oid: string) => setAnswers((a) => ({ ...a, [qid]: oid }));

  // ---- INTRO -------------------------------------------------------------
  if (phase === "intro") {
    return (
      <ExamIntro
        exam={exam}
        onBegin={() => {
          requestExamFullscreen();
          setPhase("running");
          setSectionIndex(0);
          setSectionLive(false);
        }}
      />
    );
  }

  // ---- CORRECTION --------------------------------------------------------
  if (phase === "correction") {
    return (
      <Correction
        exam={exam}
        answers={answers}
        writing={writing}
        recorded={recorded}
        rubric={rubric}
        setRubric={setRubric}
        proctorCount={guard.events.length}
        saved={saved}
        onSave={(total, selfPoints, passed) => {
          const { earned, max } = autoTotals(gradeExam(exam, answers));
          recordExamResult(exam.id, {
            autoPoints: earned,
            autoMax: max,
            selfPoints,
            total,
            passed,
          });
          setSaved(true);
        }}
      />
    );
  }

  // ---- RUNNING -----------------------------------------------------------
  return (
    <div className="space-y-5">
      {/* Sticky invigilation bar */}
      <div className="sticky top-16 z-40 flex items-center justify-between rounded-lg border border-ink/20 bg-parchment/95 px-4 py-2 shadow-sm backdrop-blur">
        <div className="text-sm">
          <span className="font-semibold">{exam.examName}</span>
          <span className="text-ink/50"> · {section.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {!guard.fullscreen && sectionLive && (
            <button
              type="button"
              onClick={guard.reFullscreen}
              className="rounded bg-rouge/10 px-2 py-1 text-xs font-medium text-rouge"
            >
              ⤢ Re-enter fullscreen
            </button>
          )}
          {sectionLive && (
            <span
              className={`font-mono text-lg font-bold tabular-nums ${
                remaining < 60 ? "text-rouge" : "text-ink/80"
              }`}
            >
              {formatClock(remaining)}
            </span>
          )}
        </div>
      </div>

      {guard.events.length > 0 && (
        <p className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
          ⚠ {guard.events.length} invigilation event{guard.events.length > 1 ? "s" : ""} recorded
          (leaving the window, exiting fullscreen, or copy/paste). These appear on your score sheet.
        </p>
      )}

      {!sectionLive ? (
        <SectionBriefing
          section={section}
          index={sectionIndex}
          total={exam.sections.length}
          onStart={() => {
            if (!guard.fullscreen) requestExamFullscreen();
            setSectionLive(true);
          }}
        />
      ) : (
        <>
          <SectionBody
            section={section}
            answers={answers}
            setAnswer={setAnswer}
            writing={writing}
            onWriting={(id, t) => setWriting((w) => ({ ...w, [id]: t }))}
            recorded={recorded}
            onRecorded={(id, d) => setRecorded((r) => ({ ...r, [id]: d }))}
          />
          <div className="flex justify-end border-t border-ink/15 pt-4">
            <button
              type="button"
              onClick={advance}
              className="rounded bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90"
            >
              {sectionIndex < exam.sections.length - 1
                ? "Soumettre et continuer →"
                : "Terminer l'examen"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function ExamIntro({ exam, onBegin }: { exam: Exam; onBegin: () => void }) {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/40">{exam.family}</p>
        <h1 className="font-display text-3xl font-bold">{exam.examName}</h1>
        <p className="italic text-ink/50">{exam.title}</p>
      </header>

      <div className="space-y-3 rounded-lg border border-ink/20 bg-card p-5">
        <p className="text-sm text-ink/80">{exam.description}</p>
        <ul className="space-y-1.5 text-sm">
          {exam.sections.map((s) => (
            <li key={s.id} className="flex justify-between gap-2 border-b border-ink/10 pb-1.5">
              <span>{s.title}</span>
              <span className="shrink-0 text-ink/50">
                {Math.round(s.durationMinutes)} min · {s.points} pts
              </span>
            </li>
          ))}
          <li className="flex justify-between gap-2 pt-1 font-semibold">
            <span>Total</span>
            <span>/{exam.sections.reduce((n, s) => n + s.points, 0)} · pass ≥ {exam.passMark}</span>
          </li>
        </ul>
      </div>

      <div className="space-y-2 rounded-lg border border-rouge/30 bg-rouge/5 p-4 text-sm text-ink/80">
        <p className="font-semibold text-rouge">Conditions d'examen — exam-hall rules</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>The exam runs in fullscreen. Each section is timed and cannot be paused.</li>
          <li>
            Leaving the tab/window, exiting fullscreen, and copy/paste are recorded as invigilation
            events and shown on your score sheet.
          </li>
          <li>You won't see answers until you finish the whole paper.</li>
          <li>Have paper, a pen, and (for the oral) a working microphone ready.</li>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBegin}
          className="rounded-lg bg-rouge px-6 py-3 font-medium text-white hover:bg-rouge/90"
        >
          Entrer dans la salle →
        </button>
        <Link to="/exams" className="text-sm text-marine hover:underline">
          Back to exams
        </Link>
      </div>
    </div>
  );
}

function SectionBriefing({
  section,
  index,
  total,
  onStart,
}: {
  section: ExamSection;
  index: number;
  total: number;
  onStart: () => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-ink/20 bg-card p-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/40">
        Épreuve {index + 1} / {total}
      </p>
      <h2 className="font-display text-2xl font-bold">{section.title}</h2>
      <p className="mx-auto max-w-prose text-sm text-ink/75">{section.instructions}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-ink/60">
        <span>⏱ {Math.round(section.durationMinutes)} min</span>
        {section.prepMinutes && <span>préparation {Math.round(section.prepMinutes)} min</span>}
        <span>/{section.points} points</span>
        {section.eliminatoryBelow > 0 && (
          <span className="text-rouge">
            éliminatoire &lt; {section.eliminatoryBelow}/{section.points}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onStart}
        className="rounded-lg bg-marine px-6 py-3 font-medium text-white hover:bg-marine/90"
      >
        Démarrer le chronomètre →
      </button>
      <p className="text-xs text-ink/40">The clock starts when you click. No going back.</p>
    </div>
  );
}

function SectionBody({
  section,
  answers,
  setAnswer,
  writing,
  onWriting,
  recorded,
  onRecorded,
}: {
  section: ExamSection;
  answers: AnswerMap;
  setAnswer: (qid: string, oid: string) => void;
  writing: Record<string, string>;
  onWriting: (id: string, t: string) => void;
  recorded: Record<string, boolean>;
  onRecorded: (id: string, done: boolean) => void;
}) {
  // Running question numbers across the whole section.
  let n = 1;
  return (
    <div className="space-y-5">
      {section.docs.map((doc) => {
        const start = n;
        n += doc.questions.length;
        return (
          <ListeningDocBlock
            key={doc.id}
            doc={doc}
            answers={answers}
            onAnswer={setAnswer}
            locked={false}
            correction={false}
            startNumber={start}
          />
        );
      })}
      {section.texts.map((text) => {
        const start = n;
        n += text.questions.length;
        return (
          <section key={text.id} className="space-y-3 rounded-lg border border-ink/15 bg-parchment/60 p-4">
            <h3 className="font-display text-lg font-semibold">{text.title}</h3>
            <div className="whitespace-pre-line rounded border border-ink/10 bg-card p-3 text-sm leading-relaxed text-ink/85">
              {text.passageFr}
            </div>
            <QuestionSheet
              questions={text.questions}
              answers={answers}
              onAnswer={setAnswer}
              locked={false}
              startNumber={start}
            />
          </section>
        );
      })}
      {section.tasks.map((task) => (
        <OpenTaskBlock
          key={task.id}
          task={task}
          writing={writing[task.id] ?? ""}
          onWriting={onWriting}
          recorded={recorded[task.id] ?? false}
          onRecorded={onRecorded}
          locked={false}
        />
      ))}
    </div>
  );
}

function Correction({
  exam,
  answers,
  writing,
  recorded,
  rubric,
  setRubric,
  proctorCount,
  saved,
  onSave,
}: {
  exam: Exam;
  answers: AnswerMap;
  writing: Record<string, string>;
  recorded: Record<string, boolean>;
  rubric: Record<string, RubricScores>;
  setRubric: React.Dispatch<React.SetStateAction<Record<string, RubricScores>>>;
  proctorCount: number;
  saved: boolean;
  onSave: (total: number, selfPoints: number, passed: boolean) => void;
}) {
  const grades = useMemo(() => gradeExam(exam, answers), [exam, answers]);
  const tasks = exam.sections.flatMap((s) => s.tasks);

  const selfPoints = tasks.reduce((sum, t) => {
    const r = rubric[t.id] ?? {};
    return sum + t.rubric.reduce((n, l) => n + (r[l.id] ?? 0), 0);
  }, 0);
  const autoPoints = grades.filter((g) => g.autoGraded).reduce((n, g) => n + g.earned, 0);
  const total = autoPoints + selfPoints;

  // Per-section /eliminatory check on the best available signal.
  const sectionScores = exam.sections.map((s) => {
    const g = grades.find((x) => x.sectionId === s.id)!;
    if (g.autoGraded) return { section: s, earned: g.earned, max: s.points };
    const earned = s.tasks.reduce((n, t) => {
      const r = rubric[t.id] ?? {};
      return n + t.rubric.reduce((m, l) => m + (r[l.id] ?? 0), 0);
    }, 0);
    return { section: s, earned, max: s.points };
  });
  const eliminated = sectionScores.some((x) => x.earned < x.section.eliminatoryBelow);
  const passed = total >= exam.passMark && !eliminated;

  return (
    <div className="space-y-6">
      <header className="space-y-1 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/40">Correction</p>
        <h1 className="font-display text-3xl font-bold">{exam.examName}</h1>
      </header>

      {/* Score banner */}
      <div
        className={`rounded-xl border p-6 text-center ${
          passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"
        }`}
      >
        <p className="text-sm uppercase tracking-wide text-ink/50">Score total</p>
        <p className="font-fancy text-6xl font-bold">
          {total % 1 === 0 ? total : total.toFixed(1)}
          <span className="text-3xl text-ink/40"> / 100</span>
        </p>
        <p className="mt-1 text-sm text-ink/60">
          {autoPoints} auto · {selfPoints % 1 === 0 ? selfPoints : selfPoints.toFixed(1)} production
          · pass ≥ {exam.passMark}
        </p>
        {passed ? (
          <p className="mt-2 font-fancy text-xl font-bold uppercase tracking-widest text-emerald-800">
            Admis !
          </p>
        ) : eliminated ? (
          <p className="mt-2 text-sm font-semibold text-rouge">
            Note éliminatoire dans une épreuve (&lt; seuil) — le diplôme n'est pas délivré.
          </p>
        ) : (
          <p className="mt-2 text-sm">Below {exam.passMark}/100 — review and retake.</p>
        )}
      </div>

      {/* Per-section breakdown */}
      <div className="rounded-lg border border-ink/15 bg-card p-4">
        <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-ink/50">
          Relevé de notes
        </p>
        <ul className="space-y-1.5 text-sm">
          {sectionScores.map(({ section, earned, max }) => {
            const elim = earned < section.eliminatoryBelow;
            return (
              <li key={section.id} className="flex items-center justify-between gap-2">
                <span className="text-ink/75">{SKILL_FR[section.skill] ?? section.title}</span>
                <span className={`font-medium ${elim ? "text-rouge" : "text-ink/70"}`}>
                  {earned % 1 === 0 ? earned : earned.toFixed(1)} / {max}
                  {elim && " ⚠"}
                </span>
              </li>
            );
          })}
        </ul>
        {proctorCount > 0 && (
          <p className="mt-3 border-t border-ink/10 pt-2 text-xs text-amber-800">
            ⚠ {proctorCount} invigilation event{proctorCount > 1 ? "s" : ""} were recorded during
            this attempt.
          </p>
        )}
      </div>

      {/* Self-grade each production task */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-marine/30 bg-marine/5 p-3 text-sm text-ink/80">
            <p className="font-semibold text-marine">Auto-évaluation des productions</p>
            <p>
              Software can mark the listening and reading objectively, but writing and speaking need
              a human eye. Read the model answer, then grade yourself against the official-style grid
              — honestly. That's how the real examiner would score you.
            </p>
          </div>
          {exam.sections
            .filter((s) => s.tasks.length > 0)
            .map((s) => (
              <div key={s.id} className="space-y-3">
                <h2 className="font-display text-lg font-semibold">{s.title}</h2>
                {s.tasks.map((task) => (
                  <SelfGradeTask
                    key={task.id}
                    task={task}
                    writing={writing[task.id] ?? ""}
                    recorded={recorded[task.id] ?? false}
                    scores={rubric[task.id] ?? {}}
                    onScore={(lineId, points) =>
                      setRubric((prev) => ({
                        ...prev,
                        [task.id]: { ...(prev[task.id] ?? {}), [lineId]: points },
                      }))
                    }
                  />
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Auto-graded answer review */}
      <details className="rounded-lg border border-ink/15 bg-card p-4">
        <summary className="cursor-pointer font-display text-sm uppercase tracking-[0.2em] text-ink/50">
          Voir les corrections (CO / CE)
        </summary>
        <div className="mt-3 space-y-5">
          {exam.sections
            .filter((s) => s.docs.length > 0 || s.texts.length > 0)
            .map((s) => (
              <div key={s.id} className="space-y-3">
                <h3 className="font-semibold">{s.title}</h3>
                {s.docs.map((doc) => (
                  <ListeningDocBlock
                    key={doc.id}
                    doc={doc}
                    answers={answers}
                    onAnswer={() => {}}
                    locked
                    correction
                    startNumber={1}
                  />
                ))}
                {s.texts.map((text) => (
                  <section key={text.id} className="space-y-2">
                    <h4 className="text-sm font-medium text-ink/70">{text.title}</h4>
                    <QuestionSheet
                      questions={text.questions}
                      answers={answers}
                      onAnswer={() => {}}
                      locked
                      correction
                    />
                  </section>
                ))}
              </div>
            ))}
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(total, selfPoints, passed)}
          disabled={saved}
          className="rounded-lg bg-marine px-5 py-2.5 font-medium text-white hover:bg-marine/90 disabled:opacity-50"
        >
          {saved ? "✓ Résultat enregistré" : "Enregistrer le résultat"}
        </button>
        <Link
          to="/exams"
          className="rounded-lg border border-marine/30 px-5 py-2.5 font-medium text-marine"
        >
          Back to exams
        </Link>
      </div>
    </div>
  );
}
