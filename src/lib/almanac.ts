/**
 * L'Almanach des Inconnus — names, occupations and backstories for the 20
 * "Strangers Vol. 1" guide faces (art: Francisco Lemos, CC BY 4.0; the
 * characters, lives, crimes and moustaches are Florine's own invention).
 * Format lovingly ripped off from the Plants vs. Zombies suburban almanac:
 * portrait, title, a "Special:" stat, a favourite word, a motto, and a bio
 * that takes itself exactly as seriously as it should.
 *
 * Entry N corresponds to /characters/strangers/Strangers_00N.png.
 * Kim is Nº 2 — the second (and only other) person to contribute to Florine.
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
  /** Personal motto, in French, with translation. */
  motto: { fr: string; en: string };
  bio: string;
}

export const ALMANAC: AlmanacEntry[] = [
  {
    face: 1,
    name: "Gustave",
    title: "Doorman of the Basement",
    special: "Has never once said « bonsoir » first. The record stands at forty-one years.",
    word: { fr: "costaud", en: "sturdy" },
    motto: { fr: "C'est complet.", en: "We're full. (It was never full.)" },
    bio: "Gustave guarded the door of Le Sous-Sol, a jazz cellar so exclusive that its address was a rumour and the rumour was wrong. In forty-one years he admitted nine people, three of whom were the band. He maintains a list; nobody is on it; he consults it anyway, slowly, out of respect for the form. Guarding the entrance to your lessons is, he feels, a demotion in mystery but a promotion in traffic. He will let you in every single time. He would simply rather you didn't assume.",
  },
  {
    face: 2,
    name: "Kim",
    title: "The Inspector",
    special: "Has found every mistake ever made. Three were hers. She approved them retroactively.",
    word: { fr: "impeccable", en: "impeccable" },
    motto: { fr: "On en reparle.", en: "We'll be talking about this again." },
    bio: "Accounts of Kim's first inspection differ: the dictionary says she arrived at dawn; the dawn maintains it arrived late and apologised. Second person ever to contribute to Florine — hence entry Nº 2, a placement she negotiated by raising one eyebrow — she audits every accent, hyphen and semicolon with a jeweller's loupe and three rubber stamps: IMPECCABLE, PRESQUE, and the feared ON EN REPARLE. Her fee is settled in plant-based cheese, aged to her written specifications and inspected on delivery, twice. The frog reports to her on Thursdays. Her ledger holds exactly 3,333 lines, each verified forward and then — for symmetry — backward.",
  },
  {
    face: 3,
    name: "Anatole",
    title: "Barber & Moustache Theorist",
    special: "Three national titles. Two with the same moustache. The third moustache filed a protest.",
    word: { fr: "soigné", en: "well-groomed" },
    motto: { fr: "Un visage rasé est une phrase sans verbe.", en: "A shaved face is a sentence without a verb." },
    bio: "Anatole's doctoral thesis — rejected by four universities for « excessive confidence » — holds that French pronunciation is sixty percent lips, and that lips perform best when properly framed. His salon has two chairs: one for the client, one for the moustache, which is consulted separately. He once groomed a customer so thoroughly that the man left speaking better subjunctive, an outcome Anatole logged as « expected ». The protest filed by the third moustache is still pending. Anatole trims it personally while it waits.",
  },
  {
    face: 4,
    name: "Prudence",
    title: "Librarian, Permanently Astonished",
    special: "Shocked since 1987. The book responsible is sealed in the basement under three classification systems.",
    word: { fr: "quoique", en: "although (subjunctive ambush)" },
    motto: { fr: "Chut. Même vous.", en: "Hush. Even you." },
    bio: "Prudence has read everything, including the dictionary, which she found « predictable until the letter Q ». Nobody knows what she read in 1987; the library sealed it under Dewey, alphabetical AND chronological order, the bibliographic equivalent of three locks, and Prudence kept the face. Her astonishment is not an expression — it is a filing system, one raised eyebrow per overdue century. She whispers in italics, shelves her enemies under fiction, and has been renewing her own library card since before the library existed. The library has stopped asking how.",
  },
  {
    face: 5,
    name: "Professeur Aristide",
    title: "Etymologist at Large",
    special: "Can trace any word to Latin. Once traced « le week-end » there out of spite. It took nine hours; he calls them his finest.",
    word: { fr: "jadis", en: "in days of old" },
    motto: { fr: "Tout vient du latin, sauf l'impatience.", en: "Everything comes from Latin, except impatience." },
    bio: "Aristide began explaining the origin of « fromage » at a dinner party in 1989 and finished at breakfast — a different breakfast, in a different house, to guests who maintain they never invited him. All parties agree the explanation was magnificent. He is delighted you're learning French, delighted in general, really, and considers every wrong answer « an etymology that hasn't happened yet » and every right one « Latin, doing its job ». His pockets contain index cards, a boiled sweet from jadis, and the rough draft of the word for it.",
  },
  {
    face: 6,
    name: "Morgane",
    title: "Reader of Leaves, Palms & Review Queues",
    special: "Predicted your last wrong answer. Said nothing. Lit a candle.",
    word: { fr: "le destin", en: "destiny" },
    motto: { fr: "Je l'avais prédit.", en: "I predicted this." },
    bio: "Morgane reads tarot, tea, smoke, palms, and the spaced-repetition algorithm, which she calls the only oracle that shows its work. She has been banned from card tables in three départements — not for cheating, but for sighing meaningfully before every deal, which the casinos ruled « a form of insider trading with the universe ». She knows exactly which card you will forget tomorrow and is already a little sad about it, in advance, on schedule. The crystal ball is decorative. The hourglass is not.",
  },
  {
    face: 7,
    name: "Célestine",
    title: "Eternal Student",
    special: "Year fourteen of a three-year degree. The university now lists her as load-bearing.",
    word: { fr: "presque", en: "almost" },
    motto: { fr: "Je valide ça plus tard.", en: "I'll get the credits for that later." },
    bio: "Célestine has changed majors eleven times — archaeology to oenology in a single afternoon, which remains the faculty record — and her student card is older than two of the buildings it opens. She can locate free food in any city in under forty minutes, a discipline she calls « applied geography » and has twice proposed as a thesis topic. She regards graduating as a kind of giving up, and the university, at this point, quietly agrees: her name is on a bench, a stairwell, and one load-bearing column. She audits your lessons too. Credits pending transfer since 2012.",
  },
  {
    face: 8,
    name: "Henriette",
    title: "Vendor of Vegetables & Verdicts",
    special: "Free moral assessment with every purchase. The assessment is not optional.",
    word: { fr: "hors de prix", en: "outrageously priced" },
    motto: { fr: "Et avec ceci ?", en: "Anything else? (a threat)" },
    bio: "Henriette's stall has the ripest tomatoes and the swiftest justice on the square. She measures the entire world in « bof », on a scale from one bof (a triumph) to five bofs (see yourself out, and take your opinions with you). She once judged a melon so severely that it ripened on the spot, out of embarrassment; it is still discussed at the wholesale market in hushed tones. Her scales are certified by the prefecture, her standards by no one, because no one would dare. The parsley is free if she approves of your posture.",
  },
  {
    face: 9,
    name: "Igor",
    title: "Freelance Gargoyle",
    special: "Statue-still until the bells ring. Then extremely not.",
    word: { fr: "là-haut", en: "up there" },
    motto: { fr: "Les pigeons me respectent.", en: "The pigeons respect me." },
    bio: "Officially, Igor is a « stone consultant » retained by several cathedrals; unofficially, he is the reason no two tourist photographs of the north tower agree. He holds the European record for stillness — eleven days — having lost the world title to a drainpipe he maintains was cheating. He has not blinked since the bicentennial, and he was blinking ironically then. Pigeon respect is the hardest respect there is, and Igor has it in writing: a formal letter, delivered by pigeon, naturally, which he had notarised.",
  },
  {
    face: 10,
    name: "Joséphine",
    title: "Retired… Something",
    special: "Fluent in seven languages. Admits to two. A third slips out when the orchestra plays in B-flat minor.",
    word: { fr: "la discrétion", en: "discretion" },
    motto: { fr: "Quelle année, 1968 ?", en: "What year, 1968?" },
    bio: "Joséphine sang cabaret in three capitals under four names, two of which are still wanted for questioning — strictly, she notes, as witnesses. Her passport collection is « a hobby ». Her hatbox is « a hatbox ». Nobody has ever checked, because checking would require asking, and asking Joséphine a direct question is like opening an umbrella indoors: technically possible, broadly inadvisable. She finds your accent charming, your progress satisfactory, and your curiosity adorable — in the way that locked doors are adorable.",
  },
  {
    face: 11,
    name: "Marcel",
    title: "Piano Mover, Soft Heart",
    special: "Carries grand pianos up six floors alone. Defeated, annually, by the imperfect subjunctive.",
    word: { fr: "doucement", en: "gently" },
    motto: { fr: "Doucement, c'est déjà bien assez fort.", en: "Gently is already quite loud enough." },
    bio: "Marcel can carry a grand piano up a spiral staircase without exhaling, but « qu'il eût fallu » undoes him completely — all that doubt, he whispers, in such a small verb. He presses wildflowers between the pages of his conjugation manual, one bloom per mood; the subjunctive section is, by now, a meadow. Every spring he reads the imperfect subjunctive again, just to check, and every spring it wins, and he salutes it, the way movers salute a staircase that fought well. Pianos trust him. You can tell because they hold their tuning all the way up.",
  },
  {
    face: 12,
    name: "Madame Albertine",
    title: "Concierge & Newswire",
    special: "Knows what you did before you've decided to do it. Disapproves already.",
    word: { fr: "figurez-vous", en: "would you believe" },
    motto: { fr: "Figurez-vous que je le savais.", en: "Would you believe I knew." },
    bio: "Nothing has happened in the building since 1974 that Albertine has not narrated, annotated and archived; the préfecture keeps records, Albertine keeps the truth, and on Sunday afternoons she cross-references the two and corrects the préfecture. Her loge contains one chair for visitors and three for testimony. She begins every sentence with « figurez-vous que » and every listener is legally obliged to gasp — it's in the building's bylaws, which she also wrote, figurez-vous. The elevator breaks down only when she has news worth a captive audience.",
  },
  {
    face: 13,
    name: "Lucien",
    title: "Detective of Missing Accents",
    special: "Solved the Case of the Silent H. It was never speaking. It had simply seen too much.",
    word: { fr: "louche", en: "shady" },
    motto: { fr: "Le circonflexe sait quelque chose.", en: "The circumflex knows something." },
    bio: "Lucien works orthographic crime: cedillas lifted in broad daylight, accents graves that vanish between drafts, a ring of silent letters whose alibis are a little too rehearsed. His corkboard connects « ou » and « où » with red string; they claim to be strangers; he has never believed them, and the string grows. He interrogated the silent H for nine hours before understanding it would never talk — not couldn't, wouldn't. The truth is in the circumflex. Something always died there, and Lucien intends to find out what the S knew, and who shelved the file.",
  },
  {
    face: 14,
    name: "Bérénice",
    title: "Tragédienne of the Théâtre du Coin",
    special: "Has died 412 times on stage and twice in a pharmacy (method). Rates each death out of ten.",
    word: { fr: "hélas", en: "alas" },
    motto: { fr: "Encore mourante, merci.", en: "Still dying, thank you." },
    bio: "Bérénice performs Racine at breakfast and the phone book at dinner; both end in tears, as all great literature must. Curtains rise out of respect when she enters a room — including shower curtains, which she finds forward of them. Her personal best remains the « Hélas » of 2011: four minutes, one syllable, a bakery across the street closed out of solidarity. She considers your failed exercises a rehearsal and your passed ones an opening night, darling, and she has never missed either — she sits in the back row of every lesson, dying quietly, beautifully, on a scale of one to ten: always a ten.",
  },
  {
    face: 15,
    name: "Bartholomé",
    title: "Accountant of Anxieties",
    special: "Counts your streak so you don't have to. (He has to.)",
    word: { fr: "au cas où", en: "just in case" },
    motto: { fr: "J'ai un parapluie pour ça.", en: "I have an umbrella for that." },
    bio: "Bartholomé carries three umbrellas, four spare pens, and a contingency plan for his contingency plan, which is itself backed up in triplicate and buried at three separate altitudes, au cas où. He audits your streak nightly, files it under « things that could have gone worse », and initials it twice — once as the accountant, once as the anxiety. His briefcase has survived two floods and one optimism. He is proud of you in a way he will only disclose in the annexes, where it has been fully provisioned for since March.",
  },
  {
    face: 16,
    name: "Théodora",
    title: "Seer of Minor Futures",
    special: "Predicts only small events, with terrifying accuracy. Refuses, on principle, to predict anything important.",
    word: { fr: "le pressentiment", en: "a foreboding" },
    motto: { fr: "Vous perdrez un gant jeudi.", en: "You will lose a glove on Thursday." },
    bio: "Théodora knows which button will abandon your coat next, which page of your notebook will jam the photocopier, and which word you will misspell at the worst possible moment — it's « quoique »; it is always « quoique ». The big future, she says, is none of our business; the small one, however, is a public service. She has been pre-emptively banned from the lottery in three départements, a precaution she finds flattering, and from one tombola, which she finds petty. Lately her tea leaves have begun leaving her notes. She files them, unread, until Thursday. She already knows.",
  },
  {
    face: 17,
    name: "Frère Basile",
    title: "Monk on a Technicality",
    special: "Vow of silence since 2009. Exemption granted for liaisons, won on appeal.",
    word: { fr: "l'enchaînement", en: "the linking of sounds" },
    motto: { fr: "Les‿amis.", en: "Friends. (his one daily word, fully linked)" },
    bio: "Basile argued before the abbot — in writing, naturally — that liaison is not speech but prayer: a silent letter waking before a vowel is, he submitted, a small resurrection. The abbot granted the exemption and has regretted the precedent ever since, as Basile now appeals everything, in writing, beautifully. Once a day, at vespers, he pronounces « les‿amis » with such perfect linking that novices weep and one organ retuned itself. He then returns to silence, satisfied — like a bell rung once, and rung correctly.",
  },
  {
    face: 18,
    name: "Narcisse",
    title: "Sommelier",
    special: "His nose files separate, often dissenting, opinions. It has its own letterhead.",
    word: { fr: "le bouquet", en: "the bouquet (of a wine)" },
    motto: { fr: "Mon nez n'est pas d'accord.", en: "My nose disagrees." },
    bio: "Narcisse can identify a wine's vintage, slope, grape, and the marital status of whoever harvested it — usually before the bottle is open, occasionally before it is purchased, and once, memorably, before it was bottled. His nose has been insured, interviewed on regional television, and invited to a conference without him; they attended separately, and the nose was, by every written account, the better speaker. They have since reconciled, professionally. Witnesses describe the handshake as cold, the silence as oaked, with a long finish.",
  },
  {
    face: 19,
    name: "Père Séraphin",
    title: "Hermit, Semi-Retired",
    special: "Came down from the mountain for the cheese course. Stayed. The mountain writes occasionally.",
    word: { fr: "la sagesse", en: "wisdom" },
    motto: { fr: "Trois questions valent mieux qu'une réponse.", en: "Three questions are worth more than one answer." },
    bio: "Séraphin spent thirty years alone contemplating a single question and came back down with three better ones, which he considers an excellent return on investment — the mountain, he notes, kept the original as rent. He once argued with the weather and lost graciously, which is where the eyebrows come from. He approves of your studying with the full, slow weight of a man who has watched glaciers hurry. « Fluency », he says, « is just listening that finally learned to speak. » He says it slowly. He has time. The cheese course, for the record, was worth it.",
  },
  {
    face: 20,
    name: "Mirabelle",
    title: "Florist & Dangerous Optimist",
    special: "Has named every flower after an irregular verb. The begonias conjugate beautifully. The cactus does not.",
    word: { fr: "épanoui", en: "in full bloom" },
    motto: { fr: "Tout fleurit, même vous.", en: "Everything blooms, even you." },
    bio: "Mirabelle sells roses called « être », tulips called « aller », peonies called « savoir » that know exactly when to open, and one alarming cactus called « falloir » that nobody has ever watered correctly, because nobody has ever conjugated it with confidence. She believes every customer is one bouquet away from a better mood, and in thirty years she has never been wrong — the ledger is public, the streak is municipal legend, and the mairie sends doubters to her in spring. The cactus abstains from comment. But the cactus would. Her shop smells like the future tense.",
  },
];

/** Look up an almanac entry by 1-based face number. */
export function almanacEntry(face: number): AlmanacEntry {
  return ALMANAC[(((face - 1) % ALMANAC.length) + ALMANAC.length) % ALMANAC.length];
}
