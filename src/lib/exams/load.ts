/**
 * Exam loader — same philosophy as content/load.ts: eager-glob the JSON at
 * build time, validate with Zod, and surface a broken paper as a visible
 * console error instead of a crash.
 */
import { examSchema, examTotalPoints, type Exam } from "./schema";

const examFiles = import.meta.glob("../../../content/exams/*/exam.json", {
  eager: true,
}) as Record<string, { default?: unknown } | unknown>;

function moduleData(mod: { default?: unknown } | unknown): unknown {
  return typeof mod === "object" && mod !== null && "default" in (mod as object)
    ? (mod as { default: unknown }).default
    : mod;
}

const exams: Exam[] = [];
for (const [path, mod] of Object.entries(examFiles)) {
  const parsed = examSchema.safeParse(moduleData(mod));
  if (!parsed.success) {
    console.error(`[florine] invalid exam file ${path}:`, parsed.error.issues);
    continue;
  }
  const exam = parsed.data;
  const total = examTotalPoints(exam);
  if (total !== 100) {
    console.warn(`[florine] exam ${exam.id} totals ${total} points (expected 100)`);
  }
  exams.push(exam);
}

exams.sort((a, b) =>
  a.levelKey === b.levelKey ? a.paper - b.paper : a.levelKey.localeCompare(b.levelKey),
);

export function getAllExams(): Exam[] {
  return exams;
}

export function getExam(id: string): Exam | undefined {
  return exams.find((e) => e.id === id);
}

/** Papers grouped for the hub, DELF before DALF, levels ascending. */
export function getExamGroups(): { examName: string; papers: Exam[] }[] {
  const groups = new Map<string, Exam[]>();
  for (const e of exams) {
    const list = groups.get(e.examName) ?? [];
    list.push(e);
    groups.set(e.examName, list);
  }
  return [...groups.entries()].map(([examName, papers]) => ({ examName, papers }));
}
