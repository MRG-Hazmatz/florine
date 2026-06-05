/**
 * SM-2 spaced repetition (the algorithm Anki is based on).
 *
 * Each card tracks an ease factor, the current interval (days), how many times
 * it's been recalled in a row, and when it's next due. The learner rates each
 * recall; a poor rating resets the interval, good ratings expand it.
 */

export interface SrsCard {
  ease: number; // ease factor (>= 1.3)
  intervalDays: number;
  reps: number; // consecutive successful recalls
  dueISO: string; // yyyy-mm-dd
  lastISO: string | null;
}

export type Rating = "again" | "hard" | "good" | "easy";

/** Map the four UI ratings to SM-2 quality scores (0..5). */
const QUALITY: Record<Rating, number> = { again: 0, hard: 3, good: 4, easy: 5 };

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** A brand-new card is due immediately. */
export function initialCard(now: Date = new Date()): SrsCard {
  return { ease: 2.5, intervalDays: 0, reps: 0, dueISO: isoDay(now), lastISO: null };
}

export function isDue(card: SrsCard, now: Date = new Date()): boolean {
  return card.dueISO <= isoDay(now);
}

/** Apply a review rating to a card, returning the updated card. */
export function review(card: SrsCard, rating: Rating, now: Date = new Date()): SrsCard {
  const q = QUALITY[rating];
  let ease = card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < 1.3) ease = 1.3;

  let reps = card.reps;
  let intervalDays = card.intervalDays;

  if (q < 3) {
    reps = 0;
    intervalDays = 1;
  } else {
    if (reps === 0) intervalDays = 1;
    else if (reps === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * ease);
    reps += 1;
  }

  const due = new Date(now);
  due.setDate(due.getDate() + intervalDays);

  return { ease, intervalDays, reps, dueISO: isoDay(due), lastISO: isoDay(now) };
}
