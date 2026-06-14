/**
 * "La Complainte de la Grenouille" — Florine's hidden origin comic, presented
 * like a vintage comic book: a cryptic COVER, the story PANELS, then a
 * self-referential BACK COVER. Hand-drawn woodcut SVG (ink line on parchment).
 * The reusable <Frog> is drawn `solid` over scenes so it occludes whatever is
 * behind it; in single-SVG scenes, foreground shapes use opaque paper fills and
 * later paint order to occlude the silly background details.
 *
 * The frog is a HE — he was a man, and stayed one inside (French grammar's
 * insistence on «la grenouille» being feminine is, to him, a personal insult).
 */
import type { ReactNode } from "react";
import Frog from "../components/frog/Frog";
import { strangerUrl } from "./characters";

export interface ComicPanel {
  id: string;
  kind: "cover" | "story" | "back";
  title?: string;
  art: ReactNode;
  fr?: string;
  en?: string;
}

const PAPER = "var(--color-parchment)";

function Scene({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full text-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function Rays({ cx = 200, cy = 150, n = 24, len = 230, opacity = 0.14 }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * len}
            y2={cy + Math.sin(a) * len}
            strokeOpacity={i % 2 ? opacity * 0.6 : opacity}
          />
        );
      })}
    </>
  );
}

/** The Florine "F" mark — the comic house's production logo. */
function FLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <rect width="64" height="64" rx="12" fill="var(--color-ink)" />
      <rect x="4" y="4" width="56" height="56" rx="9" fill="none" stroke="var(--color-rouge)" strokeWidth="3" />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontFamily="Cinzel, Georgia, serif"
        fontSize="40"
        fontWeight="700"
        fill="var(--color-parchment)"
      >
        F
      </text>
    </svg>
  );
}

/** A small tilted speech/distress sign for the captives. */
function CellSign({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute border border-ink/70 bg-card px-1 text-[7px] font-bold uppercase leading-tight text-ink/80 ${className}`}
    >
      {children}
    </div>
  );
}

export const COMIC_PANELS: ComicPanel[] = [
  /* ===================== COVER ===================== */
  {
    id: "cover",
    kind: "cover",
    art: (
      <>
        <Scene>
          <Rays opacity={0.12} />
          <rect x="320" y="40" width="34" height="200" fill={PAPER} />
          <rect x="320" y="40" width="34" height="200" />
          <path d="M320 40h8v-10h8v10h8v-10h8v10h2" />
          <rect x="330" y="80" width="14" height="20" rx="7" fill="currentColor" fillOpacity={0.18} />
          {[34, 52, 70].map((x) => (
            <line key={x} x1={x} y1={150} x2={x} y2={250} strokeOpacity={0.4} strokeWidth={3} />
          ))}
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog solid className="h-40 w-40 text-ink drop-shadow-[3px_3px_0_rgba(23,18,12,0.3)]" />
        </div>
        <div className="absolute left-2 top-2 border-2 border-ink bg-ink px-2 py-0.5">
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-parchment">
            Florine Comics
          </span>
        </div>
        <div className="absolute right-2 top-2 -rotate-6 border-2 border-ink bg-card px-2 py-0.5 text-center">
          <p className="font-display text-[10px] font-bold text-ink">Nº 1</p>
          <p className="text-[8px] text-ink/70">3 mouches</p>
        </div>
        <div className="absolute inset-x-0 top-7 text-center">
          <p className="font-display text-base font-bold uppercase leading-none tracking-wide text-rouge drop-shadow-[1px_1px_0_rgba(242,235,216,0.8)]">
            La Complainte
            <br />
            de la Grenouille
          </p>
        </div>
        <div className="absolute inset-x-3 bottom-2 -rotate-1 border-2 border-ink bg-card px-2 py-1 text-center shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wide text-ink">
            « L'origine que personne n'a demandée ! »
          </p>
        </div>
        <div className="absolute bottom-12 right-2 flex h-9 w-9 rotate-6 items-center justify-center rounded-full border border-ink/70 text-center text-[6px] uppercase leading-tight text-ink/70">
          Approuvé · croâ
        </div>
      </>
    ),
  },

  /* ===================== STORY ===================== */
  {
    id: "human",
    kind: "story",
    title: "Chapitre I — L'Humain",
    art: (
      <Scene>
        <line x1="0" y1="232" x2="400" y2="232" strokeOpacity={0.25} />
        <g transform="rotate(-7 70 70)">
          <rect x="44" y="44" width="52" height="42" fill={PAPER} />
          <rect x="44" y="44" width="52" height="42" strokeOpacity={0.55} />
          <path d="M52 74c6-12 12-12 18 0s12 8 18-2" strokeOpacity={0.4} />
        </g>
        <g transform="rotate(5 320 70)">
          <rect x="280" y="44" width="80" height="50" fill={PAPER} />
          <rect x="280" y="44" width="80" height="50" strokeOpacity={0.55} />
          <text x="320" y="62" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" fillOpacity={0.6} className="font-display">J'AIME LE</text>
          <path d="M312 74c-4-5-12-1-12 4 0 5 12 11 12 11s12-6 12-11c0-5-8-9-12-4z" strokeOpacity={0.55} />
          <text x="332" y="86" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fillOpacity={0.6} className="font-display">KETCHUP</text>
        </g>
        <g transform="translate(352 170)">
          <path d="M0 60V24a8 8 0 0116 0v36" fill={PAPER} />
          <path d="M0 60V24a8 8 0 0116 0v36M0 40c-8 0-10-6-10-12M16 44c8 0 10-6 10-14" strokeOpacity={0.5} />
          <path d="M-14 60h44l-4 18h-36z" fill={PAPER} />
          <path d="M-14 60h44l-4 18h-36z" strokeOpacity={0.5} />
        </g>
        <path d="M120 264c2-46 18-64 50-64s48 18 50 64z" fill={PAPER} />
        <path d="M120 264c2-46 18-64 50-64s48 18 50 64" />
        <circle cx="170" cy="150" r="44" fill={PAPER} />
        <circle cx="170" cy="150" r="44" />
        <path d="M126 134c6-16 72-22 88-3 3 4-4 8-12 8H138c-9 0-15-1-12-5z" fill="currentColor" fillOpacity={0.14} />
        <circle cx="216" cy="128" r="3.5" fill="currentColor" stroke="none" />
        <path d="M150 150c4-3 9-3 12 0M180 150c4-3 9-3 12 0" />
        <path d="M188 160c7 2 10 6 4 10" />
        <path d="M156 176c8 5 18 5 26 0" />
      </Scene>
    ),
    fr: "Il était une fois un humain : arrogant, insupportable et — pire que tout — insuffisamment français. Sa chambre, à elle seule, constituait une preuve.",
    en: "Once, the frog was a man: arrogant, unbearable, and — worst of all — insufficiently French. His bedroom alone was evidence: a crooked «J'aime le KETCHUP» poster, socks in sandals, and a cactus named Kevin.",
  },
  {
    id: "crime",
    kind: "story",
    title: "Chapitre II — Le Délit",
    art: (
      <Scene>
        <path d="M200 16v14M186 30h28M190 30c-2 8-2 12 0 16M210 30c2 8 2 12 0 16M200 30c0 8 0 12 0 18" strokeOpacity={0.3} />
        <line x1="0" y1="60" x2="400" y2="60" strokeOpacity={0.18} />
        <line x1="40" y1="232" x2="360" y2="232" strokeOpacity={0.4} />
        <path d="M120 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22v82z" fill={PAPER} />
        <path d="M120 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22" />
        <path d="M150 168c0 16 10 22 18 22s18-6 18-22z" fill={PAPER} />
        <path d="M150 168c0 16 10 22 18 22s18-6 18-22zM168 190v34m-12 8h24" />
        <path d="M154 168c0 12 6 17 14 17s14-5 14-17z" fill="currentColor" fillOpacity={0.16} stroke="none" />
        <ellipse cx="232" cy="226" rx="38" ry="9" fill={PAPER} />
        <ellipse cx="232" cy="226" rx="38" ry="9" />
        <path d="M214 224c4-12 36-12 38 0z" fill="currentColor" fillOpacity={0.12} />
        <rect x="246" y="150" width="26" height="46" rx="6" fill={PAPER} />
        <rect x="246" y="150" width="26" height="46" rx="6" />
        <rect x="253" y="142" width="12" height="10" rx="2" />
        <path d="M259 196c-4 8-14 18-22 24" stroke="var(--color-rouge)" strokeOpacity={0.7} />
        <circle cx="320" cy="150" r="20" fill={PAPER} />
        <circle cx="320" cy="150" r="20" />
        <path d="M306 198c2-22 12-28 14-28s12 6 14 28z" fill={PAPER} />
        <path d="M306 198c2-22 12-28 14-28s12 6 14 28" />
        <circle cx="313" cy="148" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="327" cy="148" r="2.2" fill="currentColor" stroke="none" />
        <path d="M315 160q5 4 10 0" />
        <path d="M340 138c3 4 3 8 0 11" strokeOpacity={0.5} />
        <path d="M96 116c0-9 14-9 14 0 0 6-7 6-7 12M103 140h.02" strokeOpacity={0.5} />
      </Scene>
    ),
    fr: "Au restaurant, il commanda « un vin, n'importe lequel », réclama du ketchup pour le confit de canard, et garda ses chaussettes dans ses sandales. Le sommelier consulte, depuis, un spécialiste.",
    en: "At dinner he ordered 'a wine — any wine,' demanded ketchup for the duck confit, and kept his socks on in sandals. The sommelier has, since that night, been seeing someone about it.",
  },
  {
    id: "cafe",
    kind: "story",
    title: "Chapitre III — Le Café",
    art: (
      <Scene>
        {/* tidy café interior */}
        {/* hanging CAFÉ sign */}
        <line x1="200" y1="14" x2="200" y2="26" strokeOpacity={0.4} />
        <rect x="168" y="26" width="64" height="22" rx="3" fill={PAPER} />
        <rect x="168" y="26" width="64" height="22" rx="3" />
        <text x="200" y="42" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" className="font-display">CAFÉ</text>
        {/* window with a little street lamp outside */}
        <rect x="20" y="56" width="64" height="50" fill={PAPER} />
        <rect x="20" y="56" width="64" height="50" strokeOpacity={0.5} />
        <path d="M52 56v50M20 81h64" strokeOpacity={0.3} />
        <path d="M40 96v-16a6 6 0 0112 0M46 80v-6" strokeOpacity={0.3} />
        {/* floor line */}
        <line x1="0" y1="246" x2="400" y2="246" strokeOpacity={0.35} />
        {/* the creator (left), saying kwa-sont */}
        <path d="M92 246c2-30 14-40 22-40s20 10 22 40z" fill={PAPER} />
        <path d="M92 246c2-30 14-40 22-40s20 10 22 40" />
        <circle cx="114" cy="178" r="18" fill={PAPER} />
        <circle cx="114" cy="178" r="18" />
        <circle cx="108" cy="178" r="1.9" fill="currentColor" stroke="none" />
        <circle cx="120" cy="178" r="1.9" fill="currentColor" stroke="none" />
        <path d="M108 186q6 4 12 0" />
        <path d="M70 138h70v26H104l-9 10v-10H70z" fill={PAPER} />
        <path d="M70 138h70v26H104l-9 10v-10H70z" />
        <text x="105" y="155" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">« kwa-sont ? »</text>
        {/* the little café table: clean cup + saucer + croissant */}
        <line x1="186" y1="246" x2="186" y2="214" />
        <ellipse cx="186" cy="214" rx="30" ry="6" fill={PAPER} />
        <ellipse cx="186" cy="214" rx="30" ry="6" />
        {/* cup + saucer */}
        <ellipse cx="176" cy="208" rx="14" ry="3.5" />
        <path d="M165 206a11 6 0 0022 0M186 200c6 0 8 8 1 9" fill={PAPER} />
        <path d="M165 206a11 6 0 0022 0M186 201c6 0 7 7 1 8" />
        {/* croissant */}
        <path d="M196 206c-3-5 1-10 7-10 5 0 9 4 9 9 0 4-3 6-6 5 2-4-1-8-5-8s-6 2-5 4z" fill={PAPER} />
        <path d="M196 206c-3-5 1-10 7-10 5 0 9 4 9 9 0 4-3 6-6 5" />
        {/* the wizard (right): hat ON TOP, raised brow, beard, robe */}
        <path d="M256 246c2-30 16-42 26-42s24 12 26 42z" fill={PAPER} />
        <path d="M256 246c2-30 16-42 26-42s24 12 26 42" />
        <circle cx="282" cy="176" r="19" fill={PAPER} />
        <circle cx="282" cy="176" r="19" />
        {/* conical hat above the head */}
        <path d="M262 162 282 112 302 162Z" fill="currentColor" fillOpacity={0.16} />
        <path d="M262 162 282 112 302 162M258 162h48" />
        <circle cx="288" cy="128" r="2" fill="currentColor" stroke="none" />
        {/* face: raised eyebrow + eyes */}
        <path d="M272 170c2-3 6-3 8-1" />
        <circle cx="276" cy="177" r="1.9" fill="currentColor" stroke="none" />
        <circle cx="289" cy="177" r="1.9" fill="currentColor" stroke="none" />
        <path d="M276 187c4 1 8 1 10-1" />
        {/* beard */}
        <path d="M270 188c-2 16-2 34 12 40 14-6 14-24 12-40" fill={PAPER} />
        <path d="M270 188c-2 16-2 34 12 40 14-6 14-24 12-40" strokeOpacity={0.7} />
      </Scene>
    ),
    fr: "Le lendemain, dans un café qu'un certain sorcier fréquentait, il réclama « un grand café américain » et un « kwa-sont ». Le sorcier leva un sourcil. Puis il vit la tenue : chaussettes, sandales, banane à la ceinture. Ce fut l'erreur de trop.",
    en: "Next morning, at a café a certain wizard frequented, he ordered 'a big American coffee' and a «kwa-sont». The wizard raised an eyebrow — then took in the outfit: socks, sandals, a bumbag. That was the final straw.",
  },
  {
    id: "tower",
    kind: "story",
    title: "Chapitre IV — La Tour",
    art: (
      <Scene>
        {/* night sky: faint hatch, a big moon, scattered stars */}
        <rect x="0" y="0" width="400" height="248" fill="currentColor" fillOpacity={0.05} />
        <circle cx="86" cy="74" r="38" fill="currentColor" fillOpacity={0.1} />
        <circle cx="74" cy="64" r="6" fill="currentColor" fillOpacity={0.06} stroke="none" />
        <circle cx="96" cy="86" r="4" fill="currentColor" fillOpacity={0.06} stroke="none" />
        {[
          [150, 40], [200, 70], [250, 36], [300, 90], [340, 50], [180, 120], [60, 150], [350, 150], [120, 60], [270, 130],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 4}l1 3 3 1-3 1-1 3-1-3-3-1 3-1z`} strokeOpacity={0.4} />
        ))}
        {/* the very tall tower (opaque), centre-right */}
        <rect x="244" y="36" width="56" height="212" fill={PAPER} />
        <rect x="244" y="36" width="56" height="212" />
        <path d="M244 36h12v-12h10v12h12v-12h10v12h2" />
        {/* flag */}
        <path d="M272 24V8l14 5-14 4" strokeOpacity={0.6} />
        {/* clock + ivy + courses */}
        <circle cx="272" cy="70" r="11" strokeOpacity={0.5} />
        <path d="M272 70v-6M272 70l5 2" strokeOpacity={0.5} />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={244} y1={96 + i * 28} x2={300} y2={96 + i * 28} strokeOpacity={0.18} />
        ))}
        <path d="M244 150c-8 6-8 16-2 24M300 140c8 6 8 18 0 26" strokeOpacity={0.3} />
        {/* glowing window with a wizard silhouette */}
        <rect x="260" y="110" width="24" height="34" rx="12" fill="currentColor" fillOpacity={0.2} />
        <path d="M272 118l-7 22h14z" fill="currentColor" stroke="none" />
        <path d="M272 112l5 5-5 5-5-5z" fill="currentColor" stroke="none" />
        <line x1="0" y1="248" x2="400" y2="248" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "Car le sorcier vivait au sommet d'une tour très, très haute. Cette nuit-là, sous un ciel constellé d'étoiles, il feuilleta son plus vieux grimoire. Les sorciers adorent une nuit dramatique.",
    en: "For the wizard lived atop a very, very tall tower. That night, beneath a sky thick with stars, he leafed through his oldest spellbook. Wizards do love a dramatic night.",
  },
  {
    id: "curse",
    kind: "story",
    title: "Chapitre V — Le Sortilège",
    art: (
      <>
        <Scene>
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const r1 = i % 2 ? 130 : 78;
            return (
              <line
                key={i}
                x1={200 + Math.cos(a) * 30}
                y1={150 + Math.sin(a) * 30}
                x2={200 + Math.cos(a) * r1}
                y2={150 + Math.sin(a) * r1}
                strokeOpacity={0.5}
              />
            );
          })}
          <path d="M356 40l-44 44" strokeOpacity={0.7} strokeWidth={3} />
          <path d="M312 84l6 2-2 6-6-2z" fill="currentColor" stroke="none" />
          <path d="M86 224h28l-4 10H90zM96 224v-6h8v6" strokeOpacity={0.6} />
          <path d="M300 86l1 5 5 1-5 1-1 5-1-5-5-1 5-1zM104 70l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog solid className="h-28 w-28 text-ink" />
        </div>
      </>
    ),
    fr: "« Pour ce crime contre le bon goût, dit le sorcier, tu seras grenouille — jusqu'à ce que tu apprennes les manières des Français. » Excessif, mais réversible, paraît-il. (En français, « la grenouille » est féminine. Le sorcier trouva cela hilarant. Lui — l'homme dans la grenouille — beaucoup moins.)",
    en: "'For this crime against good taste,' said the wizard, 'a frog you shall be — until you learn the ways of the French.' Excessive, but reversible, apparently. (In French, «la grenouille» is feminine. The wizard found this hilarious. He — the man inside the frog — has never forgiven it.)",
  },
  {
    id: "terms",
    kind: "story",
    title: "Chapitre VI — Les Conditions",
    art: (
      <Scene>
        <path d="M88 56c-16 0-16 20 0 20M312 56c16 0 16 20 0 20" fill={PAPER} />
        <rect x="88" y="56" width="224" height="190" fill={PAPER} />
        <rect x="88" y="56" width="224" height="190" />
        <rect x="98" y="66" width="204" height="170" strokeOpacity={0.4} />
        <path d="M88 56c-16 0-16 20 0 20M312 56c16 0 16 20 0 20" />
        <path d="M88 246c-16 0-16 20 0 20M312 246c16 0 16 20 0 20" />
        <path d="M104 72c8 0 8 8 0 8M296 72c-8 0-8 8 0 8M104 230c8 0 8-8 0-8M296 230c-8 0-8-8 0-8" strokeOpacity={0.4} />
        {/* clause 1: book */}
        <path d="M120 100c10-6 22-6 30 0v22c-8-6-20-6-30 0zM150 100c8-6 20-6 30 0v22c-10-6-22-6-30 0z" />
        <line x1="196" y1="104" x2="296" y2="104" strokeOpacity={0.32} />
        <line x1="196" y1="114" x2="262" y2="114" strokeOpacity={0.26} />
        <line x1="196" y1="124" x2="284" y2="124" strokeOpacity={0.22} />
        {/* clause 2: little sun */}
        <circle cx="135" cy="170" r="11" strokeOpacity={0.7} />
        <path d="M135 152v-6M135 194v-6M113 170h-6M163 170h-6M120 155l-4-4M150 155l4-4" strokeOpacity={0.5} />
        <path d="M130 170q5 5 10 0" strokeOpacity={0.7} />
        <line x1="196" y1="160" x2="296" y2="160" strokeOpacity={0.32} />
        <line x1="196" y1="170" x2="256" y2="170" strokeOpacity={0.26} />
        <line x1="196" y1="180" x2="288" y2="180" strokeOpacity={0.22} />
        {/* pages of small print */}
        <line x1="118" y1="204" x2="282" y2="204" strokeOpacity={0.2} />
        <line x1="118" y1="212" x2="248" y2="212" strokeOpacity={0.18} />
        <line x1="118" y1="220" x2="270" y2="220" strokeOpacity={0.16} />
        {/* wax seal w/ frog stamp */}
        <circle cx="258" cy="222" r="16" fill="var(--color-rouge)" fillOpacity={0.18} />
        <circle cx="258" cy="222" r="16" stroke="var(--color-rouge)" strokeOpacity={0.5} />
        <circle cx="253" cy="219" r="2" fill="currentColor" stroke="none" />
        <circle cx="263" cy="219" r="2" fill="currentColor" stroke="none" />
        <path d="M251 226q7 5 14 0" />
      </Scene>
    ),
    fr: "Le contrat tenait en une ligne — mais en tout petit, sous des pages d'avenants : enseigner le français, transmettre la joie de l'être, et alors, peut-être, redevenir humain. Des avocats furent impliqués. Comme toujours. « Peut-être », par ailleurs, est le mot préféré des sorciers.",
    en: "The contract fit on one line — in very fine print, beneath pages of clauses: teach French, pass on the joy of being French, and then, perhaps, become human again. Lawyers were involved. They usually are. 'Perhaps,' incidentally, is a wizard's favourite word.",
  },
  {
    id: "flaw",
    kind: "story",
    title: "Chapitre VII — Le Plan « Génial »",
    art: (
      <Scene>
        <circle cx="80" cy="58" r="18" fill="currentColor" fillOpacity={0.12} />
        <path d="M73 73h14M75 79h10M80 40v-8M60 50l-5-4M100 50l5-4" strokeOpacity={0.7} />
        <rect x="34" y="120" width="120" height="50" rx="4" fill={PAPER} />
        <rect x="34" y="120" width="120" height="50" rx="4" />
        <text x="94" y="140" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">TRANSMETTRE</text>
        <text x="94" y="157" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">LA JOIE</text>
        <path d="M158 145h40m-10-7 10 7-10 7" />
        <rect x="214" y="120" width="150" height="50" rx="4" fill={PAPER} />
        <rect x="214" y="120" width="150" height="50" rx="4" />
        <text x="289" y="140" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="font-display">« RECRUTER »</text>
        <text x="289" y="156" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="font-display">(= DES HOMMES DE MAIN)</text>
        <path d="M222 116l134 58m0-58-134 58" stroke="var(--color-rouge)" strokeWidth={3} strokeOpacity={0.8} />
        <circle cx="289" cy="145" r="84" stroke="var(--color-rouge)" strokeOpacity={0.5} strokeWidth={2} />
        {/* a net hauling little stick people */}
        <path d="M150 250c10-14 40-14 50 0" strokeOpacity={0.5} />
        {[120, 175, 230].map((x) => (
          <g key={x} strokeOpacity={0.55}>
            <circle cx={x} cy="236" r="5" />
            <path d={`M${x} 241v14M${x - 7} 248h14M${x - 5} 268l5-8 5 8`} />
          </g>
        ))}
        <path d="M250 232c14-2 26 6 30 18" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "« Pour transmettre la joie, se dit-il, je recruterai des professeurs ! » Hélas, ce qu'il « recruta » ressemblait beaucoup, beaucoup plus à des hommes de main. Détail.",
    en: "'To pass on the joy,' he reasoned, 'I'll recruit some teachers!' Alas, what he 'recruited' looked a great deal more like henchmen. A detail.",
  },
  {
    id: "strangers",
    kind: "story",
    title: "Chapitre VIII — La Main-d'œuvre",
    art: (
      <>
        <div className="absolute inset-x-2 top-1 h-[68%] overflow-hidden border-[3px] border-ink bg-ink/80">
          <div className="grid h-full grid-cols-4">
            {[3, 5, 7, 9, 11, 13, 17, 19].map((n) => (
              <div key={n} className="border-r border-ink/30 last:border-r-0">
                <img
                  src={strangerUrl(n)}
                  alt=""
                  className="h-full w-full object-cover opacity-85 mix-blend-multiply"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex justify-between px-2 py-1">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className="block w-[3px] bg-ink" />
            ))}
          </div>
        </div>
        {/* a chorus of captive complaints */}
        <CellSign className="left-5 top-[14%] -rotate-3">au secours</CellSign>
        <CellSign className="right-6 top-[10%] rotate-2">j'avais piscine</CellSign>
        <CellSign className="left-[40%] top-[40%] -rotate-2">rends mon béret</CellSign>
        <CellSign className="right-8 top-[44%] rotate-3">c'est légal, ça ?</CellSign>
        {/* the warden frog — BIG, smug, directly in front */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <Frog solid className="h-24 w-24 text-ink drop-shadow-[2px_2px_0_rgba(23,18,12,0.45)]" />
        </div>
        <svg viewBox="0 0 40 40" className="absolute bottom-4 right-6 h-9 w-9 text-ink" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="12" cy="14" r="7" />
          <path d="M17 18l16 16m-6 0 6-6m-12 0 5 5" />
        </svg>
      </>
    ),
    fr: "Il captura donc vingt inconnus et les fit enseigner. Transmettre la joie en privant des gens de la leur : un plan sans faille — à part la faille. Il pose fièrement devant son œuvre.",
    en: "So he captured twenty strangers and made them teach. Spreading joy by depriving people of theirs: a flawless plan, save for the flaw. He poses very proudly in front of his work.",
  },
  {
    id: "audit",
    kind: "story",
    title: "Chapitre IX — L'Audit",
    art: (
      <>
        {/* Kim — large on the right, as if holding the board */}
        <div className="absolute bottom-0 right-0 top-3 flex w-[44%] flex-col items-center justify-end">
          <div className="h-[80%] w-full overflow-hidden border-2 border-ink bg-parchment shadow-[3px_3px_0_rgba(23,18,12,0.4)]">
            <img src={strangerUrl(2)} alt="" className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <p className="mt-0.5 text-[9px] uppercase tracking-widest text-ink/60">Kim · l'inspectrice</p>
        </div>
        {/* the clipboard she's "holding", tilted toward her */}
        <svg viewBox="0 0 240 300" className="absolute bottom-2 left-2 h-[88%] text-ink" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <g transform="rotate(-6 120 150)">
            <rect x="40" y="40" width="150" height="200" rx="6" fill={PAPER} />
            <rect x="40" y="40" width="150" height="200" rx="6" />
            <rect x="88" y="30" width="54" height="20" rx="5" fill="currentColor" fillOpacity={0.18} />
            <text x="115" y="66" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" className="font-display">AUDIT</text>
            <line x1="56" y1="74" x2="174" y2="74" strokeOpacity={0.4} />
            <path d="M58 96l8 8 14-16" strokeWidth={2.5} />
            <line x1="92" y1="96" x2="176" y2="96" strokeOpacity={0.3} />
            <path d="M58 130l16 16m0-16-16 16" stroke="var(--color-rouge)" strokeWidth={2.5} strokeOpacity={0.85} />
            <line x1="92" y1="138" x2="176" y2="138" strokeOpacity={0.3} />
            <line x1="58" y1="172" x2="176" y2="172" strokeOpacity={0.25} />
            <line x1="58" y1="188" x2="150" y2="188" strokeOpacity={0.25} />
            <line x1="58" y1="204" x2="166" y2="204" strokeOpacity={0.25} />
            <g transform="rotate(-10 118 224)">
              <rect x="78" y="214" width="84" height="22" rx="3" stroke="var(--color-rouge)" strokeOpacity={0.7} />
              <text x="120" y="229" textAnchor="middle" fontSize="11" fill="var(--color-rouge)" fillOpacity={0.85} stroke="none" className="font-display">À REVOIR</text>
            </g>
          </g>
        </svg>
      </>
    ),
    fr: "Kim, seule, s'était portée volontaire — elle préférait inspecter qu'être emprisonnée. Clipboard en main, elle nota que kidnapper des bénévoles est, mathématiquement, un paradoxe. Il promit d'« y revenir ». Il n'y revint jamais.",
    en: "Kim alone volunteered — she preferred inspecting to being imprisoned. Clipboard in hand, she noted that kidnapping volunteers is, mathematically, a paradox. He said he'd circle back. He never did.",
  },
  {
    id: "precedents",
    kind: "story",
    title: "Chapitre X — Les Précédents",
    art: (
      <Scene>
        {/* --- silly kitchen background --- */}
        <rect x="20" y="60" width="56" height="42" fill={PAPER} />
        <rect x="20" y="60" width="56" height="42" strokeOpacity={0.45} />
        <path d="M48 60v42M20 81h56" strokeOpacity={0.3} />
        {/* hanging pans on a rail */}
        <line x1="120" y1="48" x2="280" y2="48" strokeOpacity={0.4} />
        <path d="M150 48v18a12 8 0 0024 0V48M186 48h22a6 6 0 010 12" strokeOpacity={0.4} />
        <circle cx="232" cy="62" r="10" strokeOpacity={0.4} />
        <path d="M242 62h16" strokeOpacity={0.4} />
        {/* a stove with a pot at the right */}
        <rect x="300" y="120" width="80" height="60" fill={PAPER} />
        <rect x="300" y="120" width="80" height="60" strokeOpacity={0.4} />
        <circle cx="320" cy="135" r="4" strokeOpacity={0.4} />
        <circle cx="360" cy="135" r="4" strokeOpacity={0.4} />
        <line x1="20" y1="232" x2="400" y2="232" strokeOpacity={0.3} />
        {/* --- the rat (Remy), sitting up, facing right --- */}
        {/* haunches */}
        <ellipse cx="150" cy="206" rx="34" ry="22" fill={PAPER} />
        <ellipse cx="150" cy="206" rx="34" ry="22" />
        {/* tail */}
        <path d="M180 214c22 6 34-2 34-18 0-9-10-12-13-3" strokeOpacity={0.7} />
        {/* big head */}
        <circle cx="120" cy="168" r="24" fill={PAPER} />
        <circle cx="120" cy="168" r="24" />
        {/* round ears */}
        <circle cx="108" cy="146" r="11" fill={PAPER} />
        <circle cx="108" cy="146" r="11" />
        <circle cx="130" cy="144" r="11" fill={PAPER} />
        <circle cx="130" cy="144" r="11" />
        <circle cx="108" cy="146" r="5" fill="currentColor" fillOpacity={0.12} stroke="none" />
        <circle cx="130" cy="144" r="5" fill="currentColor" fillOpacity={0.12} stroke="none" />
        {/* snout to the left with a PINK nose */}
        <path d="M100 172c-14 1-22 6-28 12" fill={PAPER} />
        <path d="M100 178c-12 0-20 4-26 8" />
        <path d="M100 166c-12 1-20 3-26 6" />
        <circle cx="72" cy="184" r="4" fill="var(--color-rouge)" stroke="var(--color-ink)" strokeWidth={1.5} />
        {/* whiskers */}
        <path d="M76 188c-12 3-20 7-26 7M78 192c-12 5-18 9-24 12" strokeOpacity={0.5} />
        {/* eye */}
        <circle cx="116" cy="166" r="2.4" fill="currentColor" stroke="none" />
        {/* little arms holding a wooden spoon */}
        <path d="M132 196c8 2 14 8 16 16M150 212l18-14" strokeOpacity={0.7} />
        <ellipse cx="172" cy="194" rx="6" ry="3.5" transform="rotate(-38 172 194)" strokeOpacity={0.7} />
        {/* chef toque */}
        <path d="M104 144c-4-16 40-16 36 0 8-2 12 8 4 11H100c-8-3-4-13 4-11z" fill={PAPER} />
        <path d="M104 144c-4-16 40-16 36 0 8-2 12 8 4 11H100c-8-3-4-13 4-11z" />
        {/* the magic-potion cauldron (Astérix nod) */}
        <path d="M268 206c0 24 20 36 40 36s40-12 40-36z" fill={PAPER} />
        <path d="M268 206c0 24 20 36 40 36s40-12 40-36z" />
        <ellipse cx="308" cy="206" rx="40" ry="11" fill="currentColor" fillOpacity={0.1} />
        <ellipse cx="308" cy="206" rx="40" ry="11" />
        <circle cx="298" cy="184" r="5" strokeOpacity={0.6} />
        <circle cx="316" cy="176" r="4" strokeOpacity={0.6} />
        <circle cx="308" cy="166" r="3" strokeOpacity={0.6} />
        <path d="M264 218l-8 6M352 218l8 6" />
      </Scene>
    ),
    fr: "Un rat avait déjà prouvé que n'importe qui peut cuisiner. Il en conclut que n'importe qui peut « franciser ». Pour le subjonctif, hélas, aucune potion magique — même Astérix a séché.",
    en: "A rat had already proven anyone can cook. He concluded anyone can French. For the subjunctive, alas, no magic potion exists — even Astérix came up dry.",
  },
  {
    id: "treasure",
    kind: "story",
    title: "Chapitre XI — Le Trésor",
    art: (
      <>
        <Scene>
          <Rays cx={200} cy={168} n={16} len={150} opacity={0.12} />
          <rect x="150" y="168" width="100" height="62" rx="4" fill={PAPER} />
          <rect x="150" y="168" width="100" height="62" rx="4" />
          <path d="M150 168c0-26 100-26 100 0" fill="currentColor" fillOpacity={0.16} />
          <line x1="150" y1="194" x2="250" y2="194" />
          <rect x="192" y="188" width="16" height="16" rx="3" fill="currentColor" fillOpacity={0.2} />
          <path d="M196 150l2 7 7 2-7 2-2 7-2-7-7-2 7-2zM226 158l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
        </Scene>
        <div className="absolute bottom-3 left-6">
          <Frog solid className="h-16 w-16 text-ink" />
        </div>
      </>
    ),
    fr: "Au bout du chemin, un trésor qu'il ne peut posséder seul : la joie d'être français. Plus on la partage, plus elle grandit. (Agaçant. Mais c'est ainsi.)",
    en: "At the path's end, a treasure he cannot hoard alone — la joie d'être français. The more it's shared, the more it grows. (Annoying. But there it is.)",
  },
  {
    id: "closer",
    kind: "story",
    title: "Et pourtant…",
    art: (
      <>
        <Scene>
          <path
            d="M348 250c4-18 8-30 12-46m12 46c-4-18-8-30-12-46m0 0c-2-14-2-26 0-40 2 14 2 26 0 40M352 220h16M349 236h22"
            strokeOpacity={0.22}
          />
          <path d="M356 250q4-6 8 0" strokeOpacity={0.22} />
          <line x1="20" y1="250" x2="380" y2="250" strokeOpacity={0.3} />
          <path d="M118 132c-10-6-18-4-22 4M262 132c10-6 18-4 22 4" strokeOpacity={0.4} />
          <path d="M196 96c0-8 12-8 12 0 0 5-6 5-6 10M202 114h.02" strokeOpacity={0.45} />
        </Scene>
        <div className="absolute inset-0 flex items-end justify-center pb-5">
          <Frog solid className="h-32 w-32 text-ink" />
        </div>
      </>
    ),
    fr: "Alors il vous guide. Si un jour assez de gens ressentent cette joie, il redeviendra humain. En attendant — comme Piaf — il ne regrette rien. Car qui veut vraiment être français ? Même les Français n'en sont pas si sûrs, soyons honnêtes. Et pourtant : nous voilà. Croâ.",
    en: "So he guides you. If enough people one day feel that joy, he turns human again. Until then — like Piaf — he regrets nothing. Because who even wants to be French? Even the French aren't really sure, honestly. And yet: here we all are. Croâ.",
  },

  /* ===================== BACK COVER ===================== */
  {
    id: "backcover",
    kind: "back",
    art: (
      <>
        <Scene>
          <ellipse cx="200" cy="150" rx="120" ry="80" strokeOpacity={0.06} />
          <ellipse cx="200" cy="150" rx="150" ry="100" strokeOpacity={0.05} />
        </Scene>
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 text-center">
          <p className="font-display text-3xl font-bold uppercase tracking-widest text-ink/80">Fin.</p>

          <div className="flex w-full items-center justify-between gap-2">
            <div className="-rotate-1 border-2 border-ink bg-card px-3 py-1.5 text-left shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
              <p className="font-display text-[11px] font-bold uppercase text-rouge">Apprenez le français !</p>
              <p className="text-[9px] text-ink/70">Résultats non garantis.<br />Effet secondaire : un léger accent.</p>
            </div>
            {/* a clearer cheese wheel with a cut wedge + holes */}
            <svg viewBox="0 0 96 64" className="h-16 w-24 text-ink" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round">
              <ellipse cx="36" cy="36" rx="30" ry="22" fill={PAPER} />
              <ellipse cx="36" cy="36" rx="30" ry="22" />
              {/* slice removed from the wheel */}
              <path d="M36 36 58 22 A30 22 0 0 0 36 14 Z" fill="currentColor" fillOpacity={0.06} />
              <path d="M36 36 58 22M36 36 36 14" strokeOpacity={0.5} />
              {/* holes */}
              <circle cx="26" cy="34" r="4" strokeOpacity={0.5} />
              <circle cx="40" cy="44" r="5" strokeOpacity={0.5} />
              <circle cx="20" cy="44" r="3" strokeOpacity={0.5} />
              {/* the cut wedge, set aside */}
              <path d="M70 26 92 32 70 50 Z" fill={PAPER} />
              <path d="M70 26 92 32 70 50 Z" />
              <circle cx="76" cy="36" r="2.4" strokeOpacity={0.5} />
            </svg>
          </div>

          <p className="max-w-[18rem] text-[10px] italic leading-snug text-ink/70">
            Vous venez de lire une bande dessinée cachée dans une application de français. Reprenez,
            doucement, le cours de votre vie.
          </p>

          <div className="flex w-full items-end justify-between">
            <div className="text-left">
              <div className="flex h-7 items-end gap-[2px]">
                {[3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3].map((w, i) => (
                  <span key={i} className="block h-full bg-ink" style={{ width: w }} />
                ))}
              </div>
              <p className="mt-0.5 text-[7px] text-ink/50">3 3 3 3 · croâ croâ · ne pas avaler</p>
            </div>
            <div className="flex h-14 w-14 rotate-6 items-center justify-center rounded-full border-2 border-rouge/60 text-center text-[7px] font-bold uppercase leading-tight text-rouge/70">
              Approuvé par la fromagère
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[8px] uppercase tracking-[0.25em] text-ink/45">
            <FLogo className="h-4 w-4" />
            Florine Comics · Nº 1 · quatrième de couverture
          </p>
        </div>
      </>
    ),
  },
];
