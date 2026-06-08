"""Deep structural audit across all content modules.

Beyond schema validation (validate_content.py), this checks cross-references and
real-world integrity that a schema can't:
  - every audio path referenced (vocab / examples / listen) exists as a file
  - every exercise 'correct' id points to a real option
  - reorder.correctOrder is a permutation of the tokens
  - fill-blank dropdown options actually contain the accepted answer
  - each {{blank}} appears in its template
  - exercises.unitId / review_status.unitId match the lesson id
  - unitNumber is unique and sequential (1..N) within each level

Exit code 1 if any ERROR is found (warnings don't fail).
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
PUBLIC = ROOT / "public"

errors: list[str] = []
warnings: list[str] = []


def err(u, msg):
    errors.append(f"[{u}] {msg}")


def warn(u, msg):
    warnings.append(f"[{u}] {msg}")


def audio_ok(path):
    if not path:
        return True
    return (PUBLIC / path).is_file()


def load(p):
    return json.loads(p.read_text(encoding="utf-8"))


lesson_paths = sorted(CONTENT.glob("*/*/lesson.json"))
bylevel = defaultdict(list)

for lesson_path in lesson_paths:
    udir = lesson_path.parent
    uid = f"{udir.parent.name}/{udir.name}"
    lesson = load(lesson_path)
    lid = lesson.get("id")
    level = lesson.get("level")
    bylevel[level].append((lesson.get("unitNumber"), uid))

    # vocabulary
    vocab = lesson.get("vocabulary", [])
    if not vocab:
        err(uid, "no vocabulary")
    vids = set()
    for v in vocab:
        vid = v.get("id")
        if vid in vids:
            err(uid, f"duplicate vocab id '{vid}'")
        vids.add(vid)
        if not v.get("fr") or not v.get("en"):
            err(uid, f"vocab '{vid}' missing fr/en")
        if not audio_ok(v.get("audio")):
            err(uid, f"vocab '{vid}' audio MISSING: {v.get('audio')}")

    # examples
    for e in lesson.get("examples", []):
        if not e.get("fr"):
            err(uid, f"example '{e.get('id')}' missing fr")
        if not audio_ok(e.get("audio")):
            err(uid, f"example '{e.get('id')}' audio MISSING: {e.get('audio')}")

    # exercises
    ex_path = udir / "exercises.json"
    if not ex_path.is_file():
        err(uid, "no exercises.json")
    else:
        ex = load(ex_path)
        if ex.get("unitId") != lid:
            err(uid, f"exercises.unitId '{ex.get('unitId')}' != lesson.id '{lid}'")
        exs = ex.get("exercises", [])
        if len(exs) < 6:
            warn(uid, f"only {len(exs)} exercises")
        xids = set()
        skills = set()
        for x in exs:
            xid = x.get("id")
            t = x.get("type")
            if xid in xids:
                err(uid, f"duplicate exercise id '{xid}'")
            xids.add(xid)
            if x.get("skill"):
                skills.add(x["skill"])
            if t in ("multiple-choice", "listen"):
                opts = {o.get("id") for o in x.get("options", [])}
                if len(opts) < 2:
                    err(uid, f"{xid}: fewer than 2 options")
                cor = x.get("correct", [])
                if not cor:
                    err(uid, f"{xid}: no correct answer")
                for c in cor:
                    if c not in opts:
                        err(uid, f"{xid}: correct '{c}' not among options")
                texts = [o.get("text") for o in x.get("options", [])]
                if len(set(texts)) != len(texts):
                    err(uid, f"{xid}: duplicate option text")
                if t == "listen" and not audio_ok(x.get("audio")):
                    err(uid, f"{xid}: listen audio MISSING: {x.get('audio')}")
            elif t == "fill-blank":
                tmpl = x.get("template", "")
                for b in x.get("blanks", []):
                    bid = b.get("id")
                    if "{{" + str(bid) + "}}" not in tmpl:
                        err(uid, f"{xid}: blank '{bid}' not in template")
                    acc = b.get("accept", [])
                    if not acc:
                        err(uid, f"{xid}: blank '{bid}' has no accepted answers")
                    opts = b.get("options")
                    if opts:
                        for a in acc:
                            if a not in opts:
                                err(uid, f"{xid}: accept '{a}' not in dropdown options {opts}")
            elif t == "reorder":
                toks = [tk.get("id") for tk in x.get("tokens", [])]
                co = x.get("correctOrder", [])
                if sorted(toks) != sorted(co):
                    err(uid, f"{xid}: correctOrder is not a permutation of tokens")
            elif t == "match-pairs":
                prs = x.get("pairs", [])
                if len(prs) < 2:
                    err(uid, f"{xid}: fewer than 2 pairs")
                for p in prs:
                    if not p.get("left") or not p.get("right"):
                        err(uid, f"{xid}: pair missing left/right")
            elif t == "read":
                qs = x.get("questions", [])
                if not qs:
                    err(uid, f"{xid}: no questions")
                for q in qs:
                    opts = {o.get("id") for o in q.get("options", [])}
                    for c in q.get("correct", []):
                        if c not in opts:
                            err(uid, f"{xid}: question '{q.get('id')}' correct '{c}' not among options")
                    qtexts = [o.get("text") for o in q.get("options", [])]
                    if len(set(qtexts)) != len(qtexts):
                        err(uid, f"{xid}: question '{q.get('id')}' duplicate option text")
            elif t == "speak":
                if not x.get("targetFr"):
                    err(uid, f"{xid}: speak missing targetFr")
                if not audio_ok(x.get("audio")):
                    err(uid, f"{xid}: speak audio MISSING: {x.get('audio')}")
            else:
                warn(uid, f"{xid}: unknown exercise type '{t}'")
        # skill coverage
        if not ({"reading", "listening", "writing"} & skills):
            warn(uid, "no reading/listening/writing exercises")

    # review_status
    rs_path = udir / "review_status.json"
    if not rs_path.is_file():
        err(uid, "no review_status.json")
    else:
        rs = load(rs_path)
        if rs.get("unitId") != lid:
            err(uid, f"review_status.unitId '{rs.get('unitId')}' != lesson.id '{lid}'")
        if rs.get("status") not in ("pending_review", "approved"):
            err(uid, f"bad review status '{rs.get('status')}'")

# unitNumber sequence per level
for lvl, items in sorted(bylevel.items()):
    nums = sorted(n for n, _ in items)
    if nums != list(range(1, len(items) + 1)):
        warn(lvl, f"unitNumbers not a clean 1..N sequence: {nums}")
    seen = set()
    for n, uid in items:
        if n in seen:
            err(uid, f"duplicate unitNumber {n} within level {lvl}")
        seen.add(n)

# report
total = len(lesson_paths)
print(f"Audited {total} units across {len(bylevel)} levels "
      f"({', '.join(f'{k}:{len(v)}' for k, v in sorted(bylevel.items()))}).")
print("Checks: audio-file existence, answer-ref integrity, reorder permutation,")
print("        dropdown/accept consistency, template/blank match, id uniqueness, unitNumber sequence.\n")
if errors:
    print(f"ERRORS ({len(errors)}):")
    for e in errors:
        print("  X", e)
else:
    print("STRUCTURAL: no errors. OK")
if warnings:
    print(f"\nWARNINGS ({len(warnings)}):")
    for w in warnings:
        print("  !", w)

sys.exit(1 if errors else 0)
