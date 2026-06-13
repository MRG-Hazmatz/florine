/**
 * Tiny global flag for "an exam is currently live (clock running)".
 * The runner raises it while a section is in progress; the app shell reads it
 * to seal the exam hall — hiding the navigation and the back button so a
 * candidate can't wander off mid-épreuve. Kept out of the persisted progress
 * store on purpose: it is ephemeral UI state, never saved.
 */
import { create } from "zustand";

interface ExamSession {
  live: boolean;
  setLive: (live: boolean) => void;
}

export const useExamSession = create<ExamSession>((set) => ({
  live: false,
  setLive: (live) => set({ live }),
}));
