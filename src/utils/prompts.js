import { Brain, MapPin, Lightbulb, Swords } from 'lucide-react';

export const categories = {
  person: {
    name: 'Person',
    icon: Brain,
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Berømte personer, karakterer & erhverv'
  },
  sted: {
    name: 'Sted',
    icon: MapPin,
    gradient: 'from-emerald-600 to-teal-700',
    description: 'Geografiske lokationer & steder'
  },
  ting: {
    name: 'Ting',
    icon: Lightbulb,
    gradient: 'from-amber-600 to-orange-700',
    description: 'Objekter, koncepter & idéer'
  },
  begivenhed: {
    name: 'Begivenhed',
    icon: Swords,
    gradient: 'from-purple-600 to-pink-700',
    description: 'Historiske begivenheder & øjeblikke'
  }
};

export const getDifficultyLabel = (value) => {
  if (value <= 10) return 'Børneniveau';
  if (value <= 25) return 'Meget let';
  if (value <= 40) return 'Let';
  if (value <= 60) return 'Normal';
  if (value <= 75) return 'Svær';
  if (value <= 90) return 'Meget svær';
  return 'Ekspert';
};

export const getDifficultyDescription = (value) => {
  if (value <= 10) return 'For små børn (3-6 år)';
  if (value <= 25) return 'For børn og begyndere';
  if (value <= 40) return 'Velkendte emner for de fleste';
  if (value <= 60) return 'Standard voksen trivia';
  if (value <= 75) return 'Kræver god almen viden';
  if (value <= 90) return 'Udfordrende selv for vidende';
  return 'Kun for eksperter og specialister';
};

const categoryDescriptions = {
  person: {
    description: 'en person, karakter, dyr, gruppe eller erhverv',
    subTypes: [
      'idrætsudøver eller atlet',
      'musiker, sanger eller band',
      'fiktiv karakter fra film, bog eller spil',
      'videnskabsperson eller opfinder',
      'YouTuber, streamer eller influencer',
      'historisk person',
      'kunstner, fotograf eller designer',
      'politiker eller leder',
      'kok, forfatter eller tv-vært',
      'mytologisk figur eller folkeeventyr-karakter',
      'aktivist eller humanitær person',
      'filosof eller tænker',
      'kriminel eller berygtet person',
      'eventyrer eller opdagelsesrejsende',
    ],
    examples: {
      1: 'mor, far, hund, kat, baby, lærer',
      10: 'Pippi Langstrømpe, julemanden, Mickey Mouse, Gurli Gris',
      25: 'Dronning Margrethe, Harry Potter, Ronaldo, Taylor Swift',
      40: 'Marie Curie, Frida Kahlo, Bob Marley, Sokrates, Mulan',
      50: 'Nikola Tesla, Amelia Earhart, Miyamoto Musashi, Billie Holiday',
      60: 'Rosalind Franklin, Sitting Bull, Mary Shelley, Niels Bohr',
      75: 'Hypatia, Tycho Brahe, Sappho, Alan Turing, Boudica',
      90: 'Ada Lovelace, Ibn Khaldun, Emmy Noether, Mary Anning',
      100: 'Srinivasa Ramanujan, Hedy Lamarr, Al-Jazari, Lise Meitner'
    }
  },
  sted: {
    description: 'et sted, lokation, bygning eller naturligt fænomen',
    subTypes: [
      'naturligt vidunder eller landskab',
      'moderne arkitektur eller skyskraber',
      'gammelt tempel, ruin eller historisk sted',
      'ø, sø eller bjerg',
      'by, kvarter eller gade',
      'underjordisk sted, hule eller mine',
      'park, have eller naturreservat',
      'bro, dæmning eller ingeniørbedrift',
      'stadion, arena eller sportssted',
      'museum, bibliotek eller kulturelt sted',
      'marked, basar eller gastronomisk destination',
      'ørken, vulkan eller ekstremt miljø',
    ],
    examples: {
      1: 'hjem, have, legeplads, skov, strand',
      10: 'zoo, svømmehal, Legoland, bibliotek',
      25: 'Eiffeltårnet, Den Lille Havfrue, Taj Mahal, Grand Canyon',
      40: 'Colosseum, Niagara Falls, Den Kinesiske Mur, Santorini',
      50: 'Angkor Wat, Serengeti, Kronborg, Galápagosøerne',
      60: 'Petra, Moai-statuerne, Meteora, Dead Sea, Mont Blanc',
      75: 'Socotra, Borobudur, Cappadocia, Salar de Uyuni',
      90: 'Göbekli Tepe, Skellig Michael, Darvaza-krateret, Zhangjiajie',
      100: 'Derinkuyu, Newgrange, Sigiriya, Son Doong-hulen'
    }
  },
  ting: {
    description: 'en genstand, objekt, koncept eller opfindelse',
    subTypes: [
      'hverdagsgenstand eller værktøj',
      'mad, drik eller ingrediens',
      'musikinstrument',
      'transportmiddel eller køretøj',
      'tøj, stof eller materiale',
      'teknologisk opfindelse',
      'legetøj, spil eller sport',
      'naturligt fænomen eller element',
      'medicin, behandling eller kropsrelateret',
      'kunstværk eller kulturelt objekt',
      'byggeri eller arkitektonisk element',
      'våben, rustning eller militærudstyr',
    ],
    examples: {
      1: 'sten, bog, blyant, kop, stol, bold',
      10: 'LEGO, cykel, fodbold, mobiltelefon, guitar',
      25: 'kompas, mikroskop, skateboard, espressomaskine',
      40: 'teleskop, vinylplade, GPS, solpanel, saxofon',
      50: 'stetoskop, kimchi, abacus, boomerang, silke',
      60: 'astrolabium, damaskusstål, katana, cembalo',
      75: 'orrery, Tesla-spole, Rosettastenen, Fabergé-æg',
      90: 'Antikythera-mekanismen, volvelle, qanat, Greek fire',
      100: 'aeolipile, Ulfberht-sværd, Lycurgus-koppen, Stradivarius-cello'
    }
  },
  begivenhed: {
    description: 'en begivenhed, opdagelse, opfindelse eller vigtigt øjeblik',
    subTypes: [
      'naturkatastrofe eller klimabegivenhed',
      'videnskabelig opdagelse eller gennembrud',
      'sportsbegivenhed eller rekord',
      'politisk revolution eller oprør',
      'kulturelt øjeblik eller trend',
      'teknologisk milepæl',
      'rumfart eller astronomisk begivenhed',
      'epidemi, pandemi eller medicinsk gennembrud',
      'kunstverk, udgivelse eller premiere',
      'krig, slag eller fredsaftale',
      'opdagelsesrejse eller ekspedition',
      'retssag, skandale eller kontrovers',
    ],
    examples: {
      1: 'fødseldag, jul, påske, nytår, ferie',
      10: 'første skoledag, VM i fodbold, OL, halloween',
      25: 'månelandingen, Titanic synker, Danmark vinder EM 92',
      40: 'Berlinmurens fald, Woodstock, Tjernobyl, Boston Tea Party',
      50: 'Den franske revolution, Pompeji, opdagelsen af penicillin',
      60: 'Magna Carta, Gutenbergs trykpresse, Rosetta-missionen',
      75: 'Vestfalske fred, Krakataus udbrud, Voyager 1 forlader solsystemet',
      90: 'Carrington Event, Tunguska-eksplosionen, Slag ved Dybbøl',
      100: 'Toba-udbruddet, Younger Dryas, Bronze Age collapse'
    }
  }
};

const difficultyDescriptions = {
  1: 'ekstrem begynderniveau - for de allermindste børn (3-4 år), kun de mest basale koncepter',
  10: 'børneniveau - velkendt for børn i 5-8 års alderen',
  25: 'let niveau - kendt af næsten alle, inklusiv børn',
  40: 'under middel - ret velkendt for de fleste voksne',
  50: 'middelniveau - standard almen viden, folkeskoleniveau',
  60: 'over middel - kræver god almen viden eller gymnasial uddannelse',
  75: 'svært niveau - kræver omfattende viden eller specialinteresse',
  85: 'meget svært - typisk kun kendt af folk med videregående uddannelse eller dyb interesse',
  100: 'ekspertniveau - primært kendt af akademikere eller specialister inden for området'
};

const clueComplexityDescriptions = {
  1: 'Børneniveau: Ekstrem simple fakta som alle kender. Brug kun de mest basale beskrivelser. Eksempel: "Det er gult og skinner på himlen" for solen.',
  10: 'Meget basale fakta: Brug almindelig hverdagsviden og direkte beskrivelser. Fokuser på universelt kendte egenskaber.',
  20: 'Almindelige fakta: Anvend bred almen viden som de fleste voksne kender. Simple historiske eller kulturelle referencer.',
  30: 'Standard fakta: Brug fakta fra almindelig skoleundervisning og populærkultur. Kan inkludere årstal og navne.',
  40: 'Moderate fakta: Kombiner almindelig viden med mindre kendte detaljer. Inkluder sekundære fakta om kendte emner.',
  50: 'Dybere fakta: Standard trivia-niveau med specifikke detaljer og mindre kendte sammenhænge.',
  60: 'Specialiserede fakta: Mere obskure historiske, videnskabelige eller kulturelle detaljer. Kræver bredere viden.',
  70: 'Obskure fakta: Nicheområder og sjældent omtalte begivenheder. Kombiner flere vidensområder.',
  80: 'Meget obskure fakta: Highly specialiseret viden med komplekse referencer. Kræver ekspertviden inden for områder.',
  90: 'Ekstremt obskure fakta: Ultra-niche viden kendt kun af specialister.',
  100: 'Maksimal obskuritet: Næsten ukendte fakta kombineret med kryptiske formuleringer.'
};

const flavorAngles = [
  'Tænk på noget fra hverdagen som folk tager for givet',
  'Tænk på noget som er forbundet med en bestemt sans (lugt, smag, lyd, følelse)',
  'Tænk på noget kontroversielt, mystisk eller omdiskuteret',
  'Tænk på noget fra en ikke-vestlig kultur eller tradition',
  'Tænk på noget moderne og nutidigt',
  'Tænk på noget gammelt, glemt eller overset',
  'Tænk på noget som har en sjov eller overraskende historie bag sig',
  'Tænk på noget forbundet med natur, dyr eller havet',
  'Tænk på noget som børn elsker men voksne har glemt',
  'Tænk på noget fra Norden eller dansk kultur',
  'Tænk på noget som de fleste kender men aldrig tænker over',
  'Tænk på noget som har ændret verden på en uventet måde',
  'Tænk på noget man kan opleve med sine sanser',
  'Tænk på noget forbundet med mad, fest eller traditioner',
  'Tænk på noget fra populærkulturen som ikke er det mest oplagte valg',
  'Tænk kreativt og vælg noget der overrasker',
];

const getRandomFlavor = () => {
  return flavorAngles[Math.floor(Math.random() * flavorAngles.length)];
};

export const getPrompt = (category, difficulty, usedItems, customTheme = '', numberOfClues = 20, clueDifficulty = 50) => {
  const categoryInfo = categoryDescriptions[category];

  const usedInCategory = usedItems
    .filter(item => item.category === category)
    .map(item => item.item)
    .slice(-15);

  const descriptionKeys = Object.keys(difficultyDescriptions).map(Number);
  const closestDescriptionKey = descriptionKeys.reduce((prev, curr) =>
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );

  const themeSection = customTheme
    ? `\n## TEMA-KRAV\nAlle emner SKAL relatere til: "${customTheme}"\n- Vælg kun emner der passer både til temaet OG kategorien\n`
    : '';

  const flavor = getRandomFlavor();
  const randomSubType = categoryInfo.subTypes[Math.floor(Math.random() * categoryInfo.subTypes.length)];

  return `# OPGAVE: ${numberOfClues} Spørgsmål Spil

## SPIL-PARAMETRE
- **Kategori**: ${categories[category].name} - ${categoryInfo.description}
- **Sværhedsgrad for svar**: ${difficulty}% (${getDifficultyLabel(difficulty)})
- **Sværhedsgrad for ledetråde**: ${clueDifficulty}% (${getDifficultyLabel(clueDifficulty)})
- **Antal ledetråde**: ${numberOfClues}
${themeSection}
## VIGTIG: VÆLG ET OVERRASKENDE SVAR
Undgå de mest oplagte "klassiske trivia"-svar. Vælg noget som spillerne ikke forventer, men som stadig er genkendeligt på det valgte sværhedsniveau.

Inspiration: ${flavor}
Måske noget i retning af: ${randomSubType}

### Mulige underkategorier (brug som inspiration, ikke begrænsning):
${categoryInfo.subTypes.map(s => `- ${s}`).join('\n')}

## MÅLGRUPPE
Primært danske spillere, men med fokus på international viden (80% international, 20% dansk/nordisk)

## SVÆRHEDSGRAD FOR SVAR: ${difficulty}%
${difficultyDescriptions[closestDescriptionKey]}

### Referenceskala for ${categories[category].name} (BRUG IKKE DISSE DIREKTE — find dit eget):
${Object.entries(categoryInfo.examples).map(([level, exampleList]) => {
    const levelNum = parseInt(level);
    const isClosest = Math.abs(levelNum - difficulty) === Math.min(...Object.keys(categoryInfo.examples).map(k => Math.abs(parseInt(k) - difficulty)));
    return `${isClosest ? '**→' : '  '} ${level}%: ${exampleList}${isClosest ? ' ←**' : ''}`;
  }).join('\n')}

## ALLEREDE BRUGTE (undgå disse)
${usedInCategory.length > 0 ? usedInCategory.join(', ') : 'Ingen endnu'}

## LEDETRÅDS-INSTRUKTIONER

### Sværhedsgrad for ledetråde: ${clueDifficulty}%

### Sværhedsskala for ledetråde:
${Object.entries(clueComplexityDescriptions).map(([level, description]) => {
    const levelNum = parseInt(level);
    const isClosest = Math.abs(levelNum - clueDifficulty) === Math.min(...Object.keys(clueComplexityDescriptions).map(k => Math.abs(parseInt(k) - clueDifficulty)));
    return `${isClosest ? '**→' : '  '} ${level}%: ${description}${isClosest ? ' ←**' : ''}`;
  }).join('\n')}

### Ledetråds-principper:
1. **Nogenlunde ensartet sværhed**: Ledetrådene skal ligge OMKRING ${clueDifficulty}% — lidt variation er ok, men ingen ledetråd bør være dramatisk lettere eller sværere end resten. Spillerne skal typisk bruge 50-75% af ledetrådene før de kan gætte svaret.
2. **Ingen afsløringer**: Ingen enkelt ledetråd må gøre svaret oplagt. Hver ledetråd giver kun et delvist billede — svaret kræver at man kombinerer flere ledetråde.
3. **Indirekte**: Undgå at nævne navne, direkte titler, eller kendte citater der straks afslører svaret. Brug omskrivninger, kontekst og relationer.
4. **Fakta-variation**: Bland historiske, geografiske, tekniske, kulturelle og sensoriske fakta
5. **Uafhængighed**: Hver ledetråd skal kunne stå alene — de må ikke bygge på hinanden
6. **Ingen rækkefølge**: Ledetrådene har INGEN bestemt rækkefølge — de bliver vist tilfældigt

## OUTPUT-FORMAT
Svar KUN med ren JSON:
{
  "item": "det valgte emne",
  "clues": ["ledetråd 1", "ledetråd 2", ..., "ledetråd ${numberOfClues}"]
}

Ingen markdown, ingen forklaringer, ingen kodeblokke — kun JSON.`;
};

export const defaultCategories = categories;
