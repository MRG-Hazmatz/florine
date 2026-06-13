#!/usr/bin/env python3
"""
Validate mock-exam papers in content/exams/*/exam.json:
  - each section's question/task points sum to the section's declared points,
  - the four sections sum to 100,
  - every option `correct` id exists, ids are unique within a question,
  - every listening doc has an audio path + transcript,
  - rubric points on each open task sum to the task's points.

Run:  python scripts/validate_exams.py
Exit code 1 on any error.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMS = ROOT / "content" / "exams"


def section_question_points(section: dict) -> int:
    pts = 0
    for doc in section.get("docs", []):
        pts += sum(q["points"] for q in doc.get("questions", []))
    for text in section.get("texts", []):
        pts += sum(q["points"] for q in text.get("questions", []))
    for task in section.get("tasks", []):
        pts += task["points"]
    return pts


def main() -> int:
    errors: list[str] = []
    papers = sorted(EXAMS.glob("*/exam.json"))
    if not papers:
        print("No exam papers found.")
        return 0

    for path in papers:
        exam = json.loads(path.read_text(encoding="utf-8"))
        eid = exam.get("id", path.parent.name)
        total = 0
        for s in exam.get("sections", []):
            sid = s.get("id", "?")
            declared = s["points"]
            total += declared
            qp = section_question_points(s)
            if qp != declared:
                errors.append(f"{eid}/{sid}: question+task points {qp} != section points {declared}")
            # rubric sums
            for task in s.get("tasks", []):
                rub = sum(line["points"] for line in task.get("rubric", []))
                if rub != task["points"]:
                    errors.append(f"{eid}/{sid}/{task['id']}: rubric {rub} != task points {task['points']}")
            # answer integrity
            qs = [q for d in s.get("docs", []) for q in d.get("questions", [])]
            qs += [q for t in s.get("texts", []) for q in t.get("questions", [])]
            for q in qs:
                opt_ids = [o["id"] for o in q["options"]]
                if len(opt_ids) != len(set(opt_ids)):
                    errors.append(f"{eid}: duplicate option ids in {q['id']}")
                for c in q["correct"]:
                    if c not in opt_ids:
                        errors.append(f"{eid}: {q['id']} correct '{c}' not an option")
            # audio presence
            for d in s.get("docs", []):
                if not d.get("audio") or not d.get("transcript"):
                    errors.append(f"{eid}/{sid}: doc {d.get('id')} missing audio/transcript")
        if total != 100:
            errors.append(f"{eid}: sections total {total} != 100")
        status = "OK   " if not any(eid in e for e in errors) else "ERR  "
        print(f"{status} {eid}  (/{total})")

    if errors:
        print("\n".join("  ✗ " + e for e in errors))
        print(f"\n{len(papers)} paper(s), {len(errors)} error(s).")
        return 1
    print(f"\n{len(papers)} paper(s), 0 errors.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
