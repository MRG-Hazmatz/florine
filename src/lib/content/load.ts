/**
 * Content loader.
 *
 * Curriculum JSON lives in /content (repo root, OUTSIDE /src) so language
 * reviewers never touch React code. Vite's import.meta.glob pulls those files
 * in at build time; we validate each one with the Zod schema and assemble
 * typed Unit objects. Validation failures are collected (not thrown) so a
 * single broken content file surfaces as a visible issue instead of a crash.
 */
import {
  lessonSchema,
  exercisesFileSchema,
  reviewStatusSchema,
  CEFR_LEVELS,
  type Unit,
  type CefrLevel,
} from "./schema";

type RawMap = Record<string, unknown>;

const lessonFiles = import.meta.glob("/content/**/lesson.json", {
  eager: true,
  import: "default",
}) as RawMap;
const exerciseFiles = import.meta.glob("/content/**/exercises.json", {
  eager: true,
  import: "default",
}) as RawMap;
const reviewFiles = import.meta.glob("/content/**/review_status.json", {
  eager: true,
  import: "default",
}) as RawMap;

export interface ContentIssue {
  unitDir: string;
  file: string;
  message: string;
}

interface LoadedContent {
  units: Unit[];
  issues: ContentIssue[];
}

function dirOf(path: string): string {
  return path.slice(0, path.lastIndexOf("/"));
}

/** "/content/a1.1/unit-01-greetings" -> { level: "a1.1", slug: "unit-01-greetings" } */
function parseLevelSlug(unitDir: string): { level: string; slug: string } {
  const parts = unitDir.split("/");
  return { level: parts[parts.length - 2], slug: parts[parts.length - 1] };
}

function buildContent(): LoadedContent {
  const issues: ContentIssue[] = [];
  const units: Unit[] = [];

  const dirs = new Set<string>(Object.keys(lessonFiles).map(dirOf));

  for (const dir of [...dirs].sort()) {
    const { slug } = parseLevelSlug(dir);

    const lessonParsed = lessonSchema.safeParse(lessonFiles[`${dir}/lesson.json`]);
    if (!lessonParsed.success) {
      issues.push({ unitDir: dir, file: "lesson.json", message: lessonParsed.error.message });
      continue; // without a valid lesson there is no unit to build
    }
    const lesson = lessonParsed.data;

    const exParsed = exercisesFileSchema.safeParse(
      exerciseFiles[`${dir}/exercises.json`] ?? {
        schemaVersion: lesson.schemaVersion,
        unitId: lesson.id,
        exercises: [],
      },
    );
    if (!exParsed.success) {
      issues.push({ unitDir: dir, file: "exercises.json", message: exParsed.error.message });
    }

    const revParsed = reviewStatusSchema.safeParse(
      reviewFiles[`${dir}/review_status.json`] ?? {
        schemaVersion: lesson.schemaVersion,
        unitId: lesson.id,
        status: "draft",
      },
    );
    if (!revParsed.success) {
      issues.push({ unitDir: dir, file: "review_status.json", message: revParsed.error.message });
    }

    units.push({
      id: lesson.id,
      level: lesson.level,
      slug,
      lesson,
      exercises: exParsed.success
        ? exParsed.data
        : { schemaVersion: lesson.schemaVersion, unitId: lesson.id, passThreshold: 0.7, exercises: [] },
      review: revParsed.success
        ? revParsed.data
        : { schemaVersion: lesson.schemaVersion, unitId: lesson.id, status: "draft", reviewers: [], approvedAt: null, sourceRefs: [] },
    });
  }

  return { units, issues };
}

const content = buildContent();

export function getContentIssues(): ContentIssue[] {
  return content.issues;
}

export function getAllUnits(): Unit[] {
  return content.units;
}

export function getUnitsForLevel(level: CefrLevel): Unit[] {
  return content.units
    .filter((u) => u.level === level)
    .sort((a, b) => a.lesson.unitNumber - b.lesson.unitNumber);
}

export interface LevelSummary {
  level: CefrLevel;
  unitCount: number;
  approvedCount: number;
}

export function getLevelSummaries(): LevelSummary[] {
  return CEFR_LEVELS.map((level) => {
    const us = getUnitsForLevel(level);
    return {
      level,
      unitCount: us.length,
      approvedCount: us.filter((u) => u.review.status === "approved").length,
    };
  });
}

export function getUnit(level: string, slug: string): Unit | undefined {
  return content.units.find((u) => u.level === level && u.slug === slug);
}

/** Previous/next unit within the same level (by unit order). */
export function getAdjacentUnits(unit: Unit): { prev?: Unit; next?: Unit } {
  const sibs = getUnitsForLevel(unit.level);
  const i = sibs.findIndex((u) => u.id === unit.id);
  if (i < 0) return {};
  return {
    prev: i > 0 ? sibs[i - 1] : undefined,
    next: i < sibs.length - 1 ? sibs[i + 1] : undefined,
  };
}
