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
    """
    Crop to the artwork by scanning INWARD from each edge, stripping rows and
    columns whose non-white share is below `density` and stopping at the first
    dense one. Interior light bands are never touched — an earlier version kept
    only the largest dense RUN, which silently amputated the bottom of any
    sheet with a full-width pale gap between its panels and its captions.
    Sparse specks near the edges (the cover's stray pixels) are still skipped.
    """
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

    def row_dense(y: int) -> bool:
        return sum(1 for x in range(w) if px[x, y]) / w > density

    def col_dense(x: int) -> bool:
        return sum(1 for y in range(h) if px[x, y]) / h > density

    y0 = 0
    while y0 < h - 1 and not row_dense(y0):
        y0 += 1
    y1 = h
    while y1 > y0 + 1 and not row_dense(y1 - 1):
        y1 -= 1
    x0 = 0
    while x0 < w - 1 and not col_dense(x0):
        x0 += 1
    x1 = w
    while x1 > x0 + 1 and not col_dense(x1 - 1):
        x1 -= 1
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
