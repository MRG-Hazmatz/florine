/** Count words the way a DELF examiner roughly would (whitespace-separated). */
export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
