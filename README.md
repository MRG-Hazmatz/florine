# Florine

> Open-source, DELF-aligned French practice for self-learners (CEFR A1 → B2).
> Explicit grammar in English, drills in French, every exercise shaped like a
> real exam question. **The practice layer — not a textbook replacement.**

**Status:** Phase 1 — Foundation (scaffolding, content schema, routing, storage).
This is the skeleton; interactive exercises, spaced repetition, audio, and AI
grading come in later phases. See [the roadmap](#roadmap).

This is **not** Duolingo: no gamification, no implicit learning, no streaks-as-
shame. And it is **not** an AI content generator — curriculum comes from
validated sources and **no French ships without native-speaker review**.

---

## Tech stack

- **React 19 + Vite + TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@tailwindcss/vite`)
- **React Router** for navigation
- **Zustand** for progress state, persisted to **LocalStorage** (single-user, single-browser in v1)
- **Zod** for runtime validation of all content JSON (types are inferred from the Zod schemas)
- **Vercel** hosting (auto-deploy from GitHub, PR preview deployments)
- Audio (Phase 2): generated at **build time** with `edge-tts` (free Microsoft Edge neural voices), committed as static `.mp3`s
- AI grading (Phase 2): Google Gemini via a Vercel serverless function — key lives **only** in Vercel env vars

## Getting started

Prerequisites: **Node 20+**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + production build into dist/
npm run preview    # serve the production build locally
npm run lint
```

## Project structure

```
florine/
  index.html
  vercel.json              # SPA rewrite (excludes /api), so deep links work
  .env.example             # template only — real keys never live in the repo
  src/
    components/            # shared UI (Layout, ReviewBadge)
    pages/                 # Home, LevelSelect, LevelUnits, UnitView, ExerciseView
    lib/
      content/schema.ts    # Zod schema = the content contract (types inferred)
      content/load.ts      # validates + assembles units from /content at build time
      cefr.ts              # CEFR level labels / DELF mapping
      storage/             # useLocalStorage hook + Zustand progress store
  content/                 # ALL curriculum (JSON) — language reviewers live here
    a1.1/unit-01-greetings/{lesson,exercises,review_status}.json
  public/audio/            # generated mp3s (Phase 2)
  api/                     # Vercel serverless functions (grade.js — Phase 2 stub)
  scripts/                 # generate_audio.py, validate_content.py
```

**Code and content are deliberately separate.** Engineers work in `/src`;
language contributors work in `/content` and never need to touch React. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) and [`content/README.md`](content/README.md).

## The content review rule (non-negotiable)

Every unit carries a `review_status.json`. A unit is only considered finished
when a native speaker has signed off and `status` is `approved`. Unreviewed
units render with a visible warning and are for development preview only.

## Deployment (Vercel)

1. Push to GitHub. In Vercel, **Add New Project → import this repo.**
2. Framework preset auto-detects **Vite** (build `npm run build`, output `dist/`).
3. Every push to `main` deploys to production; every PR gets a **preview URL**
   (used by native reviewers to test content before merge).
4. **Secrets:** set `GEMINI_API_KEY` (Phase 2) in **Vercel → Settings →
   Environment Variables** only — never in the repo. Forkers add their own key.

## Roadmap

- **Phase 1 (done):** scaffold, content schema, routing, LocalStorage foundation, deploy.
- **Phase 2:** the six interactive exercise components, spaced repetition (SM-2), progress map, audio playback + `edge-tts` generation.
- **Phase 3+:** A1.1 content with native review, mock DELF papers, AI writing feedback.

## License

- **Code:** [MIT](LICENSE)
- **Content** (everything in `/content` and generated audio): [CC BY-SA 4.0](LICENSE-CONTENT)
