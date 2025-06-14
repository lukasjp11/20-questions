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
      60: 'Marie Curie, Sokrates, Frida Kahlo, Nikola Tesla, Marco Polo',
      75: 'Niels Bohr, Virginia Woolf, Archimedes, Stradivarius, Dostoyevsky',
      90: 'Ada Lovelace, Ibn Khaldun, Hypatia, Tycho Brahe, Mary Anning',
      100: 'Srinivasa Ramanujan, Hedy Lamarr, Ibn al-Haytham, Lise Meitner'
    }
  },
  sted: {
    description: 'et berømt rejsemål, monument, vartegn, bygning eller naturligt vidunder',
    examples: {
      1: 'hjem, have, legeplads, skov, sø',
      10: 'zoo, svømmehal, strand, bondegård, akvarium',
      25: 'Eiffeltårnet, Frihedsgudinden, Disneyland, Taj Mahal, Stonehenge',
      40: 'Grand Canyon, Colosseum, Niagara Falls, Den Kinesiske Mur, Mount Fuji',
      50: 'Machu Picchu, Angkor Wat, Louvre, Alhambra, Burj Khalifa',
      60: 'Petra, Moai-statuerne, Uluru, Neuschwanstein, Mont Saint-Michel',
      75: 'Socotra, Meteora, Derinkuyu, Borobudur, Pamukkale',
      90: 'Chand Baori, Skellig Michael, Gobekli Tepe, Kiyomizu-dera, Banaue-risterrasserne',
      100: 'Derinkuyu, Gangkhar Puensum, Antelope Canyon, Mount Roraima, Taktsang-klostret'
    }
  },
  ting: {
    description: 'en genstand, koncept, dyr, opfindelse eller fænomen',
    examples: {
      1: 'bold, vand, sol, træ, bil',
      10: 'cykel, is, chokolade, hund, telefon',
      25: 'computer, pizza, elefant, flyvemaskine, fodbold',
      40: 'internet, demokrati, dinosaur, mikroskop, vitamin',
      50: 'DNA, klimaforandringer, kunstig intelligens, antibiotika',
      60: 'kvantemekanik, blockchain, CRISPR, mørkt stof, stamceller',
      75: 'kvantekryptering, epigenetik, neutrino, graphene, Higgs boson',
      90: 'topologiske isolatorer, prioner, kvantesuperposition, metamaterialer',
      100: 'anyoner, skyrmioner, Majorana fermioner, tachyoner'
    }
  },
  begivenhed: {
    description: 'en historisk begivenhed, opdagelse, opfindelse eller vigtigt øjeblik',
    examples: {
      1: 'fødseldag, jul, sommer, nat, morgen',
      10: 'nytår, påske, første skoledag, VM i fodbold',
      25: 'månelandingen, OL, opdagelsen af Amerika, Titanic synker',
      40: 'Berlinmurens fald, 2. verdenskrig, internettet opfindes, 9/11',
      50: 'Den franske revolution, renæssancen, industrielle revolution',
      60: 'Sorte Død, opdagelsen af penicillin, Magna Carta, Reformationen',
      75: 'Vestfalske fred, Rosettastenen findes, DNA-struktur opdages',
      90: 'Carrington Event, År uden sommer 1816, Tunguska-eksplosionen',
      100: 'Toba-udbruddet, Younger Dryas, Kambrium eksplosionen'
    }
  }
};

const difficultyDescriptions = {
  1: 'ekstrem begynderniveau - for de allermindste børn (3-4 år), kun de mest basale koncepter',
  10: 'børneniveau - velkendt for børn i 5-8 års alderen',
  25: 'let niveau - kendt af næsten alle, inklusiv børn',
  40: 'under middel - ret velkendt for de fleste voksne',
  50: 'middelniveau - standard voksen trivia, kræver almindelig almen viden',
  60: 'over middel - kræver god almen viden eller interesse for emnet',
  75: 'svært niveau - kræver omfattende viden eller specialinteresse',
  90: 'meget svært - kun kendt af folk med dyb viden inden for området',
  100: 'ekspertniveau - ekstremt obskurt, kendt af meget få mennesker'
};

export const getPrompt = (category, difficulty, usedItems, customTheme = '', numberOfClues = 20) => {
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

  const themeSection = customTheme 
    ? `\nVIGTIGT TEMA: Alle emner SKAL relatere til "${customTheme}". 
Vælg kun emner der passer til dette tema OG den valgte kategori.
Hvis temaet er for specifikt til at finde ${categoryInfo.description} på det givne sværhedsniveau, så tilpas sværheden en smule men hold dig til temaet.\n`
    : '';

  return `Du er vært for et ${numberOfClues} Questions spil. Din opgave er at vælge ${categoryInfo.description} som er ${difficultyDescriptions[closestDescriptionKey]}.

KATEGORI: ${categories[category].name}
SVÆRHEDSGRAD: ${difficulty}% (${getDifficultyLabel(difficulty)})
${themeSection}
EKSEMPLER på passende emner for denne sværhedsgrad:
${examples}

MEGET VIGTIGT - ALLEREDE BRUGTE EMNER I DENNE KATEGORI:
${usedInCategory.length > 0 ? usedInCategory.join(', ') : 'Ingen brugte emner i denne kategori endnu'}

Du MÅ ABSOLUT IKKE vælge noget der allerede er brugt!

REGLER FOR VALG AF EMNE:
1. Emnet SKAL matche sværhedsgraden præcist (${difficulty}%)
   - 1%: Ekstrem begynder (3-4 år) - kun de mest basale ting
   - 10%: Børneniveau (5-8 år) 
   - 25%: Let - kendt af næsten alle
   - 50%: Middel - standard voksen trivia
   - 75%: Svær - kræver god viden
   - 90%: Meget svær - kun for vidende
   - 100%: Ekspert - ekstremt obskurt
2. ${customTheme ? `Emnet SKAL relatere til temaet "${customTheme}"` : 'Emnet skal være internationalt relevant'}
3. Emnet MÅ IKKE være på listen over brugte emner
4. Match sværheden fra eksemplerne præcist

MEGET VIGTIGT FOR LEDETRÅDE:
- Tilpas ledetrådenes sværhed til målgruppen:
  * 1-25%: Simple, konkrete ledetråde med basale ord
  * 50%: Standard trivia-niveau ledetråde  
  * 75-100%: Komplekse ledetråde der kræver specialviden
- Hver ledetråd skal være HELT UAFHÆNGIG af de andre
- Bland forskellige typer hints
- Undgå åbenlyse sammenhænge mellem ledetråde

Special-ledetråde (KUN hvis sværhed > 20%):
- Hvis sværhed > 20%, vælg 3 TILFÆLDIGE positioner mellem 1-${numberOfClues}
- Indsæt disse special-ledetråde:
  • "byt plads med forreste"
  • "ryk 3 felter frem"
  • "Du har 2 gæt"

Svar KUN med følgende JSON format:
{
  "item": "det valgte emne",
  "clues": [${numberOfClues} ledetråde${difficulty > 20 ? ' med præcis 3 special-ledetråde på tilfældige positioner' : ' uden special-ledetråde'}]
}
Respond ONLY with valid JSON. Do not include any markdown or explanations.`;
};

export const defaultCategories = categories;