"""
Build the 3,333 splash texts -> src/lib/splashes.generated.ts

Why 3,333? The creator's best friend Kim declared it lucky, and a French frog
agreed (croa croa ~ trois trois). Three of the splashes are dedicated to her.

Composition (deterministic, re-runnable):
  1. HANDWRITTEN  - curated one-liners: jokes, puns, facts, 4th-wall, Kim's trio.
  2. Corpus lines - generated FROM OUR OWN CONTENT (every vocab card + its
     example sentence + the unit titles), so every generated line teaches
     something real. Templates rotate per item; no two lines are identical.
The pools are concatenated in priority order and trimmed/padded to EXACTLY 3333.
"""
from __future__ import annotations
import json, io, glob, sys

TARGET = 3333
OUT = "src/lib/splashes.generated.ts"

KIM = [
    "Did you know? There are exactly 3,333 splash texts in Florine. The number was decreed lucky by the creator's best friend Kim - and seconded by a French frog: croa, croa... which, if you squint with your ears, is trois, trois. Also, three just so happens to be the creator's favourite number - so three of these splashes belong to Kim alone. You just found the first.",
    "France has over a thousand cheeses. The kindest ones have never met a cow - those are Kim's, and they hold court at linktr.ee/fromidable. Tell them the frog sent you.",
    "Every lesson in here eventually faces Kim Szymczak - vegan cheese CEO by day, Florine's chief quality inspector by night. Spotted a mistake? She simply hasn't reached that card yet. Rien n'echappe a la fromagere.",
]

HANDWRITTEN = KIM + [
    # ----- kept & refreshed from the original hundred -----
    "Five minutes a day beats three hours once a month.",
    "Say it out loud. Your mouth needs the reps too.",
    "Review the words you got wrong; that's where the gold is.",
    "You don't have to be fluent today, just less rusty than yesterday.",
    "Cover the English, guess, then peek. That's the whole trick.",
    "Sleep on it. Your brain files vocabulary overnight.",
    "Mistakes are just data. Collect them.",
    "Read it, hear it, say it, write it. Pick at least two.",
    "Consistency is a cheat code.",
    "The hardest part was opening the app. You already did that.",
    "You're closer than you were five minutes ago.",
    "Every fluent speaker was once exactly where you are.",
    "Small steps still go uphill.",
    "Future-you will be so smug at the DELF.",
    "Bilingual is just monolingual that didn't quit.",
    "One more card. You've got one more card in you.",
    "Progress isn't loud. Keep going anyway.",
    '"Courage" is a French word. Use it.',
    "You vs. the subjunctive. You win eventually.",
    "The streak doesn't care about yesterday. Just show up today.",
    "About 300 million people speak French worldwide.",
    "French is spoken on all five inhabited continents.",
    "Roughly a third of English words have French roots. Merci, 1066.",
    "French was the language of the English court for nearly 300 years.",
    "The Academie francaise has guarded French grammar since 1635.",
    "French is an official language of the UN, the EU, and the Olympics.",
    "Most French speakers today live in Africa, not France.",
    "French was the global language of diplomacy until about WWI.",
    "Every French noun is masculine or feminine. No neutral ground.",
    '"Bonjour" literally means "good day."',
    '"Salut" means both hello and goodbye. Efficient.',
    "The little hook under c is called a cedille.",
    '80 in French is "quatre-vingts" - literally four twenties.',
    '90 is "quatre-vingt-dix": four-twenties-ten. France commits to the bit.',
    'In Belgium and Switzerland, 70 is "septante." Lucky them.',
    "The Eiffel Tower grows about 15 cm taller in summer.",
    "You already speak French: cafe, deja vu, cliche, souvenir.",
    "French is official in around 30 countries.",
    "Asked how to govern a country with 246 cheeses, de Gaulle sighed. France has since quadrupled the cheeses.",
    "The metric system was a French Revolution invention.",
    "Louis XIV reigned 72 years, the longest of any major European monarch.",
    '"Restaurant," "menu," "chef," "a la carte" - all borrowed from French.',
    'French added a verb for French-kissing, "galocher," to the dictionary in 2014.',
    'The accent on "a" (to) vs "a" (has) changes the whole word.',
    'The -ent on "ils parlent" is silent. Always. Make peace with it.',
    "Genders aren't logical. Memorise the article with the word.",
    "tu for friends, vous for everyone you'd be polite to. Unsure? vous.",
    "Liaison: silent letters wake up before a vowel.",
    '"on" technically means "one" but really means "we."',
    'For age, French uses avoir: "j\'ai treize ans," never "je suis."',
    "Negation is a sandwich: ne ... pas around the verb.",
    "e, e and e all sound different. Accents aren't decoration.",
    "Most French adjectives come after the noun. Most.",
    '"n\'" is just "ne" dressed up for a vowel.',
    'French questions, easy mode: just raise your voice. "Ca va ?"',
    'Plurals are often silent: "les chats" barely differs from "le chat."',
    '"qu\'est-ce que" looks terrifying and just means "what."',
    "French snails are strictly slow food.",
    "I'd tell a chemistry joke in French, but I'd get no reaction.",
    "A croissant walked into a cafe. Too flaky to serve.",
    "French verbs have moods. Honestly, relatable.",
    "How many silent letters in French? Most of them, apparently.",
    "Un, deux, trois... and then the cat sank. (Un, deux, trois, cat sank. Say it fast.)",
    "My French is so rusty it qualifies as a historic monument.",
    "I'm not arguing, I'm conjugating loudly.",
    "Oh, skipped the audio again? Bold.",
    "The subjunctive can smell fear.",
    'Sure, you "know" it. Flip the card.',
    "Guessing counts as studying. Probably.",
    'You and "quatre-vingt-dix" need to have a talk.',
    "Look at you, doing the hard thing voluntarily.",
    "Plot twist: it was feminine all along.",
    "That accent matters more than you'd like.",
    "Drink some water. Conjugate later.",
    "Stretch. Even your wrists are learning French.",
    "Take the break before you need it.",
    "Comparison is the thief of fluency. Run your own race.",
    "Done beats perfect, especially in writing tasks.",
    "Name three objects in your room in French. Right now. The chair won't mind.",
    "Talk to yourself in French. It's immersion, not weirdness.",
    "Close the app and speak to a real human eventually. Worth it.",
    "Whisper the words on the bus. People will respect the dedication.",
    "Re-reading isn't studying. Testing yourself is.",
    "If it were easy, it wouldn't come with a certificate.",
    "Flashcards forgive. They just bring the word back later.",
    "There are 3,333 of these. You found one. The frog has found them all.",
    "The faces are watching your progress. Approvingly. Mostly.",
    "Yes, the people on the cards are a little uncanny. They mean well.",
    "This message will probably change. The one on the home page rarely does.",
    "Florine: cheaper than a tutor, weirder than a textbook.",
    "Built with too much coffee and just enough panic.",
    "Three genders would have been worse. Be grateful for two.",
    'The "h" is there. It\'s just never invited to speak.',
    "Pas mal! (That's French for \"I'll allow it.\")",
    "Masculine wins in a mixed group. Blame history, not us.",
    "Quebec guards French so fiercely it has a government office for it.",
    '"Week-end," "parking," "shopping" - French borrowed them right back.',
    'Whisper "je ne sais quoi" and instantly feel 12% more sophisticated.',
    "Learning a language literally rewires your brain. Feel fancy.",
    "Bonne chance. (You won't need it, but still.)",
    # ----- new: puns, 4th wall, quirk -----
    "It's omelette AU fromage, not DU fromage. We checked. Dexter lied.",
    "Why don't the French barbecue? The steak always goes on grève.",
    "A French pun is un calembour. Knowing that word is already a flex.",
    "« Pamplemousse » is objectively the funniest French word. This is settled science.",
    "« Chauve-souris » - the French saw a bat and named it 'bald mouse'. No notes.",
    "« Oiseau » contains every vowel and pronounces almost none of them. Iconic behaviour.",
    "Poisson sans boisson est poison - an actual French saying about hydration. Stay safe out there.",
    "Half of French humour is pausing meaningfully. ...Voilà.",
    "Mercredi is the only weekday that sounds like a sneeze. À tes souhaits.",
    "In Belgium, 99 is « nonante-neuf ». In France it's four-twenty-ten-nine. Choose your fighter.",
    "J'ai faim = I'm hungry. « J'ai femme » = a very different announcement.",
    "Tip: gesture more. Gestures are 30% of the language. Source: every café terrace in Lyon.",
    "« Oh là là » mostly means 'oh no'. Hollywood owes France an apology.",
    "The circumflex (ê) usually marks a lost S. Forêt was once forest. The hat is a tombstone.",
    "French keyboards are AZERTY. The French saw QWERTY and said non.",
    "« L'esprit de l'escalier » : thinking of the perfect reply too late. There's a word. Of course there's a word.",
    "« Dépaysement » : the feeling of not being in your own country. Untranslatable. Collectible.",
    "A baguette must legally contain only flour, water, salt, yeast. The law has priorities.",
    "Crossing France takes one day by TGV and four years by cheese plate.",
    "Voltaire drank up to 40 cups of coffee a day. The Enlightenment was caffeinated.",
    "The French don't say 'it's raining cats and dogs' - il pleut des cordes. It rains ropes. Poetic.",
    "« Avoir le cafard » - to have the cockroach - means feeling blue. French sadness has antennae.",
    "« Donner sa langue au chat » : give your tongue to the cat = give up guessing. The cat collects.",
    "To say something is easy: « les doigts dans le nez » - fingers in the nose. Elegance.",
    "« Mettre son grain de sel » : adding your grain of salt where nobody asked. We all know someone.",
    "A hangover is « une gueule de bois » - a wooden face. Accurate.",
    "« Coup de foudre » : a lightning strike, or love at first sight. Same energy, honestly.",
    "When it's freezing: « un froid de canard » - a duck's cold. Ask a duck. They know.",
    "This splash is in English. The irony is not lost on us. The next card is your revenge.",
    "You blinked and the subjonctif imparfait left the chat. (Mostly retired since 1950. You're safe.)",
    "The creator's favourite number is three. You may have noticed. Trois fois.",
    "Somewhere, a frog is proud of you. Croâ.",
    "We tried numbering these once. The frog ate the list.",
    "Press F for every silent letter in « ils parlaient ». That's four Fs.",
    "Achievement idea: read 100 splashes. Reward: 100 more splashes.",
    "The zombie hand on the home page waves hello, not goodbye. We asked it.",
    "If this app were a person it would be the friend who corrects your French AND brings snacks.",
    "Rumour says the creator also builds a haunted casino. The frog refuses to comment.",
    "There is no splash text here. (April fools. Poisson d'avril.)",
    "Un poisson d'avril is a paper fish taped to someone's back. France pranks in seafood.",
    "Spaced repetition: forgetting things ON PURPOSE so you remember them better. Galaxy brain.",
    "Your daily reviews are due. They have always been due. The hourglass remembers.",
    "Lesson tip: read the boxed patterns twice. They're boxed for a reason.",
    "The exercises shuffle every time. Memorising answer positions? The app memorised you first.",
    "DELF examiners love connectors the way the French love a long lunch. Use both.",
    "Say « serrurerie » three times fast. Congratulations, you're now a locksmith.",
    "« Les chaussettes de l'archiduchesse... » - if you finish this tongue twister you skip leg day.",
    "Bescherelle is both a conjugation book and a French mood.",
    "The DALF C2 has no grammar section. By then, YOU are the grammar section.",
    "Real talk: the speaking drills work better out loud than in your head. Yes, we can tell.",
    "Croissants are Austrian by birth, French by adoption, and yours by right.",
    "« Flâner » : to stroll with no destination, elegantly. The Seine was built for this verb.",
    "« Râler » : to grumble recreationally. A national sport. You'll learn it by unit 30.",
    "French bureaucracy is the final boss. The DALF is just the tutorial.",
    "Lesson zero of French cinema: the shrug carries a complete argument.",
    "« Bof » is a full sentence. So is « bah ». Master both, rule the café.",
    "Wordle in French is harder. Five letters and three of them are silent.",
    "Your brain on French: same brain, better sauces.",
    "Remember: Kim reviews these lessons. Write your answers like she's watching. She might be.",
]

V_TEMPLATES = [
    'Word drop: « {fr} » - {en}. Slip it into a conversation today and walk away like nothing happened.',
    'Free sample from {lvl}: « {fr} » means "{en}". The rest lives in "{title}".',
    'A wild « {fr} » appears! It means "{en}". Throw a flashcard at it.',
    "Today's unsolicited vocabulary: « {fr} » ({en}). No refunds.",
    'Somewhere in "{title}", « {fr} » is waiting for you. It means "{en}".',
    '« {fr} » = "{en}". As seen in "{title}". Collect them all.',
    'The frog already knows « {fr} » ({en}). Don\'t let a frog outpace you. Croâ.',
    'Forgetting « {fr} » ({en}) is step one of remembering it forever. Science says so. So does the hourglass.',
    'One day « {fr} » ({en}) will surface mid-sentence exactly when you need it. Today is the deposit.',
    'Drop « {fr} » ({en}) at dinner and refuse to translate. That\'s not rudeness, that\'s immersion.',
]

E_TEMPLATES = [
    'Repeat after absolutely no one: « {exfr} » - "{exen}"',
    'Overheard in "{title}": « {exfr} » ("{exen}")',
    'Your daily out-of-context French: « {exfr} » - "{exen}". Context sold separately.',
]

U_TEMPLATES = [
    '"{title}" has {nex} exercises. At least one of them misses you.',
    'Unit report: "{title}" ({lvl}) teaches {nv} words. The frog memorised them in one croak.',
]


def main() -> int:
    units = []
    for p in sorted(glob.glob("content/*/*/lesson.json")):
        lesson = json.load(io.open(p, encoding="utf-8"))
        exp = p.replace("lesson.json", "exercises.json")
        try:
            nex = len(json.load(io.open(exp, encoding="utf-8"))["exercises"])
        except Exception:
            nex = 0
        units.append((lesson, nex))

    seen: set[str] = set()
    out: list[str] = []

    def push(line: str) -> None:
        if line not in seen:
            seen.add(line)
            out.append(line)

    for line in HANDWRITTEN:
        push(line)

    vocab_pool = []
    example_pool = []
    for lesson, _ in units:
        lvl = lesson["level"].upper()
        title = lesson["title"]
        for v in lesson.get("vocabulary", []):
            vocab_pool.append((v["fr"], v["en"], lvl, title))
            if v.get("exampleFr") and v.get("exampleEn"):
                example_pool.append((v["exampleFr"], v["exampleEn"], title))

    # pass 1: one vocab line per card, template rotating
    for i, (fr, en, lvl, title) in enumerate(vocab_pool):
        push(V_TEMPLATES[i % len(V_TEMPLATES)].format(fr=fr, en=en, lvl=lvl, title=title))
    # pass 2: one example line per card
    for i, (exfr, exen, title) in enumerate(example_pool):
        push(E_TEMPLATES[i % len(E_TEMPLATES)].format(exfr=exfr, exen=exen, title=title))
    # pass 3: unit facts
    for lesson, nex in units:
        for t in U_TEMPLATES:
            push(t.format(title=lesson["title"], lvl=lesson["level"].upper(),
                          nv=len(lesson.get("vocabulary", [])), nex=nex))
    # pass 4: second vocab pass with shifted templates (different line per word)
    for i, (fr, en, lvl, title) in enumerate(vocab_pool):
        if len(out) >= TARGET:
            break
        push(V_TEMPLATES[(i + 3) % len(V_TEMPLATES)].format(fr=fr, en=en, lvl=lvl, title=title))
    # pass 5: second example pass, shifted
    for i, (exfr, exen, title) in enumerate(example_pool):
        if len(out) >= TARGET:
            break
        push(E_TEMPLATES[(i + 1) % len(E_TEMPLATES)].format(exfr=exfr, exen=exen, title=title))

    if len(out) < TARGET:
        print(f"WARNING: only {len(out)} lines available; padding with numbered frog wisdom")
        n = 1
        while len(out) < TARGET:
            push(f"Frog wisdom #{n}: croâ. (Trois. He means trois.)")
            n += 1
    out = out[:TARGET]
    # the Kim trio and the handwritten core are at the front, untouchable
    assert out[0].startswith("Did you know? There are exactly 3,333")
    assert len(out) == TARGET, len(out)

    body = ",\n".join(json.dumps(s, ensure_ascii=False) for s in out)
    ts = (
        "/**\n"
        " * GENERATED by scripts/build_splashes.py - do not edit by hand.\n"
        " * Exactly 3,333 splash lines: a handwritten core (jokes, facts, Kim's trio)\n"
        " * plus lines generated from Florine's own vocabulary corpus.\n"
        " * Why 3,333? Kim said it's lucky, and a frog agreed: croa croa = trois trois.\n"
        " */\n"
        f"export const SPLASHES: string[] = [\n{body},\n];\n"
    )
    io.open(OUT, "w", encoding="utf-8", newline="\n").write(ts)
    print(f"wrote {OUT}: {len(out)} splashes "
          f"({len(HANDWRITTEN)} handwritten, {len(vocab_pool)} vocab cards, {len(example_pool)} examples)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
