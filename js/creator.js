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
 mode('power','⚡','Power system','Système d’énergie','Choose one powertrain, then install only the components that make that system work.','Choisis une motorisation, puis installe uniquement les composants nécessaires à ce système.',[
  part('petrol-engine','⚙️','Petrol engine','Moteur essence',['power'], '', {aspect:1.45,defaultSize:82}),
  part('diesel-engine','⚙️','Diesel engine','Moteur diesel',['power'], '', {aspect:1.45,defaultSize:82}),
  part('electric-motor','⚡','Electric motor','Moteur électrique',['power'], '', {aspect:1,defaultSize:68}),
  part('battery','🔋','Traction battery','Batterie de traction',['power'], '', {aspect:2.2,defaultSize:104}),
  part('inverter','▣','Power controller / inverter','Contrôleur de puissance / onduleur',['power'], '', {aspect:1.55,defaultSize:72}),
  part('charge-port','🔌','Charge port','Prise de recharge',['power'], '', {aspect:1,defaultSize:54}),
  part('fuel-tank','⛽','Fuel tank','Réservoir de carburant',['power'], '', {aspect:1.75,defaultSize:88}),
  part('exhaust','〽','Exhaust system','Système d’échappement',['power'], '', {aspect:3.8,defaultSize:110}),
  part('radiator','▥','Radiator / cooling','Radiateur / refroidissement',['power'], '', {aspect:1.8,defaultSize:80}),
  part('dpf','▰','Diesel particulate filter','Filtre à particules diesel',['power'], '', {aspect:2.2,defaultSize:70}),
  part('solar','☀️','Solar assist','Assistance solaire',['power'], '', {aspect:2.4,defaultSize:96})
 ]),
 mode('safety','🛡️','Safety','Sécurité','Protect the same car: fit cabin safety equipment from underneath, then rotate to the front, rear and sides for the external sensors and indicators.','Protège la même voiture : place les équipements de sécurité de l’habitacle par dessous, puis tourne vers l’avant, l’arrière et les côtés pour les capteurs et clignotants extérieurs.',[
  part('belt','🔒','Seat belt','Ceinture',['safety'],'',{aspect:2.7,defaultSize:58}),
  part('airbag','◯','Airbag','Airbag',['safety'],'',{aspect:1,defaultSize:54}),
  part('sensor','📡','Collision sensor','Capteur anticollision',['safety'],'',{aspect:1,defaultSize:46}),
  part('camera','📷','Safety camera','Caméra de sécurité',['safety'],'',{aspect:1.5,defaultSize:54}),
  part('indicator','🟠','Indicator','Clignotant',['safety'],'',{aspect:2.0,defaultSize:48}),
  part('safety-light','🚨','Warning light','Feu d’alerte',['safety'],'',{aspect:1.15,defaultSize:50}),
  part('emergency-stop','🛑','Emergency stop','Arrêt d’urgence',['safety'],'',{aspect:1,defaultSize:50})
 ]),
 mode('future','✨','Future tech','Technologies futures','Choose one future ability for this same car, then fit the matching technology.','Choisis une capacité future pour cette même voiture, puis installe la technologie correspondante.',[
  part('wing','', 'Flight wing','Aile de vol',['future','flight'],'wing',{aspect:2.8,defaultSize:104}),
  part('propeller','🌀','Flight propeller','Hélice de vol',['future','flight'],'',{aspect:1,defaultSize:64}),
  part('jet','🔥','Jet unit','Réacteur',['future','flight'],'',{aspect:1.45,defaultSize:64}),
  part('amphibious','', 'Amphibious hull','Coque amphibie',['future','amphibious'],'amphibious',{aspect:3.1,defaultSize:120}),
  part('water-jet','🌊','Water jet','Propulseur aquatique',['future','amphibious'],'',{aspect:1,defaultSize:58}),
  part('retract-wheel','🛞','Retractable wheel mechanism','Mécanisme de roue rétractable',['future','wheel'],'',{aspect:1,defaultSize:56}),
  part('drone-lift','🛸','Drone lift rotor','Rotor de portance drone',['future','flight'],'',{aspect:1,defaultSize:62}),
  part('stabiliser','◢','Stabiliser fin','Aileron stabilisateur',['future'],'',{aspect:1.65,defaultSize:64}),
  part('future-sensor','🔵','Future sensor','Capteur futuriste',['future','safety'],'',{aspect:1,defaultSize:52})
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
let active=null,activeMode=null,currentLibraryId=null,tool='select',colour=colours[1],drawing=false,startPoint=null,lastPoint=null,tempVector=null,freePoints=[],selectedObject=null,drawStrokes=0,templateOn=true,gridOn=false,history=[],historyIndex=-1,restoring=false,testRunning=false,vehicleYaw=0,vehiclePitch=.10,vehicleViewMode='orbit',vehicleOrbiting=false,vehiclePowertrain='',vehicleHybridType='self',vehicleFutureAbility='',vehicleFlightSystem='',vehicleRevealActive=false,vehicleRevealProgress=0,vehicleRevealRAF=0,vehicleRevealTimer=0,vehicleRevealStart=0,vehicleRevealStage='idle',vehiclePhase2Progress=0,vehiclePhase2Start=0,vehiclePhase2RAF=0,vehiclePhase2Timer=0,vehiclePhase3Progress=0,vehiclePhase3Start=0,vehiclePhase3RAF=0,vehiclePhase3Timer=0,vehiclePaintColor='#5de4ff',vehiclePreviousPaintColor='#5de4ff',vehiclePaintMix=1,vehiclePaintRAF=0,vehiclePaintTimer=0;
const STORAGE='cw_creator_projects_v18';
/* Keep version 9 so saved prototype cars restore through the staged final-reveal updates. */
const VEHICLE_PUZZLE_VERSION=9;
const VEHICLE_POWERTRAINS=[
  {id:'petrol',icon:'⛽',label:['Petrol','Essence']},
  {id:'diesel',icon:'🛢️',label:['Diesel','Diesel']},
  {id:'electric',icon:'⚡',label:['Electric','Électrique']},
  {id:'hybrid',icon:'♻️',label:['Hybrid','Hybride']}
];
const VEHICLE_POWER_PART_IDS=new Set(['petrol-engine','diesel-engine','electric-motor','battery','inverter','charge-port','fuel-tank','exhaust','radiator','dpf','solar']);
const VEHICLE_FUTURE_ABILITIES=[
  {id:'flight',icon:'✈️',label:['Flying car','Voiture volante']},
  {id:'water',icon:'🌊',label:['Water / amphibious car','Voiture aquatique / amphibie']}
];
const VEHICLE_FLIGHT_SYSTEMS=[
  {id:'propeller',icon:'🌀',label:['Propeller flight','Vol par hélices']},
  {id:'jet',icon:'🔥',label:['Jet flight','Vol par réacteurs']},
  {id:'drone',icon:'🛸',label:['Drone lift','Portance par rotors']}
];
const VEHICLE_FUTURE_PART_IDS=new Set(['wing','propeller','jet','amphibious','water-jet','retract-wheel','drone-lift','stabiliser','future-sensor']);

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

function vehiclePowertrainChoice(id=vehiclePowertrain){return VEHICLE_POWERTRAINS.find(x=>x.id===id)||null;}
function vehiclePowertrainLabel(id=vehiclePowertrain){const x=vehiclePowertrainChoice(id);return x?L(x.label):t('Not chosen yet','Pas encore choisi');}
function vehiclePowerConfig(){
  if(vehiclePowertrain==='petrol')return{required:['petrol-engine','fuel-tank','exhaust','radiator'],optional:[]};
  if(vehiclePowertrain==='diesel')return{required:['diesel-engine','fuel-tank','exhaust','radiator','dpf'],optional:[]};
  if(vehiclePowertrain==='electric')return{required:['electric-motor','battery','inverter','charge-port'],optional:['solar']};
  if(vehiclePowertrain==='hybrid')return{required:['petrol-engine','electric-motor','battery','fuel-tank','exhaust','radiator','inverter',...(vehicleHybridType==='plugin'?['charge-port']:[])],optional:['solar']};
  return{required:[],optional:[]};
}
function vehiclePowerPartIdsForSelection(){const c=vehiclePowerConfig();return[...c.required,...c.optional];}
function vehiclePowertrainLocked(){return[...objectLayer.children].some(o=>o.dataset.kind==='part'&&o.dataset.installed==='1'&&(o.dataset.targetKey||'').startsWith('power-'));}
function removeLooseVehiclePowerPieces(){[...objectLayer.children].filter(o=>o.dataset.kind==='part'&&VEHICLE_POWER_PART_IDS.has(o.dataset.partId)&&o.dataset.installed!=='1').forEach(o=>o.remove());if(selectedObject&&VEHICLE_POWER_PART_IDS.has(selectedObject.dataset.partId))selectObject(null);}
function selectVehiclePowertrain(id){
  if(!VEHICLE_POWERTRAINS.some(x=>x.id===id))return;
  if(vehiclePowertrainLocked()&&vehiclePowertrain&&vehiclePowertrain!==id){$('creatorCoach').textContent=t('This power system is already being built. Use Change power system if you want to remove only the fitted power components and choose another one.','Ce système d’énergie est déjà en construction. Utilise Changer le système d’énergie pour retirer uniquement les composants de puissance fixés et en choisir un autre.');return;}
  if(vehiclePowertrain!==id){removeLooseVehiclePowerPieces();vehiclePowertrain=id;if(id!=='hybrid')vehicleHybridType='self';}
  renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));commitHistory();
}
function selectVehicleHybridType(type){
  if(!['self','plugin'].includes(type)||vehiclePowertrain!=='hybrid')return;
  if(vehiclePowertrainLocked()&&vehicleHybridType!==type){$('creatorCoach').textContent=t('The hybrid system is already being built. Change the power system first if you want a different hybrid type.','Le système hybride est déjà en construction. Change d’abord le système d’énergie si tu veux un autre type d’hybride.');return;}
  if(vehicleHybridType!==type){removeLooseVehiclePowerPieces();vehicleHybridType=type;renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));commitHistory();}
}
function resetVehiclePowerSystem(){
  if(!vehiclePowertrain&&!vehiclePowertrainLocked())return;
  if(!window.confirm(t('Change power system? Only the Power System parts will be removed. Your completed Body & Movement car will stay exactly as it is.','Changer le système d’énergie ? Seules les pièces du système d’énergie seront retirées. La carrosserie et le mouvement déjà terminés resteront exactement comme ils sont.')))return;
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&((o.dataset.targetKey||'').startsWith('power-')||VEHICLE_POWER_PART_IDS.has(o.dataset.partId)&&o.dataset.installed!=='1')).forEach(o=>o.remove());
  selectObject(null);vehiclePowertrain='';vehicleHybridType='self';renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));commitHistory();
  $('creatorCoach').textContent=t('Power System cleared only. Choose Petrol, Diesel, Electric or Hybrid. Your Body & Movement build is untouched.','Seul le système d’énergie a été effacé. Choisis Essence, Diesel, Électrique ou Hybride. Ta carrosserie et ton mouvement sont intacts.');
}

function vehicleFutureAbilityChoice(id=vehicleFutureAbility){return VEHICLE_FUTURE_ABILITIES.find(x=>x.id===id)||null;}
function vehicleFutureAbilityLabel(id=vehicleFutureAbility){const x=vehicleFutureAbilityChoice(id);return x?L(x.label):t('Not chosen yet','Pas encore choisi');}
function vehicleFlightSystemChoice(id=vehicleFlightSystem){return VEHICLE_FLIGHT_SYSTEMS.find(x=>x.id===id)||null;}
function vehicleFlightSystemLabel(id=vehicleFlightSystem){const x=vehicleFlightSystemChoice(id);return x?L(x.label):t('Not chosen yet','Pas encore choisi');}
function vehicleFutureConfig(){
  if(vehicleFutureAbility==='flight'){
    if(!vehicleFlightSystem)return{required:[],optional:[]};
    const propulsion=vehicleFlightSystem==='propeller'?'propeller':vehicleFlightSystem==='jet'?'jet':'drone-lift';
    return{required:['wing',propulsion,'retract-wheel','stabiliser','future-sensor'],optional:[]};
  }
  if(vehicleFutureAbility==='water')return{required:['amphibious','water-jet','retract-wheel','stabiliser','future-sensor'],optional:[]};
  return{required:[],optional:[]};
}
function vehicleFuturePartIdsForSelection(){const c=vehicleFutureConfig();return[...c.required,...c.optional];}
function vehicleFutureLocked(){return[...objectLayer.children].some(o=>o.dataset.kind==='part'&&o.dataset.installed==='1'&&(o.dataset.targetKey||'').startsWith('future-'));}
function removeLooseVehicleFuturePieces(){[...objectLayer.children].filter(o=>o.dataset.kind==='part'&&VEHICLE_FUTURE_PART_IDS.has(o.dataset.partId)&&o.dataset.installed!=='1').forEach(o=>o.remove());if(selectedObject&&VEHICLE_FUTURE_PART_IDS.has(selectedObject.dataset.partId))selectObject(null);}
/* Prototype test helper: remove ONLY Future Tech pieces so another future system can
   be fitted and checked on the same completed Body + Power + Safety vehicle. */
function clearVehicleFuturePiecesForSwitch(){
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&((o.dataset.targetKey||'').startsWith('future-')||(VEHICLE_FUTURE_PART_IDS.has(o.dataset.partId)&&o.dataset.installed!=='1'))).forEach(o=>o.remove());
  if(selectedObject&&VEHICLE_FUTURE_PART_IDS.has(selectedObject.dataset.partId))selectObject(null);
}
function selectVehicleFutureAbility(id){
  if(!VEHICLE_FUTURE_ABILITIES.some(x=>x.id===id))return;
  if(vehicleFutureAbility!==id){
    if(testRunning)stopTest(false);
    clearVehicleFuturePiecesForSwitch();
    vehicleFutureAbility=id;vehicleFlightSystem='';
    renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));commitHistory();
    $('creatorCoach').textContent=id==='flight'
      ?t('Flying Car selected. Choose Propeller, Jet or Drone Lift, then fit that complete system. Your Body, Power and Safety work is unchanged.','Voiture volante sélectionnée. Choisis Hélices, Réacteurs ou Rotors drone, puis installe ce système complet. Carrosserie, Énergie et Sécurité restent inchangées.')
      :t('Water / Amphibious selected. Fit the water system on this same completed car. Your Body, Power and Safety work is unchanged.','Aquatique / amphibie sélectionné. Installe le système aquatique sur cette même voiture terminée. Carrosserie, Énergie et Sécurité restent inchangées.');
    return;
  }
  renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));
}
function selectVehicleFlightSystem(id){
  if(!VEHICLE_FLIGHT_SYSTEMS.some(x=>x.id===id)||vehicleFutureAbility!=='flight')return;
  if(vehicleFlightSystem!==id){
    if(testRunning)stopTest(false);
    clearVehicleFuturePiecesForSwitch();
    vehicleFlightSystem=id;
    renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));commitHistory();
    $('creatorCoach').textContent=t(`${vehicleFlightSystemLabel()} selected for testing. Fit its required Future Tech pieces. The rest of your car is untouched.`,`${vehicleFlightSystemLabel()} sélectionné pour le test. Installe ses pièces de technologie future requises. Le reste de la voiture reste intact.`);
  }
}
function resetVehicleFutureSystem(){
  if(!vehicleFutureAbility&&!vehicleFutureLocked())return;
  if(!window.confirm(t('Change Future Tech? Only the Future Tech parts will be removed. Body & Movement, Power System and Safety will stay exactly as they are.','Changer la technologie future ? Seules les pièces de technologie future seront retirées. Carrosserie et mouvement, Système d’énergie et Sécurité resteront exactement comme ils sont.')))return;
  if(testRunning)stopTest(false);
  clearVehicleFuturePiecesForSwitch();
  selectObject(null);vehicleFutureAbility='';vehicleFlightSystem='';renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));commitHistory();
  $('creatorCoach').textContent=t('Future Tech cleared only. Choose Flying Car or Water / Amphibious Car. The rest of your completed vehicle is untouched.','Seule la technologie future a été effacée. Choisis Voiture volante ou Voiture aquatique / amphibie. Le reste de ton véhicule terminé est intact.');
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
    sensor:[[-.82,-.82],[.82,-.82],[1,-.34],[1,.34],[.82,.82],[-.82,.82],[-1,.34],[-1,-.34]],
    indicator:[[-1,-.42],[-.68,-.76],[.50,-.70],[1,-.22],[.78,.50],[-.46,.72]],
    'safety-light':[[0,-1],[.94,.66],[.56,1],[-.56,1],[-.94,.66]],
    battery:[[-1,-.72],[.82,-.72],[1,-.45],[.92,.72],[-.92,.72],[-1,.46]],
    camera:[[-1,-.72],[.72,-.72],[1,-.12],[.72,.72],[-.72,.72],[-1,.12]],
    'petrol-engine':[[-1,-.72],[-.78,-1],[.62,-1],[1,-.58],[.92,.64],[.58,.94],[-.74,.94],[-1,.54]],
    'diesel-engine':[[-1,-.76],[-.72,-1],[.68,-.96],[1,-.50],[.88,.68],[.50,.96],[-.72,.92],[-1,.48]],
    inverter:[[-1,-.82],[.78,-.82],[1,-.48],[.92,.80],[-.92,.80],[-1,.48]],
    'fuel-tank':[[-1,-.52],[-.76,-.88],[.68,-.88],[1,-.48],[.90,.56],[.62,.88],[-.72,.88],[-1,.50]],
    exhaust:[[-1,-.30],[-.82,-.58],[.30,-.48],[.46,-.18],[1,-.12],[1,.20],[.40,.28],[.20,.52],[-.84,.46]],
    radiator:[[-1,-.90],[1,-.90],[1,.90],[-1,.90]],
    dpf:[[-1,-.60],[.76,-.60],[1,-.28],[.86,.60],[-.86,.60],[-1,.28]],
    solar:[[-1,-.82],[1,-.82],[1,.82],[-1,.82]],
    wing:[[-1,-.20],[-.44,-.68],[.86,-.92],[1,-.48],[.30,.18],[.92,.64],[.72,.94],[-.42,.54]],
    jet:[[-1,-.58],[-.62,-.92],[.48,-.92],[1,-.46],[.92,.54],[.48,.92],[-.62,.92],[-1,.58]],
    amphibious:[[-1,-.44],[-.78,-.82],[.66,-.92],[1,-.46],[.92,.48],[.58,.90],[-.68,.82],[-1,.42]],
    stabiliser:[[-1,.78],[-.54,-.90],[.18,-.36],[1,.84]],
    'future-sensor':[[-.72,-1],[.72,-1],[1,-.72],[1,.72],[.72,1],[-.72,1],[-1,.72],[-1,-.72]]
  };
  if(['steering','airbag','emergency-stop','electric-motor','charge-port','sensor','propeller','water-jet','retract-wheel','drone-lift'].includes(partId))return circle();
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
  if(['battery','electric-motor','inverter','charge-port'].includes(partId))return{fill:'rgba(88,225,159,.68)',stroke:'rgba(221,255,239,.94)'};
  if(['petrol-engine','diesel-engine','radiator','dpf'].includes(partId))return{fill:'rgba(187,196,205,.72)',stroke:'rgba(248,252,255,.94)'};
  if(['fuel-tank','exhaust'].includes(partId))return{fill:'rgba(178,151,108,.68)',stroke:'rgba(250,229,194,.92)'};
  if(partId==='belt')return{fill:'rgba(218,228,237,.78)',stroke:'rgba(250,253,255,.95)'};
  if(partId==='airbag')return{fill:'rgba(238,245,250,.82)',stroke:'rgba(255,255,255,.98)'};
  if(['sensor','camera'].includes(partId))return{fill:'rgba(74,190,224,.74)',stroke:'rgba(220,250,255,.96)'};
  if(partId==='indicator')return{fill:'rgba(255,174,54,.82)',stroke:'rgba(255,235,196,.98)'};
  if(['safety-light','emergency-stop'].includes(partId))return{fill:'rgba(237,89,104,.78)',stroke:'rgba(255,230,235,.98)'};
  if(partId==='solar')return{fill:'rgba(66,139,213,.64)',stroke:'rgba(209,238,255,.94)'};
  if(['wing','stabiliser'].includes(partId))return{fill:'rgba(124,126,255,.68)',stroke:'rgba(229,232,255,.96)'};
  if(['propeller','jet','drone-lift'].includes(partId))return{fill:'rgba(167,112,255,.70)',stroke:'rgba(242,230,255,.96)'};
  if(['amphibious','water-jet'].includes(partId))return{fill:'rgba(64,177,232,.68)',stroke:'rgba(220,248,255,.96)'};
  if(partId==='retract-wheel')return{fill:'rgba(112,128,145,.76)',stroke:'rgba(238,246,252,.96)'};
  if(partId==='future-sensor')return{fill:'rgba(71,229,222,.74)',stroke:'rgba(220,255,252,.96)'};
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

  return slots;
}
function vehicleSafetySlots(){
  const p=vehicleProfile(),L=p.length,W=p.width,sport=p.id==='sport',down=[0,0,-1],slots=[];
  const add=(key,partId,center,u,v,normal,opts={})=>slots.push(vehicleSlot(`safety-${key}`,partId,center,u,v,normal,{view:opts.view||'exterior',required:opts.required!==false,minFacing:opts.minFacing??.28,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));

  /* Cabin protection — fitted by rotating underneath / using Interior. */
  add('belt-driver','belt',[.08,-W*.40,sport?.58:.65],[.12,0,0],[0,.045,0],down,{view:'interior',aspect:2.7,minFacing:.34});
  add('belt-passenger','belt',[.08,W*.40,sport?.58:.65],[.12,0,0],[0,.045,0],down,{view:'interior',aspect:2.7,minFacing:.34});
  add('airbag-driver','airbag',[-.50,-W*.25,sport?.69:.80],[.075,0,0],[0,.075,0],down,{view:'interior',aspect:1,minFacing:.34});
  add('airbag-passenger','airbag',[-.56,W*.25,sport?.69:.80],[.085,0,0],[0,.085,0],down,{view:'interior',aspect:1,minFacing:.34});
  add('camera','camera',[-.33,0,sport?.91:1.04],[.075,0,0],[0,.050,0],down,{view:'interior',aspect:1.5,minFacing:.34});
  add('warning-light','safety-light',[-.48,-W*.04,sport?.71:.82],[.052,0,0],[0,.045,0],down,{view:'interior',aspect:1.15,minFacing:.34});
  add('emergency-stop','emergency-stop',[-.48,W*.12,sport?.70:.81],[.050,0,0],[0,.050,0],down,{view:'interior',aspect:1,minFacing:.34});

  /* Collision sensors around the shell: front, rear and both sides. */
  add('sensor-front','sensor',[-L*.492,0,sport?.44:.50],[0,W*.065,0],[0,0,.065],[-1,0,.05],{aspect:1,minFacing:.24});
  add('sensor-rear','sensor',[L*.492,0,sport?.43:.49],[0,W*.065,0],[0,0,.065],[1,0,.05],{aspect:1,minFacing:.24});
  add('sensor-left','sensor',[.10,-W*.505,sport?.46:.52],[.065,0,0],[0,0,.065],[0,-1,.03],{aspect:1,minFacing:.24});
  add('sensor-right','sensor',[.10,W*.505,sport?.46:.52],[.065,0,0],[0,0,.065],[0,1,.03],{aspect:1,minFacing:.24});

  /* Four turn indicators: one at each front/rear corner. */
  for(const sgn of [-1,1]){
    add(`indicator-front-${sgn>0?'r':'l'}`,'indicator',[-L*.468,sgn*W*.405,sport?.58:.64],[0,W*.090,0],[0,0,.045],[-1,0,.10],{aspect:2.0,minFacing:.24});
    add(`indicator-rear-${sgn>0?'r':'l'}`,'indicator',[L*.468,sgn*W*.405,sport?.56:.62],[0,W*.088,0],[0,0,.044],[1,0,.10],{aspect:2.0,minFacing:.24});
  }
  return slots;
}
function vehiclePowerSlots(){
  if(!vehiclePowertrain)return[];
  const p=vehicleProfile(),L=p.length,W=p.width,sport=p.id==='sport',down=[0,0,-1],top=[0,0,1],side=[0,1,0],slots=[];
  const add=(key,partId,center,u,v,normal=down,opts={})=>slots.push(vehicleSlot(`power-${key}`,partId,center,u,v,normal,{view:opts.view||'interior',required:opts.required!==false,minFacing:opts.minFacing??.28,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));
  const ids=new Set(vehiclePowerPartIdsForSelection());
  if(ids.has('petrol-engine'))add('petrol-engine','petrol-engine',[-L*.30,0,sport?.43:.48],[.40,0,0],[0,W*.27,0],down,{aspect:1.5});
  if(ids.has('diesel-engine'))add('diesel-engine','diesel-engine',[-L*.30,0,sport?.43:.48],[.41,0,0],[0,W*.27,0],down,{aspect:1.5});
  if(ids.has('electric-motor'))add('electric-motor','electric-motor',[-L*.26,0,sport?.34:.39],[.25,0,0],[0,.25,0],down,{aspect:1});
  if(ids.has('battery')){
    const hybrid=vehiclePowertrain==='hybrid';
    add('battery','battery',[hybrid?L*.12:L*.16,0,sport?.27:.31],[hybrid?.42:.72,0,0],[0,W*(hybrid?.25:.34),0],down,{aspect:hybrid?1.65:2.2});
  }
  if(ids.has('inverter'))add('inverter','inverter',[-L*.06,0,sport?.34:.39],[.27,0,0],[0,W*.20,0],down,{aspect:1.55});
  if(ids.has('fuel-tank'))add('fuel-tank','fuel-tank',[L*.31,0,sport?.27:.31],[.34,0,0],[0,W*.27,0],down,{aspect:1.75});
  if(ids.has('exhaust'))add('exhaust','exhaust',[L*.18,-W*.31,sport?.17:.20],[.66,0,0],[0,.10,0],down,{aspect:3.8});
  if(ids.has('radiator'))add('radiator','radiator',[-L*.44,0,sport?.42:.47],[.15,0,0],[0,W*.30,0],down,{aspect:1.8});
  if(ids.has('dpf'))add('dpf','dpf',[L*.02,-W*.26,sport?.20:.23],[.24,0,0],[0,.12,0],down,{aspect:2.2});
  if(ids.has('charge-port'))add('charge-port','charge-port',[L*.23,W*.515,sport?.70:.78],[.085,0,0],[0,0,.085],side,{view:'exterior',minFacing:.22,aspect:1});
  if(ids.has('solar'))add('solar','solar',[.10,0,p.roofZ+.025],[.54,0,0],[0,W*.28,0],top,{view:'exterior',required:false,minFacing:.08,aspect:2.4});
  return slots;
}
function vehicleFutureSlots(){
  if(!vehicleFutureAbility)return[];
  if(vehicleFutureAbility==='flight'&&!vehicleFlightSystem)return[];
  const p=vehicleProfile(),L=p.length,W=p.width,sport=p.id==='sport',down=[0,0,-1],top=[0,0,1],rear=[1,0,0],front=[-1,0,0],slots=[];
  const ids=new Set(vehicleFuturePartIdsForSelection());
  const add=(key,partId,center,u,v,normal=top,opts={})=>slots.push(vehicleSlot(`future-${key}`,partId,center,u,v,normal,{view:opts.view||'exterior',required:opts.required!==false,minFacing:opts.minFacing??.22,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));

  if(vehicleFutureAbility==='flight'){
    /* Two wings — easiest from Top view. */
    for(const sgn of [-1,1])add(`wing-${sgn>0?'r':'l'}`,'wing',[.20,sgn*W*.73,sport?.62:.68],[.48,0,0],[0,sgn*W*.34,0],top,{aspect:2.8,minFacing:.08});
    /* Four retractable-wheel mechanisms — fitted from underneath. */
    for(const [axle,x] of [['front',-p.wheelbase/2],['rear',p.wheelbase/2]])for(const sgn of [-1,1])add(`retract-${axle}-${sgn>0?'r':'l'}`,'retract-wheel',[x,sgn*W*.44,.19],[.085,0,0],[0,.085,0],down,{view:'interior',aspect:1,minFacing:.30});
    /* Rear stabiliser fins. */
    for(const sgn of [-1,1])add(`stabiliser-${sgn>0?'r':'l'}`,'stabiliser',[L*.34,sgn*W*.37,sport?.74:.82],[.16,0,0],[0,sgn*.10,.12],top,{aspect:1.65,minFacing:.08});
    /* Advanced front/rear environment sensors. */
    add('sensor-front','future-sensor',[-L*.485,0,sport?.67:.73],[0,W*.075,0],[0,0,.075],front,{aspect:1,minFacing:.20});
    add('sensor-rear','future-sensor',[L*.485,0,sport?.65:.71],[0,W*.075,0],[0,0,.075],rear,{aspect:1,minFacing:.20});
    if(ids.has('propeller')){
      for(const sgn of [-1,1])add(`propeller-${sgn>0?'r':'l'}`,'propeller',[L*.49,sgn*W*.28,sport?.59:.65],[0,.10,0],[0,0,.10],rear,{aspect:1,minFacing:.22});
    }
    if(ids.has('jet')){
      for(const sgn of [-1,1])add(`jet-${sgn>0?'r':'l'}`,'jet',[L*.49,sgn*W*.27,sport?.52:.58],[0,.12,0],[0,0,.082],rear,{aspect:1.45,minFacing:.22});
    }
    if(ids.has('drone-lift')){
      const xs=[-L*.22,L*.22],ys=[-W*.48,W*.48];
      xs.forEach((x,xi)=>ys.forEach((y,yi)=>add(`drone-${xi}-${yi}`,'drone-lift',[x,y,sport?.78:.86],[.095,0,0],[0,.095,0],top,{aspect:1,minFacing:.08})));
    }
  }

  if(vehicleFutureAbility==='water'){
    /* Sealed amphibious underbody hull. */
    add('amphibious-hull','amphibious',[.08,0,sport?.14:.17],[L*.36,0,0],[0,W*.36,0],down,{view:'interior',aspect:3.1,minFacing:.28});
    /* Four wheel-retraction mechanisms for water travel. */
    for(const [axle,x] of [['front',-p.wheelbase/2],['rear',p.wheelbase/2]])for(const sgn of [-1,1])add(`retract-${axle}-${sgn>0?'r':'l'}`,'retract-wheel',[x,sgn*W*.44,.19],[.085,0,0],[0,.085,0],down,{view:'interior',aspect:1,minFacing:.30});
    /* Twin rear water jets. */
    for(const sgn of [-1,1])add(`water-jet-${sgn>0?'r':'l'}`,'water-jet',[L*.49,sgn*W*.25,sport?.30:.34],[0,.095,0],[0,0,.095],rear,{aspect:1,minFacing:.22});
    /* Two small stabilising fins for directional control in water. */
    for(const sgn of [-1,1])add(`stabiliser-${sgn>0?'r':'l'}`,'stabiliser',[L*.34,sgn*W*.39,sport?.35:.39],[0,sgn*.14,0],[0,0,.10],rear,{aspect:1.65,minFacing:.18});
    add('sensor-front','future-sensor',[-L*.485,0,sport?.58:.64],[0,W*.075,0],[0,0,.075],front,{aspect:1,minFacing:.20});
    add('sensor-rear','future-sensor',[L*.485,0,sport?.58:.64],[0,W*.075,0],[0,0,.075],rear,{aspect:1,minFacing:.20});
  }
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
  const edges=vehicleMainEdges(),rp=vehicleRevealActive?vehicleRevealProgress:0;
  const fade=vehicleRevealActive?clamp(1-Math.max(0,(rp-.26)/.60),0,1):1;
  const glow=vehicleRevealActive?(.35+.65*Math.sin(Math.min(1,rp/.30)*Math.PI)):0;
  tctx.save();
  if(testRunning&&!vehicleRevealActive){
    const nearSide=edges[1];
    tctx.beginPath();
    nearSide.forEach((pt,i)=>{const q=vehicleProjectPoint(pt);i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y)});
    tctx.closePath();tctx.fillStyle='rgba(46,156,235,.24)';tctx.fill();
  }
  tctx.globalAlpha=fade;
  if(vehicleRevealActive){tctx.shadowColor='rgba(72,231,255,.95)';tctx.shadowBlur=4+glow*18;}
  tctx.lineCap='round';tctx.lineJoin='round';tctx.strokeStyle=`rgba(88,225,255,${vehicleRevealActive?.98:.76})`;tctx.lineWidth=vehicleRevealActive?2.5+glow*1.4:2.1;
  edges.forEach(e=>drawProjectedPath(e));
  tctx.shadowBlur=0;tctx.strokeStyle='rgba(88,225,255,.20)';tctx.lineWidth=1;
  const p=vehicleProfile(),L=p.length,W=p.width;
  [[-.44,.24],[-.18,.44],[.12,.52],[.37,.36]].forEach(([xf,z])=>drawProjectedPath([[xf*L,-W*.48,z],[xf*L,W*.48,z]]));
  tctx.restore();
}

function vehicleRevealEase(a,b,p=vehicleRevealProgress){return clamp((p-a)/(b-a),0,1)}
function vehicleRevealPath(points){
  if(!points?.length)return;
  tctx.beginPath();points.forEach((q,i)=>i?tctx.lineTo(q.x,q.y):tctx.moveTo(q.x,q.y));tctx.closePath();
}
function vehicleHexRgb(hex){
  const h=String(hex||'#5de4ff').replace('#','');
  const n=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);
  return[(n>>16)&255,(n>>8)&255,n&255];
}
function vehicleMixColour(a,b,tv){
  const A=vehicleHexRgb(a),B=vehicleHexRgb(b),m=clamp(tv,0,1);
  const c=A.map((v,i)=>Math.round(v+(B[i]-v)*m));
  return`rgb(${c[0]},${c[1]},${c[2]})`;
}
function vehicleShade(hex,amount){
  const c=vehicleHexRgb(hex).map(v=>clamp(Math.round(v+amount),0,255));
  return`rgb(${c[0]},${c[1]},${c[2]})`;
}
function vehiclePath(points){
  tctx.beginPath();points.forEach((p,i)=>i?tctx.lineTo(p[0],p[1]):tctx.moveTo(p[0],p[1]));tctx.closePath();
}
function drawCanonicalFinishedVehicle(){
  if(!vehicleRevealActive)return;
  const W=templateCanvas.width,H=templateCanvas.height,scale=Math.min(W/800,H/450),ox=(W-800*scale)/2,oy=(H-450*scale)/2;
  const phase1=vehicleRevealStage==='phase1';
  const phase2=vehicleRevealStage==='phase2'||vehicleRevealStage==='phase2-ready'||vehicleRevealStage==='phase2-confirmed';
  const p=phase1?vehicleRevealProgress:1;
  const bodyT=phase1?vehicleRevealEase(.08,.58,p):1;
  const lineT=phase1?1-vehicleRevealEase(.38,.88,p):0;
  const glassT=phase1?vehicleRevealEase(.28,.70,p):1;
  const wheelT=phase1?vehicleRevealEase(.34,.76,p):1;
  const lightT=phase1?vehicleRevealEase(.62,.94,p):1;
  const camPulse=phase2?Math.sin(Math.min(1,vehiclePhase2Progress)*Math.PI):0;
  const camSlide=phase2?(-18+36*Math.min(1,vehiclePhase2Progress)):0;
  const paintBase=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):'#9fb0ba';
  const paintDark=phase2?vehicleShade(vehiclePaintColor,-72):'#435867';
  const paintLight=phase2?vehicleShade(vehiclePaintColor,72):'#dce6eb';
  tctx.save();tctx.translate(ox+(400+camSlide)*scale,oy+236*scale);tctx.scale(scale*(1+.055*camPulse),scale*(1+.055*camPulse));tctx.translate(-400,-236+camPulse*3);
  /* canonical construction shell: always the same angle, never inherited from Left/Right/Front/Rear/Top/Interior */
  const body=[[145,286],[182,255],[244,238],[301,224],[348,170],[477,171],[535,221],[624,239],[673,277],[655,310],[192,315]];
  const upper=[[301,224],[348,170],[477,171],[535,221],[506,227],[326,229]];
  const hood=[[145,286],[182,255],[301,224],[326,229],[244,271],[176,298]];
  const rearDeck=[[506,227],[535,221],[624,239],[673,277],[613,277],[548,249]];
  const lower=[[192,315],[655,310],[631,326],[212,331]];
  if(lineT>0){
    tctx.save();tctx.globalAlpha=lineT;tctx.strokeStyle='rgba(83,230,255,.98)';tctx.lineWidth=2.2;tctx.shadowColor='rgba(70,230,255,.92)';tctx.shadowBlur=14;
    [body,upper,hood,rearDeck,lower].forEach(sh=>{vehiclePath(sh);tctx.stroke()});
    [[244,238],[244,315]],[[301,224],[301,315]],[[535,221],[548,310]],[[624,239],[624,310]].forEach(pair=>{tctx.beginPath();tctx.moveTo(...pair[0]);tctx.lineTo(...pair[1]);tctx.stroke()});
    tctx.restore();
  }
  if(bodyT>0){
    tctx.save();tctx.globalAlpha=bodyT;
    vehiclePath(body);const g=tctx.createLinearGradient(150,185,660,320);g.addColorStop(0,paintLight);g.addColorStop(.36,paintBase);g.addColorStop(.72,paintDark);g.addColorStop(1,paintBase);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(224,244,250,.72)';tctx.lineWidth=1.8;tctx.stroke();
    vehiclePath(lower);tctx.fillStyle='rgba(21,33,42,.92)';tctx.fill();
    /* one coherent cabin: no stray rectangular glass and no floating mirror */
    const windscreen=[[326,221],[354,181],[396,181],[397,220]];
    const sideWindow=[[404,181],[470,184],[516,220],[406,220]];
    const rearQuarter=[[474,187],[516,220],[531,222],[505,195]];
    [windscreen,sideWindow,rearQuarter].forEach((sh,i)=>{vehiclePath(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,`rgba(127,211,239,${.72*glassT})`);gg.addColorStop(.48,`rgba(26,66,90,${.94*glassT})`);gg.addColorStop(1,`rgba(7,26,42,${.98*glassT})`);tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle=`rgba(224,248,255,${.72*glassT})`;tctx.lineWidth=1.2;tctx.stroke()});
    /* door and body seams are subtle and belong to the shell */
    tctx.strokeStyle='rgba(12,32,44,.46)';tctx.lineWidth=1.2;tctx.beginPath();tctx.moveTo(406,226);tctx.lineTo(408,299);tctx.lineTo(527,297);tctx.lineTo(531,226);tctx.stroke();
    tctx.beginPath();tctx.moveTo(302,229);tctx.lineTo(243,271);tctx.stroke();
    /* a small correctly placed side mirror, integrated beside the A-pillar */
    tctx.fillStyle=paintDark;tctx.beginPath();tctx.ellipse(323,228,10,5,-.25,0,Math.PI*2);tctx.fill();
    /* Future Tech preview is integrated, never shown as loose puzzle pieces */
    if(vehicleFutureAbility==='flight'){
      vehiclePath([[413,250],[509,249],[493,269],[425,271]]);tctx.fillStyle=paintDark;tctx.globalAlpha=.72*bodyT;tctx.fill();tctx.globalAlpha=bodyT;
    }else if(vehicleFutureAbility==='water'){
      tctx.strokeStyle='rgba(83,225,240,.52)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(215,319);tctx.quadraticCurveTo(425,340,629,317);tctx.stroke();
    }
    tctx.restore();
  }
  if(wheelT>0){
    [[270,307],[578,300]].forEach(([cx,cy])=>{const r=34;tctx.save();tctx.globalAlpha=wheelT;tctx.beginPath();tctx.arc(cx,cy,r,0,Math.PI*2);tctx.fillStyle='#10161b';tctx.fill();tctx.beginPath();tctx.arc(cx,cy,r*.61,0,Math.PI*2);const rg=tctx.createRadialGradient(cx-r*.12,cy-r*.18,2,cx,cy,r*.62);rg.addColorStop(0,'#f8fbfd');rg.addColorStop(.45,'#b7c3ca');rg.addColorStop(1,'#40515b');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(245,250,252,.82)';tctx.lineWidth=1.3;for(let i=0;i<6;i++){const a=i*Math.PI/3;tctx.beginPath();tctx.moveTo(cx,cy);tctx.lineTo(cx+Math.cos(a)*r*.49,cy+Math.sin(a)*r*.49);tctx.stroke()}tctx.beginPath();tctx.arc(cx,cy,r*.13,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();tctx.restore()});
  }
  if(lightT>0){
    [[166,276,'rgba(226,250,255,.98)'],[649,274,'rgba(255,67,86,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.globalAlpha=lightT;tctx.shadowBlur=22;tctx.shadowColor=c;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,16,7,0,0,Math.PI*2);tctx.fill();tctx.restore()});
  }
  if(phase2&&vehiclePaintMix<1){
    const sweep=vehiclePaintMix,xx=145+(530*sweep);tctx.save();tctx.globalAlpha=.45*(1-sweep*.3);const sg=tctx.createLinearGradient(xx-55,0,xx+35,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.65,'rgba(255,255,255,.85)');sg.addColorStop(1,'rgba(255,255,255,0)');tctx.fillStyle=sg;tctx.fillRect(xx-55,150,90,190);tctx.restore();
  }
  tctx.restore();
}
function drawFinishedVehicleReveal(){drawCanonicalFinishedVehicle()}
function drawVehicleGround(){
  tctx.save();tctx.strokeStyle='rgba(93,228,255,.12)';tctx.lineWidth=1.2;tctx.setLineDash([8,8]);
  tctx.beginPath();tctx.ellipse(400,305,205,25,0,0,Math.PI*2);tctx.stroke();tctx.restore();
}
function drawVehicleInteriorAccessLabel(){
  if(!vehicleUnderAccess())return;
  tctx.save();
  tctx.fillStyle='rgba(159,236,255,.88)';tctx.font='800 13px system-ui';tctx.textAlign='center';
  const label=activeMode==='power'
    ?t('UNDERBODY / POWER ACCESS — install the hidden power components','ACCÈS SOUS-CAISSE / ÉNERGIE — installe les composants d’énergie cachés')
    :activeMode==='safety'
      ?t('UNDERBODY / SAFETY ACCESS — install belts, airbags and cabin safety controls','ACCÈS SOUS-CAISSE / SÉCURITÉ — installe ceintures, airbags et commandes de sécurité')
      :activeMode==='future'
        ?t('UNDERBODY / FUTURE TECH ACCESS — fit hidden future mechanisms here','ACCÈS SOUS-CAISSE / TECHNOLOGIE FUTURE — fixe ici les mécanismes futurs cachés')
        :t('UNDERBODY / INTERIOR ACCESS — fit the cabin pieces from below','ACCÈS SOUS-CAISSE / INTÉRIEUR — fixe les pièces de l’habitacle par dessous');
  tctx.fillText(label,400,402);
  tctx.restore();
}
function drawVehicleBlueprint(){
  if(vehicleRevealStage==='phase3'||vehicleRevealStage==='phase3-complete'){drawVehicleFutureTestWorld();syncInstalledVehicleParts();return;}
  if(vehicleRevealActive){drawCanonicalFinishedVehicle();syncInstalledVehicleParts();return;}
  if(!templateOn)return;
  if(vehicleViewMode!=='interior')drawVehicleGround();
  const installed=installedVehicleKeys(),modeIds=vehicleModePartIds();
  const allSlots=vehicleAllPuzzleSlots();
  const projections=allSlots.map(vehicleSlotProjection).filter(Boolean).sort((a,b)=>a.depth-b.depth);
  if(vehicleRevealActive){
    drawFinishedVehicleReveal();
    tctx.save();tctx.globalAlpha=1-vehicleRevealEase(.18,.58);
    projections.forEach(proj=>{if(proj.visible&&installed.has(proj.key))drawInstalledVehiclePanel(proj)});
    tctx.restore();
  }else projections.forEach(proj=>{if(proj.visible&&installed.has(proj.key))drawInstalledVehiclePanel(proj)});
  drawVehicleWireframe();
  if(vehicleRevealActive){syncInstalledVehicleParts();return;}
  projections.forEach(proj=>{
    if(!proj.visible||installed.has(proj.key)||!modeIds.has(proj.partId))return;
    /* Interior/underbody view stays uncluttered: only slots belonging to the active stage are shown. */
    if(vehicleViewMode==='interior'&&proj.view!=='interior')return;
    drawVehicleSlotGuide(proj,proj,false);
  });
  drawVehicleInteriorAccessLabel();
  tctx.save();tctx.fillStyle='rgba(145,236,255,.66)';tctx.font='700 13px system-ui';tctx.textAlign='center';
  let msg;
  if(activeMode==='power'&&vehiclePowertrain){
    msg=vehicleUnderAccess()
      ?t('Power access: fit the internal and underbody components here. Exterior power parts use their matching outside view.','Accès énergie : place ici les composants internes et sous la caisse. Les pièces d’énergie extérieures utilisent leur vue extérieure correspondante.')
      :t('Power System selected. Use Interior/underbody for hidden components, then side or top views for external ones.','Système d’énergie sélectionné. Utilise Intérieur/sous la caisse pour les composants cachés, puis les vues latérale ou dessus pour les pièces extérieures.');
  }else if(activeMode==='safety'){
    msg=vehicleUnderAccess()
      ?t('Safety access: fit the seat belts, airbags, safety camera, warning control and emergency stop inside the cabin.','Accès sécurité : place les ceintures, airbags, caméra de sécurité, commande d’alerte et arrêt d’urgence dans l’habitacle.')
      :t('Safety stage: use Front, Rear and Side views for collision sensors and indicators; use Interior for cabin protection.','Étape sécurité : utilise les vues Avant, Arrière et Latérales pour les capteurs et clignotants ; utilise Intérieur pour la protection de l’habitacle.');
  }else if(activeMode==='future'&&vehicleFutureAbility){
    msg=vehicleUnderAccess()
      ?t('Future Tech access: fit the hidden wheel-retraction or amphibious components underneath the same car.','Accès technologie future : place sous la même voiture les mécanismes cachés de roues rétractables ou de coque amphibie.')
      :vehicleFutureAbility==='flight'
        ?t('Flying Car selected. Use Top for wings or drone lift, Rear for propellers/jets, and Interior for retractable-wheel mechanisms.','Voiture volante sélectionnée. Utilise Dessus pour les ailes ou rotors, Arrière pour les hélices/réacteurs et Intérieur pour les mécanismes de roues rétractables.')
        :t('Water / Amphibious selected. Use Interior for the hull and retractable wheels, then Rear for water jets and stabilisers.','Aquatique / amphibie sélectionné. Utilise Intérieur pour la coque et les roues rétractables, puis Arrière pour les propulseurs aquatiques et stabilisateurs.');
  }else{
    msg=vehicleUnderAccess()
      ?t('Fit the interior pieces from underneath. Fitted pieces lock permanently into the car.','Fixe les pièces intérieures par dessous. Les pièces fixées se verrouillent définitivement dans la voiture.')
      :t('Drag the car to rotate it freely. Fitted pieces stay attached while you turn it.','Fais glisser la voiture pour la tourner librement. Les pièces fixées restent attachées pendant la rotation.');
  }
  tctx.fillText(msg,400,425);
  tctx.restore();
  syncInstalledVehicleParts();
}
function renderTemplate(id){
  tctx.clearRect(0,0,templateCanvas.width,templateCanvas.height);
  if(!templateOn&&!(id==='vehicle'&&vehicleRevealActive))return;
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
  if(changed){[...objectLayer.children].filter(o=>o.dataset.kind==='part').forEach(o=>o.remove());selectObject(null);vehiclePowertrain='';vehicleHybridType='self';vehicleFutureAbility='';vehicleFlightSystem='';}
  currentLibraryId=item.id;vehicleYaw=0;vehiclePitch=.10;vehicleViewMode='left';renderTemplate('vehicle');refreshLibraryCards();updateVehicleViewUI();renderModes(missions[active],activeMode);commitHistory();return
}currentLibraryId=item.id;const existing=[...objectLayer.children].find(o=>o.dataset.kind==='blueprint'&&o.dataset.blueprintId===item.id);if(existing){selectObject(existing);renderModes(missions[active],activeMode);return}const count=[...objectLayer.children].filter(o=>o.dataset.kind==='blueprint').length;const x=.30+((count%3)*.22),y=.30+(Math.floor(count/3)*.28);addBlueprint(item,clamp(x,.18,.82),clamp(y,.22,.78),active==='robot'?180:310,0,{commit:true,select:true});renderModes(missions[active],null);refreshLibraryCards();}

function renderModes(m,preferred){const modes=modesForMission(m);if(!modes.length)return;activeMode=(preferred&&modes.some(x=>x.id===preferred))?preferred:(activeMode&&modes.some(x=>x.id===activeMode)?activeMode:modes[0].id);const host=$('creatorModes');host.innerHTML='';modes.forEach(md=>{const b=document.createElement('button');b.type='button';b.className='creator-mode'+(md.id===activeMode?' active':'');b.innerHTML=`<span>${md.icon}</span><b>${L(md.label)}</b><small>${L(md.help)}</small>`;b.onclick=()=>{activeMode=md.id;renderModes(m,activeMode);commitHistory()};host.appendChild(b)});const selected=modes.find(x=>x.id===activeMode);$('creatorModeHelp').textContent=L(selected.help);renderComponents(selected);}
function vehicleAllPuzzleSlots(){return[...vehicleSlotDefinitions(),...vehicleInteriorSlots(),...vehiclePowerSlots(),...vehicleSafetySlots(),...vehicleFutureSlots()];}
function vehicleModePartIds(){const md=modesForMission(missions.vehicle).find(x=>x.id===activeMode);return new Set((md?.parts||[]).map(x=>x.id));}
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
function renderComponents(md){
  const host=$('creatorComponents');
  if(active==='vehicle'&&md.id==='power'){
    host.innerHTML=`<div class="creator-palette-title"><b>${t('Choose the vehicle power system','Choisis le système d’énergie du véhicule')}</b><small>${t('Petrol, Diesel, Electric and Hybrid are alternative engineering choices — not four engines to install together.','Essence, Diesel, Électrique et Hybride sont des choix techniques différents — pas quatre moteurs à installer ensemble.')}</small></div>`;
    VEHICLE_POWERTRAINS.forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='creator-component';if(vehiclePowertrain===choice.id){b.style.borderColor='rgba(93,228,255,.85)';b.style.background='rgba(93,228,255,.14)';}b.innerHTML=`<span>${choice.icon}</span><small>${L(choice.label)}</small>`;b.onclick=()=>selectVehiclePowertrain(choice.id);host.appendChild(b)});
    if(!vehiclePowertrain){const note=document.createElement('div');note.className='creator-palette-title';note.innerHTML=`<small>${t('Choose one system first. The correct components and fitting locations will then appear for this same car.','Choisis d’abord un système. Les bons composants et leurs emplacements apparaîtront ensuite pour cette même voiture.')}</small>`;host.appendChild(note);return;}
    const summary=document.createElement('div');summary.className='creator-palette-title';summary.innerHTML=`<b>${t('Selected','Sélectionné')}: ${vehiclePowertrainLabel()}</b><small>${t('Internal and underbody parts fit from underneath. Exterior parts such as the charge port use the appropriate outside view.','Les pièces internes et sous la caisse se placent par dessous. Les pièces extérieures comme la prise de recharge utilisent la vue extérieure adaptée.')}</small>`;host.appendChild(summary);
    if(vehiclePowertrain==='hybrid'){
      const subTitle=document.createElement('div');subTitle.className='creator-palette-title';subTitle.innerHTML=`<b>${t('Choose hybrid type','Choisis le type d’hybride')}</b><small>${t('Self-charging has no plug; plug-in hybrid adds a charge port.','L’hybride auto-rechargeable n’a pas de prise ; l’hybride rechargeable ajoute une prise de recharge.')}</small>`;host.appendChild(subTitle);
      [['self','♻️',t('Self-charging hybrid','Hybride auto-rechargeable')],['plugin','🔌',t('Plug-in hybrid','Hybride rechargeable')]].forEach(([id,icon,label])=>{const b=document.createElement('button');b.type='button';b.className='creator-component';if(vehicleHybridType===id){b.style.borderColor='rgba(93,228,255,.85)';b.style.background='rgba(93,228,255,.14)';}b.innerHTML=`<span>${icon}</span><small>${label}</small>`;b.onclick=()=>selectVehicleHybridType(id);host.appendChild(b)});
    }
    const ids=new Set(vehiclePowerPartIdsForSelection());
    const config=vehiclePowerConfig();
    const reqTitle=document.createElement('div');reqTitle.className='creator-palette-title';reqTitle.innerHTML=`<b>${t('Required power components','Composants d’énergie requis')}</b><small>${t('Fit every required piece into its matching blueprint slot.','Place chaque pièce requise dans son emplacement correspondant du plan.')}</small>`;host.appendChild(reqTitle);
    (md.parts||[]).filter(p=>ids.has(p.id)&&config.required.includes(p.id)).forEach(p=>appendVehiclePartButton(host,p));
    const optional=(md.parts||[]).filter(p=>ids.has(p.id)&&config.optional.includes(p.id));
    if(optional.length){const optTitle=document.createElement('div');optTitle.className='creator-palette-title';optTitle.innerHTML=`<b>${t('Optional efficiency upgrade','Amélioration d’efficacité facultative')}</b><small>${t('Optional pieces do not block Power System completion.','Les pièces facultatives ne bloquent pas la fin du système d’énergie.')}</small>`;host.appendChild(optTitle);optional.forEach(p=>appendVehiclePartButton(host,p));}
    const change=document.createElement('button');change.type='button';change.className='creator-component';change.innerHTML=`<span>↺</span><small>${t('Change power system','Changer le système d’énergie')}</small>`;change.onclick=resetVehiclePowerSystem;host.appendChild(change);refreshVehicleComponentButtons();return;
  }
  if(active==='vehicle'&&md.id==='future'){
    host.innerHTML=`<div class="creator-palette-title"><b>${t('Choose the final Future Tech ability','Choisis la capacité finale de technologie future')}</b><small>${t('Choose one path for this same completed car: make it fly or make it travel on water.','Choisis une seule voie pour cette même voiture terminée : fais-la voler ou naviguer sur l’eau.')}</small></div>`;
    VEHICLE_FUTURE_ABILITIES.forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='creator-component';if(vehicleFutureAbility===choice.id){b.style.borderColor='rgba(93,228,255,.85)';b.style.background='rgba(93,228,255,.14)';}b.innerHTML=`<span>${choice.icon}</span><small>${L(choice.label)}</small>`;b.onclick=()=>selectVehicleFutureAbility(choice.id);host.appendChild(b)});
    if(!vehicleFutureAbility){const note=document.createElement('div');note.className='creator-palette-title';note.innerHTML=`<small>${t('Choose Flying Car or Water / Amphibious Car. Only the technology required for that ability will appear.','Choisis Voiture volante ou Voiture aquatique / amphibie. Seule la technologie nécessaire à cette capacité apparaîtra.')}</small>`;host.appendChild(note);return;}
    const summary=document.createElement('div');summary.className='creator-palette-title';summary.innerHTML=`<b>${t('Selected','Sélectionné')}: ${vehicleFutureAbilityLabel()}</b><small>${vehicleFutureAbility==='flight'?t('The same road car will gain flight hardware.','La même voiture routière recevra des équipements de vol.'):t('The same road car will gain a sealed hull and water propulsion.','La même voiture routière recevra une coque étanche et une propulsion aquatique.')}</small>`;host.appendChild(summary);
    if(vehicleFutureAbility==='flight'){
      const subTitle=document.createElement('div');subTitle.className='creator-palette-title';subTitle.innerHTML=`<b>${t('How should it fly?','Comment doit-elle voler ?')}</b><small>${t('Choose one propulsion method. Do not install propellers, jets and drone rotors together.','Choisis une seule méthode de propulsion. N’installe pas ensemble hélices, réacteurs et rotors de drone.')}</small>`;host.appendChild(subTitle);
      VEHICLE_FLIGHT_SYSTEMS.forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='creator-component';if(vehicleFlightSystem===choice.id){b.style.borderColor='rgba(93,228,255,.85)';b.style.background='rgba(93,228,255,.14)';}b.innerHTML=`<span>${choice.icon}</span><small>${L(choice.label)}</small>`;b.onclick=()=>selectVehicleFlightSystem(choice.id);host.appendChild(b)});
      if(!vehicleFlightSystem){const note=document.createElement('div');note.className='creator-palette-title';note.innerHTML=`<small>${t('Choose the flight system first. Then the exact puzzle pieces and slots will appear.','Choisis d’abord le système de vol. Ensuite les pièces exactes du puzzle et leurs emplacements apparaîtront.')}</small>`;host.appendChild(note);return;}
      const flight=document.createElement('div');flight.className='creator-palette-title';flight.innerHTML=`<b>${t('Flight system','Système de vol')}: ${vehicleFlightSystemLabel()}</b><small>${t('Use Top, Rear and Interior/underbody views to install the complete flight system.','Utilise les vues Dessus, Arrière et Intérieur/sous la caisse pour installer le système de vol complet.')}</small>`;host.appendChild(flight);
    }
    const ids=new Set(vehicleFuturePartIdsForSelection());
    const config=vehicleFutureConfig();
    const reqTitle=document.createElement('div');reqTitle.className='creator-palette-title';reqTitle.innerHTML=`<b>${t('Required Future Tech components','Composants de technologie future requis')}</b><small>${t('Fit every required copy into its matching blueprint slot. A button locks only when all copies are installed.','Place chaque exemplaire requis dans son emplacement correspondant. Un bouton se verrouille seulement quand tous les exemplaires sont installés.')}</small>`;host.appendChild(reqTitle);
    (md.parts||[]).filter(p=>ids.has(p.id)&&config.required.includes(p.id)).forEach(p=>appendVehiclePartButton(host,p));
    const change=document.createElement('button');change.type='button';change.className='creator-component';change.innerHTML=`<span>↺</span><small>${t('Change Future Tech','Changer la technologie future')}</small>`;change.onclick=resetVehicleFutureSystem;host.appendChild(change);refreshVehicleComponentButtons();return;
  }
  host.innerHTML=`<div class="creator-palette-title"><b>${t('Parts for','Pièces pour')} ${L(md.label)}</b><small>${t('Choose the matching puzzle piece. When every required copy is fitted, its button locks.','Choisis la pièce de puzzle correspondante. Quand tous les exemplaires requis sont fixés, son bouton se verrouille.')}</small></div>`;(md.parts||[]).forEach(p=>appendVehiclePartButton(host,p));refreshVehicleComponentButtons();
}
function appendVehiclePartButton(host,p){const b=document.createElement('button');b.type='button';b.className='creator-component';b.dataset.partId=p.id;const need=active==='vehicle'?vehiclePartRequirement(p.id):0,done=active==='vehicle'?vehicleInstalledPartCount(p.id):0;b.innerHTML=`<span>${paletteVisual(p)}</span><small>${L(p.label)}${need?` <em data-part-counter>${done}/${need}</em>`:''}</small>`;b.onclick=()=>addPalettePart(p);host.appendChild(b);}
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
  if(['dashboard','driver-seat','seat','belt','battery','camera','indicator','safety-light','petrol-engine','diesel-engine','inverter','fuel-tank','exhaust','radiator','dpf','solar','wing','jet','amphibious','stabiliser','future-sensor'].includes(id)){
    const pts=vehiclePartShape(id).map(([a,b])=>`${(60+a*52).toFixed(1)},${(40+b*31).toFixed(1)}`).join(' ');
    const fills={dashboard:'#475766','driver-seat':'#596a79',seat:'#596a79',belt:'#d9e4ed',battery:'#55d99a',camera:'#4abeE0',indicator:'#ffae36','safety-light':'#ed5968','petrol-engine':'#aeb8c2','diesel-engine':'#929eaa',inverter:'#55d99a','fuel-tank':'#b89b70',exhaust:'#9b8261',radiator:'#b7c2cb',dpf:'#a8b2bc',solar:'#418bd5',wing:'#7c7eff',jet:'#a770ff',amphibious:'#40b1e8',stabiliser:'#7c7eff','future-sensor':'#47e5de'};
    return `<svg ${common}><polygon points="${pts}" fill="${fills[id]||'#596a79'}" stroke="#e5edf3" stroke-width="4" stroke-linejoin="round"/></svg>`;
  }
  if(id==='electric-motor')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#55d99a" stroke="#e5fff2" stroke-width="5"/><circle cx="50" cy="50" r="14" fill="#294b42"/><path d="M50 13v17M50 70v17M13 50h17M70 50h17" stroke="#e5fff2" stroke-width="5" stroke-linecap="round"/></svg>`;
  if(id==='charge-port')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="#55d99a" stroke="#e5fff2" stroke-width="5"/><circle cx="40" cy="43" r="5" fill="#27483f"/><circle cx="60" cy="43" r="5" fill="#27483f"/><rect x="43" y="57" width="14" height="18" rx="5" fill="#27483f"/></svg>`;
  if(id==='propeller')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#a770ff" stroke="#f2e6ff" stroke-width="5"/><circle cx="50" cy="50" r="8" fill="#3f2f56"/><path d="M50 50C33 41 27 25 35 18c10 2 17 16 15 32M50 50c9-17 25-23 32-15-2 10-16 17-32 15M50 50c17 9 23 25 15 32-10-2-17-16-15-32M50 50c-9 17-25 23-32 15 2-10 16-17 32-15" fill="#eadcff"/></svg>`;
  if(id==='water-jet')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#40b1e8" stroke="#dcf8ff" stroke-width="5"/><path d="M25 50h50M58 34l18 16-18 16" fill="none" stroke="#e8fbff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if(id==='retract-wheel')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#708091" stroke="#eef6fc" stroke-width="5"/><circle cx="50" cy="50" r="19" fill="none" stroke="#273440" stroke-width="8"/><path d="M50 16v17M39 27l11-11 11 11" fill="none" stroke="#eef6fc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  if(id==='drone-lift')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="39" fill="#a770ff" stroke="#f2e6ff" stroke-width="5"/><circle cx="50" cy="50" r="9" fill="#3f2f56"/><path d="M50 21v58M21 50h58M30 30l40 40M70 30L30 70" stroke="#eadcff" stroke-width="6" stroke-linecap="round"/></svg>`;
  if(id==='steering')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="37" fill="none" stroke="#dce6ee" stroke-width="8"/><circle cx="50" cy="50" r="12" fill="#455666"/><path d="M50 50L25 27M50 50l25-23M50 50v35" stroke="#65798a" stroke-width="7"/></svg>`;
  if(id==='sensor')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="37" fill="#4abee0" stroke="#dcfaff" stroke-width="5"/><circle cx="50" cy="50" r="10" fill="#173e4c"/><path d="M50 18a32 32 0 0 1 0 64M50 29a21 21 0 0 1 0 42" fill="none" stroke="#dcfaff" stroke-width="5" stroke-linecap="round"/></svg>`;
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
  if(vehicleRevealActive){clearVehicleProjectedStyle(el);el.style.opacity='0';el.style.pointerEvents='none';return;}
  const key=el.dataset.targetKey,sl=vehicleAllPuzzleSlots().find(x=>x.key===key);
  if(!sl){el.style.opacity='0';return}
  const pr=vehicleSlotProjection(sl);
  if(!pr){el.style.opacity='0';return}
  el.style.pointerEvents='none';
  if(sl.partId==='wheel'){
    el.style.opacity=vehicleRevealActive?String(Math.max(0,1-vehicleRevealEase(.28,.68))):(pr.visible?'1':'0.08');
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
      const hasInterior=[...vehicleInteriorSlots(),...vehiclePowerSlots(),...vehicleSafetySlots(),...vehicleFutureSlots()].some(s=>s.partId===el.dataset.partId&&s.view==='interior');
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
      const fitted=installedVehicleKeys().size,total=vehicleAllPuzzleSlots().filter(x=>x.required).length;
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
function vehicleBodyProgress(){
  const used=installedVehicleKeys(),req=[...vehicleSlotDefinitions(),...vehicleInteriorSlots()].filter(x=>x.required);
  return{done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function vehiclePowerProgress(){
  const used=installedVehicleKeys(),req=vehiclePowerSlots().filter(x=>x.required);
  return{chosen:!!vehiclePowertrain,done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function vehicleSafetyProgress(){
  const used=installedVehicleKeys(),req=vehicleSafetySlots().filter(x=>x.required);
  return{done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function vehicleFutureProgress(){
  const used=installedVehicleKeys(),req=vehicleFutureSlots().filter(x=>x.required);
  const ready=vehicleFutureAbility!=='flight'||!!vehicleFlightSystem;
  return{chosen:!!vehicleFutureAbility,ready,done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function vehiclePuzzleProgress(){
  const body=vehicleBodyProgress(),power=vehiclePowerProgress(),safety=vehicleSafetyProgress(),future=vehicleFutureProgress();
  return{done:body.done+power.done+safety.done+future.done,total:body.total+power.total+safety.total+future.total,body,power,safety,future};
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
function snapshot(){return{drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePowertrain,vehicleHybridType,vehicleFutureAbility,vehicleFlightSystem};}
function resetHistory(){history=[snapshot()];historyIndex=0;updateHistoryButtons();}
function commitHistory(){if(restoring||!active)return;history=history.slice(0,historyIndex+1);history.push(snapshot());if(history.length>50)history.shift();historyIndex=history.length-1;updateHistoryButtons();}
function updateHistoryButtons(){$('undoDraw').disabled=historyIndex<=0;$('redoDraw').disabled=historyIndex<0||historyIndex>=history.length-1;}
function restoreDrawing(data,cb){ctx.clearRect(0,0,canvas.width,canvas.height);if(!data){cb?.();return}const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);cb?.()};img.onerror=()=>cb?.();img.src=data;}
function restoreSnapshot(s){restoring=true;templateOn=s.templateOn!==false;gridOn=!!s.gridOn;activeMode=s.activeMode;currentLibraryId=s.currentLibraryId;vehicleYaw=Number.isFinite(s.vehicleYaw)?s.vehicleYaw:vehicleYaw;vehiclePitch=Number.isFinite(s.vehiclePitch)?s.vehiclePitch:vehiclePitch;vehicleViewMode=s.vehicleViewMode||vehicleViewMode;vehiclePowertrain=s.vehiclePowertrain||'';vehicleHybridType=s.vehicleHybridType||'self';vehicleFutureAbility=s.vehicleFutureAbility||'';vehicleFlightSystem=s.vehicleFlightSystem||'';stage.classList.toggle('show-grid',gridOn);updateBlueprintVisibility();renderTemplate(active);updateVehicleViewUI();renderModes(missions[active],activeMode);restoreDrawing(s.drawing,()=>{restoreObjects(s.objects);restoring=false;updateHistoryButtons()});}

function openMission(id){const m=missions[id];if(!m)return;stopTest(false);active=id;activeMode=null;currentLibraryId=m.library?.[0]?.id||null;drawStrokes=0;selectedObject=null;ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';simulation.innerHTML='';$('creatorTestResult').innerHTML='';$('creatorTitle').textContent=L(m.title);$('creatorPrompt').textContent=L(m.prompt);$('creatorSteps').innerHTML=[t('Choose a blueprint if this mission offers one','Choisis un plan si la mission en propose un'),t('Choose a design mode and load the matching small parts','Choisis un mode et charge les petites pièces correspondantes'),t('Draw, arrange, resize, rotate and combine pieces','Dessine, organise, redimensionne, tourne et combine les pièces'),t('Test, stop, improve and test again','Teste, arrête, améliore puis reteste')].map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('');let saved=loadStore()[id]||{};if(id==='vehicle'&&saved.vehiclePuzzleVersion!==VEHICLE_PUZZLE_VERSION){saved={plan:saved.plan||[],notes:saved.notes||'',templateOn:true,gridOn:!!saved.gridOn,currentLibraryId:saved.currentLibraryId||currentLibraryId,vehicleYaw:0,vehiclePitch:.06,vehicleViewMode:'left',objects:[]};}templateOn=saved.templateOn!==false;gridOn=!!saved.gridOn;activeMode=saved.activeMode||null;currentLibraryId=saved.currentLibraryId||currentLibraryId;vehicleYaw=Number.isFinite(saved.vehicleYaw)?saved.vehicleYaw:0;vehiclePitch=Number.isFinite(saved.vehiclePitch)?saved.vehiclePitch:.10;vehicleViewMode=saved.vehicleViewMode||'left';vehiclePowertrain=id==='vehicle'?(saved.vehiclePowertrain||''):'';vehicleHybridType=id==='vehicle'?(saved.vehicleHybridType||'self'):'self';vehicleFutureAbility=id==='vehicle'?(saved.vehicleFutureAbility||''):'';vehicleFlightSystem=id==='vehicle'?(saved.vehicleFlightSystem||''):'';stage.classList.toggle('show-grid',gridOn);renderTemplate(id);updateBlueprintVisibility();updateVehicleViewUI();$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');renderLibrary(m);renderModes(m,activeMode);renderPlan(m,saved);$('creatorCoach').textContent=L(m.coach);$('creatorSaved').textContent=saved.updatedAt?t('Saved project restored. Keep creating.','Projet enregistré restauré. Continue à créer.'):'';$('creatorWorkspace').hidden=false;restoreDrawing(saved.drawing,()=>{restoreObjects(saved.objects||[]);drawStrokes=saved.drawing?3:0;renderLibrary(m);renderModes(m,activeMode);resetHistory();$('creatorWorkspace').scrollIntoView({behavior:'smooth',block:'start'})});}

function save(){if(!active)return;const all=loadStore();const plan=[...document.querySelectorAll('#creatorPlanFields [data-plan]')].map(i=>i.value.trim());all[active]={plan,notes:$('creatorNotes').value.trim(),drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePowertrain:active==='vehicle'?vehiclePowertrain:undefined,vehicleHybridType:active==='vehicle'?vehicleHybridType:undefined,vehicleFutureAbility:active==='vehicle'?vehicleFutureAbility:undefined,vehicleFlightSystem:active==='vehicle'?vehicleFlightSystem:undefined,vehiclePuzzleVersion:active==='vehicle'?VEHICLE_PUZZLE_VERSION:undefined,updatedAt:Date.now()};try{saveStore(all);$('creatorSaved').textContent=t('✅ Project saved. You can return and continue later.','✅ Projet enregistré. Tu peux revenir plus tard.')}catch(_){$('creatorSaved').textContent=t('This design is too large to save on this device.','Ce design est trop volumineux pour cet appareil.')}window.CWState?.setProgress?.('creator',Math.min(95,Object.keys(all).length*16),{lastMission:active});window.CWState?.logActivity?.({id:'creator-'+active,title:`Creator Studio: ${missions[active].title[0]}`,icon:'🎨',detail:'Saved interactive design',href:'creator.html'});}
function clearProjectNow(){stopTest(false);ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';drawStrokes=0;selectObject(null);if(active==='vehicle'){vehiclePowertrain='';vehicleHybridType='self';vehicleFutureAbility='';vehicleFlightSystem='';}const all=loadStore();delete all[active];saveStore(all);$('creatorNotes').value='';document.querySelectorAll('#creatorPlanFields input').forEach(i=>i.value='');$('creatorSaved').textContent=t('Project cleared. Start a new design.','Projet effacé. Commence un nouveau design.');$('creatorTestResult').innerHTML='';renderLibrary(missions[active]);resetHistory();closeClearDialog();}
function openClearDialog(){$('creatorClearDialog').hidden=false;document.body.classList.add('creator-dialog-open');setTimeout(()=>$('keepProject').focus(),0)}
function closeClearDialog(){$('creatorClearDialog').hidden=true;document.body.classList.remove('creator-dialog-open')}

function testTags(){const set=new Set();[...objectLayer.children].forEach(o=>{if(o.dataset.kind==='part')objectTags(o).forEach(tag=>set.add(tag))});return set;}
function addTestClasses(){[...objectLayer.children].forEach(o=>{const tags=objectTags(o);if(tags.includes('wheel'))o.classList.add('test-wheel');if(active==='vehicle'&&tags.includes('flight')&&o.dataset.partId.includes('wing'))o.classList.add('test-wing');if(active==='room'&&tags.includes('light'))o.classList.add('test-light')});}
function clearTestClasses(){[...objectLayer.children].forEach(o=>o.classList.remove('test-wheel','test-wing','test-water-wheel','test-light'));buildLayer.classList.remove('test-road','test-water','test-fly','test-robot');}
function setVehicleRevealWheelOpacity(alpha,glow=0){
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.installed==='1'&&o.dataset.partId==='wheel').forEach(o=>{
    o.style.opacity=String(alpha);o.style.filter=glow?`drop-shadow(0 0 ${Math.round(4+glow*14)}px rgba(92,235,255,.95))`:'';
  });
}
function safeVehicleRender(){
  try{renderTemplate('vehicle')}catch(err){console.error('Vehicle reveal render error',err)}
}
function resetVehiclePhaseOneReveal(){
  if(vehicleRevealRAF)cancelAnimationFrame(vehicleRevealRAF);
  if(vehiclePhase2RAF)cancelAnimationFrame(vehiclePhase2RAF);
  if(vehiclePaintRAF)cancelAnimationFrame(vehiclePaintRAF);
  if(vehiclePhase3RAF)cancelAnimationFrame(vehiclePhase3RAF);
  if(vehicleRevealTimer)clearInterval(vehicleRevealTimer);
  if(vehiclePhase2Timer)clearInterval(vehiclePhase2Timer);
  if(vehiclePhase3Timer)clearInterval(vehiclePhase3Timer);
  if(vehiclePaintTimer)clearInterval(vehiclePaintTimer);
  vehicleRevealRAF=vehiclePhase2RAF=vehiclePhase3RAF=vehiclePaintRAF=0;
  vehicleRevealTimer=vehiclePhase2Timer=vehiclePhase3Timer=vehiclePaintTimer=0;
  vehicleRevealActive=false;vehicleRevealProgress=0;vehicleRevealStart=0;vehicleRevealStage='idle';
  vehiclePhase2Progress=0;vehiclePhase2Start=0;vehiclePhase3Progress=0;vehiclePhase3Start=0;vehiclePaintMix=1;
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.installed==='1').forEach(o=>{o.style.filter='';});
  if(active==='vehicle'){syncInstalledVehicleParts();safeVehicleRender();}
}
const VEHICLE_PHASE2_COLOURS=[
  ['#5de4ff','Aqua'],['#377dff','Blue'],['#8d5cff','Purple'],['#ff4f6d','Red'],['#ff9b42','Orange'],['#ffd84d','Yellow'],['#4ed38a','Green'],['#f5f7fa','Pearl'],['#202a36','Midnight']
];
function animateVehiclePaintChange(next){
  if(!next||next===vehiclePaintColor)return;
  if(vehiclePaintRAF)cancelAnimationFrame(vehiclePaintRAF);
  if(vehiclePaintTimer)clearInterval(vehiclePaintTimer);
  vehiclePaintRAF=0;vehiclePaintTimer=0;
  vehiclePreviousPaintColor=vehiclePaintColor;vehiclePaintColor=next;vehiclePaintMix=0;
  const startAt=Date.now(),dur=950;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePaintTimer)clearInterval(vehiclePaintTimer);vehiclePaintTimer=0;return}
    vehiclePaintMix=clamp((Date.now()-startAt)/dur,0,1);
    safeVehicleRender();
    if(vehiclePaintMix>=1){clearInterval(vehiclePaintTimer);vehiclePaintTimer=0;vehiclePaintMix=1;safeVehicleRender();}
  };
  tick();vehiclePaintTimer=setInterval(tick,33);
}
function showVehiclePhase2ColourUI(){
  vehicleRevealStage='phase2-ready';vehiclePhase2Progress=1;renderTemplate('vehicle');
  const swatches=VEHICLE_PHASE2_COLOURS.map(([hex,name])=>`<button type="button" data-vehicle-paint="${hex}" title="${name}" aria-label="${name}" style="width:36px;height:36px;border-radius:50%;border:3px solid ${hex===vehiclePaintColor?'#fff':'rgba(255,255,255,.35)'};background:${hex};box-shadow:0 0 0 2px rgba(20,45,64,.55);cursor:pointer"></button>`).join('');
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>2</b><small>${t('PHASE','PHASE')}</small></div><div style="width:100%"><b>${t('Phase 2 — Finalise your car','Phase 2 — Finalise ta voiture')}</b><p>${t('The beauty reveal is complete. Try different paint colours before we move to the Test World.','La présentation est terminée. Essaie différentes couleurs avant de passer au Monde de test.')}</p><div id="vehiclePhase2Colours" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:12px 0">${swatches}</div><button type="button" id="vehicleConfirmPaint" style="padding:10px 16px;border:0;border-radius:999px;font-weight:800;cursor:pointer">${t('Use this colour','Utiliser cette couleur')}</button></div></div>`;
  $('creatorCoach').textContent=t('Choose any colour. The paint will sweep across the finished car. You can change it as many times as you want before confirming.','Choisis une couleur. La peinture balaiera la voiture finie. Tu peux la changer autant de fois que tu veux avant de confirmer.');
  document.querySelectorAll('[data-vehicle-paint]').forEach(b=>b.onclick=()=>{animateVehiclePaintChange(b.dataset.vehiclePaint);document.querySelectorAll('[data-vehicle-paint]').forEach(x=>x.style.borderColor=x===b?'#fff':'rgba(255,255,255,.35)')});
  const confirm=$('vehicleConfirmPaint');if(confirm)confirm.onclick=()=>{vehicleRevealStage='phase2-confirmed';safeVehicleRender();$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>✓</b><small>${t('PHASE 2','PHASE 2')}</small></div><div><b>${t('Colour confirmed','Couleur confirmée')}</b><p>${t('Your finished car is ready. Opening Phase 3 — Future Test World now.','Ta voiture finie est prête. Ouverture de la Phase 3 — Monde de test futur.')}</p></div></div>`;$('creatorCoach').textContent=t('Phase 2 complete. The finished car and paint colour are locked. Phase 3 is opening now.','Phase 2 terminée. La voiture finie et sa couleur sont verrouillées. La Phase 3 s’ouvre maintenant.');window.playTone?.(true);setTimeout(()=>{if(testRunning&&vehicleRevealActive)startVehiclePhaseThreeWorld()},700);};
  $('creatorTestResult').scrollIntoView?.({behavior:'smooth',block:'nearest'});
}
function startVehiclePhaseTwoReveal(){
  if(vehiclePhase2Timer)clearInterval(vehiclePhase2Timer);
  if(vehiclePhase2RAF)cancelAnimationFrame(vehiclePhase2RAF);
  vehiclePhase2RAF=0;vehiclePhase2Timer=0;
  vehicleRevealStage='phase2';vehiclePhase2Progress=0;vehiclePhase2Start=Date.now();
  vehiclePreviousPaintColor='#9fb0ba';vehiclePaintColor='#5de4ff';vehiclePaintMix=0;
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Phase 2 — Beauty reveal','Phase 2 — Présentation')}</b><p>${t('Paint, lights and the presentation camera are bringing your finished car to life.','La peinture, les feux et la caméra de présentation donnent vie à ta voiture finie.')}</p></div></div>`;
  $('creatorCoach').textContent=t('Phase 2 is running automatically. Watch the finished car receive its first paint and presentation pass.','La Phase 2 démarre automatiquement. Regarde la voiture finie recevoir sa première peinture et sa présentation.');
  const duration=5200;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePhase2Timer)clearInterval(vehiclePhase2Timer);vehiclePhase2Timer=0;return}
    vehiclePhase2Progress=clamp((Date.now()-vehiclePhase2Start)/duration,0,1);
    vehiclePaintMix=vehiclePhase2Progress;
    safeVehicleRender();
    if(vehiclePhase2Progress>=1){
      clearInterval(vehiclePhase2Timer);vehiclePhase2Timer=0;vehiclePaintMix=1;safeVehicleRender();
      showVehiclePhase2ColourUI();window.playTone?.(true);
    }
  };
  tick();vehiclePhase2Timer=setInterval(tick,33);
}

function drawRoundedPanel(x,y,w,h,r,fill='rgba(10,25,37,.72)',stroke='rgba(147,232,255,.28)'){
  tctx.beginPath();
  tctx.moveTo(x+r,y);
  tctx.lineTo(x+w-r,y);tctx.quadraticCurveTo(x+w,y,x+w,y+r);
  tctx.lineTo(x+w,y+h-r);tctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  tctx.lineTo(x+r,y+h);tctx.quadraticCurveTo(x,y+h,x,y+h-r);
  tctx.lineTo(x,y+r);tctx.quadraticCurveTo(x,y,x+r,y);
  tctx.closePath();
  tctx.fillStyle=fill;tctx.fill();
  tctx.strokeStyle=stroke;tctx.lineWidth=1.1;tctx.stroke();
}
function drawFutureWorldLabel(x,y,text){
  tctx.save();
  tctx.font='700 12px system-ui';
  const w=Math.max(64,tctx.measureText(text).width+18),h=24;
  drawRoundedPanel(x-w/2,y-h/2,w,h,10,'rgba(10,28,42,.78)','rgba(147,232,255,.24)');
  tctx.fillStyle='rgba(236,247,255,.95)';tctx.textAlign='center';tctx.textBaseline='middle';
  tctx.fillText(text,x,y+0.5);
  tctx.restore();
}
function drawFutureTree(x,baseY,s=1){
  tctx.save();tctx.translate(x,baseY);tctx.scale(s,s);
  tctx.fillStyle='#6f4f33';tctx.fillRect(-4,-24,8,24);
  tctx.beginPath();tctx.arc(0,-34,18,0,Math.PI*2);tctx.fillStyle='#5bd08a';tctx.fill();
  tctx.beginPath();tctx.arc(-13,-28,12,0,Math.PI*2);tctx.arc(13,-28,12,0,Math.PI*2);tctx.fill();
  tctx.restore();
}
function drawFutureBuilding(x,baseY,w,h,color='#415d7c',windows=4){
  tctx.save();
  tctx.fillStyle=color;tctx.fillRect(x,baseY-h,w,h);
  tctx.fillStyle='rgba(170,225,255,.30)';
  for(let r=0;r<Math.max(2,Math.floor(h/28));r++)for(let c=0;c<windows;c++)tctx.fillRect(x+10+c*((w-20)/Math.max(1,windows-1))-8,baseY-h+12+r*22,12,10);
  tctx.restore();
}
function drawFutureSupermarket(x,baseY){
  tctx.save();
  tctx.fillStyle='#8ea6c2';tctx.fillRect(x,baseY-66,108,66);
  tctx.fillStyle='#ff6f8a';tctx.fillRect(x+4,baseY-66,100,18);
  tctx.fillStyle='#f2f7fb';tctx.fillRect(x+10,baseY-38,84,28);
  tctx.fillStyle='#27435e';tctx.fillRect(x+40,baseY-26,18,16);
  tctx.font='700 12px system-ui';tctx.fillStyle='#fff';tctx.textAlign='center';tctx.fillText(t('Market','Marché'),x+54,baseY-52);
  tctx.restore();
}
function drawFutureStation(x,baseY,electric=false){
  tctx.save();
  tctx.fillStyle='#6f86a4';tctx.fillRect(x+6,baseY-52,70,52);
  tctx.fillStyle=electric?'#57e3ff':'#ffb85c';tctx.fillRect(x,baseY-70,82,14);
  tctx.fillStyle='rgba(238,246,255,.95)';tctx.fillRect(x+16,baseY-44,24,28);
  tctx.fillRect(x+46,baseY-44,18,28);
  tctx.strokeStyle='rgba(17,35,49,.95)';tctx.lineWidth=3;
  if(electric){tctx.beginPath();tctx.moveTo(x+27,baseY-40);tctx.lineTo(x+18,baseY-28);tctx.lineTo(x+26,baseY-28);tctx.lineTo(x+20,baseY-18);tctx.lineTo(x+33,baseY-32);tctx.lineTo(x+25,baseY-32);tctx.stroke();}
  else{tctx.strokeRect(x+20,baseY-41,16,24);tctx.beginPath();tctx.moveTo(x+36,baseY-36);tctx.lineTo(x+44,baseY-44);tctx.lineTo(x+47,baseY-34);tctx.stroke();}
  tctx.restore();
}
function drawFutureRoundabout(x,baseY){
  tctx.save();
  tctx.strokeStyle='rgba(210,236,255,.38)';tctx.lineWidth=8;tctx.beginPath();tctx.ellipse(x,baseY-18,46,16,0,0,Math.PI*2);tctx.stroke();
  tctx.fillStyle='#6ddc8f';tctx.beginPath();tctx.ellipse(x,baseY-18,24,9,0,0,Math.PI*2);tctx.fill();
  tctx.fillStyle='rgba(239,246,252,.92)';tctx.font='700 11px system-ui';tctx.textAlign='center';tctx.fillText(t('Roundabout','Rond-point'),x,baseY-42);
  tctx.restore();
}
function drawPhase3VehicleAt(cx,cy,scale,opts={}){
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,angle=opts.angle||0,flight=!!opts.flight,water=!!opts.water;
  const body=[[-255,26],[-218,-5],[-156,-22],[-99,-36],[-52,-90],[77,-89],[135,-39],[224,-21],[273,17],[255,50],[-208,55]];
  const upper=[[-99,-36],[-52,-90],[77,-89],[135,-39],[106,-33],[-74,-31]];
  const hood=[[-255,26],[-218,-5],[-99,-36],[-74,-31],[-156,11],[-224,38]];
  const rearDeck=[[106,-33],[135,-39],[224,-21],[273,17],[213,17],[148,-11]];
  const lower=[[-208,55],[255,50],[231,66],[-188,71]];
  const windscreen=[[-74,-39],[-46,-79],[-4,-79],[-3,-40]];
  const sideWindow=[[4,-79],[70,-76],[116,-40],[6,-40]];
  const rearQuarter=[[74,-73],[116,-40],[131,-38],[105,-65]];
  const paintDark=vehicleShade(paint,-72),paintLight=vehicleShade(paint,72);
  const path=pts=>{tctx.beginPath();pts.forEach((p,i)=>i?tctx.lineTo(p[0],p[1]):tctx.moveTo(p[0],p[1]));tctx.closePath();};
  tctx.save();tctx.translate(cx,cy);tctx.scale(scale,scale);tctx.rotate(angle);
  if(glow){tctx.shadowColor='rgba(91,230,255,.95)';tctx.shadowBlur=14+glow*18;}
  path(body);const g=tctx.createLinearGradient(-250,-90,255,55);g.addColorStop(0,paintLight);g.addColorStop(.36,paint);g.addColorStop(.72,paintDark);g.addColorStop(1,paint);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(224,244,250,.82)';tctx.lineWidth=2.2;tctx.stroke();
  path(lower);tctx.fillStyle='rgba(21,33,42,.96)';tctx.fill();
  [windscreen,sideWindow,rearQuarter].forEach(sh=>{path(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,'rgba(127,211,239,.72)');gg.addColorStop(.48,'rgba(26,66,90,.94)');gg.addColorStop(1,'rgba(7,26,42,.98)');tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle='rgba(224,248,255,.72)';tctx.lineWidth=1.5;tctx.stroke()});
  tctx.strokeStyle='rgba(12,32,44,.46)';tctx.lineWidth=1.6;tctx.beginPath();tctx.moveTo(6,-34);tctx.lineTo(8,39);tctx.lineTo(127,37);tctx.lineTo(131,-34);tctx.stroke();
  tctx.beginPath();tctx.moveTo(-98,-31);tctx.lineTo(-157,11);tctx.stroke();
  tctx.fillStyle=paintDark;tctx.beginPath();tctx.ellipse(-77,-32,10,5,-.25,0,Math.PI*2);tctx.fill();
  if(flight){
    tctx.globalAlpha=.78;path([[13,-10],[109,-11],[93,9],[25,11]]);tctx.fillStyle=paintDark;tctx.fill();tctx.globalAlpha=1;
    if(vehicleFlightSystem==='propeller'){[[205,15],[-130,18]].forEach(([px,py])=>{tctx.save();tctx.translate(px,py);tctx.rotate(wheelSpin*1.4);tctx.strokeStyle='rgba(223,246,255,.92)';tctx.lineWidth=3;for(let i=0;i<3;i++){tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(0,22);tctx.stroke();tctx.rotate(Math.PI*2/3)}tctx.restore()});}
    if(vehicleFlightSystem==='jet'){[[208,8],[228,16]].forEach(([jx,jy],i)=>{const fg=tctx.createLinearGradient(jx,jy,jx+34,jy);fg.addColorStop(0,'rgba(255,180,90,.0)');fg.addColorStop(.35,'rgba(255,180,90,.88)');fg.addColorStop(1,'rgba(255,98,64,.0)');tctx.fillStyle=fg;tctx.beginPath();tctx.moveTo(jx,jy-8);tctx.lineTo(jx+34,jy);tctx.lineTo(jx,jy+8);tctx.closePath();tctx.fill();});}
    if(vehicleFlightSystem==='drone'){[[-84,-92],[34,-108],[98,-86],[170,-18]].forEach(([rx,ry],i)=>{tctx.save();tctx.translate(rx,ry);tctx.rotate(wheelSpin*1.5);tctx.strokeStyle='rgba(238,248,255,.92)';tctx.lineWidth=2.8;tctx.beginPath();tctx.moveTo(-12,0);tctx.lineTo(12,0);tctx.moveTo(0,-12);tctx.lineTo(0,12);tctx.stroke();tctx.restore();});}
  }
  if(water){tctx.strokeStyle='rgba(83,225,240,.65)';tctx.lineWidth=4; tctx.beginPath();tctx.moveTo(-185,59);tctx.quadraticCurveTo(25,80,229,57);tctx.stroke();}
  [[-130,47],[178,40]].forEach(([wx,wy],i)=>{const r=34;tctx.save();tctx.translate(wx,wy);if(!(water&&opts.retractWheels)){tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#10161b';tctx.fill();tctx.beginPath();tctx.arc(0,0,r*.61,0,Math.PI*2);const rg=tctx.createRadialGradient(-r*.12,-r*.18,2,0,0,r*.62);rg.addColorStop(0,'#f8fbfd');rg.addColorStop(.45,'#b7c3ca');rg.addColorStop(1,'#40515b');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(245,250,252,.82)';tctx.lineWidth=1.5;for(let k=0;k<6;k++){const a=wheelSpin+(k*Math.PI/3);tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(Math.cos(a)*r*.49,Math.sin(a)*r*.49);tctx.stroke()}tctx.beginPath();tctx.arc(0,0,r*.13,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();}else{tctx.strokeStyle='rgba(225,244,252,.55)';tctx.lineWidth=3;tctx.strokeRect(-8,-8,16,16);}tctx.restore();});
  [[-234,16,'rgba(226,250,255,.98)'],[249,14,'rgba(255,67,86,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.shadowBlur=16;tctx.shadowColor=c;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,16,7,0,0,Math.PI*2);tctx.fill();tctx.restore()});
  tctx.restore();
}
function drawVehicleFutureTestWorld(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase3Progress,0,1),baseRoadY=338,route=1360,cam=p*route;
  tctx.save();
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#14354d');sky.addColorStop(.58,'#1e4667');sky.addColorStop(1,'#27455e');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  const haze=tctx.createLinearGradient(0,225,0,H);haze.addColorStop(0,'rgba(255,255,255,0)');haze.addColorStop(1,'rgba(140,210,255,.08)');tctx.fillStyle=haze;tctx.fillRect(0,0,W,H);
  tctx.fillStyle='rgba(255,230,153,.95)';tctx.beginPath();tctx.arc(702,70,26,0,Math.PI*2);tctx.fill();
  const cloud=(x,y,s)=>{tctx.save();tctx.translate(x,y);tctx.scale(s,s);tctx.fillStyle='rgba(244,249,255,.78)';[[0,0,22],[-18,6,14],[19,8,16]].forEach(([cx,cy,r])=>{tctx.beginPath();tctx.arc(cx,cy,r,0,Math.PI*2);tctx.fill()});tctx.fillRect(-24,0,48,16);tctx.restore();};
  cloud(120-cam*.08,82,1);cloud(314-cam*.05,58,.8);cloud(585-cam*.09,104,1.1);
  tctx.fillStyle='#24405a';tctx.beginPath();tctx.moveTo(0,245);tctx.quadraticCurveTo(140,184,264,228);tctx.quadraticCurveTo(390,178,545,216);tctx.quadraticCurveTo(650,189,800,236);tctx.lineTo(800,285);tctx.lineTo(0,285);tctx.closePath();tctx.fill();
  tctx.fillStyle='#2a5974';tctx.beginPath();tctx.moveTo(0,265);tctx.quadraticCurveTo(180,214,342,247);tctx.quadraticCurveTo(525,213,800,260);tctx.lineTo(800,300);tctx.lineTo(0,300);tctx.closePath();tctx.fill();
  const worldX=(x,speed=1)=>x-cam*speed;
  drawFutureBuilding(worldX(120,0.55),252,54,56,'#476585',3);drawFutureBuilding(worldX(188,0.55),252,68,88,'#3e5978',4);drawFutureBuilding(worldX(272,0.55),252,46,68,'#587493',2);
  drawFutureTree(worldX(92,0.8),294,.9);drawFutureTree(worldX(168,0.8),298,1.15);drawFutureTree(worldX(332,0.8),296,1.05);drawFutureTree(worldX(686,0.8),296,1.1);drawFutureTree(worldX(1058,0.8),296,1.1);
  drawFutureSupermarket(worldX(438),288);
  drawFutureStation(worldX(684),292,vehiclePowertrain==='electric');
  if(vehiclePowertrain==='hybrid'){drawFutureStation(worldX(784),300,true)}
  drawFutureRoundabout(worldX(958),322);
  drawFutureBuilding(worldX(1165),268,94,72,'#4d6886',5);
  const waterStart=worldX(1138),waterWidth=220;
  tctx.fillStyle='#30536f';tctx.fillRect(0,baseRoadY+10,W,H-baseRoadY-10);
  tctx.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<6;i++)tctx.fillRect((i*160-(cam*1.6)%120),baseRoadY+42,70,4);
  tctx.fillStyle='#3a6381';tctx.fillRect(0,baseRoadY-4,W,14);
  if(vehicleFutureAbility==='water'){
    tctx.fillStyle='#2f7fb2';tctx.fillRect(Math.max(0,waterStart),baseRoadY+6,Math.min(W-waterStart,waterWidth),H-(baseRoadY+6));
    tctx.strokeStyle='rgba(194,240,255,.45)';tctx.lineWidth=2;for(let i=0;i<5;i++){const yy=baseRoadY+26+i*22;tctx.beginPath();tctx.moveTo(Math.max(0,waterStart)+8,yy);tctx.quadraticCurveTo(worldX(1188)+36,yy+8,Math.min(W,worldX(1346)),yy);tctx.stroke();}
    tctx.fillStyle='#d1d9df';tctx.fillRect(Math.max(0,worldX(1104)),baseRoadY-4,40,10);tctx.fillRect(Math.max(0,worldX(1348)),baseRoadY-4,38,10);
  }
  drawFutureWorldLabel(worldX(486),210,t('Supermarket','Supermarché'));
  drawFutureWorldLabel(worldX(722),206,vehiclePowertrain==='electric'?t('EV Charge','Recharge EV'):t('Fuel stop','Station'));
  if(vehiclePowertrain==='hybrid')drawFutureWorldLabel(worldX(816),214,t('Hybrid option','Option hybride'));
  drawFutureWorldLabel(worldX(1168),204,t('Test Lab','Laboratoire'));
  if(vehicleFutureAbility==='water')drawFutureWorldLabel(worldX(1246),200,t('Water zone','Zone aquatique'));
  else if(vehicleFutureAbility==='flight')drawFutureWorldLabel(worldX(1186),204,t('Flight lane','Couloir aérien'));
  const seg2=clamp((p-.22)/.22,0,1),seg3=clamp((p-.72)/.28,0,1);
  let carX=220,carY=baseRoadY-28,carAngle=0,flightMode=false,waterMode=false,retractWheels=false;
  if(vehicleFutureAbility==='flight'&&p>.72){flightMode=true;carX=220+seg3*170;carY=baseRoadY-28-(Math.sin(seg3*Math.PI*.82)*110+seg3*34);carAngle=-.08-.26*seg3;}
  if(vehicleFutureAbility==='water'&&p>.72){waterMode=true;carX=220+seg3*112;carY=baseRoadY+8+Math.sin(seg3*Math.PI*2)*2;retractWheels=seg3>.2;}
  drawPhase3VehicleAt(carX,carY,.58,{paint:vehiclePaintColor,glow:.72,wheelSpin:p*8,angle:carAngle,flight:flightMode,water:waterMode,retractWheels});
  if(flightMode){cloud(468,94,.92);cloud(610,138,.74);}
  drawRoundedPanel(18,16,204,78,16,'rgba(8,25,36,.68)','rgba(147,232,255,.22)');
  tctx.fillStyle='rgba(235,247,255,.96)';tctx.textAlign='left';tctx.font='800 15px system-ui';tctx.fillText(t('Phase 3 — Future Test World','Phase 3 — Monde de test du futur'),32,40);
  tctx.font='600 12px system-ui';tctx.fillStyle='rgba(185,225,246,.92)';tctx.fillText(`${t('Power','Énergie')}: ${vehiclePowertrainLabel()}`,32,61);
  tctx.fillText(`${t('Future','Futur')}: ${vehicleFutureAbilityLabel()}${vehicleFutureAbility==='flight'&&vehicleFlightSystem?` · ${vehicleFlightSystemLabel()}`:''}`,32,79);
  drawRoundedPanel(572,18,210,48,14,'rgba(8,25,36,.62)','rgba(147,232,255,.18)');
  tctx.fillStyle='rgba(227,246,255,.94)';tctx.textAlign='center';tctx.font='700 12px system-ui';
  const status=vehicleFutureAbility==='flight'&&p>.72?t('Flight test active','Test de vol actif'):vehicleFutureAbility==='water'&&p>.72?t('Water test active','Test aquatique actif'):t('Road test active','Test routier actif');
  tctx.fillText(status,677,39);
  tctx.fillStyle='rgba(179,221,244,.88)';tctx.fillText(t('Roads • town • station • roundabout • special zone','Routes • ville • station • rond-point • zone spéciale'),677,56);
  tctx.restore();
}
function startVehiclePhaseThreeWorld(){
  if(vehiclePhase3Timer)clearInterval(vehiclePhase3Timer);
  if(vehiclePhase3RAF)cancelAnimationFrame(vehiclePhase3RAF);
  vehiclePhase3RAF=0;vehiclePhase3Timer=0;
  vehicleRevealStage='phase3';vehiclePhase3Progress=0;vehiclePhase3Start=Date.now();
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Phase 3 — Future Test World','Phase 3 — Monde de test du futur')}</b><p>${t('The finished car is leaving the reveal area and entering a living test world with roads, town landmarks and a special zone for its future ability.','La voiture finie quitte la zone de présentation et entre dans un monde de test vivant avec routes, repères urbains et zone spéciale pour sa capacité future.')}</p></div></div>`;
  $('creatorCoach').textContent=t('Watch the finished car drive through the town, pass the service area and use its future ability in the last zone.','Regarde la voiture finie traverser la ville, passer par la zone de service et utiliser sa capacité future dans la dernière zone.');
  const duration=12800;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePhase3Timer)clearInterval(vehiclePhase3Timer);vehiclePhase3Timer=0;return}
    vehiclePhase3Progress=clamp((Date.now()-vehiclePhase3Start)/duration,0,1);
    safeVehicleRender();
    if(vehiclePhase3Progress>=1){
      clearInterval(vehiclePhase3Timer);vehiclePhase3Timer=0;vehicleRevealStage='phase3-complete';vehiclePhase3Progress=1;safeVehicleRender();
      const futureSummary=vehicleFutureAbility==='flight'
        ?`${vehicleFlightSystemLabel()} ${t('flight test completed','terminé')}`
        :t('Amphibious water-zone test completed','Test de la zone aquatique amphibie terminé');
      $('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>✓</b><small>${t('PHASE 3','PHASE 3')}</small></div><div><b>${t('Future Test World complete','Monde de test terminé')}</b><p>${t('Your finished car has completed its town-road test, service-area pass and special future-ability zone.','Ta voiture finie a terminé son test sur route en ville, son passage par la zone de service et sa zone spéciale de capacité future.')}</p><ul><li class="pass">✓ ${vehiclePowertrainLabel()} ${t('power system tested in the world','testé dans le monde')}</li><li class="pass">✓ ${futureSummary}</li><li class="pass">✓ ${t('Paint colour stayed locked on the final car','La couleur est restée verrouillée sur la voiture finale')}</li></ul><p>${t('Phase 4 can build on this same finished car in the next update.','La Phase 4 pourra s’appuyer sur cette même voiture finie dans la prochaine mise à jour.')}</p></div></div>`;
      $('creatorCoach').textContent=t('Phase 3 complete. Stop the test to return to edit mode, or keep this result as the finished prototype flow so far.','Phase 3 terminée. Arrête le test pour revenir au mode édition, ou garde ce résultat comme flux prototype final pour le moment.');
      window.playTone?.(true);
    }
  };
  tick();vehiclePhase3Timer=setInterval(tick,33);
}
function startVehiclePhaseOneReveal(){
  stopTest(false);
  testRunning=true;vehicleRevealActive=true;vehicleRevealStage='phase1';vehicleRevealProgress=0;vehicleRevealStart=Date.now();
  vehiclePhase2Progress=0;vehiclePaintMix=1;
  /* The final presentation always starts from one clean canonical Sport Car view. */
  vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';updateVehicleViewUI();
  stage.classList.add('testing','test-active');$('stopCreationTest').hidden=false;selectObject(null);
  simulation.className='creator-simulation active';simulation.innerHTML='';
  syncInstalledVehicleParts();
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Phase 1 — Transformation running','Phase 1 — Transformation en cours')}</b><p>${t('The construction blueprint is merging into one clean finished Sport Car.','Le plan de construction fusionne pour devenir une voiture de sport finie et propre.')}</p></div></div>`;
  $('creatorCoach').textContent=t('Construction lines are energising, fitted pieces are merging, and all loose puzzle geometry is disappearing into the finished shell.','Les lignes de construction s’illuminent, les pièces fusionnent et toute géométrie de puzzle disparaît dans la carrosserie finie.');
  window.playTone?.(true);
  if(vehicleRevealTimer)clearInterval(vehicleRevealTimer);
  if(vehicleRevealRAF)cancelAnimationFrame(vehicleRevealRAF);
  vehicleRevealRAF=0;
  const duration=6500;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehicleRevealTimer)clearInterval(vehicleRevealTimer);vehicleRevealTimer=0;return}
    vehicleRevealProgress=clamp((Date.now()-vehicleRevealStart)/duration,0,1);
    safeVehicleRender();
    if(vehicleRevealProgress>=1){
      clearInterval(vehicleRevealTimer);vehicleRevealTimer=0;vehicleRevealProgress=1;safeVehicleRender();
      $('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>✓</b><small>${t('PHASE 1','PHASE 1')}</small></div><div><b>${t('Finished Sport Car formed','Voiture de sport finie')}</b><p>${t('The construction views are no longer used for the finished result. The car is now one complete shell with integrated glass, wheels and lights.','Les vues de construction ne sont plus utilisées pour le résultat fini. La voiture est désormais une carrosserie complète avec vitrage, roues et feux intégrés.')}</p></div></div>`;
      window.playTone?.(true);
      setTimeout(()=>{if(testRunning&&vehicleRevealActive)startVehiclePhaseTwoReveal()},700);
    }
  };
  tick();vehicleRevealTimer=setInterval(tick,33);
}
function startTest(){if(!active)return;
  if(active==='vehicle'){
    const body=vehicleBodyProgress(),power=vehiclePowerProgress(),safety=vehicleSafetyProgress(),future=vehicleFutureProgress();
    if(body.done<body.total){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Finish Body & Movement first','Termine d’abord Carrosserie et mouvement')}</b><p>${t(`${body.done} of ${body.total} required body pieces are fitted.`,`${body.done} pièces de carrosserie requises sur ${body.total} sont fixées.`)}</p></div>`;
      $('creatorCoach').textContent=t('Complete the main car puzzle before testing the power system.','Termine le puzzle principal de la voiture avant de tester le système d’énergie.');return;
    }
    if(!power.chosen){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Choose a Power System','Choisis un système d’énergie')}</b><p>${t('Body & Movement is complete. Now choose Petrol, Diesel, Electric or Hybrid and install its required components.','Carrosserie et mouvement est terminé. Choisis maintenant Essence, Diesel, Électrique ou Hybride et installe les composants requis.')}</p></div>`;
      $('creatorCoach').textContent=t('Open Power System and choose how this same car will be powered.','Ouvre Système d’énergie et choisis comment cette même voiture sera propulsée.');return;
    }
    if(power.done<power.total){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Finish the Power System','Termine le système d’énergie')}</b><p>${t(`${power.done} of ${power.total} required ${vehiclePowertrainLabel()} components are fitted.`,`${power.done} composants ${vehiclePowertrainLabel()} requis sur ${power.total} sont fixés.`)}</p></div>`;
      $('creatorCoach').textContent=t('Use the underbody/interior and exterior views to finish every required power component.','Utilise les vues sous la caisse/intérieure et extérieures pour terminer tous les composants d’énergie requis.');return;
    }
    if(safety.done<safety.total){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Finish the Safety stage','Termine l’étape Sécurité')}</b><p>${t(`${safety.done} of ${safety.total} required safety pieces are fitted.`,`${safety.done} pièces de sécurité requises sur ${safety.total} sont fixées.`)}</p></div>`;
      $('creatorCoach').textContent=t('Open Safety. Use Interior for cabin protection and Front, Rear or Side views for sensors and indicators.','Ouvre Sécurité. Utilise Intérieur pour la protection de l’habitacle et les vues Avant, Arrière ou Latérales pour les capteurs et clignotants.');return;
    }
    if(!future.chosen){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Choose the final Future Tech ability','Choisis la capacité finale de technologie future')}</b><p>${t('Body, Power and Safety are complete. Now choose Flying Car or Water / Amphibious Car and install its required technology.','Carrosserie, Énergie et Sécurité sont terminés. Choisis maintenant Voiture volante ou Voiture aquatique / amphibie et installe la technologie requise.')}</p></div>`;
      $('creatorCoach').textContent=t('Open Future Tech and choose the final ability for this same car.','Ouvre Technologie future et choisis la capacité finale de cette même voiture.');return;
    }
    if(!future.ready){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Choose how the car will fly','Choisis comment la voiture volera')}</b><p>${t('Select Propeller flight, Jet flight or Drone lift before fitting the flight components.','Choisis Vol par hélices, Vol par réacteurs ou Portance par rotors avant d’installer les composants de vol.')}</p></div>`;
      $('creatorCoach').textContent=t('Open Future Tech and choose one flight system.','Ouvre Technologie future et choisis un système de vol.');return;
    }
    if(future.done<future.total){
      $('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Finish the Future Tech stage','Termine l’étape Technologie future')}</b><p>${t(`${future.done} of ${future.total} required Future Tech pieces are fitted.`,`${future.done} pièces de technologie future requises sur ${future.total} sont fixées.`)}</p></div>`;
      $('creatorCoach').textContent=vehicleFutureAbility==='flight'?t('Use Top, Rear and Interior views to finish the flying-car hardware.','Utilise les vues Dessus, Arrière et Intérieur pour terminer les équipements de la voiture volante.'):t('Use Interior and Rear views to finish the amphibious system.','Utilise les vues Intérieur et Arrière pour terminer le système amphibie.');return;
    }
    vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';renderTemplate('vehicle');updateVehicleViewUI();
    startVehiclePhaseOneReveal();return;
  }
  const m=missions[active],objectCount=objectLayer.children.length,enough=drawStrokes>=1||objectCount>=2;if(!enough){$('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Needs more design work','Il faut encore travailler le design')}</b><p>${t('Add some drawing or at least two movable pieces before testing.','Ajoute un dessin ou au moins deux pièces avant de tester.')}</p></div>`;return}stopTest(false);testRunning=true;if(active==='vehicle')renderTemplate('vehicle');stage.classList.add('testing','test-active');$('stopCreationTest').hidden=false;selectObject(null);simulation.className='creator-simulation active';simulation.innerHTML='';addTestClasses();const tags=testTags();let special='';if(active==='vehicle'){const travel=Math.max(65,stage.clientWidth*.20);buildLayer.style.setProperty('--test-travel',travel+'px');if(tags.has('flight')){buildLayer.classList.add('test-fly');simulation.innerHTML='<span class="flight-cloud" style="top:18%">☁️</span><span class="flight-cloud">☁️</span>';special=t('Flying test: the completed vehicle lifts and flies because flight technology is installed.','Test de vol : le véhicule s’élève grâce aux technologies de vol.')}else if(tags.has('amphibious')){buildLayer.classList.add('test-water');simulation.innerHTML='<div class="water-test"></div>';[...objectLayer.children].filter(o=>objectTags(o).includes('wheel')).forEach(o=>{o.classList.remove('test-wheel');o.classList.add('test-water-wheel')});special=t('Water test: the environment changes to water and the wheels retract while the complete vehicle travels as one build.','Test aquatique : l’environnement devient aquatique et les roues se rétractent pendant que le véhicule complet avance.')}else{buildLayer.classList.add('test-road');special=t('Road test: the whole completed vehicle drives smoothly, pauses at each side, then reverses. The tyres rotate with the direction of travel.','Test routier : le véhicule complet roule en douceur, marque une pause à chaque côté puis repart. Les pneus tournent selon le sens.')}}else if(active==='room'){simulation.innerHTML='<div class="room-scan"></div>';special=roomCollisionReport();}else if(active==='park'){simulation.innerHTML='<span class="park-visitor" style="top:34%">🚶</span><span class="park-visitor">🧑‍🦽</span><span class="park-visitor">🧒</span>';special=t('Visitor simulation is running. Watch how people move through the park, then stop and improve the layout.','La simulation des visiteurs est en cours. Observe leurs déplacements puis arrête et améliore le parc.')}else if(active==='robot'){buildLayer.classList.add('test-robot');special=t('Robot systems test is running on the assembled design. This is the foundation for robot-specific movement tests in later upgrades.','Le test des systèmes fonctionne sur le robot assemblé.')}else if(active==='story'){simulation.innerHTML='<div class="story-frame"></div>';special=t('Story preview is running. Check whether the characters, setting and props communicate the scene clearly.','L’aperçu de l’histoire est en cours. Vérifie que personnages, décor et accessoires racontent clairement la scène.')}else if(active==='mars'){simulation.innerHTML='<div class="room-scan"></div>';special=t('Base systems scan is running. Check habitats, support systems, transport and connections.','Le contrôle de la base est en cours. Vérifie habitats, survie, transport et connexions.')}const checks=(m.checks||[]).map(([tag,label])=>({label,ok:tags.has(tag)||objectCount>=4}));let score=Math.min(100,40+objectCount*4+drawStrokes*5);$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${score}</b><small>/100</small></div><div><b>${t('Live test running','Test en direct')}</b><p>${special}</p>${checks.length?`<ul>${checks.map(c=>`<li class="${c.ok?'pass':'miss'}">${c.ok?'✓':'○'} ${c.label}</li>`).join('')}</ul>`:''}</div></div>`;$('creatorCoach').textContent=special;window.playTone?.(true);}
function stopTest(showMessage=true){if(!testRunning&&showMessage)return;if(vehicleRevealActive)resetVehiclePhaseOneReveal();testRunning=false;stage.classList.remove('testing','test-active');$('stopCreationTest').hidden=true;simulation.className='creator-simulation';simulation.innerHTML='';clearTestClasses();if(active==='vehicle')renderTemplate('vehicle');if(showMessage){$('creatorCoach').textContent=t('Test stopped. Adjust any part, resize it or add something new, then test again.','Test arrêté. Modifie une pièce, redimensionne-la ou ajoute un élément puis reteste.');$('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Test stopped — back to edit mode','Test arrêté — retour au mode édition')}</b><p>${t('Build → Test → Stop → Improve → Test again.','Construis → Teste → Arrête → Améliore → Reteste.')}</p></div></div>`;}}
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
