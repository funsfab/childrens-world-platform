(function(){
  const KEY='cw_language_v1';
  const fr={
    'Experience':'Expérience','Arcade':'Arcade','Story World':'Monde des histoires','Parent Centre':'Espace parents',
    'Start Family Trial':'Commencer l’essai famille','Enter My World HQ →':'Entrer dans Mon Monde HQ →',
    'LEARN • PLAY • CREATE • BUILD • WATCH • EXPLORE':'APPRENDRE • JOUER • CRÉER • CONSTRUIRE • REGARDER • EXPLORER',
    'A whole world to':'Tout un monde pour','play in, build in and grow through.':'jouer, construire et grandir.',
    'Children World brings learning, play, building, creativity and Story World together in one connected world for ages 10–13.':'Children World réunit apprentissage, jeu, construction, créativité et Monde des histoires dans un univers connecté pour les 10–13 ans.',
    'Real play':'Vrai jeu','Drag & drop building':'Construction glisser-déposer','Adaptive challenge':'Défi adaptatif',
    'Build a city':'Construire une ville','Solve a mystery':'Résoudre un mystère','Watch Story World':'Regarder Monde des histoires','Run a business':'Gérer une entreprise','Test an AI claim':'Vérifier une affirmation d’IA','Travel the world':'Voyager dans le monde',
    '7 BIG ACTIONS':'7 GRANDES ACTIONS','What do you feel like doing?':'Qu’as-tu envie de faire ?','The platform should feel like a world of choices, not a list of lessons.':'La plateforme doit ressembler à un monde de choix, pas à une liste de leçons.',
    'PLAY':'JOUER','BUILD':'CONSTRUIRE','WATCH':'REGARDER','CREATE':'CRÉER','EXPLORE':'EXPLORER','CHALLENGE':'DÉFI','LEARN':'APPRENDRE',
    'Arcade • strategy • puzzles':'Arcade • stratégie • énigmes','City • systems • planning':'Ville • systèmes • planification','3D Story World':'Monde des histoires 3D','Design • invent • imagine':'Concevoir • inventer • imaginer','Countries • cultures • world':'Pays • cultures • monde','Adaptive • Prove It':'Adaptatif • Prouve-le','School • life • future':'École • vie • avenir',
    'NEW FLAGSHIP GAME':'NOUVEAU JEU PHARE','Build Your City is no longer just an idea.':'Construis ta ville n’est plus seulement une idée.',
    'Place homes, schools, hospitals, parks, transport and emergency services. Balance your budget, grow the population and keep the city working.':'Place des maisons, écoles, hôpitaux, parcs, transports et services d’urgence. Équilibre ton budget, augmente la population et garde la ville fonctionnelle.',
    'Start building →':'Commencer à construire →','Mission: 5,000 citizens':'Mission : 5 000 habitants',
    'CHILDREN WORLD TV':'CHILDREN WORLD TV','Story World now lives inside the platform.':'Le Monde des histoires fait maintenant partie de la plateforme.',
    'Cinematic 3D mini-films connect directly to quizzes, safety scenarios, missions and games. The prototype shows the viewing experience while the final videos are produced separately.':'Des mini-films 3D cinématographiques sont reliés aux quiz, scénarios de sécurité, missions et jeux. Le prototype présente l’expérience de visionnage pendant que les vidéos finales sont produites séparément.',
    'Enter Story World →':'Entrer dans le Monde des histoires →','My World HQ':'Mon Monde HQ','City Builder':'Constructeur de ville',
    'WELCOME BACK, EXPLORER':'BON RETOUR, EXPLORATEUR','What do you feel like doing today?':'Qu’as-tu envie de faire aujourd’hui ?',
    'Play something. Build something. Watch a story. Explore somewhere. Or test how far your brain can go.':'Joue, construis, regarde une histoire, explore un lieu ou teste jusqu’où ton cerveau peut aller.',
    'What’s Hot':'À la une','Quick Discovery':'Découverte rapide','Another fact ↻':'Un autre fait ↻','World Pulse':'Pouls du monde',
    'NEW GAME':'NOUVEAU JEU','Your land. Your budget. Your decisions.':'Ton terrain. Ton budget. Tes décisions.',
    'Grow to 5,000 citizens without forgetting schools, healthcare, parks, transport or safety.':'Atteins 5 000 habitants sans oublier écoles, santé, parcs, transports ou sécurité.',
    'Build now →':'Construire maintenant →','CONTINUE YOUR MISSION':'CONTINUE TA MISSION','Continue mission':'Continuer la mission','Save for later':'Garder pour plus tard',
    'MY WORLDS':'MES MONDES','Choose a world. Go deeper.':'Choisis un monde. Va plus loin.','World Explorer':'Explorateur du monde','Countries • culture • travel':'Pays • culture • voyage',
    'Life Lab':'Labo de vie','Money • food • decisions':'Argent • alimentation • décisions','Creator Studio':'Studio créatif','Design • invent • story':'Conception • invention • histoire',
    'World Passport':'Passeport du monde','countries explored':'pays explorés','Open passport →':'Ouvrir le passeport →',
    'THE FUN ZONE':'LA ZONE FUN','Pick a game. Beat a mission. Come back stronger.':'Choisis un jeu. Réussis une mission. Reviens plus fort.',
    'Some games teach openly. Others are simply great fun while quietly building strategy, memory, planning or judgement.':'Certains jeux enseignent directement. D’autres sont surtout amusants tout en développant stratégie, mémoire, planification ou jugement.',
    'Build Your City':'Construis ta ville','Drag, drop, budget and keep your city alive.':'Glisse, dépose, gère le budget et fais vivre ta ville.',
    'Strategy • Planning • Money':'Stratégie • Planification • Argent','Flag Quest':'Quête des drapeaux','Fast world knowledge with fresh shuffled rounds.':'Connaissances du monde en manches mélangées et renouvelées.',
    'Geography • Speed':'Géographie • Rapidité','Brain Battle':'Bataille cérébrale','Adaptive questions that get harder when you do well.':'Des questions qui deviennent plus difficiles quand tu progresses.',
    'Reasoning • Prove It':'Raisonnement • Prouve-le','Business Empire':'Empire commercial','Start with £100. Buy, price, sell and grow.':'Commence avec 100 £. Achète, fixe les prix, vends et développe-toi.',
    'Mystery Files':'Dossiers mystère','Find clues, question assumptions and solve the case.':'Trouve des indices, remets les suppositions en question et résous l’affaire.',
    'Space Mission':'Mission spatiale','Plan a mission and survive engineering problems.':'Planifie une mission et résous des problèmes d’ingénierie.',
    'AI Detective':'Détective IA','Spot false claims, deepfake clues and AI mistakes.':'Repère les fausses affirmations, indices de deepfake et erreurs d’IA.',
    'Science Lab':'Labo scientifique','Predict, test and solve experiment challenges.':'Prédis, teste et résous des défis expérimentaux.',
    'World Traveller':'Voyageur du monde','Plan routes, currencies, time zones and budgets.':'Planifie itinéraires, monnaies, fuseaux horaires et budgets.',
    'ARCADE RULE':'RÈGLE DE L’ARCADE','Not every game has to feel like homework.':'Tous les jeux ne doivent pas ressembler à des devoirs.',
    'Play the new game →':'Jouer au nouveau jeu →',
    'MISSION 01 • NEW SETTLEMENT':'MISSION 01 • NOUVELLE VILLE','Build a balanced city for 5,000 people.':'Construis une ville équilibrée pour 5 000 personnes.',
    'Use your £2,350,000 budget wisely. Your citizens need homes, education, health, safety, transport, shops and green space.':'Utilise intelligemment ton budget de 2 350 000 £. Tes habitants ont besoin de logements, d’éducation, de santé, de sécurité, de transports, de commerces et d’espaces verts.',
    'IN PROGRESS':'EN COURS','MISSION COMPLETE':'MISSION RÉUSSIE','City Rating':'Note de la ville','Budget':'Budget','Population':'Population','Education':'Éducation','Health':'Santé','Safety':'Sécurité','Happiness':'Bonheur',
    'BUILDINGS':'BÂTIMENTS','Drag or tap':'Glisse ou touche','On a phone: tap a building, then tap a plot.':'Sur téléphone : touche un bâtiment puis une parcelle.',
    'Homes':'Logements','School':'École','Hospital':'Hôpital','Park':'Parc','Fire Station':'Caserne de pompiers','Bus Hub':'Pôle de bus','Shops':'Commerces','Undo':'Annuler','Reset':'Réinitialiser',
    'Choose a building, then place it on the land.':'Choisis un bâtiment puis place-le sur le terrain.','City Adviser':'Conseiller de la ville',
    'Start with enough homes, but remember: a city is more than houses.':'Commence par assez de logements, mais souviens-toi : une ville, ce n’est pas seulement des maisons.',
    'MISSION CHECKLIST':'LISTE DE MISSION','Can your city work?':'Ta ville peut-elle fonctionner ?','Reach 5,000 people':'Atteindre 5 000 personnes','Build a school':'Construire une école','Build a hospital':'Construire un hôpital','Build a park':'Construire un parc','Build a fire station':'Construire une caserne de pompiers','Build public transport':'Construire des transports publics','Build shops':'Construire des commerces','Stay within budget':'Respecter le budget','Think like a planner':'Pense comme un urbaniste',
    'If you spend everything on homes, where will everyone study, travel or get help?':'Si tu dépenses tout en logements, où les habitants étudieront-ils, voyageront-ils ou recevront-ils de l’aide ?',
    'NOT JUST EASY QUESTIONS':'PAS SEULEMENT DES QUESTIONS FACILES','How far can you go?':'Jusqu’où peux-tu aller ?',
    'Master one level at a time. Each level has 20 questions, and missed questions return in a review round before you can move on.':'Maîtrise un niveau à la fois. Chaque niveau comporte 20 questions et les questions ratées reviennent en révision avant de passer au niveau suivant.',
    'Explorer':'Explorateur','Challenger':'Challenger','Investigator':'Enquêteur','Expert':'Expert','Master Mission':'Mission Maître','Start Brain Battle':'Commencer la bataille cérébrale',
    'Current tier':'Niveau actuel','Score':'Score','Streak':'Série','Question':'Question','PROVE IT':'PROUVE-LE','Why is that answer correct?':'Pourquoi cette réponse est-elle correcte ?','Next challenge →':'Défi suivant →',
    'BATTLE COMPLETE':'BATAILLE TERMINÉE','Review missed questions':'Revoir les questions ratées','Continue to next level':'Passer au niveau suivant','Start again':'Recommencer',
    'AROUND THE WORLD • NO-REPEAT SHUFFLE':'AUTOUR DU MONDE • MÉLANGE SANS RÉPÉTITION',
    'Identify countries, capitals and world clues. Questions are drawn from a shuffle bag so the same item is not repeated until the current pool has been used.':'Identifie des pays, capitales et indices du monde. Les questions sont tirées d’un mélange afin d’éviter les répétitions jusqu’à utilisation du groupe actuel.',
    'Mixed World':'Monde mixte','Flags':'Drapeaux','Capitals':'Capitales','START QUEST →':'COMMENCER LA QUÊTE →','SCORE':'SCORE','Quest complete!':'Quête terminée !','Correct':'Correctes','XP earned':'XP gagnés','Play another set':'Jouer une autre série','Choose another category':'Choisir une autre catégorie','Back to HQ':'Retour au HQ','Exit game':'Quitter le jeu',
    'MISSION • MONEY + FOOD + DECISIONS':'MISSION • ARGENT + ALIMENTATION + DÉCISIONS','The £35 Family Dinner Challenge':'Le défi du dîner familial à 35 £',
    'Choose enough food for a simple dinner for four people. Stay within budget, include a main meal and at least one fruit or vegetable item.':'Choisis assez de nourriture pour un dîner simple pour quatre personnes. Respecte le budget, ajoute un plat principal et au moins un fruit ou légume.',
    'Budget left:':'Budget restant :','items':'articles','All':'Tout','Mains':'Plats principaux','Fruit & Veg':'Fruits et légumes','Sides':'Accompagnements','Extras':'Extras','Your basket':'Ton panier','Nothing added yet.':'Rien ajouté pour le moment.','Total':'Total','Main meal item':'Plat principal','Fruit or vegetable':'Fruit ou légume','Stay within £35':'Rester sous 35 £','CHECK MY PLAN':'VÉRIFIER MON PLAN',
    'Chicken thighs':'Cuisses de poulet','Mixed beans':'Haricots mélangés','Pasta':'Pâtes','Rice':'Riz','Potatoes':'Pommes de terre','Tomatoes':'Tomates','Broccoli':'Brocoli','Carrots':'Carottes','Apples':'Pommes','Salad bag':'Salade en sachet','Wholemeal bread':'Pain complet','Cheddar cheese':'Cheddar','Yoghurt':'Yaourt','Orange juice':'Jus d’orange','White fish fillets':'Filets de poisson blanc','Eggs':'Œufs','Frozen peas':'Petits pois surgelés','Tomato sauce':'Sauce tomate',
    'Main meal':'Plat principal','Fruit / veg':'Fruit / légume','Side':'Accompagnement','Extra':'Extra',
    'NO SINGLE CORRECT ANSWER':'PAS UNE SEULE BONNE RÉPONSE','Make something that did not exist before.':'Crée quelque chose qui n’existait pas auparavant.',
    'Creative missions mix imagination with design, engineering, planning and storytelling.':'Les missions créatives mélangent imagination, conception, ingénierie, planification et narration.',
    'Future Vehicle':'Véhicule du futur','Design transport for 2050. What powers it? Who uses it? What problem does it solve?':'Conçois un transport pour 2050. Quelle énergie l’alimente ? Qui l’utilise ? Quel problème résout-il ?',
    'Dream Room':'Chambre de rêve','Plan a room with a budget, storage, lighting and a purpose.':'Planifie une pièce avec un budget, du rangement, de l’éclairage et une fonction.',
    'Design a Park':'Concevoir un parc','Balance play, nature, safety, accessibility and community needs.':'Équilibre jeu, nature, sécurité, accessibilité et besoins de la communauté.',
    'Invent a Robot':'Inventer un robot','Give it a useful job, sensors, limits and safety rules.':'Donne-lui un rôle utile, des capteurs, des limites et des règles de sécurité.',
    'Story Builder':'Créateur d’histoires','Create a character, problem, turning point and ending.':'Crée un personnage, un problème, un tournant et une fin.',
    'Mars Base':'Base martienne','What will humans need for air, water, food, power and safety?':'De quoi les humains auront-ils besoin pour l’air, l’eau, la nourriture, l’énergie et la sécurité ?',
    'Open mission':'Ouvrir la mission','SELECTED MISSION':'MISSION SÉLECTIONNÉE','Choose a mission above.':'Choisis une mission ci-dessus.','Save idea on this device':'Enregistrer l’idée sur cet appareil',
    'WORLD EXPLORER':'EXPLORATEUR DU MONDE','Choose a country and begin a world mission.':'Choisis un pays et commence une mission mondiale.',
    'Japan is our first fully built country mission. More countries will follow the same structure.':'Le Japon est notre première mission pays entièrement construite. D’autres pays suivront la même structure.',
    'Explore Japan →':'Explorer le Japon →','Coming next':'À venir','WORLD MISSION 024 • ASIA':'MISSION MONDE 024 • ASIE',
    'Quick Snapshot':'Aperçu rapide','Cities & Places':'Villes et lieux','Culture & Food':'Culture et cuisine','Everyday Life':'Vie quotidienne','Japan Challenge':'Défi Japon',
    'Start with the essentials.':'Commence par l’essentiel.','Capital':'Capitale','Geography':'Géographie','Money':'Argent','Language':'Langue','Landmark':'Site célèbre','Popular sport':'Sport populaire',
    'Knowledge connection':'Connexion des connaissances','Continue mission →':'Continuer la mission →','One country, many different environments.':'Un pays, de nombreux environnements différents.','Tradition and modern life can exist side by side.':'Tradition et vie moderne peuvent coexister.','What might a young person notice?':'Que pourrait remarquer un jeune ?',
    'Public Demo':'Démo publique','Explorer Access':'Accès Explorateur','Full World':'Monde complet','Menu':'Menu','Search':'Rechercher','What do you want to discover?':'Que veux-tu découvrir ?',
    'MASTER ONE LEVEL AT A TIME':'MAÎTRISE UN NIVEAU À LA FOIS','Each level has 20 questions. Questions you miss return in a review round, and you move up only after you have mastered them.':'Chaque niveau comporte 20 questions. Les questions ratées reviennent en révision et tu progresses seulement après les avoir maîtrisées.','Reset progress':'Réinitialiser la progression','Main round':'Série principale','Review round':'Révision','LEVEL CHECKPOINT':'ÉTAPE DU NIVEAU',
    'Each quest has 20 questions and avoids recently used questions until the pool needs refreshing.':'Chaque quête comporte 20 questions et évite les questions récemment utilisées jusqu’à ce que le groupe doive être renouvelé.','Choose one category or mix them through World mode.':'Choisis une catégorie ou mélange-les avec le mode Monde.','Choose another category':'Choisir une autre catégorie',
    'EXPLORE THE WHOLE WORLD':'EXPLORE LE MONDE ENTIER','Japan is our first fully built country mission. More countries will follow the same structure: places, everyday life, culture, geography, challenges and passport stamps.':'Le Japon est notre première mission pays entièrement construite. D’autres pays suivront la même structure : lieux, vie quotidienne, culture, géographie, défis et tampons de passeport.','PLAYABLE NOW':'JOUABLE MAINTENANT','First complete country mission':'Première mission pays complète','The explorer is built for the whole world.':'L’Explorateur est conçu pour le monde entier.','These cards show the direction. They are not yet playable country missions.':'Ces cartes montrent la direction. Ces missions pays ne sont pas encore jouables.','EUROPE':'EUROPE','AFRICA':'AFRIQUE','SOUTH AMERICA':'AMÉRIQUE DU SUD','NORTH AMERICA':'AMÉRIQUE DU NORD',
    'That would take you over £35. Try a different choice.':'Cela dépasserait 35 £. Essaie un autre choix.','Add some food first.':'Ajoute d’abord des aliments.','Your plan needs a main meal item.':'Ton plan a besoin d’un plat principal.','Add at least one fruit or vegetable item.':'Ajoute au moins un fruit ou un légume.','Challenge complete!':'Défi terminé !',
    'Music on':'Musique activée','Music muted':'Musique coupée','Language':'Langue'

  };

  function current(){return localStorage.getItem(KEY)||'en'}
  function set(lang){localStorage.setItem(KEY,lang);location.reload()}
  function tr(s){if(current()!=='fr')return s;return fr[s]||s}
  function translateNode(node){
    if(current()!=='fr')return;
    if(node.nodeType===Node.TEXT_NODE){
      const raw=node.nodeValue, trim=raw.trim();
      if(!trim)return;
      const val=fr[trim];
      if(val){
        const left=raw.match(/^\s*/)?.[0]||'', right=raw.match(/\s*$/)?.[0]||'';
        node.nodeValue=left+val+right;
      }
      return;
    }
    if(node.nodeType!==Node.ELEMENT_NODE)return;
    if(['SCRIPT','STYLE','NOSCRIPT','CODE'].includes(node.tagName))return;
    ['placeholder','title','aria-label'].forEach(a=>{
      const v=node.getAttribute?.(a);
      if(v&&fr[v])node.setAttribute(a,fr[v]);
    });
    [...node.childNodes].forEach(translateNode);
  }
  function translatePage(){document.documentElement.lang=current()==='fr'?'fr':'en';translateNode(document.body)}
  function ensureDock(){
    let dock=document.querySelector('.cw-utility-dock');
    if(!dock){dock=document.createElement('div');dock.className='cw-utility-dock';document.body.appendChild(dock)}
    if(!dock.querySelector('#cwLanguageSelect')){
      const wrap=document.createElement('label');wrap.className='cw-language-control';wrap.innerHTML='<span>🌐</span><select id="cwLanguageSelect" aria-label="Language"><option value="en">EN</option><option value="fr">FR</option></select>';
      dock.appendChild(wrap);
      const sel=wrap.querySelector('select');sel.value=current();sel.onchange=()=>set(sel.value);
    }
  }
  window.CWLang={current,set,t:tr,fr};
  ensureDock();
  translatePage();
  const obs=new MutationObserver(muts=>{
    if(current()!=='fr')return;
    muts.forEach(m=>m.addedNodes.forEach(n=>translateNode(n)));
  });
  obs.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
