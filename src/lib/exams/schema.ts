/**
 * Mock-exam schema — the contract between content/exams/{id}/exam.json and the
 * exam player. Mirrors the real DELF/DALF paper anatomy (post-2020 format):
 * four épreuves, per-section timers, /100 total, eliminatory thresholds.
 *
 * Unlike unit exercises, exam items give NO feedback while the clock runs —
 * answers are sheets, not conversations. Auto-graded sections (CO/CE) are MCQ
 * documents; open sections (PE/PO) are tasks graded after the exam against the
 * official grids (simplified) via self-assessment.
 *
 * Format reference: delfdalf.fr (papers there are © Yann PERROT / France
 * Éducation International — Florine papers are ORIGINAL content in the
 * authentic format; we credit the reference, we never copy it).
 */
import { z } from "zod";
import { skillSchema, voiceSchema } from "../content/schema";

export const EXAM_SCHEMA_VERSION = 1;

/** One multiple-choice question on the answer sheet. */
export const examQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(), // in French, as on the real paper
  options: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
  correct: z.array(z.string()).min(1),
  points: z.number().positive(),
});
export type ExamQuestion = z.infer<typeof examQuestionSchema>;

/** A listening document: audio played a limited number of times. */
export const listeningDocSchema = z.object({
  id: z.string(),
  title: z.string(), // e.g. "Document 1 — Annonce"
  audio: z.string(),
  transcript: z.string(), // drives TTS generation; revealed only in correction
  voice: voiceSchema.default("denise"),
  listens: z.number().int().positive().default(2), // authentic play limit
  questions: z.array(examQuestionSchema).min(1),
});
export type ListeningDoc = z.infer<typeof listeningDocSchema>;

/** A reading text with its questions. */
export const readingTextSchema = z.object({
  id: z.string(),
  title: z.string(),
  passageFr: z.string(),
  questions: z.array(examQuestionSchema).min(1),
});
export type ReadingText = z.infer<typeof readingTextSchema>;

/** One line of a (simplified) official grading grid. */
export const rubricLineSchema = z.object({
  id: z.string(),
  label: z.string(), // e.g. "Respect de la consigne"
  points: z.number().positive(), // max for this criterion
});
export type RubricLine = z.infer<typeof rubricLineSchema>;

/** An open production task (writing or speaking part), self-graded post-exam. */
export const openTaskSchema = z.object({
  id: z.string(),
  kind: z.enum(["writing", "speaking", "ensemble"]), // ensemble = whole-épreuve language criteria
  title: z.string(), // e.g. "Exercice en interaction"
  consigne: z.string().default(""), // the French instruction, as printed
  documentFr: z.string().optional(), // document déclencheur, if any
  minWords: z.number().int().positive().optional(), // PE word floor
  points: z.number().positive(),
  rubric: z.array(rubricLineSchema).min(1),
  modelAnswer: z.string(), // model copy / talking points, shown in correction
});
export type OpenTask = z.infer<typeof openTaskSchema>;

export const examSectionSchema = z
  .object({
    id: z.string(), // "co" | "ce" | "pe" | "po" (or C2 combined ids)
    skill: skillSchema,
    title: z.string(), // "Compréhension de l'oral"
    durationMinutes: z.number().positive(),
    prepMinutes: z.number().positive().optional(), // PO preparation time
    points: z.number().positive(), // 25 (DELF/DALF C1) or 50 (C2)
    eliminatoryBelow: z.number().nonnegative().default(5),
    instructions: z.string(), // consignes générales for the section
    docs: z.array(listeningDocSchema).default([]),
    texts: z.array(readingTextSchema).default([]),
    tasks: z.array(openTaskSchema).default([]),
  })
  .refine(
    (s) => s.docs.length + s.texts.length + s.tasks.length > 0,
    "A section needs at least one doc, text or task",
  );
export type ExamSection = z.infer<typeof examSectionSchema>;

export const examSchema = z.object({
  schemaVersion: z.number().int(),
  id: z.string(), // "delf-b1-01"
  family: z.enum(["DELF", "DALF"]),
  examName: z.string(), // "DELF B1 Junior"
  levelKey: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]),
  paper: z.number().int().positive(),
  title: z.string(), // "Sujet blanc nº 1"
  description: z.string(),
  passMark: z.number().positive().default(50),
  sections: z.array(examSectionSchema).min(1),
});
export type Exam = z.infer<typeof examSchema>;

/** Total points across sections (should be 100 on real formats). */
export function examTotalPoints(exam: Exam): number {
  return exam.sections.reduce((n, s) => n + s.points, 0);
}

/** Total seat time in minutes (excluding PO prep). */
export function examDurationMinutes(exam: Exam): number {
  return Math.round(exam.sections.reduce((n, s) => n + s.durationMinutes + (s.prepMinutes ?? 0), 0));
}

/** Max points of one section's auto-graded questions (sanity vs declared points). */
export function sectionQuestionPoints(s: ExamSection): number {
  const qs = [...s.docs.flatMap((d) => d.questions), ...s.texts.flatMap((t) => t.questions)];
  return qs.reduce((n, q) => n + q.points, 0) + s.tasks.reduce((n, t) => n + t.points, 0);
}
