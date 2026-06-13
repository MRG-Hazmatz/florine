/**
 * "La Complainte de la Grenouille" — Florine's hidden origin comic, presented
 * like a vintage comic book: a cryptic COVER, the story PANELS, then a
 * self-referential BACK COVER. Hand-drawn woodcut SVG (ink line on parchment).
 * The reusable <Frog> is drawn `solid` over scenes so it occludes whatever is
 * behind it; in single-SVG scenes, foreground shapes use opaque paper fills and
 * later paint order to occlude the silly background details.
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

/** Full-bleed ink scene inside the plate. */
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

/** The Florine "F" mark — the comic house's production logo (back cover). */
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

export const COMIC_PANELS: ComicPanel[] = [
  /* ===================== COVER ===================== */
  {
    id: "cover",
    kind: "cover",
    art: (
      <>
        <Scene>
          <Rays opacity={0.12} />
          {/* the tower, cryptic, on the right */}
          <rect x="320" y="40" width="34" height="200" fill={PAPER} />
          <rect x="320" y="40" width="34" height="200" />
          <path d="M320 40h8v-10h8v10h8v-10h8v10h2" />
          <rect x="330" y="80" width="14" height="20" rx="7" fill="currentColor" fillOpacity={0.18} />
          {/* a few cryptic bars on the left */}
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
        {/* --- silly bedroom background --- */}
        <line x1="0" y1="232" x2="400" y2="232" strokeOpacity={0.25} />
        {/* crooked picture frame with a scribble */}
        <g transform="rotate(-7 70 70)">
          <rect x="44" y="44" width="52" height="42" fill={PAPER} />
          <rect x="44" y="44" width="52" height="42" strokeOpacity={0.55} />
          <path d="M52 74c6-12 12-12 18 0s12 8 18-2" strokeOpacity={0.4} />
        </g>
        {/* "I ♥ KETCHUP" poster */}
        <g transform="rotate(5 320 70)">
          <rect x="280" y="44" width="80" height="50" fill={PAPER} />
          <rect x="280" y="44" width="80" height="50" strokeOpacity={0.55} />
          <text x="320" y="62" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" fillOpacity={0.6} className="font-display">J'AIME LE</text>
          <path d="M312 74c-4-5-12-1-12 4 0 5 12 11 12 11s12-6 12-11c0-5-8-9-12-4z" strokeOpacity={0.55} />
          <text x="332" y="86" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fillOpacity={0.6} className="font-display">KETCHUP</text>
        </g>
        {/* cactus "Kevin" in a pot */}
        <g transform="translate(352 170)">
          <path d="M0 60V24a8 8 0 0116 0v36" fill={PAPER} />
          <path d="M0 60V24a8 8 0 0116 0v36M0 40c-8 0-10-6-10-12M16 44c8 0 10-6 10-14" strokeOpacity={0.5} />
          <path d="M-14 60h44l-4 18h-36z" fill={PAPER} />
          <path d="M-14 60h44l-4 18h-36z" strokeOpacity={0.5} />
        </g>
        {/* --- the smug human, foreground (opaque) --- */}
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
        {/* restaurant background: chandelier + wainscot line */}
        <path d="M200 16v14M186 30h28M190 30c-2 8-2 12 0 16M210 30c2 8 2 12 0 16M200 30c0 8 0 12 0 18" strokeOpacity={0.3} />
        <line x1="0" y1="60" x2="400" y2="60" strokeOpacity={0.18} />
        <line x1="40" y1="232" x2="360" y2="232" strokeOpacity={0.4} />
        {/* wine bottle (opaque) */}
        <path d="M120 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22v82z" fill={PAPER} />
        <path d="M120 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22" />
        {/* glass (opaque) */}
        <path d="M150 168c0 16 10 22 18 22s18-6 18-22z" fill={PAPER} />
        <path d="M150 168c0 16 10 22 18 22s18-6 18-22zM168 190v34m-12 8h24" />
        <path d="M154 168c0 12 6 17 14 17s14-5 14-17z" fill="currentColor" fillOpacity={0.16} stroke="none" />
        {/* plate + duck + ketchup squirt */}
        <ellipse cx="232" cy="226" rx="38" ry="9" fill={PAPER} />
        <ellipse cx="232" cy="226" rx="38" ry="9" />
        <path d="M214 224c4-12 36-12 38 0z" fill="currentColor" fillOpacity={0.12} />
        <rect x="246" y="150" width="26" height="46" rx="6" fill={PAPER} />
        <rect x="246" y="150" width="26" height="46" rx="6" />
        <rect x="253" y="142" width="12" height="10" rx="2" />
        <path d="M259 196c-4 8-14 18-22 24" stroke="var(--color-rouge)" strokeOpacity={0.7} />
        {/* horrified sommelier, sweating */}
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
        {/* the wizard's tall tower looming through the window, with silly details */}
        <rect x="300" y="20" width="44" height="150" fill={PAPER} />
        <rect x="300" y="20" width="44" height="150" />
        <path d="M300 20h10v-9h8v9h8v-9h8v9h2" />
        <path d="M322 11V2l10 4-10 3" strokeOpacity={0.6} />{/* flag */}
        <circle cx="322" cy="56" r="9" strokeOpacity={0.5} />{/* clock */}
        <path d="M322 56v-5M322 56l4 2" strokeOpacity={0.5} />
        <path d="M300 120c-6 6-6 14-2 22M344 110c6 6 6 16 0 24" strokeOpacity={0.35} />{/* ivy */}
        {/* café awning (striped) */}
        <path d="M0 70h150l-10 22H10z" fill="currentColor" fillOpacity={0.08} />
        <path d="M0 70h150l-10 22H10z" />
        {[28, 56, 84, 112].map((x) => (
          <line key={x} x1={x} y1={70} x2={x - 8} y2={92} strokeOpacity={0.4} />
        ))}
        <line x1="0" y1="244" x2="400" y2="244" strokeOpacity={0.35} />
        {/* the wizard at his table, eyebrow raised */}
        <path d="M250 244c2-30 16-40 22-40s20 10 22 40z" fill={PAPER} />
        <path d="M250 244c2-30 16-40 22-40s20 10 22 40" />
        <circle cx="272" cy="176" r="18" fill={PAPER} />
        <circle cx="272" cy="176" r="18" />
        <path d="M250 168c2-30 44-30 44 0z" fill="currentColor" fillOpacity={0.16} />
        <path d="M250 168c2-30 44-30 44 0" />{/* pointy hat */}
        <path d="M264 174c2-3 6-3 8-1" />{/* raised eyebrow */}
        <circle cx="266" cy="180" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="279" cy="180" r="1.8" fill="currentColor" stroke="none" />
        <path d="M268 192c4 1 8 1 10-1" />
        <path d="M266 200c2 14 1 30-2 44" strokeOpacity={0.4} />{/* beard */}
        {/* the creator at his table with coffee + croissant, saying kwa-sont */}
        <circle cx="120" cy="184" r="16" fill={PAPER} />
        <circle cx="120" cy="184" r="16" />
        <path d="M100 244c2-26 14-34 20-34s18 8 20 34z" fill={PAPER} />
        <path d="M100 244c2-26 14-34 20-34s18 8 20 34" />
        <circle cx="114" cy="184" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="126" cy="184" r="1.8" fill="currentColor" stroke="none" />
        <path d="M114 192q6 4 12 0" />
        {/* coffee cup + croissant on a small table */}
        <path d="M150 226h40M158 210h20a6 6 0 010 12h-20z" fill={PAPER} />
        <path d="M158 210h20a6 6 0 010 12h-20zM178 212c6 0 6 8 0 8" />
        <path d="M196 218c-6-4-6-8 0-10 4 6 12 6 14 0 6 2 6 6 0 10z" fill={PAPER} />
        <path d="M196 218c-6-4-6-8 0-10 4 6 12 6 14 0 6 2 6 6 0 10z" />
        {/* speech bubble: kwa-sont? */}
        <path d="M70 150h60v26H96l-10 10v-10H70z" fill={PAPER} />
        <path d="M70 150h60v26H96l-10 10v-10H70z" />
        <text x="100" y="167" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">« kwa-sont ? »</text>
      </Scene>
    ),
    fr: "Le lendemain, dans un café qu'un certain sorcier fréquentait, il réclama « un grand café américain » et un « kwa-sont ». Le sorcier leva un sourcil. Puis il vit la tenue : chaussettes, sandales, banane à la ceinture. Ce fut l'erreur de trop.",
    en: "Next morning, at a café a certain wizard frequented, he ordered 'a big American coffee' and a «kwa-sont». The wizard raised an eyebrow — then took in the outfit: socks, sandals, a bumbag. That was the final straw.",
  },
  {
    id: "curse",
    kind: "story",
    title: "Chapitre IV — Le Sortilège",
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
          {/* wand zapping in from the corner */}
          <path d="M356 40l-44 44" strokeOpacity={0.7} strokeWidth={3} />
          <path d="M312 84l6 2-2 6-6-2z" fill="currentColor" stroke="none" />
          {/* the discarded sandal + bumbag */}
          <path d="M86 224h28l-4 10H90zM96 224v-6h8v6" strokeOpacity={0.6} />
          <path d="M300 86l1 5 5 1-5 1-1 5-1-5-5-1 5-1zM104 70l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog solid className="h-28 w-28 text-ink" />
        </div>
      </>
    ),
    fr: "« Pour ce crime contre le bon goût, dit le sorcier, tu seras grenouille — jusqu'à ce que tu fasses aimer le français au monde. » Excessif. Mais réversible, paraît-il. Enfin… « paraît-il ».",
    en: "'For this crime against good taste,' said the wizard, 'a frog you shall be — until you make the world love French.' Excessive. But reversible, apparently. Well — 'apparently.'",
  },
  {
    id: "terms",
    kind: "story",
    title: "Chapitre V — Les Conditions",
    art: (
      <Scene>
        {/* ornate double-bordered scroll */}
        <path d="M88 56c-16 0-16 20 0 20M312 56c16 0 16 20 0 20" fill={PAPER} />
        <rect x="88" y="56" width="224" height="190" fill={PAPER} />
        <rect x="88" y="56" width="224" height="190" />
        <rect x="98" y="66" width="204" height="170" strokeOpacity={0.4} />
        <path d="M88 56c-16 0-16 20 0 20M312 56c16 0 16 20 0 20" />
        <path d="M88 246c-16 0-16 20 0 20M312 246c16 0 16 20 0 20" />
        {/* corner flourishes */}
        <path d="M104 72c8 0 8 8 0 8M296 72c-8 0-8 8 0 8M104 230c8 0 8-8 0-8M296 230c-8 0-8-8 0-8" strokeOpacity={0.4} />
        {/* clause 1: a book (teach French) + varying small-print lines */}
        <path d="M120 100c10-6 22-6 30 0v22c-8-6-20-6-30 0zM150 100c8-6 20-6 30 0v22c-10-6-22-6-30 0z" />
        <line x1="196" y1="104" x2="296" y2="104" strokeOpacity={0.32} />
        <line x1="196" y1="114" x2="262" y2="114" strokeOpacity={0.26} />
        <line x1="196" y1="124" x2="284" y2="124" strokeOpacity={0.22} />
        {/* clause 2: a little sun/joy + lines */}
        <circle cx="135" cy="170" r="11" strokeOpacity={0.7} />
        <path d="M135 152v-6M135 194v-6M113 170h-6M163 170h-6M120 155l-4-4M150 155l4-4" strokeOpacity={0.5} />
        <path d="M130 170q5 5 10 0" strokeOpacity={0.7} />
        <line x1="196" y1="160" x2="296" y2="160" strokeOpacity={0.32} />
        <line x1="196" y1="170" x2="256" y2="170" strokeOpacity={0.26} />
        <line x1="196" y1="180" x2="288" y2="180" strokeOpacity={0.22} />
        {/* the small-print conditional line */}
        <line x1="118" y1="210" x2="282" y2="210" strokeOpacity={0.2} />
        <line x1="118" y1="218" x2="240" y2="218" strokeOpacity={0.18} />
        {/* wax seal with a frog stamp */}
        <circle cx="258" cy="224" r="16" fill="var(--color-rouge)" fillOpacity={0.18} />
        <circle cx="258" cy="224" r="16" stroke="var(--color-rouge)" strokeOpacity={0.5} />
        <circle cx="253" cy="221" r="2" fill="currentColor" stroke="none" />
        <circle cx="263" cy="221" r="2" fill="currentColor" stroke="none" />
        <path d="M251 228q7 5 14 0" />
      </Scene>
    ),
    fr: "Le contrat tenait en une ligne, écrite tout petit : enseigner le français, transmettre la joie de l'être — et alors, peut-être, redevenir humain. « Peut-être » est le mot préféré des sorciers.",
    en: "The contract fit on one line, in very fine print: teach French, pass on the joy of being French — and then, perhaps, turn human again. 'Perhaps' is a wizard's favourite word.",
  },
  {
    id: "flaw",
    kind: "story",
    title: "Chapitre VI — Le Plan « Génial »",
    art: (
      <Scene>
        {/* idea bulb */}
        <circle cx="80" cy="58" r="18" fill="currentColor" fillOpacity={0.12} />
        <path d="M73 73h14M75 79h10M80 40v-8M60 50l-5-4M100 50l5-4" strokeOpacity={0.7} />
        {/* box 1 */}
        <rect x="34" y="120" width="120" height="50" rx="4" fill={PAPER} />
        <rect x="34" y="120" width="120" height="50" rx="4" />
        <text x="94" y="140" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">TRANSMETTRE</text>
        <text x="94" y="157" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">LA JOIE</text>
        {/* arrow */}
        <path d="M158 145h40m-10-7 10 7-10 7" />
        {/* box 2 */}
        <rect x="214" y="120" width="150" height="50" rx="4" fill={PAPER} />
        <rect x="214" y="120" width="150" height="50" rx="4" />
        <text x="289" y="140" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" className="font-display">« ENRÔLER »</text>
        <text x="289" y="156" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" className="font-display">(= ENLEVER 20 GENS)</text>
        {/* red X + circle over box 2 */}
        <path d="M222 116l134 58m0-58-134 58" stroke="var(--color-rouge)" strokeWidth={3} strokeOpacity={0.8} />
        <circle cx="289" cy="145" r="84" stroke="var(--color-rouge)" strokeOpacity={0.5} strokeWidth={2} />
        {/* a giant hand/net grabbing little stick people below */}
        <path d="M150 250c10-14 40-14 50 0" strokeOpacity={0.5} />
        {[120, 175, 230].map((x, k) => (
          <g key={x} strokeOpacity={0.55}>
            <circle cx={x} cy={236 + k * 0} r="5" />
            <path d={`M${x} 241v14M${x - 7} 248h14M${x - 5} 268l5-8 5 8`} />
          </g>
        ))}
        <path d="M250 232c14-2 26 6 30 18" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "« Pour transmettre la joie, se dit la grenouille, j'enrôlerai des professeurs ! » Le verbe « enrôler » faisait, hélas, énormément de travail dans cette phrase.",
    en: "'To pass on the joy,' the frog reasoned, 'I'll recruit some teachers!' The verb 'recruit' was, regrettably, doing an enormous amount of heavy lifting in that sentence.",
  },
  {
    id: "strangers",
    kind: "story",
    title: "Chapitre VII — La Main-d'œuvre",
    art: (
      <>
        {/* a BIG cell: faces behind thick bars, taller */}
        <div className="absolute inset-x-3 top-2 h-[64%] overflow-hidden border-[3px] border-ink bg-ink/80">
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
        {/* distress sign */}
        <div className="absolute left-6 top-[58%] -rotate-3 border border-ink/70 bg-card px-1 text-[8px] font-bold uppercase text-ink/80">
          au secours
        </div>
        {/* the warden frog — BIG, smug, directly in front of the cell */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <Frog solid className="h-24 w-24 text-ink drop-shadow-[2px_2px_0_rgba(23,18,12,0.45)]" />
        </div>
        {/* warden's key, oversized */}
        <svg viewBox="0 0 40 40" className="absolute bottom-4 right-6 h-9 w-9 text-ink" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="12" cy="14" r="7" />
          <path d="M17 18l16 16m-6 0 6-6m-12 0 5 5" />
        </svg>
      </>
    ),
    fr: "Elle captura donc vingt inconnus et les fit enseigner. Transmettre la joie en privant des gens de la leur : un plan sans faille — à part la faille. La grenouille pose fièrement devant son œuvre.",
    en: "So it captured twenty strangers and made them teach. Spreading joy by depriving people of theirs: a flawless plan, save for the flaw. The frog poses very proudly in front of its work.",
  },
  {
    id: "audit",
    kind: "story",
    title: "Chapitre VIII — L'Audit",
    art: (
      <>
        <Scene>
          {/* clipboard */}
          <rect x="40" y="52" width="150" height="200" rx="6" fill={PAPER} />
          <rect x="40" y="52" width="150" height="200" rx="6" />
          <rect x="88" y="42" width="54" height="20" rx="5" fill="currentColor" fillOpacity={0.18} />
          {/* title bar */}
          <line x1="56" y1="78" x2="174" y2="78" strokeWidth={3} strokeOpacity={0.5} />
          <text x="115" y="74" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">AUDIT</text>
          {/* check + cross + lines */}
          <path d="M58 100l8 8 14-16" strokeWidth={2.5} />
          <line x1="92" y1="100" x2="176" y2="100" strokeOpacity={0.3} />
          <path d="M58 134l16 16m0-16-16 16" stroke="var(--color-rouge)" strokeWidth={2.5} strokeOpacity={0.85} />
          <line x1="92" y1="142" x2="176" y2="142" strokeOpacity={0.3} />
          <line x1="58" y1="176" x2="176" y2="176" strokeOpacity={0.25} />
          <line x1="58" y1="192" x2="150" y2="192" strokeOpacity={0.25} />
          <line x1="58" y1="208" x2="166" y2="208" strokeOpacity={0.25} />
          {/* pencil */}
          <path d="M150 226l40-40 8 8-40 40-10 2z" fill={PAPER} />
          <path d="M150 226l40-40 8 8-40 40-10 2zM184 192l8 8" />
          {/* red 'À REVOIR' stamp */}
          <g transform="rotate(-12 120 232)">
            <rect x="78" y="222" width="84" height="22" rx="3" stroke="var(--color-rouge)" strokeOpacity={0.7} />
            <text x="120" y="237" textAnchor="middle" fontSize="11" fill="var(--color-rouge)" fillOpacity={0.8} stroke="none" className="font-display">À REVOIR</text>
          </g>
        </Scene>
        {/* Kim, the inspector — bigger */}
        <div className="absolute bottom-2 right-3 text-center">
          <div className="h-28 w-28 overflow-hidden border-2 border-ink bg-parchment shadow-[3px_3px_0_rgba(23,18,12,0.4)]">
            <img src={strangerUrl(2)} alt="" className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <p className="mt-0.5 text-[9px] uppercase tracking-widest text-ink/60">Kim · l'inspectrice</p>
        </div>
      </>
    ),
    fr: "Kim, elle, s'était portée volontaire. Clipboard en main, elle nota que kidnapper des bénévoles est, mathématiquement, un paradoxe. La grenouille promit d'« y revenir ». (Voir : jamais.)",
    en: "Kim had volunteered. Clipboard in hand, she noted that kidnapping volunteers is, mathematically, a paradox. The frog said it would 'circle back.' (See: never.)",
  },
  {
    id: "precedents",
    kind: "story",
    title: "Chapitre IX — Les Précédents",
    art: (
      <Scene>
        {/* a proper little rat (Ratatouille nod), facing right */}
        <ellipse cx="120" cy="196" rx="46" ry="28" fill={PAPER} />
        <ellipse cx="120" cy="196" rx="46" ry="28" />
        {/* head */}
        <circle cx="78" cy="184" r="20" fill={PAPER} />
        <circle cx="78" cy="184" r="20" />
        {/* round ears */}
        <circle cx="68" cy="166" r="9" fill={PAPER} />
        <circle cx="68" cy="166" r="9" />
        <circle cx="86" cy="164" r="9" fill={PAPER} />
        <circle cx="86" cy="164" r="9" />
        {/* pointed snout + nose + whiskers */}
        <path d="M58 186c-12 1-18 5-22 10" />
        <circle cx="36" cy="196" r="2.6" fill="currentColor" stroke="none" />
        <path d="M40 200c-10 2-16 5-22 4M40 204c-10 4-16 8-22 9" strokeOpacity={0.5} />
        <circle cx="72" cy="182" r="2" fill="currentColor" stroke="none" />
        {/* curvy tail */}
        <path d="M166 200c18 4 28-2 30-16 1-8-8-12-12-4" strokeOpacity={0.7} />
        {/* chef toque */}
        <path d="M60 162c-3-14 36-14 33 0 7-2 11 7 4 10H56c-7-3-3-12 4-10z" fill={PAPER} />
        <path d="M60 162c-3-14 36-14 33 0 7-2 11 7 4 10H56c-7-3-3-12 4-10z" />
        {/* the magic-potion cauldron (Astérix nod) */}
        <path d="M252 200c0 26 22 40 44 40s44-14 44-40z" fill={PAPER} />
        <path d="M252 200c0 26 22 40 44 40s44-14 44-40z" />
        <ellipse cx="296" cy="200" rx="44" ry="12" fill="currentColor" fillOpacity={0.1} />
        <ellipse cx="296" cy="200" rx="44" ry="12" />
        <path d="M278 196c4-6 10-6 14 0M302 196c4-6 10-6 14 0" strokeOpacity={0.5} />
        <circle cx="286" cy="176" r="5" strokeOpacity={0.6} />
        <circle cx="306" cy="168" r="4" strokeOpacity={0.6} />
        <circle cx="296" cy="158" r="3" strokeOpacity={0.6} />
        <path d="M248 214l-8 6M344 214l8 6" />
        {/* a small "?" between them */}
        <path d="M196 150c0-9 14-9 14 0 0 6-7 6-7 12M203 174h.02" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "Un rat avait déjà prouvé que n'importe qui peut cuisiner. La grenouille en conclut que n'importe qui peut « franciser ». Pour le subjonctif, hélas, aucune potion magique — même Astérix a séché.",
    en: "A rat had already proven anyone can cook. The frog concluded anyone can French. For the subjunctive, alas, no magic potion exists — even Astérix came up dry.",
  },
  {
    id: "treasure",
    kind: "story",
    title: "Chapitre X — Le Trésor",
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
    fr: "Au bout du chemin, un trésor que la grenouille ne peut posséder seule : la joie d'être français. Plus on la partage, plus elle grandit. (Agaçant. Mais c'est ainsi.)",
    en: "At the path's end, a treasure the frog cannot hoard alone — la joie d'être français. The more it's shared, the more it grows. (Annoying. But there it is.)",
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
          {/* hopeful little "?" + shrug marks */}
          <path d="M118 132c-10-6-18-4-22 4M262 132c10-6 18-4 22 4" strokeOpacity={0.4} />
          <path d="M196 96c0-8 12-8 12 0 0 5-6 5-6 10M202 114h.02" strokeOpacity={0.45} />
        </Scene>
        <div className="absolute inset-0 flex items-end justify-center pb-5">
          <Frog solid className="h-32 w-32 text-ink" />
        </div>
      </>
    ),
    fr: "Alors elle vous guide. Si un jour assez de gens ressentent cette joie, la grenouille redeviendra humaine. En attendant — comme Piaf — elle ne regrette rien. Et qui veut vraiment être français ? Et pourtant : nous voilà. Croâ.",
    en: "So it guides you. If enough people one day feel that joy, the frog turns human again. Until then — like Piaf — it regrets nothing. And who even wants to be French? And yet: here we all are. Croâ.",
  },

  /* ===================== BACK COVER ===================== */
  {
    id: "backcover",
    kind: "back",
    art: (
      <>
        <Scene>
          {/* a cheese wheel — Kim's domain — as the back-cover motif */}
          <circle cx="200" cy="150" r="74" fill="currentColor" fillOpacity={0.06} />
          <circle cx="200" cy="150" r="74" strokeOpacity={0.18} />
          <circle cx="200" cy="150" r="60" strokeOpacity={0.14} />
          {/* a cut wedge lifted out */}
          <path d="M200 150l64-30a72 72 0 00-30-30z" fill={PAPER} />
          <path d="M200 150l64-30M200 150l4-46" strokeOpacity={0.2} />
          {/* holes */}
          <circle cx="180" cy="140" r="6" strokeOpacity={0.18} />
          <circle cx="206" cy="168" r="8" strokeOpacity={0.18} />
          <circle cx="168" cy="166" r="4" strokeOpacity={0.18} />
        </Scene>
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 text-center">
          <p className="font-display text-3xl font-bold uppercase tracking-widest text-ink/80">Fin.</p>
          <div className="-rotate-1 border-2 border-ink bg-card px-3 py-1.5 shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
            <p className="font-display text-[11px] font-bold uppercase text-rouge">Apprenez le français !</p>
            <p className="text-[9px] text-ink/70">Résultats non garantis. Effet secondaire : un léger accent.</p>
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
            {/* the Florine "F" — the comic house's production stamp */}
            <div className="flex flex-col items-center">
              <FLogo className="h-10 w-10" />
              <p className="mt-0.5 text-[7px] uppercase tracking-wide text-ink/50">une production Florine</p>
            </div>
          </div>
          <p className="text-[8px] uppercase tracking-[0.3em] text-ink/45">
            Florine Comics · Nº 1 · quatrième de couverture
          </p>
        </div>
      </>
    ),
  },
];
