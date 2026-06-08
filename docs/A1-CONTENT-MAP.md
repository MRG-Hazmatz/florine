# A1 Content Map — Alter Ego+ A1 → Florine a1.1 / a1.2

**Goal:** the *entire* Alter Ego+ A1 (Dossiers 0–9) is covered across Florine's
**a1.1** (Dossiers 0–4) and **a1.2** (Dossiers 5–9). Content is original; the book
is used only as the scope/sequence blueprint, never copied. Every module =
objectif fonctionnel + Point Langue grammar + thematic lexicon + DELF-format
exercises + native audio, and stays `pending_review` until native sign-off.

Status: ✅ built · 🔨 in progress · ⬜ planned

## a1.1 — Dossiers 0–4
| # | Module | Alter Ego | Grammar focus | Status |
|---|---|---|---|---|
| 1 | Greetings & politeness | D0 / D1 | salutations, tu vs vous, register | ✅ unit-01 |
| 2 | Numbers (0–99) | D0/D1 | cardinal numbers 0–99 (incl. base-20: 70–99) | ✅ unit-02 |
| 3 | Introducing yourself | D0 / D1·L1 | être, nationalities, c'est/il est | ✅ unit-03 |
| 4 | Alphabet & personal info | D0/D1 | l'alphabet, épeler, accents, quel, coordonnées (numbers 70+: later) | ✅ unit-12 |
| 5 | The city: location & articles | D2·L1 | articles (un/une/le/la/des), il y a, prépositions de lieu | ✅ unit-07 |
| 6 | Directions & the imperative | D2·L2–L3 | l'impératif, indiquer la route (addresses/code postal: later) | ✅ unit-08 |
| 7 | Family & relationships | D3·L1 | avoir, la famille, possessifs | ✅ unit-04 |
| 8 | Describing people | D3·L2 | adjectives + gender agreement, c'est vs il est | ✅ unit-09 |
| 9 | Tastes & hobbies | D3·L3 | aimer + article, loisirs | ✅ unit-05 |
| 10 | Saying no: negation | D3 | ne…pas, détester | ✅ unit-06 |
| 11 | Time & daily routine | D4·L1/L3 | l'heure, verbes pronominaux | ✅ unit-10 |
| 12 | Going out & plans | D4·L2 | futur proche (aller + infinitif), invitations | ✅ unit-11 |

## a1.2 — Dossiers 5–9
| # | Module | Alter Ego | Grammar focus | Status |
|---|---|---|---|---|
| 13 | Asking questions & celebrations | D5·L1 | est-ce que / qu'est-ce que, mots interrogatifs, fêtes | ✅ a1.2/unit-01 |
| 14 | Talking about the past | D5·L2–L3 | passé composé (avoir) | ✅ a1.2/unit-02 |
| 15 | Weather & seasons | D6·L1 | quel temps fait-il, il fait…, les saisons | ✅ a1.2/unit-03 |
| 16 | Geography & travel | D6·L2–L3 | comparatif, le pronom y | ✅ a1.2/unit-04 |
| 17 | Food & meals | D7·L1 | articles partitifs (du/de la/des), la quantité | ✅ a1.2/unit-05 |
| 18 | Shopping & clothes | D7·L2 | pronoms COD (le/la/les) | ✅ a1.2/unit-06 |
| 19 | Groceries & quantity | D8·L1 | le pronom en, expressions de quantité | ✅ a1.2/unit-07 |
| 20 | Restaurants & describing | D8·L2–L3 | place de l'adjectif, meilleur | ✅ a1.2/unit-08 |
| 21 | Homes & living | D9·L1–L2 | passé composé vs imparfait | ✅ a1.2/unit-09 |
| 22 | Living together (rules) | D9·L3 | il faut, l'interdiction, l'impératif | ⬜ |

## Notes
- **A1-book grammar that's technically A2** (passé composé, imparfait, COD/COI,
  partitifs, comparatif) lives in **a1.2** because it's in the A1 book. The A2
  book (when added) will deepen these in a2.x — the méthodes intentionally spiral.
- **Sequencing:** the ideal book order puts D2 (location/articles, #5–6) *before*
  D3 (family/tastes, #7–10). The current build did the verb spine (être→avoir→-er
  →negation) first. Module **numbers can be resequenced cheaply later** — edit
  `unitNumber` in each `lesson.json` (no id/folder/audio renames needed), since
  ordering + unlock derive from `unitNumber`.
- **Retroactive TODOs** (all cleared): ✅ numbers extended to 0–69; ✅ dedicated
  "describing people" module added (unit-09, D3·L2 adjectives).
- **Resequence (done):** `unitNumber` fields renumbered to book order (D0→D4).
  Folder/slug names intentionally kept as-is (internal-only mismatch, no learner impact).
- **Coverage gap (flagged):** the A1 book's COI pronouns (lui/leur) + giving advice
  (D7·L3) were NOT folded into unit-06 (which kept to COD for focus). COI is genuinely
  A2-level and spirals into the A2 book — decide later whether to add a small a1.2 bonus
  module or let a2.1 carry it.
