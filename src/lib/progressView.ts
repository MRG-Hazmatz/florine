import type { Unit } from "./content/schema";
import type { UnitProgress, UnitStatus } from "./storage/progress";

export interface LevelUnitView {
  unit: Unit;
  status: UnitStatus;
  unlocked: boolean;
  bestScore: number;
}

/**
 * Compute display state for a level's units. A unit is unlocked when it's the
 * first in the level or the previous unit (by order) has been completed.
 */
export function computeLevelView(
  units: Unit[],
  unitProgress: Record<string, UnitProgress>,
): LevelUnitView[] {
  return units.map((u, i) => {
    const prevCompleted = i === 0 || unitProgress[units[i - 1].id]?.status === "completed";
    return {
      unit: u,
      status: unitProgress[u.id]?.status ?? "not-started",
      unlocked: prevCompleted,
      bestScore: unitProgress[u.id]?.bestScore ?? 0,
    };
  });
}

/**
 * Same unlock rule as the level map, for a single unit — so unit pages and
 * their prev/next navigation can't be used to walk past a lock.
 */
export function isUnitUnlocked(
  unit: Unit,
  siblings: Unit[],
  unitProgress: Record<string, UnitProgress>,
): boolean {
  const i = siblings.findIndex((u) => u.id === unit.id);
  return i <= 0 || unitProgress[siblings[i - 1].id]?.status === "completed";
}
