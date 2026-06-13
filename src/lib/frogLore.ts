/**
 * Frog-lore state — the hidden easter egg "La Complainte de la Grenouille".
 *
 * Three frogs are tucked, low-contrast, into the app. Click all three and the
 * cursed-frog origin comic plays. Kept in its own persisted store (separate
 * from learning progress) because it's pure flavour: which frogs you've found,
 * whether the tale is unlocked, and whether you've already watched it once.
 *
 * `open` is ephemeral UI state (is the overlay showing right now) — it is NOT
 * persisted; only `found`, `unlocked` and `seen` survive a reload.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** The three hidden frog ids. Order doesn't matter; uniqueness does. */
export const FROG_IDS = ["home", "almanac", "levels"] as const;
export type FrogId = (typeof FROG_IDS)[number];

interface FrogLore {
  found: string[];
  unlocked: boolean;
  seen: boolean;
  open: boolean;
  findFrog: (id: FrogId) => void;
  openComic: () => void;
  closeComic: () => void;
  reset: () => void;
}

export const useFrogLore = create<FrogLore>()(
  persist(
    (set, get) => ({
      found: [],
      unlocked: false,
      seen: false,
      open: false,

      findFrog: (id) => {
        if (get().found.includes(id)) return;
        const found = [...get().found, id];
        const unlocked = found.length >= FROG_IDS.length;
        // Completing the trio unlocks the tale AND opens it straight away.
        set({ found, unlocked: unlocked || get().unlocked, open: unlocked ? true : get().open });
      },

      openComic: () => set({ open: true }),
      closeComic: () => set({ open: false, seen: true }),
      reset: () => set({ found: [], unlocked: false, seen: false, open: false }),
    }),
    {
      name: "florine:froglore",
      version: 1,
      // Persist only the durable bits; never persist the open overlay flag.
      partialize: (s) => ({ found: s.found, unlocked: s.unlocked, seen: s.seen }),
    },
  ),
);
