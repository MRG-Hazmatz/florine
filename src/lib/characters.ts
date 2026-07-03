/**
 * "Strangers Vol. 1" character faces by Francisco Lemos (lemos.itch.io),
 * CC BY 4.0. Used as the app's uncanny "guide" characters — creepy visuals,
 * normal/helpful copy.
 */
export const STRANGER_COUNT = 20;

export function strangerUrl(n: number): string {
  const i = (((n - 1) % STRANGER_COUNT) + STRANGER_COUNT) % STRANGER_COUNT;
  return `/characters/strangers/Strangers_${String(i + 1).padStart(3, "0")}.png`;
}

/** Deterministically pick a face number (1-based) from a seed string. */
export function faceIndexFor(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % STRANGER_COUNT) + 1;
}

/** Deterministically pick a face from a seed string (stable across renders). */
export function faceFor(seed: string): string {
  return strangerUrl(faceIndexFor(seed));
}

/**
 * The teaching face for a unit. Each level gets its own seeded shuffle of all
 * 20 strangers and units draw from it by unit number — so within a level no
 * character ever teaches two units (levels never exceed 20 units).
 */
export function unitFaceIndex(level: string, unitNumber: number): number {
  let state = faceIndexFor(level) * 2654435761;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  const faces = Array.from({ length: STRANGER_COUNT }, (_, i) => i + 1);
  for (let i = faces.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [faces[i], faces[j]] = [faces[j], faces[i]];
  }
  const idx = (((unitNumber - 1) % STRANGER_COUNT) + STRANGER_COUNT) % STRANGER_COUNT;
  return faces[idx];
}
