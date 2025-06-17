import { Brain, MapPin, Lightbulb, Sparkles } from 'lucide-react';

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
    icon: Sparkles, 
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
    description: 'en berømt person, fiktiv karakter, dyr med personlighed, gruppe eller erhverv',
    examples: {
      1: 'mor, far, hund, kat, baby, lærer',
      10: 'Pippi Langstrømpe, julemanden, Mickey Mouse, politimand, brandmand',
      25: 'Dronning Margrethe, Donald Duck, Harry Potter, Batman, Ronaldo',
      40: 'Einstein, Leonardo da Vinci, Madonna, The Beatles, Sherlock Holmes',
      50: 'Darwin, Beethoven, Van Gogh, Winston Churchill, Cleopatra',
      60: 'Marie Curie, Niels Bohr, Frida Kahlo, Nikola Tesla, Marco Polo',
      75: 'Virginia Woolf, Archimedes, Stradivarius, Dostoyevsky, Vermeer',
      90: 'Ada Lovelace, Ibn Khaldun, Hypatia, Tycho Brahe, Mary Anning',
      100: 'Srinivasa Ramanujan, Hedy Lamarr, Ibn al-Haytham, Lise Meitner'
    }
  },
  sted: {
    description: 'et berømt rejsemål, monument, vartegn, bygning eller naturligt vidunder',
    examples: {
      1: 'hjem, have, legeplads, skov, strand',
      10: 'zoo, svømmehal, strand, Legoland, bibliotek',
      25: 'Eiffeltårnet, Den Lille Havfrue, Disneyland, Taj Mahal, Stonehenge',
      40: 'Grand Canyon, Colosseum, Niagara Falls, Den Kinesiske Mur, Mount Fuji',
      50: 'Machu Picchu, Angkor Wat, Louvre, Kronborg, Burj Khalifa',
      60: 'Petra, Moai-statuerne, Uluru, Neuschwanstein, Mont Saint-Michel',
      75: 'Socotra, Meteora, Borobudur, Hagia Sophia, Chichen Itza',
      90: 'Chand Baori, Skellig Michael, Gobekli Tepe, Roskilde Domkirke, Banaue-terrasserne',
      100: 'Derinkuyu, Newgrange, Sigiriya, Palmyra, Taktsang-klostret'
    }
  },
  ting: {
    description: 'en genstand, objekt eller ting',
    examples: {
      1:   'sten, bog, blyant, kop, stol',
      10:  'LEGO, cykel, fodbold, mobiltelefon, computer',
      25:  'kompas, mikroskop, barnevogn, højtaler, paraply',
      40:  'teleskop, GPS, skrivemaskine, solpanel, vindmølle',
      50:  'satellit, 3D-printer, MR-scanner, laser, hologram',
      60:  'particle accelerator, insulin-pen, pacemaker, sonar, radar',
      75:  'kvantecomputer, DNA-sekventering, radioteleskop, elektronmikroskop',
      90:  'CRISPR, hadron collider, neutrino-detektor, tokamak-reaktor',
      100: 'gravitationsbølge-detektor, kvantekryptografi, metamateriale, graphene-transistor'
    }
  },
  begivenhed: {
    description: 'en historisk begivenhed, opdagelse, opfindelse eller vigtigt øjeblik',
    examples: {
      1: 'fødseldag, jul, påske, nytår, ferie',
      10: 'første skoledag, VM i fodbold, OL, halloween',
      25: 'månelandingen, internettet opfindes, Titanic synker, Danmark vinder EM 1992',
      40: 'Berlinmurens fald, 2. verdenskrig, 9/11, Fukushima',
      50: 'Den franske revolution, renæssancen, industrielle revolution, Koldkrigen',
      60: 'Sorte Død, opdagelsen af penicillin, Magna Carta, Reformationen',
      75: 'Vestfalske fred, Rosettastenen findes, DNA-struktur opdages, Manhattan Project',
      90: 'Carrington Event, År uden sommer 1816, Tunguska-eksplosionen, Slag ved Dybbøl',
      100: 'Toba-udbruddet, Younger Dryas, Kambrium eksplosionen, Bronze Age collapse'
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
  10: 'Meget basale fakta: Brug almindelig hverdagsviden og direkte beskrivelser. Fokuser på universelt kendte egenskaber. Eksempel: "Hovedstaden i Frankrig kendt for Eiffeltårnet" for Paris.',
  20: 'Almindelige fakta: Anvend bred almen viden som de fleste voksne kender. Simple historiske eller kulturelle referencer. Eksempel: "Den amerikanske præsident under borgerkrigen" for Lincoln.',
  30: 'Standard fakta: Brug fakta fra almindelig skoleundervisning og populærkultur. Kan inkludere årstal og navne. Eksempel: "Elementet med atomnummer 79 brugt i smykker" for guld.',
  40: 'Moderate fakta: Kombiner almindelig viden med mindre kendte detaljer. Inkluder sekundære fakta om kendte emner. Eksempel: "Napoleons eksilø i Middelhavet før Elba" for Korsika.',
  50: 'Dybere fakta: Standard trivia-niveau med specifikke detaljer og mindre kendte sammenhænge. Eksempel: "Den byzantinske kejser der genskabte Romerriget kortvarigt i 500-tallet" for Justinian.',
  60: 'Specialiserede fakta: Mere obskure historiske, videnskabelige eller kulturelle detaljer. Kræver bredere viden. Eksempel: "Opdageren af bakteriofager i 1915" for Frederick Twort.',
  70: 'Obskure fakta: Nicheområder og sjældent omtalte begivenheder. Kombiner flere vidensområder. Eksempel: "Den persiske matematiker der først beskrev binomialkoefficienter i 1000-tallet" for Al-Karaji.',
  80: 'Meget obskure fakta: Highly specialiseret viden med komplekse referencer. Kræver ekspertviden inden for områder. Eksempel: "Enzymet der katalyserer det hastighedsbegrænsende trin i heme-biosyntesen" for ALA-syntase.',
  90: 'Ekstremt obskure fakta: Ultra-niche viden kendt kun af specialister. Historiske footnotes og glemte detaljer. Eksempel: "Den tredje underskriver af Treaty of Waitangi der senere trak sin støtte tilbage" for Marupō.',
  100: 'Maksimal obskuritet: Næsten ukendte fakta kombineret med kryptiske formuleringer. Eksempel: "Författaren av den förlorade isländska sagan om Þorsteinn uxafótr" for ukendt forfatter.'
};

export const getPrompt = (category, difficulty, usedItems, customTheme = '', numberOfClues = 20, clueDifficulty = 50) => {  
  const difficultyKeys = Object.keys(categoryDescriptions[category].examples).map(Number);
  const closestDifficulty = difficultyKeys.reduce((prev, curr) => 
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );

  const categoryInfo = categoryDescriptions[category];
  const examples = categoryInfo.examples[closestDifficulty];
  const usedInCategory = usedItems
    .filter(item => item.category === category)
    .map(item => item.item);

  const descriptionKeys = Object.keys(difficultyDescriptions).map(Number);
  const closestDescriptionKey = descriptionKeys.reduce((prev, curr) => 
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );

  const clueComplexityKeys = Object.keys(clueComplexityDescriptions).map(Number);
  const closestClueComplexityKey = clueComplexityKeys.reduce((prev, curr) => 
    Math.abs(curr - clueDifficulty) < Math.abs(prev - clueDifficulty) ? curr : prev
  );

  const themeSection = customTheme 
    ? `\n## TEMA-KRAV\nAlle emner SKAL relatere til: "${customTheme}"\n- Vælg kun emner der passer både til temaet OG kategorien\n- Hvis temaet er for specifikt, tilpas sværheden lidt men hold fast i temaet\n`
    : '';

  return `# OPGAVE: ${numberOfClues} Spørgsmål Spil

## SPIL-PARAMETRE
- **Kategori**: ${categories[category].name} - ${categoryInfo.description}
- **Sværhedsgrad for svar**: ${difficulty}% (${getDifficultyLabel(difficulty)})
- **Sværhedsgrad for ledetråde**: ${clueDifficulty}% (${getDifficultyLabel(clueDifficulty)})
- **Antal ledetråde**: ${numberOfClues}
${themeSection}
## MÅLGRUPPE
Primært danske spillere, mest fokus på international viden (80% international, 20% dansk/nordisk)

## SVÆRHEDSGRAD DEFINITION
${difficultyDescriptions[closestDescriptionKey]}

### Eksempler på passende emner (KUN TIL REFERENCE - BRUG IKKE DISSE):
${examples}

## ALLEREDE BRUGTE EMNER
${usedInCategory.length > 0 ? `UNDGÅ DISSE: ${usedInCategory.join(', ')}` : 'Ingen brugte emner endnu'}

## LEDETRÅDS-INSTRUKTIONER

### Sværhedsgrad: ${clueDifficulty}%
${clueComplexityDescriptions[closestClueComplexityKey]}

### Ledetråds-principper:
1. **Fakta-fokus**: Baser ledetråde på faktuel viden, men også nogle gange abstrakte beskrivelser
2. **Variation**: Bland forskellige typer fakta (historiske, geografiske, tekniske, kulturelle)
3. **Uafhængighed**: Hver ledetråd skal kunne stå alene
4. **Obskuritet ved høj sværhed**: Ved 60%+ brug mere specialiseret viden

## KRAV TIL OUTPUT

### Du SKAL:
1. Vælge ét emne der matcher sværhedsgraden ${difficulty}% præcist
2. ${customTheme ? `Sikre emnet relaterer til "${customTheme}"` : 'Prioritere internationalt kendte emner'}
3. Generere præcis ${numberOfClues} ledetråde
4. Følge ledetråds-sværheden ${clueDifficulty}%
5. Svare KUN med JSON-format

### Du MÅ IKKE:
1. Bruge eksemplerne direkte
2. Genbruge emner fra listen over brugte emner
3. Inkludere forklaringer eller markdown
4. Lave ledetråde der afslører hinanden

## SVAR-FORMAT
{
  "item": "det valgte emne",
  "clues": [
    "ledetråd 1",
    "ledetråd 2",
    ...
    "ledetråd ${numberOfClues}"
  ]
}

**VIGTIGT**: Svar KUN på dansk og med ren JSON. Ingen markdown, ingen forklaringer.`
};

export const defaultCategories = categories;