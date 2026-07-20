# Florine

> Open-source, DELF/DALF-aligned French practice for self-learners — the full
> CEFR ladder, **A1 → C2**. Explicit grammar in English, drills in French,
> every exercise shaped like a real exam question. **The practice layer — not
> a textbook replacement.**

**Live:** [florine.vercel.app](https://florine.vercel.app)

This is **not** Duolingo: no gamification, no implicit learning, no streaks-as-
shame. And it is **not** an AI content generator — the curriculum follows the
scope and sequence of established course books and **no French is considered
final without native-speaker review** (see the review rule below).

---

## What's inside

- **97 units across 12 levels** (A1.1 → C2.2), each with a grammar concept
  explained in plain English, a vocabulary set with example sentences, and
  15–19 exercises across six interactive types (multiple choice, fill-blank,
  match pairs, reorder, listening, reading) plus speaking drills with
  self-recording.
- **20 mock exam papers** — 10 DELF (A1–B2) and 10 DALF (C1–C2) — original
  papers in the official format: per-section timers, /100 score sheets,
  self-graded production against official-style rubrics, and an "exam hall"
  mode (fullscreen invigilation that logs tab switches and copy/paste).
- **Spaced repetition** (SM-2) over every vocabulary card, with per-skill XP
  tracking and unit-by-unit progression that unlocks as you pass mini-tests.
- **2,250+ audio clips** — every vocab word, example sentence, and listening
  transcript, generated at build time with `edge-tts` neural voices and
  committed as static mp3s. Listening transcripts come with English
  translations.
- **L'Almanach des Inconnus** — the 20 uncanny "Strangers" who teach the
  units, each with a name, a backstory, and one sacred law of French.
- **3,333 splash lines**, most generated from the app's own vocabulary corpus
  so even the jokes teach something.
- A hidden comic. Find the three frogs. That's all we'll say.

## Tech stack

- **React 19 + Vite + TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config via `@tailwindcss/vite`)
- **React Router** for navigation
- **Zustand** for progress state, persisted to **LocalStorage** (single-user,
  single-browser — no accounts, no tracking, progress is exportable JSON)
- **Zod** for runtime validation of all content JSON (types inferred from the
  schemas; a broken content file surfaces as a visible issue, not a crash)
- **Vercel** hosting (auto-deploy from GitHub, PR preview deployments)
- Audio generated at **build time** with `edge-tts` (free Microsoft Edge
  neural voices) — no runtime TTS, no API keys needed to run the app

## Getting started

Prerequisites: **Node 20+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + production build into dist/
npm run preview    # serve the production build locally
npm run lint
```

Optional (content tooling, Python 3.11+):

```bash
python scripts/validate_content.py   # schema + integrity checks on all 97 units
python scripts/validate_exams.py     # the 20 mock papers
python scripts/audit_content.py      # structural audit (ids, answers, audio files)
python scripts/generate_audio.py     # regenerate any missing mp3s (edge-tts)
```

## Project structure

```
florine/
  index.html
  vercel.json              # SPA rewrite, so deep links work
  src/
    components/            # shared UI, exercise players, exam runner, comic reader
    pages/                 # Home, Levels, Unit, Exercises, Review, Exams, Almanac
    lib/
      content/schema.ts    # Zod schema = the content contract (types inferred)
      content/load.ts      # validates + assembles units from /content at build time
      exams/               # exam schema, session store, invigilation hooks
      storage/             # Zustand progress store (LocalStorage, versioned)
  content/                 # ALL curriculum (JSON) — language reviewers live here
    a1.1/…c2.2/            # 97 units: {lesson,exercises,review_status}.json
    exams/                 # 20 mock DELF/DALF papers
  public/audio/            # generated mp3s (committed)
  scripts/                 # validators, audio generation, splash/comic pipelines
```

**Code and content are deliberately separate.** Engineers work in `/src`;
language contributors work in `/content` and never need to touch React. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) and [`content/README.md`](content/README.md).

## The content review rule (non-negotiable)

Every unit carries a `review_status.json`. A unit is only considered finished
when a native speaker has signed off and `status` is `approved`. Everything
currently ships as `pending_review`: structurally validated, self-audited
against the source scope-and-sequence, and awaiting native review — the badge
on each unit says so honestly. **If you're a native or C2 speaker and want to
review a unit, that is the single most valuable contribution you can make.**

## Deployment (Vercel)

1. Push to GitHub. In Vercel, **Add New Project → import this repo.**
2. Framework preset auto-detects **Vite** (build `npm run build`, output `dist/`).
3. Every push to `main` deploys to production; every PR gets a **preview URL**
   (used by reviewers to test content before merge).

## Roadmap

- **Done:** full A1→C2 curriculum (97 units), six exercise types + speaking
  drills, SM-2 review, per-skill progress + unlocking, build-time audio,
  20 mock exam papers with invigilation and score sheets, the almanac, the
  comic.
- **Next:** native-speaker review passes (unit by unit → `approved`), an
  economy/difficulty balance pass on exercise strictness, AI writing feedback
  for production tasks (serverless, key stays out of the repo).

## License

- **Code:** [MIT](LICENSE)
- **Content** (everything in `/content` and generated audio): [CC BY-SA 4.0](LICENSE-CONTENT)
- **Character art** ("Strangers Vol. 1"): © Francisco Lemos, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see `public/characters/strangers/CREDITS.md`
