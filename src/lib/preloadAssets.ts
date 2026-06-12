/**
 * Warm the browser cache for small UI art that would otherwise pop in late the
 * first time a screen uses it. The worst offender is the review flashcards'
 * ornate frame: it's a CSS border-image, so the browser doesn't even request
 * the file until the first card renders — the frame visibly appears seconds
 * after the card. Same story for screen-specific icons like the review
 * hourglass. Fetching them once at app start (during idle time) means they're
 * already cached when their screen mounts.
 */
const UI_ICONS = [
  "/icons/frame.png",
  "/icons/review.png",
  "/icons/streak.png",
  "/icons/audio.png",
  "/icons/correct.png",
  "/icons/wrong.png",
  "/icons/popper.png",
  "/icons/hand.png",
  "/icons/lock.png",
  "/icons/levels.png",
  "/icons/skill-listening.png",
  "/icons/skill-reading.png",
  "/icons/skill-speaking.png",
  "/icons/skill-writing.png",
];

export function preloadUiIcons(): void {
  const load = () => {
    for (const src of UI_ICONS) {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    }
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(load, { timeout: 1500 });
  } else {
    setTimeout(load, 200);
  }
}
