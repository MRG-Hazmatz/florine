/**
 * Frog-lore state — the hidden easter egg "La Complainte de la Grenouille".
 *
 * Three frogs hide across the app. WHERE they first hide is decided once, per
 * device, from a saved random seed (so each device gets its own pattern — you
 * never lose progress mid-hunt, and nobody can post "the frogs are here").
 *
 * It's also a little game you can keep playing: a popped frog REVIVES after a
 * while in a NEW spot. If you pop only one, just that one moves; if you pop all
 * three, the whole set re-rolls elsewhere. Popping the third also unlocks the
 * comic forever, so afterwards you can simply scroll to the footer and read it.
 *
 * Persisted: seed, chosen slots, popped (slot → time popped), unlocked, seen.
 * Ephemeral (never persisted): `open` (is the comic overlay showing now).
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
/** A popped frog comes back (elsewhere) after this long. */
const REVIVE_MS = 90_000;

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

/** One random free slot not already occupied by the `avoid` set. */
function freeSlot(avoid: Set<string>): string | null {
  const free = FROG_SLOTS.filter((s) => !avoid.has(s));
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

interface FrogLore {
  seed: string;
  chosen: string[];
  popped: Record<string, number>;
  unlocked: boolean;
  seen: boolean;
  open: boolean;
  /** Idempotent: assign this device its frog pattern if it has none yet. */
  ensureChosen: () => void;
  /** Pop (kill) a frog; the 3rd pop unlocks + auto-opens the comic. */
  popFrog: (slot: string) => void;
  /** Revive frogs whose time is up — relocate one, or re-roll all. */
  reviveDue: () => void;
  openComic: () => void;
  closeComic: () => void;
  reset: () => void;
}

export const useFrogLore = create<FrogLore>()(
  persist(
    (set, get) => ({
      seed: "",
      chosen: [],
      popped: {},
      unlocked: false,
      seen: false,
      open: false,

      ensureChosen: () => {
        if (get().chosen.length > 0) return;
        const seed = get().seed || newSeed();
        set({ seed, chosen: pickChosen(seed, CHOSEN_COUNT) });
      },

      popFrog: (slot) => {
        const { chosen, popped } = get();
        if (!chosen.includes(slot) || popped[slot]) return;
        const nextPopped = { ...popped, [slot]: Date.now() };
        const allPopped = chosen.every((s) => nextPopped[s]);
        set({
          popped: nextPopped,
          unlocked: allPopped || get().unlocked,
          open: allPopped ? true : get().open,
        });
      },

      reviveDue: () => {
        const now = Date.now();
        const { chosen, popped } = get();
        const poppedSlots = Object.keys(popped);
        const due = poppedSlots.filter((s) => now - popped[s] > REVIVE_MS);
        if (due.length === 0) return;

        // Whole set cleared and cooled down → re-roll a fresh trio elsewhere.
        if (poppedSlots.length >= chosen.length && due.length >= poppedSlots.length) {
          const seed = newSeed();
          let fresh = pickChosen(seed, CHOSEN_COUNT);
          // nudge away from the just-finished set if the re-roll collided
          if (fresh.every((s) => chosen.includes(s))) fresh = pickChosen(newSeed(), CHOSEN_COUNT);
          set({ seed, chosen: fresh, popped: {} });
          return;
        }

        // Otherwise relocate each cooled-down popped frog to a new free slot.
        let nextChosen = [...chosen];
        const nextPopped = { ...popped };
        for (const slot of due) {
          const dest = freeSlot(new Set(nextChosen));
          delete nextPopped[slot];
          if (dest) nextChosen = nextChosen.map((c) => (c === slot ? dest : c));
        }
        set({ chosen: nextChosen, popped: nextPopped });
      },

      openComic: () => set({ open: true }),
      closeComic: () => set({ open: false, seen: true }),
      reset: () => {
        const seed = newSeed();
        set({ seed, chosen: pickChosen(seed, CHOSEN_COUNT), popped: {}, unlocked: false, seen: false, open: false });
      },
    }),
    {
      name: "florine:froglore",
      version: 3,
      // Earlier versions used fixed slots / a `found` array. Re-roll cleanly;
      // ensureChosen() fills `chosen` afterwards.
      migrate: () => ({ seed: "", chosen: [], popped: {}, unlocked: false, seen: false }),
      partialize: (s) => ({
        seed: s.seed,
        chosen: s.chosen,
        popped: s.popped,
        unlocked: s.unlocked,
        seen: s.seen,
      }),
    },
  ),
);

// localStorage is synchronous, so by now the store is rehydrated: lock in this
// device's frog pattern, and revive anything whose timer already elapsed.
useFrogLore.getState().ensureChosen();
useFrogLore.getState().reviveDue();
