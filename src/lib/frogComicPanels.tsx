/**
 * "La Complainte de la Grenouille" — Florine's hidden origin comic.
 *
 * The comic is now the PRINTED edition: a fully designed book (cover, dramatis
 * personae, chapters, exhibits, epilogue, back cover) exported to PDF and
 * rendered to WebP pages by scripts/build_comic_pages.py. This module is just
 * the page manifest; FrogComic.tsx supplies the reader (splash, page-turn,
 * fullscreen, keyboard nav).
 *
 * Canon (v2, printed edition): HRITHIK the catastrophic tourist is cursed into
 * the frog by GRIMOALD de la Tour-Percée (Shadow Wizard Money Gang, D.A.C.P.
 * field agent, échelon 3). KIM — French, tired, inspectrice (volunteer) — had
 * warned him. Nineteen strangers "recruited" (allegedly) become the twenty
 * teachers who watch over your lessons. The student, at last, is you.
 */

export interface ComicPage {
  id: string;
  src: string;
  alt: string;
  /** Intrinsic pixel size of the WebP — the reader computes an exact
      fit-to-window from these, so a sheet is never clipped or distorted. */
  w: number;
  h: number;
}

const SPREAD = { w: 2048, h: 1408 };

const page = (n: number, id: string, alt: string, dims = SPREAD): ComicPage => ({
  id,
  src: `/comic/page-${String(n).padStart(2, "0")}.webp`,
  alt,
  ...dims,
});

export const COMIC_PAGES: ComicPage[] = [
  page(1, "cover", "Cover — La Complainte de la Grenouille, Florine Comics Nº 1, 3 mouches", { w: 1304, h: 1582 }),
  page(2, "cast-arrival", "Dramatis personae, and Chapter I — The Arrival: a €34 plane ticket full of bad ideas"),
  page(3, "bise-offences", "The high-five heard around Paris, and Chapter II — The Offences: the outfit"),
  page(4, "boulangerie-diner", "Kwa-sont at the boulangerie; ketchup on the duck confit at dinner"),
  page(5, "brie-logbook", "The nose of the brie, and Kim's logbook, entered into evidence"),
  page(6, "wizard", "Chapter III — The Wizard: Grimoald of the Shadow Wizard Money Gang"),
  page(7, "dossier-memo", "Chapter IV — The File: the D.A.C.P., and internal memo nº 2847-B"),
  page(8, "nightshift-civil", "The all-night shift, and the wizard's civilian disguise"),
  page(9, "cafe", "Chapter V — The Café: the final straw"),
  page(10, "spell-contract", "Chapter VI — The Spell, and the de-frogging contract"),
  page(11, "sigh-plan", "Chapter VII — The Sigh: who even wants to be French? Plus the operation board"),
  page(12, "recruitment", "Chapter VIII — The Recruitment (allegedly), and Kim's NON stamp"),
  page(13, "pension-classphoto", "Chapter IX — The Boarding School (legally speaking), and the class photo"),
  page(14, "previous-lives", "Chapter X — Previous Lives: Igor, Father Séraphin, Mirabelle"),
  page(15, "workshop-trials", "Chapter XI — The Workshop, and Chapter XII — Clinical Trials"),
  page(16, "reportcards-faculty", "The report cards, and Chapter XIII — The Faculty (a hostile takeover)"),
  page(17, "assignments-open", "The teaching assignments — twenty teachers, one per sacred law — and the school opens"),
  page(18, "epilogue", "Epilogue — The Other Side of the Page: the student, at last, is you"),
  page(19, "backcover", "Back cover — He wanted a holiday. He got a curse. florine.vercel.app", { w: 1304, h: 1768 }),
];
