#!/usr/bin/env python3
"""Quick content checkup: per-unit size stats, to spot under-served units.

Reports vocab count, hand-authored vs auto-pool vs speak exercises, and concept
length. Flags units that look thin so they get targeted attention. This is NOT a
call to pad everything — simple foundational units should stay lean; it only
surfaces places where rich content may have been squeezed.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

rows = []
for lp in sorted(CONTENT.glob("*/*/lesson.json")):
    u = f"{lp.parent.parent.name}/{lp.parent.name}"
    lesson = json.loads(lp.read_text(encoding="utf-8"))
    ex = json.loads((lp.parent / "exercises.json").read_text(encoding="utf-8"))
    exs = ex.get("exercises", [])
    base = [e for e in exs if "-pool-" not in (e.get("id") or "") and e.get("type") != "speak"]
    pool = [e for e in exs if "-pool-" in (e.get("id") or "")]
    speak = [e for e in exs if e.get("type") == "speak"]
    vocab = lesson.get("vocabulary", [])
    cw = len((lesson.get("concept") or "").split())
    rows.append((u, len(vocab), len(base), len(pool), len(speak), len(exs), cw))


def col(i):
    return [r[i] for r in rows]


print(f"{len(rows)} units.")
print(f"  vocab   {min(col(1))}-{max(col(1))}")
print(f"  base ex {min(col(2))}-{max(col(2))} (hand-authored, excl. pool & speak)")
print(f"  total   {min(col(5))}-{max(col(5))} (incl. pool + speak)")
print(f"  concept {min(col(6))}-{max(col(6))} words")
print()
print("Possibly thin (concept < 180w OR base < 8 OR vocab < 11):")
flagged = 0
for u, v, b, p, s, t, cw in rows:
    if cw < 180 or b < 8 or v < 11:
        flagged += 1
        print(f"  {u}: vocab={v} base={b} pool={p} speak={s} total={t} concept={cw}w")
if not flagged:
    print("  none — every unit meets the floor.")
