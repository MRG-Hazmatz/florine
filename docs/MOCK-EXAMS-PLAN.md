# Mock DELF/DALF Exam Series — Plan

## Goal
20 full mock papers in the app: **10 DELF** (A1 ×2, A2 ×2, B1 ×3, B2 ×3 — weighted
toward the user's target B1 and the next step B2) and **10 DALF** (C1 ×5, C2 ×5).
High fidelity to the real exam: same sections, timing, points, instructions style,
grading scales.

## Copyright stance (decided 2026-06-11)
The sample papers on delfdalf.fr are **"© Yann PERROT, all rights reserved"**, and
the underlying sujets belong to France Éducation International. They are NOT
licensed for redistribution, so we do **not** copy them into this open-source repo,
even with credit. Instead:
- All Florine mock papers are **original content in the authentic format**
  (structure, timing, scoring, instruction phrasing conventions).
- delfdalf.fr is **credited as the format reference** and linked prominently from
  the exam hub page ("official sample papers available at…"), so learners can also
  practice on the real things.

## Authentic formats (post-2020, verified against delfdalf.fr 2026-06)
All DELF: 4 épreuves × 25 pts, total /100, pass ≥ 50, eliminatory < 5/25 per skill.

| Exam | CO (listening) | CE (reading) | PE (writing) | PO (speaking) |
|---|---|---|---|---|
| DELF A1 | ~20 min | 30 min | 30 min | 5–7 min (prep 10) |
| DELF A2 | ~25 min | 30 min | 45 min | 6–8 min (prep 10) |
| DELF B1 | ~25 min | 45 min | 45 min | ~15 min (prep 10) |
| DELF B2 | ~30 min | 60 min | 60 min | ~20 min (prep 30) |
| DALF C1 | ~40 min /25 | 50 min /25 | 2h30: synthèse + essai /25 | 30 min, prep 1h /25 |
| DALF C2 | épreuve orale: CO+PO, prep 1h, ~30 min /50 | | épreuve écrite: CE+PE, 3h30 /50 | |

Section anatomy (new format):
- **CO**: 3–4 documents (annonces, dialogues, émission de radio), MCQ + short
  answers; 2 listens for long docs at A/B1, 1–2 at B2+.
- **CE**: A1/A2 everyday docs (mails, notices, panneaux); B1 two texts
  (informative + argumentative-lite); B2 two texts (informatif + argumentatif);
  C1 long press/essay text.
- **PE**: A1 form + postcard; A2 two short messages; B1 essai/lettre/article
  ~160 mots; B2 prise de position argumentée ~250 mots; C1 synthèse (~220 mots
  from 2–3 docs) + essai (~250); C2 article/rapport long.
- **PO**: A1 entretien + échange d'infos + dialogue simulé; A2 same trio, longer;
  B1 entretien + exercice en interaction + monologue suivi (document déclencheur);
  B2 défense d'un point de vue à partir d'un document; C1 exposé + entretien from
  a dossier; C2 compte rendu + point de vue from recordings.

## In-app design
- New content root: `content/exams/{exam-id}/exam.json` (+ audio under
  `public/audio/exams/{exam-id}/`).
- New Zod schema `examSchema`: metadata (exam, level, paper number, durations,
  totals) + 4 sections; sections reuse the existing exercise types for the
  auto-gradable parts (listen, read, multiple-choice, fill-blank) and add two
  open types:
  - `writing-task`: prompt + constraints (min words) + model answer + self-grading
    rubric (the real grading grids, simplified) — graded by self-assessment
    checkboxes that map to points.
  - `speaking-task`: prompt/dossier + prep timer + record (reuse Speak component's
    recorder) + model talking points + self-grading rubric. The AI coach scores
    pronunciation only where a target text exists; open production stays
    self-assessed (honest about what software can grade).
- Exam player page: section-by-section flow with per-section countdown timers,
  no answer reveal until the section is submitted, /100 score sheet at the end
  (with eliminatory-threshold warnings), résultats stored in progress.
- Exam hub page: lists papers by exam level, shows best scores, links official
  samples (delfdalf.fr) with credit.

## Build order
1. Schema + exam player + hub with ONE complete DELF B1 paper (the user's target
   exam) — prove the whole pipeline incl. audio + timers + score sheet.
2. Remaining DELF B1 papers (×2 more), then B2 ×3, A2 ×2, A1 ×2.
3. DALF C1 ×5, C2 ×5 (after C-level units exist, so the lexicon matches).
4. Native review pass flagged for every paper (same `pending_review` discipline).

## STATUS — COMPLETE (2026-06-13)
All 20 papers built, validated (`scripts/validate_exams.py`, every paper /100)
and committed: **DELF** A1×2, A2×2, B1×3, B2×3 + **DALF** C1×5, C2×5.
Simulator built and browser-verified end to end:
- `examSchema` + loader; `ExamRunner` state machine (intro → per-section
  briefings → timed sections → correction).
- Exam-hall enforcement: fullscreen + invigilation log (tab-blur,
  fullscreen-exit, copy/paste/contextmenu blocked), per-section countdowns
  that auto-advance, `beforeunload` guard, and a **sealed hall** (nav + back
  button hidden while a section's clock runs, via `useExamSession`).
- `/100` score sheet with per-épreuve eliminatory flags, invigilation-event
  count, and self-grading sliders for PE/PO that recompute the total live;
  best result persisted per exam id.
- Exam hub credits delfdalf.fr as the format reference.
Audio: all CO listening docs generated with edge-tts.
Remaining (deferred, non-blocking): native-speaker review pass on the papers
(Kim), same discipline as the units.
