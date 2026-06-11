# B1 Content Map — Alter Ego+ 3 → Florine b1.1 / b1.2

**Source:** *Alter Ego+ 3* (Hachette FLE). Its avant-propos: targets learners who
have **A2**, and covers the full **B1** level (CEFR), with the DELF B1 exam at the
end of Dossier 9. Nine dossiers. (This is the proper B1 book — it supersedes the
earlier stop-gap idea of reusing Alter Ego+ 2's tail.)

**Mapping:** each dossier → ~2 units (one per major communicative goal / grammar
cluster). **18 units total.**
- **b1.1** = Dossiers 1–5 (10 units)
- **b1.2** = Dossiers 6–9 (8 units)

Same conventions as A1/A2 (see HANDOVER.md): original French (book = scope/sequence
blueprint only), ~14-exercise pool incl 2 speaking drills, sampled + shuffled at
runtime, every unit `pending_review` until native sign-off, 2 modules/turn at the
unit-03 quality bar with a self-audit before commit.

Status: ✅ built · 🔨 in progress · ⬜ planned

## b1.1 — Dossiers 1–5
| # | Module | Alter Ego+ 3 | Grammar focus | Status |
|---|---|---|---|---|
| 1 | Image & relationships | D1 *Je séduis* | relative pronouns (rappel) + with demonstratives; la mise en relief | ✅ b1.1/unit-01 |
| 2 | Feelings & the subjunctive | D1 *Je séduis* | subjonctif présent (rappel), subjonctif passé / infinitif passé; subjonctif vs infinitif after feelings | ✅ b1.1/unit-02 |
| 3 | Comparison & complex relatives | D2 *J'achète* | les degrés de la comparaison; les pronoms relatifs composés (lequel, auquel…) | ✅ b1.1/unit-03 |
| 4 | Reported speech in the past | D2 *J'achète* | le discours rapporté au présent (rappel) + au passé & la concordance des temps | ✅ b1.1/unit-04 |
| 5 | Recounting the past | D3 *J'apprends* | imparfait vs passé composé (rappel) + le plus-que-parfait; accord du participe passé | ✅ b1.1/unit-05 |
| 6 | Opposition & concession | D3 *J'apprends* | exprimer l'opposition et la concession (mais, pourtant, bien que…) | ✅ b1.1/unit-06 |
| 7 | News & the passive | D4 *Je m'informe* | la forme passive; la phrase nominale (press headlines) | ✅ b1.1/unit-07 |
| 8 | Cause & consequence | D4 *Je m'informe* | exprimer la cause et la conséquence | ✅ b1.1/unit-08 |
| 9 | Gérondif & participe présent | D5 *J'agis* (solidarité) | le participe présent et le gérondif | ⬜ |
| 10 | Purpose & duration | D5 *J'agis* | exprimer le but (pour que, afin de…); les expressions de durée | ⬜ |

## b1.2 — Dossiers 6–9
| # | Module | Alter Ego+ 3 | Grammar focus | Status |
|---|---|---|---|---|
| 11 | Questions & inversion | D6 *Je me cultive* | l'interrogation; la question avec inversion | ⬜ |
| 12 | Adverbs & relative + subjunctive | D6 *Je me cultive* | les adverbes en -ment; les relatives avec le subjonctif | ⬜ |
| 13 | The future | D7 (écologie) | le futur simple (rappel) + le futur antérieur | ⬜ |
| 14 | Hypotheses & the conditional | D7 (écologie) | le conditionnel présent et passé; l'hypothèse (si…); pronouns y / en | ⬜ |
| 15 | Doubt & certainty | D8 *Convaincre* (justice) | les expressions du doute et de la certitude (+ mood choice) | ⬜ |
| 16 | Pronouns & narrating the past | D8 *Convaincre* | la double pronominalisation + les pronoms neutres; situer un événement dans un récit au passé | ⬜ |
| 17 | Indefinites & negation | D9 *Je voyage* | les indéfinis; les différentes phrases négatives | ⬜ |
| 18 | Narration & recommendations | D9 *Je voyage* | les temps de la narration; recommandations / mises en garde au passé | ⬜ |

## Notes
- **Size/reality:** B1 is the biggest, densest level — 18 units, each harder than
  A2. At 2/turn that's ~9 build-turns + audio + verify; plan it as a multi-session push.
- **Spirals from A2:** D1 relative pronouns/mise en relief, D2 comparison, D3 past
  tenses, D4 passive — all *rappels* that deepen what a1.2/a2.x already introduced.
- **Source files:** color `Text Book.pdf` (228 pp), B&W `Text Book B&W.pdf`, and the
  `Activity Book.pdf` (extra exercises) all under `…/B1/Main/`. Extract grammar/themes
  per dossier with PyMuPDF (`fitz` → `get_text`) when building each unit.
- **After B1:** B2 would need *Alter Ego+ 4* (not provided). B2 is beyond the DELF B1 target.
- **Still owed everywhere:** native review (all units stay `pending_review`).
