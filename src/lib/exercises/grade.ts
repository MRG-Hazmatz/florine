/** Shared grading primitives used by the exercise components. */

export interface GradeResult {
  earned: number; // points earned (0..max)
  max: number; // points available
  correct: boolean; // fully correct
}

/** Order-independent set equality (for multi-select answers). */
export function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sb = new Set(b);
  return a.every((x) => sb.has(x));
}

/** Exact ordered equality (for sentence reordering). */
export function orderedEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** All-or-nothing scoring for single-answer exercises. */
export function allOrNothing(points: number, isCorrect: boolean): GradeResult {
  return { earned: isCorrect ? points : 0, max: points, correct: isCorrect };
}

/** Partial credit for composite exercises (match-pairs, multi-question reading). */
export function partial(points: number, correctCount: number, total: number): GradeResult {
  const frac = total === 0 ? 0 : correctCount / total;
  return { earned: points * frac, max: points, correct: frac === 1 };
}
