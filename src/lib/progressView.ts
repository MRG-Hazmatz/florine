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
