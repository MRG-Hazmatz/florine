/**
 * Progress store (Phase 1 foundation).
 *
 * Persisted to LocalStorage via Zustand's persist middleware under a versioned,
 * namespaced key. This is intentionally lightweight: it defines the SHAPE of
 * progress and a few basic actions. The full spaced-repetition (SM-2) logic and
 * per-skill scoring land in Phase 2 — but the storage contract is set now, with
 * a version field and JSON export/import so a future migration (or a cleared
 * browser cache) never silently destroys a real learner's history.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Skill } from "../content/schema";
import { review, initialCard, type SrsCard, type Rating } from "../srs/sm2";

/** Build the stable per-vocab key used in the SRS map. */
export function vocabKey(unitId: string, vocabId: string): string {
  return `${unitId}::${vocabId}`;
}

export type UnitStatus = "not-started" | "in-progress" | "completed";

export interface UnitProgress {
  status: UnitStatus;
  bestScore: number; // 0..1 on the mini-test
  lastVisitedISO: string | null;
}

const STORAGE_KEY = "florine:progress";
const STORAGE_VERSION = 1;
const DEFAULT_PASS = 0.7;

function emptySkillXp(): Record<Skill, number> {
  return { reading: 0, listening: 0, writing: 0, speaking: 0 };
}

const emptyUnit: UnitProgress = {
  status: "not-started",
  bestScore: 0,
  lastVisitedISO: null,
};

interface ProgressData {
  version: number;
  unitProgress: Record<string, UnitProgress>; // keyed by unit id
  skillXp: Record<Skill, number>;
  totalStudyMinutes: number;
  streakDays: number;
  lastStudyDate: string | null; // ISO yyyy-mm-dd
  vocab: Record<string, SrsCard>; // SRS cards, keyed by vocabKey()
}

interface ProgressActions {
  markVisited: (unitId: string) => void;
  recordScore: (unitId: string, score: number) => void;
  addStudyMinutes: (mins: number) => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  addSkillXp: (skill: Skill, n: number) => void;
  touchStreak: () => void;
  reviewVocab: (key: string, rating: Rating) => void;
  /** Add a card to the learner's personal review deck (due immediately). */
  addVocabCard: (key: string) => void;
  /** Remove a card from the review deck (it stops counting as due). */
  removeVocabCard: (key: string) => void;
  resetAll: () => void;
}

export type ProgressState = ProgressData & ProgressActions;

const initialData: ProgressData = {
  version: STORAGE_VERSION,
  unitProgress: {},
  skillXp: emptySkillXp(),
  totalStudyMinutes: 0,
  streakDays: 0,
  lastStudyDate: null,
  vocab: {},
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialData,

      markVisited: (unitId) =>
        set((s) => {
          const cur = s.unitProgress[unitId] ?? emptyUnit;
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: {
                ...cur,
                status: cur.status === "completed" ? "completed" : "in-progress",
                lastVisitedISO: new Date().toISOString(),
              },
            },
          };
        }),

      recordScore: (unitId, score) =>
        set((s) => {
          const cur = s.unitProgress[unitId] ?? emptyUnit;
          const bestScore = Math.max(cur.bestScore, score);
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: {
                ...cur,
                bestScore,
                status: bestScore >= DEFAULT_PASS ? "completed" : "in-progress",
              },
            },
          };
        }),

      addStudyMinutes: (mins) =>
        set((s) => ({ totalStudyMinutes: s.totalStudyMinutes + mins })),

      exportJSON: () => {
        const s = get();
        const data: ProgressData = {
          version: s.version,
          unitProgress: s.unitProgress,
          skillXp: s.skillXp,
          totalStudyMinutes: s.totalStudyMinutes,
          streakDays: s.streakDays,
          lastStudyDate: s.lastStudyDate,
          vocab: s.vocab,
        };
        return JSON.stringify(data, null, 2);
      },

      importJSON: (json) => {
        try {
          const data = JSON.parse(json) as Partial<ProgressData>;
          if (typeof data !== "object" || data === null) return false;
          set({
            unitProgress: data.unitProgress ?? {},
            skillXp: data.skillXp ?? emptySkillXp(),
            totalStudyMinutes: data.totalStudyMinutes ?? 0,
            streakDays: data.streakDays ?? 0,
            lastStudyDate: data.lastStudyDate ?? null,
            vocab: data.vocab ?? {},
          });
          return true;
        } catch {
          return false;
        }
      },

      addSkillXp: (skill, n) =>
        set((s) => ({ skillXp: { ...s.skillXp, [skill]: s.skillXp[skill] + n } })),

      touchStreak: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          if (s.lastStudyDate === today) return {};
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const streakDays = s.lastStudyDate === yesterday ? s.streakDays + 1 : 1;
          return { streakDays, lastStudyDate: today };
        }),

      reviewVocab: (key, rating) =>
        set((s) => ({
          vocab: { ...s.vocab, [key]: review(s.vocab[key] ?? initialCard(), rating) },
        })),

      addVocabCard: (key) =>
        set((s) => (s.vocab[key] ? {} : { vocab: { ...s.vocab, [key]: initialCard() } })),

      removeVocabCard: (key) =>
        set((s) => {
          if (!s.vocab[key]) return {};
          const next = { ...s.vocab };
          delete next[key];
          return { vocab: next };
        }),

      resetAll: () => set({ ...initialData }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
    },
  ),
);
