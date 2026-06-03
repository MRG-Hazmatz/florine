# Content directory

All Florine curriculum lives here as JSON. **No React knowledge required.**
The app validates every file against the Zod schema in
`src/lib/content/schema.ts` at build time — if a file is malformed, the app
surfaces a visible content issue instead of crashing.

## Layout

```
content/<cefr-level>/<unit-slug>/
  lesson.json          # concept (English), vocabulary, example sentences
  exercises.json       # the drills (six DELF-aligned formats)
  review_status.json   # native-speaker sign-off gate
```

CEFR levels: `a1.1 a1.2 a2.1 a2.2 b1.1 b1.2 b2`.

## `lesson.json`

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | number | Currently `1`. |
| `id` | string | `"<level>/<slug>"`, e.g. `"a1.1/unit-01-greetings"`. |
| `level` | enum | One of the CEFR levels above. |
| `unitNumber` | int | Order within the level (1, 2, 3…). |
| `slug` | string | Folder name, e.g. `unit-01-greetings`. |
| `title` / `titleFr` | string | English title; optional French title. |
| `cefrDescriptors` | string[] | What the unit teaches (from CEFR descriptors). |
| `skills` | enum[] | Any of `reading listening writing speaking`. |
| `estimatedMinutes` | int? | Optional. |
| `concept` | string | English explanation, ~200–400 words. `\n\n` for paragraphs. |
| `vocabulary` | object[] | `id, fr, en, pos?, ipa?, exampleFr?, exampleEn?, audio?, voice?` |
| `examples` | object[] | `id, fr, en, notes?, audio?, voice?` |

`audio` is a **placeholder path** in Phase 1 (e.g.
`audio/<unit-id>/vocab-<id>.mp3`). Phase 2 generates the actual mp3s.
`voice` alternates `denise` / `henri`.

## `exercises.json`

Top level: `schemaVersion`, `unitId`, `passThreshold` (0–1, default 0.7),
`exercises[]`. Every exercise shares: `id`, `type`, `skill`, `prompt`,
`promptFr?`, `points?`, `explanation?`. The `type` selects the extra fields:

- **`multiple-choice`** — `options[] {id,text,audio?}`, `correct[]` (option ids), `multiSelect?`
- **`fill-blank`** — `template` (with `{{blankId}}` tokens), `blanks[] {id, accept[], options?}`, `inputMode` (`typed`|`dropdown`)
- **`reorder`** — `tokens[] {id,text}`, `correctOrder[]` (token ids in order)
- **`match-pairs`** — `pairs[] {id,left,right,leftAudio?}`
- **`listen`** — `audio`, `transcript?`, `options[]`, `correct[]`, `multiSelect?`
- **`read`** — `passageFr`, `passageEn?`, `questions[] {id,prompt,options[],correct[],multiSelect?}`

## `review_status.json`

| Field | Notes |
|---|---|
| `status` | `draft` → `pending_review` → `approved` / `needs_changes`. |
| `reviewers` | `{name, role, date, notes?}` — the native-speaker sign-off. |
| `approvedAt` | ISO date or `null`. |
| `sourceRefs` | Where the content came from (textbook dossier, etc.). |

**A unit is only finished when `status` is `approved` by a real native speaker.**

## Validate before committing

```bash
python scripts/validate_content.py
```

## Migrations

If `src/lib/content/schema.ts` changes shape, bump `CONTENT_SCHEMA_VERSION`
there and record what changed here:

- **v1** — initial schema (Phase 1).
