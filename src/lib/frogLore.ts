/**
 * Frog-lore state — the hidden easter egg "La Complainte de la Grenouille".
 *
 * Three frogs are tucked, low-contrast, into the app. But WHERE they hide is
 * decided once, per device, from a saved random seed: the very first time you
 * open Florine it picks 3 of a pool of candidate slots and remembers them. So
 * every device gets its own stable hiding pattern — you never lose progress
 * mid-hunt, and nobody can post "the frogs are here" online, because yours are
 * somewhere else.
 *
 * Persisted: seed, chosen slots, found slots, unlocked, seen. Ephemeral (never
 * persisted): `open` (is the comic overlay showing right now).
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** The candidate hiding places, spread across pages. Each device shows 3. */
export const FROG_SLOTS = [
  "home-stats",
  "home-greeting",
  "levels-heading",
  "almanac-subtitle",
  "review-heading",
  "review-browse",
  "exams-heading",
  "exams-footer",
] as const;
export type FrogSlot = (typeof FROG_SLOTS)[number];

const CHOSEN_COUNT = 3;

function newSeed(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic, seed-driven pick of `n` slots — same seed ⇒ same frogs. */
function pickChosen(seed: string, n: number): string[] {
  const a = [...FROG_SLOTS];
  let state = hashStr(seed) || 1;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

interface FrogLore {
  seed: string;
  chosen: string[];
  found: string[];
  unlocked: boolean;
  seen: boolean;
  open: boolean;
  /** Idempotent: assign this device its frog pattern if it has none yet. */
  ensureChosen: () => void;
  findFrog: (slot: string) => void;
  openComic: () => void;
  closeComic: () => void;
  reset: () => void;
}

export const useFrogLore = create<FrogLore>()(
  persist(
    (set, get) => ({
      seed: "",
      chosen: [],
      found: [],
      unlocked: false,
      seen: false,
      open: false,

      ensureChosen: () => {
        if (get().chosen.length > 0) return;
        const seed = get().seed || newSeed();
        set({ seed, chosen: pickChosen(seed, CHOSEN_COUNT) });
      },

      findFrog: (slot) => {
        const { chosen, found } = get();
        if (!chosen.includes(slot) || found.includes(slot)) return;
        const nextFound = [...found, slot];
        const unlocked = nextFound.length >= chosen.length;
        set({
          found: nextFound,
          unlocked: unlocked || get().unlocked,
          open: unlocked ? true : get().open,
        });
      },

      openComic: () => set({ open: true }),
      closeComic: () => set({ open: false, seen: true }),
      reset: () => {
        const seed = newSeed();
        set({ seed, chosen: pickChosen(seed, CHOSEN_COUNT), found: [], unlocked: false, seen: false, open: false });
      },
    }),
    {
      name: "florine:froglore",
      version: 2,
      // v1 used fixed id-based slots (home/almanac/levels) and had no per-device
      // pattern. Re-roll cleanly into v2; ensureChosen() fills `chosen` after.
      migrate: () => ({ seed: "", chosen: [], found: [], unlocked: false, seen: false }),
      partialize: (s) => ({
        seed: s.seed,
        chosen: s.chosen,
        found: s.found,
        unlocked: s.unlocked,
        seen: s.seen,
      }),
    },
  ),
);

// localStorage is synchronous, so by now the store is rehydrated: lock in this
// device's frog pattern before any component renders a FrogSpot.
useFrogLore.getState().ensureChosen();
