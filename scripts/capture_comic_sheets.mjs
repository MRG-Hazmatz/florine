// Capture the comic's 19 sheets from the claude-design print export as 2x PNGs.
//
// Usage:
//   npm i --no-save puppeteer-core          (uses the installed Edge, no download)
//   node scripts/capture_comic_sheets.mjs <export-dir> <out-dir>
//
// <export-dir> is the unzipped design export containing
// "La Complainte de la Grenouille-print.dc.html" (+ support.js, doc-page.js,
// uploads/). Two export bugs are patched into a temp copy before rendering:
//   1. the empty <script data-dc-script> makes the runtime paint a red error
//      banner — give it the minimal valid class instead;
//   2. speech bubbles carry no explicit `color` and inherit the tool's print
//      theme (white) — pin the default ink so they render dark.
// Then run scripts/build_comic_pages.py to convert the PNGs to public/comic.
import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [srcDir, outDir] = process.argv.slice(2);
if (!srcDir || !outDir) {
  console.error("usage: node scripts/capture_comic_sheets.mjs <export-dir> <out-dir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

// --- patch a temp copy of the print HTML -----------------------------------
const printName = "La Complainte de la Grenouille-print.dc.html";
let html = readFileSync(join(srcDir, printName), "utf8");
html = html.replace(
  /<script type="text\/x-dc" data-dc-script>\s*<\/script>/,
  '<script type="text/x-dc" data-dc-script>\nclass Component extends DCLogic {}\n</script>',
);
const styleMarker = "doc-page:not(:defined) { visibility:hidden; }";
if (!html.includes("x-dc { color:#241d13; }")) {
  html = html.replace(styleMarker, styleMarker + "\n    x-dc { color:#241d13; }");
}
const patched = join(srcDir, "print-patched.dc.html");
writeFileSync(patched, html, "utf8");

// --- render + capture -------------------------------------------------------
const fileUrl =
  "file:///" + patched.replace(/\\/g, "/").replace(/ /g, "%20").replace(/#/g, "%23");

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
  args: [
    "--allow-file-access-from-files",
    "--disable-gpu",
    "--no-first-run",
    "--user-data-dir=" + join(outDir, "edge-profile-" + Date.now()),
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 120_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1500));
  });

  const sheets = await page.$$("[data-screen-label]");
  console.log("sheets found:", sheets.length);
  for (let i = 0; i < sheets.length; i++) {
    const el = sheets[i];
    await el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 250));
    const label = await el.evaluate((e) => e.getAttribute("data-screen-label"));
    const file = join(outDir, `sheet-${String(i + 1).padStart(2, "0")}.png`);
    await el.screenshot({ path: file });
    console.log(`sheet-${String(i + 1).padStart(2, "0")}.png  <- ${label}`);
  }
} finally {
  await browser.close();
}
console.log("done — now run: python scripts/build_comic_pages.py <out-dir>");
