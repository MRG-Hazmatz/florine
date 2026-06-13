#!/usr/bin/env python3
"""
Build-time audio generation for Florine (Phase 2).

Reads the curriculum JSON in /content and produces one .mp3 per vocab word,
example sentence, and listening-exercise transcript using edge-tts (free
Microsoft Edge neural voices, no API key, no rate limits). Output mirrors the
`audio` paths already stored in the content under /public.

This is committed in Phase 1 as a runnable skeleton; we do not run it yet
(Phase 1 ships placeholder audio paths only).

Usage:
    pip install edge-tts
    python scripts/generate_audio.py            # generate everything missing
    python scripts/generate_audio.py --force    # regenerate even if mp3 exists
    python scripts/generate_audio.py a1.1/unit-01-greetings   # one unit

Voices: "denise" -> fr-FR-DeniseNeural, "henri" -> fr-FR-HenriNeural.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"
PUBLIC_DIR = ROOT / "public"

VOICES = {
    "denise": "fr-FR-DeniseNeural",
    "henri": "fr-FR-HenriNeural",
}
DEFAULT_VOICE = "denise"


def _load(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def collect_jobs(unit_filter: str | None) -> list[tuple[str, str, Path]]:
    """Return (text, voice_name, output_path) tuples for everything to synthesise."""
    jobs: list[tuple[str, str, Path]] = []
    for lesson_path in sorted(CONTENT_DIR.glob("*/*/lesson.json")):
        lesson = _load(lesson_path)
        if unit_filter and lesson.get("id") != unit_filter:
            continue
        unit_dir = lesson_path.parent

        for item in lesson.get("vocabulary", []) + lesson.get("examples", []):
            audio = item.get("audio")
            if not audio:
                continue
            voice = VOICES.get(item.get("voice", DEFAULT_VOICE), VOICES[DEFAULT_VOICE])
            jobs.append((item["fr"], voice, PUBLIC_DIR / audio))

        ex_path = unit_dir / "exercises.json"
        if ex_path.exists():
            for ex in _load(ex_path).get("exercises", []):
                if ex.get("type") == "listen" and ex.get("audio") and ex.get("transcript"):
                    jobs.append((ex["transcript"], VOICES[DEFAULT_VOICE], PUBLIC_DIR / ex["audio"]))

    # Exam papers: every listening document in content/exams/*/exam.json.
    for exam_path in sorted((CONTENT_DIR / "exams").glob("*/exam.json")):
        exam = _load(exam_path)
        if unit_filter and exam.get("id") != unit_filter:
            continue
        for section in exam.get("sections", []):
            for doc in section.get("docs", []):
                if doc.get("audio") and doc.get("transcript"):
                    voice = VOICES.get(doc.get("voice", DEFAULT_VOICE), VOICES[DEFAULT_VOICE])
                    jobs.append((doc["transcript"], voice, PUBLIC_DIR / doc["audio"]))
    return jobs


async def synth(text: str, voice: str, out: Path) -> None:
    import edge_tts  # imported lazily so --help works without the dependency

    out.parent.mkdir(parents=True, exist_ok=True)
    await edge_tts.Communicate(text, voice).save(str(out))


async def main_async(unit_filter: str | None, force: bool) -> int:
    jobs = collect_jobs(unit_filter)
    if not jobs:
        print("Nothing to generate (no matching content with audio paths).")
        return 0

    try:
        import edge_tts  # noqa: F401
    except ImportError:
        print("edge-tts is not installed. Run:  pip install edge-tts", file=sys.stderr)
        return 1

    made = skipped = 0
    for text, voice, out in jobs:
        if out.exists() and not force:
            skipped += 1
            continue
        print(f"  -> {out.relative_to(ROOT)}  ({voice})")
        await synth(text, voice, out)
        made += 1

    print(f"\nDone. Generated {made}, skipped {skipped} (already present).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Florine audio with edge-tts.")
    parser.add_argument("unit", nargs="?", help='Optional unit id, e.g. "a1.1/unit-01-greetings".')
    parser.add_argument("--force", action="store_true", help="Regenerate even if the mp3 already exists.")
    args = parser.parse_args()
    return asyncio.run(main_async(args.unit, args.force))


if __name__ == "__main__":
    raise SystemExit(main())
