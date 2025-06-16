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
  1: 'Ekstrem simple og direkte ledetråde med helt basale ord',
  25: 'Simple, direkte ledetråde med almindelige ord og konkrete beskrivelser',
  50: 'Standard trivia-niveau ledetråde med normal kompleksitet og nogle indirekte hints',
  75: 'Mere indirekte og kryptiske ledetråde der kræver sammenhænge og logisk tænkning',
  100: 'Meget indirekte og sofistikerede ledetråde der kræver lateral tænkning og dyb forståelse'
};

export const getPrompt = (category, difficulty, usedItems, customTheme = '', numberOfClues = 20, clueDifficulty = 50) => {  
  // Find the closest difficulty example
  const difficultyKeys = Object.keys(categoryDescriptions[category].examples).map(Number);
  const closestDifficulty = difficultyKeys.reduce((prev, curr) => 
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );

  const categoryInfo = categoryDescriptions[category];
  const examples = categoryInfo.examples[closestDifficulty];
  const usedInCategory = usedItems
    .filter(item => item.category === category)
    .map(item => item.item);

  // Find closest difficulty description
  const descriptionKeys = Object.keys(difficultyDescriptions).map(Number);
  const closestDescriptionKey = descriptionKeys.reduce((prev, curr) => 
    Math.abs(curr - difficulty) < Math.abs(prev - difficulty) ? curr : prev
  );

  // Find closest clue complexity description
  const clueComplexityKeys = Object.keys(clueComplexityDescriptions).map(Number);
  const closestClueComplexityKey = clueComplexityKeys.reduce((prev, curr) => 
    Math.abs(curr - clueDifficulty) < Math.abs(prev - clueDifficulty) ? curr : prev
  );

  const themeSection = customTheme 
    ? `\nVIGTIGT TEMA: Alle emner SKAL relatere til "${customTheme}". 
Vælg kun emner der passer til dette tema OG den valgte kategori.
Hvis temaet er for specifikt til at finde ${categoryInfo.description} på det givne sværhedsniveau, så tilpas sværheden en smule men hold dig til temaet.\n`
    : '';

  return `Du er vært for et ${numberOfClues} Questions spil. Din opgave er at vælge ${categoryInfo.description} som er ${difficultyDescriptions[closestDescriptionKey]}.

KATEGORI: ${categories[category].name}
SVÆRHEDSGRAD FOR SVAR: ${difficulty}% (${getDifficultyLabel(difficulty)})
SVÆRHEDSGRAD FOR LEDETRÅDE: ${clueDifficulty}% (${getDifficultyLabel(clueDifficulty)})
${themeSection}
VIGTIGT: Dit publikum er primært danskere, men fokuser hovedsageligt på international/universel viden. Omkring 85% af dine valg bør være internationalt kendte, mens 15% kan være dansk/nordisk relevante.

EKSEMPLER på passende emner for denne sværhedsgrad (KUN TIL REFERENCE - VÆLG IKKE DISSE DIREKTE):
${examples}

MEGET VIGTIGT: 
- Du MÅ IKKE vælge nogen af eksemplerne direkte! De er kun til at vise sværhedsniveauet.
- Find dit EGET emne der matcher samme sværhedsgrad som eksemplerne.

ALLEREDE BRUGTE EMNER I DENNE KATEGORI:
${usedInCategory.length > 0 ? usedInCategory.join(', ') : 'Ingen brugte emner i denne kategori endnu'}

Du MÅ ABSOLUT IKKE vælge noget der allerede er brugt!

REGLER FOR VALG AF EMNE:
1. Emnet SKAL matche sværhedsgraden præcist (${difficulty}%)
   - 1%: Ekstrem begynder (3-4 år) - kun de mest basale ting
   - 10%: Børneniveau (5-8 år) 
   - 25%: Let - kendt af næsten alle
   - 50%: Middel - standard almen viden
   - 75%: Svær - kræver god viden
   - 90%: Meget svær - kun for vidende
   - 100%: Ekspert - primært kendt af specialister
2. ${customTheme ? `Emnet SKAL relatere til temaet "${customTheme}"` : 'Prioriter internationalt kendte emner (85%) med enkelte danske/nordiske elementer (15%)'}
3. Emnet MÅ IKKE være på listen over brugte emner
4. Emnet MÅ IKKE være et af eksemplerne

MEGET VIGTIGT FOR LEDETRÅDE:
- LEDETRÅDE SVÆRHEDSGRAD: ${clueDifficulty}% - ${clueComplexityDescriptions[closestClueComplexityKey]}
- Fokus på INDHOLD over ordkompleksitet:
  * 1-25%: Direkte, konkrete ledetråde med simple ord
  * 50%: Balancerede ledetråde med nogle indirekte elementer
  * 75-100%: Fokus på indirekte hints, sammenhænge og logiske spring
- Brug primært almindelige ord, men gør selve ledetråden mere kryptisk ved højere sværhed, dog stadig nogle komplekse ord tilladt ved 70-100%
- Hver ledetråd skal være HELT UAFHÆNGIG af de andre
- Bland forskellige typer hints (fysiske egenskaber, kontekst, funktion, historie, osv.)
- Undgå åbenlyse sammenhænge mellem ledetråde
- Generer præcis ${numberOfClues} almindelige ledetråde
- Svar KUN på dansk

Svar KUN med følgende JSON format:
{
  "item": "det valgte emne",
  "clues": [${numberOfClues} almindelige ledetråde uden special-ledetråde]
}
Respond ONLY with valid JSON. Do not include any markdown or explanations.`;
};

export const defaultCategories = categories;