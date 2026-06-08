#!/usr/bin/env python3
"""Retrofit speaking drills into every unit that has fewer than TARGET_SPEAK.

Speaking exercises reuse the unit's existing example sentences + their already-
generated native audio, so this adds NO new French and NO new audio — it just
gives every module 2 'say it aloud' drills, consistently. Idempotent: skips
units that already have enough, and re-dumps exercises.json (UTF-8, 2-space).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
TARGET_SPEAK = 2

PROMPT_FIRST = "Speaking practice — listen, then say the sentence aloud and record yourself:"
PROMPT_MORE = "Speaking practice — say this sentence aloud and record yourself:"

changed: list[str] = []
for ex_path in sorted(CONTENT.glob("*/*/exercises.json")):
    udir = ex_path.parent
    lesson_path = udir / "lesson.json"
    if not lesson_path.is_file():
        continue
    lesson = json.loads(lesson_path.read_text(encoding="utf-8"))
    data = json.loads(ex_path.read_text(encoding="utf-8"))
    exercises = data.get("exercises", [])
    speak = [e for e in exercises if e.get("type") == "speak"]
    if len(speak) >= TARGET_SPEAK:
        continue
    used = {e.get("targetFr") for e in speak}
    examples = lesson.get("examples", [])
    need = TARGET_SPEAK - len(speak)
    picks = []
    for i in (0, 2, 1, 3, 4):  # spread the picks across the example set
        if len(picks) >= need:
            break
        if i < len(examples):
            ex = examples[i]
            if ex.get("fr") and ex["fr"] not in used and ex.get("audio"):
                picks.append(ex)
                used.add(ex["fr"])
    added = 0
    for ex in picks:
        n = len(speak) + added + 1
        first = len(speak) == 0 and added == 0
        exercises.append({
            "id": f"ex-sp-{n}",
            "type": "speak",
            "skill": "speaking",
            "prompt": PROMPT_FIRST if first else PROMPT_MORE,
            "targetFr": ex["fr"],
            "targetEn": ex.get("en", ""),
            "audio": ex["audio"],
        })
        added += 1
    if added:
        data["exercises"] = exercises
        ex_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        changed.append(f"{udir.parent.name}/{udir.name}: +{added} (now {len(speak) + added})")

print(f"Retrofitted {len(changed)} unit(s):")
for c in changed:
    print("  ", c)
