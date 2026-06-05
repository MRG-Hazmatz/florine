/** French-aware answer normalization for free-text exercises (fill-blank). */

/** Lowercase, trim, collapse whitespace, normalize curly apostrophes to straight. */
export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ");
}

/** Strip diacritics so "cafe" can match "café" (forgiving of non-French keyboards). */
export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/**
 * True if `input` matches any accepted answer. Comparison is case-insensitive,
 * whitespace- and apostrophe-normalized, and accent-insensitive — we don't
 * punish a learner for a missing accent, but feedback always shows the correct
 * accented form.
 */
export function answerMatches(input: string, accepted: string[]): boolean {
  const n = normalizeAnswer(input);
  const nStripped = stripAccents(n);
  return accepted.some((a) => {
    const an = normalizeAnswer(a);
    return n === an || nStripped === stripAccents(an);
  });
}
