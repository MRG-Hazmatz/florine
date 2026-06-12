/**
 * L'Almanach des Inconnus — names, occupations and backstories for the 20
 * "Strangers Vol. 1" guide faces (art: Francisco Lemos, CC BY 4.0; the
 * characters themselves are ours). Format lovingly ripped off from the
 * Plants vs. Zombies suburban almanac: portrait, title, a "special" stat,
 * and a bio that takes itself exactly as seriously as it should.
 *
 * Entry N corresponds to /characters/strangers/Strangers_00N.png.
 */
export interface AlmanacEntry {
  /** 1-based face number, matches strangerUrl(face). */
  face: number;
  name: string;
  title: string;
  /** PvZ-style "Special:" line. */
  special: string;
  /** Favourite French word — every stranger has one. */
  word: { fr: string; en: string };
  bio: string;
}

export const ALMANAC: AlmanacEntry[] = [
  {
    face: 1,
    name: "Gustave",
    title: "Doorman of the Basement",
    special: "Has never once said « bonsoir » first.",
    word: { fr: "costaud", en: "sturdy" },
    bio: "Twenty years guarding the door of a jazz cellar nobody could ever find taught Gustave the two load-bearing phrases of the French language: « c'est complet » and « non ». He now guards the entrance to your lessons instead. He will let you in. He just needs you to understand that he didn't have to.",
  },
  {
    face: 2,
    name: "Théodore",
    title: "Unpublished Poet",
    special: "Rejects his own poems to maintain their scarcity.",
    word: { fr: "l'ennui", en: "ennui — boredom, but make it profound" },
    bio: "Théodore has written over four thousand poems and published none of them; print runs, he says, are for people who doubt themselves. He grades your writing exercises silently from a distance and has twice muttered « pas mal », which from Théodore is a standing ovation with flowers.",
  },
  {
    face: 3,
    name: "Anatole",
    title: "Barber & Moustache Theorist",
    special: "The moustache is load-bearing.",
    word: { fr: "soigné", en: "well-groomed" },
    bio: "Anatole holds that French pronunciation is sixty percent lips, and that lips perform better when properly framed. His proof: three consecutive victories at the Concours National de la Moustache, two of them with the same moustache. Trim with confidence; conjugate likewise.",
  },
  {
    face: 4,
    name: "Prudence",
    title: "Librarian, Permanently Astonished",
    special: "Shocked since 1987. The book responsible is kept sealed.",
    word: { fr: "quoique", en: "although (subjunctive ambush)" },
    bio: "Prudence has read everything, including the dictionary, which she found « predictable until the letter Q ». Nobody knows what she read in 1987; the library keeps it in a locked drawer and Prudence keeps the face. Her glasses are not corrective. They are for emphasis.",
  },
  {
    face: 5,
    name: "Professeur Aristide",
    title: "Etymologist at Large",
    special: "Can trace any word back to Latin. Eventually. Bring snacks.",
    word: { fr: "jadis", en: "in days of old" },
    bio: "Aristide once began explaining the origin of « fromage » at a dinner party and finished at breakfast, to a different set of guests. He is delighted you're learning French — delighted in general, really — and considers every wrong answer « an etymology that hasn't happened yet ».",
  },
  {
    face: 6,
    name: "Morgane",
    title: "Reader of Leaves, Palms & Review Queues",
    special: "Predicted your last wrong answer. Said nothing.",
    word: { fr: "le destin", en: "destiny" },
    bio: "Morgane reads tarot, tea, smoke, and the spaced-repetition algorithm, which she calls « the only honest oracle ». She knows exactly which card you will forget tomorrow, and she is already a little sad about it. The crystal ball is decorative; the hourglass is not.",
  },
  {
    face: 7,
    name: "Célestin",
    title: "Eternal Student",
    special: "Year fourteen of a three-year degree.",
    word: { fr: "presque", en: "almost" },
    bio: "Célestin has changed majors eleven times, lived behind every train station in France, and can locate free food in any city within forty minutes. He regards graduating as « a kind of giving up ». He sits in on your lessons too — credits, he assures everyone, that will transfer.",
  },
  {
    face: 8,
    name: "Henriette",
    title: "Vendor of Vegetables & Verdicts",
    special: "Free moral assessment with every purchase.",
    word: { fr: "hors de prix", en: "outrageously priced" },
    bio: "Henriette's stall has the ripest tomatoes and the fastest judgments on the square. She measures the entire world in « bof » — her scale runs from one bof (a triumph) to five bofs (see yourself out). Her produce is local, her opinions universal.",
  },
  {
    face: 9,
    name: "Igor",
    title: "Freelance Gargoyle",
    special: "Statue-still until the bells ring. Then extremely not.",
    word: { fr: "là-haut", en: "up there" },
    bio: "Officially Igor is a « stone consultant » retained by several cathedrals; unofficially he is the reason tourists' photos of the north tower never quite match. Pigeons respect him, which is the hardest respect there is. He has not blinked since the bicentennial, and he was blinking ironically then.",
  },
  {
    face: 10,
    name: "Joséphine",
    title: "Retired… Something",
    special: "Fluent in seven languages. Admits to two.",
    word: { fr: "la discrétion", en: "discretion" },
    bio: "Joséphine sang cabaret in three capitals under four names, and her passport collection is, in her words, « a hobby ». She finds your accent charming and your progress satisfactory, and if anyone brings up the incident of 1968 she simply orders another coffee and outlives the question.",
  },
  {
    face: 11,
    name: "Marcel",
    title: "Piano Mover, Soft Heart",
    special: "Cries at the subjunctive. It's the uncertainty.",
    word: { fr: "doucement", en: "gently" },
    bio: "Marcel can carry a grand piano up six floors without exhaling, but the imperfect subjunctive undoes him completely — « all that doubt », he whispers, « in such a small verb ». He presses wildflowers between the pages of his conjugation manual. The manual has never been stronger.",
  },
  {
    face: 12,
    name: "Madame Albertine",
    title: "Concierge & Newswire",
    special: "Knows what you did before you've decided to do it.",
    word: { fr: "figurez-vous", en: "would you believe" },
    bio: "Nothing has happened in the building since 1974 that Albertine has not narrated, annotated, and archived. The préfecture keeps records; Albertine keeps the truth. She begins every sentence with « figurez-vous que » and every listener is legally obliged to gasp.",
  },
  {
    face: 13,
    name: "Lucien",
    title: "Detective of Missing Accents",
    special: "Solved the Case of the Silent H. (It was never speaking.)",
    word: { fr: "louche", en: "shady" },
    bio: "Lucien works orthographic crimes: cedillas stolen in broad daylight, accents graves gone missing between drafts, an entire row of silent letters with airtight alibis. He trusts no one — especially not « ou » and « où », who are obviously the same character. The truth, he says, is in the circumflex. Something always died there.",
  },
  {
    face: 14,
    name: "Maximilien",
    title: "Tragedian of the Théâtre du Coin",
    special: "Has died 412 times on stage. Rates each death out of ten.",
    word: { fr: "hélas", en: "alas" },
    bio: "Maximilien performs Racine at breakfast and the phone book at dinner; both end in tears, as all great literature must. He considers your failed exercises « a rehearsal, not a flop », and your passed ones « an opening night ». His own personal best death remains the 2011 « Hélas » that lasted four minutes.",
  },
  {
    face: 15,
    name: "Bartholomé",
    title: "Accountant of Anxieties",
    special: "Counts your streak so you don't have to. (He has to.)",
    word: { fr: "au cas où", en: "just in case" },
    bio: "Bartholomé carries three umbrellas, four spare pens, and a contingency plan for his contingency plan, which itself has a backup. He audits your streak nightly and files it under « things that could have gone worse ». He is proud of you in a way he will disclose only in the annexes.",
  },
  {
    face: 16,
    name: "Kim",
    title: "The Inspector",
    special: "Nothing escapes her. Nothing ever has.",
    word: { fr: "impeccable", en: "impeccable" },
    bio: "Kim inspects every card, every accent, every comma in this app before it is allowed anywhere near you. Her fee is paid exclusively in plant-based cheese, which she also inspects. If you ever find a mistake, it isn't a mistake — she simply hasn't reached that card yet. Rien ne lui échappe.",
  },
  {
    face: 17,
    name: "Frère Basile",
    title: "Monk on a Technicality",
    special: "Vow of silence. Exemption granted for liaisons.",
    word: { fr: "l'enchaînement", en: "the linking of sounds" },
    bio: "Basile has not spoken since 2009, except to demonstrate liaison — the moment a silent letter wakes before a vowel — which he successfully argued before the abbot is not speech but prayer. « Les‿amis », he intones, once a day, and returns to silence. The abbot has stopped checking.",
  },
  {
    face: 18,
    name: "Narcisse",
    title: "Sommelier",
    special: "His nose files separate, often dissenting, opinions.",
    word: { fr: "le bouquet", en: "the bouquet (of a wine)" },
    bio: "Narcisse can identify a wine's vintage, slope, and the marital status of the person who harvested it. His nose has been insured, interviewed on regional television, and once invited to a conference without him. They went. It was, by all accounts, the better speaker.",
  },
  {
    face: 19,
    name: "Père Séraphin",
    title: "Hermit, Semi-Retired",
    special: "Came down from the mountain for the cheese course. Stayed.",
    word: { fr: "la sagesse", en: "wisdom" },
    bio: "Séraphin spent thirty years alone on a mountain contemplating a single question, and came back down with three better questions, which he considers an excellent return on investment. He approves of your studying. « Fluency », he says, « is just listening that finally learned to speak. »",
  },
  {
    face: 20,
    name: "Mirabelle",
    title: "Florist & Dangerous Optimist",
    special: "Has named every flower in the shop after an irregular verb.",
    word: { fr: "épanoui", en: "in full bloom" },
    bio: "Mirabelle sells roses called « être », tulips called « aller », and one alarming cactus called « falloir » that nobody waters correctly. She believes every customer is one bouquet away from a better mood, and in thirty years of business she has never once been wrong. The cactus disagrees, but the cactus would.",
  },
];

/** Look up an almanac entry by 1-based face number. */
export function almanacEntry(face: number): AlmanacEntry {
  return ALMANAC[(((face - 1) % ALMANAC.length) + ALMANAC.length) % ALMANAC.length];
}
