/**
 * The Frog — Florine's cursed mascot, drawn once as an inline woodcut-style
 * SVG so it stays identical everywhere: the hidden spots, the comic, the
 * footer replay control. Uses `currentColor` for the ink line.
 *
 * - `solid`: fill the body/eyes with opaque paper so the frog OCCLUDES whatever
 *   is drawn behind it (used in comic scenes, so background lines — horizons,
 *   bars — never cross through its belly).
 * - `dead`: eyes become X's and the smile goes slack (the tap-to-kill gag).
 */
export default function Frog({
  className = "",
  title,
  solid = false,
  dead = false,
}: {
  className?: string;
  title?: string;
  solid?: boolean;
  dead?: boolean;
}) {
  const bodyFill = solid ? "var(--color-parchment)" : "currentColor";
  const bodyOpacity = solid ? 1 : 0.12;
  const domeOpacity = solid ? 1 : 0.14;

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
      {/* body — opaque when solid, so it covers the scene behind it */}
      <path
        d="M14 44c-2-10 4-19 18-19s20 9 18 19c-1 6-8 9-18 9s-17-3-18-9Z"
        fill={bodyFill}
        fillOpacity={bodyOpacity}
      />
      {/* front feet */}
      <path d="M16 50c-3 2-6 2-8 5m12-3c-2 3-5 4-8 7" />
      <path d="M48 50c3 2 6 2 8 5m-12-3c2 3 5 4 8 7" />
      {/* webbed toes */}
      <path d="M8 55l-3 1m3-1l-1 3M56 55l3 1m-3-1l1 3" />
      {/* eye domes — also opaque when solid */}
      <circle cx="24" cy="22" r="6.5" fill={bodyFill} fillOpacity={domeOpacity} />
      <circle cx="40" cy="22" r="6.5" fill={bodyFill} fillOpacity={domeOpacity} />
      {dead ? (
        <>
          {/* X eyes */}
          <path d="M21 19l6 6m0-6l-6 6M37 19l6 6m0-6l-6 6" strokeWidth={2.2} />
          {/* slack, resigned little mouth */}
          <path d="M24 41c4 3 8-2 12 1" />
        </>
      ) : (
        <>
          {/* pupils */}
          <circle cx="24" cy="22.5" r="2.4" fill="currentColor" stroke="none" />
          <circle cx="40" cy="22.5" r="2.4" fill="currentColor" stroke="none" />
          {/* the resigned, knowing smile */}
          <path d="M22 40c4 4 16 4 20 0" />
          {/* nostrils */}
          <path d="M30 33.5h.01M34 33.5h.01" strokeWidth={3} />
        </>
      )}
    </svg>
  );
}
