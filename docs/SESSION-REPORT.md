# Florine — Build Session Report

**Window:** 2026-06-03 → 2026-06-05
**Repo:** https://github.com/MRG-Hazmatz/florine (public)
**Live:** https://florine-hrithik-s-projects-8bdd202e.vercel.app
**Local:** `C:\Users\hrith\OneDrive\Desktop\Vibe-coded Projects\florine` (sibling of the unrelated `miss-fortunes` game)

---

## TL;DR

Florine — an open-source, DELF-aligned French practice app — has **Phase 1 (foundation)** and **Phase 2 (core engine)** complete, deployed, and CI-green. There are **3 A1.1 units** with real audio, a working exercise engine (6 DELF formats), spaced repetition, and progress tracking. **All content is `pending_review`** — nothing is "approved" until a native speaker signs off. Difficulty is now calibrated against **Alter Ego+ A1**.

---

## 1. Course-correction at the start

- The build was initiated **inside the wrong repository** (the `miss-fortunes` Phaser game). Caught immediately; Florine was set up as its **own sibling repo** instead of polluting the game project.
- Decisions taken (asked, not assumed): **TypeScript**, **Tailwind v4**, sibling folder. Later: **Zustand** (state), **Zod** (validation).
- Two prereqs from the spec were not actually done: the GitHub `florine` repo **didn't exist** (created it via `gh`) and the **global git identity was unset** (set to `MRG-Hazmatz` / `hrithikrayapati@outlook.com`).

## 2. Phase 1 — Foundation (commit `b70951c`)

- **Stack:** Vite 8 + React 19 + TypeScript (strict flags: `verbatimModuleSyntax`, `noUnusedLocals`, `erasableSyntaxOnly`), Tailwind v4 (CSS-first, no config file), React Router 7, Zustand 5, Zod 4.
- **Content schema** (`src/lib/content/schema.ts`) — Zod-first, TS types inferred, so JSON and code can't drift. All six DELF exercise formats modelled as a **discriminated union** on `type`; `CONTENT_SCHEMA_VERSION = 1`.
- **Content loader** (`src/lib/content/load.ts`) — pulls `/content/**` via `import.meta.glob`, validates with `safeParse`, collects issues instead of crashing.
- **Routing:** Home, Level Select, Level Units, Unit View, Exercise View, + 404.
- **Storage:** LocalStorage progress store, versioned key `florine:progress`, with JSON export/import (insurance against a cache wipe).
- **Repo hygiene:** `.env.example` (no real keys), `.gitignore` (excludes `.env`), MIT (`LICENSE`) + CC BY-SA 4.0 (`LICENSE-CONTENT`), `README`, `CONTRIBUTING`, `content/README`, `api/grade.js` stub documenting the secrets pattern, `scripts/generate_audio.py` + `scripts/validate_content.py`, GitHub Actions CI, issue templates, `vercel.json` SPA rewrite (excludes `/api`).
- **Deployed** to Vercel (GitHub integration, auto-deploy on push). **PR preview deployments confirmed working.**

## 3. Phase 2 — Core engine (commit `31d6f80`)

- **Six interactive exercise components** (multiple-choice, fill-blank, reorder, match-pairs, listen, read) + an **ExercisePlayer** that runs a unit as a mini-test: per-question feedback + explanations, progress bar, **70% pass gate**, score written to the progress store, per-skill XP, retry.
- **Audio** — generated at build time with **edge-tts** (free Microsoft neural voices Denise + Henri, alternating), committed as mp3s, played via an `AudioButton` that degrades gracefully if a file is missing.
- **Spaced repetition** — full **SM-2** algorithm (`src/lib/srs/sm2.ts`) + a `/review` flashcard screen pulling all due vocab.
- **Progress & unlocking** — Home dashboard (streak, units done, study time, due reviews, per-skill R/L/W/S bars) and **unit unlocking** (a unit unlocks when the previous is completed).

## 4. Curriculum design (commits `2517183`, `e2af022`)

- Identified the provided A1 PDFs as **Alter Ego+ A1 (Hachette)** — the exact méthode the spec named as the progression blueprint. Read the *Tableau des contenus*: **9 dossiers**, Dossier 0 (*Découverte*: alphabet/greetings/numbers) → Dossier 8, with grammar ramping être → articles → -er verbs → pronominal verbs → passé composé, etc.
- **Design playbook established:** each Florine unit mirrors an Alter Ego *leçon* — **objectif fonctionnel** (a can-do), **Point Langue** (one grammar focus, explained in English), **thematic lexicon**, **phonie-graphie**, **Point Culture**, and **DELF-format tasks** (each dossier ends with *Vers le DELF*). Difficulty comes from climbing dossiers AND making even early units DELF-shaped.
- **Copyright stance (important):** the book is used **only** as scope/sequence blueprint + format reference. All French is **original**; nothing is copied. (Alter Ego is © Hachette "tous droits réservés"; Florine content ships under CC BY-SA, so it must be our own.)
- Built **unit-03-introductions** (Dossier 1 "se présenter": être, nationalities, tu/vous) as the **gold-standard template** — noticeably harder (conjugation, gender agreement, register, sentence-level CO + a multi-question reading profile).
- Per review feedback ("module 3's jump is perfect; 1 & 2 now feel too easy"), **raised units 1 & 2 to the same rigor**: register (tu/vous, formal/informal), time-of-day logic, sentence-level listening, multi-question reading with inference, 8 exercises each.

## 5. Content inventory (all `pending_review` — none approved)

| Unit | Theme (Alter Ego) | Vocab | Examples | Exercises | Audio |
|---|---|---|---|---|---|
| `a1.1/unit-01-greetings` | Salutations (D0) | 15 | 6 | 8 | 22 |
| `a1.1/unit-02-numbers` | Nombres 0–10 (D0) | 11 | 5 | 8 | 17 |
| `a1.1/unit-03-introductions` | Se présenter (D1) | 16 | 6 | 8 | 23 |

**62 mp3 files total.** Every unit carries a `review_status.json` set to `pending_review` with provenance notes.

## 6. Architecture & key files

```
florine/
  src/
    components/         Layout, ReviewBadge, AudioButton, exercises/ (6 + ExercisePlayer)
    pages/             Home, LevelSelect, LevelUnits, UnitView, ExerciseView, Review, NotFound
    lib/
      content/schema.ts   Zod schema = the content contract (types inferred)
      content/load.ts     build-time loader + validator
      exercises/          grade.ts, normalize.ts (French answer matching)
      srs/sm2.ts          SM-2 spaced repetition
      storage/progress.ts Zustand + LocalStorage (versioned, export/import)
      progressView.ts     unit unlock/status logic
      cefr.ts, util.ts
  content/a1.1/<unit>/   lesson.json, exercises.json, review_status.json
  public/audio/<unit>/   generated mp3s
  scripts/               generate_audio.py (edge-tts), validate_content.py
  api/grade.js           Tier-2 Gemini stub (secrets pattern)
  assets-incoming/       gitignored staging for art pending license check
  docs/SESSION-REPORT.md this file
```

## 7. Deployment & infra

- **GitHub:** `MRG-Hazmatz/florine`, public. Every push to `main` auto-deploys; every PR gets a Vercel preview (verified, then the test PR was closed).
- **Vercel:** Vite preset, build `npm run build`, output `dist/`. Deployment protection off (public).
- **CI:** GitHub Actions — lint + build (Node 20, `npm ci`) and Python content validation. Green on every push.
- **Secrets pattern:** `GEMINI_API_KEY` would live **only** in Vercel env vars (never in repo); not needed in Phase 1/2.

## 8. Verification performed

✅ `tsc -b` + Vite build, ✅ ESLint clean, ✅ `validate_content.py` (3 units, 0 errors), ✅ **GitHub Actions CI green in a clean environment**, ✅ live URL serves publicly (HTTP 200, no auth wall), ✅ PR preview confirmed.

⚠️ **Honest gap:** no automated end-to-end **browser click-through** was possible (no browser connected to the build environment). The exercise/SRS/unlock logic was reasoned carefully and compiles/deploys, but interactive behaviour is best confirmed by a human clicking through the live app.

## 9. Non-negotiables honored

- **No content shipped as "approved" without native review** — all 3 units are `pending_review`.
- **No secrets in code or repo.**
- **Content (`/content`) vs code (`/src`) cleanly separated.**
- **All French original** (copyright-safe; book used only as blueprint).
- **Single-user, LocalStorage only** (v1 scope).

## 10. Known gaps / TODO

- **Native review** of all 3 units (priority: the unit-03 template) → then flip to `approved`.
- **Schema:** no *production écrite/orale* exercise type yet (DELF always has one) — needs self-review-with-model-answer now or Tier-2 AI grading later. `concept` grammar is prose; a structured *Point Langue* block would be better. `listen` is single-question (could support multi-question CO).
- **Assets:** character art staged in `assets-incoming/` (gitignored) pending license confirmation for public-repo redistribution.
- **No automated tests** yet.

## 11. Recommended next steps

1. **Native review** the 3 units; lock the unit-03 template as the pattern.
2. Decide: **extend the schema** (production type + grammar block) before authoring more, vs. **clone the template** across more Dossier 1 leçons.
3. Continue **Dossier 1** (leçons 2–3) once the template is approved.
4. **Art pass:** confirm asset license, add the guide character.
5. **(Later) Tier-2:** Gemini AI writing feedback via `/api/grade` (key in Vercel only).

## Appendix — commit history

```
e2af022  2026-06-05  Content: raise units 1-2 to DELF rigor (register, sentence-level CO/CE, 8 exercises each)
2517183  2026-06-05  Content: Dossier-1 template unit (se presenter - etre, nationalities, tu/vous), +audio
31d6f80  2026-06-05  Phase 2: interactive exercise engine, edge-tts audio, SM-2 review, progress map
b70951c  2026-06-03  Phase 1: Florine foundation (Vite + React + TS + Tailwind v4, schema, routing, storage)
```

**Dev commands:** `npm install` · `npm run dev` (localhost:5173) · `npm run build` · `npm run lint` · `python scripts/generate_audio.py <unit-id>` · `python scripts/validate_content.py`
