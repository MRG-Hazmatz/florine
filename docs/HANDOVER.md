# Florine — Handover & Runbook

A self-contained guide to pick this project up cold — for the user, a future
Claude Code session, or the planning Claude (chat). Read this first.

---

## 1. What Florine is
An open-source, DELF-aligned French learning web app. Primary user: a 13-year-old
prepping for **DELF B1 Junior (June 2027)**. It teaches grammar in plain English,
drills in French, and shapes every exercise like a real DELF question. Single-user,
LocalStorage progress, no accounts.

**Live:** https://florine-hrithik-s-projects-8bdd202e.vercel.app
**Deploy:** Vercel auto-deploys on push to `main`.

## 2. Status (as of this handover)
- **Content complete & live: A1.1 → A2.2 = 34 units**, all green.
  - a1.1 ×12, a1.2 ×10 (from *Alter Ego+ 1*, Dossiers 0–9)
  - a2.1 ×6, a2.2 ×6 (from *Alter Ego+ 2*, Dossiers 1–4)
- Every unit: a **~14–17 exercise pool** incl **2 speaking drills**; the player
  **samples 8 per attempt** and **shuffles answer positions + order** (anti-memorisation).
- **Speaking** works end-to-end (records → Gemini scores pronunciation).
- All 34 units are `pending_review` (see rule in §7) — **native review still owed.**

## 3. Stack & layout
- React 19 + Vite 8 + TypeScript (strict) + Tailwind v4 (CSS-first, `@theme` in
  `src/index.css`) + React Router 7 + Zustand 5 (persist; LocalStorage key
  `florine:progress`) + Zod.
- `npm run dev` (localhost:3000) · `npm run build` (`tsc -b && vite build`) ·
  `npm run lint` (`eslint .`).
```
content/{level}/{unit}/{lesson.json, exercises.json, review_status.json}
public/audio/{level}/{unit}/*.mp3        generated speech
public/icons/                            UI art
src/lib/content/schema.ts                Zod schema = single source of truth
src/lib/content/load.ts                  loads + validates content (import.meta.glob)
src/components/exercises/                one component per exercise type + ExercisePlayer
api/speak.ts                             Vercel Edge fn: speaking proxy to Gemini
scripts/*.py                             content tooling (see §6)
docs/A1-CONTENT-MAP.md, A2-CONTENT-MAP.md, HANDOVER.md
```

## 4. Content model
A **unit** = one folder + three files, validated by `schema.ts`:
- `lesson.json` — id, level, unitNumber (drives order + unlock within a level),
  slug, title, concept (~250–400 word plain-English grammar explainer), vocabulary
  (~12 items, each fr/en/pos/exampleFr/exampleEn/audio/voice), examples (5).
- `exercises.json` — `passThreshold` (0.7) + an array of exercises. Seven types
  (discriminated union on `type`): `multiple-choice`, `fill-blank` (typed/dropdown),
  `reorder`, `match-pairs`, `listen`, `read`, `speak`.
- `review_status.json` — `status` (always `pending_review` until a native signs off),
  `sourceRefs` (provenance: which Alter Ego dossier/leçon inspired it).

**Voices:** alternate `denise` / `henri` (edge-tts fr-FR-DeniseNeural / HenriNeural).

## 5. The build-a-unit recipe (the quality bar)
Gold-standard reference: `content/a1.1/unit-03-introductions`.
1. Pick the next leçon from the content map. One leçon ≈ one unit.
2. Write `lesson.json`: a warm concept (rule + examples + a "say/write this" nudge),
   ~12 vocab with real example sentences, 5 examples. **All French original** —
   Alter Ego is a scope/sequence blueprint only, never copied.
3. Write `exercises.json`: ~8 hand-authored DELF-format exercises across types +
   2 `speak` drills (reuse example sentences + their audio). Pools are then grown
   to ~14 by `expand_pools.py`.
4. **Self-audit before commit** (read it back; check gender/agreement/accents,
   that every `correct` id is right, dropdown options contain the answer).
5. Run the pipeline (§6) and commit. Each unit is atomic — never commit half a unit.

## 6. Tooling & pipeline
Run from the repo root. After any content change:
```
python scripts/generate_audio.py      # edge-tts; creates missing mp3s, skips existing
python scripts/validate_content.py    # shallow schema sanity (mirrors Zod)
python scripts/audit_content.py       # deep: audio exists, answer-refs valid,
                                       # reorder permutations, dropdown/accept,
                                       # duplicate option text, unitNumber sequence
npm run build && npm run lint
git add -A && git commit -m "…" && git push   # Vercel auto-deploys
```
One-off helper scripts (already applied, idempotent):
- `retrofit_speaking.py` — ensures every unit has 2 speak drills (from its examples).
- `expand_pools.py` — grows each pool with recall MCs (FR↔EN), an extra match, and
  an extra reorder, generated from the unit's **own** vocab/examples (correct by build).

## 7. Hard rules (do not break)
- **No LLM-generated French ships as `approved`.** Everything stays `pending_review`
  until a native speaker validates it. The drafts are good but unverified.
- **Content is original.** Alter Ego+ (Hachette) is the scope/sequence blueprint; never
  copy its text. Code is MIT; content is CC BY-SA 4.0. Faces art: Francisco Lemos, CC BY 4.0.
- **No secrets in the repo.** The Gemini key lives ONLY in Vercel env var
  `GEMINI_API_KEY`. Never put it in code, content, or chat.

## 8. Speaking feature
- `api/speak.ts` is a Vercel **Edge function**. It reads `GEMINI_API_KEY` server-side,
  sends the learner's audio + the target sentence to Gemini
  (`gemini-3.5-flash`; override with env `GEMINI_MODEL`), and returns
  `{ transcript, score, feedback }`.
- Client `src/components/exercises/Speak.tsx`: record → transcode to WAV in-browser →
  POST `/api/speak` → show score/feedback. Graceful fallback if offline (records,
  compares to native audio, logs as **ungraded** — never falsely "Correct").
- Env vars only apply to deployments created **after** they're set → **redeploy** after
  changing them.

## 9. Not done / deferred (the honest list)
- **b1.1** — buildable now from *Alter Ego+ 2*, Dossiers 5–8 (book already provided).
- **b1.2** — needs **Alter Ego+ 3 (B1)** PDF (not provided yet).
- **b2.1 / b2.2** — need **Alter Ego+ 4 (B2)** PDF (not provided). Beyond the DELF B1 target.
- **Native review** of all 34 units (the real quality gate).
- **Numbers 70–99** (base-20 forms: soixante-dix, quatre-vingts) — A1.1 covers 0–69.
- **COI pronouns** (lui/leur) + giving advice (Alter Ego+ 2 D7·L3) — A2-ish; fold into a2.x or B1.
- **Bespoke pool exercises** — current pool extras are auto-generated (correct, but
  more formulaic than hand-authored); upgrade incrementally if desired.
- **Bundle size** — content is bundled into the JS (Vite warns). When content grows
  (~B-levels), switch to lazy per-unit loading.

## 10. To build B1.1 next (when ready)
1. Extract Alter Ego+ 2 Dossiers 5–8 grammar/themes (PyMuPDF: `fitz`, the PDF Read
   tool's `pdftoppm` is unavailable here — use `d[i].get_text()`).
2. Add a `docs/B1-CONTENT-MAP.md` mapping leçons → b1.1 units.
3. Build each unit with the §5 recipe (2 speak, ~8 hand-authored + pool), then run §6.
4. b1.1 units use `level: "b1.1"` (already in the schema enum); the app picks them up
   automatically via the content glob and shows them on the Levels page.

## 11. Cold-start checklist for a new session
- `npm install` (once), then `npm run dev`.
- Read this file + the two content maps.
- `python scripts/audit_content.py` should print "no errors" — that confirms a healthy tree.
- Continue from §10, or resume native-review integration (set a unit's
  `review_status.json` to `approved` with reviewer + date once a native validates it).
