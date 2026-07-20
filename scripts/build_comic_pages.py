"""
Convert captured comic sheets -> public/comic/page-NN.webp

Pipeline for "La Complainte de la Grenouille" (the printed edition, designed in
claude design and shipped in-app as page images):

  1. Unzip the design export (kept out of the repo; see assets-incoming).
  2. node scripts/capture_comic_sheets.mjs <export-dir> <sheets-dir>
     - renders the patched print HTML in Edge and screenshots each
       [data-screen-label] sheet at 2x.
  3. python scripts/build_comic_pages.py <sheets-dir>
     - trims each sheet to its artwork, downscales to <=2048px wide, and
       writes WebP pages the FrogComic reader loads.

Trimming note: plain white-bbox trimming fails on the cover/back-cover sheets
(the art sits centered on a full sheet, and stray near-edge pixels stretch the
bbox), so we keep only the widest run of columns/rows whose non-white pixel
share clears a density threshold — page art is near-full-height, specks aren't.
"""
from __future__ import annotations
import os
import sys

from PIL import Image, ImageChops

OUT = os.path.join("public", "comic")
MAX_W = 2048
QUALITY = 82


def trim_white(im: Image.Image, tol: int = 12, density: float = 0.08) -> Image.Image:
    """Crop to the artwork: widest dense run of columns, then rows."""
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, (255, 255, 255))
    mask = ImageChops.difference(rgb, bg).convert("L").point(lambda p: 255 if p > tol else 0)
    bbox = mask.getbbox()
    if not bbox:
        return im
    mask = mask.crop(bbox)
    im = im.crop(bbox)
    w, h = mask.size
    px = mask.load()

    def dense_run(count: int, other: int, at) -> tuple[int, int]:
        dense = [sum(1 for j in range(other) if at(i, j)) / other > density for i in range(count)]
        best = cur_start = -1
        best_len = cur_len = 0
        for i, d in enumerate(dense):
            if d:
                if cur_len == 0:
                    cur_start = i
                cur_len += 1
                if cur_len > best_len:
                    best_len, best = cur_len, cur_start
            else:
                cur_len = 0
        return (best, best + best_len) if best_len else (0, count)

    x0, x1 = dense_run(w, h, lambda x, y: px[x, y])
    y0, y1 = dense_run(h, w, lambda y, x: px[x, y])
    return im.crop((x0, y0, x1, y1))


def flatten(im: Image.Image) -> Image.Image:
    """Composite transparency onto white."""
    if im.mode in ("RGBA", "P"):
        rgba = im.convert("RGBA")
        base = Image.new("RGB", im.size, (255, 255, 255))
        base.paste(rgba, mask=rgba.split()[-1])
        return base
    return im.convert("RGB")


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: python scripts/build_comic_pages.py <sheets-dir>")
        return 1
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    names = sorted(n for n in os.listdir(src) if n.startswith("sheet-") and n.endswith(".png"))
    total = 0
    for i, name in enumerate(names, 1):
        im = trim_white(flatten(Image.open(os.path.join(src, name))))
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        path = os.path.join(OUT, f"page-{i:02d}.webp")
        im.save(path, "WEBP", quality=QUALITY, method=6)
        kb = os.path.getsize(path) // 1024
        total += kb
        print(f"page-{i:02d}.webp  {im.size[0]}x{im.size[1]}  {kb} KB")
    print(f"{len(names)} pages, {total} KB total")
    return 0


if __name__ == "__main__":
    sys.exit(main())
