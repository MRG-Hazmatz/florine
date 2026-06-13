/**
 * "La Complainte de la Grenouille" — Florine's hidden origin comic, presented
 * like a vintage comic book: a cryptic COVER, the story PANELS, then a
 * self-referential BACK COVER. Each scene is hand-drawn woodcut SVG (ink line
 * on parchment); the reusable <Frog> is drawn `solid` over scenes so it
 * occludes whatever is behind it (no horizons crossing its belly).
 *
 * A finished PNG could replace any panel's `art` later with no engine change.
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
          <rect x="320" y="40" width="34" height="200" fill="var(--color-parchment)" />
          <rect x="320" y="40" width="34" height="200" />
          <path d="M320 40h8v-10h8v10h8v-10h8v10h2" />
          <rect x="330" y="80" width="14" height="20" rx="7" fill="currentColor" fillOpacity={0.18} />
          {/* a few cryptic bars on the left */}
          {[34, 52, 70].map((x) => (
            <line key={x} x1={x} y1={150} x2={x} y2={250} strokeOpacity={0.4} strokeWidth={3} />
          ))}
        </Scene>
        {/* hero frog */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog solid className="h-40 w-40 text-ink drop-shadow-[3px_3px_0_rgba(23,18,12,0.3)]" />
        </div>
        {/* masthead */}
        <div className="absolute left-2 top-2 border-2 border-ink bg-ink px-2 py-0.5">
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-parchment">
            Florine Comics
          </span>
        </div>
        {/* price / issue corner */}
        <div className="absolute right-2 top-2 -rotate-6 border-2 border-ink bg-card px-2 py-0.5 text-center">
          <p className="font-display text-[10px] font-bold text-ink">Nº 1</p>
          <p className="text-[8px] text-ink/70">3 mouches</p>
        </div>
        {/* title */}
        <div className="absolute inset-x-0 top-7 text-center">
          <p className="font-display text-base font-bold uppercase leading-none tracking-wide text-rouge drop-shadow-[1px_1px_0_rgba(242,235,216,0.8)]">
            La Complainte
            <br />
            de la Grenouille
          </p>
        </div>
        {/* blurb banner */}
        <div className="absolute inset-x-3 bottom-2 -rotate-1 border-2 border-ink bg-card px-2 py-1 text-center shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wide text-ink">
            « L'origine que personne n'a demandée ! »
          </p>
        </div>
        {/* comics-code-style stamp */}
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
        {/* ground shadow first (behind) */}
        <ellipse cx="170" cy="262" rx="78" ry="16" fill="currentColor" fillOpacity={0.06} stroke="none" />
        {/* torso — opaque, so nothing shows through */}
        <path
          d="M120 264c2-46 18-64 50-64s48 18 50 64z"
          fill="var(--color-parchment)"
        />
        <path d="M120 264c2-46 18-64 50-64s48 18 50 64" />
        {/* head — opaque, drawn on top (no floating neck) */}
        <circle cx="170" cy="150" r="44" fill="var(--color-parchment)" />
        <circle cx="170" cy="150" r="44" />
        {/* beret, askew */}
        <path d="M126 134c6-16 72-22 88-3 3 4-4 8-12 8H138c-9 0-15-1-12-5z" fill="currentColor" fillOpacity={0.14} />
        <circle cx="216" cy="128" r="3.5" fill="currentColor" stroke="none" />
        {/* smug closed eyes, nose up, smirk */}
        <path d="M150 150c4-3 9-3 12 0M180 150c4-3 9-3 12 0" />
        <path d="M188 160c7 2 10 6 4 10" />
        <path d="M156 176c8 5 18 5 26 0" />
        {/* ketchup bottle, dripping */}
        <rect x="296" y="150" width="34" height="72" rx="8" fill="var(--color-parchment)" />
        <rect x="296" y="150" width="34" height="72" rx="8" />
        <rect x="306" y="138" width="14" height="14" rx="3" fill="var(--color-parchment)" />
        <rect x="306" y="138" width="14" height="14" rx="3" />
        <path d="M304 232c1 7 1 12 4 16m10-16c0 5 0 9 2 13m8-13c1 4 1 8 3 11" strokeOpacity={0.5} />
      </Scene>
    ),
    fr: "Il était une fois un humain : arrogant, insupportable et — pire que tout — insuffisamment français.",
    en: "Once, the frog was a man: arrogant, unbearable, and — worst of all — insufficiently French. Ketchup on everything; said croissant «kwa-sont».",
  },
  {
    id: "crime",
    kind: "story",
    title: "Chapitre I bis — Le Crime",
    art: (
      <Scene>
        {/* table line */}
        <line x1="40" y1="232" x2="360" y2="232" strokeOpacity={0.4} />
        {/* wine bottle (opaque) */}
        <path d="M150 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22v82z" fill="var(--color-parchment)" />
        <path d="M150 232V150c0-8-8-10-8-22v-16h16v16c0 12-8 14-8 22" />
        {/* glass (opaque) */}
        <path d="M196 168c0 16 10 22 18 22s18-6 18-22z" fill="var(--color-parchment)" />
        <path d="M196 168c0 16 10 22 18 22s18-6 18-22zM214 190v34m-12 8h24" />
        <path d="M200 168c0 12 6 17 14 17s14-5 14-17z" fill="currentColor" fillOpacity={0.16} stroke="none" />
        {/* horrified sommelier bust, sweating */}
        <circle cx="300" cy="150" r="22" fill="var(--color-parchment)" />
        <circle cx="300" cy="150" r="22" />
        <path d="M286 200c2-22 12-30 14-30s12 8 14 30z" fill="var(--color-parchment)" />
        <path d="M286 200c2-22 12-30 14-30s12 8 14 30" />
        <circle cx="293" cy="148" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="307" cy="148" r="2.2" fill="currentColor" stroke="none" />
        <path d="M294 160c4 4 8 0 0 0M296 162q4 3 8 0" />
        <path d="M322 140c3 4 3 8 0 11" strokeOpacity={0.5} />
        {/* big question marks */}
        <path d="M120 120c0-10 16-10 16 0 0 7-8 7-8 14M128 146h.02" strokeOpacity={0.5} />
      </Scene>
    ),
    fr: "Un soir, dans un grand restaurant, il commanda « un vin. N'importe lequel. » À voix haute. En France.",
    en: "One evening, in a fine restaurant, he ordered 'a wine — any wine.' Out loud. In France. The sommelier is still in therapy.",
  },
  {
    id: "tower",
    kind: "story",
    title: "Chapitre II — La Tour",
    art: (
      <Scene>
        <circle cx="320" cy="76" r="42" fill="currentColor" fillOpacity={0.08} />
        <circle cx="306" cy="66" r="6" strokeOpacity={0.3} />
        <circle cx="332" cy="88" r="4" strokeOpacity={0.3} />
        {/* tower — opaque so the moon doesn't bleed through */}
        <rect x="150" y="44" width="60" height="248" fill="var(--color-parchment)" />
        <rect x="150" y="44" width="60" height="248" />
        <path d="M150 44h10v-12h10v12h10v-12h10v12h10v-12h10v12" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={150} y1={74 + i * 30} x2={210} y2={74 + i * 30} strokeOpacity={0.22} />
        ))}
        <rect x="168" y="98" width="24" height="34" rx="12" fill="currentColor" fillOpacity={0.18} />
        <path d="M180 106l-7 22h14z" fill="currentColor" stroke="none" />
        <circle cx="180" cy="102" r="4" fill="currentColor" stroke="none" />
        <line x1="20" y1="292" x2="380" y2="292" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "Au sommet d'une tour très, très haute vivait un sorcier qui jugeait les accents. C'était son seul passe-temps.",
    en: "Atop a very tall tower lived a wizard who judged people's French. Wizards, having solved their own problems centuries ago, mostly review other people's vowels now.",
  },
  {
    id: "curse",
    kind: "story",
    title: "Chapitre III — Le Sortilège",
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
          {/* the discarded beret, the man gone */}
          <path d="M92 64c6-10 42-13 52-2 3 3-2 6-8 6H98c-6 0-9-1-6-4z" strokeOpacity={0.6} />
          <path d="M300 86l1 5 5 1-5 1-1 5-1-5-5-1 5-1zM108 212l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog solid className="h-28 w-28 text-ink" />
        </div>
      </>
    ),
    fr: "« Pour ton impertinence, dit-il, tu seras grenouille. » Ce fut, avouons-le, légèrement excessif.",
    en: "'For your impertinence,' he said, 'a frog you shall be.' A slight overreaction, frankly. Wizards lack an HR department.",
  },
  {
    id: "terms",
    kind: "story",
    title: "Chapitre IV — Les Conditions",
    art: (
      <Scene>
        <path d="M96 60c-14 0-14 18 0 18M304 60c14 0 14 18 0 18" fill="var(--color-parchment)" />
        <rect x="96" y="60" width="208" height="180" fill="var(--color-parchment)" />
        <rect x="96" y="60" width="208" height="180" stroke="none" />
        <path d="M96 60c-14 0-14 18 0 18M304 60c14 0 14 18 0 18" />
        <line x1="96" y1="78" x2="96" y2="240" />
        <line x1="304" y1="78" x2="304" y2="240" />
        <path d="M96 240c-14 0-14 18 0 18M304 240c14 0 14 18 0 18" />
        <path d="M118 108l10 10 18-20" strokeWidth={3} />
        <line x1="158" y1="110" x2="280" y2="110" strokeOpacity={0.3} />
        <line x1="158" y1="124" x2="250" y2="124" strokeOpacity={0.25} />
        <path d="M132 168c-8-9-22-2-22 8 0 9 22 22 22 22s22-13 22-22c0-10-14-17-22-8z" />
        <line x1="170" y1="176" x2="280" y2="176" strokeOpacity={0.3} />
        <line x1="170" y1="190" x2="250" y2="190" strokeOpacity={0.25} />
        <circle cx="250" cy="222" r="13" fill="currentColor" fillOpacity={0.14} />
      </Scene>
    ),
    fr: "La malédiction avait deux clauses : apprendre le français, et accomplir de bonnes actions. Rien de bien sorcier.",
    en: "The curse came with two terms: learn French, and do good deeds. Simple. Lawyers were, regrettably, involved.",
  },
  {
    id: "flaw",
    kind: "story",
    title: "Chapitre V — Le Plan « Génial »",
    art: (
      <Scene>
        {/* lightbulb idea */}
        <circle cx="200" cy="70" r="20" fill="currentColor" fillOpacity={0.12} />
        <path d="M192 86h16M194 92h12M200 50v-8M178 60l-5-4M222 60l5-4" strokeOpacity={0.7} />
        {/* box 1 */}
        <rect x="44" y="150" width="120" height="46" rx="4" fill="var(--color-parchment)" />
        <rect x="44" y="150" width="120" height="46" rx="4" />
        <text x="104" y="170" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" className="font-display">BONNE</text>
        <text x="104" y="187" textAnchor="middle" fontSize="13" fill="currentColor" stroke="none" className="font-display">ACTION</text>
        {/* arrow */}
        <path d="M168 173h44m-10-7 10 7-10 7" />
        {/* box 2 */}
        <rect x="224" y="150" width="132" height="46" rx="4" fill="var(--color-parchment)" />
        <rect x="224" y="150" width="132" height="46" rx="4" />
        <text x="290" y="170" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">ENLEVER</text>
        <text x="290" y="187" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none" className="font-display">20 GENS ?!</text>
        {/* big red X stamp over box 2 */}
        <path d="M232 146l116 54m0-54-116 54" stroke="var(--color-rouge)" strokeWidth={3} strokeOpacity={0.8} />
        <circle cx="290" cy="173" r="74" stroke="var(--color-rouge)" strokeOpacity={0.6} strokeWidth={2} />
      </Scene>
    ),
    fr: "« Pour faire le bien, se dit la grenouille, j'enseignerai le français au monde ! » Idée noble. Exécution… discutable.",
    en: "'To do good,' the frog reasoned, 'I shall teach the whole world French!' A noble idea — which it then ruined immediately, and with great confidence.",
  },
  {
    id: "strangers",
    kind: "story",
    title: "Chapitre VI — La Main-d'œuvre",
    art: (
      <>
        {/* the cell: faces in a bordered box up top */}
        <div className="absolute inset-x-5 top-3 h-[56%] overflow-hidden border-2 border-ink bg-ink/80">
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
          {/* vertical bars across the cell */}
          <div className="pointer-events-none absolute inset-0 flex justify-between px-2 py-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="block w-[3px] bg-ink" />
            ))}
          </div>
        </div>
        {/* tiny distress sign poking out */}
        <div className="absolute left-7 top-[50%] -rotate-3 border border-ink/70 bg-card px-1 text-[8px] font-bold uppercase text-ink/80">
          au secours
        </div>
        {/* the warden frog, clearly in the foreground BELOW the cell */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <Frog solid className="h-16 w-16 text-ink drop-shadow-[1px_1px_0_rgba(23,18,12,0.4)]" />
        </div>
        {/* warden's key */}
        <svg viewBox="0 0 40 40" className="absolute bottom-3 right-8 h-7 w-7 text-ink" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <circle cx="12" cy="14" r="7" />
          <path d="M17 18l16 16m-6 0 6-6m-12 0 5 5" />
        </svg>
      </>
    ),
    fr: "Elle captura donc vingt inconnus et les fit enseigner. C'est, à toute lecture, exactement le contraire d'une bonne action.",
    en: "So it captured twenty strangers and made them teach. This is, by every possible reading, the precise opposite of a good deed. The frog has elected not to dwell on it.",
  },
  {
    id: "audit",
    kind: "story",
    title: "Chapitre VII — L'Audit",
    art: (
      <>
        <Scene>
          {/* clipboard */}
          <rect x="60" y="60" width="150" height="190" rx="6" fill="var(--color-parchment)" />
          <rect x="60" y="60" width="150" height="190" rx="6" />
          <rect x="108" y="50" width="54" height="20" rx="5" fill="currentColor" fillOpacity={0.18} />
          {/* checklist: one done, one big cross */}
          <path d="M78 100l8 8 14-16" strokeWidth={2.5} />
          <line x1="110" y1="100" x2="196" y2="100" strokeOpacity={0.3} />
          <path d="M78 150l18 18m0-18-18 18" stroke="var(--color-rouge)" strokeWidth={2.5} strokeOpacity={0.8} />
          <line x1="110" y1="158" x2="196" y2="158" strokeOpacity={0.3} />
          <line x1="78" y1="200" x2="196" y2="200" strokeOpacity={0.25} />
          <line x1="78" y1="216" x2="170" y2="216" strokeOpacity={0.25} />
        </Scene>
        {/* Kim, the inspector */}
        <div className="absolute bottom-3 right-5 text-center">
          <div className="h-20 w-20 overflow-hidden border-2 border-ink bg-parchment shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
            <img src={strangerUrl(2)} alt="" className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <p className="mt-0.5 text-[8px] uppercase tracking-widest text-ink/60">Kim · l'inspectrice</p>
        </div>
      </>
    ),
    fr: "Kim, elle, s'était portée volontaire. Elle fit remarquer que kidnapper des bénévoles est un paradoxe. La grenouille promit d'« y revenir ».",
    en: "Kim had volunteered. She pointed out — repeatedly, with a clipboard — that kidnapping volunteers is a contradiction in terms. The frog said it would 'circle back.' It has not.",
  },
  {
    id: "precedents",
    kind: "story",
    title: "Chapitre VIII — Les Précédents",
    art: (
      <Scene>
        {/* a rat with a toque (Ratatouille nod) */}
        <ellipse cx="120" cy="200" rx="40" ry="26" fill="var(--color-parchment)" />
        <ellipse cx="120" cy="200" rx="40" ry="26" />
        <circle cx="86" cy="188" r="16" fill="var(--color-parchment)" />
        <circle cx="86" cy="188" r="16" />
        <circle cx="80" cy="176" r="7" fill="var(--color-parchment)" />
        <circle cx="80" cy="176" r="7" />
        <circle cx="92" cy="176" r="7" fill="var(--color-parchment)" />
        <circle cx="92" cy="176" r="7" />
        <circle cx="83" cy="188" r="1.8" fill="currentColor" stroke="none" />
        <path d="M70 190c-8 1-14 4-18 9" />
        <path d="M158 214c14 4 22 2 30-6" />
        {/* toque */}
        <path d="M70 168c-2-12 30-12 30 0 6-2 10 6 4 9H66c-6-3-2-11 4-9z" fill="var(--color-parchment)" />
        <path d="M70 168c-2-12 30-12 30 0 6-2 10 6 4 9H66c-6-3-2-11 4-9z" />
        {/* a magic-potion cauldron (Astérix nod) */}
        <path d="M250 200c0 26 22 40 44 40s44-14 44-40z" fill="var(--color-parchment)" />
        <path d="M250 200c0 26 22 40 44 40s44-14 44-40z" />
        <ellipse cx="294" cy="200" rx="44" ry="12" />
        <path d="M276 196c4-6 10-6 14 0M300 196c4-6 10-6 14 0" strokeOpacity={0.5} />
        <circle cx="284" cy="176" r="5" strokeOpacity={0.6} />
        <circle cx="304" cy="170" r="4" strokeOpacity={0.6} />
        <circle cx="294" cy="160" r="3" strokeOpacity={0.6} />
        <path d="M246 214l-8 6M342 214l8 6" />
      </Scene>
    ),
    fr: "Un rat avait déjà prouvé que n'importe qui peut cuisiner. La grenouille décréta donc que n'importe qui peut « franciser ». Pour le subjonctif, hélas, aucune potion magique. (Elle a vérifié. Deux fois.)",
    en: "A rat had already proven anyone can cook. The frog, ever original, decreed anyone can French. As for the subjunctive — no magic potion exists. The frog checked. Twice. Even Astérix was out.",
  },
  {
    id: "treasure",
    kind: "story",
    title: "Chapitre IX — Le Trésor",
    art: (
      <>
        <Scene>
          <Rays cx={200} cy={168} n={16} len={150} opacity={0.12} />
          <rect x="150" y="168" width="100" height="62" rx="4" fill="var(--color-parchment)" />
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
    fr: "Au bout du chemin brille un trésor que la grenouille ne peut posséder seule : la joie d'être français.",
    en: "At the path's end glows a treasure the frog cannot hoard alone — la joie d'être français — the entire reason it must guide you to it. (Also: still cursed. Mostly it would just like company.)",
  },
  {
    id: "closer",
    kind: "story",
    title: "Et pourtant…",
    art: (
      <>
        <Scene>
          {/* a clearer little Eiffel, on the right, faint */}
          <path
            d="M348 250c4-18 8-30 12-46m12 46c-4-18-8-30-12-46m0 0c-2-14-2-26 0-40 2 14 2 26 0 40M352 220h16M349 236h22"
            strokeOpacity={0.22}
          />
          <path d="M356 250q4-6 8 0" strokeOpacity={0.22} />
          {/* horizon line, behind */}
          <line x1="20" y1="250" x2="380" y2="250" strokeOpacity={0.3} />
          {/* shrug marks framing the frog */}
          <path d="M118 132c-10-6-18-4-22 4M262 132c10-6 18-4 22 4" strokeOpacity={0.4} />
        </Scene>
        {/* solid frog occludes the horizon — no line through the belly */}
        <div className="absolute inset-0 flex items-end justify-center pb-5">
          <Frog solid className="h-32 w-32 text-ink" />
        </div>
      </>
    ),
    fr: "Car qui veut vraiment être français ? Même les Français hésitent. Et pourtant, comme Piaf, la grenouille ne regrette rien. Nous voilà. Croâ.",
    en: "Who even wants to be French? Even the French aren't sure. And yet — like Piaf — the frog regrets nothing. Here we are. Croâ.",
  },

  /* ===================== BACK COVER ===================== */
  {
    id: "backcover",
    kind: "back",
    art: (
      <>
        <Scene>
          {/* lily pad + ripples, faint */}
          <ellipse cx="200" cy="150" rx="70" ry="44" fill="currentColor" fillOpacity={0.06} />
          <path d="M200 150l54-20" strokeOpacity={0.2} />
          <ellipse cx="200" cy="150" rx="100" ry="64" strokeOpacity={0.12} />
          <ellipse cx="200" cy="150" rx="130" ry="86" strokeOpacity={0.08} />
        </Scene>
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 text-center">
          <p className="font-display text-3xl font-bold uppercase tracking-widest text-ink/80">Fin.</p>
          {/* mock advertisement */}
          <div className="-rotate-1 border-2 border-ink bg-card px-3 py-1.5 shadow-[2px_2px_0_rgba(23,18,12,0.4)]">
            <p className="font-display text-[11px] font-bold uppercase text-rouge">Apprenez le français !</p>
            <p className="text-[9px] text-ink/70">Résultats non garantis. Effet secondaire : un léger accent.</p>
          </div>
          {/* self-referential gag */}
          <p className="max-w-[18rem] text-[10px] italic leading-snug text-ink/70">
            Vous venez de lire une bande dessinée cachée dans une application de français. Reprenez,
            doucement, le cours de votre vie.
          </p>
          {/* barcode + code stamp */}
          <div className="flex w-full items-end justify-between">
            <div className="text-left">
              <div className="flex h-7 items-end gap-[2px]">
                {[3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3].map((w, i) => (
                  <span key={i} className="block h-full bg-ink" style={{ width: w }} />
                ))}
              </div>
              <p className="mt-0.5 text-[7px] text-ink/50">3 7 3 3 · ne pas avaler</p>
            </div>
            <div className="flex h-12 w-12 rotate-3 items-center justify-center rounded-full border border-ink/70 text-center text-[6px] uppercase leading-tight text-ink/70">
              Approuvé par la fromagère
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
