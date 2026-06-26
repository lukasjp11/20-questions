export const categoryNames = { person: 'Person', sted: 'Sted', ting: 'Ting', begivenhed: 'Begivenhed' };

const categoryMeta = {
  person: {
    desc: 'en person, karakter, dyr, gruppe eller erhverv',
    subTypes: ['idrætsudøver', 'musiker eller band', 'fiktiv karakter', 'videnskabsperson eller opfinder',
      'streamer, YouTuber eller influencer', 'historisk skikkelse', 'kunstner eller designer', 'politiker eller leder',
      'kok, forfatter eller tv-vært', 'mytologisk figur', 'aktivist eller humanitær', 'filosof eller tænker',
      'berygtet eller kriminel person', 'opdager eller eventyrer', 'erhverv eller faggruppe', 'dyr eller dyreart'],
    forbidden: ['Nikola Tesla', 'Albert Einstein', 'Leonardo da Vinci', 'Marie Curie', 'Frida Kahlo', 'Cleopatra',
      'Isaac Newton', 'Roald Amundsen', 'Ada Lovelace', 'Vincent van Gogh', 'Charles Darwin', 'Mahatma Gandhi',
      'Stephen Hawking', 'Mozart', 'Hedy Lamarr', 'Alan Turing', 'Galileo Galilei', 'Napoleon', 'William Shakespeare'],
  },
  sted: {
    desc: 'et sted, lokation, bygning eller naturligt fænomen',
    subTypes: ['naturligt vidunder', 'moderne bygningsværk', 'gammelt tempel eller ruin', 'ø, sø eller bjerg',
      'by, kvarter eller gade', 'hule, mine eller underjordisk sted', 'park eller naturreservat', 'bro eller ingeniørbedrift',
      'stadion eller arena', 'museum eller kulturhus', 'marked eller madsted', 'ørken, vulkan eller ekstremt miljø'],
    forbidden: ['Eiffeltårnet', 'Den Kinesiske Mur', 'Taj Mahal', 'Colosseum', 'Machu Picchu', 'Grand Canyon',
      'Stonehenge', 'Pyramiderne i Giza', 'Petra', 'Niagara Falls', 'Mount Everest', 'Den Lille Havfrue',
      'Det Skæve Tårn i Pisa', 'Angkor Wat', 'Frihedsgudinden'],
  },
  ting: {
    desc: 'en genstand, opfindelse, koncept eller materiale',
    subTypes: ['hverdagsredskab', 'mad, drik eller ingrediens', 'musikinstrument', 'køretøj eller transportmiddel',
      'tøj, stof eller materiale', 'teknologisk opfindelse', 'legetøj, spil eller sport', 'naturfænomen eller grundstof',
      'medicin eller kropsrelateret', 'kunstværk eller kulturobjekt', 'bygningselement', 'våben eller udstyr', 'abstrakt begreb'],
    forbidden: ['kompas', 'teleskop', 'mikroskop', 'guitar', 'kugleramme', 'boomerang', 'astrolabium', 'katana',
      'Rubiks terning', 'vinylplade', 'dampmaskine', 'trykpresse', 'urværk', 'sekstant', 'grammofon'],
  },
  begivenhed: {
    desc: 'en begivenhed, opdagelse, opfindelse eller et vigtigt øjeblik',
    subTypes: ['naturkatastrofe', 'videnskabeligt gennembrud', 'sportsbegivenhed eller rekord', 'revolution eller oprør',
      'kulturelt øjeblik eller trend', 'teknologisk milepæl', 'rumfart eller astronomisk begivenhed', 'epidemi eller medicinsk gennembrud',
      'udgivelse eller premiere', 'slag eller fredsaftale', 'opdagelsesrejse eller ekspedition', 'skandale eller retssag'],
    forbidden: ['månelandingen', 'Berlinmurens fald', 'Titanic synker', 'Den franske revolution', 'Tjernobyl',
      'Pompeji', 'opdagelsen af penicillin', 'Gutenbergs trykpresse', 'Big Bang', 'Wright-brødrenes flyvning',
      'Den amerikanske uafhængighedserklæring', 'Det Sorte Død'],
  },
};

const ERAS = ['forhistorisk tid', 'oldtiden', 'middelalderen', 'renæssancen', '1700-tallet', '1800-tallet',
  'tidligt 1900-tal', 'efterkrigstiden', '1970-80\'erne', '1990-2000\'erne', 'det seneste årti'];
const REGIONS = ['Norden', 'Vesteuropa', 'Østeuropa', 'Mellemøsten', 'Afrika syd for Sahara', 'Nordafrika',
  'Syd- og Centralasien', 'Østasien', 'Sydøstasien', 'Oceanien', 'Nordamerika', 'Latinamerika', 'oprindelige folk'];

const CLUE_ANGLES = {
  person: [
    'Gerninger & bedrifter — hvad de gjorde eller skabte (uden den ene mest berømte titel)',
    'Felt & rolle — deres fag, kald eller hvad de er kendt FOR (skævt beskrevet)',
    'Relationer — venner, fjender, familie, rivaler, forbilleder',
    'Tid & sted — hvilken epoke og egn de virkede i',
    'Personlighed & væremåde — temperament, vaner, særheder',
    'Udseende & ydre — et fysisk træk eller stil (aldrig navnet)',
    'Eftermæle — hvordan de huskes, eller hvad de ændrede',
    'Misforståelse — noget folk tror forkert om dem',
    'Privat detalje — en overraskende, sand side af deres liv',
  ],
  sted: [
    'Landskab & natur — terræn, vand, klima, dyre- og planteliv',
    'Sanseindtryk — hvordan der ser ud, lyder, lugter at være der',
    'Historie — hvad der skete dér, eller hvem der byggede det',
    'Funktion — hvad man bruger stedet til, eller hvorfor folk kommer',
    'Skala & rekord — størrelse, alder, højde, en overraskende sammenligning',
    'Region — hvor i verden det ligger (verdensdel/nabolande, ALDRIG bynavnet)',
    'Myte & kultur — sagn, tro eller symbolik knyttet til stedet',
    'Mennesker — hvem der bor, byggede eller besøger',
    'Misforståelse — noget folk tror forkert om stedet',
  ],
  ting: [
    'Funktion & brug — hvad det gør, eller hvad man bruger det til',
    'Materiale & tilblivelse — hvad det er lavet af, eller hvordan det laves',
    'Oprindelse — hvornår eller hvordan det opstod (om tingen, ALDRIG om navnet)',
    'Sanseindtryk — udseende, lyd, lugt, smag, følelse',
    'Overraskende anvendelse — en uventet eller skjult-i-plain-sight brug',
    'Kultur & symbolik — hvad det betyder for folk, status, ritualer',
    'Skala & tal — mål, mængde, pris, rekord',
    'Misforståelse — noget folk tror forkert om det',
    'Hvor man støder på det — i hvilken sammenhæng det dukker op',
  ],
  begivenhed: [
    'Tid & sted — hvilken epoke og egn (ALDRIG det fulde navn eller årstal alene som giveaway)',
    'Hvem — personer, grupper eller folk der var involveret',
    'Årsag — hvad der udløste det',
    'Skala & omfang — hvor stort, hvor mange berørt, ofre, rekord',
    'Konsekvenser — hvad det førte til bagefter',
    'Eftermæle — hvordan vi husker eller markerer det i dag',
    'Menneskeligt øjebliksbillede — en konkret, sansbar detalje fra selve hændelsen',
    'Misforståelse — noget folk tror forkert om det',
    'Hvorfor det betyder noget — dets varige betydning',
  ],
};

const CRAFT_NOTE = 'Tag velkendte kendsgerninger og vis dem fra en uventet vinkel (skjult-i-plain-sight). Lad spilleren RÆSONNERE sig frem — ikke huske obskure facts. Hver ledetråd skal være sand og kunne efterprøves.';

export const getDifficultyLabel = (v) => v <= 10 ? 'Børneniveau' : v <= 25 ? 'Meget let' : v <= 40 ? 'Let'
  : v <= 60 ? 'Normal' : v <= 75 ? 'Svær' : v <= 90 ? 'Meget svær' : 'Ekspert';

const answerBand = (p) => p <= 20 ? 'Noget næsten alle — også børn — kender.'
  : p <= 40 ? 'Kendt af de fleste voksne.'
  : p <= 60 ? 'Almen dannelse: de fleste har hørt om det, men det ligger ikke forrest i hovedet.'
  : p <= 80 ? 'Må gerne være ret obskurt — mange vil IKKE kende det på forhånd. Det er meningen; ledetrådene bygger det op.'
  : 'Bevidst obskurt: de færreste kender det i forvejen. Sådan skal det være — ledetrådene skal gøre det muligt at ræsonnere sig frem alligevel.';

const guessPoint = (clueDiff, n) => {
  const frac = clueDiff <= 20 ? 0.35 : clueDiff <= 40 ? 0.45 : clueDiff <= 60 ? 0.5 : clueDiff <= 80 ? 0.6 : 0.7;
  const k = Math.max(2, Math.round(n * frac));
  return `omkring ${k} af de ${n} ledetråde er vendt (ca. ${Math.round(frac * 100)}%)`;
};

const clueBand = (p) => p <= 20 ? 'Tyngdepunktet ligger mod de SKARPE, konkrete ledetråde — let at komme tæt på tidligt. Stadig må ingen enkelt ledetråd alene afsløre svaret.'
  : p <= 40 ? 'Overvægt af konkrete ledetråde med et par vagere iblandt.'
  : p <= 60 ? 'En jævn blanding af brede, mellem og skarpe ledetråde.'
  : p <= 80 ? 'Tyngdepunktet ligger mod de VAGE, indirekte ledetråde; kun et par er skarpere. Man skal kombinere de fleste. Avanceret ordforråd.'
  : 'Næsten alle ledetråde er kryptiske, laterale og metaforiske — svære selv for vidende, men logisk gættbare som helhed.';

export function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)];
const sample = (arr, k, rng) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, k);
};

export const getPrompt = (category, difficulty, usedItems, customTheme = '', numberOfClues = 20, clueDifficulty = 50, ageRangeMin = 18, ageRangeMax = 50, rng = Math.random) => {
  const meta = categoryMeta[category];
  const used = usedItems.filter(i => i.category === category).map(i => i.item).slice(-20);
  const variationKey = Math.floor(rng() * 1e6);
  const subType = pick(meta.subTypes, rng);
  const era = pick(ERAS, rng);
  const region = pick(REGIONS, rng);
  const angles = CLUE_ANGLES[category];
  const threeLenses = sample(angles, 3, rng).map(l => l.split(' — ')[0]);
  const year = new Date().getFullYear();

  const themeBlock = customTheme
    ? `\n## TEMA (ufravigeligt)\nEmnet SKAL have temaet "${customTheme}" som sin PRIMÆRE forbindelse — ikke en perifer eller tilfældig forbindelse. (En person hvis storhedstid eller vigtigste øjeblik lå i temaet tæller; en der blot tilfældigt kan kobles til temaet tæller IKKE.) Temaet vægter højere end alle nudges nedenfor.\n`
    : '';

  const categoryRule = category === 'begivenhed'
    ? 'Svaret SKAL være en BEGIVENHED — et øjeblik eller en hændelse i tiden (et slag, en opdagelse, en katastrofe, en premiere) — ALDRIG en institution, bygning, genstand eller person.'
    : category === 'person'
    ? 'Svaret SKAL være en person, karakter, dyr, gruppe eller et erhverv.'
    : category === 'sted'
    ? 'Svaret SKAL være et sted, en lokation, bygning eller et naturligt fænomen.'
    : 'Svaret SKAL være en genstand, opfindelse, et koncept eller materiale.';

  const ageBlock = (ageRangeMin <= 14)
    ? ''
    : `\n## SPILLERNES ALDER: ${ageRangeMin}-${ageRangeMax} år (født ca. ${year - ageRangeMax}-${year - ageRangeMin})\nDu MÅ gerne — men skal ikke — vælge noget der rammer deres generations populærkultur, teknologi eller minder.`;

  return `# 20 SPØRGSMÅL — GENERÉR ÉT KORT
Du er spilmotoren i et dansk "20 spørgsmål"-spil. Vælg ÉT emne i kategorien og skriv ${numberOfClues} ledetråde på dansk. Al tænkning sker indeni; du svarer KUN med JSON til sidst.

## KATEGORI
${categoryNames[category]} — ${meta.desc}
${themeBlock}
## VARIATIONSNØGLE: ${variationKey}
Brug nøglen som tilfældigt frø. To spil med samme indstillinger SKAL ende på vidt forskellige emner. Lad nøglen skubbe dig væk fra dit allerførste indfald — det er næsten altid det mest oplagte.

## TRIN 1 — VÆLG EMNET  (svar-sværhed: ${difficulty}% = ${getDifficultyLabel(difficulty)})
${categoryRule}
Tænk indeni (vis det IKKE): find hurtigt 6 mulige emner fra FORSKELLIGE underområder. Kassér derefter alt der er
- oplagt eller overbrugt (se forbudt-listen),
- allerede brugt (se listen),
- ikke genkendeligt på ${difficulty}%-niveau,
- eller noget du IKKE kender nok SANDE, specifikke fakta om. (Du skal kunne fylde alle ${numberOfClues} ledetråde med ægte viden uden at gætte eller digte. Kan du ikke det, så vælg et emne du kender bedre.)

VIGTIGT — VÆLG ET "LAVT-FINGERAFTRYK"-EMNE: Foretræk emner der er kendt for FLERE mindre fakta frem for ét altdominerende kendetegn. Et emne hvor ét enkelt faktum afslører alt (en figur defineret af ét berømt våben eller én sidekick, en opfinder med én berømt opfindelse, et værk alle kender for én ting) kan IKKE strækkes over mange ledetråde — så snart dét faktum nævnes, er spillet slut. Den slags er som regel også de mest oplagte valg.
TEST før du vælger: kan du nævne mindst 8-10 sande facts om emnet, hvor INGEN enkelt af dem alene afslører det? Hvis ja, er det et godt emne. Hvis ét faktum dominerer alt, så vælg et andet, MERE FACETTERET emne (kendt for flere ting) — ikke nødvendigvis mere obskurt. Lad ${difficulty}%-niveauet styre, HVOR kendt emnet er: emnet skal stadig være genkendeligt for en spiller på dette niveau, så det ikke bliver umuligt at gætte — det er den brede, fingeraftryk-frie profil, ikke ren obskuritet, vi er ude efter.
Vælg så ÉT emne der føles friskt og lidt overraskende, men stadig fair.

Sværhedskalibrering for SVARET: ${answerBand(difficulty)}
Tjek: ved LAVE niveauer skal svaret give et "nåå, ja!" når det afsløres. Ved HØJE niveauer må svaret gerne være ukendt på forhånd — så længe ledetrådene gør det muligt at ræsonnere sig frem. Undgå altid dit allerførste, mest oplagte indfald.

Skub i denne retning denne gang (kun inspiration, ikke tvang${customTheme ? ', og kun hvis det passer med temaet' : ''}):
- Underområde: ${subType}
- Æra/tid: ${era}
- Region/kultur: ${region}

FORBUDTE, OVERBRUGTE VALG — vælg ALDRIG disse eller nære varianter:
${meta.forbidden.join(', ')}

ALLEREDE BRUGT — undgå disse og nære slægtninge:
${used.length ? used.join(', ') : 'ingen endnu'}

Emnet skal være KORT, genkendeligt og ENTYDIGT — én klar ting med én alment accepteret betegnelse, aldrig en lang sætning og aldrig noget med flere lige gyldige navne der gør gættet til en tvist.
${ageBlock}

## TRIN 2 — SKRIV ${numberOfClues} LEDETRÅDE  (ledetråds-sværhed: ${clueDifficulty}% = ${getDifficultyLabel(clueDifficulty)})

FØRST (indeni, vis det IKKE): skriv svarets 2-3 mest berømte kendetegn ned — dét folk ØJEBLIKKELIGT forbinder med svaret (det ikoniske symbol, signatur-teknikken, den ene berømte bedrift, det alle har set eller hørt). Disse er nu BANDLYSTE som ledetråde — også selvom du omskriver eller antyder dem. Skriv KUN ledetråde om alt det andet: det mindre kendte, det skæve, det man først forstår bagefter.

VIGTIGST AF ALT — DEN GYLDNE REGEL: Ledetrådene BLANDES og vises i tilfældig rækkefølge — enhver ledetråd kan blive vist FØRST. Spillet går ud på, at det kræver MANGE ledetråde at gætte. Mål: en typisk spiller på dette niveau bør først være sikker, når ${guessPoint(clueDifficulty, numberOfClues)}.
Derfor, ufravigeligt: forestil dig HVER ledetråd vist helt alene som den allerførste. Kunne en spiller, der kender emnet, gætte svaret ud fra den ene ledetråd? Så er den for skarp — også selvom den er formuleret jævnt. Selv din SKARPESTE ledetråd skal stadig efterlade mindst 3 plausible svar. Og pas særligt på svarets ÉNE mest berømte kendsgerning (det det er allermest kendt for): den er et fingeraftryk, selv når du skriver den i al enkelhed — cirkl uden om den i stedet for at sige den.

FORDEL SVÆRHEDEN (som en god quiz): lav en blanding — nogle BREDE ledetråde der passer på mange mulige svar, flere MELLEM der indsnævrer, og 1-2 SKARPE der bringer spilleren tæt på (men stadig efterlader 2-3 muligheder). Denne spredning skaber følelsen af at komme tættere på, jo flere man vender. Det er ${clueBand(clueDifficulty)}

HÅNDVÆRK: ${CRAFT_NOTE}

Skriv fra FORSKELLIGE vinkler. Vinkler der passer til denne kategori:
${angles.map(l => `- ${l}`).join('\n')}
KRAV: brug mindst 6 forskellige vinkler hen over de ${numberOfClues} ledetråde. Læg ekstra vægt på disse tre denne gang: ${threeLenses.join('; ')}.

Regler:
1. INTET FINGERAFTRYK. Udelad svarets mest berømte enkelt-kendetegn — dét ene alle straks forbinder med svaret: signatur-citatet, øgenavnet, den ikoniske titel, det unikke fagord, den ene mest berømte begivenhed eller det billede alle har set. (Fx: et bands mest berømte sang, en opfinders ene berømte opfindelse, en figurs ikoniske våben, en katastrofes ikoniske dødsårsag.) Sådanne fingeraftryk må du IKKE bruge — højst antyde meget skævt.
2. INGEN NAVNE-GÆT. Aldrig svarets navn, et ord der indgår i navnet (heller ikke en generisk kategori-betegnelse som 'teleskop' når svaret er et bestemt teleskop), hvad navnet betyder eller hedder på et andet sprog, hvilke ord/bogstaver det består af, hvilket folk eller sprog navnet er lånt fra, eller hvad navnet er opkaldt efter (fx "den er opkaldt efter sit mest markante træk") — eller meta-vink som "den kommer ikke fra det dyr, den er opkaldt efter". Omskriv altid til kontekst og relationer.
3. KORREKTHED FØR ALT. Hver ledetråd skal være faktuelt sand. Find ALDRIG på navne, tal, årstal, øgenavne eller "sjove detaljer" du ikke er sikker på. Er du i tvivl om en kendsgerning, så udelad den. En sand, jævn ledetråd slår altid en opdigtet "interessant" én.
4. Hver ledetråd står ALENE, henviser ikke til de andre, og tilføjer NY information. To ledetråde må ALDRIG hvile på samme kendetegn eller fakta (fx to clues om samme rolle, samme rekord eller samme ene egenskab) — find en frisk vinkel i stedet. Læg især ikke to af de skarpe ledetråde oven på det samme spor.
5. VARIÉR FORM OG LÆNGDE. Mindst to ledetråde skal være meget korte (højst 6 ord). Højst to må begynde på samme måde. Genbrug aldrig samme sætningsskabelon.
6. Levende, konkret dansk med overraskende men SANDE vinkler. Undgå tørre leksikon-remser og generisk fyld der kunne passe på hundredvis af svar.

## TRIN 3 — SELV-TJEK (indeni, vis det ikke)
- Gennemgå HVER ledetråd som om den blev vist FØRST og alene: kan en kvik spiller gætte svaret ud fra den? Efterlader den færre end 3 plausible svar? Så er den for skarp — gør den vagere eller skift vinkel. Vær ekstra hård ved den ledetråd, der rører svarets mest berømte kendsgerning.
- Er hver ledetråd faktuelt korrekt, eller har jeg gættet/digtet? Fjern alt usikkert.
- Afslører nogen ledetråd navnet, dets betydning eller stavemåde? Omskriv.
- Tilhører svaret præcist den rigtige kategori? Hvis ikke, vælg et nyt.
- Hviler to ledetråde på samme kendetegn/fakta (også selvom de er formuleret forskelligt)? Slå dem sammen, og brug den frigjorte plads på en helt ny vinkel.
- Ligner to ledetråde hinanden? Er der mindst to meget korte? Ret det.
- Tæl efter: skal man op på ${guessPoint(clueDifficulty, numberOfClues)} for at være sikker? Hvis svaret falder for hurtigt, gør de skarpeste ledetråde vagere eller bredere.

## OUTPUT
Svar KUN med ren JSON på én linje, "item" FØRST, ingen markdown, ingen forklaring.
Brug ALDRIG dobbelt-anførselstegn (") inde i en ledetråd — brug enkelt-anførselstegn (') hvis du skal citere. Ellers bryder svaret.
{"item":"...","clues":["...", ... ${numberOfClues} stk]}`;
};
