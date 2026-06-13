/**
 * The panels of "La Complainte de la Grenouille" — Florine's hidden origin
 * comic. Each panel is a hand-drawn woodcut SVG scene (ink line on the card's
 * parchment) plus a French line and an English subtitle in the house's witty,
 * fourth-wall voice. Scenes are authored to fill a 4:3 plate; overlays (the
 * reusable <Frog> and the real stranger faces) are positioned over the SVG.
 *
 * By design, a panel's `art` is just a ReactNode — a finished PNG could replace
 * any scene later with no change to the comic engine.
 */
import type { ReactNode } from "react";
import Frog from "../components/frog/Frog";
import { strangerUrl } from "./characters";

export interface ComicPanel {
  id: string;
  title?: string;
  art: ReactNode;
  fr: string;
  en: string;
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

export const COMIC_PANELS: ComicPanel[] = [
  // 0 — Title plate
  {
    id: "title",
    title: "La Complainte de la Grenouille",
    art: (
      <>
        <Scene>
          {/* radiating rays */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={200}
                y1={150}
                x2={200 + Math.cos(a) * 220}
                y2={150 + Math.sin(a) * 220}
                strokeOpacity={i % 2 ? 0.1 : 0.18}
              />
            );
          })}
          {/* little stars */}
          <path d="M60 50l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" strokeOpacity={0.5} />
          <path d="M330 60l2 6 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" strokeOpacity={0.5} />
          <path d="M70 230l2 6 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" strokeOpacity={0.4} />
          <path d="M325 235l2 6 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" strokeOpacity={0.4} />
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog className="h-44 w-44 text-ink drop-shadow-[2px_2px_0_rgba(23,18,12,0.25)]" />
        </div>
      </>
    ),
    fr: "Une histoire vraie. Enfin, aussi vraie qu'une histoire de grenouille puisse l'être.",
    en: "A true story. Or as true as a story about a frog can hope to be.",
  },

  // 1 — The human creator
  {
    id: "human",
    title: "Chapitre I — L'Humain",
    art: (
      <Scene>
        {/* smug bust */}
        <ellipse cx="170" cy="250" rx="80" ry="40" strokeOpacity={0.3} />
        <path d="M130 250c0-40 12-70 40-70s40 30 40 70" fill="currentColor" fillOpacity={0.06} />
        <circle cx="170" cy="150" r="42" fill="currentColor" fillOpacity={0.06} />
        {/* beret, askew */}
        <path d="M128 132c8-16 70-22 86-4 4 5-4 9-12 9H138c-8 0-13-1-10-5z" fill="currentColor" fillOpacity={0.12} />
        <circle cx="214" cy="126" r="3.5" fill="currentColor" stroke="none" />
        {/* nose in the air, closed smug eyes */}
        <path d="M150 150c4-3 8-3 11 0M178 150c4-3 8-3 11 0" />
        <path d="M188 162c6 2 9 6 4 9" />
        <path d="M156 178c8 5 18 5 26 0" />
        {/* ketchup bottle, dripping */}
        <rect x="292" y="150" width="34" height="70" rx="8" fill="currentColor" fillOpacity={0.1} />
        <rect x="302" y="138" width="14" height="14" rx="3" />
        <path d="M300 150c2-8 22-8 24 0" />
        <path d="M300 230c1 8 1 14 4 18m10-18c0 6 0 10 2 14m8-14c1 5 1 9 3 12" strokeOpacity={0.5} />
      </Scene>
    ),
    fr: "Il était une fois un humain : arrogant, insupportable et — pire que tout — insuffisamment français.",
    en: "Once, the frog was a man: arrogant, unbearable, and — worst of all — insufficiently French. He put ketchup on everything and pronounced croissant «kwa-sont».",
  },

  // 2 — The very tall tower + wizard
  {
    id: "tower",
    title: "Chapitre II — La Tour",
    art: (
      <Scene>
        {/* moon */}
        <circle cx="320" cy="78" r="44" fill="currentColor" fillOpacity={0.08} />
        <circle cx="306" cy="68" r="7" strokeOpacity={0.3} />
        <circle cx="332" cy="90" r="5" strokeOpacity={0.3} />
        {/* very tall tower */}
        <rect x="150" y="40" width="60" height="250" fill="currentColor" fillOpacity={0.06} />
        {/* battlements */}
        <path d="M150 40h10v-12h10v12h10v-12h10v12h10v-12h10v12" />
        {/* stone courses */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={150} y1={70 + i * 30} x2={210} y2={70 + i * 30} strokeOpacity={0.25} />
        ))}
        {/* glowing window with a tiny wizard silhouette */}
        <rect x="168" y="96" width="24" height="34" rx="12" fill="currentColor" fillOpacity={0.16} />
        <path d="M180 104l-7 22h14z" fill="currentColor" stroke="none" />
        <path d="M180 100l4 4-4 4-4-4z" fill="currentColor" stroke="none" />
        {/* ground */}
        <line x1="20" y1="290" x2="380" y2="290" strokeOpacity={0.4} />
      </Scene>
    ),
    fr: "Au sommet d'une tour très, très haute vivait un sorcier qui jugeait les accents.",
    en: "Atop a very, very tall tower lived a wizard who judged people's French. He had nothing better to do. Wizards rarely do.",
  },

  // 3 — The curse
  {
    id: "curse",
    title: "Chapitre III — Le Sortilège",
    art: (
      <>
        <Scene>
          {/* jagged burst */}
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            const r1 = i % 2 ? 120 : 70;
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
          {/* a falling beret (the human, gone) */}
          <path d="M96 70c6-10 40-13 50-2 3 3-2 6-8 6H102c-6 0-9-1-6-4z" strokeOpacity={0.6} />
          {/* sparkle dust */}
          <path d="M300 90l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
          <path d="M110 210l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
          <path d="M295 215l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.6} />
        </Scene>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frog className="h-28 w-28 text-ink" />
        </div>
      </>
    ),
    fr: "« Pour ton impertinence, dit-il, tu seras grenouille. » Ce fut, avouons-le, légèrement excessif.",
    en: "'For your impertinence,' said the wizard, 'a frog you shall be.' Which was, let's be honest, a slight overreaction.",
  },

  // 4 — The terms of the curse
  {
    id: "terms",
    title: "Chapitre IV — Les Conditions",
    art: (
      <>
        <Scene>
          {/* scroll */}
          <path d="M96 60c-14 0-14 18 0 18M304 60c14 0 14 18 0 18" fill="currentColor" fillOpacity={0.06} />
          <rect x="96" y="60" width="208" height="180" fill="currentColor" fillOpacity={0.06} />
          <path d="M96 240c-14 0-14 18 0 18M304 240c14 0 14 18 0 18" fill="currentColor" fillOpacity={0.06} />
          {/* clause 1: checkmark */}
          <path d="M118 108l10 10 18-20" strokeWidth={3} />
          <line x1="158" y1="110" x2="280" y2="110" strokeOpacity={0.3} />
          <line x1="158" y1="124" x2="250" y2="124" strokeOpacity={0.25} />
          {/* clause 2: heart (good deeds) */}
          <path d="M132 168c-8-9-22-2-22 8 0 9 22 22 22 22s22-13 22-22c0-10-14-17-22-8z" />
          <line x1="170" y1="176" x2="280" y2="176" strokeOpacity={0.3} />
          <line x1="170" y1="190" x2="250" y2="190" strokeOpacity={0.25} />
          {/* wax seal */}
          <circle cx="250" cy="222" r="14" fill="currentColor" fillOpacity={0.14} />
        </Scene>
      </>
    ),
    fr: "La malédiction avait deux clauses : apprendre les manières françaises, et accomplir de bonnes actions.",
    en: "The curse came with terms: learn the ways of the French, and do good deeds. Lawyers were involved. They usually are.",
  },

  // 5 — Florine & the conscripted strangers
  {
    id: "strangers",
    title: "Chapitre V — Les Inconnus",
    art: (
      <>
        {/* the cell wall + faces behind it */}
        <div className="absolute inset-0 grid grid-cols-4 gap-2 p-6">
          {[3, 5, 7, 9, 11, 13, 17, 19].map((n) => (
            <div key={n} className="overflow-hidden border border-ink/40 bg-parchment">
              <img
                src={strangerUrl(n)}
                alt=""
                className="h-full w-full object-cover opacity-80 mix-blend-multiply"
              />
            </div>
          ))}
        </div>
        <Scene>
          {/* prison bars */}
          {[60, 120, 180, 240, 300, 340].map((x) => (
            <line key={x} x1={x} y1={20} x2={x} y2={280} strokeOpacity={0.55} strokeWidth={4} />
          ))}
          <line x1="20" y1="24" x2="380" y2="24" strokeOpacity={0.55} strokeWidth={4} />
        </Scene>
        {/* the warden frog, front and centre */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <Frog className="h-20 w-20 text-ink drop-shadow-[1px_1px_0_rgba(23,18,12,0.4)]" />
        </div>
      </>
    ),
    fr: "Alors la grenouille bâtit Florine et enrôla vingt inconnus pour faire son œuvre. (Kim, elle, s'est portée volontaire. Elle inspecte.)",
    en: "So the frog built Florine and pressed twenty strangers into its service. Kim alone volunteered — she prefers inspecting to being imprisoned.",
  },

  // 6 — The treasure
  {
    id: "treasure",
    title: "Chapitre VI — Le Trésor",
    art: (
      <>
        <Scene>
          {/* rays from the chest */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={200}
                y1={170}
                x2={200 + Math.cos(a) * 150}
                y2={170 + Math.sin(a) * 150}
                strokeOpacity={0.12}
              />
            );
          })}
          {/* chest */}
          <rect x="150" y="170" width="100" height="62" rx="4" fill="currentColor" fillOpacity={0.1} />
          <path d="M150 170c0-26 100-26 100 0" fill="currentColor" fillOpacity={0.16} />
          <line x1="150" y1="196" x2="250" y2="196" />
          <rect x="192" y="190" width="16" height="16" rx="3" fill="currentColor" fillOpacity={0.2} />
          {/* sparkles spilling out */}
          <path d="M196 150l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" strokeOpacity={0.6} />
          <path d="M225 158l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.5} />
          <path d="M172 160l1 5 5 1-5 1-1 5-1-5-5-1 5-1z" strokeOpacity={0.5} />
        </Scene>
        <div className="absolute bottom-3 left-6">
          <Frog className="h-16 w-16 text-ink" />
        </div>
      </>
    ),
    fr: "Au bout du chemin brille un trésor que la grenouille ne peut posséder seule : la joie d'être français.",
    en: "At the path's end glows a treasure the frog cannot hoard alone — la joie d'être français — which is precisely why it must guide you to it.",
  },

  // 7 — The closer
  {
    id: "closer",
    title: "Et pourtant…",
    art: (
      <>
        <Scene>
          {/* small Eiffel silhouette, faint */}
          <path d="M340 250l16-120 16 120M348 200h16M344 220h24" strokeOpacity={0.2} />
          <line x1="20" y1="250" x2="380" y2="250" strokeOpacity={0.3} />
          {/* shrug marks around where the frog will sit */}
          <path d="M120 120c-10-6-18-4-22 4M280 120c10-6 18-4 22 4" strokeOpacity={0.4} />
          <path d="M150 96q4-10 10 0M240 96q4-10 10 0" strokeOpacity={0.4} />
        </Scene>
        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <Frog className="h-32 w-32 text-ink" />
        </div>
      </>
    ),
    fr: "Car qui veut vraiment être français ? Même les Français hésitent. Et pourtant — nous voilà. Croâ.",
    en: "Who even wants to be French? Even the French aren't sure. And yet — here we are. Croâ.",
  },
];
