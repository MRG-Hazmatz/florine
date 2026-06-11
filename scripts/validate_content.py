#!/usr/bin/env python3
"""
Lightweight content validator for Florine.

A pre-commit / CI sanity check over /content. This is a SHALLOW mirror of the
authoritative Zod schema in src/lib/content/schema.ts (which validates at app
build time) — it catches obvious mistakes early without a Node toolchain.

Usage:
    python scripts/validate_content.py

Exits non-zero if any unit fails, so it can gate CI.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"

CEFR_LEVELS = {"a1.1", "a1.2", "a2.1", "a2.2", "b1.1", "b1.2", "b2.1", "b2.2", "c1.1", "c1.2", "c2.1", "c2.2"}
SKILLS = {"reading", "listening", "writing", "speaking"}
REVIEW_STATUSES = {"draft", "pending_review", "approved", "needs_changes"}
EXERCISE_TYPES = {"multiple-choice", "fill-blank", "reorder", "match-pairs", "listen", "read", "speak"}


def _load(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def validate_unit(unit_dir: Path) -> list[str]:
    errors: list[str] = []

    def require(path: Path) -> dict | None:
        if not path.exists():
            errors.append(f"missing {path.name}")
            return None
        try:
            return _load(path)
        except json.JSONDecodeError as e:
            errors.append(f"{path.name}: invalid JSON ({e})")
            return None

    lesson = require(unit_dir / "lesson.json")
    exercises = require(unit_dir / "exercises.json")
    review = require(unit_dir / "review_status.json")

    if lesson:
        if lesson.get("level") not in CEFR_LEVELS:
            errors.append(f"lesson.level invalid: {lesson.get('level')!r}")
        for k in ("id", "slug", "title", "concept", "unitNumber"):
            if k not in lesson:
                errors.append(f"lesson missing required key: {k}")
        for s in lesson.get("skills", []):
            if s not in SKILLS:
                errors.append(f"lesson.skills has unknown skill: {s!r}")
        for v in lesson.get("vocabulary", []):
            if not v.get("id") or not v.get("fr") or not v.get("en"):
                errors.append(f"vocab item missing id/fr/en: {v.get('id', '?')}")

    if exercises:
        for ex in exercises.get("exercises", []):
            if ex.get("type") not in EXERCISE_TYPES:
                errors.append(f"exercise {ex.get('id', '?')}: unknown type {ex.get('type')!r}")
            if "prompt" not in ex:
                errors.append(f"exercise {ex.get('id', '?')}: missing prompt")

    if review:
        if review.get("status") not in REVIEW_STATUSES:
            errors.append(f"review_status.status invalid: {review.get('status')!r}")

    return errors


def main() -> int:
    if not CONTENT_DIR.exists():
        print("No /content directory found.")
        return 0

    unit_dirs = sorted(p.parent for p in CONTENT_DIR.glob("*/*/lesson.json"))
    if not unit_dirs:
        print("No units found under /content.")
        return 0

    total_errors = 0
    approved = 0
    for unit_dir in unit_dirs:
        rel = unit_dir.relative_to(ROOT)
        errors = validate_unit(unit_dir)
        try:
            status = _load(unit_dir / "review_status.json").get("status", "?")
        except Exception:
            status = "?"
        if status == "approved":
            approved += 1
        if errors:
            total_errors += len(errors)
            print(f"FAIL  {rel}  [{status}]")
            for e in errors:
                print(f"        - {e}")
        else:
            print(f"OK    {rel}  [{status}]")

    print(f"\n{len(unit_dirs)} unit(s), {approved} approved, {total_errors} error(s).")
    return 1 if total_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
