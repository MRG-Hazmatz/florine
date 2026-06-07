import type { CefrLevel } from "./content/schema";

/** Human-readable labels for each CEFR sub-level. */
export const CEFR_LABELS: Record<CefrLevel, string> = {
  "a1.1": "A1.1 — Beginner (first steps)",
  "a1.2": "A1.2 — Beginner (consolidation)",
  "a2.1": "A2.1 — Elementary",
  "a2.2": "A2.2 — Elementary (consolidation)",
  "b1.1": "B1.1 — Intermediate",
  "b1.2": "B1.2 — Intermediate (consolidation)",
  "b2.1": "B2.1 — Upper intermediate",
  "b2.2": "B2.2 — Upper intermediate (consolidation)",
};

/** Which DELF exam a level prepares for (where applicable). */
export const DELF_FOR_LEVEL: Partial<Record<CefrLevel, string>> = {
  "a1.2": "DELF A1",
  "a2.2": "DELF A2",
  "b1.2": "DELF B1 Junior",
  "b2.2": "DELF B2",
};
