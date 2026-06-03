/**
 * Florine content schema (the contract between curriculum JSON and the app).
 *
 * Zod is the single source of truth: we define runtime validators here and
 * INFER the TypeScript types from them, so the on-disk JSON and the in-code
 * types can never silently drift. Bump CONTENT_SCHEMA_VERSION on any breaking
 * change to the shape, and add a migration note in /content/README.md.
 *
 * A "unit" lives in one folder and is described by three files:
 *   lesson.json         -> lessonSchema        (concept, vocab, examples)
 *   exercises.json      -> exercisesFileSchema  (the drills, DELF-aligned)
 *   review_status.json  -> reviewStatusSchema   (native-speaker sign-off gate)
 */
import { z } from "zod";

/** Bump on any breaking change to the JSON shape. */
export const CONTENT_SCHEMA_VERSION = 1;

/** CEFR sub-levels in progression order. */
export const cefrLevelSchema = z.enum([
  "a1.1",
  "a1.2",
  "a2.1",
  "a2.2",
  "b1.1",
  "b1.2",
  "b2",
]);
export const CEFR_LEVELS = cefrLevelSchema.options;
export type CefrLevel = z.infer<typeof cefrLevelSchema>;

/** The four DELF skills tracked across the app. */
export const skillSchema = z.enum([
  "reading",
  "listening",
  "writing",
  "speaking",
]);
export const SKILLS = skillSchema.options;
export type Skill = z.infer<typeof skillSchema>;

/** edge-tts voices we alternate between for variety (build-time audio). */
export const voiceSchema = z.enum(["denise", "henri"]);
export type Voice = z.infer<typeof voiceSchema>;

/* -------------------------------------------------------------------------- */
/* lesson.json                                                                */
/* -------------------------------------------------------------------------- */

export const vocabItemSchema = z.object({
  id: z.string(),
  fr: z.string(),
  en: z.string(),
  pos: z.string().optional(), // part of speech
  ipa: z.string().optional(),
  exampleFr: z.string().optional(),
  exampleEn: z.string().optional(),
  audio: z.string().optional(), // placeholder path in Phase 1; generated in Phase 2
  voice: voiceSchema.optional(),
});
export type VocabItem = z.infer<typeof vocabItemSchema>;

export const exampleSentenceSchema = z.object({
  id: z.string(),
  fr: z.string(),
  en: z.string(),
  notes: z.string().optional(),
  audio: z.string().optional(),
  voice: voiceSchema.optional(),
});
export type ExampleSentence = z.infer<typeof exampleSentenceSchema>;

export const lessonSchema = z.object({
  schemaVersion: z.number().int(),
  id: z.string(), // canonical unit id, e.g. "a1.1/unit-01-greetings"
  level: cefrLevelSchema,
  unitNumber: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  titleFr: z.string().optional(),
  cefrDescriptors: z.array(z.string()).default([]),
  skills: z.array(skillSchema).default([]),
  estimatedMinutes: z.number().int().positive().optional(),
  concept: z.string(), // English explanation (markdown allowed), ~200-400 words
  vocabulary: z.array(vocabItemSchema).default([]),
  examples: z.array(exampleSentenceSchema).default([]),
});
export type Lesson = z.infer<typeof lessonSchema>;

/* -------------------------------------------------------------------------- */
/* exercises.json — six DELF-aligned formats as a discriminated union          */
/* -------------------------------------------------------------------------- */

/** Fields shared by every exercise type. */
const exerciseBase = {
  id: z.string(),
  skill: skillSchema,
  prompt: z.string(), // English instruction / question stem
  promptFr: z.string().optional(),
  points: z.number().positive().default(1),
  explanation: z.string().optional(), // shown after answering
};

const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
  audio: z.string().optional(),
});

export const multipleChoiceSchema = z.object({
  ...exerciseBase,
  type: z.literal("multiple-choice"),
  multiSelect: z.boolean().default(false),
  options: z.array(optionSchema).min(2),
  correct: z.array(z.string()).min(1), // option ids
});

export const fillBlankSchema = z.object({
  ...exerciseBase,
  type: z.literal("fill-blank"),
  inputMode: z.enum(["typed", "dropdown"]).default("typed"),
  template: z.string(), // e.g. "Bonjour, je {{b1}} Claire."
  blanks: z
    .array(
      z.object({
        id: z.string(),
        accept: z.array(z.string()).min(1), // accepted answers (normalised compare)
        options: z.array(z.string()).optional(), // choices for dropdown mode
      }),
    )
    .min(1),
});

export const reorderSchema = z.object({
  ...exerciseBase,
  type: z.literal("reorder"),
  tokens: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
  correctOrder: z.array(z.string()).min(2), // token ids, in order
});

export const matchPairsSchema = z.object({
  ...exerciseBase,
  type: z.literal("match-pairs"),
  pairs: z
    .array(
      z.object({
        id: z.string(),
        left: z.string(),
        right: z.string(),
        leftAudio: z.string().optional(),
      }),
    )
    .min(2),
});

export const listenSchema = z.object({
  ...exerciseBase,
  type: z.literal("listen"),
  audio: z.string(), // placeholder path in Phase 1
  transcript: z.string().optional(), // revealed after answering
  multiSelect: z.boolean().default(false),
  options: z.array(optionSchema).min(2),
  correct: z.array(z.string()).min(1),
});

const readQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  multiSelect: z.boolean().default(false),
  options: z.array(optionSchema).min(2),
  correct: z.array(z.string()).min(1),
});

export const readSchema = z.object({
  ...exerciseBase,
  type: z.literal("read"),
  passageFr: z.string(),
  passageEn: z.string().optional(),
  questions: z.array(readQuestionSchema).min(1),
});

export const exerciseSchema = z.discriminatedUnion("type", [
  multipleChoiceSchema,
  fillBlankSchema,
  reorderSchema,
  matchPairsSchema,
  listenSchema,
  readSchema,
]);
export type Exercise = z.infer<typeof exerciseSchema>;
export type ExerciseType = Exercise["type"];

export const exercisesFileSchema = z.object({
  schemaVersion: z.number().int(),
  unitId: z.string(),
  passThreshold: z.number().min(0).max(1).default(0.7), // mini-test gate
  exercises: z.array(exerciseSchema).default([]),
});
export type ExercisesFile = z.infer<typeof exercisesFileSchema>;

/* -------------------------------------------------------------------------- */
/* review_status.json — the native-speaker sign-off gate                       */
/* -------------------------------------------------------------------------- */

export const reviewStatusValueSchema = z.enum([
  "draft",
  "pending_review",
  "approved",
  "needs_changes",
]);
export type ReviewStatusValue = z.infer<typeof reviewStatusValueSchema>;

export const reviewStatusSchema = z.object({
  schemaVersion: z.number().int(),
  unitId: z.string(),
  status: reviewStatusValueSchema,
  reviewers: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().default("native-speaker"),
        date: z.string(), // ISO date
        notes: z.string().optional(),
      }),
    )
    .default([]),
  approvedAt: z.string().nullable().default(null),
  sourceRefs: z.array(z.string()).default([]),
});
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

/* -------------------------------------------------------------------------- */
/* Assembled unit (what the app actually consumes)                             */
/* -------------------------------------------------------------------------- */

export interface Unit {
  id: string;
  level: CefrLevel;
  slug: string;
  lesson: Lesson;
  exercises: ExercisesFile;
  review: ReviewStatus;
}
