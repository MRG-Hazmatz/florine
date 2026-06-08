#!/usr/bin/env python3
"""Expand each unit's exercise pool with additional VALID drills generated from
the unit's OWN vocabulary and example sentences (correct + on-topic by build).

Adds per unit (if not already expanded):
  - a vocab-recall MC  FR -> EN
  - a vocab-recall MC  EN -> FR
  - an extra match-pairs set (4 vocab)
  - an extra reorder (from a short example sentence)
Pool exercises are inserted BEFORE the speak drills (speaking stays last).
Combined with step-3 sampling/shuffle, this gives rotation + anti-memorisation.
Idempotent: skips units that already contain a '-pool-' exercise.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"


def clean_en(s: str) -> str:
    c = re.sub(r"\s*\([^)]*\)", "", s).strip()
    return c if c else s.strip()


def distinct_others(pool, correct, n):
    out = []
    for x in pool:
        if x != correct and x not in out:
            out.append(x)
        if len(out) >= n:
            break
    return out


changed = []
for ex_path in sorted(CONTENT.glob("*/*/exercises.json")):
    udir = ex_path.parent
    lesson_path = udir / "lesson.json"
    if not lesson_path.is_file():
        continue
    data = json.loads(ex_path.read_text(encoding="utf-8"))
    exercises = data.get("exercises", [])
    if any("-pool-" in (e.get("id") or "") for e in exercises):
        continue  # already expanded
    lesson = json.loads(lesson_path.read_text(encoding="utf-8"))
    vocab = [v for v in lesson.get("vocabulary", []) if v.get("fr") and v.get("en")]
    examples = lesson.get("examples", [])
    added = []

    # 1) recall FR -> EN (vocab[0])
    if len(vocab) >= 3:
        v = vocab[0]
        correct = clean_en(v["en"])
        distract = distinct_others([clean_en(x["en"]) for x in vocab[1:]], correct, 2)
        if len(distract) == 2:
            added.append({
                "id": "ex-mc-pool-1", "type": "multiple-choice", "skill": "reading",
                "prompt": f"What does « {v['fr']} » mean?",
                "options": [
                    {"id": "a", "text": correct},
                    {"id": "b", "text": distract[0]},
                    {"id": "c", "text": distract[1]},
                ],
                "correct": ["a"],
                "explanation": f"{v['fr']} = {correct}.",
            })

    # 2) recall EN -> FR (vocab[1])
    if len(vocab) >= 3:
        v = vocab[1]
        correct = v["fr"]
        distract = distinct_others([x["fr"] for x in vocab if x["fr"] != correct], correct, 2)
        if len(distract) == 2:
            added.append({
                "id": "ex-mc-pool-2", "type": "multiple-choice", "skill": "reading",
                "prompt": f"Which French word means « {clean_en(v['en'])} »?",
                "options": [
                    {"id": "a", "text": correct},
                    {"id": "b", "text": distract[0]},
                    {"id": "c", "text": distract[1]},
                ],
                "correct": ["a"],
                "explanation": f"« {clean_en(v['en'])} » = {correct}.",
            })

    # 3) extra match-pairs (vocab 5-8, else first 4)
    pick = vocab[4:8] if len(vocab) >= 8 else vocab[:4]
    if len(pick) >= 2:
        added.append({
            "id": "ex-mp-pool-1", "type": "match-pairs", "skill": "reading",
            "prompt": "Match each word to its English meaning.",
            "pairs": [
                {"id": f"p{i + 1}", "left": v["fr"], "right": clean_en(v["en"])}
                for i, v in enumerate(pick)
            ],
        })

    # 4) extra reorder from a short example sentence
    used = set()
    for e in exercises:
        if e.get("type") == "reorder":
            used.add(" ".join(t.get("text", "") for t in e.get("tokens", [])))
    for ex in examples:
        core = re.sub(r"[.!?]+$", "", ex.get("fr", "").strip()).strip()
        words = core.split()
        if 3 <= len(words) <= 6 and core not in used:
            added.append({
                "id": "ex-ro-pool-1", "type": "reorder", "skill": "writing",
                "prompt": "Put the words in order: “" + ex.get("en", "").strip() + "”",
                "tokens": [{"id": f"t{i + 1}", "text": w} for i, w in enumerate(words)],
                "correctOrder": [f"t{i + 1}" for i in range(len(words))],
            })
            break

    if added:
        speak = [e for e in exercises if e.get("type") == "speak"]
        non_speak = [e for e in exercises if e.get("type") != "speak"]
        data["exercises"] = non_speak + added + speak
        ex_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        changed.append(f"{udir.parent.name}/{udir.name}: +{len(added)} (now {len(exercises) + len(added)})")

print(f"Expanded {len(changed)} unit(s):")
for c in changed:
    print("  ", c)
