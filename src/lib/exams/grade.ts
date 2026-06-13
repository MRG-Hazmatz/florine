/**
 * Exam grading — auto-gradable sections only (CO listening, CE reading).
 * Production sections (PE/PO) are self-assessed against rubrics, scored
 * separately in the correction screen, never here.
 *
 * Answers are stored as a flat map: questionId -> selected option id (single
 * choice on real DELF/DALF answer sheets). A question scores full points when
 * the selected id is in its `correct` set, else zero — no partial credit, as
 * on the real paper.
 */
import type { Exam, ExamQuestion, ExamSection } from "./schema";

export type AnswerMap = Record<string, string | undefined>;

/** All auto-gradable questions in a section (listening + reading). */
export function sectionQuestions(section: ExamSection): ExamQuestion[] {
  return [
    ...section.docs.flatMap((d) => d.questions),
    ...section.texts.flatMap((t) => t.questions),
  ];
}

export interface SectionGrade {
  sectionId: string;
  title: string;
  earned: number;
  max: number;
  autoGraded: boolean; // false for PE/PO production sections
}

/** Grade one section. Production sections (tasks only) return autoGraded:false. */
export function gradeSection(section: ExamSection, answers: AnswerMap): SectionGrade {
  const qs = sectionQuestions(section);
  if (qs.length === 0) {
    // Pure production section — points come from self-assessment, not here.
    return { sectionId: section.id, title: section.title, earned: 0, max: section.points, autoGraded: false };
  }
  let earned = 0;
  for (const q of qs) {
    const picked = answers[q.id];
    if (picked && q.correct.includes(picked)) earned += q.points;
  }
  return { sectionId: section.id, title: section.title, earned, max: section.points, autoGraded: true };
}

export function gradeExam(exam: Exam, answers: AnswerMap): SectionGrade[] {
  return exam.sections.map((s) => gradeSection(s, answers));
}

/** Sum of auto-graded section points (the part software can mark objectively). */
export function autoTotals(grades: SectionGrade[]): { earned: number; max: number } {
  return grades
    .filter((g) => g.autoGraded)
    .reduce((acc, g) => ({ earned: acc.earned + g.earned, max: acc.max + g.max }), { earned: 0, max: 0 });
}
