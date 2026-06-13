/**
 * The Frog — Florine's cursed mascot, drawn once as an inline woodcut-style
 * SVG so it stays identical everywhere it appears: the three hidden spots, the
 * comic's protagonist, and the footer replay control. Uses `currentColor`, so
 * colour and size come from the parent (className / text color).
 */
export default function Frog({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* body */}
      <path
        d="M14 44c-2-10 4-19 18-19s20 9 18 19c-1 6-8 9-18 9s-17-3-18-9Z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      {/* front feet */}
      <path d="M16 50c-3 2-6 2-8 5m12-3c-2 3-5 4-8 7" />
      <path d="M48 50c3 2 6 2 8 5m-12-3c2 3 5 4 8 7" />
      {/* webbed toes */}
      <path d="M8 55l-3 1m3-1l-1 3M56 55l3 1m-3-1l1 3" />
      {/* eye domes */}
      <path d="M22 26c0-5 3-9 7-9s6 3 6 8" fill="currentColor" fillOpacity={0.12} />
      <path d="M42 25c0-5-3-9-7-9" />
      <circle cx="24" cy="22" r="6" fill="currentColor" fillOpacity={0.14} />
      <circle cx="40" cy="22" r="6" fill="currentColor" fillOpacity={0.14} />
      {/* pupils */}
      <circle cx="24" cy="22.5" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="40" cy="22.5" r="2.4" fill="currentColor" stroke="none" />
      {/* mouth — the resigned, knowing smile */}
      <path d="M22 40c4 4 16 4 20 0" />
      {/* nostrils */}
      <path d="M30 33.5h.01M34 33.5h.01" strokeWidth={3} />
    </svg>
  );
}
