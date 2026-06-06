import { useRef, useState } from "react";

/** Resolve a content audio path ("audio/...") to a public URL ("/audio/..."). */
function toUrl(src: string): string {
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return "/" + src;
}

/**
 * Plays an mp3 from /public/audio. Degrades gracefully when the file doesn't
 * exist yet (Phase 1 content references placeholder paths) — shows a muted dash
 * instead of throwing.
 */
export default function AudioButton({ src, label }: { src?: string; label?: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState(false);

  if (!src) return null;

  const play = () => {
    const a = ref.current;
    if (!a) return;
    setError(false);
    a.currentTime = 0;
    a.play().catch(() => setError(true));
  };

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={play}
        title={label ?? "Play audio"}
        aria-label={label ?? "Play audio"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
      >
        <img src="/icons/audio.png" alt="" className="h-7 w-7 object-contain" />
      </button>
      <audio ref={ref} src={toUrl(src)} preload="none" onError={() => setError(true)} />
      {error && (
        <span className="text-xs text-ink/30" title="Audio not generated yet">
          —
        </span>
      )}
    </span>
  );
}
