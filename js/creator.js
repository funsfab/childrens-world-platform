(()=>{
'use strict';
/* Children World Creator Studio - Build Pack 18
   Original/custom project assets only. Do not introduce recognisable third-party characters,
   franchises, logos or branded story worlds into Creator Studio. */

const $=id=>document.getElementById(id);
const lang=()=>window.CWLang?.current?.()||'en';
const t=(en,fr)=>lang()==='fr'?fr:en;
const L=pair=>pair?.[lang()==='fr'?1:0]||pair?.[0]||'';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const part=(id,icon,en,fr,tags=[],className='',opts={})=>({id,icon,label:[en,fr],tags,className,...opts});
const mode=(id,icon,en,fr,helpEn,helpFr,parts=[])=>({id,icon,label:[en,fr],help:[helpEn,helpFr],parts});
const lib=(id,name,img,subtitle,blueprintType='scene')=>({id,name,img,subtitle,blueprintType});

const AS='assets/creator/';
const vehicleLibrary=[
 lib('vehicle-sport','Sport Car',AS+'vehicle-sport.webp','Low, fast performance coupe','vehicle'),
 lib('vehicle-executive','Executive Sedan',AS+'vehicle-executive.webp','Comfortable premium saloon','vehicle')
];
const robotLibrary=[
 lib('robot-a','Classroom Helper',AS+'robot-a-classroom.webp','Friendly learning helper','robot'),
 lib('robot-b','Explorer Rover',AS+'robot-b-explorer.webp','Rover for difficult terrain','robot'),
 lib('robot-c','Builder Bot',AS+'robot-c-builder.webp','Construction and repair robot','robot'),
 lib('robot-d','Rescue Unit',AS+'robot-d-rescue.webp','Fast emergency helper','robot'),
 lib('robot-e','Ocean Cleaner',AS+'robot-e-ocean.webp','Water and clean-up robot','robot'),
 lib('robot-f','Sky Scout',AS+'robot-f-sky.webp','Flying exploration robot','robot')
];
const storyLibrary=[
 lib('story-forest','Forest Rescue Adventure',AS+'story-forest-rescue.webp','Find, help and reunite'),
 lib('story-museum','Museum Mystery Night',AS+'story-museum-mystery.webp','Clues, history and discovery'),
 lib('story-space','Space Delivery Mission',AS+'story-space-delivery.webp','Deliver cargo across a space base'),
 lib('story-castle','Castle Festival Quest',AS+'story-castle-festival.webp','Build a magical festival adventure'),
 lib('story-school','School Invention Day',AS+'story-school-invention.webp','Create a story around young inventors')
];
const marsLibrary=[
 lib('mars-red','Red Horizon Research Base',AS+'mars-red-horizon.webp','Science, habitat and exploration'),
 lib('mars-olympus','Olympus Family Colony',AS+'mars-olympus-colony.webp','A larger living settlement'),
 lib('mars-ice','Ice Core Mining Outpost',AS+'mars-ice-core.webp','Water, drilling and resource systems'),
 lib('mars-canyon','Canyon Shield Habitat',AS+'mars-canyon-shield.webp','Protected settlement by the canyon'),
 lib('mars-launch','Launchport Engineering Base',AS+'mars-launchport.webp','Rocket, hangar and engineering zone')
];

const vehicleModes=[
 mode('body','🚘','Body & movement','Carrosserie et mouvement','Build the car like a peg puzzle. Exterior pieces fit around the shell; steering, seats and dashboard are fitted by rotating underneath the car.','Construis la voiture comme un puzzle. Les pièces extérieures se fixent sur la carrosserie ; le volant, les sièges et le tableau de bord se placent en tournant sous la voiture.',[
  part('wheel','', 'Wheel / tyre','Roue / pneu',['movement','wheel'],'',{aspect:1,defaultSize:74}),
  part('door','', 'Car door','Porte de voiture',['passenger'],'',{aspect:1.55,defaultSize:96}),
  part('window','', 'Side window','Vitre latérale',['passenger'],'',{aspect:1.9,defaultSize:90}),
  part('windscreen','', 'Windscreen','Pare-brise',['passenger'],'',{aspect:1.75,defaultSize:104}),
  part('rear-window','', 'Rear window','Lunette arrière',['passenger'],'',{aspect:1.7,defaultSize:92}),
  part('roof','', 'Roof panel','Panneau de toit',['movement'],'',{aspect:2.5,defaultSize:116}),
  part('mirror','', 'Side mirror','Rétroviseur',['safety'],'',{aspect:1.7,defaultSize:48}),
  part('headlight','', 'Headlight','Phare',['safety'],'',{aspect:2.2,defaultSize:58}),
  part('taillight','', 'Rear light','Feu arrière',['safety'],'',{aspect:2.0,defaultSize:52}),
  part('bumper','', 'Front bumper','Pare-chocs avant',['safety'],'',{aspect:3.1,defaultSize:112}),
  part('rear-bumper','', 'Rear bumper','Pare-chocs arrière',['safety'],'',{aspect:3.1,defaultSize:108}),
  part('hood','', 'Bonnet / hood','Capot',['movement'],'',{aspect:2.1,defaultSize:112}),
  part('trunk','', 'Boot / trunk lid','Coffre',['movement'],'',{aspect:2.0,defaultSize:94}),
  part('steering','◉','Steering wheel','Volant',['passenger'],'',{aspect:1,defaultSize:54}),
  part('driver-seat','💺','Driver seat','Siège conducteur',['passenger'],'',{aspect:.72,defaultSize:68}),
  part('seat','💺','Passenger seat','Siège passager',['passenger'],'',{aspect:.72,defaultSize:68}),
  part('dashboard','▤','Dashboard','Tableau de bord',['passenger'],'',{aspect:2.4,defaultSize:110})
 ]),
 mode('power','⚡','Power system','Système d’énergie','Choose what powers and drives the vehicle.','Choisis ce qui alimente et propulse le véhicule.',[
  part('petrol-engine','⚙️','Petrol engine','Moteur essence',['power']),part('diesel-engine','⚙️','Diesel engine','Moteur diesel',['power']),part('electric-motor','⚡','Electric motor','Moteur électrique',['power']),part('battery','🔋','Battery','Batterie',['power']),part('charge-port','🔌','Charging port','Prise de recharge',['power']),part('hybrid','♻️','Hybrid system','Système hybride',['power']),part('fuel-tank','⛽','Fuel tank','Réservoir',['power']),part('exhaust','〽','Exhaust','Échappement',['power']),part('solar','☀️','Solar assist','Assistance solaire',['power'])
 ]),
 mode('safety','🛡️','Safety','Sécurité','Add protection and safe-driving equipment.','Ajoute des équipements de protection et de conduite sûre.',[
  part('belt','🔒','Seat belt','Ceinture',['safety']),part('airbag','◯','Airbag','Airbag',['safety']),part('sensor','📡','Collision sensor','Capteur anticollision',['safety']),part('camera','📷','Safety camera','Caméra de sécurité',['safety']),part('indicator','🟠','Indicator','Clignotant',['safety']),part('safety-light','🚨','Warning light','Feu d’alerte',['safety']),part('emergency-stop','🛑','Emergency stop','Arrêt d’urgence',['safety'])
 ]),
 mode('future','✨','Future tech','Technologies futures','Add technology for flying, hovering, water travel or other future ideas.','Ajoute des technologies de vol, de sustentation, de navigation sur l’eau ou d’autres idées futures.',[
  part('wing','', 'Flight wing','Aile de vol',['future','flight'],'wing'),part('propeller','🌀','Propeller','Hélice',['future','flight']),part('jet','🔥','Jet unit','Réacteur',['future','flight']),part('hover','💠','Hover unit','Module de sustentation',['future','flight']),part('amphibious','', 'Amphibious hull','Coque amphibie',['future','amphibious'],'amphibious'),part('water-jet','🌊','Water jet','Propulseur aquatique',['future','amphibious']),part('retract-wheel','🛞','Retractable wheel','Roue rétractable',['future','amphibious','wheel']),part('drone-lift','🛸','Drone lift','Portance drone',['future','flight']),part('stabiliser','◢','Stabiliser','Stabilisateur',['future']),part('future-sensor','🔵','Future sensor','Capteur futuriste',['future','safety'])
 ])
];

const roomModes=[
 mode('structure','📐','Structure','Structure','Plan walls, doors and windows first.','Planifie d’abord murs, portes et fenêtres.',[
  part('room-wall','▬','Wall section','Mur',['structure','collision-large']),part('room-door','🚪','Door','Porte',['structure','door']),part('room-window','🪟','Window','Fenêtre',['structure']),part('divider','▰','Room divider','Cloison',['structure','collision-large']),part('rug','▭','Rug','Tapis',['structure'])
 ]),
 mode('furniture','🛋️','Furniture','Mobilier','Choose real furniture and combine smaller objects with it.','Choisis du vrai mobilier et combine les petits objets avec lui.',[
  part('bed','🛏️','Bed','Lit',['furniture','collision-large']),part('desk','🖥️','Desk','Bureau',['furniture','collision-large']),part('chair','🪑','Chair','Chaise',['furniture','collision-large']),part('sofa','', 'Sofa with cushions','Canapé avec coussins',['furniture','collision-large'],'sofa'),part('dining-table','🍽️','Dining table','Table à manger',['furniture','collision-large']),part('side-table','◫','Side table','Table d’appoint',['furniture','collision-large']),part('television','📺','Television','Télévision',['furniture','support-child']),part('tv-stand','', 'TV stand / media unit','Meuble TV',['furniture','collision-large'],'tvstand'),part('pillow','🛋','Cushion / pillow','Coussin',['support-child'])
 ]),
 mode('lighting','💡','Lighting','Éclairage','Add useful natural and artificial light. Lights switch on during the test.','Ajoute une lumière naturelle et artificielle utile. Les lumières s’allument pendant le test.',[
  part('bulb','💡','Bulb / lamp','Ampoule / lampe',['light','support-child']),part('floor-lamp','🛋️','Floor lamp','Lampadaire',['light']),part('fluorescent','', 'Fluorescent light','Tube fluorescent',['light'],'fluorescent'),part('window-light','🌤️','Natural light','Lumière naturelle',['light'])
 ]),
 mode('storage','🧰','Storage & organisation','Rangement et organisation','Build storage, then place real items inside or on it.','Construis le rangement, puis place de vrais objets dedans ou dessus.',[
  part('shelf','', 'Shelving unit','Étagère',['storage','collision-large'],'shelf'),part('book','📚','Books','Livres',['storage','support-child']),part('wardrobe','🚪','Wardrobe','Armoire',['storage','collision-large']),part('box','📦','Storage box','Boîte de rangement',['storage']),part('settop','', 'TV provider box','Décodeur TV',['storage','support-child'],'settop'),part('basket','🧺','Storage basket','Panier de rangement',['storage'])
 ])
];

const parkModes=[
 mode('play','🛝','Play area','Aire de jeux','Build a proper play zone from separate activities and matching people.','Construis une vraie aire de jeux avec des activités séparées et des personnages assortis.',[
  part('slide','🛝','Slide','Toboggan',['play','match-slide']),part('swing','🎠','Swing set','Balançoire',['play','match-swing']),part('climb','🧗','Climbing frame','Structure d’escalade',['play']),part('seesaw','↕️','Seesaw','Bascule',['play']),part('roundabout','🔄','Roundabout','Tourniquet',['play']),part('sand','🏖️','Sand play','Bac à sable',['play']),part('play-tunnel','🟣','Play tunnel','Tunnel de jeu',['play']),part('swing-rider','🧒','Child sitting for swing','Enfant assis pour balançoire',['person','swing-rider'])
 ]),
 mode('nature','🌿','Trees & nature','Arbres et nature','Shape the landscape with planting, water and wildlife.','Aménage le paysage avec plantations, eau et faune.',[
  part('tree','🌳','Shade tree','Arbre d’ombrage',['nature']),part('pine','🌲','Evergreen tree','Conifère',['nature']),part('flowers','🌼','Flower bed','Parterre de fleurs',['nature']),part('bush','🌿','Shrubs','Arbustes',['nature']),part('pond','💧','Pond / water','Bassin / eau',['nature','water']),part('stream','🌊','Stream','Ruisseau',['nature','water']),part('garden','🌱','Community garden','Jardin partagé',['nature']),part('duck','🦆','Duck','Canard',['nature','duck'])
 ]),
 mode('sports','⚽','Sports & movement','Sports et mouvement','Create several sports and active zones.','Crée plusieurs zones sportives et actives.',[
  part('football','🥅','Football goal','But de football',['play']),part('football-player','⚽','Football player','Joueur de football',['person']),part('basketball','🏀','Basketball hoop','Panier de basket',['play']),part('basket-player','⛹️','Basketball player','Joueur de basket',['person']),part('tennis','🎾','Tennis area','Zone de tennis',['play']),part('running','🏃','Running loop','Boucle de course',['play']),part('cycle','🚲','Cycle route','Piste cyclable',['play']),part('cyclist','🚴','Cyclist','Cycliste',['person'])
 ]),
 mode('access','♿','Accessible paths','Chemins accessibles','Make routes comfortable and usable by everyone.','Rends les parcours confortables et utilisables par tous.',[
  part('wide-path','🛤️','Wide path','Chemin large',['access']),part('ramp','♿','Ramp','Rampe',['access']),part('crossing','🚸','Safe crossing','Passage sécurisé',['access']),part('accessible-seat','🪑','Accessible seating','Assise accessible',['access','seating','seat-target']),part('bridge','🌉','Bridge','Pont',['access']),part('handrail','〰','Handrail','Main courante',['access'])
 ]),
 mode('facilities','🏞️','Facilities','Équipements','Add practical facilities and places to rest.','Ajoute des équipements pratiques et des lieux de repos.',[
  part('park-bench','', 'Long park bench','Long banc de parc',['seating','seat-target'],'park-bench'),part('picnic','🧺','Picnic table','Table de pique-nique',['seating','seat-target']),part('toilet','', 'Toilets','Toilettes',['facility'],'toilet'),part('bin','🗑️','Bin','Poubelle',['facility']),part('park-light','💡','Park light','Éclairage du parc',['facility']),part('drinking-water','🚰','Drinking water','Eau potable',['facility']),part('gazebo','⛱️','Gazebo / shelter','Kiosque / abri',['facility']),part('fountain','⛲','Fountain','Fontaine',['facility'])
 ]),
 mode('people','👨‍👩‍👧','People & activity','Personnes et activités','Populate the park with separate walking, sitting and activity poses.','Peuple le parc avec des poses séparées de marche, d’assise et d’activité.',[
  part('walk-boy','🚶','Boy walking','Garçon qui marche',['person']),part('walk-girl','🚶‍♀️','Girl walking','Fille qui marche',['person']),part('walk-adult','🚶‍♂️','Adult walking','Adulte qui marche',['person']),part('small-child','🧒','Small child','Petit enfant',['person']),part('seated-boy','🧎','Seated boy','Garçon assis',['person','seated-person']),part('seated-girl','🧎‍♀️','Seated girl','Fille assise',['person','seated-person']),part('seated-man','🧎‍♂️','Seated man','Homme assis',['person','seated-person']),part('seated-woman','🧎‍♀️','Seated woman','Femme assise',['person','seated-person']),part('seated-child','👶','Small child seated','Petit enfant assis',['person','seated-person']),part('buggy','👶','Buggy with baby','Poussette avec bébé',['buggy']),part('pusher','🚶','Adult pushing pose','Adulte en position de pousser',['person','pusher'])
 ])
];

const robotGenericModes={
 body:mode('body','🤖','Body & movement','Corps et mouvement','Assemble the physical robot body.','Assemble le corps physique du robot.'),
 sensors:mode('sensors','👁️','Sensors & intelligence','Capteurs et intelligence','Add the robot’s eyes, sensors and information systems.','Ajoute les yeux, capteurs et systèmes d’information.'),
 tools:mode('tools','🧰','Tools & job','Outils et mission','Choose the equipment needed for this robot’s job.','Choisis l’équipement nécessaire à sa mission.'),
 power:mode('power','⚡','Power & mobility','Énergie et mobilité','Add power, movement and support systems.','Ajoute l’énergie, le mouvement et les systèmes de support.')
};
const robotProfiles={
 'robot-a':{
  body:[part('ra-head','🤖','Head shell','Tête'),part('ra-torso','▰','Torso','Torse'),part('ra-arm-l','🦾','Left arm','Bras gauche',['tool']),part('ra-arm-r','🦾','Right arm','Bras droit',['tool']),part('ra-hand','🖐️','Hand','Main',['tool']),part('ra-leg','🦿','Leg','Jambe',['movement']),part('ra-foot','👟','Foot','Pied',['movement'])],
  sensors:[part('ra-eyes','👀','Expressive eyes','Yeux expressifs',['sensor']),part('ra-screen','🖥️','Face screen','Écran facial',['sensor']),part('ra-camera','📷','Camera','Caméra',['sensor']),part('ra-mic','🎙️','Microphone','Microphone',['sensor']),part('ra-speaker','🔊','Speaker','Haut-parleur',['sensor'])],
  tools:[part('ra-book','📘','Book holder','Porte-livre',['tool']),part('ra-projector','📽️','Mini projector','Mini projecteur',['tool']),part('ra-tray','▱','Carry tray','Plateau',['tool']),part('ra-pointer','👉','Learning pointer','Pointeur',['tool'])],
  power:[part('ra-battery','🔋','Battery','Batterie',['power']),part('ra-charger','🔌','Charging dock','Station de recharge',['power']),part('ra-stop','🛑','Safe stop','Arrêt sûr',['safety'])]
 },
 'robot-b':{
  body:[part('rb-head','🤖','Sensor head','Tête capteur'),part('rb-core','⬢','Rover core','Noyau rover'),part('rb-wheel','🛞','Rover wheel','Roue rover',['movement','wheel']),part('rb-suspension','〽','Suspension','Suspension',['movement']),part('rb-arm','🦾','Tool arm','Bras outil',['tool'])],
  sensors:[part('rb-camera','📷','Terrain camera','Caméra terrain',['sensor']),part('rb-lidar','📡','Lidar','Lidar',['sensor']),part('rb-antenna','📶','Antenna','Antenne',['sensor']),part('rb-compass','🧭','Navigation unit','Navigation',['sensor'])],
  tools:[part('rb-drill','🪛','Sample drill','Foreuse',['tool']),part('rb-gripper','🤏','Gripper','Pince',['tool']),part('rb-sampler','🧪','Sample box','Boîte à échantillons',['tool']),part('rb-pack','🎒','Utility pack','Pack utilitaire',['tool'])],
  power:[part('rb-solar','☀️','Solar fin','Ailette solaire',['power']),part('rb-battery','🔋','Battery','Batterie',['power']),part('rb-motor','⚙️','Wheel motor','Moteur de roue',['power','movement'])]
 },
 'robot-c':{
  body:[part('rc-head','🤖','Builder head','Tête constructeur'),part('rc-torso','⬢','Heavy torso','Torse renforcé'),part('rc-leg','🦿','Heavy leg','Jambe renforcée',['movement']),part('rc-foot','▰','Heavy foot','Pied renforcé',['movement']),part('rc-arm','🦾','Tool arm','Bras outil',['tool'])],
  sensors:[part('rc-camera','📷','Work camera','Caméra de travail',['sensor']),part('rc-level','📐','Level sensor','Capteur de niveau',['sensor']),part('rc-proximity','📡','Proximity sensor','Capteur de proximité',['sensor'])],
  tools:[part('rc-drill','🪛','Drill','Foreuse',['tool']),part('rc-gripper','🤏','Gripper','Pince',['tool']),part('rc-welder','✨','Welder','Poste à souder',['tool']),part('rc-saw','⚙️','Cutting tool','Outil de coupe',['tool']),part('rc-lifter','🏗️','Lift arm','Bras élévateur',['tool'])],
  power:[part('rc-battery','🔋','Heavy battery','Batterie renforcée',['power']),part('rc-track','⚙️','All-terrain track','Chenille tout-terrain',['movement']),part('rc-beacon','🚨','Safety beacon','Gyrophare',['safety'])]
 },
 'robot-d':{
  body:[part('rd-head','🤖','Rescue head','Tête secours'),part('rd-torso','✚','Rescue body','Corps secours'),part('rd-arm','🦾','Rescue arm','Bras secours',['tool']),part('rd-thruster','💠','Leg thruster','Propulseur',['movement']),part('rd-rotor','🌀','Top rotor','Rotor supérieur',['movement'])],
  sensors:[part('rd-thermal','🌡️','Thermal camera','Caméra thermique',['sensor']),part('rd-camera','📷','Search camera','Caméra de recherche',['sensor']),part('rd-mic','🎙️','Voice detector','Détecteur vocal',['sensor']),part('rd-beacon','🚨','Emergency beacon','Balise d’urgence',['sensor','safety'])],
  tools:[part('rd-med','🩹','Medical pack','Kit médical',['tool']),part('rd-gripper','🤏','Rescue gripper','Pince de secours',['tool']),part('rd-light','🔦','Search light','Projecteur',['tool']),part('rd-rope','🪢','Rescue line','Corde de secours',['tool'])],
  power:[part('rd-battery','🔋','Emergency battery','Batterie de secours',['power']),part('rd-rotor-power','⚡','Rotor power','Alimentation rotor',['power']),part('rd-stop','🛑','Emergency stop','Arrêt d’urgence',['safety'])]
 },
 'robot-e':{
  body:[part('re-head','🤖','Ocean head','Tête marine'),part('re-core','⬢','Sealed core','Noyau étanche'),part('re-fin','🐟','Fin','Nageoire',['movement']),part('re-prop','🌀','Water propeller','Hélice aquatique',['movement']),part('re-arm','🦾','Flexible arm','Bras flexible',['tool'])],
  sensors:[part('re-sonar','📡','Sonar','Sonar',['sensor']),part('re-camera','📷','Water camera','Caméra sous-marine',['sensor']),part('re-water','💧','Water sensor','Capteur d’eau',['sensor'])],
  tools:[part('re-claw','🤏','Collection claw','Pince de collecte',['tool']),part('re-net','🥅','Collection net','Filet de collecte',['tool']),part('re-cargo','🗑️','Waste cargo bin','Bac à déchets',['tool']),part('re-cutter','✂️','Line cutter','Coupe-fil',['tool'])],
  power:[part('re-battery','🔋','Sealed battery','Batterie étanche',['power']),part('re-propulsion','💠','Water propulsion','Propulsion aquatique',['power','movement']),part('re-solar','☀️','Surface solar fin','Ailette solaire',['power'])]
 },
 'robot-f':{
  body:[part('rf-head','🤖','Sky head','Tête aérienne'),part('rf-torso','⬢','Light torso','Torse léger'),part('rf-arm','🦾','Light arm','Bras léger',['tool']),part('rf-leg','🦿','Landing leg','Jambe d’atterrissage',['movement']),part('rf-wing','', 'Hover wing','Aile de sustentation',['movement'],'wing')],
  sensors:[part('rf-camera','📷','Sky camera','Caméra aérienne',['sensor']),part('rf-altimeter','📏','Altitude sensor','Capteur d’altitude',['sensor']),part('rf-gps','🧭','Navigation sensor','Capteur de navigation',['sensor'])],
  tools:[part('rf-gripper','🤏','Light gripper','Pince légère',['tool']),part('rf-light','🔦','Search light','Projecteur',['tool']),part('rf-drop','📦','Delivery pod','Capsule de livraison',['tool'])],
  power:[part('rf-hover','🌀','Hover rotor','Rotor de sustentation',['power','movement']),part('rf-battery','🔋','Flight battery','Batterie de vol',['power']),part('rf-jet','🔥','Boost jet','Réacteur d’appoint',['power','movement'])]
 }
};

const storyParts={
 'story-forest':{
  characters:[part('sf-girl','👧','Explorer girl','Exploratrice'),part('sf-boy','🧒','Explorer boy','Explorateur'),part('sf-ranger','🧑‍🌾','Park ranger','Garde forestier'),part('sf-puppy','🐶','Lost puppy','Chiot perdu'),part('sf-deer','🦌','Deer','Cerf'),part('sf-duck','🦆','Duck','Canard')],
  places:[part('sf-tree','🌳','Large tree','Grand arbre'),part('sf-bridge','🌉','Wood bridge','Pont en bois'),part('sf-stream','🌊','Stream','Ruisseau'),part('sf-lake','💧','Lake','Lac'),part('sf-trail','🛤️','Trail','Sentier'),part('sf-picnic','🧺','Picnic area','Aire de pique-nique')],
  props:[part('sf-sign','🪧','Trail sign','Panneau'),part('sf-backpack','🎒','Backpack','Sac à dos'),part('sf-bottle','🧴','Water bottle','Bouteille'),part('sf-binoculars','🔭','Binoculars','Jumelles'),part('sf-flower','🌼','Flowers','Fleurs'),part('sf-rock','🪨','Rock','Rocher')]
 },
 'story-museum':{
  characters:[part('sm-boy','🧒','Young detective','Jeune détective'),part('sm-girl','👧','Young detective','Jeune détective'),part('sm-guide','🧑‍🏫','Museum guide','Guide du musée')],
  places:[part('sm-stairs','🪜','Grand stairs','Grand escalier'),part('sm-case','▣','Display case','Vitrine'),part('sm-dino','🦖','Dinosaur skeleton','Squelette de dinosaure'),part('sm-gallery','🖼️','Gallery wall','Mur de galerie')],
  props:[part('sm-key','🗝️','Golden key','Clé dorée'),part('sm-map','🗺️','Ancient map','Carte ancienne'),part('sm-flash','🔦','Flashlight','Lampe torche'),part('sm-compass','🧭','Compass','Boussole'),part('sm-clue','✨','Clue marker','Indice'),part('sm-book','📚','Old books','Vieux livres')]
 },
 'story-space':{
  characters:[part('ss-girl','👩‍🚀','Explorer','Exploratrice'),part('ss-boy','👨‍🚀','Explorer','Explorateur'),part('ss-robot','🤖','Delivery robot','Robot livreur'),part('ss-worker','🧑‍🚀','Base worker','Technicien')],
  places:[part('ss-shuttle','🚀','Shuttle','Navette'),part('ss-dome','🔵','Habitat dome','Dôme habitat'),part('ss-lab','🧪','Research lab','Laboratoire'),part('ss-bay','▰','Shuttle bay','Baie navette')],
  props:[part('ss-crate','📦','Cargo crate','Caisse'),part('ss-sign','🪧','Direction sign','Panneau'),part('ss-rover','🚙','Small rover','Petit rover'),part('ss-plant','🪴','Space plant','Plante'),part('ss-tablet','📱','Mission tablet','Tablette')]
 },
 'story-castle':{
  characters:[part('sc-boy','🧒','Young quester','Jeune aventurier'),part('sc-girl','👧','Young quester','Jeune aventurière'),part('sc-dragon','🐉','Friendly dragon','Dragon amical'),part('sc-musician','🎸','Festival musician','Musicien'),part('sc-dog','🐕','Festival dog','Chien')],
  places:[part('sc-castle','🏰','Castle gate','Porte du château'),part('sc-stall','⛺','Market stall','Stand du marché'),part('sc-fountain','⛲','Courtyard fountain','Fontaine'),part('sc-bridge','🌉','Castle bridge','Pont')],
  props:[part('sc-map','🗺️','Quest map','Carte de quête'),part('sc-banner','🚩','Festival banner','Bannière'),part('sc-lantern','🏮','Lantern','Lanterne'),part('sc-crown','👑','Crown clue','Indice couronne'),part('sc-food','🥨','Festival food','Nourriture')]
 },
 'story-school':{
  characters:[part('si-girl','👧','Young inventor','Jeune inventrice'),part('si-boy','🧒','Young inventor','Jeune inventeur'),part('si-teacher','🧑‍🏫','Teacher / judge','Professeur / juge'),part('si-student','🧑','Visitor student','Élève visiteur')],
  places:[part('si-table','▭','Display table','Table d’exposition'),part('si-banner','🪧','Event banner','Bannière'),part('si-booth','▰','Project booth','Stand de projet')],
  props:[part('si-robot','🤖','Mini robot','Mini robot'),part('si-solar','☀️','Solar panel','Panneau solaire'),part('si-trophy','🏆','Trophy','Trophée'),part('si-ribbon','🎗️','Award ribbon','Ruban'),part('si-laptop','💻','Laptop','Ordinateur'),part('si-light','💡','Mood light','Lampe'),part('si-tools','🧰','Tool set','Outils')]
 }
};

const marsParts={
 'mars-red':{
  structures:[part('mr-dome','🔵','Dome module','Dôme'),part('mr-habitat','🏠','Habitat','Habitat'),part('mr-lab','🧪','Research lab','Laboratoire'),part('mr-airlock','🚪','Airlock','Sas'),part('mr-corridor','▬','Corridor','Couloir'),part('mr-greenhouse','🌿','Greenhouse','Serre')],
  systems:[part('mr-solar','☀️','Solar panel','Panneau solaire'),part('mr-antenna','📡','Antenna','Antenne'),part('mr-oxygen','🫧','Oxygen unit','Unité oxygène'),part('mr-water','💧','Water tank','Réservoir d’eau'),part('mr-power','🔋','Power store','Stockage énergie')],
  transport:[part('mr-rover','🚙','Rover','Rover'),part('mr-crate','📦','Cargo crate','Caisse'),part('mr-arm','🏗️','Robot arm','Bras robotique')]
 },
 'mars-olympus':{
  structures:[part('mo-family','🏠','Family module','Module familial'),part('mo-dome','🔵','Habitat dome','Dôme habitat'),part('mo-green','🌿','Greenhouse','Serre'),part('mo-plaza','⛲','Central plaza','Place centrale'),part('mo-school','🏫','Learning module','Module école'),part('mo-corridor','▬','Connector corridor','Couloir')],
  systems:[part('mo-comms','📡','Communication tower','Tour de communication'),part('mo-solar','☀️','Solar array','Panneaux solaires'),part('mo-water','💧','Water system','Système d’eau'),part('mo-oxygen','🫧','Life support','Support-vie')],
  transport:[part('mo-car','🚙','Colony vehicle','Véhicule'),part('mo-cargo','📦','Cargo cart','Chariot'),part('mo-crew','🧑‍🚀','Explorer','Explorateur')]
 },
 'mars-ice':{
  structures:[part('mi-pod','🏠','Habitat pod','Module habitat'),part('mi-garage','▰','Rover garage','Garage rover'),part('mi-drill','🏗️','Ice core drill','Foreuse à glace'),part('mi-pipe','▬','Pipeline','Canalisation'),part('mi-storage','🛢️','Water storage','Stockage d’eau')],
  systems:[part('mi-comms','📡','Communications','Communications'),part('mi-pump','⚙️','Pump','Pompe'),part('mi-solar','☀️','Solar panel','Panneau solaire'),part('mi-ice','🧊','Ice core','Carotte de glace')],
  transport:[part('mi-rover','🚙','Utility rover','Rover utilitaire'),part('mi-truck','🚚','Cargo vehicle','Véhicule cargo'),part('mi-crate','📦','Resource crate','Caisse')]
 },
 'mars-canyon':{
  structures:[part('mc-dome','🔵','Shield dome','Dôme protégé'),part('mc-observe','🔭','Observation pod','Module observation'),part('mc-tunnel','▬','Protected tunnel','Tunnel protégé'),part('mc-science','🧪','Science module','Module science'),part('mc-tower','▰','Life support tower','Tour support-vie')],
  systems:[part('mc-solar','☀️','Solar panel','Panneau solaire'),part('mc-dish','📡','Dish antenna','Antenne parabolique'),part('mc-emergency','🚨','Emergency unit','Unité urgence'),part('mc-oxygen','🫧','Oxygen unit','Unité oxygène')],
  transport:[part('mc-rover','🚙','Canyon rover','Rover canyon'),part('mc-robot','🤖','Science robot','Robot science'),part('mc-crew','🧑‍🚀','Scientist','Scientifique')]
 },
 'mars-launch':{
  structures:[part('ml-pad','⭕','Landing pad','Aire d’atterrissage'),part('ml-hangar','▰','Maintenance hangar','Hangar'),part('ml-tower','🏗️','Launch tower','Tour de lancement'),part('ml-workshop','🧰','Rover workshop','Atelier rover'),part('ml-rocket','🚀','Rocket / shuttle','Fusée / navette')],
  systems:[part('ml-fuel','🛢️','Fuel tank','Réservoir carburant'),part('ml-dish','📡','Communication dish','Antenne'),part('ml-arm','🏗️','Maintenance arm','Bras maintenance'),part('ml-power','⚡','Power unit','Unité énergie')],
  transport:[part('ml-rover','🚙','Engineering rover','Rover ingénierie'),part('ml-cart','🚚','Supply cart','Chariot'),part('ml-crew','🧑‍🚀','Engineer','Ingénieur'),part('ml-crate','📦','Supply crate','Caisse')]
 }
};

function robotModesFor(profile){const data=robotProfiles[profile]||robotProfiles['robot-a'];return ['body','sensors','tools','power'].map(k=>({...robotGenericModes[k],parts:data[k]||[]}));}
function storyModesFor(profile){const d=storyParts[profile]||storyParts['story-forest'];return [mode('characters','🧑','Characters','Personnages','Build the cast from separate poses and characters.','Construis les personnages séparément.',d.characters),mode('places','🌍','Places & scene','Lieux et scène','Build the world from many small locations and environment pieces.','Construis le monde avec de nombreux petits éléments.',d.places),mode('props','🧰','Props & clues','Accessoires et indices','Add the small objects that make the story happen.','Ajoute les petits objets qui font avancer l’histoire.',d.props),mode('story-details','💬','Story details','Détails de l’histoire','Add speech, signs, weather and visual details.','Ajoute dialogues, panneaux, météo et détails visuels.',[part('speech','💬','Speech bubble','Bulle de dialogue'),part('thought','☁️','Thought bubble','Bulle de pensée'),part('arrow','➜','Direction arrow','Flèche'),part('spark','✨','Story clue glow','Éclat d’indice'),part('rain','🌧️','Rain','Pluie'),part('sun','☀️','Sunlight','Soleil')])];}
function marsModesFor(profile){const d=marsParts[profile]||marsParts['mars-red'];return [mode('structures','🏠','Base structures','Structures','Build the settlement from small connected modules.','Construis la base avec de petits modules connectés.',d.structures),mode('systems','⚡','Life-support systems','Systèmes de survie','Add power, air, water and communication.','Ajoute énergie, air, eau et communication.',d.systems),mode('transport','🚙','Rovers, crew & cargo','Rovers, équipe et cargo','Populate and operate the base.','Peuple et fais fonctionner la base.',d.transport),mode('terrain','🪨','Mars terrain','Terrain martien','Shape the ground around the base.','Aménage le terrain autour de la base.',[part('mars-rock','🪨','Mars rock','Rocher martien'),part('crater','⭕','Crater','Cratère'),part('ridge','⛰️','Ridge','Crête'),part('ice','🧊','Ice patch','Zone de glace'),part('marker','🚩','Mission marker','Repère de mission')])];}

const missions={
 vehicle:{title:['Future Vehicle','Véhicule du futur'],prompt:['Choose a vehicle, rotate its real blueprint around the car, then build it from matching parts.','Choisis un véhicule, fais tourner son vrai plan autour de la voiture, puis construis-le avec les pièces correspondantes.'],prompts:[['Who is it for?','Pour qui est-il ?'],['What problem does it solve?','Quel problème résout-il ?']],coach:['Rotate the blueprint to inspect every side. Build carefully so each part fits the selected vehicle.','Fais tourner le plan pour inspecter chaque côté. Construis avec précision pour que chaque pièce corresponde au véhicule choisi.'],checks:[['movement','Movement'],['power','Power'],['safety','Safety'],['passenger','Passenger design']],library:vehicleLibrary,modes:vehicleModes},
 room:{title:['Dream Room','Chambre de rêve'],prompt:['Plan a realistic room, combine furniture with smaller objects and test lighting and layout.','Planifie une pièce réaliste, combine meubles et petits objets puis teste l’éclairage et l’agencement.'],prompts:[['Main purpose','Fonction principale'],['Who uses it?','Qui l’utilise ?']],coach:['Can someone move comfortably, use the storage, and reach everything without furniture overlapping unrealistically?','Peut-on circuler confortablement, utiliser les rangements et atteindre les objets sans chevauchement irréaliste ?'],checks:[['structure','Layout'],['furniture','Furniture'],['light','Lighting'],['storage','Storage']],modes:roomModes},
 park:{title:['Design a Park','Concevoir un parc'],prompt:['Build a large modern park from many separate pieces. Match people, facilities, nature, sports and activities to create a living place.','Construis un grand parc moderne avec de nombreux éléments séparés. Associe personnes, équipements, nature, sports et activités.'],prompts:[['Who will use it?','Qui l’utilisera ?'],['What activities should happen here?','Quelles activités doivent s’y dérouler ?']],coach:['Does the park feel alive, accessible and varied, with the right people matched to the right facilities and activities?','Le parc paraît-il vivant, accessible et varié, avec les bonnes personnes associées aux bons équipements ?'],checks:[['play','Play'],['nature','Nature'],['access','Accessibility'],['seating','Seating']],modes:parkModes},
 robot:{title:['Invent a Robot','Inventer un robot'],prompt:['Choose one or more robot designs. Their blueprints can share the board while you assemble each robot from small matching parts.','Choisis un ou plusieurs robots. Leurs plans peuvent partager la zone pendant que tu les assembles pièce par pièce.'],prompts:[['What job should it do?','Quelle mission doit-il accomplir ?'],['What makes it safe?','Qu’est-ce qui le rend sûr ?']],coach:['Which robot are you building, and have you chosen parts that make sense for its job?','Quel robot construis-tu, et les pièces choisies correspondent-elles à sa mission ?'],checks:[['movement','Movement'],['sensor','Sensors'],['tool','Useful tools'],['power','Power']],library:robotLibrary,dynamicModes:'robot'},
 story:{title:['Story Builder','Créateur d’histoires'],prompt:['Choose a visual-story blueprint, then rebuild the scene from many small characters, locations, props and clues.','Choisis un plan d’histoire visuelle, puis reconstruis la scène avec de nombreux petits personnages, lieux, accessoires et indices.'],prompts:[['What is the main challenge?','Quel est le défi principal ?'],['How should the story end?','Comment l’histoire doit-elle finir ?']],coach:['Can someone understand what is happening from the characters, scene and props you placed?','Peut-on comprendre ce qui se passe grâce aux personnages, au décor et aux accessoires placés ?'],checks:[['character','Characters'],['place','Scene'],['prop','Props']],library:storyLibrary,dynamicModes:'story'},
 mars:{title:['Mars Base','Base martienne'],prompt:['Choose a Mars-base blueprint and rebuild it piece by piece using habitats, life-support systems, rovers, crew and terrain.','Choisis un plan de base martienne et reconstruis-la pièce par pièce avec habitats, survie, rovers, équipe et terrain.'],prompts:[['How many people live here?','Combien de personnes vivent ici ?'],['What is the base mission?','Quelle est la mission de la base ?']],coach:['Does your base have somewhere to live, enough life support and a way to move supplies and people?','Ta base possède-t-elle des logements, des systèmes de survie et un moyen de déplacer personnes et fournitures ?'],checks:[['structure','Structures'],['system','Life support'],['transport','Transport']],library:marsLibrary,dynamicModes:'mars'}
};

const canvas=$('creatorCanvas'),ctx=canvas.getContext('2d'),templateCanvas=$('creatorTemplate'),tctx=templateCanvas.getContext('2d');
const stage=$('creatorDesignStage'),buildLayer=$('creatorBuildLayer'),objectLayer=$('creatorObjects'),simulation=$('creatorSimulation');
const colours=['#f8fbff','#5de4ff','#5d6cff','#9b6dff','#ffd45b','#5ee3a4','#ff9d5d','#ff77b7','#ff647c','#1d3147'];
let active=null,activeMode=null,currentLibraryId=null,tool='select',colour=colours[1],drawing=false,startPoint=null,lastPoint=null,tempVector=null,freePoints=[],selectedObject=null,drawStrokes=0,templateOn=true,gridOn=false,history=[],historyIndex=-1,restoring=false,testRunning=false,vehicleYaw=0,vehiclePitch=.10,vehicleViewMode='orbit',vehicleOrbiting=false;
const STORAGE='cw_creator_projects_v18';
const VEHICLE_PUZZLE_VERSION=9;

function modesForMission(m){if(m.dynamicModes==='robot')return robotModesFor(currentLibraryId||'robot-a');if(m.dynamicModes==='story')return storyModesFor(currentLibraryId||'story-forest');if(m.dynamicModes==='mars')return marsModesFor(currentLibraryId||'mars-red');return m.modes||[];}
function allParts(){if(!active)return[];return modesForMission(missions[active]).flatMap(m=>m.parts||[]);}
function findPart(id){return allParts().find(p=>p.id===id);}
function saveStore(data){localStorage.setItem(STORAGE,JSON.stringify(data));}
function loadStore(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return{}}}

function renderColours(){const host=$('creatorColors');host.innerHTML='';colours.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='creator-color'+(c===colour?' active':'');b.style.background=c;b.title=c;b.onclick=()=>{colour=c;renderColours()};host.appendChild(b)});}
function setTool(next){tool=next;document.querySelectorAll('.creator-toolbar .creator-tool[id^="tool"]').forEach(b=>b.classList.remove('active'));const map={select:'toolSelect',pen:'toolPen',eraser:'toolEraser',line:'toolLine',curve:'toolCurve',rect:'toolRect',circle:'toolCircle'};$(map[next])?.classList.add('active');canvas.style.cursor=next==='select'?'default':'crosshair';}


function vehicleProfile(){
  return currentLibraryId==='vehicle-executive'
    ?{id:'executive',length:5.02,width:1.88,height:1.45,wheelbase:2.93,wheelRadius:.38,cabinFront:-.92,cabinRear:1.18,bodyZ:.30,roofZ:1.42}
    :{id:'sport',length:4.58,width:1.96,height:1.20,wheelbase:2.72,wheelRadius:.39,cabinFront:-.70,cabinRear:.92,bodyZ:.27,roofZ:1.17};
}
function rotateVehiclePoint(p,yaw,pitch){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const x=p[0]*cy-p[1]*sy,depth=p[0]*sy+p[1]*cy,z=p[2];
  return [x,depth*cp-z*sp,depth*sp+z*cp];
}
function vehicleProjectPoint(p){
  const q=rotateVehiclePoint(p,vehicleYaw,vehiclePitch),D=7.8,scale=currentLibraryId==='vehicle-executive'?76:81;
  const persp=clamp(D/(D-q[1]),.62,1.58);
  return{x:400+q[0]*scale*persp,y:282-q[2]*scale*persp,depth:q[1],persp};
}
function vehicleProjectVector(v){
  const q=rotateVehiclePoint(v,vehicleYaw,vehiclePitch);
  return{x:q[0],depth:q[1],z:q[2]};
}
function vehicleSlot(key,partId,center,u,v,normal,opts={}){
  return{key,partId,center,u,v,normal,shape:opts.shape||null,aspect:opts.aspect||1,required:opts.required!==false,minFacing:opts.minFacing??.30,view:opts.view||'exterior',label:opts.label||partId};
}
/*
  The Sport Car is the reference puzzle car for this pass.  Every major exterior
  component below owns one puzzle contour.  The very same contour is used for
  the dashed blueprint slot, the palette piece and the final installed panel.
  This keeps the activity behaving like a wooden peg puzzle rather than stickers.
*/
function vehiclePartShape(partId){
  const circle=()=>Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2;return[Math.cos(a),Math.sin(a)]});
  const shapes={
    door:[[-1,-.94],[-.98,.44],[-.66,.96],[.68,.94],[.98,.54],[1,-.90]],
    window:[[-1,-.78],[-.72,.90],[.18,1],[.92,.58],[1,-.70],[.62,-.96],[-.62,-.94]],
    windscreen:[[-.96,-.82],[-.72,.96],[.72,.96],[.96,-.82],[.68,-1],[-.68,-1]],
    'rear-window':[[-.96,-.78],[-.70,.96],[.68,.96],[.96,-.76],[.66,-1],[-.66,-1]],
    roof:[[-1,-.74],[-.62,-1],[.66,-.94],[1,-.62],[.92,.70],[.58,1],[-.64,.96],[-.98,.62]],
    hood:[[-1,-.72],[-.74,-1],[.72,-.92],[1,-.54],[.88,.68],[.56,.96],[-.66,.94],[-.96,.60]],
    trunk:[[-1,-.62],[-.68,-.96],[.66,-.92],[1,-.58],[.90,.66],[.58,.94],[-.66,.92],[-.96,.58]],
    mirror:[[-1,-.12],[-.66,-.72],[.16,-1],[1,-.34],[.82,.42],[-.18,.86],[-.82,.54]],
    headlight:[[-1,-.48],[-.66,-.90],[.34,-.78],[1,-.18],[.70,.62],[-.38,.84]],
    taillight:[[-1,-.34],[-.60,-.82],[.34,-.72],[1,-.14],[.68,.58],[-.34,.82]],
    bumper:[[-1,-.42],[-.72,-.82],[.60,-.80],[1,-.36],[.90,.42],[.48,.72],[-.66,.70]],
    'rear-bumper':[[-1,-.38],[-.62,-.76],[.66,-.72],[1,-.30],[.86,.44],[.40,.72],[-.70,.68]],
    dashboard:[[-1,-.46],[-.78,-.82],[.74,-.78],[1,-.40],[.88,.56],[.52,.82],[-.60,.84],[-.92,.52]],
    'driver-seat':[[-.80,-.92],[.80,-.92],[.96,-.50],[.78,.92],[-.78,.92],[-.96,-.50]],
    seat:[[-.80,-.92],[.80,-.92],[.96,-.50],[.78,.92],[-.78,.92],[-.96,-.50]],
    belt:[[-.88,-1],[-.62,-1],[.90,.78],[.68,1]],
    battery:[[-1,-.72],[.82,-.72],[1,-.45],[.92,.72],[-.92,.72],[-1,.46]],
    camera:[[-1,-.72],[.72,-.72],[1,-.12],[.72,.72],[-.72,.72],[-1,.12]]
  };
  if(['steering','airbag','emergency-stop'].includes(partId))return circle();
  return shapes[partId]||[[-1,-1],[1,-1],[1,1],[-1,1]];
}
function vehicleSlotDefinitions(){
  const p=vehicleProfile(),L=p.length,W=p.width,H=p.height,wb=p.wheelbase,r=p.wheelRadius,sides=[-1,1],slots=[];
  const sport=p.id==='sport';
  /* Side pieces: proportions are tied to the actual cabin/body outline. */
  const sideY=W*.505;
  const doorCX=sport?.28:.34,doorHalf=sport?.61:.66,doorZ=sport?.57:.62,doorHalfZ=sport?.27:.29;
  const winCX=sport?.02:.08,winHalf=sport?.49:.53,winZ=sport?.91:1.03,winHalfZ=sport?.17:.20;
  for(const sgn of sides){
    const y=sgn*sideY,n=[0,sgn,0];
    slots.push(vehicleSlot(`wheel-front-${sgn>0?'r':'l'}`,'wheel',[-wb/2,y,.34],[r,0,0],[0,0,r],n,{aspect:1,minFacing:.40}));
    slots.push(vehicleSlot(`wheel-rear-${sgn>0?'r':'l'}`,'wheel',[wb/2,y,.34],[r,0,0],[0,0,r],n,{aspect:1,minFacing:.40}));
    slots.push(vehicleSlot(`door-${sgn>0?'r':'l'}`,'door',[doorCX,y,doorZ],[doorHalf,0,0],[0,0,doorHalfZ],n,{aspect:2.0,minFacing:.40,shape:vehiclePartShape('door')}));
    slots.push(vehicleSlot(`window-${sgn>0?'r':'l'}`,'window',[winCX,y*.985,winZ],[winHalf,0,0],[0,0,winHalfZ],n,{aspect:2.7,minFacing:.40,shape:vehiclePartShape('window')}));
    slots.push(vehicleSlot(`mirror-${sgn>0?'r':'l'}`,'mirror',[-.58,sgn*W*.575,.84],[.105,0,0],[0,0,.065],n,{aspect:1.65,minFacing:.30,shape:vehiclePartShape('mirror')}));
  }
  /* Glass and top panels meet at the same cabin break-points used by the wireframe. */
  slots.push(vehicleSlot('windscreen','windscreen',[-.47,0,sport?.94:1.07],[0,W*.405,0],[.255,0,.175],[-.58,0,.80],{aspect:1.85,minFacing:.16,shape:vehiclePartShape('windscreen')}));
  slots.push(vehicleSlot('rear-window','rear-window',[.63,0,sport?.93:1.05],[0,W*.385,0],[-.255,0,.17],[.58,0,.80],{aspect:1.82,minFacing:.16,shape:vehiclePartShape('rear-window')}));
  slots.push(vehicleSlot('roof','roof',[.10,0,H*.985],[sport?.47:.52,0,0],[0,W*.37,0],[0,0,1],{aspect:1.35,minFacing:.10,shape:vehiclePartShape('roof')}));
  slots.push(vehicleSlot('hood','hood',[-L*.325,0,sport?.67:.72],[sport?.30*L:.29*L,0,.015],[0,W*.39,0],[0,0,1],{aspect:1.75,minFacing:.08,shape:vehiclePartShape('hood')}));
  slots.push(vehicleSlot('trunk','trunk',[L*.33,0,sport?.63:.69],[sport?.205*L:.20*L,0,.015],[0,W*.37,0],[0,0,1],{aspect:1.45,minFacing:.08,shape:vehiclePartShape('trunk')}));
  for(const sgn of sides){
    slots.push(vehicleSlot(`headlight-${sgn>0?'r':'l'}`,'headlight',[-L*.465,sgn*W*.31,.53],[0,W*.155,0],[0,0,.075],[-1,0,.15],{aspect:2.15,minFacing:.26,shape:vehiclePartShape('headlight')}));
    slots.push(vehicleSlot(`taillight-${sgn>0?'r':'l'}`,'taillight',[L*.465,sgn*W*.31,.50],[0,W*.145,0],[0,0,.072],[1,0,.15],{aspect:2.0,minFacing:.26,shape:vehiclePartShape('taillight')}));
  }
  slots.push(vehicleSlot('front-bumper','bumper',[-L*.49,0,.31],[0,W*.43,0],[0,0,.13],[-1,0,0],{aspect:3.3,minFacing:.38,shape:vehiclePartShape('bumper')}));
  slots.push(vehicleSlot('rear-bumper','rear-bumper',[L*.49,0,.30],[0,W*.42,0],[0,0,.125],[1,0,0],{aspect:3.3,minFacing:.38,shape:vehiclePartShape('rear-bumper')}));
  return slots;
}
function vehicleSlotShapePoints(slot){
  return (slot.shape||vehiclePartShape(slot.partId)).map(([a,b])=>[
    slot.center[0]+slot.u[0]*a+slot.v[0]*b,
    slot.center[1]+slot.u[1]*a+slot.v[1]*b,
    slot.center[2]+slot.u[2]*a+slot.v[2]*b
  ]);
}
function vehiclePartFill(partId){
  if(partId==='headlight')return{fill:'rgba(220,249,255,.88)',stroke:'rgba(247,254,255,.98)'};
  if(partId==='taillight')return{fill:'rgba(255,84,111,.78)',stroke:'rgba(255,196,207,.95)'};
  if(['window','windscreen','rear-window'].includes(partId))return{fill:'rgba(95,202,235,.34)',stroke:'rgba(218,248,255,.82)'};
  if(partId==='mirror')return{fill:'rgba(132,170,195,.70)',stroke:'rgba(229,244,252,.88)'};
  return{fill:'rgba(128,159,185,.63)',stroke:'rgba(229,243,251,.90)'};
}
function drawInstalledVehiclePanel(proj){
  if(!proj||proj.partId==='wheel')return;
  const pts=proj.shapeCorners||proj.corners,style=vehiclePartFill(proj.partId);
  tctx.save();tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y));tctx.closePath();
  tctx.fillStyle=style.fill;tctx.strokeStyle=style.stroke;tctx.lineWidth=1.65;tctx.fill();tctx.stroke();
  if(proj.partId==='door'){
    const a=pts[Math.min(2,pts.length-1)],b=pts[Math.min(3,pts.length-1)];
    const hx=a.x*.66+b.x*.34,hy=a.y*.66+b.y*.34;
    tctx.strokeStyle='rgba(26,58,78,.72)';tctx.lineWidth=2.2;tctx.beginPath();tctx.moveTo(hx-7,hy);tctx.lineTo(hx+4,hy);tctx.stroke();
  }
  tctx.restore();
}

function vehicleInteriorSlots(){
  const p=vehicleProfile(),W=p.width,sport=p.id==='sport',down=[0,0,-1],slots=[];
  /*
    Interior / underbody puzzle pieces live in real 3D positions inside the same car.
    They are intentionally exposed only when the child rotates underneath the car
    (or taps Interior).  The palette piece and slot still share the exact contour.
  */
  slots.push(vehicleSlot('dashboard','dashboard',[-.62,0,sport?.73:.84],[0,W*.34,0],[.16,0,0],down,{aspect:2.4,minFacing:.34,view:'interior',shape:vehiclePartShape('dashboard'),required:true}));
  slots.push(vehicleSlot('steering','steering',[-.45,-W*.29,sport?.70:.81],[.105,0,0],[0,.105,0],down,{aspect:1,minFacing:.34,view:'interior',shape:vehiclePartShape('steering'),required:true}));
  slots.push(vehicleSlot('driver-seat','driver-seat',[.03,-W*.28,sport?.53:.60],[.19,0,0],[0,.135,0],down,{aspect:1.42,minFacing:.34,view:'interior',shape:vehiclePartShape('driver-seat'),required:true}));
  slots.push(vehicleSlot('passenger-seat','seat',[.03,W*.28,sport?.53:.60],[.19,0,0],[0,.135,0],down,{aspect:1.42,minFacing:.34,view:'interior',shape:vehiclePartShape('seat'),required:true}));

  /* Cabin safety equipment: optional to the basic body puzzle, but it now has a true fitting place. */
  slots.push(vehicleSlot('belt-driver','belt',[.08,-W*.40,sport?.58:.65],[.12,0,0],[0,.045,0],down,{aspect:2.7,minFacing:.34,view:'interior',shape:vehiclePartShape('belt'),required:false}));
  slots.push(vehicleSlot('belt-passenger','belt',[.08,W*.40,sport?.58:.65],[.12,0,0],[0,.045,0],down,{aspect:2.7,minFacing:.34,view:'interior',shape:vehiclePartShape('belt'),required:false}));
  slots.push(vehicleSlot('airbag-driver','airbag',[-.50,-W*.25,sport?.69:.80],[.075,0,0],[0,.075,0],down,{aspect:1,minFacing:.34,view:'interior',shape:vehiclePartShape('airbag'),required:false}));
  slots.push(vehicleSlot('airbag-passenger','airbag',[-.56,W*.25,sport?.69:.80],[.085,0,0],[0,.085,0],down,{aspect:1,minFacing:.34,view:'interior',shape:vehiclePartShape('airbag'),required:false}));
  slots.push(vehicleSlot('cabin-camera','camera',[-.33,0,sport?.91:1.04],[.075,0,0],[0,.050,0],down,{aspect:1.5,minFacing:.34,view:'interior',shape:vehiclePartShape('camera'),required:false}));
  slots.push(vehicleSlot('emergency-stop','emergency-stop',[-.48,W*.12,sport?.70:.81],[.050,0,0],[0,.050,0],down,{aspect:1,minFacing:.34,view:'interior',shape:vehiclePartShape('emergency-stop'),required:false}));

  /* One unmistakably internal power item: the under-floor battery pack. */
  slots.push(vehicleSlot('battery-underfloor','battery',[.58,0,sport?.35:.40],[.34,0,0],[0,W*.30,0],down,{aspect:1.15,minFacing:.34,view:'interior',shape:vehiclePartShape('battery'),required:false}));
  return slots;
}
function vehicleUnderAccess(){return vehicleViewMode==='interior'||vehiclePitch>.38;}
function installedVehicleKeys(){
  return new Set([...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.installed==='1'&&o.dataset.targetKey).map(o=>o.dataset.targetKey));
}
function vehicleSlotProjection(slot){
  const c=vehicleProjectPoint(slot.center);
  const corners=[
    [slot.center[0]-slot.u[0]-slot.v[0],slot.center[1]-slot.u[1]-slot.v[1],slot.center[2]-slot.u[2]-slot.v[2]],
    [slot.center[0]+slot.u[0]-slot.v[0],slot.center[1]+slot.u[1]-slot.v[1],slot.center[2]+slot.u[2]-slot.v[2]],
    [slot.center[0]+slot.u[0]+slot.v[0],slot.center[1]+slot.u[1]+slot.v[1],slot.center[2]+slot.u[2]+slot.v[2]],
    [slot.center[0]-slot.u[0]+slot.v[0],slot.center[1]-slot.u[1]+slot.v[1],slot.center[2]-slot.u[2]+slot.v[2]]
  ].map(vehicleProjectPoint);
  const u0=vehicleProjectPoint([slot.center[0]-slot.u[0],slot.center[1]-slot.u[1],slot.center[2]-slot.u[2]]);
  const u1=vehicleProjectPoint([slot.center[0]+slot.u[0],slot.center[1]+slot.u[1],slot.center[2]+slot.u[2]]);
  const v0=vehicleProjectPoint([slot.center[0]-slot.v[0],slot.center[1]-slot.v[1],slot.center[2]-slot.v[2]]);
  const v1=vehicleProjectPoint([slot.center[0]+slot.v[0],slot.center[1]+slot.v[1],slot.center[2]+slot.v[2]]);
  const ux=(u1.x-u0.x)/2,uy=(u1.y-u0.y)/2,vx=(v1.x-v0.x)/2,vy=(v1.y-v0.y)/2;
  const w=Math.max(10,Math.hypot(ux,uy)*2);
  const h=Math.max(10,Math.hypot(vx,vy)*2);
  const screenAngle=Math.atan2(uy,ux)*180/Math.PI;
  const n=vehicleProjectVector(slot.normal),facing=n.depth,isInterior=slot.view==='interior';
  const shapeCorners=vehicleSlotShapePoints(slot).map(vehicleProjectPoint);
  const visible=isInterior?(vehicleUnderAccess()&&facing>=slot.minFacing):(facing>=slot.minFacing);
  return{...slot,cx:c.x,cy:c.y,w,h,sizePx:w,screenAspect:clamp(w/h,.28,4.2),screenAngle,
    screenU:{x:ux,y:uy},screenV:{x:vx,y:vy},facing,visible,corners,shapeCorners};
}
function vehicleMainEdges(){
  const p=vehicleProfile(),L=p.length,W=p.width,H=p.height,y=W*.49;
  const z0=p.bodyZ;
  const sport=p.id==='sport';
  const side=[
    [-L*.50,-y,z0],[-L*.47,-y,z0+.19],[-L*.38,-y,z0+.36],[-L*.18,-y,z0+.44],
    [p.cabinFront,-y*.93,sport?H*.78:H*.73],[-L*.04,-y*.91,H*.98],[p.cabinRear*.42,-y*.91,H],
    [p.cabinRear,-y*.93,sport?H*.72:H*.78],[L*.43,-y,z0+.35],[L*.50,-y,z0+.16],[L*.48,-y,z0],[-L*.46,-y,z0]
  ];
  const side2=side.map(v=>[v[0],-v[1],v[2]]);
  const edges=[side,side2];
  [0,2,3,4,5,6,7,8,9,10].forEach(i=>edges.push([side[i],side2[i]]));
  edges.push([[-L*.45,-y,z0+.35],[-L*.18,-y,z0+.45],[p.cabinFront,-y*.93,H*.76]]);
  edges.push([[-L*.45,y,z0+.35],[-L*.18,y,z0+.45],[p.cabinFront,y*.93,H*.76]]);
  edges.push([[p.cabinRear,-y*.93,H*.72],[L*.42,-y,z0+.35]]);
  edges.push([[p.cabinRear,y*.93,H*.72],[L*.42,y,z0+.35]]);
  edges.push([[-L*.42,-y*.96,z0+.26],[L*.42,-y*.96,z0+.26]]);
  edges.push([[-L*.42,y*.96,z0+.26],[L*.42,y*.96,z0+.26]]);
  return edges;
}
function drawProjectedPath(points,project=vehicleProjectPoint,close=false,dash=[]){
  if(!points.length)return;
  tctx.beginPath();
  points.forEach((p,i)=>{const q=project(p);i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y)});
  if(close)tctx.closePath();
  tctx.setLineDash(dash);tctx.stroke();tctx.setLineDash([]);
}
function drawVehicleWheelGuide(slot,proj,installed){
  const pts=[];for(let i=0;i<=44;i++){const a=i/44*Math.PI*2;pts.push([
    slot.center[0]+slot.u[0]*Math.cos(a)+slot.v[0]*Math.sin(a),
    slot.center[1]+slot.u[1]*Math.cos(a)+slot.v[1]*Math.sin(a),
    slot.center[2]+slot.u[2]*Math.cos(a)+slot.v[2]*Math.sin(a)
  ])}
  tctx.save();
  tctx.strokeStyle=installed?'rgba(92,239,185,.25)':'rgba(159,236,255,.62)';
  tctx.lineWidth=installed?1.4:2.2;tctx.setLineDash(installed?[]:[8,6]);drawProjectedPath(pts);tctx.restore();
}
function drawVehicleSlotGuide(slot,proj,installed){
  if(slot.partId==='wheel'){drawVehicleWheelGuide(slot,proj,installed);return}
  const pts=proj.shapeCorners||proj.corners;
  tctx.save();tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y));tctx.closePath();
  if(installed){tctx.fillStyle='rgba(68,229,173,.055)';tctx.strokeStyle='rgba(68,229,173,.16)';tctx.setLineDash([]);tctx.lineWidth=1.2}
  else{tctx.fillStyle='rgba(93,228,255,.025)';tctx.strokeStyle='rgba(164,239,255,.58)';tctx.setLineDash([7,6]);tctx.lineWidth=2}
  tctx.fill();tctx.stroke();tctx.restore();
}
function drawVehicleWireframe(){
  const edges=vehicleMainEdges();
  tctx.save();
  if(testRunning){
    const nearSide=edges[1];
    tctx.beginPath();
    nearSide.forEach((pt,i)=>{const q=vehicleProjectPoint(pt);i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y)});
    tctx.closePath();tctx.fillStyle='rgba(46,156,235,.24)';tctx.fill();
  }
  tctx.lineCap='round';tctx.lineJoin='round';tctx.strokeStyle='rgba(88,225,255,.76)';tctx.lineWidth=2.1;
  edges.forEach(e=>drawProjectedPath(e));
  tctx.strokeStyle='rgba(88,225,255,.20)';tctx.lineWidth=1;
  const p=vehicleProfile(),L=p.length,W=p.width;
  [[-.44,.24],[-.18,.44],[.12,.52],[.37,.36]].forEach(([xf,z])=>drawProjectedPath([[xf*L,-W*.48,z],[xf*L,W*.48,z]]));
  tctx.restore();
}
function drawVehicleGround(){
  tctx.save();tctx.strokeStyle='rgba(93,228,255,.12)';tctx.lineWidth=1.2;tctx.setLineDash([8,8]);
  tctx.beginPath();tctx.ellipse(400,305,205,25,0,0,Math.PI*2);tctx.stroke();tctx.restore();
}
function drawVehicleInteriorAccessLabel(){
  if(!vehicleUnderAccess())return;
  tctx.save();
  tctx.fillStyle='rgba(159,236,255,.88)';tctx.font='800 13px system-ui';tctx.textAlign='center';
  tctx.fillText(t('UNDERBODY / INTERIOR ACCESS — fit the cabin pieces from below','ACCÈS SOUS-CAISSE / INTÉRIEUR — fixe les pièces de l’habitacle par dessous'),400,402);
  tctx.restore();
}
function drawVehicleBlueprint(){
  if(!templateOn)return;
  if(vehicleViewMode!=='interior')drawVehicleGround();
  const installed=installedVehicleKeys();
  const projections=[...vehicleSlotDefinitions(),...vehicleInteriorSlots()].map(vehicleSlotProjection).filter(Boolean).sort((a,b)=>a.depth-b.depth);
  projections.forEach(proj=>{if(proj.visible&&installed.has(proj.key))drawInstalledVehiclePanel(proj)});
  drawVehicleWireframe();
  projections.forEach(proj=>{
    if(!proj.visible||installed.has(proj.key))return;
    /* Interior view is deliberately uncluttered: only the internal puzzle holes are shown. */
    if(vehicleViewMode==='interior'&&proj.view!=='interior')return;
    drawVehicleSlotGuide(proj,proj,false);
  });
  drawVehicleInteriorAccessLabel();
  tctx.save();tctx.fillStyle='rgba(145,236,255,.66)';tctx.font='700 13px system-ui';tctx.textAlign='center';
  const msg=vehicleUnderAccess()
    ?t('Fit the interior pieces from underneath. Fitted pieces lock permanently into the car.','Fixe les pièces intérieures par dessous. Les pièces fixées se verrouillent définitivement dans la voiture.')
    :t('Drag the car to rotate it freely. Fitted pieces stay attached while you turn it.','Fais glisser la voiture pour la tourner librement. Les pièces fixées restent attachées pendant la rotation.');
  tctx.fillText(msg,400,425);
  tctx.restore();
  syncInstalledVehicleParts();
}
function renderTemplate(id){
  tctx.clearRect(0,0,templateCanvas.width,templateCanvas.height);
  if(!templateOn)return;
  if(id==='vehicle'){drawVehicleBlueprint();return}
  tctx.save();tctx.strokeStyle='rgba(132,222,255,.30)';tctx.fillStyle='rgba(92,124,255,.06)';tctx.lineWidth=4;tctx.setLineDash([12,10]);
  if(id==='room'){tctx.strokeRect(120,70,560,320);tctx.strokeRect(140,92,250,120);tctx.strokeRect(420,92,230,120);tctx.beginPath();tctx.moveTo(400,70);tctx.lineTo(400,390);tctx.stroke()}
  else if(id==='park'){tctx.beginPath();tctx.moveTo(70,330);tctx.bezierCurveTo(220,210,330,410,480,250);tctx.bezierCurveTo(590,140,680,220,755,120);tctx.stroke();tctx.beginPath();tctx.ellipse(610,315,105,65,0,0,Math.PI*2);tctx.stroke()}
  tctx.restore();
}
function updateBlueprintVisibility(){
  stage.classList.toggle('blueprints-off',!templateOn);
  $('toggleTemplate').textContent=templateOn?t('👻 Blueprint on','👻 Plan activé'):t('👻 Blueprint off','👻 Plan désactivé');
}
function vehicleAngleLabel(){
  if(vehicleViewMode==='interior')return t('Interior puzzle view','Vue puzzle intérieure');
  const yaw=((vehicleYaw*180/Math.PI)%360+360)%360,pitch=vehiclePitch*180/Math.PI;
  return `${t('Free 3D rotate','Rotation 3D libre')} · ${Math.round(yaw)}° · ${Math.round(pitch)}°`;
}
function applyVehicleOrbitTransform(){
  stage.classList.toggle('vehicle-3d-view',active==='vehicle');
}
function updateVehicleViewUI(){
  const panel=$('vehicleViewControls');if(panel)panel.hidden=active!=='vehicle';
  document.querySelectorAll('[data-vehicle-view]').forEach(b=>b.classList.toggle('active',b.dataset.vehicleView===vehicleViewMode));
  const status=$('vehicleOrbitStatus');if(status)status.textContent=active==='vehicle'?vehicleAngleLabel():'';
  applyVehicleOrbitTransform();
}
function setVehicleView(view){
  vehicleViewMode=view;
  if(view==='left'){vehicleYaw=0;vehiclePitch=.06}
  else if(view==='right'){vehicleYaw=Math.PI;vehiclePitch=.06}
  else if(view==='front'){vehicleYaw=-Math.PI/2;vehiclePitch=.03}
  else if(view==='rear'){vehicleYaw=Math.PI/2;vehiclePitch=.03}
  else if(view==='top'){vehicleYaw=0;vehiclePitch=-.95}
  else if(view==='interior'){vehicleYaw=0;vehiclePitch=.82}
  else if(view==='orbit'&&Math.abs(vehiclePitch)>.98){vehiclePitch=.12}
  renderTemplate('vehicle');updateVehicleViewUI();commitHistory();
}
function renderLibrary(m){const panel=$('creatorLibraryPanel'),host=$('creatorLibrary');if(!m.library){panel.hidden=true;return}panel.hidden=false;$('creatorModeStep').textContent='2 • '+t('CHOOSE A DESIGN MODE','CHOISIS UN MODE');$('creatorDesignStep').textContent='3 • '+t('YOUR DESIGN','TON DESIGN');host.innerHTML='';m.library.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='creator-library-card';b.dataset.libraryId=item.id;b.dataset.status=active==='vehicle'?t('✓ selected','✓ sélectionné'):t('✓ blueprint added','✓ plan ajouté');b.innerHTML=`<img src="${item.img}" alt="${item.name}"><span><b>${item.name}</b><small>${item.subtitle}</small></span>`;b.onclick=()=>chooseLibrary(item);host.appendChild(b)});refreshLibraryCards();}
function refreshLibraryCards(){document.querySelectorAll('.creator-library-card').forEach(card=>{const exists=active==='vehicle'?card.dataset.libraryId===currentLibraryId:[...objectLayer.children].some(o=>o.dataset.kind==='blueprint'&&o.dataset.blueprintId===card.dataset.libraryId);card.classList.toggle('active',exists)});}
function chooseLibrary(item){if(active==='vehicle'){
  const changed=!!currentLibraryId&&currentLibraryId!==item.id;
  if(changed){[...objectLayer.children].filter(o=>o.dataset.kind==='part').forEach(o=>o.remove());selectObject(null);}
  currentLibraryId=item.id;vehicleYaw=0;vehiclePitch=.10;vehicleViewMode='left';renderTemplate('vehicle');refreshLibraryCards();updateVehicleViewUI();renderModes(missions[active],activeMode);commitHistory();return
}currentLibraryId=item.id;const existing=[...objectLayer.children].find(o=>o.dataset.kind==='blueprint'&&o.dataset.blueprintId===item.id);if(existing){selectObject(existing);renderModes(missions[active],activeMode);return}const count=[...objectLayer.children].filter(o=>o.dataset.kind==='blueprint').length;const x=.30+((count%3)*.22),y=.30+(Math.floor(count/3)*.28);addBlueprint(item,clamp(x,.18,.82),clamp(y,.22,.78),active==='robot'?180:310,0,{commit:true,select:true});renderModes(missions[active],null);refreshLibraryCards();}

function renderModes(m,preferred){const modes=modesForMission(m);if(!modes.length)return;activeMode=(preferred&&modes.some(x=>x.id===preferred))?preferred:(activeMode&&modes.some(x=>x.id===activeMode)?activeMode:modes[0].id);const host=$('creatorModes');host.innerHTML='';modes.forEach(md=>{const b=document.createElement('button');b.type='button';b.className='creator-mode'+(md.id===activeMode?' active':'');b.innerHTML=`<span>${md.icon}</span><b>${L(md.label)}</b><small>${L(md.help)}</small>`;b.onclick=()=>{activeMode=md.id;renderModes(m,activeMode);commitHistory()};host.appendChild(b)});const selected=modes.find(x=>x.id===activeMode);$('creatorModeHelp').textContent=L(selected.help);renderComponents(selected);}
function vehicleAllPuzzleSlots(){return[...vehicleSlotDefinitions(),...vehicleInteriorSlots()];}
function vehiclePartRequirement(id){return vehicleAllPuzzleSlots().filter(s=>s.partId===id).length;}
function vehicleInstalledPartCount(id){return [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.partId===id&&o.dataset.installed==='1'&&o.dataset.targetKey).length;}
function vehiclePartComplete(id){const need=vehiclePartRequirement(id);return need>0&&vehicleInstalledPartCount(id)>=need;}
function refreshVehicleComponentButtons(){
  if(active!=='vehicle')return;
  document.querySelectorAll('#creatorComponents .creator-component[data-part-id]').forEach(b=>{
    const id=b.dataset.partId,need=vehiclePartRequirement(id),done=vehicleInstalledPartCount(id),complete=need>0&&done>=need;
    b.disabled=complete;b.classList.toggle('is-complete',complete);b.setAttribute('aria-disabled',complete?'true':'false');
    const counter=b.querySelector('[data-part-counter]');if(counter&&need)counter.textContent=complete?t(`✓ ${done}/${need} fitted`,`✓ ${done}/${need} fixé${need>1?'s':''}`):`${done}/${need}`;
  });
}
function addPalettePart(p){
  if(active==='vehicle'&&vehiclePartComplete(p.id))return;
  const el=addObject(p,.5,.5,p.defaultSize||58,0,{commit:false,select:true});
  if(active==='vehicle'){
    const target=vehicleTargetFor(el);
    if(target){
      el.dataset.targetHintKey=target.key||'';
      el.dataset.aspect=target.screenAspect||target.aspect||p.aspect||1;
      /* Start slightly smaller than the hole so the child still performs the puzzle fit. */
      const startSize=Math.max(28,Math.min(p.defaultSize||58,(target.sizePx||p.defaultSize||58)*.78));
      el.dataset.size=startSize;applyObjectStyle(el);
    }
  }
  commitHistory();return el;
}
function renderComponents(md){const host=$('creatorComponents');host.innerHTML=`<div class="creator-palette-title"><b>${t('Parts for','Pièces pour')} ${L(md.label)}</b><small>${t('Choose the matching puzzle piece. When every required copy is fitted, its button locks.','Choisis la pièce de puzzle correspondante. Quand tous les exemplaires requis sont fixés, son bouton se verrouille.')}</small></div>`;(md.parts||[]).forEach(p=>{const b=document.createElement('button');b.type='button';b.className='creator-component';b.dataset.partId=p.id;const need=active==='vehicle'?vehiclePartRequirement(p.id):0,done=active==='vehicle'?vehicleInstalledPartCount(p.id):0;b.innerHTML=`<span>${paletteVisual(p)}</span><small>${L(p.label)}${need?` <em data-part-counter>${done}/${need}</em>`:''}</small>`;b.onclick=()=>addPalettePart(p);host.appendChild(b)});refreshVehicleComponentButtons();}
function paletteVisual(p){const carVisual=vehiclePartSvg(p.id);if(carVisual)return carVisual;if(p.className==='park-bench')return '<span class="creator-mini-bench"><i></i><i></i><i></i></span>';if(p.className==='shelf')return '▤';if(p.className==='sofa')return '🛋️';if(p.className==='fluorescent')return '▬';if(p.className==='chassis')return '▰';if(p.className==='amphibious')return '⛴️';if(p.className==='wing')return '🪽';return p.icon||'◆';}

function renderPlan(m,saved={}){const host=$('creatorPlanFields');host.innerHTML='';m.prompts.forEach((q,i)=>{const l=document.createElement('label');l.textContent=L(q);const inp=document.createElement('input');inp.dataset.plan=i;inp.value=saved.plan?.[i]||'';l.appendChild(inp);host.appendChild(l)});$('creatorNotes').value=saved.notes||'';}

function vehiclePartSvg(id){
  const common='class="creator-object-icon creator-vehicle-part" viewBox="0 0 120 80" aria-hidden="true"';
  if(id==='wheel')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#202733" stroke="#d7e4ee" stroke-width="4"/><circle cx="50" cy="50" r="31" fill="#b8c4cf" stroke="#f4f8fb" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="#303b48"/>${[0,72,144,216,288].map(a=>`<rect x="47" y="17" width="6" height="30" rx="3" fill="#4a5b69" transform="rotate(${a} 50 50)"/>`).join('')}</svg>`;
  if(['door','window','windscreen','rear-window','roof','mirror','headlight','taillight','bumper','rear-bumper','hood','trunk'].includes(id)){
    const pts=vehiclePartShape(id).map(([a,b])=>`${(60+a*52).toFixed(1)},${(40+b*31).toFixed(1)}`).join(' ');
    const style=vehiclePartFill(id);
    const handle=id==='door'?'<path d="M82 37h13" stroke="#33495b" stroke-width="4" stroke-linecap="round"/>':'';
    return `<svg ${common}><polygon points="${pts}" fill="${style.fill}" stroke="#eef8ff" stroke-width="4" stroke-linejoin="round"/>${handle}</svg>`;
  }
  if(['dashboard','driver-seat','seat','belt','battery','camera'].includes(id)){
    const pts=vehiclePartShape(id).map(([a,b])=>`${(60+a*52).toFixed(1)},${(40+b*31).toFixed(1)}`).join(' ');
    const fills={dashboard:'#475766','driver-seat':'#596a79',seat:'#596a79',belt:'#d9e4ed',battery:'#77e06f',camera:'#5f7484'};
    return `<svg ${common}><polygon points="${pts}" fill="${fills[id]||'#596a79'}" stroke="#e5edf3" stroke-width="4" stroke-linejoin="round"/></svg>`;
  }
  if(id==='steering')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="37" fill="none" stroke="#dce6ee" stroke-width="8"/><circle cx="50" cy="50" r="12" fill="#455666"/><path d="M50 50L25 27M50 50l25-23M50 50v35" stroke="#65798a" stroke-width="7"/></svg>`;
  if(id==='airbag')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#eef5fa" stroke="#ffffff" stroke-width="5"/><path d="M30 57q20 17 40 0" fill="none" stroke="#9aabba" stroke-width="5" stroke-linecap="round"/></svg>`;
  if(id==='emergency-stop')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#ed5968" stroke="#fff1f3" stroke-width="5"/><rect x="29" y="43" width="42" height="14" rx="7" fill="#fff"/></svg>`;
  return '';
}
function visualHTML(p){const carVisual=vehiclePartSvg(p.id);if(carVisual)return carVisual;switch(p.className){case'park-bench':return '<span class="creator-object-icon creator-visual creator-bench-visual"><i></i><i></i><i></i><i></i></span>';case'shelf':return '<span class="creator-object-icon creator-visual creator-shelf-visual"></span>';case'sofa':return '<span class="creator-object-icon creator-visual creator-sofa-visual"></span>';case'fluorescent':return '<span class="creator-object-icon creator-visual creator-fluorescent-visual"></span>';case'tvstand':return '<span class="creator-object-icon creator-visual creator-tvstand-visual"></span>';case'settop':return '<span class="creator-object-icon creator-visual creator-settop-visual"></span>';case'chassis':return '<span class="creator-object-icon creator-visual creator-chassis-visual"></span>';case'amphibious':return '<span class="creator-object-icon creator-visual creator-amphibious-visual"></span>';case'wing':return '<span class="creator-object-icon creator-visual creator-wing-visual"></span>';case'toilet':return '<span class="creator-object-icon creator-toilet-visual"></span>';default:return `<span class="creator-object-icon">${p.icon||'◆'}</span>`;}}
function robotBlueprintSvg(id){const accent=id==='robot-c'?'#ffd45b':id==='robot-d'?'#ff647c':id==='robot-e'?'#5ee3a4':id==='robot-f'?'#9cefff':'#5de4ff';const wheeled=id==='robot-b';const flying=id==='robot-d'||id==='robot-f';return `<svg class="creator-object-icon" viewBox="0 0 120 150" aria-hidden="true"><g fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="35" y="12" width="50" height="34" rx="15"/><path d="M44 29h10m12 0h10"/><path d="M48 39q12 8 24 0"/><path d="M42 48l-10 38h56L78 48z"/><path d="M32 56L12 86m76-30 20 30"/><circle cx="12" cy="88" r="8"/><circle cx="108" cy="88" r="8"/>${wheeled?'<circle cx="38" cy="120" r="16"/><circle cx="82" cy="120" r="16"/><path d="M34 86l4 18m48-18-4 18"/>':'<path d="M47 86l-8 48h18l3-33 3 33h18l-8-48"/>'}${flying?'<path d="M35 55L5 35l20 35m60-15 30-20-20 35"/>':''}</g></svg>`;}

function addBlueprint(item,x,y,size,rotation,opt={}){const el=document.createElement('div');el.className='creator-object is-blueprint'+(item.blueprintType==='scene'?' scene-blueprint':'');el.dataset.kind='blueprint';el.dataset.blueprintId=item.id;el.dataset.label=item.name;el.dataset.x=x;el.dataset.y=y;el.dataset.size=size;el.dataset.rotation=rotation;el.dataset.aspect=item.blueprintType==='scene'?1.333:.80;el.dataset.image=item.img||'';if(item.blueprintType==='robot')el.innerHTML=robotBlueprintSvg(item.id);else el.innerHTML=`<img class="creator-object-icon" src="${item.img}" alt="">`;makeObjectInteractive(el);objectLayer.appendChild(el);applyObjectStyle(el);if(opt.select)selectObject(el);if(opt.commit)commitHistory();return el;}
function addObject(p,x=.5,y=.5,size=58,rotation=0,opt={}){const el=document.createElement('div');el.className='creator-object'+(p.className?' '+p.className:'');el.dataset.kind='part';el.dataset.partId=p.id;el.dataset.label=L(p.label);el.dataset.icon=p.icon||'';el.dataset.className=p.className||'';el.dataset.tags=JSON.stringify(p.tags||[]);el.dataset.x=x;el.dataset.y=y;el.dataset.size=size;el.dataset.rotation=rotation;el.dataset.aspect=p.aspect||1;el.innerHTML=visualHTML(p);makeObjectInteractive(el);objectLayer.appendChild(el);applyObjectStyle(el);if(opt.select)selectObject(el);if(opt.commit)commitHistory();return el;}
function addVector(v,opt={}){const el=document.createElement('div');el.className='creator-object is-vector';el.dataset.kind='vector';el.dataset.label=v.label||v.type;el.dataset.vectorType=v.type;el.dataset.vectorColor=v.color;el.dataset.vectorStroke=v.stroke;el.dataset.vectorPath=v.path||'';el.dataset.vectorFlip=v.flip||0;el.dataset.x=v.x;el.dataset.y=v.y;el.dataset.size=v.size;el.dataset.rotation=v.rotation||0;el.dataset.aspect=v.aspect||2;el.innerHTML=vectorSvg(v);makeObjectInteractive(el);objectLayer.appendChild(el);applyObjectStyle(el);if(opt.select)selectObject(el);if(opt.commit)commitHistory();return el;}
function vectorSvg(v){const c=v.color,s=v.stroke||6;if(v.type==='freehand')return `<svg class="creator-object-icon" viewBox="0 0 100 100"><path d="${v.path||''}" fill="none" stroke="${c}" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;if(v.type==='line')return `<svg class="creator-object-icon" viewBox="0 0 100 30"><line x1="4" y1="15" x2="96" y2="15" stroke="${c}" stroke-width="${s}" stroke-linecap="round"/></svg>`;if(v.type==='curve')return `<svg class="creator-object-icon" viewBox="0 0 100 60"><path d="M4 48 C24 2 55 58 96 12" fill="none" stroke="${c}" stroke-width="${s}" stroke-linecap="round"/></svg>`;if(v.type==='rect')return `<svg class="creator-object-icon" viewBox="0 0 100 100"><rect x="7" y="7" width="86" height="86" rx="5" fill="none" stroke="${c}" stroke-width="${s}"/></svg>`;return `<svg class="creator-object-icon" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="43" ry="43" fill="none" stroke="${c}" stroke-width="${s}"/></svg>`;}
function clearVehicleProjectedStyle(el){
  if(el.dataset.vehicleProjected!=='1')return;
  delete el.dataset.vehicleProjected;
  el.style.transform='';el.style.transformOrigin='';el.style.marginLeft='';el.style.marginTop='';el.style.zIndex='';
}
function applyObjectStyle(el){
  if(el.dataset.vehicleProjected==='1'&&el.dataset.installed==='1')return;
  clearVehicleProjectedStyle(el);
  const size=+el.dataset.size||68,aspect=+el.dataset.aspect||1;
  el.style.left=(+el.dataset.x*100)+'%';el.style.top=(+el.dataset.y*100)+'%';el.style.width=size+'px';el.style.height=Math.max(22,size/aspect)+'px';
  el.style.setProperty('--object-size',size+'px');el.style.setProperty('--object-rotation',(+(el.dataset.rotation)||0)+'deg');
}
function applyVehicleSurfaceProjection(el,pr){
  if(!pr?.screenU||!pr?.screenV){applyObjectStyle(el);return;}
  const sx=stage.clientWidth/templateCanvas.width,sy=stage.clientHeight/templateCanvas.height;
  const ux=pr.screenU.x*sx,uy=pr.screenU.y*sy,vx=pr.screenV.x*sx,vy=pr.screenV.y*sy;
  const uLen=Math.max(5,Math.hypot(ux,uy)),vLen=Math.max(5,Math.hypot(vx,vy));
  const a=ux/uLen,b=uy/uLen,c=vx/vLen,d=vy/vLen;
  const width=uLen*2,height=vLen*2;
  el.dataset.vehicleProjected='1';
  el.dataset.x=pr.cx/templateCanvas.width;el.dataset.y=pr.cy/templateCanvas.height;
  el.dataset.size=width;el.dataset.aspect=width/height;el.dataset.rotation=pr.screenAngle||0;
  el.style.left=(+el.dataset.x*100)+'%';el.style.top=(+el.dataset.y*100)+'%';
  el.style.width=width+'px';el.style.height=height+'px';el.style.marginLeft=(-width/2)+'px';el.style.marginTop=(-height/2)+'px';
  el.style.transformOrigin='50% 50%';
  el.style.transform=`matrix(${a.toFixed(6)},${b.toFixed(6)},${c.toFixed(6)},${d.toFixed(6)},0,0)`;
  el.style.setProperty('--object-size',width+'px');el.style.setProperty('--object-rotation','0deg');el.style.setProperty('--object-squash','1');
  el.style.zIndex=String(200+Math.round((pr.depth||0)*20));
}
function objectTags(el){try{return JSON.parse(el.dataset.tags||'[]')}catch(_){return[]}}
function makeObjectInteractive(el){el.addEventListener('pointerdown',e=>{if(testRunning||el.dataset.installed==='1')return;e.preventDefault();e.stopPropagation();if(tool==='eraser'){selectObject(el);deleteSelected();return}selectObject(el);const r=stage.getBoundingClientRect(),sx=e.clientX,sy=e.clientY,startX=+el.dataset.x,startY=+el.dataset.y;el.setPointerCapture?.(e.pointerId);el.classList.add('dragging');const move=ev=>{el.dataset.installed='0';el.classList.remove('installed-part');clearVehicleProjectedStyle(el);el.dataset.x=clamp(startX+(ev.clientX-sx)/r.width,.02,.98);el.dataset.y=clamp(startY+(ev.clientY-sy)/r.height,.02,.98);applyObjectStyle(el)};const up=()=>{el.classList.remove('dragging');el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);softSnap(el);commitHistory()};el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)});}
function selectObject(el){if(selectedObject)selectedObject.classList.remove('selected');selectedObject=el||null;if(selectedObject){selectedObject.classList.add('selected');$('selectedObjectLabel').textContent=selectedObject.dataset.label||t('Selected object','Objet sélectionné');$('objectSize').disabled=false;$('objectRotate').disabled=false;['shrinkObject','growObject','duplicateObject','sendBackObject','bringFrontObject','deleteObject'].forEach(id=>$(id).disabled=false);$('objectSize').value=clamp(+selectedObject.dataset.size||68,24,420);$('objectRotate').value=+(selectedObject.dataset.rotation||0);if(selectedObject.dataset.kind==='blueprint'){currentLibraryId=selectedObject.dataset.blueprintId;renderModes(missions[active],null)}}else{$('selectedObjectLabel').textContent=t('Select an object or drawn shape to edit it','Sélectionne un objet ou une forme à modifier');$('objectSize').disabled=true;$('objectRotate').disabled=true;['shrinkObject','growObject','duplicateObject','sendBackObject','bringFrontObject','deleteObject'].forEach(id=>$(id).disabled=true)}refreshLibraryCards();}


function vehicleTargetFor(el){
  if(active!=='vehicle'||el?.dataset.kind!=='part')return null;
  const id=el.dataset.partId,used=installedVehicleKeys(),slots=vehicleAllPuzzleSlots().filter(x=>x.partId===id);
  let best=null,bestD=Infinity;
  for(const sl of slots){
    if(used.has(sl.key)&&el.dataset.targetKey!==sl.key)continue;
    const pr=vehicleSlotProjection(sl);
    if(!pr||!pr.visible)continue;
    const tx=pr.cx/templateCanvas.width,ty=pr.cy/templateCanvas.height;
    const d=Math.hypot((+el.dataset.x)-tx,(+el.dataset.y)-ty);
    if(d<bestD){
      const cssPx=pr.sizePx/templateCanvas.width*stage.clientWidth;
      best={...pr,x:tx,y:ty,distance:d,sizePx:cssPx,screenAspect:pr.screenAspect,rotation:pr.screenAngle||0};
      bestD=d;
    }
  }
  return best;
}
function syncInstalledVehiclePart(el){
  if(active!=='vehicle'||el.dataset.installed!=='1'||!el.dataset.targetKey)return;
  const key=el.dataset.targetKey,sl=vehicleAllPuzzleSlots().find(x=>x.key===key);
  if(!sl){el.style.opacity='0';return}
  const pr=vehicleSlotProjection(sl);
  if(!pr){el.style.opacity='0';return}
  el.style.pointerEvents='none';
  if(sl.partId==='wheel'){
    el.style.opacity=pr.visible?'1':'0.08';
    clearVehicleProjectedStyle(el);
    el.dataset.x=pr.cx/templateCanvas.width;el.dataset.y=pr.cy/templateCanvas.height;
    el.dataset.size=pr.sizePx/templateCanvas.width*stage.clientWidth;
    el.dataset.aspect=pr.screenAspect||sl.aspect||1;
    el.dataset.rotation=Number.isFinite(pr.screenAngle)?pr.screenAngle:0;
    el.style.setProperty('--object-squash','1');applyObjectStyle(el);
  }else{
    /* Non-wheel fitted pieces are painted directly into their exact projected puzzle contour. */
    clearVehicleProjectedStyle(el);el.style.opacity='0';
  }
}
function syncInstalledVehicleParts(){
  if(active!=='vehicle')return;
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.installed==='1').forEach(syncInstalledVehiclePart);
}
function tryVehicleSnap(el,announce=true){
  if(!el||el.dataset.kind!=='part')return false;
  const target=vehicleTargetFor(el);
  if(!target){
    if(announce){
      const hasInterior=vehicleInteriorSlots().some(s=>s.partId===el.dataset.partId);
      $('creatorCoach').textContent=hasInterior
        ?t('This part fits inside the car. Rotate underneath the blueprint or tap Interior, then match it to its exact slot.','Cette pièce se fixe à l’intérieur. Tourne le plan par dessous ou touche Intérieur, puis fais-la correspondre exactement à son emplacement.')
        :t('Rotate the car until the correct puzzle slot for this part is facing you.','Tourne la voiture jusqu’à ce que le bon emplacement du puzzle soit face à toi.');
    }
    return false;
  }
  const current=+el.dataset.size||68,targetPx=Math.max(24,target.sizePx||68);
  const sizeError=Math.abs(current-targetPx)/targetPx;
  const proximityLimit=Math.max(.045,Math.min(.082,targetPx/stage.clientWidth*.38));
  const near=target.distance<=proximityLimit,closeSize=sizeError<=.11;
  if(near&&closeSize){
    el.dataset.installed='1';el.dataset.targetKey=target.key;el.classList.add('installed-part');
    el.dataset.aspect=target.screenAspect||target.aspect||el.dataset.aspect||1;
    el.dataset.rotation=Number.isFinite(target.rotation)?target.rotation:(+el.dataset.rotation||0);
    el.style.setProperty('--object-squash','1');
    syncInstalledVehiclePart(el);
    renderTemplate('vehicle');
    selectObject(null);
    refreshVehicleComponentButtons();
    if(announce){
      const fitted=installedVehicleKeys().size,total=vehicleSlotDefinitions().filter(x=>x.required).length+vehicleInteriorSlots().filter(x=>x.required).length;
      $('creatorCoach').textContent=t(`CLICK — piece fitted to the vehicle. ${fitted} pieces are installed and will stay attached while you rotate the car.`,`CLIC — pièce fixée au véhicule. ${fitted} pièces sont installées et resteront attachées pendant la rotation.`);
      window.playTone?.(true);
    }
    return true;
  }
  el.dataset.installed='0';el.dataset.targetKey='';el.classList.remove('installed-part');clearVehicleProjectedStyle(el);el.style.opacity='1';el.style.pointerEvents='auto';el.style.setProperty('--object-squash','1');applyObjectStyle(el);
  if(announce&&near&&!closeSize)$('creatorCoach').textContent=t('Correct area. Now resize the piece slowly until it covers the slot and clicks in.','Bonne zone. Redimensionne maintenant la pièce lentement jusqu’à ce qu’elle couvre l’emplacement et se fixe.');
  else if(announce&&closeSize&&!near)$('creatorCoach').textContent=t('The size is close. Move the piece nearer to its matching outline.','La taille est proche. Rapproche la pièce de son contour correspondant.');
  else if(announce)$('creatorCoach').textContent=t('Keep matching the outline: correct place + correct size = CLICK.','Continue à faire correspondre le contour : bonne place + bonne taille = CLIC.');
  return false;
}
function vehiclePuzzleProgress(){
  const used=installedVehicleKeys(),req=[...vehicleSlotDefinitions(),...vehicleInteriorSlots()].filter(x=>x.required);
  return{done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function softSnap(el){
  if(active==='vehicle'){tryVehicleSnap(el,true);return}
  if(active!=='park')return;
  const tags=objectTags(el),targets=[...objectLayer.children].filter(o=>o!==el&&o.dataset.kind==='part');let desired=null;
  if(tags.includes('seated-person'))desired=['seat-target'];else if(tags.includes('duck'))desired=['water'];else if(tags.includes('pusher'))desired=['buggy'];else if(tags.includes('swing-rider'))desired=['match-swing'];
  if(!desired)return;
  let best=null,bestD=.15;
  targets.forEach(o=>{const ot=objectTags(o);if(!desired.some(x=>ot.includes(x)))return;const dx=(+o.dataset.x)-(+el.dataset.x),dy=(+o.dataset.y)-(+el.dataset.y),d=Math.hypot(dx,dy);if(d<bestD){best=o;bestD=d}});
  if(best){el.dataset.x=+best.dataset.x+(tags.includes('pusher')?-.065:0);el.dataset.y=+best.dataset.y+(tags.includes('seated-person')?-.025:tags.includes('duck')?0:-.015);applyObjectStyle(el);$('creatorCoach').textContent=t('Nice match — those pieces work naturally together.','Bonne association — ces éléments fonctionnent naturellement ensemble.')}
}

function pointerPos(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
function stagePos(e){const r=stage.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1),px:e.clientX-r.left,py:e.clientY-r.top,w:r.width,h:r.height};}
canvas.addEventListener('pointerdown',e=>{if(testRunning)return;if(tool==='select'){selectObject(null);if(active==='vehicle'&&templateOn){vehicleOrbiting=true;vehicleViewMode='orbit';canvas.setPointerCapture?.(e.pointerId);canvas.dataset.orbitX=e.clientX;canvas.dataset.orbitY=e.clientY;canvas.dataset.orbitYaw=vehicleYaw;canvas.dataset.orbitPitch=vehiclePitch;stage.classList.add('vehicle-orbiting');updateVehicleViewUI()}return}drawing=true;startPoint=(tool==='eraser')?pointerPos(e):stagePos(e);lastPoint=startPoint;freePoints=[];canvas.setPointerCapture?.(e.pointerId);if(tool==='pen'){freePoints=[startPoint];previewFreehand()}else if(tool==='eraser'){const p=pointerPos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)}});
canvas.addEventListener('pointermove',e=>{if(vehicleOrbiting&&active==='vehicle'){const dx=e.clientX-(+canvas.dataset.orbitX||e.clientX),dy=e.clientY-(+canvas.dataset.orbitY||e.clientY);vehicleYaw=(+canvas.dataset.orbitYaw||0)+dx*.008;while(vehicleYaw>Math.PI)vehicleYaw-=Math.PI*2;while(vehicleYaw<-Math.PI)vehicleYaw+=Math.PI*2;vehiclePitch=clamp((+canvas.dataset.orbitPitch||0)+dy*.006,-1.03,.88);vehicleViewMode='orbit';renderTemplate('vehicle');updateVehicleViewUI();return}if(!drawing)return;if(tool==='pen'){const p=stagePos(e);freePoints.push(p);if(freePoints.length%2===0)previewFreehand();lastPoint=p;return}if(tool==='eraser'){const p=pointerPos(e);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=+$('brushSize').value;ctx.globalCompositeOperation='destination-out';ctx.strokeStyle='rgba(0,0,0,1)';ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();lastPoint=p;return}const p=stagePos(e);previewVector(startPoint,p);});
canvas.addEventListener('pointerup',e=>{if(vehicleOrbiting){vehicleOrbiting=false;stage.classList.remove('vehicle-orbiting');commitHistory();return}if(!drawing)return;drawing=false;if(tool==='pen'){const p=stagePos(e);freePoints.push(p);if(tempVector)tempVector.remove();const g=freehandGeometry(freePoints);if(g)addVector(g,{select:true,commit:false});tempVector=null;freePoints=[];drawStrokes++;commitHistory();return}if(tool==='eraser'){ctx.closePath();drawStrokes++;commitHistory();return}const p=stagePos(e);finalizeVector(startPoint,p);tempVector=null;drawStrokes++;commitHistory();});
canvas.addEventListener('pointercancel',()=>{if(vehicleOrbiting){vehicleOrbiting=false;stage.classList.remove('vehicle-orbiting')}});
canvas.addEventListener('pointercancel',()=>{drawing=false;freePoints=[];if(tempVector){tempVector.remove();tempVector=null}});
function freehandGeometry(points){if(!points||points.length<2)return null;const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),w=Math.max(.035,maxX-minX),h=Math.max(.035,maxY-minY);const path=points.map((p,i)=>`${i?'L':'M'} ${((p.x-minX)/w*88+6).toFixed(1)} ${((p.y-minY)/h*88+6).toFixed(1)}`).join(' ');const width=Math.max(34,w*stage.clientWidth),height=Math.max(34,h*stage.clientHeight);return{type:'freehand',color:colour,stroke:Math.max(2,+$('brushSize').value*.72),path,x:(minX+maxX)/2,y:(minY+maxY)/2,size:width,aspect:width/height,rotation:0,label:'Pencil drawing'}}
function previewFreehand(){if(tempVector)tempVector.remove();const g=freehandGeometry(freePoints);if(!g)return;tempVector=addVector(g,{select:false,commit:false});tempVector.style.pointerEvents='none';tempVector.style.opacity='.75'}
function vectorGeometry(a,b,type){const dx=(b.x-a.x)*stage.clientWidth,dy=(b.y-a.y)*stage.clientHeight,dist=Math.max(28,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx)*180/Math.PI;const cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;if(type==='line')return{type,color:colour,stroke:+$('brushSize').value,x:cx,y:cy,size:dist,aspect:dist/28,rotation:angle,label:'Line'};if(type==='curve')return{type,color:colour,stroke:+$('brushSize').value,x:cx,y:cy,size:dist,aspect:Math.max(1.5,dist/Math.max(55,dist*.42)),rotation:angle,label:'Curved path'};const w=Math.max(32,Math.abs(dx)),h=Math.max(32,Math.abs(dy));return{type,color:colour,stroke:+$('brushSize').value,x:cx,y:cy,size:w,aspect:w/h,rotation:0,label:type==='rect'?'Rectangle':'Circle'};}
function previewVector(a,b){if(tempVector)tempVector.remove();tempVector=addVector(vectorGeometry(a,b,tool),{select:false,commit:false});tempVector.style.pointerEvents='none';tempVector.style.opacity='.7';}
function finalizeVector(a,b){if(tempVector)tempVector.remove();addVector(vectorGeometry(a,b,tool),{select:true,commit:false});}

function objectData(){
  return[...objectLayer.children].filter(o=>o!==tempVector).map(o=>({
    kind:o.dataset.kind,partId:o.dataset.partId,label:o.dataset.label,icon:o.dataset.icon,className:o.dataset.className,tags:o.dataset.tags,
    x:+o.dataset.x,y:+o.dataset.y,size:+o.dataset.size,rotation:+o.dataset.rotation,aspect:+o.dataset.aspect,
    installed:o.dataset.installed==='1',targetKey:o.dataset.targetKey||'',
    blueprintId:o.dataset.blueprintId,image:o.dataset.image,vectorType:o.dataset.vectorType,vectorColor:o.dataset.vectorColor,
    vectorStroke:+o.dataset.vectorStroke,vectorPath:o.dataset.vectorPath||''
  }));
}
function restoreObjects(items=[]){
  objectLayer.innerHTML='';selectedObject=null;
  items.forEach(d=>{
    if(d.kind==='blueprint'){
      const item=[...(missions[active].library||[])].find(x=>x.id===d.blueprintId)||{id:d.blueprintId,name:d.label,img:d.image,blueprintType:active==='robot'?'robot':'scene'};
      addBlueprint(item,d.x,d.y,d.size,d.rotation,{commit:false,select:false});
    }else if(d.kind==='vector'){
      addVector({type:d.vectorType,color:d.vectorColor,stroke:d.vectorStroke,path:d.vectorPath,x:d.x,y:d.y,size:d.size,aspect:d.aspect,rotation:d.rotation,label:d.label},{commit:false,select:false});
    }else{
      const p=findPart(d.partId)||part(d.partId,d.icon,d.label,d.label,JSON.parse(d.tags||'[]'),d.className);
      const el=addObject(p,d.x,d.y,d.size,d.rotation,{commit:false,select:false});
      if(d.installed&&d.targetKey){el.dataset.installed='1';el.dataset.targetKey=d.targetKey;el.classList.add('installed-part');}
    }
  });
  if(active==='vehicle'){renderTemplate('vehicle');syncInstalledVehicleParts();refreshVehicleComponentButtons();}
  refreshLibraryCards();
}
function snapshot(){return{drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode};}
function resetHistory(){history=[snapshot()];historyIndex=0;updateHistoryButtons();}
function commitHistory(){if(restoring||!active)return;history=history.slice(0,historyIndex+1);history.push(snapshot());if(history.length>50)history.shift();historyIndex=history.length-1;updateHistoryButtons();}
function updateHistoryButtons(){$('undoDraw').disabled=historyIndex<=0;$('redoDraw').disabled=historyIndex<0||historyIndex>=history.length-1;}
function restoreDrawing(data,cb){ctx.clearRect(0,0,canvas.width,canvas.height);if(!data){cb?.();return}const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);cb?.()};img.onerror=()=>cb?.();img.src=data;}
function restoreSnapshot(s){restoring=true;templateOn=s.templateOn!==false;gridOn=!!s.gridOn;activeMode=s.activeMode;currentLibraryId=s.currentLibraryId;vehicleYaw=Number.isFinite(s.vehicleYaw)?s.vehicleYaw:vehicleYaw;vehiclePitch=Number.isFinite(s.vehiclePitch)?s.vehiclePitch:vehiclePitch;vehicleViewMode=s.vehicleViewMode||vehicleViewMode;stage.classList.toggle('show-grid',gridOn);updateBlueprintVisibility();renderTemplate(active);updateVehicleViewUI();renderModes(missions[active],activeMode);restoreDrawing(s.drawing,()=>{restoreObjects(s.objects);restoring=false;updateHistoryButtons()});}

function openMission(id){const m=missions[id];if(!m)return;stopTest(false);active=id;activeMode=null;currentLibraryId=m.library?.[0]?.id||null;drawStrokes=0;selectedObject=null;ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';simulation.innerHTML='';$('creatorTestResult').innerHTML='';$('creatorTitle').textContent=L(m.title);$('creatorPrompt').textContent=L(m.prompt);$('creatorSteps').innerHTML=[t('Choose a blueprint if this mission offers one','Choisis un plan si la mission en propose un'),t('Choose a design mode and load the matching small parts','Choisis un mode et charge les petites pièces correspondantes'),t('Draw, arrange, resize, rotate and combine pieces','Dessine, organise, redimensionne, tourne et combine les pièces'),t('Test, stop, improve and test again','Teste, arrête, améliore puis reteste')].map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('');let saved=loadStore()[id]||{};if(id==='vehicle'&&saved.vehiclePuzzleVersion!==VEHICLE_PUZZLE_VERSION){saved={plan:saved.plan||[],notes:saved.notes||'',templateOn:true,gridOn:!!saved.gridOn,currentLibraryId:saved.currentLibraryId||currentLibraryId,vehicleYaw:0,vehiclePitch:.06,vehicleViewMode:'left',objects:[]};}templateOn=saved.templateOn!==false;gridOn=!!saved.gridOn;activeMode=saved.activeMode||null;currentLibraryId=saved.currentLibraryId||currentLibraryId;vehicleYaw=Number.isFinite(saved.vehicleYaw)?saved.vehicleYaw:0;vehiclePitch=Number.isFinite(saved.vehiclePitch)?saved.vehiclePitch:.10;vehicleViewMode=saved.vehicleViewMode||'left';stage.classList.toggle('show-grid',gridOn);renderTemplate(id);updateBlueprintVisibility();updateVehicleViewUI();$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');renderLibrary(m);renderModes(m,activeMode);renderPlan(m,saved);$('creatorCoach').textContent=L(m.coach);$('creatorSaved').textContent=saved.updatedAt?t('Saved project restored. Keep creating.','Projet enregistré restauré. Continue à créer.'):'';$('creatorWorkspace').hidden=false;restoreDrawing(saved.drawing,()=>{restoreObjects(saved.objects||[]);drawStrokes=saved.drawing?3:0;renderLibrary(m);renderModes(m,activeMode);resetHistory();$('creatorWorkspace').scrollIntoView({behavior:'smooth',block:'start'})});}

function save(){if(!active)return;const all=loadStore();const plan=[...document.querySelectorAll('#creatorPlanFields [data-plan]')].map(i=>i.value.trim());all[active]={plan,notes:$('creatorNotes').value.trim(),drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePuzzleVersion:active==='vehicle'?VEHICLE_PUZZLE_VERSION:undefined,updatedAt:Date.now()};try{saveStore(all);$('creatorSaved').textContent=t('✅ Project saved. You can return and continue later.','✅ Projet enregistré. Tu peux revenir plus tard.')}catch(_){$('creatorSaved').textContent=t('This design is too large to save on this device.','Ce design est trop volumineux pour cet appareil.')}window.CWState?.setProgress?.('creator',Math.min(95,Object.keys(all).length*16),{lastMission:active});window.CWState?.logActivity?.({id:'creator-'+active,title:`Creator Studio: ${missions[active].title[0]}`,icon:'🎨',detail:'Saved interactive design',href:'creator.html'});}
function clearProjectNow(){stopTest(false);ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';drawStrokes=0;selectObject(null);const all=loadStore();delete all[active];saveStore(all);$('creatorNotes').value='';document.querySelectorAll('#creatorPlanFields input').forEach(i=>i.value='');$('creatorSaved').textContent=t('Project cleared. Start a new design.','Projet effacé. Commence un nouveau design.');$('creatorTestResult').innerHTML='';renderLibrary(missions[active]);resetHistory();closeClearDialog();}
function openClearDialog(){$('creatorClearDialog').hidden=false;document.body.classList.add('creator-dialog-open');setTimeout(()=>$('keepProject').focus(),0)}
function closeClearDialog(){$('creatorClearDialog').hidden=true;document.body.classList.remove('creator-dialog-open')}

function testTags(){const set=new Set();[...objectLayer.children].forEach(o=>{if(o.dataset.kind==='part')objectTags(o).forEach(tag=>set.add(tag))});return set;}
function addTestClasses(){[...objectLayer.children].forEach(o=>{const tags=objectTags(o);if(tags.includes('wheel'))o.classList.add('test-wheel');if(active==='vehicle'&&tags.includes('flight')&&o.dataset.partId.includes('wing'))o.classList.add('test-wing');if(active==='room'&&tags.includes('light'))o.classList.add('test-light')});}
function clearTestClasses(){[...objectLayer.children].forEach(o=>o.classList.remove('test-wheel','test-wing','test-water-wheel','test-light'));buildLayer.classList.remove('test-road','test-water','test-fly','test-robot');}
function startTest(){if(!active)return;
  if(active==='vehicle'){
    const progress=vehiclePuzzleProgress();
    if(progress.done<progress.total){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Finish the car puzzle first','Termine d’abord le puzzle de la voiture')}</b><p>${t(`${progress.done} of ${progress.total} required pieces are fitted. Rotate the blueprint and complete the missing slots before testing.`,`${progress.done} pièces sur ${progress.total} sont fixées. Tourne le plan et complète les emplacements manquants avant le test.`)}</p></div>`;
      $('creatorCoach').textContent=t('Build it like a peg puzzle: each required outline must be covered by its matching piece before the car can drive.','Construis-la comme un puzzle : chaque contour requis doit être couvert par sa pièce avant que la voiture puisse rouler.');
      return;
    }
    vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';renderTemplate('vehicle');updateVehicleViewUI();
  }
  const m=missions[active],objectCount=objectLayer.children.length,enough=drawStrokes>=1||objectCount>=2;if(!enough){$('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Needs more design work','Il faut encore travailler le design')}</b><p>${t('Add some drawing or at least two movable pieces before testing.','Ajoute un dessin ou au moins deux pièces avant de tester.')}</p></div>`;return}stopTest(false);testRunning=true;if(active==='vehicle')renderTemplate('vehicle');stage.classList.add('testing','test-active');$('stopCreationTest').hidden=false;selectObject(null);simulation.className='creator-simulation active';simulation.innerHTML='';addTestClasses();const tags=testTags();let special='';if(active==='vehicle'){const travel=Math.max(65,stage.clientWidth*.20);buildLayer.style.setProperty('--test-travel',travel+'px');if(tags.has('flight')){buildLayer.classList.add('test-fly');simulation.innerHTML='<span class="flight-cloud" style="top:18%">☁️</span><span class="flight-cloud">☁️</span>';special=t('Flying test: the completed vehicle lifts and flies because flight technology is installed.','Test de vol : le véhicule s’élève grâce aux technologies de vol.')}else if(tags.has('amphibious')){buildLayer.classList.add('test-water');simulation.innerHTML='<div class="water-test"></div>';[...objectLayer.children].filter(o=>objectTags(o).includes('wheel')).forEach(o=>{o.classList.remove('test-wheel');o.classList.add('test-water-wheel')});special=t('Water test: the environment changes to water and the wheels retract while the complete vehicle travels as one build.','Test aquatique : l’environnement devient aquatique et les roues se rétractent pendant que le véhicule complet avance.')}else{buildLayer.classList.add('test-road');special=t('Road test: the whole completed vehicle drives smoothly, pauses at each side, then reverses. The tyres rotate with the direction of travel.','Test routier : le véhicule complet roule en douceur, marque une pause à chaque côté puis repart. Les pneus tournent selon le sens.')}}else if(active==='room'){simulation.innerHTML='<div class="room-scan"></div>';special=roomCollisionReport();}else if(active==='park'){simulation.innerHTML='<span class="park-visitor" style="top:34%">🚶</span><span class="park-visitor">🧑‍🦽</span><span class="park-visitor">🧒</span>';special=t('Visitor simulation is running. Watch how people move through the park, then stop and improve the layout.','La simulation des visiteurs est en cours. Observe leurs déplacements puis arrête et améliore le parc.')}else if(active==='robot'){buildLayer.classList.add('test-robot');special=t('Robot systems test is running on the assembled design. This is the foundation for robot-specific movement tests in later upgrades.','Le test des systèmes fonctionne sur le robot assemblé.')}else if(active==='story'){simulation.innerHTML='<div class="story-frame"></div>';special=t('Story preview is running. Check whether the characters, setting and props communicate the scene clearly.','L’aperçu de l’histoire est en cours. Vérifie que personnages, décor et accessoires racontent clairement la scène.')}else if(active==='mars'){simulation.innerHTML='<div class="room-scan"></div>';special=t('Base systems scan is running. Check habitats, support systems, transport and connections.','Le contrôle de la base est en cours. Vérifie habitats, survie, transport et connexions.')}const checks=(m.checks||[]).map(([tag,label])=>({label,ok:tags.has(tag)||objectCount>=4}));let score=Math.min(100,40+objectCount*4+drawStrokes*5);$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${score}</b><small>/100</small></div><div><b>${t('Live test running','Test en direct')}</b><p>${special}</p>${checks.length?`<ul>${checks.map(c=>`<li class="${c.ok?'pass':'miss'}">${c.ok?'✓':'○'} ${c.label}</li>`).join('')}</ul>`:''}</div></div>`;$('creatorCoach').textContent=special;window.playTone?.(true);}
function stopTest(showMessage=true){if(!testRunning&&showMessage)return;testRunning=false;stage.classList.remove('testing','test-active');$('stopCreationTest').hidden=true;simulation.className='creator-simulation';simulation.innerHTML='';clearTestClasses();if(active==='vehicle')renderTemplate('vehicle');if(showMessage){$('creatorCoach').textContent=t('Test stopped. Adjust any part, resize it or add something new, then test again.','Test arrêté. Modifie une pièce, redimensionne-la ou ajoute un élément puis reteste.');$('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Test stopped — back to edit mode','Test arrêté — retour au mode édition')}</b><p>${t('Build → Test → Stop → Improve → Test again.','Construis → Teste → Arrête → Améliore → Reteste.')}</p></div></div>`;}}
function roomCollisionReport(){const objects=[...objectLayer.children].filter(o=>o.dataset.kind==='part'),large=objects.filter(o=>objectTags(o).includes('collision-large')),issues=[];for(let i=0;i<large.length;i++){for(let j=i+1;j<large.length;j++){const a=large[i].getBoundingClientRect(),b=large[j].getBoundingClientRect();const w=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)),h=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));const overlap=w*h,small=Math.min(a.width*a.height,b.width*b.height);if(small&&overlap/small>.28)issues.push(`${large[i].dataset.label} / ${large[j].dataset.label}`)}}return issues.length?t(`Furniture collision found: ${issues[0]}. Move one object so the room remains usable.`,`Collision de mobilier : ${issues[0]}. Déplace un objet pour garder la pièce utilisable.`):t('Room simulation is running. Lighting is switched on and no major furniture collision was detected.','La simulation de la pièce est en cours. L’éclairage est allumé et aucune collision importante n’a été détectée.');}

function setObjectSize(v,commit=false){if(!selectedObject||selectedObject.dataset.installed==='1')return;selectedObject.dataset.size=clamp(v,24,420);selectedObject.dataset.installed='0';selectedObject.classList.remove('installed-part');applyObjectStyle(selectedObject);if(active==='vehicle')tryVehicleSnap(selectedObject,true);if(commit)commitHistory();}
function setObjectRotation(v,commit=false){if(!selectedObject||selectedObject.dataset.installed==='1')return;selectedObject.dataset.rotation=v;selectedObject.dataset.installed='0';selectedObject.classList.remove('installed-part');applyObjectStyle(selectedObject);if(active==='vehicle')tryVehicleSnap(selectedObject,true);if(commit)commitHistory();}
function duplicateSelected(){if(!selectedObject||selectedObject.dataset.installed==='1')return;const d=objectData().find((_,i)=>objectLayer.children[i]===selectedObject);if(!d)return;let copy;if(d.kind==='blueprint'){const item=(missions[active].library||[]).find(x=>x.id===d.blueprintId);copy=addBlueprint(item,clamp(d.x+.05,.02,.98),clamp(d.y+.05,.02,.98),d.size,d.rotation,{select:true})}else if(d.kind==='vector')copy=addVector({type:d.vectorType,color:d.vectorColor,stroke:d.vectorStroke,path:d.vectorPath,x:clamp(d.x+.05,.02,.98),y:clamp(d.y+.05,.02,.98),size:d.size,aspect:d.aspect,rotation:d.rotation,label:d.label},{select:true});else{const p=findPart(d.partId)||part(d.partId,d.icon,d.label,d.label,JSON.parse(d.tags||'[]'),d.className);copy=addObject(p,clamp(d.x+.05,.02,.98),clamp(d.y+.05,.02,.98),d.size,d.rotation,{select:true})}commitHistory();return copy;}
function deleteSelected(){if(!selectedObject)return;if(selectedObject.dataset.installed==='1'){$('creatorCoach').textContent=t('That piece is already fitted into the car and is locked in place.','Cette pièce est déjà fixée dans la voiture et verrouillée.');return}selectedObject.remove();selectedObject=null;selectObject(null);refreshLibraryCards();refreshVehicleComponentButtons();commitHistory();}
function layerSelected(front){if(!selectedObject)return;front?objectLayer.appendChild(selectedObject):objectLayer.insertBefore(selectedObject,objectLayer.firstChild);commitHistory();}

// Controls
document.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>openMission(b.dataset.mission));
$('toolSelect').onclick=()=>setTool('select');$('toolPen').onclick=()=>setTool('pen');$('toolEraser').onclick=()=>setTool('eraser');$('toolLine').onclick=()=>setTool('line');$('toolCurve').onclick=()=>setTool('curve');$('toolRect').onclick=()=>setTool('rect');$('toolCircle').onclick=()=>setTool('circle');
$('toggleTemplate').onclick=()=>{templateOn=!templateOn;renderTemplate(active);updateBlueprintVisibility();commitHistory()};
$('toggleGrid').onclick=()=>{gridOn=!gridOn;stage.classList.toggle('show-grid',gridOn);$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');commitHistory()};
$('undoDraw').onclick=()=>{if(historyIndex<=0)return;historyIndex--;restoreSnapshot(history[historyIndex])};$('redoDraw').onclick=()=>{if(historyIndex>=history.length-1)return;historyIndex++;restoreSnapshot(history[historyIndex])};
$('objectSize').addEventListener('input',e=>setObjectSize(+e.target.value));$('objectSize').addEventListener('change',()=>commitHistory());$('objectRotate').addEventListener('input',e=>setObjectRotation(+e.target.value));$('objectRotate').addEventListener('change',()=>commitHistory());
$('shrinkObject').onclick=()=>setObjectSize((+selectedObject.dataset.size||68)-10,true);$('growObject').onclick=()=>setObjectSize((+selectedObject.dataset.size||68)+10,true);$('duplicateObject').onclick=duplicateSelected;$('deleteObject').onclick=deleteSelected;$('bringFrontObject').onclick=()=>layerSelected(true);$('sendBackObject').onclick=()=>layerSelected(false);
$('testCreation').onclick=startTest;$('stopCreationTest').onclick=()=>stopTest(true);$('saveIdea').onclick=save;$('clearIdea').onclick=openClearDialog;$('keepProject').onclick=closeClearDialog;$('confirmClearProject').onclick=clearProjectNow;$('creatorClearDialog').addEventListener('click',e=>{if(e.target===$('creatorClearDialog'))closeClearDialog()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(testRunning)stopTest(true);else if(!$('creatorClearDialog').hidden)closeClearDialog()}});
$('closeCreatorWorkspace').onclick=()=>{stopTest(false);$('creatorWorkspace').hidden=true;document.querySelector('.creator-grid').scrollIntoView({behavior:'smooth',block:'start'})};
document.querySelectorAll('[data-vehicle-view]').forEach(b=>b.onclick=()=>setVehicleView(b.dataset.vehicleView));
$('vehicleResetOrbit').onclick=()=>{vehicleYaw=0;vehiclePitch=.04;vehicleViewMode='left';renderTemplate('vehicle');updateVehicleViewUI();commitHistory()};
renderColours();setTool('select');updateHistoryButtons();updateVehicleViewUI();
})();
