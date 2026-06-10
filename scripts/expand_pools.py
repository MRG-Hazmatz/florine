#!/usr/bin/env python3
"""Expand each unit's exercise pool with VARIED, mostly-contextual drills built
from the unit's own vocabulary, examples and audio (correct by construction).

Re-runnable: it first removes any existing '-pool-' exercises, then regenerates,
so improving this generator upgrades every unit at once. Per unit it adds (when
the content allows):
  - a listening-comprehension MC  (hear a real example sentence -> pick its meaning)
  - a vocab-recall MC             (FR -> EN)
  - a contextual fill-blank       (a vocab word blanked INSIDE its own example)
  - an extra match-pairs set
  - an extra reorder from a short example
Pool items are inserted before the speak drills (speaking stays last).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
ARTICLES = {"le", "la", "les", "un", "une", "des", "du"}


def clean_en(s: str) -> str:
    c = re.sub(r"\s*\([^)]*\)", "", s).strip()
    return c if c else s.strip()


def others(pool, correct, n):
    out = []
    for x in pool:
        if x != correct and x not in out:
            out.append(x)
        if len(out) >= n:
            break
    return out


def words(s):
    return re.findall(r"[A-Za-zÀ-ÿ'’-]+", s)


def headword(fr: str):
    """A single blankable headword, or None (skip verbs/phrases/elided nouns)."""
    toks = fr.split()
    if len(toks) == 2 and toks[0].lower() in ARTICLES:
        return toks[1]
    if len(toks) == 1 and not toks[0].lower().startswith("l'") and not toks[0].lower().startswith("l’"):
        return toks[0]
    return None


changed = []
for ex_path in sorted(CONTENT.glob("*/*/exercises.json")):
    udir = ex_path.parent
    lp = udir / "lesson.json"
    if not lp.is_file():
        continue
    lesson = json.loads(lp.read_text(encoding="utf-8"))
    data = json.loads(ex_path.read_text(encoding="utf-8"))
    exs = [e for e in data.get("exercises", []) if "-pool-" not in (e.get("id") or "")]  # strip old pool
    vocab = [v for v in lesson.get("vocabulary", []) if v.get("fr") and v.get("en")]
    examples = lesson.get("examples", [])
    added = []

    used_ro = set()
    for e in exs:
        if e.get("type") == "reorder":
            used_ro.add(" ".join(t.get("text", "") for t in e.get("tokens", [])))

    # 1) listening-comprehension MC from an example (hear it -> choose meaning)
    ex_ens = [clean_en(e.get("en", "")) for e in examples if e.get("en")]
    for e in examples:
        if e.get("audio") and e.get("fr") and e.get("en"):
            correct = clean_en(e["en"])
            dis = others([x for x in ex_ens if x != correct], correct, 2)
            if len(dis) == 2:
                added.append({
                    "id": "ex-li-pool-1", "type": "listen", "skill": "listening",
                    "prompt": "Listen, then choose what it means.",
                    "audio": e["audio"], "transcript": e["fr"],
                    "options": [{"id": "a", "text": correct}, {"id": "b", "text": dis[0]}, {"id": "c", "text": dis[1]}],
                    "correct": ["a"],
                })
            break

    # 2) vocab-recall MC FR -> EN
    if len(vocab) >= 3:
        v = vocab[0]
        correct = clean_en(v["en"])
        dis = others([clean_en(x["en"]) for x in vocab[1:]], correct, 2)
        if len(dis) == 2:
            added.append({
                "id": "ex-mc-pool-1", "type": "multiple-choice", "skill": "reading",
                "prompt": f"What does « {v['fr']} » mean?",
                "options": [{"id": "a", "text": correct}, {"id": "b", "text": dis[0]}, {"id": "c", "text": dis[1]}],
                "correct": ["a"], "explanation": f"{v['fr']} = {correct}.",
            })

    # 3) contextual fill-blank: a vocab headword blanked inside its own example
    for v in vocab:
        hw = headword(v.get("fr", ""))
        ex_fr = v.get("exampleFr", "")
        if hw and ex_fr and hw in words(ex_fr):
            blanked = re.sub(r"(?<![A-Za-zÀ-ÿ'’])" + re.escape(hw) + r"(?![A-Za-zÀ-ÿ])", "{{b1}}", ex_fr, count=1)
            if "{{b1}}" in blanked:
                added.append({
                    "id": "ex-fb-pool-1", "type": "fill-blank", "skill": "writing",
                    "prompt": "Fill in the missing word (from this unit's vocabulary).",
                    "inputMode": "typed", "template": blanked,
                    "blanks": [{"id": "b1", "accept": [hw]}],
                    "explanation": f"« {ex_fr} » — {clean_en(v['en'])}.",
                })
                break

    # 4) extra match-pairs (vocab 5-8, else first 4)
    pick = vocab[4:8] if len(vocab) >= 8 else vocab[:4]
    if len(pick) >= 2:
        added.append({
            "id": "ex-mp-pool-1", "type": "match-pairs", "skill": "reading",
            "prompt": "Match each word to its English meaning.",
            "pairs": [{"id": f"p{i + 1}", "left": v["fr"], "right": clean_en(v["en"])} for i, v in enumerate(pick)],
        })

    # 5) extra reorder from a short example not already used
    for e in examples:
        core = re.sub(r"[.!?]+$", "", e.get("fr", "").strip()).strip()
        w = core.split()
        if 3 <= len(w) <= 7 and core not in used_ro:
            added.append({
                "id": "ex-ro-pool-1", "type": "reorder", "skill": "writing",
                "prompt": "Put the words in order: “" + e.get("en", "").strip() + "”",
                "tokens": [{"id": f"t{i + 1}", "text": x} for i, x in enumerate(w)],
                "correctOrder": [f"t{i + 1}" for i in range(len(w))],
            })
            break

    speak = [e for e in exs if e.get("type") == "speak"]
    non_speak = [e for e in exs if e.get("type") != "speak"]
    data["exercises"] = non_speak + added + speak
    ex_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    types = "+".join(e["id"].split("-pool-")[0].replace("ex-", "") for e in added)
    changed.append(f"{udir.parent.name}/{udir.name}: pool={len(added)} ({types}) total={len(data['exercises'])}")

print(f"Rebuilt pools for {len(changed)} unit(s).")
for c in changed:
    print("  ", c)
