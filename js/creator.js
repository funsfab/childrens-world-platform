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
 lib('vehicle-sport','Sport Car',AS+'vehicle-sport-clean.svg','Low, fast performance coupe','vehicle'),
 lib('vehicle-suv','4×4 / SUV',AS+'vehicle-suv-clean.svg','Off-road and all-terrain vehicle','vehicle'),
 lib('vehicle-van','Van',AS+'vehicle-van-clean.svg','Passenger and cargo vehicle','vehicle'),
 lib('vehicle-coach','Intercity Coach / Bus',AS+'vehicle-coach-clean.svg','Long-distance passenger transport','vehicle'),
 lib('vehicle-tractor','Farm Tractor',AS+'vehicle-tractor-clean.svg','Multi-purpose precision agriculture machine','vehicle')
];

/* Keep all five vehicle previews warm in browser memory. The old implementation only
   created the <img> after a child selected a vehicle, which caused a visible blank pause
   on a cold load. SVG previews are also much smaller than the previous raster sources. */
const vehiclePreviewCache=[];
function preloadVehiclePreviews(){
  vehicleLibrary.forEach(v=>{
    const img=new Image();img.decoding='async';img.loading='eager';img.src=v.img;
    if(img.decode)img.decode().catch(()=>{});vehiclePreviewCache.push(img);
  });
}
preloadVehiclePreviews();



const roomLibrary=[
 lib('room-scandi','Scandinavian Light',AS+'room-scandi.webp','Bright wood, calm colours and natural light','room-style'),
 lib('room-luxury','Warm Modern Luxury',AS+'room-luxury.webp','Layered lighting, marble and elegant finishes','room-style'),
 lib('room-afro','Afro-Modern Warmth',AS+'room-afro.webp','Warm timber, woven texture and modern African influence','room-style'),
 lib('room-industrial','Urban Industrial Loft',AS+'room-industrial.webp','Dark metal, concrete and dramatic city lighting','room-style'),
 lib('room-smart','Smart Future Home',AS+'room-smart.webp','Integrated lighting, media and smart-home technology','room-style')
];
const ROOM_STYLE_MAP={
 'room-scandi':{wall:'#eee9df',floor:'#c7a77c',accent:'#8fa38b'},
 'room-luxury':{wall:'#d7c5ae',floor:'#8d684d',accent:'#c79753'},
 'room-afro':{wall:'#d7c1a4',floor:'#85583d',accent:'#b76835'},
 'room-industrial':{wall:'#5c5b58',floor:'#4a3a31',accent:'#d19b5e'},
 'room-smart':{wall:'#b9b4aa',floor:'#706c66',accent:'#5de4ff'}
};
const roomImageCache={};
roomLibrary.forEach(v=>{const img=new Image();img.decoding='async';img.src=v.img;img.onload=()=>{if(active==='room')renderTemplate('room')};roomImageCache[v.id]=img;});
const ROOM_COSTS={
 'room-wall':90,'room-door':180,'room-window':240,'divider':220,'rug':160,
 'sofa':650,'armchair':320,'coffee-table':220,'television':560,'tv-stand':280,'shelf':260,'plant':70,
 'dining-table':450,'dining-chair':140,'pendant':180,
 'kitchen-counter':420,'kitchen-sink':300,'hob':260,'oven':430,'fridge':680,'kitchen-cabinet':260,'kettle':55,
 'floor-lamp':145,'wall-art':95,'curtains':180,'mirror':140,'books':45,'cushion':35,
 'smart-speaker':120,'thermostat':160,'robot-vacuum':390,'smart-light':95,'laptop':520
};

const VEHICLE_CATALOG=[
 {id:'vehicle-sport',name:['Sport Car','Voiture de sport'],subtitle:['Low, fast performance coupe','Coupé bas et sportif'],available:true},
 {id:'vehicle-suv',name:['4×4 / SUV','4×4 / SUV'],subtitle:['Off-road and all-terrain vehicle','Véhicule tout-terrain'],available:true},
 {id:'vehicle-van',name:['Van','Fourgon / Van'],subtitle:['Passenger and cargo vehicle','Véhicule passagers et chargement'],available:true},
 {id:'vehicle-coach',name:['Intercity Coach / Bus','Autocar interurbain'],subtitle:['Long-distance passenger transport','Transport longue distance'],available:true},
 {id:'vehicle-tractor',name:['Farm Tractor','Tracteur agricole'],subtitle:['Multi-purpose precision agriculture machine','Machine agricole de précision multifonction'],available:true}
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
  part('rear-cargo-door','', 'Rear cargo door','Porte de chargement arrière',['movement','cargo'],'',{aspect:.82,defaultSize:92}),
  part('luggage-bay-door','▱', 'Lower luggage-bay door','Porte de soute à bagages',['movement','cargo'],'',{aspect:2.7,defaultSize:112}),
  part('coach-toilet','🚻', 'Coach toilet cabin','Cabine toilettes',['passenger','interior'],'',{aspect:.82,defaultSize:78}),
  part('route-display','▰', 'Destination / route display','Afficheur destination / itinéraire',['passenger','information'],'',{aspect:3.2,defaultSize:92}),
  part('front-attachment','▱','Front implement mount','Support d’outil avant',['movement','farm'],'',{aspect:2.1,defaultSize:82}),
  part('rear-hitch','⌁','Rear three-point hitch','Attelage arrière trois points',['movement','farm'],'',{aspect:1.5,defaultSize:74}),
  part('pto-shaft','⦿','PTO power shaft','Prise de force PTO',['power','farm'],'',{aspect:1,defaultSize:58}),
  part('hydraulic-coupler','≋','Hydraulic couplers','Raccords hydrauliques',['power','farm'],'',{aspect:1.8,defaultSize:72}),
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
  part('future-sensor','🔵','Future sensor','Capteur futuriste',['future','safety'],'',{aspect:1,defaultSize:52}),
  part('gps-receiver','◎','Precision GPS receiver','Récepteur GPS de précision',['future','farm'],'',{aspect:1,defaultSize:58}),
  part('soil-sensor','⌖','Soil sensor array','Réseau de capteurs du sol',['future','farm'],'',{aspect:1.2,defaultSize:60}),
  part('crop-camera','◉','Crop health camera','Caméra santé des cultures',['future','farm'],'',{aspect:1.4,defaultSize:64}),
  part('guidance-computer','▣','Autonomous guidance computer','Ordinateur de guidage autonome',['future','farm'],'',{aspect:1.45,defaultSize:74}),
  part('drone-dock','◇','Farm drone dock','Station d’accueil du drone agricole',['future','farm'],'',{aspect:1.6,defaultSize:78})
 ])
];

const roomModes=[
 mode('shell','🏠','Room shell & zones','Structure & zones','Set the room flow first: doors, windows, dividers and the main rug zone.','Commence par la circulation : portes, fenêtres, cloisons et zone du tapis.',[
  part('room-wall','▬','Wall / zone edge','Mur / limite de zone',['structure','collision-large'],'room-wall',{aspect:3.2,defaultSize:130}),
  part('room-door','🚪','Door','Porte',['structure','door'],'room-door',{aspect:.62,defaultSize:82}),
  part('room-window','🪟','Window','Fenêtre',['structure','light'],'room-window',{aspect:1.65,defaultSize:105}),
  part('divider','▰','Room divider','Cloison',['structure','collision-large'],'room-divider',{aspect:2.4,defaultSize:115}),
  part('rug','','Main rug','Tapis principal',['decor','zone'],'room-rug',{aspect:1.6,defaultSize:150})
 ]),
 mode('lounge','🛋️','Living zone','Salon','Build a comfortable entertainment zone with real seating, media and storage.','Crée une vraie zone détente avec assises, média et rangement.',[
  part('sofa','','Modern sofa','Canapé moderne',['furniture','comfort','collision-large'],'room-sofa',{aspect:2.4,defaultSize:145}),
  part('armchair','','Armchair','Fauteuil',['furniture','comfort','collision-large'],'room-armchair',{aspect:1.05,defaultSize:86}),
  part('coffee-table','','Coffee table','Table basse',['furniture','surface','collision-large'],'room-coffee',{aspect:1.55,defaultSize:105}),
  part('television','','Smart TV','Télévision connectée',['furniture','media','smart'],'room-tv',{aspect:1.75,defaultSize:125}),
  part('tv-stand','','Media unit','Meuble TV',['furniture','storage','collision-large'],'room-media',{aspect:2.4,defaultSize:125}),
  part('shelf','','Book / display shelf','Étagère livres / déco',['furniture','storage','collision-large'],'room-shelf',{aspect:.68,defaultSize:118}),
  part('plant','','Large plant','Grande plante',['decor','nature'],'room-plant',{aspect:.75,defaultSize:82})
 ]),
 mode('dining','🍽️','Dining zone','Coin repas','Create a real place to eat together without blocking the walking route.','Crée un vrai coin repas sans bloquer la circulation.',[
  part('dining-table','','Dining table','Table à manger',['furniture','dining','collision-large'],'room-dining',{aspect:1.65,defaultSize:125}),
  part('dining-chair','','Dining chair','Chaise de table',['furniture','dining'],'room-chair',{aspect:.70,defaultSize:67}),
  part('pendant','','Pendant light','Suspension',['light','dining'],'room-pendant',{aspect:.55,defaultSize:62}),
  part('sideboard','','Dining sideboard','Buffet',['furniture','storage','collision-large'],'room-sideboard',{aspect:2.2,defaultSize:115})
 ]),
 mode('kitchen','🍳','Studio kitchen','Cuisine studio','Add the working kitchen: preparation, washing, cooking, cooling and storage.','Ajoute la cuisine fonctionnelle : préparation, lavage, cuisson, froid et rangement.',[
  part('kitchen-counter','','Kitchen worktop','Plan de travail',['furniture','kitchen','collision-large'],'room-counter',{aspect:2.6,defaultSize:145}),
  part('kitchen-sink','','Sink / basin','Évier',['kitchen','water'],'room-sink',{aspect:1.4,defaultSize:82}),
  part('hob','','Gas / induction hob','Plaque de cuisson',['kitchen','cook'],'room-hob',{aspect:1.5,defaultSize:80}),
  part('oven','','Oven','Four',['kitchen','cook'],'room-oven',{aspect:.85,defaultSize:82}),
  part('fridge','','Fridge / freezer','Réfrigérateur',['kitchen','storage','collision-large'],'room-fridge',{aspect:.62,defaultSize:118}),
  part('kitchen-cabinet','','Kitchen cabinet','Meuble de cuisine',['kitchen','storage','collision-large'],'room-cabinet',{aspect:1.25,defaultSize:100}),
  part('kettle','','Kettle','Bouilloire',['kitchen','appliance'],'room-kettle',{aspect:.8,defaultSize:52})
 ]),
 mode('style','💡','Lighting & decor','Lumière & déco','Shape the atmosphere with lighting, curtains, art, plants and smaller details.','Crée l’ambiance avec éclairage, rideaux, art, plantes et détails.',[
  part('floor-lamp','','Floor lamp','Lampadaire',['light','decor'],'room-floorlamp',{aspect:.45,defaultSize:96}),
  part('wall-art','','Wall art','Art mural',['decor'],'room-art',{aspect:1.2,defaultSize:82}),
  part('curtains','','Curtains','Rideaux',['decor','light'],'room-curtains',{aspect:1.2,defaultSize:125}),
  part('mirror','','Mirror','Miroir',['decor'],'room-mirror',{aspect:.65,defaultSize:92}),
  part('books','','Books','Livres',['decor','storage'],'room-books',{aspect:1.4,defaultSize:58}),
  part('cushion','','Cushion','Coussin',['decor','comfort'],'room-cushion',{aspect:1,defaultSize:48})
 ]),
 mode('smart','🤖','Smart home & lifestyle','Maison intelligente','Add useful technology that makes the room feel alive and responsive.','Ajoute des technologies utiles qui rendent la pièce vivante et réactive.',[
  part('smart-speaker','','Smart speaker','Enceinte intelligente',['smart','media'],'room-speaker',{aspect:.75,defaultSize:55}),
  part('thermostat','','Smart thermostat','Thermostat intelligent',['smart'],'room-thermostat',{aspect:1,defaultSize:48}),
  part('robot-vacuum','','Robot vacuum','Aspirateur robot',['smart','movement'],'room-vacuum',{aspect:1,defaultSize:58}),
  part('smart-light','','Smart light','Éclairage intelligent',['smart','light'],'room-smartlight',{aspect:.58,defaultSize:58}),
  part('laptop','','Laptop / study device','Ordinateur portable',['smart','study'],'room-laptop',{aspect:1.55,defaultSize:72})
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
 vehicle:{title:['Future Vehicle','Véhicule du futur'],prompt:['Choose a vehicle, rotate its real blueprint around the car, then build it from matching parts.','Choisis un véhicule, fais tourner son vrai plan autour de la voiture, puis construis-le avec les pièces correspondantes.'],prompts:[],coach:['Rotate the blueprint to inspect every side. Build carefully so each part fits the selected vehicle.','Fais tourner le plan pour inspecter chaque côté. Construis avec précision pour que chaque pièce corresponde au véhicule choisi.'],checks:[['movement','Movement'],['power','Power'],['safety','Safety'],['passenger','Passenger design']],library:vehicleLibrary,modes:vehicleModes},
 room:{title:['Dream Room Studio','Studio Chambre de rêve'],prompt:['Design a realistic open-plan living room, dining area and studio kitchen, then bring it to life with people, lighting, media and smart-home activity.','Conçois un salon réaliste avec coin repas et cuisine studio, puis donne-lui vie avec personnes, éclairage, média et maison intelligente.'],prompts:[['Who is this room for?','À qui est destinée cette pièce ?'],['What must happen here every day?','Que doit-on pouvoir y faire chaque jour ?']],coach:['Design for real life: comfort, clear walking routes, useful storage, working kitchen zones, lighting and a room people can actually use.','Conçois pour la vraie vie : confort, circulation claire, rangement utile, cuisine fonctionnelle, éclairage et pièce réellement utilisable.'],checks:[['furniture','Comfort'],['dining','Dining'],['kitchen','Kitchen'],['light','Lighting'],['smart','Smart home']],library:roomLibrary,modes:roomModes},
 park:{title:['Design a Park','Concevoir un parc'],prompt:['Build a large modern park from many separate pieces. Match people, facilities, nature, sports and activities to create a living place.','Construis un grand parc moderne avec de nombreux éléments séparés. Associe personnes, équipements, nature, sports et activités.'],prompts:[['Who will use it?','Qui l’utilisera ?'],['What activities should happen here?','Quelles activités doivent s’y dérouler ?']],coach:['Does the park feel alive, accessible and varied, with the right people matched to the right facilities and activities?','Le parc paraît-il vivant, accessible et varié, avec les bonnes personnes associées aux bons équipements ?'],checks:[['play','Play'],['nature','Nature'],['access','Accessibility'],['seating','Seating']],modes:parkModes},
 robot:{title:['Invent a Robot','Inventer un robot'],prompt:['Choose one or more robot designs. Their blueprints can share the board while you assemble each robot from small matching parts.','Choisis un ou plusieurs robots. Leurs plans peuvent partager la zone pendant que tu les assembles pièce par pièce.'],prompts:[['What job should it do?','Quelle mission doit-il accomplir ?'],['What makes it safe?','Qu’est-ce qui le rend sûr ?']],coach:['Which robot are you building, and have you chosen parts that make sense for its job?','Quel robot construis-tu, et les pièces choisies correspondent-elles à sa mission ?'],checks:[['movement','Movement'],['sensor','Sensors'],['tool','Useful tools'],['power','Power']],library:robotLibrary,dynamicModes:'robot'},
 story:{title:['Story Builder','Créateur d’histoires'],prompt:['Choose a visual-story blueprint, then rebuild the scene from many small characters, locations, props and clues.','Choisis un plan d’histoire visuelle, puis reconstruis la scène avec de nombreux petits personnages, lieux, accessoires et indices.'],prompts:[['What is the main challenge?','Quel est le défi principal ?'],['How should the story end?','Comment l’histoire doit-elle finir ?']],coach:['Can someone understand what is happening from the characters, scene and props you placed?','Peut-on comprendre ce qui se passe grâce aux personnages, au décor et aux accessoires placés ?'],checks:[['character','Characters'],['place','Scene'],['prop','Props']],library:storyLibrary,dynamicModes:'story'},
 mars:{title:['Mars Base','Base martienne'],prompt:['Choose a Mars-base blueprint and rebuild it piece by piece using habitats, life-support systems, rovers, crew and terrain.','Choisis un plan de base martienne et reconstruis-la pièce par pièce avec habitats, survie, rovers, équipe et terrain.'],prompts:[['How many people live here?','Combien de personnes vivent ici ?'],['What is the base mission?','Quelle est la mission de la base ?']],coach:['Does your base have somewhere to live, enough life support and a way to move supplies and people?','Ta base possède-t-elle des logements, des systèmes de survie et un moyen de déplacer personnes et fournitures ?'],checks:[['structure','Structures'],['system','Life support'],['transport','Transport']],library:marsLibrary,dynamicModes:'mars'}
};

const canvas=$('creatorCanvas'),ctx=canvas.getContext('2d'),templateCanvas=$('creatorTemplate'),tctx=templateCanvas.getContext('2d');
const stage=$('creatorDesignStage'),buildLayer=$('creatorBuildLayer'),objectLayer=$('creatorObjects'),simulation=$('creatorSimulation');
const colours=['#f8fbff','#5de4ff','#5d6cff','#9b6dff','#ffd45b','#5ee3a4','#ff9d5d','#ff77b7','#ff647c','#1d3147'];
let active=null,activeMode=null,currentLibraryId=null,tool='select',colour=colours[1],drawing=false,startPoint=null,lastPoint=null,tempVector=null,freePoints=[],selectedObject=null,drawStrokes=0,templateOn=true,gridOn=false,history=[],historyIndex=-1,restoring=false,testRunning=false,vehicleYaw=0,vehiclePitch=.10,vehicleViewMode='orbit',vehicleOrbiting=false,vehiclePowertrain='',vehicleHybridType='self',vehicleFutureAbility='',vehicleFlightSystem='',vehicleRevealActive=false,vehicleRevealProgress=0,vehicleRevealRAF=0,vehicleRevealTimer=0,vehicleRevealStart=0,vehicleRevealStage='idle',vehiclePhase2Progress=0,vehiclePhase2Start=0,vehiclePhase2RAF=0,vehiclePhase2Timer=0,vehiclePhase3Progress=0,vehiclePhase3Start=0,vehiclePhase3RAF=0,vehiclePhase3Timer=0,vehiclePhase4Progress=0,vehiclePhase4Start=0,vehiclePhase4RAF=0,vehiclePhase4Timer=0,vehiclePhase5Progress=0,vehiclePhase5Start=0,vehiclePhase5RAF=0,vehiclePhase5Timer=0,vehicleCreationName='',vehiclePhase5Named=false,vehicleTransformationReplay=false,vehiclePaintColor='#5de4ff',vehiclePreviousPaintColor='#5de4ff',vehiclePaintMix=1,vehiclePaintRAF=0,vehiclePaintTimer=0,vehicleNoticeTimer=0,vehicleQuizState=null,vehicleQuizRecentIds=[],vehicleBuildStates={},vehiclePowerVariants={},vehicleFutureVariants={};
let roomLiveActive=false,roomLiveRAF=0,roomLiveStart=0,roomLiveProgress=0,roomLiveDuration=36000;

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
  {id:'water',icon:'🌊',label:['Water / amphibious car','Voiture aquatique / amphibie']},
  {id:'smart-farm',icon:'🛰️',label:['Precision smart farming','Agriculture intelligente de précision']}
];
const VEHICLE_FLIGHT_SYSTEMS=[
  {id:'propeller',icon:'🌀',label:['Propeller flight','Vol par hélices']},
  {id:'jet',icon:'🔥',label:['Jet flight','Vol par réacteurs']},
  {id:'drone',icon:'🛸',label:['Drone lift','Portance par rotors']}
];
const VEHICLE_FUTURE_PART_IDS=new Set(['wing','propeller','jet','amphibious','water-jet','retract-wheel','drone-lift','stabiliser','future-sensor','gps-receiver','soil-sensor','crop-camera','guidance-computer','drone-dock']);

const VEHICLE_QUIZ_BANK=[
 {
  "id": "windscreen",
  "scope": "body",
  "q": [
   "What is the main job of the windscreen?",
   "Quel est le rôle principal du pare-brise ?"
  ],
  "a": [
   [
    "Let the driver see while protecting the cabin",
    "Permettre de voir tout en protégeant l’habitacle"
   ],
   [
    "Store fuel",
    "Stocker le carburant"
   ],
   [
    "Turn the wheels",
    "Faire tourner les roues"
   ],
   [
    "Cool the engine",
    "Refroidir le moteur"
   ]
  ],
  "correct": 0,
  "why": [
   "The windscreen protects occupants from wind and debris while keeping the road visible.",
   "Le pare-brise protège du vent et des débris tout en gardant la route visible."
  ]
 },
 {
  "id": "steering",
  "scope": "body",
  "q": [
   "Which part lets the driver control the direction of the car?",
   "Quelle pièce permet au conducteur de contrôler la direction ?"
  ],
  "a": [
   [
    "Steering wheel",
    "Volant"
   ],
   [
    "Rear light",
    "Feu arrière"
   ],
   [
    "Fuel tank",
    "Réservoir"
   ],
   [
    "Seat belt",
    "Ceinture"
   ]
  ],
  "correct": 0,
  "why": [
   "The steering wheel controls the steering system that changes the direction of the road wheels.",
   "Le volant commande le système de direction qui oriente les roues."
  ]
 },
 {
  "id": "tyre-tread",
  "scope": "body",
  "q": [
   "Why do road tyres have tread patterns?",
   "Pourquoi les pneus routiers ont-ils des sculptures ?"
  ],
  "a": [
   [
    "To help the tyre grip the road and move water away",
    "Pour aider le pneu à adhérer à la route et évacuer l’eau"
   ],
   [
    "To make the horn louder",
    "Pour rendre le klaxon plus fort"
   ],
   [
    "To store electricity",
    "Pour stocker l’électricité"
   ],
   [
    "To open the doors",
    "Pour ouvrir les portes"
   ]
  ],
  "correct": 0,
  "why": [
   "Tyre tread helps maintain grip and can channel water away from the contact area.",
   "Les sculptures du pneu aident à garder l’adhérence et à évacuer l’eau de la zone de contact."
  ]
 },
 {
  "id": "side-mirror",
  "scope": "body",
  "q": [
   "What do side mirrors help the driver do?",
   "À quoi servent les rétroviseurs extérieurs ?"
  ],
  "a": [
   [
    "See areas beside and behind the vehicle",
    "Voir les zones sur les côtés et derrière le véhicule"
   ],
   [
    "Charge the battery",
    "Recharger la batterie"
   ],
   [
    "Cool the brakes",
    "Refroidir les freins"
   ],
   [
    "Move the seats",
    "Déplacer les sièges"
   ]
  ],
  "correct": 0,
  "why": [
   "Side mirrors improve the driver’s view of traffic and objects beside and behind the vehicle.",
   "Les rétroviseurs extérieurs améliorent la vue du conducteur sur les véhicules et objets situés à côté et derrière."
  ]
 },
 {
  "id": "headlights",
  "scope": "body",
  "q": [
   "What are headlights mainly designed to do?",
   "À quoi servent principalement les phares ?"
  ],
  "a": [
   [
    "Light the road ahead and help the vehicle be seen",
    "Éclairer la route et aider le véhicule à être vu"
   ],
   [
    "Hold the wheels on",
    "Maintenir les roues"
   ],
   [
    "Store luggage",
    "Stocker les bagages"
   ],
   [
    "Control the gearbox",
    "Commander la boîte de vitesses"
   ]
  ],
  "correct": 0,
  "why": [
   "Headlights illuminate the road ahead and make the vehicle easier for others to see in low light.",
   "Les phares éclairent la route et rendent le véhicule plus visible quand la lumière est faible."
  ]
 },
 {
  "id": "bumper",
  "scope": "body",
  "q": [
   "What is a bumper designed to help with?",
   "À quoi sert un pare-chocs ?"
  ],
  "a": [
   [
    "Managing some of the energy from low-speed impacts",
    "À gérer une partie de l’énergie des chocs à faible vitesse"
   ],
   [
    "Steering the front wheels",
    "À diriger les roues avant"
   ],
   [
    "Charging an electric car",
    "À recharger une voiture électrique"
   ],
   [
    "Holding the windscreen",
    "À tenir le pare-brise"
   ]
  ],
  "correct": 0,
  "why": [
   "Bumpers are part of the vehicle structure designed to help manage minor impact forces and protect nearby components.",
   "Les pare-chocs font partie de la structure conçue pour aider à gérer de petits chocs et protéger les éléments voisins."
  ]
 },
 {
  "id": "seatbelt",
  "scope": "safety",
  "q": [
   "Why is a seat belt important?",
   "Pourquoi la ceinture de sécurité est-elle importante ?"
  ],
  "a": [
   [
    "It helps restrain an occupant during sudden stops or crashes",
    "Elle retient l’occupant lors d’un freinage brusque ou d’un choc"
   ],
   [
    "It charges the battery",
    "Elle recharge la batterie"
   ],
   [
    "It turns on the headlights",
    "Elle allume les phares"
   ],
   [
    "It makes the engine faster",
    "Elle accélère le moteur"
   ]
  ],
  "correct": 0,
  "why": [
   "A seat belt helps reduce harmful movement of an occupant during a sudden stop or collision.",
   "La ceinture aide à limiter le déplacement dangereux d’un occupant lors d’un arrêt brusque ou d’une collision."
  ]
 },
 {
  "id": "airbag",
  "scope": "safety",
  "q": [
   "What is an airbag designed to do in a serious collision?",
   "À quoi sert un airbag lors d’une collision importante ?"
  ],
  "a": [
   [
    "Cushion an occupant and reduce contact with hard surfaces",
    "Amortir l’occupant et réduire le contact avec les surfaces dures"
   ],
   [
    "Increase tyre pressure",
    "Augmenter la pression des pneus"
   ],
   [
    "Refill the fuel tank",
    "Remplir le réservoir"
   ],
   [
    "Make the car go faster",
    "Faire aller la voiture plus vite"
   ]
  ],
  "correct": 0,
  "why": [
   "Airbags work with seat belts to cushion occupants during certain collisions.",
   "Les airbags fonctionnent avec les ceintures pour amortir les occupants lors de certaines collisions."
  ]
 },
 {
  "id": "collision-sensor",
  "scope": "safety",
  "q": [
   "What can a collision sensor help a vehicle detect?",
   "Que peut aider à détecter un capteur anticollision ?"
  ],
  "a": [
   [
    "Nearby obstacles or possible impacts",
    "Des obstacles proches ou un risque de choc"
   ],
   [
    "The colour of the paint",
    "La couleur de la peinture"
   ],
   [
    "How many seats are fitted",
    "Le nombre de sièges"
   ],
   [
    "The radio station",
    "La station de radio"
   ]
  ],
  "correct": 0,
  "why": [
   "Collision sensors can help safety systems detect objects or impact risks around the vehicle.",
   "Les capteurs anticollision peuvent aider les systèmes de sécurité à détecter des objets ou des risques de choc."
  ]
 },
 {
  "id": "safety-camera",
  "scope": "safety",
  "q": [
   "How can a safety camera help a driver?",
   "Comment une caméra de sécurité peut-elle aider le conducteur ?"
  ],
  "a": [
   [
    "By showing areas that may be difficult to see directly",
    "En montrant des zones difficiles à voir directement"
   ],
   [
    "By making the engine quieter",
    "En rendant le moteur plus silencieux"
   ],
   [
    "By changing the paint colour",
    "En changeant la couleur"
   ],
   [
    "By filling the tyres with air",
    "En gonflant les pneus"
   ]
  ],
  "correct": 0,
  "why": [
   "Cameras can give the driver extra views around the vehicle, such as behind it when reversing.",
   "Les caméras peuvent donner au conducteur des vues supplémentaires autour du véhicule, par exemple derrière en marche arrière."
  ]
 },
 {
  "id": "indicator",
  "scope": "safety",
  "q": [
   "Why should a driver use indicators before turning or changing direction?",
   "Pourquoi faut-il utiliser les clignotants avant de tourner ou changer de direction ?"
  ],
  "a": [
   [
    "To tell other road users what the vehicle intends to do",
    "Pour indiquer aux autres usagers ce que le véhicule va faire"
   ],
   [
    "To cool the tyres",
    "Pour refroidir les pneus"
   ],
   [
    "To charge the battery",
    "Pour recharger la batterie"
   ],
   [
    "To lock the boot",
    "Pour verrouiller le coffre"
   ]
  ],
  "correct": 0,
  "why": [
   "Indicators communicate the driver’s intended movement to other road users.",
   "Les clignotants communiquent aux autres usagers le mouvement prévu par le conducteur."
  ]
 },
 {
  "id": "warning-light",
  "scope": "safety",
  "q": [
   "What can a dashboard warning light tell the driver?",
   "Que peut indiquer un voyant d’alerte sur le tableau de bord ?"
  ],
  "a": [
   [
    "That a system may need attention",
    "Qu’un système peut nécessiter une vérification"
   ],
   [
    "That the car has changed colour",
    "Que la voiture a changé de couleur"
   ],
   [
    "That the boot is bigger",
    "Que le coffre est plus grand"
   ],
   [
    "That the road is always safe",
    "Que la route est toujours sûre"
   ]
  ],
  "correct": 0,
  "why": [
   "Warning lights are designed to alert the driver that a vehicle system may need attention or checking.",
   "Les voyants d’alerte servent à signaler qu’un système du véhicule peut nécessiter une vérification."
  ]
 },
 {
  "id": "vehicle-purpose",
  "scope": "general",
  "q": [
   "Why are a sports car, 4×4, van, coach and tractor designed differently?",
   "Pourquoi une voiture de sport, un 4×4, un van, un autocar et un tracteur sont-ils conçus différemment ?"
  ],
  "a": [
   [
    "They are engineered for different jobs, loads and environments",
    "Ils sont conçus pour des usages, charges et environnements différents"
   ],
   [
    "Only because they need different paint colours",
    "Uniquement parce qu’ils ont des couleurs différentes"
   ],
   [
    "Because only one of them needs brakes",
    "Parce qu’un seul a besoin de freins"
   ],
   [
    "Because buses do not need tyres",
    "Parce que les bus n’ont pas besoin de pneus"
   ]
  ],
  "correct": 0,
  "why": [
   "Vehicle engineering changes with purpose: passenger or cargo capacity, terrain, weight, visibility, braking and other needs.",
   "L’ingénierie varie selon l’usage : capacité, terrain, poids, visibilité, freinage et autres besoins."
  ]
 },
 {
  "id": "fourbyfour-clearance",
  "scope": "general",
  "q": [
   "Why does a 4×4 often have more ground clearance than a sports car?",
   "Pourquoi un 4×4 a-t-il souvent plus de garde au sol qu’une voiture de sport ?"
  ],
  "a": [
   [
    "To travel over rougher ground without the body hitting obstacles as easily",
    "Pour franchir des terrains plus accidentés sans que la carrosserie touche aussi facilement"
   ],
   [
    "To make the radio louder",
    "Pour rendre la radio plus forte"
   ],
   [
    "To reduce the number of seats",
    "Pour réduire le nombre de sièges"
   ],
   [
    "To remove the need for brakes",
    "Pour supprimer le besoin de freins"
   ]
  ],
  "correct": 0,
  "why": [
   "Extra ground clearance helps a 4×4 travel over uneven surfaces, bumps and obstacles.",
   "Une garde au sol plus élevée aide un 4×4 à franchir des surfaces irrégulières, bosses et obstacles."
  ]
 },
 {
  "id": "van-space",
  "scope": "general",
  "q": [
   "Why are many vans taller and boxier than sports cars?",
   "Pourquoi de nombreux vans sont-ils plus hauts et plus carrés que les voitures de sport ?"
  ],
  "a": [
   [
    "To create more usable space for passengers or cargo",
    "Pour créer plus d’espace utile pour les passagers ou le chargement"
   ],
   [
    "To make them fly",
    "Pour les faire voler"
   ],
   [
    "To avoid using tyres",
    "Pour éviter d’utiliser des pneus"
   ],
   [
    "To make the windscreen smaller",
    "Pour réduire le pare-brise"
   ]
  ],
  "correct": 0,
  "why": [
   "A taller, boxier body can provide more interior volume for people, luggage or goods.",
   "Une carrosserie plus haute et plus carrée peut offrir davantage de volume intérieur pour les personnes, bagages ou marchandises."
  ]
 },
 {
  "id": "coach-braking",
  "scope": "general",
  "q": [
   "Why must an intercity coach have a braking system designed for its much greater mass?",
   "Pourquoi un autocar doit-il avoir un système de freinage adapté à sa masse beaucoup plus élevée ?"
  ],
  "a": [
   [
    "A heavier vehicle needs its braking system to safely manage more moving energy",
    "Un véhicule plus lourd a besoin d’un freinage capable de gérer davantage d’énergie en mouvement"
   ],
   [
    "Because coaches have no steering",
    "Parce que les autocars n’ont pas de direction"
   ],
   [
    "Because passengers make the headlights dim",
    "Parce que les passagers rendent les phares moins puissants"
   ],
   [
    "Because buses cannot use mirrors",
    "Parce que les bus ne peuvent pas utiliser de rétroviseurs"
   ]
  ],
  "correct": 0,
  "why": [
   "As vehicle mass increases, the braking system must safely manage more energy when slowing or stopping.",
   "Quand la masse augmente, le système de freinage doit gérer davantage d’énergie lors du ralentissement ou de l’arrêt."
  ]
 },
 {
  "id": "tractor-tyres",
  "scope": "general",
  "q": [
   "Why do farm tractors often use very large tyres with deep tread?",
   "Pourquoi les tracteurs agricoles utilisent-ils souvent de très gros pneus à sculptures profondes ?"
  ],
  "a": [
   [
    "To gain traction on soft or uneven ground",
    "Pour obtenir de l’adhérence sur les sols meubles ou irréguliers"
   ],
   [
    "To make the tractor shorter",
    "Pour rendre le tracteur plus court"
   ],
   [
    "To store diesel inside the tyre",
    "Pour stocker le diesel dans le pneu"
   ],
   [
    "To replace the steering wheel",
    "Pour remplacer le volant"
   ]
  ],
  "correct": 0,
  "why": [
   "Large tyres with deep tread help tractors grip soil and spread their load over the ground.",
   "De gros pneus à sculptures profondes aident les tracteurs à accrocher le sol et à répartir leur charge."
  ]
 },
 {
  "id": "sports-car-low",
  "scope": "general",
  "q": [
   "Why are many sports cars built relatively low to the ground?",
   "Pourquoi de nombreuses voitures de sport sont-elles construites assez près du sol ?"
  ],
  "a": [
   [
    "A lower design can help stability and reduce aerodynamic drag",
    "Une conception plus basse peut aider la stabilité et réduire la traînée aérodynamique"
   ],
   [
    "So they can carry more farm equipment",
    "Pour transporter plus de matériel agricole"
   ],
   [
    "So they do not need suspension",
    "Pour ne pas avoir besoin de suspension"
   ],
   [
    "So the driver cannot see the road",
    "Pour que le conducteur ne voie pas la route"
   ]
  ],
  "correct": 0,
  "why": [
   "A low body can lower the centre of gravity and help airflow around a performance car.",
   "Une carrosserie basse peut abaisser le centre de gravité et améliorer l’écoulement de l’air autour d’une voiture performante."
  ]
 },
 {
  "id": "petrol-fuel-tank",
  "scope": "petrol",
  "q": [
   "What stores the petrol used by a petrol-powered car?",
   "Qu’est-ce qui stocke l’essence d’une voiture à essence ?"
  ],
  "a": [
   [
    "Fuel tank",
    "Réservoir de carburant"
   ],
   [
    "Traction battery",
    "Batterie de traction"
   ],
   [
    "Airbag",
    "Airbag"
   ],
   [
    "Windscreen",
    "Pare-brise"
   ]
  ],
  "correct": 0,
  "why": [
   "A petrol car stores its fuel in a fuel tank.",
   "Une voiture à essence stocke son carburant dans un réservoir."
  ]
 },
 {
  "id": "petrol-radiator",
  "scope": "petrol",
  "q": [
   "What is the radiator helping to control in a petrol engine?",
   "Qu’aide à contrôler le radiateur d’un moteur à essence ?"
  ],
  "a": [
   [
    "Engine temperature",
    "La température du moteur"
   ],
   [
    "Paint colour",
    "La couleur de la peinture"
   ],
   [
    "Seat position",
    "La position du siège"
   ],
   [
    "Tyre tread depth",
    "La profondeur des sculptures des pneus"
   ]
  ],
  "correct": 0,
  "why": [
   "The cooling system and radiator help remove excess heat from the engine.",
   "Le système de refroidissement et le radiateur aident à évacuer l’excès de chaleur du moteur."
  ]
 },
 {
  "id": "diesel-dpf",
  "scope": "diesel",
  "q": [
   "Which extra component helps reduce soot particles in many diesel exhaust systems?",
   "Quel composant aide à réduire les particules de suie dans de nombreux échappements diesel ?"
  ],
  "a": [
   [
    "Diesel particulate filter",
    "Filtre à particules diesel"
   ],
   [
    "Side mirror",
    "Rétroviseur"
   ],
   [
    "Steering wheel",
    "Volant"
   ],
   [
    "Roof panel",
    "Panneau de toit"
   ]
  ],
  "correct": 0,
  "why": [
   "A diesel particulate filter is designed to trap soot particles in the exhaust.",
   "Un filtre à particules diesel est conçu pour retenir les particules de suie dans l’échappement."
  ]
 },
 {
  "id": "diesel-fuel",
  "scope": "diesel",
  "q": [
   "Which fuel is a diesel engine designed to use?",
   "Quel carburant un moteur diesel est-il conçu pour utiliser ?"
  ],
  "a": [
   [
    "Diesel fuel",
    "Gazole"
   ],
   [
    "Only electricity",
    "Uniquement l’électricité"
   ],
   [
    "Water",
    "De l’eau"
   ],
   [
    "Airbag gas",
    "Le gaz d’un airbag"
   ]
  ],
  "correct": 0,
  "why": [
   "A diesel engine is designed around the properties and ignition behaviour of diesel fuel.",
   "Un moteur diesel est conçu en fonction des propriétés et du mode d’allumage du gazole."
  ]
 },
 {
  "id": "electric-battery",
  "scope": "electric",
  "q": [
   "Which component stores most of the driving energy in a battery-electric car?",
   "Quel composant stocke l’essentiel de l’énergie de conduite d’une voiture électrique ?"
  ],
  "a": [
   [
    "Traction battery",
    "Batterie de traction"
   ],
   [
    "Fuel tank",
    "Réservoir de carburant"
   ],
   [
    "Exhaust pipe",
    "Échappement"
   ],
   [
    "Rear bumper",
    "Pare-chocs arrière"
   ]
  ],
  "correct": 0,
  "why": [
   "The traction battery stores electrical energy for the electric motor.",
   "La batterie de traction stocke l’énergie électrique destinée au moteur électrique."
  ]
 },
 {
  "id": "electric-inverter",
  "scope": "electric",
  "q": [
   "What is the inverter used for in an electric power system?",
   "À quoi sert l’onduleur dans un système électrique ?"
  ],
  "a": [
   [
    "Managing and converting electrical power for the motor",
    "À gérer et convertir l’énergie électrique pour le moteur"
   ],
   [
    "Holding the passenger seat",
    "À maintenir le siège passager"
   ],
   [
    "Cleaning the rear window",
    "À nettoyer la lunette arrière"
   ],
   [
    "Storing petrol",
    "À stocker l’essence"
   ]
  ],
  "correct": 0,
  "why": [
   "The inverter controls and converts electrical power so the motor can use it effectively.",
   "L’onduleur contrôle et convertit l’énergie électrique afin que le moteur puisse l’utiliser efficacement."
  ]
 },
 {
  "id": "hybrid-combination",
  "scope": "hybrid",
  "q": [
   "What makes a hybrid power system different from a petrol-only car?",
   "Qu’est-ce qui distingue un système hybride d’une voiture uniquement à essence ?"
  ],
  "a": [
   [
    "It combines a combustion engine with electric drive components",
    "Il combine un moteur thermique avec des composants électriques"
   ],
   [
    "It has no wheels",
    "Il n’a pas de roues"
   ],
   [
    "It cannot use brakes",
    "Il ne peut pas freiner"
   ],
   [
    "It only works in water",
    "Il fonctionne seulement dans l’eau"
   ]
  ],
  "correct": 0,
  "why": [
   "A hybrid combines a combustion engine with an electric motor and battery system.",
   "Un hybride combine un moteur thermique avec un moteur électrique et une batterie."
  ]
 },
 {
  "id": "hybrid-regen",
  "scope": "hybrid",
  "q": [
   "What can regenerative braking do in many hybrid vehicles?",
   "Que peut faire le freinage régénératif dans de nombreux véhicules hybrides ?"
  ],
  "a": [
   [
    "Recover some energy while the vehicle slows and send it back to the battery",
    "Récupérer une partie de l’énergie au ralentissement et la renvoyer vers la batterie"
   ],
   [
    "Fill the fuel tank automatically",
    "Remplir automatiquement le réservoir"
   ],
   [
    "Open all the doors",
    "Ouvrir toutes les portes"
   ],
   [
    "Turn the car into a boat",
    "Transformer la voiture en bateau"
   ]
  ],
  "correct": 0,
  "why": [
   "Regenerative braking can use the electric motor as a generator to recover some energy during slowing.",
   "Le freinage régénératif peut utiliser le moteur électrique comme générateur pour récupérer une partie de l’énergie au ralentissement."
  ]
 },
 {
  "id": "propeller-thrust",
  "scope": "propeller",
  "q": [
   "What provides thrust in the propeller-flight system you built?",
   "Qu’est-ce qui fournit la poussée dans le système de vol par hélices ?"
  ],
  "a": [
   [
    "Spinning propellers",
    "Des hélices en rotation"
   ],
   [
    "Seat belts",
    "Les ceintures"
   ],
   [
    "Rear windows",
    "Les lunettes arrière"
   ],
   [
    "Fuel cap only",
    "Le bouchon de carburant uniquement"
   ]
  ],
  "correct": 0,
  "why": [
   "Rotating propellers push air to create thrust.",
   "Les hélices en rotation déplacent l’air pour créer de la poussée."
  ]
 },
 {
  "id": "jet-thrust",
  "scope": "jet",
  "q": [
   "What is the job of the jet units in the jet-flight design?",
   "Quel est le rôle des réacteurs dans la version à réaction ?"
  ],
  "a": [
   [
    "Create high-speed thrust",
    "Créer une poussée à grande vitesse"
   ],
   [
    "Hold passengers in their seats",
    "Maintenir les passagers sur leurs sièges"
   ],
   [
    "Clean the windscreen",
    "Nettoyer le pare-brise"
   ],
   [
    "Store luggage",
    "Stocker les bagages"
   ]
  ],
  "correct": 0,
  "why": [
   "Jet units generate thrust that pushes the vehicle through the air.",
   "Les réacteurs génèrent une poussée qui propulse le véhicule dans l’air."
  ]
 },
 {
  "id": "drone-lift",
  "scope": "drone",
  "q": [
   "How does the Drone Lift design begin its flight?",
   "Comment la version Drone Lift commence-t-elle son vol ?"
  ],
  "a": [
   [
    "With vertical lift from rotors",
    "Par une portance verticale créée par les rotors"
   ],
   [
    "By entering water",
    "En entrant dans l’eau"
   ],
   [
    "By removing the roof",
    "En retirant le toit"
   ],
   [
    "By turning off the battery",
    "En coupant la batterie"
   ]
  ],
  "correct": 0,
  "why": [
   "Drone-style rotors can create vertical lift before the vehicle moves forward.",
   "Des rotors de type drone peuvent créer une portance verticale avant le vol vers l’avant."
  ]
 },
 {
  "id": "water-retract",
  "scope": "water",
  "q": [
   "Why do the wheels retract in the amphibious design?",
   "Pourquoi les roues se rétractent-elles dans la version amphibie ?"
  ],
  "a": [
   [
    "To reduce drag and let the hull move through water more cleanly",
    "Pour réduire la traînée et permettre à la coque d’avancer plus facilement dans l’eau"
   ],
   [
    "To make the headlights brighter",
    "Pour rendre les phares plus puissants"
   ],
   [
    "To open the doors",
    "Pour ouvrir les portes"
   ],
   [
    "To change the paint colour",
    "Pour changer la couleur"
   ]
  ],
  "correct": 0,
  "why": [
   "Retracting the road wheels helps the water-mode shape move more efficiently through the water.",
   "Rétracter les roues routières aide la forme aquatique à avancer plus efficacement dans l’eau."
  ]
 }
];

function modesForMission(m){if(m.dynamicModes==='robot')return robotModesFor(currentLibraryId||'robot-a');if(m.dynamicModes==='story')return storyModesFor(currentLibraryId||'story-forest');if(m.dynamicModes==='mars')return marsModesFor(currentLibraryId||'mars-red');return m.modes||[];}
function allParts(){if(!active)return[];return modesForMission(missions[active]).flatMap(m=>m.parts||[]);}
function findPart(id){return allParts().find(p=>p.id===id);}
function saveStore(data){localStorage.setItem(STORAGE,JSON.stringify(data));}
function loadStore(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return{}}}

function renderColours(){const host=$('creatorColors');host.innerHTML='';colours.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='creator-color'+(c===colour?' active':'');b.style.background=c;b.title=c;b.onclick=()=>{colour=c;renderColours()};host.appendChild(b)});}
function setTool(next){tool=next;document.querySelectorAll('.creator-toolbar .creator-tool[id^="tool"]').forEach(b=>b.classList.remove('active'));const map={select:'toolSelect',pen:'toolPen',eraser:'toolEraser',line:'toolLine',curve:'toolCurve',rect:'toolRect',circle:'toolCircle'};$(map[next])?.classList.add('active');canvas.style.cursor=next==='select'?'default':'crosshair';}


const VEHICLE_PROFILES={
  'vehicle-sport':{id:'sport',style:'sport',length:4.58,width:1.96,height:1.20,wheelbase:2.72,wheelRadius:.39,cabinFront:-.70,cabinRear:.92,bodyZ:.27,roofZ:1.17,axles:[-.5,.5],engineX:-.30,seatRows:1},
  'vehicle-suv':{id:'suv',style:'suv',length:4.82,width:2.02,height:1.84,wheelbase:2.86,wheelRadius:.46,cabinFront:-.84,cabinRear:1.18,bodyZ:.34,roofZ:1.78,axles:[-.5,.5],engineX:-.31,seatRows:2},
  'vehicle-van':{id:'van',style:'van',length:5.18,width:2.04,height:2.14,wheelbase:3.18,wheelRadius:.40,cabinFront:-1.12,cabinRear:1.68,bodyZ:.36,roofZ:2.06,axles:[-.5,.5],engineX:-.37,seatRows:3},
  'vehicle-coach':{id:'coach',style:'coach',length:7.25,width:2.42,height:3.06,wheelbase:4.52,wheelRadius:.49,cabinFront:-2.25,cabinRear:2.70,bodyZ:.46,roofZ:2.98,axles:[-.50,.31,.50],engineX:.34,seatRows:5},
  'vehicle-tractor':{id:'tractor',style:'tractor',length:4.92,width:2.24,height:2.72,wheelbase:2.72,wheelRadius:.42,rearWheelRadius:.72,cabinFront:-.18,cabinRear:1.18,bodyZ:.48,roofZ:2.55,axles:[-.5,.5],engineX:-.30,seatRows:1}
};
function vehicleProfile(){return VEHICLE_PROFILES[currentLibraryId]||VEHICLE_PROFILES['vehicle-sport'];}
function vehicleIs(id){return vehicleProfile().id===id;}
function vehicleProjectionScale(){const p=vehicleProfile();return Math.min(81,560/p.length,225/p.height);}
function vehicleWheelStations(){const p=vehicleProfile();if(p.id==='coach')return[[-p.length*.31,p.wheelRadius],[p.length*.25,p.wheelRadius],[p.length*.37,p.wheelRadius]];if(p.id==='tractor')return[[-p.wheelbase/2,p.wheelRadius],[p.wheelbase/2,p.rearWheelRadius||p.wheelRadius*1.55]];return[[-p.wheelbase/2,p.wheelRadius],[p.wheelbase/2,p.wheelRadius]];}

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
function vehicleSystemObjectData(kind){
  const prefix=kind==='power'?'power-':'future-',ids=kind==='power'?VEHICLE_POWER_PART_IDS:VEHICLE_FUTURE_PART_IDS;
  return objectData().filter(d=>d.kind==='part'&&((d.targetKey||'').startsWith(prefix)||ids.has(d.partId)));
}
function removeVehicleSystemObjects(kind){
  const prefix=kind==='power'?'power-':'future-',ids=kind==='power'?VEHICLE_POWER_PART_IDS:VEHICLE_FUTURE_PART_IDS;
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&((o.dataset.targetKey||'').startsWith(prefix)||ids.has(o.dataset.partId))).forEach(o=>o.remove());
  if(selectedObject&&ids.has(selectedObject.dataset.partId))selectObject(null);
}
function vehiclePowerVariantKey(id=vehiclePowertrain,hybrid=vehicleHybridType){return !id?'':(id==='hybrid'?`hybrid:${hybrid||'self'}`:id);}
function stashVehiclePowerVariant(){const key=vehiclePowerVariantKey();if(key)vehiclePowerVariants[key]=vehicleSystemObjectData('power');}
function restoreVehiclePowerVariant(){const key=vehiclePowerVariantKey();removeVehicleSystemObjects('power');if(key&&vehiclePowerVariants[key]?.length)restoreObjects(vehiclePowerVariants[key],{append:true});}
function removeLooseVehiclePowerPieces(){[...objectLayer.children].filter(o=>o.dataset.kind==='part'&&VEHICLE_POWER_PART_IDS.has(o.dataset.partId)&&o.dataset.installed!=='1').forEach(o=>o.remove());if(selectedObject&&VEHICLE_POWER_PART_IDS.has(selectedObject.dataset.partId))selectObject(null);}
function selectVehiclePowertrain(id){
  if(!VEHICLE_POWERTRAINS.some(x=>x.id===id))return;
  if(vehiclePowertrain!==id){if(testRunning)stopTest(false);stashVehiclePowerVariant();removeVehicleSystemObjects('power');vehiclePowertrain=id;restoreVehiclePowerVariant();hideVehicleStageNotice();}
  renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));updateVehicleProgressUI();commitHistory();
  $('creatorCoach').textContent=t(`${vehiclePowertrainLabel()} selected. Any work you already completed on other power systems is saved and will return when you switch back.`,`${vehiclePowertrainLabel()} sélectionné. Le travail déjà réalisé sur les autres systèmes d’énergie est conservé et réapparaîtra quand tu y reviendras.`);
}
function selectVehicleHybridType(type){
  if(!['self','plugin'].includes(type)||vehiclePowertrain!=='hybrid')return;
  if(vehicleHybridType!==type){if(testRunning)stopTest(false);stashVehiclePowerVariant();removeVehicleSystemObjects('power');vehicleHybridType=type;restoreVehiclePowerVariant();hideVehicleStageNotice();renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));updateVehicleProgressUI();commitHistory();}
}
function resetVehiclePowerSystem(){
  if(!vehiclePowertrain)return;
  if(testRunning)stopTest(false);stashVehiclePowerVariant();removeVehicleSystemObjects('power');selectObject(null);vehiclePowertrain='';renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='power'));updateVehicleProgressUI();commitHistory();
  $('creatorCoach').textContent=t('Choose another power system. Your previous power-system build is saved and will be restored if you select it again.','Choisis un autre système d’énergie. Ta construction précédente est conservée et sera restaurée si tu la sélectionnes à nouveau.');
}

function vehicleFutureAbilityChoice(id=vehicleFutureAbility){return VEHICLE_FUTURE_ABILITIES.find(x=>x.id===id)||null;}
function vehicleFutureAbilityLabel(id=vehicleFutureAbility){const x=vehicleFutureAbilityChoice(id);return x?L(x.label):t('Not chosen yet','Pas encore choisi');}
function vehicleFlightSystemChoice(id=vehicleFlightSystem){return VEHICLE_FLIGHT_SYSTEMS.find(x=>x.id===id)||null;}
function vehicleFlightSystemLabel(id=vehicleFlightSystem){const x=vehicleFlightSystemChoice(id);return x?L(x.label):t('Not chosen yet','Pas encore choisi');}
function vehicleFutureConfig(){
  if(vehicleIs('tractor')&&vehicleFutureAbility==='smart-farm')return{required:['gps-receiver','soil-sensor','crop-camera','guidance-computer','drone-dock'],optional:[]};
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
function vehicleFutureVariantKey(ability=vehicleFutureAbility,flight=vehicleFlightSystem){if(!ability)return'';if(ability==='water')return'water';if(ability==='smart-farm')return'smart-farm';return flight?`flight:${flight}`:'';}
function stashVehicleFutureVariant(){const key=vehicleFutureVariantKey();if(key)vehicleFutureVariants[key]=vehicleSystemObjectData('future');}
function restoreVehicleFutureVariant(){const key=vehicleFutureVariantKey();removeVehicleSystemObjects('future');if(key&&vehicleFutureVariants[key]?.length)restoreObjects(vehicleFutureVariants[key],{append:true});}
function clearVehicleFuturePiecesForSwitch(){removeVehicleSystemObjects('future');}
function selectVehicleFutureAbility(id){
  if(!VEHICLE_FUTURE_ABILITIES.some(x=>x.id===id))return;
  if(vehicleFutureAbility!==id){
    if(testRunning)stopTest(false);stashVehicleFutureVariant();removeVehicleSystemObjects('future');vehicleFutureAbility=id;restoreVehicleFutureVariant();hideVehicleStageNotice();
    renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));updateVehicleProgressUI();commitHistory();
    $('creatorCoach').textContent=id==='flight'
      ?(vehicleFlightSystem?t(`${vehicleFlightSystemLabel()} restored. Previous flight work is kept when you switch away and come back.`,`${vehicleFlightSystemLabel()} restauré. Le travail de vol précédent est conservé quand tu changes puis reviens.`):t('Flying Car selected. Choose Propeller, Jet or Drone Lift. Any completed Future Tech alternative will stay saved.','Voiture volante sélectionnée. Choisis Hélices, Réacteurs ou Rotors drone. Toute autre technologie future terminée restera enregistrée.'))
      :t('Water / Amphibious selected. Any flight build you already made is saved and will return when you switch back.','Aquatique / amphibie sélectionné. Toute construction de vol déjà réalisée est conservée et reviendra quand tu y retourneras.');
    return;
  }
  renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));updateVehicleProgressUI();
}
function selectVehicleFlightSystem(id){
  if(!VEHICLE_FLIGHT_SYSTEMS.some(x=>x.id===id)||vehicleFutureAbility!=='flight')return;
  if(vehicleFlightSystem!==id){
    if(testRunning)stopTest(false);stashVehicleFutureVariant();removeVehicleSystemObjects('future');vehicleFlightSystem=id;restoreVehicleFutureVariant();hideVehicleStageNotice();
    renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));updateVehicleProgressUI();commitHistory();
    $('creatorCoach').textContent=t(`${vehicleFlightSystemLabel()} selected. Previous Propeller, Jet, Drone or Water progress is saved and will be restored when you return to it.`,`${vehicleFlightSystemLabel()} sélectionné. La progression précédente Hélices, Réacteurs, Drone ou Eau est conservée et sera restaurée quand tu y reviendras.`);
  }
}
function resetVehicleFutureSystem(){
  if(!vehicleFutureAbility)return;
  if(testRunning)stopTest(false);stashVehicleFutureVariant();removeVehicleSystemObjects('future');selectObject(null);vehicleFutureAbility='';renderTemplate('vehicle');renderComponents(modesForMission(missions.vehicle).find(x=>x.id==='future'));updateVehicleProgressUI();commitHistory();
  $('creatorCoach').textContent=t('Choose another Future Tech path. Your previous Future Tech builds are saved and can be restored by selecting them again.','Choisis une autre technologie future. Tes constructions précédentes sont conservées et peuvent être restaurées en les sélectionnant à nouveau.');
}
function rotateVehiclePoint(p,yaw,pitch){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const x=p[0]*cy-p[1]*sy,depth=p[0]*sy+p[1]*cy,z=p[2];
  return [x,depth*cp-z*sp,depth*sp+z*cp];
}
function vehicleProjectPoint(p){
  const q=rotateVehiclePoint(p,vehicleYaw,vehiclePitch),D=8.4,scale=vehicleProjectionScale();
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
    'rear-cargo-door':[[-.92,-1],[.92,-1],[1,-.82],[1,.82],[.92,1],[-.92,1],[-1,.82],[-1,-.82]],
    'luggage-bay-door':[[-1,-.86],[1,-.86],[1,.86],[-1,.86]],
    'coach-toilet':[[-.88,-1],[.88,-1],[1,-.72],[1,.94],[-1,.94],[-1,-.72]],
    'route-display':[[-1,-.72],[1,-.72],[1,.72],[-1,.72]],
    'front-attachment':[[-1,-.52],[-.72,-.86],[.72,-.86],[1,-.52],[.92,.52],[.62,.82],[-.62,.82],[-.92,.52]],
    'rear-hitch':[[-1,-.22],[-.72,-.72],[0,-1],[.72,-.72],[1,-.22],[.55,.18],[.90,.82],[.42,1],[0,.50],[-.42,1],[-.90,.82],[-.55,.18]],
    'pto-shaft':[[-.72,-1],[.72,-1],[1,-.72],[1,.72],[.72,1],[-.72,1],[-1,.72],[-1,-.72]],
    'hydraulic-coupler':[[-1,-.70],[1,-.70],[1,.70],[-1,.70]],
    'gps-receiver':[[-.72,-1],[.72,-1],[1,-.72],[1,.72],[.72,1],[-.72,1],[-1,.72],[-1,-.72]],
    'soil-sensor':[[-1,-.58],[-.42,-1],[.42,-1],[1,-.58],[.72,.90],[-.72,.90]],
    'crop-camera':[[-1,-.64],[.72,-.64],[1,-.18],[.72,.64],[-.72,.64],[-1,.18]],
    'guidance-computer':[[-1,-.78],[1,-.78],[1,.78],[-1,.78]],
    'drone-dock':[[-1,-.62],[-.70,-.96],[.70,-.96],[1,-.62],[.84,.62],[.52,.92],[-.52,.92],[-.84,.62]],
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
  const p=vehicleProfile(),L=p.length,W=p.width,H=p.height,slots=[];
  const sideY=W*.505;
  const addSide=(key,partId,x,z,halfX,halfZ,sgn,opts={})=>{
    const y=sgn*sideY,n=[0,sgn,0];
    slots.push(vehicleSlot(`${key}-${sgn>0?'r':'l'}`,partId,[x,y,z],[halfX,0,0],[0,0,halfZ],n,{aspect:opts.aspect||1,minFacing:opts.minFacing??.36,shape:vehiclePartShape(partId)}));
  };
  const addWheel=(key,x,r,sgn)=>{
    const y=sgn*sideY,n=[0,sgn,0];
    slots.push(vehicleSlot(`${key}-${sgn>0?'r':'l'}`,'wheel',[x,y,Math.max(r*.88,p.bodyZ*.86)],[r,0,0],[0,0,r],n,{aspect:1,minFacing:.38}));
  };
  const sides=[-1,1];

  /* Wheels are vehicle-specific: coach gets three axles, tractor gets huge rear tyres. */
  if(p.id==='coach'){
    const xs=[-L*.31,L*.25,L*.37];
    xs.forEach((x,i)=>sides.forEach(sgn=>addWheel(`wheel-${i}`,x,p.wheelRadius,sgn)));
  }else if(p.id==='tractor'){
    sides.forEach(sgn=>{addWheel('wheel-front',-p.wheelbase/2,p.wheelRadius,sgn);addWheel('wheel-rear',p.wheelbase/2,p.rearWheelRadius||p.wheelRadius*1.55,sgn)});
  }else{
    sides.forEach(sgn=>{addWheel('wheel-front',-p.wheelbase/2,p.wheelRadius,sgn);addWheel('wheel-rear',p.wheelbase/2,p.wheelRadius,sgn)});
  }

  if(p.id==='sport'){
    sides.forEach(sgn=>{
      addSide('door','door',.28,.57,.61,.27,sgn,{aspect:2.0});
      addSide('window','window',.02,.91,.49,.17,sgn,{aspect:2.7});
      addSide('mirror','mirror',-.58,.84,.105,.065,sgn,{aspect:1.65,minFacing:.30});
    });
  }else if(p.id==='suv'){
    sides.forEach(sgn=>{
      addSide('door-front','door',-.42,.78,.48,.34,sgn,{aspect:1.45});
      addSide('door-rear','door',.62,.78,.48,.34,sgn,{aspect:1.45});
      addSide('window-front','window',-.45,1.34,.45,.22,sgn,{aspect:2.05});
      addSide('window-rear','window',.61,1.34,.45,.22,sgn,{aspect:2.05});
      addSide('mirror','mirror',-1.02,1.27,.12,.07,sgn,{aspect:1.65,minFacing:.28});
    });
  }else if(p.id==='van'){
    sides.forEach(sgn=>{
      addSide('door-front','door',-1.03,.91,.46,.42,sgn,{aspect:1.18});
      addSide('door-slide','door',.55,.95,.70,.46,sgn,{aspect:1.50});
      addSide('window-front','window',-1.02,1.56,.43,.26,sgn,{aspect:1.75});
      addSide('window-mid','window',.18,1.58,.52,.27,sgn,{aspect:1.95});
      addSide('window-rear','window',1.24,1.57,.43,.27,sgn,{aspect:1.70});
      addSide('mirror','mirror',-1.48,1.43,.13,.075,sgn,{aspect:1.65,minFacing:.28});
    });
  }else if(p.id==='coach'){
    sides.forEach(sgn=>{
      /* Long coach side is assembled from repeated passenger-window puzzle pieces. */
      [-1.75,-.55,.65,1.85].forEach((x,i)=>addSide(`window-${i}`,'window',x,2.12,.50,.30,sgn,{aspect:1.70,minFacing:.32}));
      addSide('door-front','door',-2.72,1.13,.32,.54,sgn,{aspect:.76,minFacing:.32});
      /* One proper lower luggage-bay door on each side of the coach. */
      addSide('luggage-bay','luggage-bay-door',.42,.78,1.18,.26,sgn,{aspect:4.35,minFacing:.30});
      addSide('mirror','mirror',-3.02,2.10,.16,.09,sgn,{aspect:1.65,minFacing:.26});
    });
  }else if(p.id==='tractor'){
    sides.forEach(sgn=>{
      addSide('cab-door','door',.58,1.42,.42,.62,sgn,{aspect:.80});
      addSide('cab-window','window',.48,2.02,.39,.33,sgn,{aspect:1.20});
      addSide('mirror','mirror',-.02,2.12,.13,.075,sgn,{aspect:1.65,minFacing:.28});
    });
  }

  /* Front/rear glass and top panels are shaped to each vehicle family. */
  const top=[0,0,1];
  const glass={
    sport:{windX:-.47,windZ:.94,windU:.255,windV:W*.405,rearX:.63,rearZ:.93,rearU:.255,rearV:W*.385,roofX:.10,roofU:.47,hoodX:-L*.325,hoodU:.30*L,trunkX:L*.33,trunkU:.205*L},
    suv:{windX:-.88,windZ:1.39,windU:.28,windV:W*.40,rearX:1.22,rearZ:1.37,rearU:.25,rearV:W*.39,roofX:.20,roofU:.88,hoodX:-L*.35,hoodU:.26*L,trunkX:L*.37,trunkU:.16*L},
    van:{windX:-1.46,windZ:1.55,windU:.31,windV:W*.41,rearX:2.18,rearZ:1.57,rearU:.22,rearV:W*.40,roofX:.38,roofU:1.55,hoodX:-L*.43,hoodU:.13*L,trunkX:L*.45,trunkU:.09*L},
    coach:{windX:-3.05,windZ:2.15,windU:.34,windV:W*.42,rearX:3.22,rearZ:2.14,rearU:.20,rearV:W*.41,roofX:.12,roofU:2.82,hoodX:-L*.47,hoodU:.07*L,trunkX:L*.47,trunkU:.06*L},
    tractor:{windX:-.20,windZ:2.02,windU:.25,windV:W*.37,rearX:1.06,rearZ:2.02,rearU:.20,rearV:W*.37,roofX:.48,roofU:.67,hoodX:-L*.31,hoodU:.29*L,trunkX:L*.39,trunkU:.10*L}
  }[p.id];
  slots.push(vehicleSlot('windscreen','windscreen',[glass.windX,0,glass.windZ],[0,glass.windV,0],[glass.windU,0,.22],[-.58,0,.80],{aspect:1.85,minFacing:.14,shape:vehiclePartShape('windscreen')}));
  slots.push(vehicleSlot('rear-window','rear-window',[glass.rearX,0,glass.rearZ],[0,glass.rearV,0],[-glass.rearU,0,.20],[.58,0,.80],{aspect:1.82,minFacing:.14,shape:vehiclePartShape('rear-window')}));
  slots.push(vehicleSlot('roof','roof',[glass.roofX,0,p.roofZ*.985],[glass.roofU,0,0],[0,W*.37,0],top,{aspect:p.id==='coach'?3.4:p.id==='van'?2.4:1.6,minFacing:.08,shape:vehiclePartShape('roof')}));
  /* Tractor and coach still have an engine/maintenance cover, but no conventional boot/trunk puzzle. */
  slots.push(vehicleSlot('hood','hood',[glass.hoodX,0,p.id==='tractor'?1.08:p.id==='coach'?1.36:p.bodyZ+.48],[glass.hoodU,0,.015],[0,W*.39,0],top,{aspect:p.id==='coach'?2.6:1.75,minFacing:.07,shape:vehiclePartShape('hood')}));
  if(!['coach','tractor','van'].includes(p.id))slots.push(vehicleSlot('trunk','trunk',[glass.trunkX,0,p.bodyZ+.42],[glass.trunkU,0,.015],[0,W*.37,0],top,{aspect:1.45,minFacing:.07,shape:vehiclePartShape('trunk')}));
  if(p.id==='van'){
    /* Two real rear cargo doors. They are fitted from the Rear view and become animated in the van delivery test. */
    [-1,1].forEach(sgn=>slots.push(vehicleSlot(`rear-cargo-door-${sgn<0?'l':'r'}`,'rear-cargo-door',[L*.505,sgn*W*.235,1.10],[0,W*.205,0],[0,0,.62],[1,0,.08],{aspect:.82,minFacing:.30,shape:vehiclePartShape('rear-cargo-door')})));
  }
  if(p.id==='coach'){
    /* Front destination board above the windscreen: visible from the Front view. */
    slots.push(vehicleSlot('route-display','route-display',[-L*.503,0,2.72],[0,W*.29,0],[0,0,.115],[-1,0,.03],{aspect:3.2,minFacing:.28,shape:vehiclePartShape('route-display')}));
  }
  if(p.id==='tractor'){
    /* A real farm tractor is valuable because it can power and carry many implements. */
    slots.push(vehicleSlot('front-attachment','front-attachment',[-L*.505,0,.78],[0,W*.28,0],[0,0,.16],[-1,0,.06],{aspect:2.1,minFacing:.30,shape:vehiclePartShape('front-attachment')}));
    slots.push(vehicleSlot('rear-hitch','rear-hitch',[L*.505,0,.62],[0,W*.22,0],[0,0,.19],[1,0,.05],{aspect:1.5,minFacing:.30,shape:vehiclePartShape('rear-hitch')}));
    slots.push(vehicleSlot('pto-shaft','pto-shaft',[L*.515,0,.83],[0,.10,0],[0,0,.10],[1,0,.02],{aspect:1,minFacing:.30,shape:vehiclePartShape('pto-shaft')}));
    slots.push(vehicleSlot('hydraulic-coupler','hydraulic-coupler',[L*.505,W*.18,.99],[0,.15,0],[0,0,.08],[1,0,.04],{aspect:1.8,minFacing:.28,shape:vehiclePartShape('hydraulic-coupler')}));
  }

  for(const sgn of sides){
    const lightZ=p.id==='coach'?1.00:p.id==='tractor'?.91:p.bodyZ+.27;
    slots.push(vehicleSlot(`headlight-${sgn>0?'r':'l'}`,'headlight',[-L*.465,sgn*W*.31,lightZ],[0,W*.155,0],[0,0,.075],[-1,0,.15],{aspect:2.15,minFacing:.24,shape:vehiclePartShape('headlight')}));
    slots.push(vehicleSlot(`taillight-${sgn>0?'r':'l'}`,'taillight',[L*.465,sgn*W*.31,lightZ],[0,W*.145,0],[0,0,.072],[1,0,.15],{aspect:2.0,minFacing:.24,shape:vehiclePartShape('taillight')}));
  }
  const bumperZ=p.id==='coach'?.62:p.id==='tractor'?.55:p.bodyZ+.04;
  slots.push(vehicleSlot('front-bumper','bumper',[-L*.49,0,bumperZ],[0,W*.43,0],[0,0,.13],[-1,0,0],{aspect:3.3,minFacing:.34,shape:vehiclePartShape('bumper')}));
  if(p.id!=='tractor')slots.push(vehicleSlot('rear-bumper','rear-bumper',[L*.49,0,bumperZ],[0,W*.42,0],[0,0,.125],[1,0,0],{aspect:3.3,minFacing:.34,shape:vehiclePartShape('rear-bumper')}));
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
  if(partId==='luggage-bay-door')return{fill:'rgba(91,119,145,.76)',stroke:'rgba(226,243,252,.92)'};
  if(partId==='coach-toilet')return{fill:'rgba(221,232,239,.82)',stroke:'rgba(255,255,255,.96)'};
  if(partId==='route-display')return{fill:'rgba(15,34,49,.94)',stroke:'rgba(111,236,255,.96)'};
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
  }else if(proj.partId==='rear-cargo-door'){
    const cx=pts.reduce((a,q)=>a+q.x,0)/pts.length,cy=pts.reduce((a,q)=>a+q.y,0)/pts.length;
    tctx.strokeStyle='rgba(26,58,78,.72)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(cx,cy-12);tctx.lineTo(cx,cy+12);tctx.moveTo(cx-5,cy);tctx.lineTo(cx+5,cy);tctx.stroke();
  }
  tctx.restore();
}

function vehicleInteriorSlots(){
  const p=vehicleProfile(),W=p.width,down=[0,0,-1],slots=[];
  const z=p.id==='coach'?1.05:p.id==='tractor'?1.25:p.bodyZ+.28;
  const dashX=p.id==='coach'?-p.length*.36:p.id==='van'?-1.28:p.id==='suv'?-1.00:p.id==='tractor'?-1.05:-.62;
  const seatFrontX=p.id==='coach'?-p.length*.31:p.id==='van'?-1.02:p.id==='suv'?-0.72:p.id==='tractor'?.38:.03;
  slots.push(vehicleSlot('dashboard','dashboard',[dashX,0,z+.20],[p.id==='coach'?.40:.28,0,0],[0,W*.34,0],down,{aspect:2.4,minFacing:.32,view:'interior',shape:vehiclePartShape('dashboard'),required:true}));
  slots.push(vehicleSlot('steering','steering',[dashX+.10,-W*.27,z+.17],[.105,0,0],[0,.105,0],down,{aspect:1,minFacing:.32,view:'interior',shape:vehiclePartShape('steering'),required:true}));
  slots.push(vehicleSlot('driver-seat','driver-seat',[seatFrontX,-W*.25,z],[.19,0,0],[0,.135,0],down,{aspect:1.42,minFacing:.32,view:'interior',shape:vehiclePartShape('driver-seat'),required:true}));
  const passengerPositions=[];
  if(p.id==='sport')passengerPositions.push([seatFrontX,W*.28,z]);
  else if(p.id==='suv')passengerPositions.push([seatFrontX,W*.25,z],[.30,-W*.25,z],[.30,W*.25,z]);
  else if(p.id==='van')passengerPositions.push([seatFrontX,W*.25,z],[.02,-W*.25,z],[.02,W*.25,z],[1.02,-W*.25,z],[1.02,W*.25,z]);
  else if(p.id==='coach'){
    const xs=[-1.15,.20,1.55];xs.forEach(x=>{passengerPositions.push([x,-W*.25,z]);passengerPositions.push([x,W*.25,z])});
  }
  passengerPositions.forEach((pos,i)=>slots.push(vehicleSlot(`passenger-seat-${i}`,'seat',pos,[.19,0,0],[0,.135,0],down,{aspect:1.42,minFacing:.32,view:'interior',shape:vehiclePartShape('seat'),required:true})));
  if(p.id==='coach'){
    /* Long-distance coaches include a compact onboard toilet near the rear. */
    slots.push(vehicleSlot('coach-toilet','coach-toilet',[p.length*.31,W*.23,z+.10],[.25,0,0],[0,.18,0],down,{aspect:.82,minFacing:.32,view:'interior',shape:vehiclePartShape('coach-toilet'),required:true}));
  }
  return slots;
}
function vehicleSafetySlots(){
  const p=vehicleProfile(),L=p.length,W=p.width,down=[0,0,-1],slots=[];
  const add=(key,partId,center,u,v,normal,opts={})=>slots.push(vehicleSlot(`safety-${key}`,partId,center,u,v,normal,{view:opts.view||'exterior',required:opts.required!==false,minFacing:opts.minFacing??.26,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));
  const seatZ=p.id==='coach'?1.07:p.id==='tractor'?1.28:p.bodyZ+.30;
  const seatPositions=[];
  if(p.id==='sport')seatPositions.push([.03,-W*.28,seatZ],[.03,W*.28,seatZ]);
  else if(p.id==='suv')seatPositions.push([-.72,-W*.25,seatZ],[-.72,W*.25,seatZ],[.30,-W*.25,seatZ],[.30,W*.25,seatZ]);
  else if(p.id==='van')seatPositions.push([-1.02,-W*.25,seatZ],[-1.02,W*.25,seatZ],[.02,-W*.25,seatZ],[.02,W*.25,seatZ],[1.02,-W*.25,seatZ],[1.02,W*.25,seatZ]);
  else if(p.id==='coach'){seatPositions.push([-p.length*.31,-W*.25,seatZ]);[-1.15,.20,1.55].forEach(x=>{seatPositions.push([x,-W*.25,seatZ]);seatPositions.push([x,W*.25,seatZ])});}
  else if(p.id==='tractor')seatPositions.push([.38,-W*.05,seatZ]);
  seatPositions.forEach((pos,i)=>add(`belt-${i}`,'belt',[pos[0],pos[1],pos[2]+.06],[.12,0,0],[0,.045,0],down,{view:'interior',aspect:2.7,minFacing:.32}));

  const dashX=p.id==='coach'?-p.length*.36:p.id==='van'?-1.28:p.id==='suv'?-1.00:p.id==='tractor'?-1.05:-.62;
  const airbagCount=p.id==='tractor'||p.id==='coach'?1:2;
  for(let i=0;i<airbagCount;i++)add(`airbag-${i}`,'airbag',[dashX+.08,(i?1:-1)*W*.22,seatZ+.18],[.075,0,0],[0,.075,0],down,{view:'interior',aspect:1,minFacing:.32});
  add('camera','camera',[dashX+.20,0,seatZ+.38],[.075,0,0],[0,.050,0],down,{view:'interior',aspect:1.5,minFacing:.32});
  add('warning-light','safety-light',[dashX+.10,-W*.04,seatZ+.18],[.052,0,0],[0,.045,0],down,{view:'interior',aspect:1.15,minFacing:.32});
  add('emergency-stop','emergency-stop',[dashX+.10,W*.12,seatZ+.17],[.050,0,0],[0,.050,0],down,{view:'interior',aspect:1,minFacing:.32});

  const shellZ=p.id==='coach'?1.12:p.id==='tractor'?.92:p.bodyZ+.20;
  add('sensor-front','sensor',[-L*.492,0,shellZ],[0,W*.065,0],[0,0,.065],[-1,0,.05],{aspect:1,minFacing:.22});
  add('sensor-rear','sensor',[L*.492,0,shellZ],[0,W*.065,0],[0,0,.065],[1,0,.05],{aspect:1,minFacing:.22});
  add('sensor-left','sensor',[0,-W*.505,shellZ],[.065,0,0],[0,0,.065],[0,-1,.03],{aspect:1,minFacing:.22});
  add('sensor-right','sensor',[0,W*.505,shellZ],[.065,0,0],[0,0,.065],[0,1,.03],{aspect:1,minFacing:.22});
  for(const sgn of [-1,1]){
    add(`indicator-front-${sgn>0?'r':'l'}`,'indicator',[-L*.468,sgn*W*.405,shellZ+.11],[0,W*.090,0],[0,0,.045],[-1,0,.10],{aspect:2.0,minFacing:.22});
    add(`indicator-rear-${sgn>0?'r':'l'}`,'indicator',[L*.468,sgn*W*.405,shellZ+.09],[0,W*.088,0],[0,0,.044],[1,0,.10],{aspect:2.0,minFacing:.22});
  }
  return slots;
}
function vehiclePowerSlots(){
  if(!vehiclePowertrain)return[];
  const p=vehicleProfile(),L=p.length,W=p.width,sport=p.id==='sport',down=[0,0,-1],top=[0,0,1],side=[0,1,0],slots=[];
  const engineX=(p.engineX??-.30)*L,underZ=Math.max(.24,p.bodyZ*.72),engineZ=p.id==='coach'?.72:p.id==='tractor'?.86:(sport?.43:p.bodyZ+.16);
  const add=(key,partId,center,u,v,normal=down,opts={})=>slots.push(vehicleSlot(`power-${key}`,partId,center,u,v,normal,{view:opts.view||'interior',required:opts.required!==false,minFacing:opts.minFacing??.28,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));
  const ids=new Set(vehiclePowerPartIdsForSelection());
  if(ids.has('petrol-engine'))add('petrol-engine','petrol-engine',[engineX,0,engineZ],[.40,0,0],[0,W*.27,0],down,{aspect:1.5});
  if(ids.has('diesel-engine'))add('diesel-engine','diesel-engine',[engineX,0,engineZ],[.41,0,0],[0,W*.27,0],down,{aspect:1.5});
  if(ids.has('electric-motor'))add('electric-motor','electric-motor',[engineX*.88,0,Math.max(.30,underZ+.08)],[.25,0,0],[0,.25,0],down,{aspect:1});
  if(ids.has('battery')){
    const hybrid=vehiclePowertrain==='hybrid';
    add('battery','battery',[hybrid?L*.08:L*.14,0,underZ],[hybrid?.42:.72,0,0],[0,W*(hybrid?.25:.34),0],down,{aspect:hybrid?1.65:2.2});
  }
  if(ids.has('inverter'))add('inverter','inverter',[-L*.04,0,underZ+.08],[.27,0,0],[0,W*.20,0],down,{aspect:1.55});
  if(ids.has('fuel-tank'))add('fuel-tank','fuel-tank',[p.id==='coach'?-L*.12:L*.31,0,underZ],[.34,0,0],[0,W*.27,0],down,{aspect:1.75});
  if(ids.has('exhaust'))add('exhaust','exhaust',[p.id==='coach'?L*.34:L*.18,-W*.31,Math.max(.16,underZ-.10)],[.66,0,0],[0,.10,0],down,{aspect:3.8});
  if(ids.has('radiator'))add('radiator','radiator',[p.id==='coach'?L*.40:-L*.44,0,engineZ],[.15,0,0],[0,W*.30,0],down,{aspect:1.8});
  if(ids.has('dpf'))add('dpf','dpf',[p.id==='coach'?L*.24:L*.02,-W*.26,Math.max(.18,underZ-.06)],[.24,0,0],[0,.12,0],down,{aspect:2.2});
  if(ids.has('charge-port'))add('charge-port','charge-port',[L*.23,W*.515,p.id==='coach'?1.18:p.id==='tractor'?1.05:(sport?.70:p.bodyZ+.44)],[.085,0,0],[0,0,.085],side,{view:'exterior',minFacing:.22,aspect:1});
  if(ids.has('solar'))add('solar','solar',[.10,0,p.roofZ+.025],[.54,0,0],[0,W*.28,0],top,{view:'exterior',required:false,minFacing:.08,aspect:2.4});
  return slots;
}
function vehicleFutureSlots(){
  if(!vehicleFutureAbility)return[];
  if(vehicleFutureAbility==='flight'&&!vehicleFlightSystem)return[];
  const p=vehicleProfile(),L=p.length,W=p.width,sport=p.id==='sport',down=[0,0,-1],top=[0,0,1],rear=[1,0,0],front=[-1,0,0],slots=[];
  const ids=new Set(vehicleFuturePartIdsForSelection());
  const add=(key,partId,center,u,v,normal=top,opts={})=>slots.push(vehicleSlot(`future-${key}`,partId,center,u,v,normal,{view:opts.view||'exterior',required:opts.required!==false,minFacing:opts.minFacing??.22,aspect:opts.aspect||1,shape:vehiclePartShape(partId),label:opts.label||partId}));

  if(p.id==='tractor'&&vehicleFutureAbility==='smart-farm'){
    add('gps','gps-receiver',[.48,0,p.roofZ+.06],[.12,0,0],[0,.12,0],top,{aspect:1,minFacing:.08});
    add('soil','soil-sensor',[L*.33,-W*.42,.52],[.10,0,0],[0,.08,0],[0,-1,.05],{aspect:1.2,minFacing:.22});
    add('crop-camera','crop-camera',[-L*.22,W*.49,1.73],[.10,0,0],[0,0,.07],[0,1,.04],{aspect:1.4,minFacing:.22});
    add('guidance','guidance-computer',[.14,0,1.38],[.12,0,0],[0,.09,0],down,{view:'interior',aspect:1.45,minFacing:.30});
    add('drone-dock','drone-dock',[L*.17,0,p.roofZ+.04],[.18,0,0],[0,.11,0],top,{aspect:1.6,minFacing:.08});
    return slots;
  }

  if(vehicleFutureAbility==='flight'){
    /* Two wings — easiest from Top view. */
    for(const sgn of [-1,1])add(`wing-${sgn>0?'r':'l'}`,'wing',[.20,sgn*W*.73,sport?.62:.68],[.48,0,0],[0,sgn*W*.34,0],top,{aspect:2.8,minFacing:.08});
    /* Four retractable-wheel mechanisms — fitted from underneath. */
    vehicleWheelStations().forEach(([x],axle)=>[-1,1].forEach(sgn=>add(`retract-${axle}-${sgn>0?'r':'l'}`,'retract-wheel',[x,sgn*W*.44,Math.max(.19,p.bodyZ*.46)],[.085,0,0],[0,.085,0],down,{view:'interior',aspect:1,minFacing:.30})));
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
    vehicleWheelStations().forEach(([x],axle)=>[-1,1].forEach(sgn=>add(`retract-${axle}-${sgn>0?'r':'l'}`,'retract-wheel',[x,sgn*W*.44,Math.max(.19,p.bodyZ*.46)],[.085,0,0],[0,.085,0],down,{view:'interior',aspect:1,minFacing:.30})));
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
  const p=vehicleProfile(),L=p.length,W=p.width,H=p.height,y=W*.49,z0=p.bodyZ;
  /* Strongly different silhouettes are intentional. The child must be able to tell the
     selected vehicle from the blueprint alone, before any puzzle piece is fitted. */
  const outlines={
    sport:[[-.50,.00],[-.47,.15],[-.37,.28],[-.19,.36],[-.15,.73],[-.02,.96],[.20,.98],[.39,.70],[.44,.28],[.50,.12],[.48,.00],[-.46,.00]],
    /* High-riding, boxier 4×4 with a long flat roof and upright rear quarter. */
    suv:[[-.50,.03],[-.48,.22],[-.39,.38],[-.24,.45],[-.18,.74],[-.08,.96],[.30,.96],[.40,.84],[.44,.50],[.48,.39],[.50,.18],[.48,.03],[-.47,.03]],
    /* Van: short bonnet, tall passenger/cargo box and nearly vertical rear. */
    van:[[-.50,.04],[-.49,.19],[-.42,.31],[-.34,.60],[-.28,.91],[-.18,.99],[.39,.99],[.46,.94],[.48,.76],[.49,.30],[.50,.10],[.48,.04],[-.48,.04]],
    /* Coach: very long, almost rectangular passenger body with a high window band. */
    coach:[[-.50,.04],[-.495,.24],[-.48,.64],[-.44,.88],[-.37,.98],[.42,.98],[.47,.92],[.49,.70],[.495,.28],[.50,.10],[.49,.04],[-.49,.04]],
    /* Tractor: long low engine bonnet, tall rear cab and agricultural rear section. */
    tractor:[[-.50,.08],[-.49,.23],[-.42,.37],[-.18,.43],[-.10,.49],[-.07,.62],[-.02,.92],[.08,.99],[.28,.99],[.34,.84],[.36,.56],[.47,.46],[.50,.24],[.48,.08],[-.45,.08]]
  };
  const norm=outlines[p.id]||outlines.sport;
  const side=norm.map(([xf,zf])=>[xf*L,-y,z0+zf*(H-z0)]),side2=side.map(v=>[v[0],-v[1],v[2]]),edges=[side,side2];
  const step=Math.max(1,Math.floor(side.length/8));for(let i=0;i<side.length;i+=step)edges.push([side[i],side2[i]]);
  /* Body rails and cabin framing help each vehicle read clearly from every angle. */
  edges.push([[-L*.45,-y*.97,z0+.18],[L*.45,-y*.97,z0+.18]]);
  edges.push([[-L*.45,y*.97,z0+.18],[L*.45,y*.97,z0+.18]]);
  if(p.id==='coach'){
    /* Long passenger window band + luggage line makes the coach unmistakable. */
    [-.36,-.22,-.08,.06,.20,.34,.43].forEach(xf=>edges.push([[xf*L,-y*.98,z0+(H-z0)*.46],[xf*L,-y*.98,z0+(H-z0)*.90]]));
    [-.36,-.22,-.08,.06,.20,.34,.43].forEach(xf=>edges.push([[xf*L,y*.98,z0+(H-z0)*.46],[xf*L,y*.98,z0+(H-z0)*.90]]));
    edges.push([[-L*.42,-y*.98,z0+(H-z0)*.43],[L*.45,-y*.98,z0+(H-z0)*.43]]);
    edges.push([[-L*.42,y*.98,z0+(H-z0)*.43],[L*.45,y*.98,z0+(H-z0)*.43]]);
  }else if(p.id==='van'){
    /* Tall cargo/passenger box and sliding-door split. */
    [-.23,.08,.31].forEach(xf=>{edges.push([[xf*L,-y*.98,z0+(H-z0)*.36],[xf*L,-y*.98,z0+(H-z0)*.88]]);edges.push([[xf*L,y*.98,z0+(H-z0)*.36],[xf*L,y*.98,z0+(H-z0)*.88]])});
    edges.push([[-L*.28,-y*.98,z0+(H-z0)*.92],[L*.39,-y*.98,z0+(H-z0)*.92]]);
    edges.push([[-L*.28,y*.98,z0+(H-z0)*.92],[L*.39,y*.98,z0+(H-z0)*.92]]);
  }else if(p.id==='suv'){
    /* Two-door-row cabin, roof rails and raised belt line. */
    [-.20,.03,.27].forEach(xf=>{edges.push([[xf*L,-y*.98,z0+(H-z0)*.38],[xf*L,-y*.98,z0+(H-z0)*.84]]);edges.push([[xf*L,y*.98,z0+(H-z0)*.38],[xf*L,y*.98,z0+(H-z0)*.84]])});
    edges.push([[-L*.10,-y*.78,H*1.015],[L*.30,-y*.78,H*1.015]]);edges.push([[-L*.10,y*.78,H*1.015],[L*.30,y*.78,H*1.015]]);
  }else if(p.id==='tractor'){
    /* Separate engine bonnet and high cab. */
    edges.push([[-L*.44,-y*.96,z0+(H-z0)*.35],[-L*.08,-y*.96,z0+(H-z0)*.35]]);
    edges.push([[-L*.44,y*.96,z0+(H-z0)*.35],[-L*.08,y*.96,z0+(H-z0)*.35]]);
    edges.push([[-L*.07,-y*.96,z0+(H-z0)*.50],[-L*.07,-y*.96,z0+(H-z0)*.93]]);
    edges.push([[L*.29,-y*.96,z0+(H-z0)*.54],[L*.29,-y*.96,z0+(H-z0)*.93]]);
    edges.push([[-L*.07,y*.96,z0+(H-z0)*.50],[-L*.07,y*.96,z0+(H-z0)*.93]]);
    edges.push([[L*.29,y*.96,z0+(H-z0)*.54],[L*.29,y*.96,z0+(H-z0)*.93]]);
  }else{
    edges.push([[-L*.18,-y*.96,z0+(H-z0)*.42],[-L*.06,-y*.94,H*.90]]);
    edges.push([[-L*.18,y*.96,z0+(H-z0)*.42],[-L*.06,y*.94,H*.90]]);
  }
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
function drawSUVAt(cx,cy,scale,opts={}){
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,angle=opts.angle||0,faceRight=!!opts.faceRight;
  const roadWheelSpin=-wheelSpin; // signed: positive=forward, negative=reverse; reflection handles the visible direction
  const bodyAlpha=opts.bodyAlpha??1,lineAlpha=opts.lineAlpha??0,glassAlpha=opts.glassAlpha??bodyAlpha,wheelAlpha=opts.wheelAlpha??bodyAlpha,lightAlpha=opts.lightAlpha??bodyAlpha;
  const flight=!!opts.flight,water=!!opts.water,retract=!!opts.retractWheels,suspension=opts.suspension||0;
  const dark=vehicleShade(paint,-72),light=vehicleShade(paint,70);
  /* Deliberately upright 4×4 proportions: tall cabin, squared shoulders and high ground clearance. */
  const body=[[-274,18],[-250,-20],[-190,-46],[-118,-56],[-78,-130],[100,-130],[158,-78],[232,-55],[278,-15],[264,52],[-238,58]];
  const roof=[[-118,-56],[-78,-130],[100,-130],[158,-78],[130,-58],[-95,-56]];
  const glass=[[-93,-63],[-68,-116],[-10,-116],[-10,-63],[4,-63],[4,-116],[88,-116],[140,-66],[98,-63]];
  const skid=[[-230,56],[254,51],[226,77],[-202,80]];
  const path=pts=>{tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q[0],q[1]):tctx.moveTo(q[0],q[1]));tctx.closePath();};
  tctx.save();tctx.translate(cx,cy);tctx.rotate(angle);tctx.scale(faceRight?-scale:scale,scale);tctx.globalCompositeOperation='source-over';
  if(glow){tctx.shadowColor='rgba(91,230,255,.95)';tctx.shadowBlur=14+glow*18;}
  if(lineAlpha>0){tctx.save();tctx.globalAlpha=lineAlpha;tctx.strokeStyle='rgba(86,231,255,.98)';tctx.lineWidth=3;tctx.shadowColor='rgba(70,230,255,.9)';tctx.shadowBlur=16;[body,roof,skid].forEach(sh=>{path(sh);tctx.stroke()});tctx.beginPath();tctx.moveTo(-4,-58);tctx.lineTo(-4,42);tctx.moveTo(91,-58);tctx.lineTo(91,42);tctx.stroke();tctx.restore();}
  if(bodyAlpha>0){
    tctx.save();tctx.globalAlpha=bodyAlpha;path(body);const g=tctx.createLinearGradient(-260,-120,265,55);g.addColorStop(0,light);g.addColorStop(.35,paint);g.addColorStop(.72,dark);g.addColorStop(1,paint);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(230,247,252,.80)';tctx.lineWidth=2.2;tctx.stroke();
    path(skid);tctx.fillStyle='rgba(26,35,41,.96)';tctx.fill();
    tctx.globalAlpha=glassAlpha;const win1=[[-82,-62],[-53,-104],[-8,-104],[-8,-61]],win2=[[4,-104],[78,-104],[127,-61],[5,-61]];[win1,win2].forEach(sh=>{path(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,'rgba(140,220,242,.78)');gg.addColorStop(.5,'rgba(31,78,104,.95)');gg.addColorStop(1,'rgba(8,29,46,.98)');tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle='rgba(226,249,255,.72)';tctx.lineWidth=1.5;tctx.stroke();});
    tctx.globalAlpha=bodyAlpha;tctx.strokeStyle='rgba(12,32,44,.45)';tctx.lineWidth=1.6;tctx.beginPath();tctx.moveTo(-3,-55);tctx.lineTo(-3,40);tctx.moveTo(92,-55);tctx.lineTo(92,40);tctx.stroke();
    /* rugged wheel arches, roof rail and side step */
    tctx.strokeStyle='rgba(15,29,38,.72)';tctx.lineWidth=7;tctx.beginPath();tctx.arc(-158,47,60,Math.PI,Math.PI*2);tctx.arc(180,42,60,Math.PI,Math.PI*2);tctx.stroke();
    tctx.strokeStyle='rgba(25,38,46,.90)';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-75,-127);tctx.lineTo(92,-127);tctx.stroke();tctx.fillStyle=dark;tctx.fillRect(-52,53,144,7);
    if(flight){
      if(vehicleFlightSystem==='propeller'){[[-214,-3],[218,-1]].forEach(([px,py])=>{tctx.save();tctx.translate(px,py);tctx.rotate(wheelSpin*1.8);tctx.strokeStyle='rgba(236,249,255,.94)';tctx.lineWidth=3;for(let k=0;k<3;k++){tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(0,28);tctx.stroke();tctx.rotate(Math.PI*2/3)}tctx.restore();});}
      if(vehicleFlightSystem==='jet'){[[230,2],[230,23]].forEach(([jx,jy])=>{tctx.fillStyle='rgba(65,78,88,.96)';tctx.fillRect(jx-16,jy-8,22,16);const fg=tctx.createLinearGradient(jx,jy,jx+54,jy);fg.addColorStop(0,'rgba(255,223,116,.98)');fg.addColorStop(.35,'rgba(255,109,56,.86)');fg.addColorStop(1,'rgba(255,79,42,0)');tctx.fillStyle=fg;tctx.beginPath();tctx.moveTo(jx+4,jy-7);tctx.lineTo(jx+54,jy);tctx.lineTo(jx+4,jy+7);tctx.closePath();tctx.fill();});}
      if(vehicleFlightSystem==='drone'){[[-116,-138],[-10,-148],[96,-138],[190,-66]].forEach(([rx,ry])=>{tctx.save();tctx.translate(rx,ry);tctx.rotate(wheelSpin*1.7);tctx.strokeStyle='rgba(238,249,255,.94)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-16,0);tctx.lineTo(16,0);tctx.moveTo(0,-16);tctx.lineTo(0,16);tctx.stroke();tctx.restore();});}
      tctx.globalAlpha=.76*bodyAlpha;path([[-35,32],[113,31],[101,47],[-27,48]]);tctx.fillStyle=dark;tctx.fill();tctx.globalAlpha=bodyAlpha;
    }
    if(water){tctx.strokeStyle='rgba(78,226,241,.78)';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-210,58);tctx.quadraticCurveTo(20,82,230,57);tctx.stroke();}
    tctx.restore();
  }
  [[-158,58+suspension*8],[180,53-suspension*5]].forEach(([wx,wy])=>{const r=50;tctx.save();tctx.globalAlpha=wheelAlpha;tctx.translate(wx,wy);if(!(retract&&(flight||water))){tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#0b1014';tctx.fill();tctx.strokeStyle='#2f3940';tctx.lineWidth=6;tctx.stroke();tctx.beginPath();tctx.arc(0,0,r*.58,0,Math.PI*2);const rg=tctx.createRadialGradient(-6,-8,2,0,0,r*.6);rg.addColorStop(0,'#f9fcfd');rg.addColorStop(.45,'#aebbc4');rg.addColorStop(1,'#374852');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(247,251,253,.85)';tctx.lineWidth=1.6;for(let k=0;k<6;k++){const a=roadWheelSpin+k*Math.PI/3;tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(Math.cos(a)*r*.47,Math.sin(a)*r*.47);tctx.stroke()}tctx.beginPath();tctx.arc(0,0,r*.12,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();}else{tctx.strokeStyle='rgba(222,245,252,.58)';tctx.lineWidth=3;tctx.strokeRect(-10,-10,20,20);}tctx.restore();});
  if(lightAlpha>0){[[-245,-6,'rgba(229,251,255,.99)'],[252,-2,'rgba(255,76,90,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.globalAlpha=lightAlpha;tctx.shadowColor=c;tctx.shadowBlur=20;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,17,7,0,0,Math.PI*2);tctx.fill();tctx.restore();});}
  tctx.restore();
}
function drawSUVFinishedVehicleReveal(){
  if(!vehicleRevealActive)return;
  const W=templateCanvas.width,H=templateCanvas.height,sc=Math.min(W/800,H/450),ox=(W-800*sc)/2,oy=(H-450*sc)/2;
  const phase1=vehicleRevealStage==='phase1',phase2=['phase2','phase2-ready','phase2-confirmed'].includes(vehicleRevealStage),p=phase1?vehicleRevealProgress:1;
  const bodyT=phase1?vehicleRevealEase(.08,.58,p):1,lineT=phase1?1-vehicleRevealEase(.38,.88,p):0,glassT=phase1?vehicleRevealEase(.28,.70,p):1,wheelT=phase1?vehicleRevealEase(.34,.76,p):1,lightT=phase1?vehicleRevealEase(.62,.94,p):1;
  const pulse=phase2?Math.sin(Math.min(1,vehiclePhase2Progress)*Math.PI):0,slide=phase2?(-16+32*Math.min(1,vehiclePhase2Progress)):0;
  const paint=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):(vehicleTransformationReplay?vehiclePaintColor:'#9fb0ba');
  tctx.save();tctx.translate(ox,oy);tctx.scale(sc,sc);drawSUVAt(400+slide,245+pulse*2,.92*(1+.04*pulse),{paint,glow:.45+pulse*.45,bodyAlpha:bodyT,lineAlpha:lineT,glassAlpha:glassT,wheelAlpha:wheelT,lightAlpha:lightT,wheelSpin:0,flight:false,water:false,faceRight:true});
  if(phase2&&vehiclePaintMix<1){const xx=145+530*vehiclePaintMix;tctx.save();tctx.globalAlpha=.42;const g=tctx.createLinearGradient(xx-50,0,xx+35,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.88)');g.addColorStop(1,'rgba(255,255,255,0)');tctx.fillStyle=g;tctx.fillRect(xx-50,125,85,230);tctx.restore();}
  tctx.restore();
}

function drawVanAt(cx,cy,scale,opts={}){
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,angle=opts.angle||0,faceRight=!!opts.faceRight;
  const roadWheelSpin=-wheelSpin; // signed: positive=forward, negative=reverse; reflection handles the visible direction
  const bodyAlpha=opts.bodyAlpha??1,lineAlpha=opts.lineAlpha??0,glassAlpha=opts.glassAlpha??bodyAlpha,wheelAlpha=opts.wheelAlpha??bodyAlpha,lightAlpha=opts.lightAlpha??bodyAlpha;
  const flight=!!opts.flight,water=!!opts.water,retract=!!opts.retractWheels,sideDoorOpen=clamp(opts.sideDoorOpen||0,0,1),rearDoorsOpen=clamp(opts.rearDoorsOpen||0,0,1);
  const dark=vehicleShade(paint,-76),light=vehicleShade(paint,72),mid=vehicleShade(paint,-22);
  /* Front is local-left. The van has a short bonnet, tall roof, sliding side door and vertical cargo rear. */
  const body=[[-278,32],[-254,-4],[-214,-27],[-160,-39],[-126,-118],[-74,-158],[201,-158],[247,-124],[263,44],[-242,58]];
  const lower=[[-241,58],[263,44],[240,72],[-218,76]];
  const path=pts=>{tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q[0],q[1]):tctx.moveTo(q[0],q[1]));tctx.closePath();};
  tctx.save();tctx.translate(cx,cy);tctx.rotate(angle);tctx.scale(faceRight?-scale:scale,scale);tctx.globalCompositeOperation='source-over';
  if(glow){tctx.shadowColor='rgba(91,230,255,.95)';tctx.shadowBlur=14+glow*18;}
  if(lineAlpha>0){tctx.save();tctx.globalAlpha=lineAlpha;tctx.strokeStyle='rgba(86,231,255,.98)';tctx.lineWidth=3;tctx.shadowColor='rgba(70,230,255,.9)';tctx.shadowBlur=15;[body,lower].forEach(sh=>{path(sh);tctx.stroke()});tctx.beginPath();tctx.moveTo(-80,-154);tctx.lineTo(200,-154);tctx.moveTo(-26,-38);tctx.lineTo(-26,43);tctx.moveTo(110,-40);tctx.lineTo(110,43);tctx.moveTo(224,-112);tctx.lineTo(224,42);tctx.stroke();tctx.restore();}
  if(bodyAlpha>0){
    tctx.save();tctx.globalAlpha=bodyAlpha;path(body);const g=tctx.createLinearGradient(-260,-150,255,60);g.addColorStop(0,light);g.addColorStop(.34,paint);g.addColorStop(.74,dark);g.addColorStop(1,mid);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(230,247,252,.80)';tctx.lineWidth=2.2;tctx.stroke();
    path(lower);tctx.fillStyle='rgba(24,34,42,.97)';tctx.fill();
    const windows=[
      [[-118,-52],[-88,-135],[-32,-135],[-30,-52]],
      [[-18,-135],[58,-135],[58,-52],[-18,-52]],
      [[70,-135],[150,-135],[185,-110],[185,-52],[70,-52]]
    ];
    tctx.globalAlpha=glassAlpha;windows.forEach(sh=>{path(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,'rgba(143,220,242,.78)');gg.addColorStop(.52,'rgba(33,80,105,.95)');gg.addColorStop(1,'rgba(8,29,46,.98)');tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle='rgba(226,249,255,.72)';tctx.lineWidth=1.5;tctx.stroke();});
    tctx.globalAlpha=bodyAlpha;
    /* cabin and sliding-door seams */
    tctx.strokeStyle='rgba(12,32,44,.52)';tctx.lineWidth=1.8;tctx.beginPath();tctx.moveTo(-28,-46);tctx.lineTo(-28,40);tctx.moveTo(69,-46);tctx.lineTo(69,40);tctx.moveTo(194,-45);tctx.lineTo(194,40);tctx.stroke();
    tctx.fillStyle=dark;tctx.beginPath();tctx.ellipse(-132,-44,10,5,-.2,0,Math.PI*2);tctx.fill();
    /* Side passenger opening for the people-carrying part of the van test. */
    if(sideDoorOpen>0){
      tctx.save();tctx.globalAlpha=sideDoorOpen;tctx.fillStyle='rgba(8,18,25,.96)';tctx.fillRect(57,-42,118,78);tctx.strokeStyle='rgba(194,235,248,.38)';tctx.strokeRect(57,-42,118,78);
      const slide=68*sideDoorOpen;tctx.fillStyle=paint;tctx.globalAlpha=.94;tctx.fillRect(69+slide,-38,91,72);tctx.strokeStyle='rgba(228,247,252,.68)';tctx.strokeRect(69+slide,-38,91,72);tctx.restore();
    }
    /* Rear cargo doors: a real dark cargo opening plus two outward-opening doors. */
    tctx.strokeStyle='rgba(16,34,44,.58)';tctx.lineWidth=1.8;tctx.beginPath();tctx.moveTo(224,-108);tctx.lineTo(224,38);tctx.stroke();
    if(rearDoorsOpen>0){
      tctx.save();tctx.globalAlpha=rearDoorsOpen;tctx.fillStyle='rgba(7,17,24,.98)';tctx.fillRect(195,-107,54,143);tctx.strokeStyle='rgba(223,246,254,.45)';tctx.strokeRect(195,-107,54,143);
      const open=rearDoorsOpen;
      path([[247,-106],[247,-38],[294+28*open,-58],[292+22*open,-126]]);tctx.fillStyle=paint;tctx.fill();tctx.strokeStyle='rgba(230,247,252,.78)';tctx.stroke();
      path([[247,-35],[247,36],[300+32*open,56],[297+22*open,-13]]);tctx.fillStyle=mid;tctx.fill();tctx.stroke();
      tctx.restore();
    }
    if(flight){
      if(vehicleFlightSystem==='propeller'){[[-210,7],[219,7]].forEach(([px,py])=>{tctx.save();tctx.translate(px,py);tctx.rotate(wheelSpin*1.7);tctx.strokeStyle='rgba(238,249,255,.94)';tctx.lineWidth=3;for(let k=0;k<3;k++){tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(0,28);tctx.stroke();tctx.rotate(Math.PI*2/3)}tctx.restore();});}
      if(vehicleFlightSystem==='jet'){[[224,3],[224,24]].forEach(([jx,jy])=>{tctx.fillStyle='rgba(56,70,82,.96)';tctx.fillRect(jx-15,jy-8,21,16);const fg=tctx.createLinearGradient(jx,jy,jx+55,jy);fg.addColorStop(0,'rgba(255,225,120,.98)');fg.addColorStop(.4,'rgba(255,110,55,.82)');fg.addColorStop(1,'rgba(255,82,45,0)');tctx.fillStyle=fg;tctx.beginPath();tctx.moveTo(jx+4,jy-7);tctx.lineTo(jx+55,jy);tctx.lineTo(jx+4,jy+7);tctx.closePath();tctx.fill();});}
      if(vehicleFlightSystem==='drone'){[[-87,-168],[8,-174],[104,-168],[198,-128]].forEach(([rx,ry])=>{tctx.save();tctx.translate(rx,ry);tctx.rotate(wheelSpin*1.7);tctx.strokeStyle='rgba(238,249,255,.94)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-16,0);tctx.lineTo(16,0);tctx.moveTo(0,-16);tctx.lineTo(0,16);tctx.stroke();tctx.restore();});}
    }
    if(water){tctx.strokeStyle='rgba(78,226,241,.78)';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-215,59);tctx.quadraticCurveTo(20,84,239,56);tctx.stroke();}
    tctx.restore();
  }
  [[-161,57],[176,53]].forEach(([wx,wy])=>{const r=39;tctx.save();tctx.globalAlpha=wheelAlpha;tctx.translate(wx,wy);if(!(retract&&(flight||water))){tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#0b1014';tctx.fill();tctx.strokeStyle='#2f3940';tctx.lineWidth=6;tctx.stroke();tctx.beginPath();tctx.arc(0,0,r*.58,0,Math.PI*2);const rg=tctx.createRadialGradient(-6,-8,2,0,0,r*.6);rg.addColorStop(0,'#f9fcfd');rg.addColorStop(.45,'#aebbc4');rg.addColorStop(1,'#374852');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(247,251,253,.85)';tctx.lineWidth=1.6;for(let k=0;k<6;k++){const a=roadWheelSpin+k*Math.PI/3;tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(Math.cos(a)*r*.47,Math.sin(a)*r*.47);tctx.stroke()}tctx.beginPath();tctx.arc(0,0,r*.12,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();}else{tctx.strokeStyle='rgba(222,245,252,.58)';tctx.lineWidth=3;tctx.strokeRect(-10,-10,20,20);}tctx.restore();});
  if(lightAlpha>0){[[-250,-1,'rgba(229,251,255,.99)'],[247,2,'rgba(255,76,90,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.globalAlpha=lightAlpha;tctx.shadowColor=c;tctx.shadowBlur=20;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,17,7,0,0,Math.PI*2);tctx.fill();tctx.restore();});}
  tctx.restore();
}
function drawVanFinishedVehicleReveal(){
  if(!vehicleRevealActive)return;
  const W=templateCanvas.width,H=templateCanvas.height,sc=Math.min(W/800,H/450),ox=(W-800*sc)/2,oy=(H-450*sc)/2;
  const phase1=vehicleRevealStage==='phase1',phase2=['phase2','phase2-ready','phase2-confirmed'].includes(vehicleRevealStage),p=phase1?vehicleRevealProgress:1;
  const bodyT=phase1?vehicleRevealEase(.08,.58,p):1,lineT=phase1?1-vehicleRevealEase(.38,.88,p):0,glassT=phase1?vehicleRevealEase(.28,.70,p):1,wheelT=phase1?vehicleRevealEase(.34,.76,p):1,lightT=phase1?vehicleRevealEase(.62,.94,p):1;
  const pulse=phase2?Math.sin(Math.min(1,vehiclePhase2Progress)*Math.PI):0,slide=phase2?(-14+28*Math.min(1,vehiclePhase2Progress)):0;
  const paint=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):(vehicleTransformationReplay?vehiclePaintColor:'#a7b7c1');
  tctx.save();tctx.translate(ox,oy);tctx.scale(sc,sc);drawVanAt(400+slide,247+pulse*2,.78*(1+.035*pulse),{paint,glow:.45+pulse*.45,bodyAlpha:bodyT,lineAlpha:lineT,glassAlpha:glassT,wheelAlpha:wheelT,lightAlpha:lightT,wheelSpin:0,faceRight:true});
  if(phase2&&vehiclePaintMix<1){const xx=160+505*vehiclePaintMix;tctx.save();tctx.globalAlpha=.42;const g=tctx.createLinearGradient(xx-50,0,xx+35,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.88)');g.addColorStop(1,'rgba(255,255,255,0)');tctx.fillStyle=g;tctx.fillRect(xx-50,92,85,270);tctx.restore();}
  tctx.restore();
}
function drawSUVAdventureTestWorld(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase3Progress,0,1);
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.globalCompositeOperation='source-over';tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#163a59');sky.addColorStop(.55,'#5e9fc0');sky.addColorStop(1,'#d6d2b5');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  tctx.fillStyle='#244967';tctx.beginPath();tctx.moveTo(0,245);tctx.lineTo(110,160);tctx.lineTo(188,225);tctx.lineTo(302,125);tctx.lineTo(402,224);tctx.lineTo(536,140);tctx.lineTo(660,228);tctx.lineTo(800,170);tctx.lineTo(800,292);tctx.lineTo(0,292);tctx.closePath();tctx.fill();
  tctx.fillStyle='#668b6d';tctx.beginPath();tctx.moveTo(0,270);tctx.quadraticCurveTo(160,230,315,274);tctx.quadraticCurveTo(505,226,800,273);tctx.lineTo(800,450);tctx.lineTo(0,450);tctx.closePath();tctx.fill();
  /* six readable terrain zones */
  tctx.fillStyle='#465866';tctx.fillRect(0,330,150,120);tctx.fillStyle='#9d8766';tctx.fillRect(150,330,135,120);
  tctx.fillStyle='#6f745e';tctx.beginPath();tctx.moveTo(285,450);tctx.lineTo(350,305);tctx.lineTo(445,355);tctx.lineTo(465,450);tctx.closePath();tctx.fill();
  tctx.fillStyle='#654a3b';tctx.fillRect(465,345,112,105);tctx.fillStyle='#3792b2';tctx.fillRect(577,342,105,108);tctx.fillStyle='#626f78';tctx.beginPath();tctx.moveTo(682,450);tctx.lineTo(742,332);tctx.lineTo(800,350);tctx.lineTo(800,450);tctx.closePath();tctx.fill();
  tctx.strokeStyle='rgba(248,251,252,.75)';tctx.lineWidth=3;tctx.setLineDash([17,14]);tctx.beginPath();tctx.moveTo(10,376);tctx.lineTo(145,376);tctx.stroke();tctx.setLineDash([]);
  for(let i=0;i<18;i++){tctx.fillStyle=i%2?'#c9b18a':'#89775c';tctx.beginPath();tctx.arc(162+i*7,367+(i%3)*8,2.5,0,Math.PI*2);tctx.fill();}
  for(let i=0;i<8;i++){tctx.fillStyle='#7a6758';tctx.beginPath();tctx.arc(315+i*18,376-(i%4)*14,6+(i%3)*2,0,Math.PI*2);tctx.fill();}
  tctx.fillStyle='rgba(99,69,51,.72)';for(let i=0;i<5;i++){tctx.beginPath();tctx.ellipse(485+i*20,382+(i%2)*7,16,5,.1,0,Math.PI*2);tctx.fill();}
  tctx.strokeStyle='rgba(225,250,255,.48)';tctx.lineWidth=2;for(let i=0;i<4;i++){tctx.beginPath();tctx.moveTo(580,360+i*19);tctx.quadraticCurveTo(630,350+i*19,680,360+i*19);tctx.stroke();}
  [['Road',75],['Gravel',216],['Rock climb',368],['Mud',521],['Stream',629],['Future zone',744]].forEach(([lab,x])=>drawFutureWorldLabel(x,315,t(lab,lab)));
  const x=76+668*p;let y=355,ang=0,susp=0;
  if(p<.20){y=354;ang=0;}
  else if(p<.40){const q=(p-.20)/.20;y=354+Math.sin(q*Math.PI*7)*3;ang=Math.sin(q*Math.PI*5)*.025;susp=.35;}
  else if(p<.60){const q=(p-.40)/.20;y=355-58*Math.sin(q*Math.PI);ang=q<.5?-.20:.17;susp=.8;}
  else if(p<.76){const q=(p-.60)/.16;y=358+Math.sin(q*Math.PI*4)*4;ang=.03;susp=.55;}
  else if(p<.88){const q=(p-.76)/.12;y=362+Math.sin(q*Math.PI)*5;ang=.01;susp=.25;}
  else{const q=(p-.88)/.12;y=357-18*q;ang=-.07*q;susp=.2;}
  drawSUVAt(x,y,.48,{paint:vehiclePaintColor,glow:.45,wheelSpin:p*21,angle:ang,suspension:susp,faceRight:true});
  drawRoundedPanel(18,16,250,90,16,'rgba(8,25,36,.72)','rgba(147,232,255,.24)');tctx.fillStyle='#f0f9ff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(t('4×4 Adventure Test World','Monde de test aventure 4×4'),32,40);tctx.fillStyle='rgba(185,225,246,.94)';tctx.font='700 12px system-ui';tctx.fillText(`${t('Power','Énergie')}: ${vehiclePowertrainLabel()}`,32,61);tctx.fillText(t('Road • gravel • rocks • mud • stream','Route • gravier • rochers • boue • ruisseau'),32,80);
  const checks=[[.16,t('Traction','Traction')],[.36,t('Suspension','Suspension')],[.58,t('Ground clearance','Garde au sol')],[.80,t('Safety systems','Systèmes de sécurité')]];checks.forEach(([at,lab],i)=>drawPhase4Badge(625,118+i*35,lab,p>at));
  const powerMsg=vehiclePowertrain==='electric'&&p>.50&&p<.70?t('Regenerative control active','Récupération d’énergie active'):vehiclePowertrain==='hybrid'&&p>.30&&p<.65?t('Hybrid assistance active','Assistance hybride active'):t('All-terrain systems active','Systèmes tout-terrain actifs');
  drawRoundedPanel(570,18,212,48,14,'rgba(8,25,36,.64)','rgba(147,232,255,.18)');tctx.fillStyle='rgba(228,247,255,.95)';tctx.textAlign='center';tctx.font='800 12px system-ui';tctx.fillText(powerMsg,676,47);
  tctx.restore();
}
function drawSUVPhaseFourJourney(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase4Progress,0,1);tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  if(vehicleFutureAbility==='water'){
    const sky=tctx.createLinearGradient(0,0,0,235);sky.addColorStop(0,'#173b57');sky.addColorStop(1,'#82c0d7');tctx.fillStyle=sky;tctx.fillRect(0,0,W,235);tctx.fillStyle='#577c62';tctx.fillRect(0,220,W,75);const sea=tctx.createLinearGradient(0,265,0,H);sea.addColorStop(0,'#39a0c5');sea.addColorStop(1,'#125b85');tctx.fillStyle=sea;tctx.fillRect(0,265,W,H-265);
    tctx.fillStyle='#9a8565';tctx.beginPath();tctx.moveTo(0,450);tctx.lineTo(190,330);tctx.lineTo(270,330);tctx.lineTo(330,450);tctx.closePath();tctx.fill();tctx.beginPath();tctx.moveTo(620,450);tctx.lineTo(690,332);tctx.lineTo(800,332);tctx.lineTo(800,450);tctx.closePath();tctx.fill();
    const a=clamp(p/.22,0,1),b=clamp((p-.22)/.50,0,1),c=clamp((p-.72)/.28,0,1);let x,y,ang=0,retract=false;
    if(p<.22){x=105+175*a;y=332+55*a;ang=.16*a;retract=a>.65;}else if(p<.72){x=280+330*b;y=389-18*Math.sin(b*Math.PI*2);retract=true;}else{x=610+140*c;y=389-60*c;ang=-.18*c;retract=c<.55;}
    drawSUVAt(x,y,.48,{paint:vehiclePaintColor,glow:.55,wheelSpin:p*18,angle:ang,water:p>.14&&p<.88,retractWheels:retract,faceRight:true});
    if(p>.20&&p<.78){tctx.strokeStyle='rgba(235,251,255,.7)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(x-80,y+26);tctx.quadraticCurveTo(x-140,y+42,x-205,y+28);tctx.stroke();}
  }else{
    const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0b3154');sky.addColorStop(.58,'#4c8eb5');sky.addColorStop(1,'#c9d7ca');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);tctx.fillStyle='#294b60';tctx.beginPath();tctx.moveTo(0,310);tctx.lineTo(155,176);tctx.lineTo(310,304);tctx.lineTo(480,150);tctx.lineTo(650,306);tctx.lineTo(800,194);tctx.lineTo(800,370);tctx.lineTo(0,370);tctx.closePath();tctx.fill();
    tctx.fillStyle='#50634e';tctx.beginPath();tctx.moveTo(0,450);tctx.lineTo(0,336);tctx.lineTo(275,316);tctx.lineTo(330,450);tctx.closePath();tctx.fill();tctx.beginPath();tctx.moveTo(585,450);tctx.lineTo(640,316);tctx.lineTo(800,330);tctx.lineTo(800,450);tctx.closePath();tctx.fill();
    const a=clamp(p/.20,0,1),b=clamp((p-.20)/.58,0,1),c=clamp((p-.78)/.22,0,1);let x=132,y=316,ang=0,retract=false;
    if(vehicleFlightSystem==='drone'){
      if(p<.20){x=210;y=316-135*a;retract=a>.25;}else if(p<.78){x=210+390*b;y=181-45*Math.sin(b*Math.PI);ang=.04*Math.sin(b*Math.PI*2);retract=true;}else{x=600+120*c;y=181+135*c;ang=.10*c;retract=c<.70;}
    }else{
      if(p<.20){x=118+165*a;y=316-10*a;ang=-.04*a;retract=a>.72;}else if(p<.78){x=283+330*b;y=300-156*Math.sin(Math.min(1,b*1.2)*Math.PI*.72);ang=-.18+.32*b;retract=true;}else{x=613+110*c;y=190+126*c;ang=.14*(1-c);retract=c<.65;}
    }
    drawSUVAt(x,y,.48,{paint:vehiclePaintColor,glow:.62,wheelSpin:p*24,angle:ang,flight:true,retractWheels:retract,faceRight:true});
  }
  drawRoundedPanel(18,16,268,86,16,'rgba(8,25,36,.74)','rgba(147,232,255,.24)');tctx.fillStyle='#eef9ff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(t('4×4 Future Tech Finale','Finale technologie future 4×4'),32,40);tctx.fillStyle='rgba(185,225,246,.94)';tctx.font='700 12px system-ui';tctx.fillText(vehicleFutureAbility==='water'?t('Amphibious river crossing','Traversée amphibie'):vehicleFlightSystemLabel(),32,62);tctx.fillText(t('Adventure systems + Future Tech','Systèmes aventure + Technologie future'),32,81);
  drawPhase4Badge(622,112,t('Movement','Mouvement'),p>.12);drawPhase4Badge(622,148,t('Power','Énergie'),p>.28);drawPhase4Badge(622,184,t('Safety','Sécurité'),p>.46);drawPhase4Badge(622,220,vehicleFutureAbility==='water'?t('Water system','Système aquatique'):t('Flight system','Système de vol'),p>.68);tctx.restore();
}
function drawSUVCelebration(){
  const W=templateCanvas.width,H=templateCanvas.height,p=vehicleRevealStage==='phase5'?clamp(vehiclePhase5Progress,0,1):1;tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#102e49');sky.addColorStop(.55,'#315f78');sky.addColorStop(1,'#263f3d');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);tctx.fillStyle='#274b58';tctx.beginPath();tctx.moveTo(0,310);tctx.lineTo(150,170);tctx.lineTo(300,303);tctx.lineTo(455,145);tctx.lineTo(615,305);tctx.lineTo(800,184);tctx.lineTo(800,370);tctx.lineTo(0,370);tctx.closePath();tctx.fill();
  tctx.fillStyle='rgba(74,116,86,.86)';tctx.fillRect(0,335,W,115);tctx.fillStyle='rgba(93,228,255,.13)';tctx.beginPath();tctx.ellipse(400,342,245,51,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='rgba(137,234,255,.42)';tctx.lineWidth=2;tctx.beginPath();tctx.ellipse(400,342,220,41,0,0,Math.PI*2);tctx.stroke();
  const arrive=clamp(p/.42,0,1),settle=1-Math.pow(1-arrive,3);drawSUVAt(400+(1-settle)*210,291-(1-settle)*18,.66+.04*Math.sin(clamp((p-.18)/.42,0,1)*Math.PI),{paint:vehiclePaintColor,glow:.82,wheelSpin:p<.42?-p*8:0,faceRight:true});if(vehicleRevealStage==='phase5')drawPhase5Confetti(p);
  const a=clamp((p-.28)/.28,0,1);tctx.globalAlpha=a;tctx.textAlign='center';tctx.shadowColor='rgba(82,228,255,.6)';tctx.shadowBlur=15;tctx.fillStyle='#f5fbff';tctx.font='900 26px system-ui';tctx.fillText(t('MISSION COMPLETE','MISSION TERMINÉE'),400,62);tctx.shadowBlur=0;tctx.fillStyle='rgba(178,234,255,.96)';tctx.font='800 13px system-ui';tctx.fillText(t('Adventure Vehicle Engineer','Ingénieur véhicule d’aventure'),400,86);tctx.globalAlpha=1;
  if(vehicleRevealStage!=='phase5-view'){const aa=clamp((p-.58)/.3,0,1);tctx.globalAlpha=aa;tctx.font='800 11px system-ui';tctx.fillStyle='#e5f6ff';const items=[t('Body & Movement ✓','Carrosserie ✓'),`${vehiclePowertrainLabel()} ✓`,t('Safety ✓','Sécurité ✓'),`${vehicleFinalTechLabel()} ✓`,t('Adventure Test ✓','Test aventure ✓')],xs=[120,265,400,535,680];items.forEach((lab,i)=>{drawRoundedPanel(xs[i]-60,397,120,28,13,'rgba(7,24,36,.62)','rgba(147,232,255,.18)');tctx.fillText(lab,xs[i],415)});tctx.globalAlpha=1;}
  if(vehicleRevealStage==='phase5-view'){drawRoundedPanel(250,365,300,46,18,'rgba(7,24,36,.74)','rgba(147,232,255,.22)');tctx.fillStyle='#e7f7ff';tctx.font='800 14px system-ui';tctx.fillText(vehicleCreationName||t('My 4×4 Adventure Vehicle','Mon véhicule aventure 4×4'),400,393);}tctx.restore();
}


const COACH_ROUTE_PROFILES={
  en:{country:'UK',cities:['London','Birmingham','Manchester'],terminal:['Victoria Coach Terminal','Birmingham Coach Station','Manchester Central Coach Station']},
  fr:{country:'France',cities:['Paris','Lille','Lyon'],terminal:['Gare routière de Paris','Gare routière de Lille','Gare routière de Lyon']},
  es:{country:'Spain',cities:['Madrid','Zaragoza','Barcelona'],terminal:['Estación Sur','Estación Central','Barcelona Nord']},
  pl:{country:'Poland',cities:['Warsaw','Łódź','Kraków'],terminal:['Warszawa Zachodnia','Łódź Fabryczna','Kraków MDA']},
  tr:{country:'Türkiye',cities:['Istanbul','Ankara','Konya'],terminal:['İstanbul Otogarı','Ankara AŞTİ','Konya Otogarı']},
  hi:{country:'India',cities:['Delhi','Agra','Jaipur'],terminal:['Delhi ISBT','Agra Bus Terminal','Jaipur Sindhi Camp']},
  nl:{country:'Netherlands',cities:['Amsterdam','Utrecht','Rotterdam'],terminal:['Amsterdam Sloterdijk','Utrecht Centraal','Rotterdam Centraal']},
  de:{country:'Germany',cities:['Berlin','Leipzig','Munich'],terminal:['Berlin ZOB','Leipzig Hbf','München ZOB']}
};
function coachRouteProfile(){const code=String(lang()||'en').toLowerCase().split('-')[0];return COACH_ROUTE_PROFILES[code]||COACH_ROUTE_PROFILES.en;}
function coachRouteText(){const r=coachRouteProfile();return `${r.cities[0]}  →  ${r.cities[1]}  →  ${r.cities[2]}`;}
function drawCoachAt(cx,cy,scale,opts={}){
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,angle=opts.angle||0,faceRight=!!opts.faceRight;
  const roadWheelSpin=-wheelSpin; // signed: positive=forward, negative=reverse; reflection handles the visible direction
  const bodyAlpha=opts.bodyAlpha??1,lineAlpha=opts.lineAlpha??0,glassAlpha=opts.glassAlpha??bodyAlpha,wheelAlpha=opts.wheelAlpha??bodyAlpha,lightAlpha=opts.lightAlpha??bodyAlpha;
  const doorOpen=clamp(opts.passengerDoorOpen||0,0,1),bayOpen=clamp(opts.luggageBayOpen||0,0,1),flight=!!opts.flight,water=!!opts.water,retract=!!opts.retractWheels;
  const dark=vehicleShade(paint,-78),mid=vehicleShade(paint,-26),light=vehicleShade(paint,72),route=coachRouteProfile();
  const body=[[-330,26],[-319,-28],[-290,-74],[-244,-136],[-186,-163],[230,-163],[296,-132],[326,-70],[332,42],[-310,57]];
  const lower=[[-310,57],[332,42],[310,77],[-284,82]];
  const path=pts=>{tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q[0],q[1]):tctx.moveTo(q[0],q[1]));tctx.closePath();};
  tctx.save();tctx.translate(cx,cy);tctx.rotate(angle);tctx.scale(faceRight?-scale:scale,scale);tctx.globalCompositeOperation='source-over';
  if(glow){tctx.shadowColor='rgba(91,230,255,.95)';tctx.shadowBlur=12+glow*18;}
  if(lineAlpha>0){tctx.save();tctx.globalAlpha=lineAlpha;tctx.strokeStyle='rgba(86,231,255,.98)';tctx.lineWidth=3;tctx.shadowColor='rgba(70,230,255,.9)';tctx.shadowBlur=16;[body,lower].forEach(sh=>{path(sh);tctx.stroke()});for(let x=-200;x<230;x+=82){tctx.beginPath();tctx.moveTo(x,-155);tctx.lineTo(x,-60);tctx.stroke()}tctx.strokeRect(-100,-47,250,57);tctx.restore();}
  if(bodyAlpha>0){
    tctx.save();tctx.globalAlpha=bodyAlpha;path(body);const g=tctx.createLinearGradient(-330,-160,330,70);g.addColorStop(0,light);g.addColorStop(.35,paint);g.addColorStop(.72,dark);g.addColorStop(1,mid);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(230,247,252,.82)';tctx.lineWidth=2.2;tctx.stroke();path(lower);tctx.fillStyle='rgba(20,31,39,.98)';tctx.fill();
    /* Long passenger glazing */
    const windows=[];for(let i=0;i<6;i++){const x=-195+i*75;windows.push([[x,-145],[x+62,-145],[x+62,-71],[x,-71]])}
    windows.unshift([[-277,-125],[-232,-150],[-207,-147],[-207,-72],[-253,-72]]);
    tctx.globalAlpha=glassAlpha;windows.forEach(sh=>{path(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,'rgba(135,216,240,.78)');gg.addColorStop(.5,'rgba(28,71,96,.96)');gg.addColorStop(1,'rgba(7,25,41,.98)');tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle='rgba(221,248,255,.68)';tctx.lineWidth=1.2;tctx.stroke();});
    tctx.globalAlpha=bodyAlpha;
    /* destination display */
    tctx.fillStyle='rgba(8,22,34,.96)';tctx.fillRect(-292,-156,103,22);tctx.strokeStyle='rgba(91,230,255,.62)';tctx.strokeRect(-292,-156,103,22);tctx.fillStyle='#8ef3ff';tctx.font='900 11px system-ui';tctx.textAlign='center';tctx.textBaseline='middle';tctx.save();tctx.translate(-240,-145);if(faceRight)tctx.scale(-1,1);tctx.fillText(route.cities[2].toUpperCase().slice(0,15),0,0);tctx.restore();
    /* lower luggage bays */
    for(const x of [-74,62]){tctx.fillStyle='rgba(26,45,57,.75)';tctx.fillRect(x-62,-48,124,49);tctx.strokeStyle='rgba(206,235,248,.55)';tctx.strokeRect(x-62,-48,124,49);tctx.fillStyle='rgba(210,231,241,.48)';tctx.fillRect(x-10,-27,20,4);}
    if(bayOpen>0){tctx.save();tctx.globalAlpha=bayOpen;tctx.fillStyle='rgba(5,14,21,.98)';tctx.fillRect(-136,-48,260,52);tctx.strokeStyle='rgba(219,244,253,.52)';tctx.strokeRect(-136,-48,260,52);tctx.fillStyle=paint;tctx.globalAlpha=.96;tctx.save();tctx.translate(-6,-49);tctx.rotate(-bayOpen*.72);tctx.fillRect(-128,-4,256,46);tctx.strokeStyle='rgba(231,248,253,.7)';tctx.strokeRect(-128,-4,256,46);tctx.restore();tctx.restore();}
    /* passenger entrance */
    tctx.strokeStyle='rgba(12,30,42,.54)';tctx.lineWidth=1.7;tctx.strokeRect(-305,-68,48,109);
    if(doorOpen>0){tctx.save();tctx.globalAlpha=doorOpen;tctx.fillStyle='rgba(4,13,20,.98)';tctx.fillRect(-307,-68,50,110);tctx.fillStyle=paint;tctx.translate(-257,-13);tctx.scale(1-doorOpen*.72,1);tctx.fillRect(-48,-54,48,108);tctx.restore();}
    /* subtle toilet marker toward rear */
    tctx.fillStyle='rgba(224,244,251,.72)';tctx.font='800 10px system-ui';tctx.textAlign='center';tctx.fillText('WC',221,-17);
    if(flight){
      if(vehicleFlightSystem==='propeller'){[[-245,12],[278,12]].forEach(([px,py])=>{tctx.save();tctx.translate(px,py);tctx.rotate(wheelSpin*1.65);tctx.strokeStyle='rgba(239,250,255,.94)';tctx.lineWidth=3;for(let k=0;k<3;k++){tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(0,32);tctx.stroke();tctx.rotate(Math.PI*2/3)}tctx.restore();});}
      if(vehicleFlightSystem==='jet'){[[302,4],[302,28]].forEach(([jx,jy])=>{tctx.fillStyle='rgba(59,73,84,.96)';tctx.fillRect(jx-18,jy-9,24,18);const fg=tctx.createLinearGradient(jx,jy,jx+62,jy);fg.addColorStop(0,'rgba(255,229,122,.98)');fg.addColorStop(.38,'rgba(255,104,52,.86)');fg.addColorStop(1,'rgba(255,78,41,0)');tctx.fillStyle=fg;tctx.beginPath();tctx.moveTo(jx+4,jy-8);tctx.lineTo(jx+62,jy);tctx.lineTo(jx+4,jy+8);tctx.closePath();tctx.fill();});}
      if(vehicleFlightSystem==='drone'){[[-210,-172],[-70,-178],[80,-178],[224,-165]].forEach(([rx,ry])=>{tctx.save();tctx.translate(rx,ry);tctx.rotate(wheelSpin*1.7);tctx.strokeStyle='rgba(239,250,255,.94)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-18,0);tctx.lineTo(18,0);tctx.moveTo(0,-18);tctx.lineTo(0,18);tctx.stroke();tctx.restore();});}
    }
    if(water){tctx.strokeStyle='rgba(78,226,241,.78)';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-290,58);tctx.quadraticCurveTo(10,86,305,54);tctx.stroke();}
    tctx.restore();
  }
  [[-214,61],[142,58],[245,54]].forEach(([wx,wy],i)=>{const r=i===0?43:45;tctx.save();tctx.globalAlpha=wheelAlpha;tctx.translate(wx,wy);if(!(retract&&(flight||water))){tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#0a0f13';tctx.fill();tctx.strokeStyle='#303a40';tctx.lineWidth=6;tctx.stroke();tctx.beginPath();tctx.arc(0,0,r*.57,0,Math.PI*2);const rg=tctx.createRadialGradient(-6,-8,2,0,0,r*.6);rg.addColorStop(0,'#f8fbfd');rg.addColorStop(.45,'#abb9c2');rg.addColorStop(1,'#374852');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(247,251,253,.84)';tctx.lineWidth=1.6;for(let k=0;k<6;k++){const a=roadWheelSpin+k*Math.PI/3;tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(Math.cos(a)*r*.46,Math.sin(a)*r*.46);tctx.stroke()}tctx.beginPath();tctx.arc(0,0,r*.12,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();}else{tctx.strokeStyle='rgba(222,245,252,.58)';tctx.lineWidth=3;tctx.strokeRect(-10,-10,20,20);}tctx.restore();});
  if(lightAlpha>0){[[-314,-18,'rgba(229,251,255,.99)'],[315,-10,'rgba(255,76,90,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.globalAlpha=lightAlpha;tctx.shadowColor=c;tctx.shadowBlur=18;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,17,7,0,0,Math.PI*2);tctx.fill();tctx.restore();});}
  tctx.restore();
}
function drawCoachFinishedVehicleReveal(){
  if(!vehicleRevealActive)return;
  const W=templateCanvas.width,H=templateCanvas.height,sc=Math.min(W/800,H/450),ox=(W-800*sc)/2,oy=(H-450*sc)/2;
  const phase1=vehicleRevealStage==='phase1',phase2=['phase2','phase2-ready','phase2-confirmed'].includes(vehicleRevealStage),p=phase1?vehicleRevealProgress:1;
  const bodyT=phase1?vehicleRevealEase(.08,.58,p):1,lineT=phase1?1-vehicleRevealEase(.38,.88,p):0,glassT=phase1?vehicleRevealEase(.28,.70,p):1,wheelT=phase1?vehicleRevealEase(.34,.76,p):1,lightT=phase1?vehicleRevealEase(.62,.94,p):1;
  const pulse=phase2?Math.sin(Math.min(1,vehiclePhase2Progress)*Math.PI):0,slide=phase2?(-14+28*Math.min(1,vehiclePhase2Progress)):0;
  const paint=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):(vehicleTransformationReplay?vehiclePaintColor:'#9fb0ba');
  tctx.save();tctx.translate(ox,oy);tctx.scale(sc,sc);drawCoachAt(400+slide,250+pulse*2,.67*(1+.032*pulse),{paint,glow:.42+pulse*.45,bodyAlpha:bodyT,lineAlpha:lineT,glassAlpha:glassT,wheelAlpha:wheelT,lightAlpha:lightT,wheelSpin:0,faceRight:true});
  if(phase2&&vehiclePaintMix<1){const xx=115+575*vehiclePaintMix;tctx.save();tctx.globalAlpha=.40;const g=tctx.createLinearGradient(xx-50,0,xx+35,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.88)');g.addColorStop(1,'rgba(255,255,255,0)');tctx.fillStyle=g;tctx.fillRect(xx-50,78,85,290);tctx.restore();}tctx.restore();
}
function drawCoachPerson(x,y,scale=1,opts={}){
  const child=!!opts.child,baby=!!opts.baby,bag=!!opts.bag,skin=opts.skin||'#c98e68',coat=opts.coat||'#315d7b';
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);const h=child?34:48;
  tctx.fillStyle=skin;tctx.beginPath();tctx.arc(0,-h,child?5:6,0,Math.PI*2);tctx.fill();
  tctx.strokeStyle=coat;tctx.lineWidth=child?5:7;tctx.lineCap='round';tctx.beginPath();tctx.moveTo(0,-h+7);tctx.lineTo(0,-15);tctx.moveTo(0,-31);tctx.lineTo(-11,-22);tctx.moveTo(0,-31);tctx.lineTo(11,-22);tctx.moveTo(0,-15);tctx.lineTo(-8,0);tctx.moveTo(0,-15);tctx.lineTo(8,0);tctx.stroke();
  if(baby){tctx.fillStyle='#d7b08e';tctx.beginPath();tctx.arc(2,-25,5,0,Math.PI*2);tctx.fill();tctx.strokeStyle='#7b4f65';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-7,-34);tctx.lineTo(8,-17);tctx.moveTo(8,-34);tctx.lineTo(-7,-17);tctx.stroke();}
  if(bag){tctx.fillStyle='#7a5060';tctx.fillRect(12,-19,10,15);tctx.strokeStyle='#d3b1ba';tctx.lineWidth=2;tctx.strokeRect(14,-23,6,6);}
  tctx.restore();
}
function drawCoachSuitcase(x,y,scale=1,color='#845e54'){
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);tctx.fillStyle=color;tctx.fillRect(-10,-15,20,22);tctx.strokeStyle='rgba(240,245,248,.65)';tctx.strokeRect(-10,-15,20,22);tctx.beginPath();tctx.moveTo(-4,-15);tctx.lineTo(-4,-21);tctx.lineTo(4,-21);tctx.lineTo(4,-15);tctx.stroke();tctx.restore();
}
function drawCoachRoadHUD(stageText,remaining,passengers){
  const route=coachRouteProfile();drawRoundedPanel(18,16,340,90,15,'rgba(5,20,31,.83)','rgba(100,229,255,.28)');
  tctx.fillStyle='#eaf8ff';tctx.textAlign='left';tctx.font='900 15px system-ui';tctx.fillText(coachRouteText(),32,39);
  tctx.font='700 11px system-ui';tctx.fillStyle='rgba(170,225,246,.94)';tctx.fillText(`${stageText}`,32,59);tctx.fillText(`${t('Passengers','Passagers')}: ${passengers}   ·   ${t('Luggage bays','Soutes')}: ${t('secured','sécurisées')}`,32,78);tctx.fillText(`${t('Route remaining','Distance restante')}: ${remaining} km`,32,96);
  drawRoundedPanel(568,17,214,61,14,'rgba(5,20,31,.76)','rgba(100,229,255,.20)');tctx.textAlign='center';tctx.fillStyle='#9cf3ff';tctx.font='900 12px system-ui';tctx.fillText(`${t('DESTINATION','DESTINATION')}  ${route.cities[2].toUpperCase()}`,675,38);tctx.fillStyle='rgba(220,240,250,.9)';tctx.font='700 11px system-ui';tctx.fillText(`${t('Next stop','Prochain arrêt')}: ${route.cities[1]}`,675,58);
}
function drawCoachIntercityWorld(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase3Progress,0,1),route=coachRouteProfile();
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0c2e4b');sky.addColorStop(.55,'#377aa1');sky.addColorStop(1,'#bfd8df');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  tctx.fillStyle='#315b72';for(let i=0;i<10;i++){const x=i*92,h=48+(i%4)*21;tctx.fillRect(x,235-h,62,h);tctx.fillStyle='rgba(155,218,242,.25)';for(let r=0;r<3;r++)for(let c=0;c<2;c++)tctx.fillRect(x+10+c*25,247-h+r*17,10,8);tctx.fillStyle='#315b72';}
  tctx.fillStyle='#35566b';tctx.fillRect(0,315,W,135);tctx.fillStyle='#476779';tctx.fillRect(0,330,W,120);tctx.strokeStyle='rgba(247,251,253,.76)';tctx.lineWidth=4;tctx.setLineDash([22,18]);tctx.beginPath();tctx.moveTo(0,390);tctx.lineTo(W,390);tctx.stroke();tctx.setLineDash([]);
  /* terminal / stop-over canopies */
  if(p<.30){tctx.fillStyle='#243f55';tctx.fillRect(42,168,245,120);tctx.fillStyle='#5de4ff';tctx.fillRect(42,168,245,10);tctx.fillStyle='#e8f7fd';tctx.font='900 15px system-ui';tctx.textAlign='center';tctx.fillText(route.terminal[0],165,195);}
  if(p>.55&&p<.78){tctx.fillStyle='#243f55';tctx.fillRect(535,183,220,105);tctx.fillStyle='#ffd15d';tctx.fillRect(535,183,220,9);tctx.fillStyle='#eef9fd';tctx.font='900 14px system-ui';tctx.textAlign='center';tctx.fillText(route.terminal[1],645,208);}
  let coachX=420,coachY=329,door=0,bay=0,passengerCount=5,remain=Math.max(0,Math.round(310*(1-p))),coachWheelSpin=0;
  if(p<.12){
    /* Parked at the departure terminal: absolutely no vehicle or tyre movement. */
    coachX=420;door=0;bay=0;coachWheelSpin=0;
  }
  else if(p<.30){
    /* Boarding and luggage loading happen only while the coach is fully stopped. */
    const q=(p-.12)/.18;coachX=420;door=Math.sin(Math.min(1,q)*Math.PI*.75);bay=Math.sin(Math.min(1,q)*Math.PI*.75);coachWheelSpin=0;
  }
  else if(p<.55){
    /* The terminal stays fixed; the coach itself now drives toward the stopover. */
    const q=(p-.30)/.25;coachX=420+155*q;coachWheelSpin=q*18;
  }
  else if(p<.78){
    /* Scheduled stopover: coach parked, wheels stopped, passengers can leave safely. */
    coachX=575;door=Math.sin(((p-.55)/.23)*Math.PI);passengerCount=p>.68?3:5;coachWheelSpin=0;
  }
  else{
    /* Departure from the stopover toward the final city. */
    const q=(p-.78)/.22;coachX=575+70*q;passengerCount=3;coachWheelSpin=q*12;
  }
  drawCoachAt(coachX,coachY,.56,{paint:vehiclePaintColor,glow:.32,wheelSpin:coachWheelSpin,faceRight:true,passengerDoorOpen:door,luggageBayOpen:bay});
  /* boarding group: adult, parent+child, woman with baby carrier, adult with bag */
  if(p<.30){const q=clamp((p-.12)/.18,0,1),target=coachX+151;const persons=[
    {x:92,skin:'#b97954',coat:'#4d7190',bag:true},{x:132,skin:'#d9a47e',coat:'#7a5068'},{x:174,skin:'#8d5f45',coat:'#406e5c',baby:true},{x:218,skin:'#d6a17d',coat:'#6d5b87',bag:true}
  ];persons.forEach((pp,i)=>{const qq=clamp(q*1.35-i*.13,0,1);drawCoachPerson(pp.x+(target-pp.x)*qq,322,1,pp)});const cq=clamp(q*1.35-.18,0,1);drawCoachPerson(151+(target+6-151)*cq,325,.82,{child:true,skin:'#b97954',coat:'#e0a646'});
    [[106,350],[164,348],[220,350]].forEach(([x,y],i)=>{const qq=clamp(q*1.45-i*.15,0,1);drawCoachSuitcase(x+(coachX-25-x)*qq,y-qq*18,.9,['#865d54','#4d6c86','#7b596e'][i])});
  }
  if(p>.55&&p<.78){const q=clamp((p-.59)/.12,0,1);if(q>0){drawCoachPerson(570+70*q,321,1,{skin:'#d9a47e',coat:'#7a5068'});drawCoachPerson(597+78*q,323,.82,{child:true,skin:'#b97954',coat:'#e0a646'});}}
  const stageText=p<.12?t('Boarding terminal','Terminal de départ'):p<.30?t('Boarding & luggage loading','Embarquement et bagages'):p<.55?t('Intercity highway','Route interurbaine'):p<.78?t('Scheduled stopover','Arrêt intermédiaire'):t('Continuing to final city','En route vers la ville finale');
  drawCoachRoadHUD(stageText,remain,passengerCount);
  tctx.restore();
}
function drawCoachPhaseFourJourney(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase4Progress,0,1),route=coachRouteProfile();
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#102d49');sky.addColorStop(.55,'#3a7396');sky.addColorStop(1,'#c7d7d4');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  /* scenic motorway / future bypass */
  tctx.fillStyle='#2a526b';tctx.beginPath();tctx.moveTo(0,278);tctx.lineTo(120,188);tctx.lineTo(240,268);tctx.lineTo(382,160);tctx.lineTo(522,272);tctx.lineTo(665,175);tctx.lineTo(800,270);tctx.lineTo(800,330);tctx.lineTo(0,330);tctx.closePath();tctx.fill();
  tctx.fillStyle='#334f60';tctx.fillRect(0,340,W,110);tctx.strokeStyle='rgba(247,251,253,.72)';tctx.lineWidth=4;tctx.setLineDash([22,18]);tctx.beginPath();tctx.moveTo(0,391);tctx.lineTo(W,391);tctx.stroke();tctx.setLineDash([]);
  const techEnd=.56;let x=400,y=335,ang=0,flight=false,water=false,retract=false,faceRight=true;
  if(vehicleFutureAbility==='flight'&&p<techEnd){const q=p/techEnd;flight=true;retract=q>.14;x=360+95*q;y=330-130*Math.sin(q*Math.PI);ang=-.12*Math.sin(q*Math.PI*2);tctx.fillStyle='rgba(18,44,60,.85)';tctx.fillRect(0,338,340,15);tctx.fillRect(515,338,285,15);tctx.fillStyle='rgba(173,82,65,.88)';tctx.fillRect(340,338,175,15);tctx.fillStyle='rgba(255,236,205,.95)';tctx.font='900 12px system-ui';tctx.textAlign='center';tctx.fillText(t('AERIAL BYPASS — ROUTE DISRUPTION','DÉVIATION AÉRIENNE — ROUTE COUPÉE'),427,329);}
  else if(vehicleFutureAbility==='water'&&p<techEnd){const q=p/techEnd;water=true;retract=q>.12;x=350+120*q;y=361+Math.sin(q*Math.PI*3)*2;tctx.fillStyle='#2f82ad';tctx.fillRect(255,337,340,113);tctx.strokeStyle='rgba(205,244,255,.48)';tctx.lineWidth=2;for(let i=0;i<4;i++){tctx.beginPath();tctx.moveTo(260,355+i*20);tctx.quadraticCurveTo(425,344+i*20,590,355+i*20);tctx.stroke()}tctx.fillStyle='rgba(255,244,210,.95)';tctx.font='900 12px system-ui';tctx.textAlign='center';tctx.fillText(t('AMPHIBIOUS CROSSING','TRAVERSÉE AMPHIBIE'),425,326);}
  else{const q=clamp((p-techEnd)/.20,0,1);x=300+180*q;y=334;faceRight=true;tctx.fillStyle='#254459';tctx.fillRect(548,190,225,100);tctx.fillStyle='#5de4ff';tctx.fillRect(548,190,225,9);tctx.fillStyle='#eef9fd';tctx.font='900 15px system-ui';tctx.textAlign='center';tctx.fillText(route.terminal[2],660,218);tctx.fillStyle='#9cf3ff';tctx.font='900 12px system-ui';tctx.fillText(`${t('ARRIVED','ARRIVÉE')} · ${route.cities[2].toUpperCase()}`,660,241);}
  const coachMoving=p<techEnd || (p>=techEnd&&p<.76);
  const coachWheelSpin=coachMoving?p*24:0;
  drawCoachAt(x,y,.56,{paint:vehiclePaintColor,glow:.38,wheelSpin:coachWheelSpin,angle:ang,faceRight,flight,water,retractWheels:retract,passengerDoorOpen:p>.78?clamp((p-.78)/.08,0,1):0,luggageBayOpen:p>.84?clamp((p-.84)/.08,0,1):0});
  if(p>.80){const q=clamp((p-.82)/.16,0,1);drawCoachPerson(556+110*q,324,1,{skin:'#8d5f45',coat:'#406e5c',baby:true});drawCoachPerson(586+120*q,322,1,{skin:'#b97954',coat:'#4d7190',bag:true});drawCoachPerson(618+126*q,322,1,{skin:'#d6a17d',coat:'#6d5b87'});[[510,353],[540,352]].forEach(([sx,sy],i)=>drawCoachSuitcase(sx+105*q,sy,.9,i?'#4d6c86':'#865d54'));}
  drawCoachRoadHUD(p<techEnd?(vehicleFutureAbility==='flight'?t('Aerial bypass authorised','Déviation aérienne autorisée'):t('Amphibious crossing active','Traversée amphibie active')):t('Final destination arrival','Arrivée à destination'),Math.round(Math.max(0,120*(1-p))),p>.80?0:3);
  drawPhase4Badge(622,112,t('Passenger safety','Sécurité passagers'),p>.18);drawPhase4Badge(622,148,t('Power system','Système d’énergie'),p>.32);drawPhase4Badge(622,184,t('Future Tech','Technologie future'),p>.52);drawPhase4Badge(622,220,t('Destination reached','Destination atteinte'),p>.88);
  tctx.restore();
}
function drawCoachCelebration(){
  const W=templateCanvas.width,H=templateCanvas.height,p=vehicleRevealStage==='phase5'?clamp(vehiclePhase5Progress,0,1):1,route=coachRouteProfile();
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  const bg=tctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#13283e');bg.addColorStop(.55,'#31536c');bg.addColorStop(1,'#162735');tctx.fillStyle=bg;tctx.fillRect(0,0,W,H);
  /* mature terminal-at-dusk reveal, no childish confetti */
  tctx.fillStyle='#20384b';tctx.fillRect(60,158,680,132);tctx.fillStyle='#5de4ff';tctx.fillRect(60,158,680,8);for(let i=0;i<7;i++){tctx.fillStyle='rgba(166,222,244,.22)';tctx.fillRect(92+i*88,186,54,58)}
  tctx.fillStyle='#eef9fd';tctx.font='900 16px system-ui';tctx.textAlign='center';tctx.fillText(route.terminal[2],400,186);tctx.fillStyle='#9cf3ff';tctx.font='900 13px system-ui';tctx.fillText(`${t('ARRIVED','ARRIVÉE')} · ${route.cities[2].toUpperCase()}`,400,211);
  tctx.fillStyle='rgba(75,217,255,.10)';tctx.beginPath();tctx.ellipse(400,365,285,48,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='rgba(98,225,255,.34)';tctx.lineWidth=2;tctx.beginPath();tctx.ellipse(400,365,260,39,0,0,Math.PI*2);tctx.stroke();
  const arrive=clamp(p/.40,0,1),settle=1-Math.pow(1-arrive,3);drawCoachAt(400+(1-settle)*215,318-(1-settle)*18,.58,{paint:vehiclePaintColor,glow:.66,wheelSpin:p<.40?-p*8:0,faceRight:true});
  const a=clamp((p-.28)/.28,0,1);tctx.save();tctx.globalAlpha=a;tctx.textAlign='center';tctx.fillStyle='#f4fbff';tctx.font='900 24px system-ui';tctx.fillText(t('INTERCITY JOURNEY COMPLETE','TRAJET INTERURBAIN TERMINÉ'),400,55);tctx.fillStyle='rgba(169,231,255,.94)';tctx.font='800 13px system-ui';tctx.fillText(t('Intercity Transport Engineer','Ingénieur transport interurbain'),400,79);tctx.restore();
  const r=clamp((p-.52)/.28,0,1);tctx.save();tctx.globalAlpha=r;drawRoundedPanel(128,95,544,48,15,'rgba(8,25,36,.72)','rgba(147,232,255,.22)');tctx.fillStyle='#dff7ff';tctx.font='800 12px system-ui';tctx.textAlign='center';tctx.fillText(`${route.cities[0]}  →  ${route.cities[1]}  →  ${route.cities[2]}   ·   ${t('Passengers safe','Passagers en sécurité')}   ·   ${t('Luggage accounted for','Bagages remis')}`,400,124);tctx.restore();
  tctx.restore();
}

function drawTractorDriver(x,y,scale=1,shirt='#e7b94e'){
  /* The tractor model's local FRONT is to the left. The whole tractor flips when travel direction changes,
     so the seated driver, seat and steering wheel always remain physically correct inside the cab. */
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);
  /* seat */
  tctx.fillStyle='#22323a';tctx.fillRect(4,-14,18,29);tctx.fillStyle='#314650';tctx.fillRect(1,10,25,7);
  /* steering column + wheel */
  tctx.strokeStyle='#1d2b32';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-15,-7);tctx.lineTo(-24,-18);tctx.stroke();
  tctx.beginPath();tctx.arc(-27,-21,8,0,Math.PI*2);tctx.stroke();
  /* seated driver: torso, head, bent legs */
  tctx.fillStyle='#8f6248';tctx.beginPath();tctx.arc(-2,-38,8,0,Math.PI*2);tctx.fill();
  tctx.fillStyle=shirt;tctx.beginPath();tctx.moveTo(-10,-29);tctx.lineTo(8,-29);tctx.lineTo(11,-5);tctx.lineTo(-7,-5);tctx.closePath();tctx.fill();
  /* arms reaching the steering wheel */
  tctx.strokeStyle='#8f6248';tctx.lineWidth=4;tctx.lineCap='round';tctx.beginPath();tctx.moveTo(-7,-23);tctx.lineTo(-19,-18);tctx.lineTo(-26,-21);tctx.moveTo(4,-22);tctx.lineTo(-13,-14);tctx.lineTo(-23,-19);tctx.stroke();
  /* bent legs: hip -> knee -> feet */
  tctx.strokeStyle='#273844';tctx.lineWidth=5;tctx.beginPath();tctx.moveTo(-1,-4);tctx.lineTo(-12,6);tctx.lineTo(-20,17);tctx.moveTo(7,-4);tctx.lineTo(-4,8);tctx.lineTo(-10,19);tctx.stroke();
  tctx.restore();
}
function drawFarmPerson(x,y,scale=1,opts={}){
  const skin=opts.skin||"#a76f50",shirt=opts.shirt||"#3d7391",child=!!opts.child,time=opts.time||0;
  const s=scale*(child?.78:1),arm=(opts.armSwing??Math.sin(time*6)*4),leg=(opts.legSwing??Math.cos(time*6)*4);
  tctx.save();tctx.translate(x,y);tctx.scale(s,s);
  if(opts.flip)tctx.scale(-1,1);
  if(opts.pose==="bend"){
    tctx.rotate(-.22);
  }
  if(opts.shadow!==false){tctx.fillStyle="rgba(0,0,0,.12)";tctx.beginPath();tctx.ellipse(0,24,12,4,0,0,Math.PI*2);tctx.fill();}
  if(opts.pose==="sit"){
    tctx.fillStyle=skin;tctx.beginPath();tctx.arc(0,-26,7,0,Math.PI*2);tctx.fill();
    tctx.fillStyle=shirt;tctx.fillRect(-7,-18,14,20);
    tctx.strokeStyle="#253746";tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-4,2);tctx.lineTo(10,6);tctx.lineTo(13,15);tctx.moveTo(3,2);tctx.lineTo(-8,7);tctx.lineTo(-8,16);tctx.moveTo(-6,-10);tctx.lineTo(-13,-2);tctx.moveTo(5,-10);tctx.lineTo(9+arm*.15,-2);tctx.stroke();
    if(opts.cup){const sip=(Math.sin(time*3)+1)/2,cx=8-sip*5,cy=-7-sip*13;tctx.fillStyle="#f8f4df";tctx.fillRect(cx,cy,6,8);tctx.strokeStyle="#d7c66a";tctx.lineWidth=1.5;tctx.strokeRect(cx,cy,6,8);tctx.strokeStyle=skin;tctx.lineWidth=2.5;tctx.beginPath();tctx.moveTo(6,-9);tctx.lineTo(cx+2,cy+5);tctx.stroke();}
  }else if(opts.pose==="lie"){
    tctx.rotate(-.08);tctx.fillStyle=skin;tctx.beginPath();tctx.arc(-15,-6,7,0,Math.PI*2);tctx.fill();tctx.fillStyle=shirt;tctx.fillRect(-10,-14,28,13);tctx.strokeStyle="#253746";tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(16,-8);tctx.lineTo(28,-10);tctx.moveTo(15,-1);tctx.lineTo(28,4);tctx.moveTo(-2,-1);tctx.lineTo(12,11);tctx.moveTo(-6,-7);tctx.lineTo(6,8);tctx.stroke();
  }else{
    tctx.fillStyle=skin;tctx.beginPath();tctx.arc(0,-24,7,0,Math.PI*2);tctx.fill();tctx.fillStyle=shirt;tctx.fillRect(-7,-16,14,22);tctx.strokeStyle="#253746";tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-5,6);tctx.lineTo(-7+leg*.12,20);tctx.moveTo(5,6);tctx.lineTo(7-leg*.12,20);tctx.moveTo(-6,-8);tctx.lineTo(-13,-1+arm*.20);tctx.moveTo(6,-8);tctx.lineTo(13,2-arm*.20);tctx.stroke();
  }
  tctx.restore();
}

function drawFarmRestArea(x,y,opts={}){
  const phase=opts.phase||0,occupant=opts.occupant||"girl",mode=opts.mode||"sit",time=opts.time||0;
  tctx.save();tctx.translate(x,y);
  tctx.fillStyle="rgba(0,0,0,.10)";tctx.beginPath();tctx.ellipse(0,38,68,13,0,0,Math.PI*2);tctx.fill();
  tctx.strokeStyle="#7e5d39";tctx.lineWidth=4;tctx.beginPath();tctx.moveTo(-48,34);tctx.lineTo(-48,-20);tctx.moveTo(48,34);tctx.lineTo(48,-20);tctx.stroke();
  tctx.fillStyle="#d6c18a";tctx.beginPath();tctx.moveTo(-62,-18);tctx.lineTo(0,-54);tctx.lineTo(62,-18);tctx.closePath();tctx.fill();
  tctx.fillStyle="rgba(255,242,210,.55)";tctx.fillRect(-52,-18,104,44);
  tctx.fillStyle="#8c6f4a";tctx.fillRect(-20,10,40,5);tctx.fillRect(-18,15,4,17);tctx.fillRect(14,15,4,17);
  tctx.fillStyle="#6f8f54";tctx.beginPath();tctx.arc(58,24,9+2*Math.sin(time*4),0,Math.PI*2);tctx.fill();
  tctx.fillStyle="#9e7346";tctx.fillRect(54,24,5,12);
  if(opts.showSign){tctx.fillStyle="#32454f";tctx.fillRect(-60,-64,70,16);tctx.fillStyle="#f2fbff";tctx.font="700 9px system-ui";tctx.textAlign="center";tctx.fillText(t("REST AREA","AIRE DE REPOS"),-25,-53);}
  if(occupant){
    if(mode==="sit"){
      drawFarmPerson(-2,12,.92,{child:true,shirt:occupant==="girl"?"#6c5b99":"#d19943",skin:occupant==="girl"?"#c5835e":"#d29a76",pose:"sit",cup:true,time});
    }else{
      drawFarmPerson(-8,6,.92,{child:true,shirt:occupant==="girl"?"#6c5b99":"#d19943",skin:occupant==="girl"?"#c5835e":"#d29a76",pose:"lie",time});
    }
  }
  tctx.restore();
}

function drawFarmActivityZone(x,y,opts={}){
  const time=opts.time||0,type=opts.type||"plant";
  tctx.save();tctx.translate(x,y);
  if(type==="plant"){
    tctx.fillStyle="#8d6139";tctx.fillRect(-42,6,84,26);
    for(let i=0;i<4;i++){tctx.strokeStyle="#4b7f38";tctx.lineWidth=2;tctx.beginPath();const px=-28+i*18;tctx.moveTo(px,8);tctx.lineTo(px,0-((i%2)?6:0)-Math.sin(time*4+i)*1.5);tctx.stroke();tctx.beginPath();tctx.moveTo(px,2);tctx.lineTo(px-5,-4);tctx.moveTo(px,0);tctx.lineTo(px+5,-6);tctx.stroke();}
    drawFarmPerson(-10,12,.88,{child:true,shirt:"#d19943",pose:"bend",time});
  }else if(type==="tools"){
    tctx.fillStyle="#8b6138";tctx.fillRect(-34,12,68,16);tctx.fillStyle="#c6b188";tctx.fillRect(-18,-10,14,20);tctx.fillRect(4,-6,16,16);
  }
  tctx.restore();
}

function drawFarmPhaseCharacters(seg,local){
  const time=local+seg*.37;
  if(seg===0){
    drawFarmRestArea(124,286,{occupant:"girl",mode:"sit",time,showSign:true});
    drawFarmPerson(244,286,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmActivityZone(660,300,{type:"plant",time});
    drawFarmPerson(742,284,1,{shirt:"#365e80",time});
  }else if(seg===1){
    drawFarmRestArea(122,285,{occupant:null,time,showSign:true});
    drawFarmPerson(84,286,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmActivityZone(216,304,{type:"plant",time});
    drawFarmPerson(704,285,1,{shirt:"#365e80",time});
    drawFarmPerson(642,300,.92,{skin:"#c5835e",child:true,shirt:"#6c5b99",time});
  }else if(seg===2){
    drawFarmRestArea(122,285,{occupant:"boy",mode:"lie",time,showSign:true});
    drawFarmPerson(214,288,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmPerson(702,286,1,{shirt:"#365e80",time});
    drawFarmPerson(632,301,.92,{skin:"#c5835e",child:true,shirt:"#6c5b99",time});
  }else if(seg===3){
    drawFarmRestArea(124,285,{occupant:null,time,showSign:true});
    drawFarmPerson(88,286,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmActivityZone(248,302,{type:"plant",time});
    drawFarmPerson(716,286,1,{shirt:"#365e80",time});
    drawFarmPerson(610,298,.92,{skin:"#c5835e",child:true,shirt:"#6c5b99",time});
  }else if(seg===4){
    drawFarmRestArea(122,286,{occupant:"girl",mode:"sit",time,showSign:true});
    drawFarmPerson(248,286,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmActivityZone(650,304,{type:"plant",time});
    drawFarmPerson(735,286,1,{shirt:"#365e80",time});
  }else{
    drawFarmRestArea(122,286,{occupant:"boy",mode:"sit",time,showSign:true});
    drawFarmPerson(250,286,1,{skin:"#d29a76",shirt:"#8a5d6a",time});
    drawFarmPerson(710,286,1,{shirt:"#365e80",time});
    drawFarmPerson(630,300,.92,{skin:"#c5835e",child:true,shirt:"#6c5b99",time});
  }
}

function drawTractorImplement(kind,spin=0){
  tctx.save();tctx.lineCap='round';tctx.lineJoin='round';
  if(kind==='mower'){
    /* Front-mounted mower: the cutting deck reaches the grass before the tractor does. */
    tctx.strokeStyle='#6c7c88';tctx.lineWidth=7;tctx.beginPath();tctx.moveTo(-184,20);tctx.lineTo(-232,34);tctx.stroke();
    tctx.fillStyle='#d9b12f';tctx.fillRect(-318,22,92,24);tctx.strokeStyle='#24333c';tctx.lineWidth=3;tctx.strokeRect(-318,22,92,24);
    for(let i=0;i<3;i++){tctx.save();tctx.translate(-300+i*29,48);tctx.rotate(spin*2.8+i*.8);tctx.strokeStyle='#f1f6f8';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-14,0);tctx.lineTo(14,0);tctx.moveTo(0,-6);tctx.lineTo(0,6);tctx.stroke();tctx.restore();}
  }else if(kind==='plough'){
    tctx.strokeStyle='#667985';tctx.lineWidth=7;tctx.beginPath();tctx.moveTo(185,20);tctx.lineTo(234,30);tctx.lineTo(306,41);tctx.stroke();
    for(let i=0;i<4;i++){tctx.fillStyle='#b9c7ce';tctx.beginPath();tctx.moveTo(235+i*20,31);tctx.quadraticCurveTo(248+i*20,53,236+i*20,67);tctx.lineTo(252+i*20,61);tctx.quadraticCurveTo(260+i*20,43,250+i*20,34);tctx.closePath();tctx.fill();}
    /* vibrating tine bar makes the implement look engaged rather than pasted on */
    tctx.strokeStyle='rgba(230,244,248,.8)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(235,42+Math.sin(spin)*2);tctx.lineTo(303,52+Math.sin(spin+1)*2);tctx.stroke();
  }else if(kind==='seeder'){
    tctx.strokeStyle='#687983';tctx.lineWidth=7;tctx.beginPath();tctx.moveTo(185,20);tctx.lineTo(230,30);tctx.stroke();tctx.fillStyle='#dca43d';tctx.fillRect(228,10,86,42);tctx.fillStyle='#293b44';for(let i=0;i<5;i++)tctx.fillRect(235+i*16,50,5,18);
    tctx.fillStyle='rgba(255,238,157,.9)';for(let i=0;i<5;i++){const yy=66+((spin*14+i*11)%18);tctx.beginPath();tctx.arc(237+i*16,yy,2,0,Math.PI*2);tctx.fill();}
  }else if(kind==='irrigator'){
    tctx.strokeStyle='#6d7e87';tctx.lineWidth=7;tctx.beginPath();tctx.moveTo(185,20);tctx.lineTo(225,25);tctx.stroke();tctx.fillStyle='#4d93b1';tctx.beginPath();tctx.ellipse(260,17,45,28,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='#91e8ff';tctx.lineWidth=4;tctx.beginPath();tctx.moveTo(225,-10);tctx.lineTo(320,-18);tctx.stroke();
    for(let i=0;i<6;i++){const xx=236+i*16,pulse=.55+.45*Math.sin(spin*2+i);tctx.strokeStyle=`rgba(106,216,255,${.40+.35*pulse})`;tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(xx,-15);tctx.quadraticCurveTo(xx+6,2,xx+4,24+pulse*5);tctx.stroke();}
  }else if(kind==='loader'){
    const lift=Math.sin(spin*.9)*5;
    tctx.strokeStyle='#d4a13a';tctx.lineWidth=11;tctx.beginPath();tctx.moveTo(-72,-40);tctx.lineTo(-166,-14-lift);tctx.lineTo(-205,25-lift);tctx.stroke();tctx.fillStyle='#8d6532';tctx.beginPath();tctx.moveTo(-224,18-lift);tctx.lineTo(-175,18-lift);tctx.lineTo(-158,48-lift);tctx.lineTo(-232,48-lift);tctx.closePath();tctx.fill();tctx.strokeStyle='#e6ba5a';tctx.lineWidth=3;tctx.stroke();
  }
  tctx.restore();
}
function drawTractorAt(cx,cy,scale,opts={}){
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,toolSpin=opts.toolSpin??wheelSpin,angle=opts.angle||0,faceRight=opts.faceRight!==false,bodyAlpha=opts.bodyAlpha??1,lineAlpha=opts.lineAlpha??0,glassAlpha=opts.glassAlpha??bodyAlpha,wheelAlpha=opts.wheelAlpha??bodyAlpha,lightAlpha=opts.lightAlpha??bodyAlpha;
  const implement=opts.implement||'',driver=opts.driver!==false,smart=!!opts.smart,roadWheelSpin=-wheelSpin,dark=vehicleShade(paint,-74),light=vehicleShade(paint,62);
  const path=pts=>{tctx.beginPath();pts.forEach((q,i)=>i?tctx.lineTo(q[0],q[1]):tctx.moveTo(q[0],q[1]));tctx.closePath();};
  tctx.save();tctx.translate(cx,cy);tctx.rotate(angle);tctx.scale(faceRight?-scale:scale,scale);if(glow){tctx.shadowColor='rgba(90,230,255,.95)';tctx.shadowBlur=12+glow*18;}
  if(lineAlpha>0){tctx.save();tctx.globalAlpha=lineAlpha;tctx.strokeStyle='rgba(89,235,255,.98)';tctx.lineWidth=3;tctx.shadowColor='rgba(61,225,255,.9)';tctx.shadowBlur=14;path([[-200,20],[-180,-18],[-120,-34],[-84,-82],[-56,-148],[62,-148],[98,-94],[110,-36],[170,-26],[206,12],[192,52],[-183,57]]);tctx.stroke();tctx.restore();}
  if(bodyAlpha>0){
    tctx.globalAlpha=bodyAlpha;path([[-200,20],[-180,-18],[-120,-34],[-84,-82],[-56,-148],[62,-148],[98,-94],[110,-36],[170,-26],[206,12],[192,52],[-183,57]]);const g=tctx.createLinearGradient(-190,-145,205,55);g.addColorStop(0,light);g.addColorStop(.38,paint);g.addColorStop(.76,dark);g.addColorStop(1,paint);tctx.fillStyle=g;tctx.fill();tctx.strokeStyle='rgba(232,247,251,.76)';tctx.lineWidth=2;tctx.stroke();
    /* long engine bonnet */ tctx.fillStyle=vehicleShade(paint,-18);tctx.fillRect(-191,-18,96,54);tctx.strokeStyle='rgba(20,39,46,.48)';tctx.strokeRect(-191,-18,96,54);
    /* transparent cab */ const glass=[[[-70,-80],[-48,-133],[-4,-133],[-4,-78]],[[8,-133],[51,-133],[82,-88],[82,-78],[8,-78]]];tctx.globalAlpha=glassAlpha;glass.forEach(sh=>{path(sh);const gg=tctx.createLinearGradient(sh[0][0],sh[0][1],sh[2][0],sh[2][1]);gg.addColorStop(0,'rgba(181,234,249,.66)');gg.addColorStop(.5,'rgba(58,111,133,.62)');gg.addColorStop(1,'rgba(15,49,67,.80)');tctx.fillStyle=gg;tctx.fill();tctx.strokeStyle='rgba(224,248,255,.72)';tctx.stroke();});tctx.globalAlpha=bodyAlpha;
    if(driver){tctx.save();tctx.globalAlpha=Math.min(1,glassAlpha+.15);drawTractorDriver(-28,-82,.88);tctx.restore();}
    /* exhaust / intake */tctx.fillStyle='#26343b';tctx.fillRect(-105,-101,10,77);tctx.fillRect(-112,-108,24,9);
    /* hitch + PTO + hydraulics */tctx.strokeStyle='#41515a';tctx.lineWidth=6;tctx.beginPath();tctx.moveTo(175,28);tctx.lineTo(213,44);tctx.moveTo(175,28);tctx.lineTo(210,8);tctx.stroke();tctx.fillStyle='#adbcc4';tctx.beginPath();tctx.arc(205,26,7,0,Math.PI*2);tctx.fill();
    if(smart){tctx.fillStyle='#eafcff';tctx.beginPath();tctx.arc(22,-159,8,0,Math.PI*2);tctx.fill();tctx.strokeStyle='#7beeff';tctx.lineWidth=2;tctx.beginPath();tctx.arc(22,-159,15,0,Math.PI*2);tctx.stroke();tctx.fillStyle='#1d313d';tctx.fillRect(55,-149,30,12);}
    if(implement)drawTractorImplement(implement,toolSpin);
  }
  const wheels=[[-132,45,42],[93,39,72]];wheels.forEach(([x,y,r])=>{tctx.save();tctx.globalAlpha=wheelAlpha;tctx.translate(x,y);tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#11181c';tctx.fill();tctx.strokeStyle='#2f3b42';tctx.lineWidth=7;tctx.stroke();for(let k=0;k<12;k++){const a=roadWheelSpin+k*Math.PI/6;tctx.strokeStyle='rgba(129,145,153,.50)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(Math.cos(a)*(r*.72),Math.sin(a)*(r*.72));tctx.lineTo(Math.cos(a)*(r*.94),Math.sin(a)*(r*.94));tctx.stroke();}tctx.beginPath();tctx.arc(0,0,r*.43,0,Math.PI*2);tctx.fillStyle='#9aacb5';tctx.fill();tctx.beginPath();tctx.arc(0,0,r*.14,0,Math.PI*2);tctx.fillStyle='#26363f';tctx.fill();tctx.restore();});
  if(lightAlpha>0){tctx.save();tctx.globalAlpha=lightAlpha;tctx.fillStyle='#f2fcff';tctx.shadowColor='#d8fbff';tctx.shadowBlur=15;tctx.fillRect(-194,-8,16,9);tctx.restore();}
  tctx.restore();
}
function drawTractorFinishedVehicleReveal(){
  if(!vehicleRevealActive)return;const W=templateCanvas.width,H=templateCanvas.height,sc=Math.min(W/800,H/450),ox=(W-800*sc)/2,oy=(H-450*sc)/2,phase1=vehicleRevealStage==='phase1',phase2=['phase2','phase2-ready','phase2-confirmed'].includes(vehicleRevealStage),p=phase1?vehicleRevealProgress:1;
  const bodyT=phase1?vehicleRevealEase(.08,.58,p):1,lineT=phase1?1-vehicleRevealEase(.38,.88,p):0,glassT=phase1?vehicleRevealEase(.28,.70,p):1,wheelT=phase1?vehicleRevealEase(.34,.76,p):1,lightT=phase1?vehicleRevealEase(.62,.94,p):1,pulse=phase2?Math.sin(Math.min(1,vehiclePhase2Progress)*Math.PI):0,slide=phase2?(-16+32*Math.min(1,vehiclePhase2Progress)):0,paint=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):(vehicleTransformationReplay?vehiclePaintColor:'#7aa33a');
  tctx.save();tctx.translate(ox,oy);tctx.scale(sc,sc);drawTractorAt(400+slide,272+pulse*2,.78*(1+.035*pulse),{paint,glow:.45+pulse*.45,bodyAlpha:bodyT,lineAlpha:lineT,glassAlpha:glassT,wheelAlpha:wheelT,lightAlpha:lightT,wheelSpin:0,faceRight:true,smart:true,driver:true});if(phase2&&vehiclePaintMix<1){const xx=145+530*vehiclePaintMix;tctx.save();tctx.globalAlpha=.42;const g=tctx.createLinearGradient(xx-50,0,xx+35,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.88)');g.addColorStop(1,'rgba(255,255,255,0)');tctx.fillStyle=g;tctx.fillRect(xx-50,100,85,270);tctx.restore();}tctx.restore();
}
function drawFarmFieldBase(title,sub){
  const W=templateCanvas.width,H=templateCanvas.height;
  const sky=tctx.createLinearGradient(0,0,0,245);sky.addColorStop(0,'#7cc8e8');sky.addColorStop(1,'#d8f0f4');tctx.fillStyle=sky;tctx.fillRect(0,0,W,245);
  /* Farm ground is earth, not a flat green stage. Green stays on the distant hills and crop/grass areas only. */
  const earth=tctx.createLinearGradient(0,245,0,H);earth.addColorStop(0,'#a97949');earth.addColorStop(.55,'#8b6138');earth.addColorStop(1,'#6e4b31');tctx.fillStyle=earth;tctx.fillRect(0,245,W,H-245);
  tctx.fillStyle='#667f46';tctx.beginPath();tctx.moveTo(0,245);tctx.quadraticCurveTo(150,182,310,236);tctx.quadraticCurveTo(510,175,800,242);tctx.lineTo(800,274);tctx.lineTo(0,274);tctx.closePath();tctx.fill();
  tctx.fillStyle='rgba(255,244,196,.86)';tctx.beginPath();tctx.arc(705,62,27,0,Math.PI*2);tctx.fill();
  drawRoundedPanel(18,16,300,72,15,'rgba(7,31,38,.78)','rgba(205,248,255,.28)');tctx.fillStyle='#f1fbff';tctx.textAlign='left';tctx.font='900 15px system-ui';tctx.fillText(title,32,40);tctx.fillStyle='rgba(220,244,250,.92)';tctx.font='700 11px system-ui';tctx.fillText(sub,32,61);
}
function drawFarmHud(task,progress,metric1,metric2){
  drawRoundedPanel(560,16,222,104,15,'rgba(7,31,38,.82)','rgba(205,248,255,.26)');tctx.fillStyle='#eefbff';tctx.textAlign='left';tctx.font='900 12px system-ui';tctx.fillText(task,575,38);tctx.font='700 10px system-ui';tctx.fillStyle='#bfefff';tctx.fillText(metric1,575,59);tctx.fillText(metric2,575,77);tctx.fillStyle='rgba(255,255,255,.14)';tctx.fillRect(575,91,190,8);tctx.fillStyle='#69e0a7';tctx.fillRect(575,91,190*clamp(progress,0,1),8);
}
function drawTractorFarmWorld(){
  const p=clamp(vehiclePhase3Progress,0,1),time=(typeof performance!=='undefined'?performance.now():Date.now())/1000;
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,templateCanvas.width,templateCanvas.height);
  let seg=0,local=0,kind='',task='',m1='',m2='';
  if(p<.12){seg=0;local=p/.12;kind='';task=t('Farm systems start-up','Démarrage des systèmes agricoles');m1=t('Hydraulics: READY','Hydraulique : PRÊT');m2=t('PTO: READY · Driver: SEATED & READY','PTO : PRÊTE · Conducteur : ASSIS ET PRÊT');}
  else if(p<.29){seg=1;local=(p-.12)/.17;kind='mower';task=t('Job 1 · Mow & clear','Tâche 1 · Faucher et dégager');m1=t(`Field coverage: ${Math.round(local*100)}%`,`Couverture : ${Math.round(local*100)}%`);m2=t('Front mower is cutting live grass now','La faucheuse avant coupe réellement l’herbe maintenant');}
  else if(p<.47){seg=2;local=(p-.29)/.18;kind='plough';task=t('Job 2 · Prepare soil','Tâche 2 · Préparer le sol');m1=t(`Furrows prepared: ${Math.round(local*12)}/12`,`Sillons préparés : ${Math.round(local*12)}/12`);m2=t('Soil clods are lifting and rolling behind the plough','Des mottes de terre se soulèvent et roulent derrière la charrue');}
  else if(p<.64){seg=3;local=(p-.47)/.17;kind='seeder';task=t('Job 3 · Precision planting','Tâche 3 · Semis de précision');m1=t(`Seed rows: ${Math.round(local*12)}/12`,`Rangs semés : ${Math.round(local*12)}/12`);m2=t('Seeds are visibly dropping into the prepared soil','Les graines tombent visiblement dans le sol préparé');}
  else if(p<.82){seg=4;local=(p-.64)/.18;kind='irrigator';task=t('Job 4 · Precision irrigation','Tâche 4 · Irrigation de précision');m1=t(`Soil moisture: ${31+Math.round(local*27)}%`,`Humidité du sol : ${31+Math.round(local*27)}%`);m2=t('Moving water droplets are wetting the crop rows','Des gouttes d’eau en mouvement arrosent les rangs de cultures');}
  else{seg=5;local=(p-.82)/.18;kind='loader';task=t('Job 5 · Move & level material','Tâche 5 · Déplacer et niveler');m1=t(`Level zone: ${Math.round(local*100)}%`,`Zone nivelée : ${Math.round(local*100)}%`);m2=t('The front loader is pushing and spreading soil','Le chargeur avant pousse et étale la terre');}

  drawFarmFieldBase(t('MULTI-PURPOSE FARM MISSION','MISSION AGRICOLE MULTIFONCTION'),t('Every job has visible motion: grass, soil, seed, water and material all move','Chaque tâche montre un mouvement visible : herbe, terre, graines, eau et matériaux bougent'));

  const faceRight=seg===0?true:(seg%2===1);
  const tx=seg===0?395:(faceRight?205+390*local:595-390*local),ty=323;
  const frontX=tx+(faceRight?150:-150),rearX=tx+(faceRight?-135:135);
  const workX=(kind==='mower'||kind==='loader')?frontX:rearX;
  const processedEdge=faceRight?Math.max(0,workX):Math.min(800,workX);
  const behindX=faceRight?0:processedEdge,behindW=faceRight?processedEdge:800-processedEdge;
  const aheadX=faceRight?processedEdge:0,aheadW=faceRight?800-processedEdge:processedEdge;
  const backDir=faceRight?-1:1;

  drawFarmPhaseCharacters(seg,(time*.15+local)%1);

  if(seg===0){
    tctx.fillStyle='#8d6540';tctx.fillRect(0,300,800,150);
    for(let x=8;x<800;x+=13){const h=26+(x%23)*.65;tctx.strokeStyle='rgba(69,119,49,.78)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(x,448);tctx.lineTo(x+Math.sin(time*2+x*.12)*2,448-h);tctx.stroke();}
  }
  if(seg===1){
    tctx.fillStyle='#8c653d';tctx.fillRect(0,300,800,150);
    /* Real grass grows from brown soil. Tall grass is ahead of the mower, short stubble is behind it. */
    for(let x=6;x<800;x+=9){
      const ahead=faceRight?x>processedEdge:x<processedEdge;
      const h=ahead?(43+((x%29)*.65)+Math.sin(time*3+x*.08)*5):(12+((x%7)*.6));
      tctx.strokeStyle=ahead?'rgba(46,112,44,.96)':'rgba(112,156,69,.84)';tctx.lineWidth=ahead?2.6:1.3;
      tctx.beginPath();tctx.moveTo(x,448);tctx.lineTo(x+Math.sin(time*4+x*.09)*2.5,448-h);tctx.stroke();
    }
    /* grass clippings fly continuously behind the spinning front mower */
    for(let i=0;i<42;i++){
      const ph=(time*1.8+i*.071)%1,dist=15+ph*88,arc=Math.sin(ph*Math.PI)*30;
      const px=workX+backDir*dist,py=342-arc+(i%5)*2;
      tctx.save();tctx.translate(px,py);tctx.rotate(time*5+i);tctx.fillStyle=i%2?'rgba(206,218,103,.90)':'rgba(126,166,70,.92)';tctx.fillRect(-3,-1,7,2);tctx.restore();
    }
  }
  if(seg===2){
    /* Entire work area is soil: lighter unworked earth ahead, darker freshly-turned earth behind. */
    tctx.fillStyle='#a47748';tctx.fillRect(0,300,800,150);
    tctx.fillStyle='#70472c';tctx.fillRect(behindX,300,behindW,150);
    tctx.save();tctx.beginPath();tctx.rect(behindX,300,behindW,150);tctx.clip();
    for(let y=316;y<450;y+=14){tctx.strokeStyle='rgba(50,30,18,.72)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(0,y+Math.sin(time*2.4+y*.04)*2);tctx.lineTo(800,y+Math.sin(time*2.4+y*.04)*2);tctx.stroke();}
    tctx.restore();
    /* animated soil clods follow ballistic arcs from the plough */
    for(let i=0;i<54;i++){
      const ph=(time*1.55+i*.083)%1,dist=10+ph*86,arc=Math.sin(ph*Math.PI)*(26+(i%4)*5);
      const px=workX+backDir*dist,py=345-arc+(i%6)*2;
      tctx.fillStyle=i%3===0?'#5d3823':i%3===1?'#81502f':'#a06a3c';
      tctx.beginPath();tctx.arc(px,py,2.5+(i%4)*.9,0,Math.PI*2);tctx.fill();
      if(ph>.76){tctx.strokeStyle='rgba(47,27,16,.26)';tctx.lineWidth=1;tctx.beginPath();tctx.moveTo(px-4,py+5);tctx.lineTo(px+5,py+5);tctx.stroke();}
    }
    /* moving dust puff at the point where the blades are digging */
    for(let i=0;i<16;i++){const ph=(time*1.2+i*.14)%1;tctx.fillStyle=`rgba(180,126,79,${.24*(1-ph)})`;tctx.beginPath();tctx.arc(workX+backDir*ph*35,338-ph*26,5+ph*10,0,Math.PI*2);tctx.fill();}
  }
  if(seg===3){
    tctx.fillStyle='#825633';tctx.fillRect(0,300,800,150);
    for(let y=318;y<447;y+=20){tctx.strokeStyle='rgba(111,225,255,.14)';tctx.lineWidth=1;tctx.beginPath();tctx.moveTo(0,y);tctx.lineTo(800,y);tctx.stroke();}
    /* planted seeds remain in rows behind the seeder */
    tctx.save();tctx.beginPath();tctx.rect(behindX,300,behindW,150);tctx.clip();
    for(let y=322;y<445;y+=20){for(let x=18;x<795;x+=28){tctx.fillStyle='#e5ca70';tctx.beginPath();tctx.arc(x,y,2.4,0,Math.PI*2);tctx.fill();}}
    tctx.restore();
    /* live seed stream drops from the drill tubes into the soil */
    for(let i=0;i<32;i++){
      const ph=(time*2.2+i*.097)%1,outlet=i%5,ox=workX+backDir*(5+outlet*7),oy=312;
      const px=ox+backDir*ph*18,py=oy+ph*52;
      tctx.fillStyle='#f0d477';tctx.beginPath();tctx.arc(px,py,2.2,0,Math.PI*2);tctx.fill();
      if(ph>.82){tctx.fillStyle='rgba(120,77,42,.45)';tctx.beginPath();tctx.arc(px,py+2,4,0,Math.PI*2);tctx.fill();}
    }
  }
  if(seg===4){
    tctx.fillStyle='#855a36';tctx.fillRect(0,300,800,150);
    for(let y=320;y<445;y+=20){for(let x=18;x<795;x+=28){tctx.strokeStyle='#4d9e4e';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(x,y);tctx.lineTo(x,y-11);tctx.moveTo(x,y-7);tctx.lineTo(x-4,y-11);tctx.moveTo(x,y-6);tctx.lineTo(x+4,y-10);tctx.stroke();}}
    /* wet soil follows the tractor, visibly darker than the dry soil ahead */
    tctx.fillStyle='rgba(38,78,76,.38)';tctx.fillRect(behindX,300,behindW,150);
    /* animated water droplets travel from the boom to the ground */
    for(let i=0;i<68;i++){
      const ph=(time*2.4+i*.051)%1,side=((i%17)-8)*5.2;
      const sx=workX,sy=288+side*.06;
      const px=sx+backDir*(15+ph*92),py=sy+ph*58-Math.sin(ph*Math.PI)*19+side*.12;
      tctx.strokeStyle='rgba(117,222,255,.78)';tctx.lineWidth=1.4;tctx.beginPath();tctx.moveTo(px,py-5);tctx.lineTo(px,py+4);tctx.stroke();
      if(ph>.83){tctx.strokeStyle='rgba(131,225,255,.58)';tctx.lineWidth=1;tctx.beginPath();tctx.arc(px,py+5,4+(i%3),Math.PI,Math.PI*2);tctx.stroke();}
    }
  }
  if(seg===5){
    tctx.fillStyle='#875d3b';tctx.fillRect(0,300,800,150);
    const pileX=faceRight?650:150,pileR=52*(1-local*.70);
    tctx.fillStyle='#65432c';tctx.beginPath();tctx.ellipse(pileX,372,pileR,26+pileR*.34,0,Math.PI,Math.PI*2);tctx.fill();
    tctx.fillStyle='#a77b57';if(faceRight)tctx.fillRect(210,394,Math.max(0,390*local),25);else tctx.fillRect(600-390*local,394,Math.max(0,390*local),25);
    /* soil moves in front of the bucket, not as a frozen mound */
    for(let i=0;i<38;i++){
      const ph=(time*1.6+i*.071)%1,dir=faceRight?1:-1;
      const px=frontX+dir*(10+ph*50)+(i%5)*2,py=354-Math.sin(ph*Math.PI)*(13+(i%3)*4);
      tctx.fillStyle=i%2?'#755039':'#9a6e49';tctx.beginPath();tctx.arc(px,py,3+(i%3),0,Math.PI*2);tctx.fill();
    }
    for(let i=0;i<11;i++){tctx.strokeStyle='rgba(121,85,58,.62)';tctx.lineWidth=2;tctx.beginPath();const y=398+i*2;tctx.moveTo(faceRight?210:210+(1-local)*390,y);tctx.lineTo(faceRight?210+Math.max(0,390*local):600,y);tctx.stroke();}
  }

  if(seg>=2){tctx.save();tctx.globalAlpha=.24;tctx.strokeStyle='#2d2722';tctx.lineWidth=3;tctx.setLineDash([9,7]);tctx.beginPath();tctx.moveTo(behindX,386);tctx.lineTo(behindX+behindW,386);tctx.moveTo(behindX,407);tctx.lineTo(behindX+behindW,407);tctx.stroke();tctx.setLineDash([]);tctx.restore();}

  /* local increases in every segment. drawTractorAt handles the mirrored wheel direction correctly. */
  const spin=seg===0?0:(local*13);
  drawTractorAt(tx,ty,.60,{paint:vehiclePaintColor,glow:.30,wheelSpin:spin,toolSpin:time*5.5,faceRight,implement:kind,smart:true,driver:true});
  drawFarmHud(task,local,m1,m2);
  tctx.restore();
}
function drawTractorPrecisionFinale(){
  const p=clamp(vehiclePhase4Progress,0,1),W=templateCanvas.width,H=templateCanvas.height,time=(typeof performance!=='undefined'?performance.now():Date.now())/1000;
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#163b50');sky.addColorStop(.52,'#6ca5a5');sky.addColorStop(1,'#304d36');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  /* Precision field = brown soil with living green crop rows, not a flat green screen. */
  const soil=tctx.createLinearGradient(0,238,0,H);soil.addColorStop(0,'#9a6b40');soil.addColorStop(1,'#6f4a31');tctx.fillStyle=soil;tctx.fillRect(0,238,W,212);
  for(let y=264;y<448;y+=25){
    tctx.strokeStyle='rgba(116,177,77,.78)';tctx.lineWidth=7;tctx.beginPath();tctx.moveTo(0,y);tctx.lineTo(W,y);tctx.stroke();
    for(let x=10;x<W;x+=30){const sway=Math.sin(time*2+x*.05+y*.03)*2;tctx.strokeStyle='rgba(153,211,100,.82)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(x,y);tctx.lineTo(x+sway,y-10);tctx.stroke();}
  }
  tctx.fillStyle='#244d36';tctx.fillRect(0,233,W,9);

  let stageLabel='',stageExplain='',tractorX=205,tractorY=340,faceRight=true,wheelSpin=0,implement='',droneX=220,droneY=190,scan=false,dryAlpha=0,stressAlpha=0,moisture=24,stage=0;
  if(p<.12){
    const q=p/.12;stage=0;stageLabel=t('1 · DRONE LAUNCH','1 · LANCEMENT DU DRONE');stageExplain=t('The farm drone is taking off to inspect crop and soil conditions.','Le drone agricole décolle pour inspecter les cultures et le sol.');droneX=230+70*q;droneY=280-165*q;tractorX=205;wheelSpin=0;
  }else if(p<.34){
    const q=(p-.12)/.22;stage=1;stageLabel=t('2 · FIELD SCAN IN PROGRESS','2 · ANALYSE DU CHAMP EN COURS');stageExplain=t('Cameras and sensors are checking moisture, crop colour and weak-growth zones.','Les caméras et capteurs vérifient l’humidité, la couleur des cultures et les zones de faible croissance.');droneX=300+390*q;droneY=108+18*Math.sin(q*Math.PI*3);scan=true;tractorX=205;
  }else if(p<.43){
    const q=(p-.34)/.09;stage=2;stageLabel=t('3 · DRY ZONE DETECTED','3 · ZONE SÈCHE DÉTECTÉE');stageExplain=t('The drone has marked a low-moisture area and sent its coordinates to the tractor.','Le drone a marqué une zone peu humide et envoyé ses coordonnées au tracteur.');droneX=665;droneY=115;scan=true;dryAlpha=.45+.45*Math.sin(time*5);tractorX=205;
  }else if(p<.61){
    const q=(p-.43)/.18,e=1-Math.pow(1-q,3);stage=3;stageLabel=t('4 · TRACTOR MOVING TO TARGET','4 · TRACTEUR EN ROUTE VERS LA CIBLE');stageExplain=t('GPS guidance is taking the tractor smoothly to the dry zone.','Le guidage GPS conduit doucement le tracteur vers la zone sèche.');tractorX=205+(565-205)*e;faceRight=true;wheelSpin=q*15;droneX=665;droneY=115;dryAlpha=.72;
    tctx.save();tctx.setLineDash([8,7]);tctx.strokeStyle='rgba(86,232,255,.85)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(230,373);tctx.lineTo(565,373);tctx.stroke();tctx.setLineDash([]);tctx.restore();
  }else if(p<.74){
    const q=(p-.61)/.13;stage=4;stageLabel=t('5 · IRRIGATING DRY ZONE','5 · IRRIGATION DE LA ZONE SÈCHE');stageExplain=t('The tractor applies water only where the drone found low moisture.','Le tracteur apporte de l’eau uniquement là où le drone a détecté un manque d’humidité.');tractorX=565;implement='irrigator';droneX=665;droneY=115;dryAlpha=.72*(1-q);moisture=24+Math.round(q*39);
    /* Strong moving irrigation: droplets travel, arc and splash into the marked zone. */
    for(let i=0;i<78;i++){
      const ph=(time*2.6+i*.043)%1,side=((i%19)-9)*4.3;
      const sx=500+(i%5)*5,sy=288+side*.05;
      const px=sx-25-ph*105,py=sy+ph*62-Math.sin(ph*Math.PI)*23+side*.13;
      tctx.strokeStyle='rgba(111,225,255,.86)';tctx.lineWidth=1.5;tctx.beginPath();tctx.moveTo(px,py-6);tctx.lineTo(px,py+4);tctx.stroke();
      if(ph>.80){tctx.strokeStyle='rgba(157,235,255,.66)';tctx.lineWidth=1;tctx.beginPath();tctx.arc(px,py+6,4+(i%3),Math.PI,Math.PI*2);tctx.stroke();}
    }
    tctx.fillStyle=`rgba(38,86,86,${.16+.20*q})`;tctx.fillRect(500,292,165,96);
  }else if(p<.82){
    const q=(p-.74)/.08;stage=5;stageLabel=t('6 · SECOND SCAN — CROP STRESS','6 · DEUXIÈME ANALYSE — STRESS DES CULTURES');stageExplain=t('The drone finds a second area with weak crop growth after the dry zone is treated.','Le drone détecte une deuxième zone de faible croissance après le traitement de la zone sèche.');tractorX=565;droneX=650-270*q;droneY=112+12*Math.sin(q*Math.PI*3);scan=true;stressAlpha=.38+.40*Math.sin(time*4);moisture=63;
  }else if(p<.94){
    const q=(p-.82)/.12,e=q*q*(3-2*q);stage=6;stageLabel=t('7 · MOVING TO CROP-STRESS ZONE','7 · DÉPLACEMENT VERS LA ZONE DE CULTURES FAIBLES');stageExplain=t('The tractor turns and follows the new coordinates sent by the drone.','Le tracteur tourne et suit les nouvelles coordonnées envoyées par le drone.');tractorX=565-(565-350)*e;faceRight=false;wheelSpin=q*12;droneX=380;droneY=112;stressAlpha=.72;moisture=63;
    tctx.save();tctx.setLineDash([8,7]);tctx.strokeStyle='rgba(86,232,255,.85)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(565,373);tctx.lineTo(350,373);tctx.stroke();tctx.setLineDash([]);tctx.restore();
  }else{
    const q=(p-.94)/.06;stage=7;stageLabel=t('8 · TARGETED CROP SUPPORT','8 · TRAITEMENT CIBLÉ DES CULTURES');stageExplain=t('A precise nutrient mist is applied only to the weak-growth zone.','Une brume nutritive précise est appliquée uniquement sur la zone de faible croissance.');tractorX=350;faceRight=false;implement='irrigator';droneX=380;droneY=112;stressAlpha=.72*(1-q);moisture=63;
    for(let i=0;i<64;i++){
      const ph=(time*2.3+i*.049)%1,sx=430,sy=290,px=sx+ph*85,py=sy+ph*54-Math.sin(ph*Math.PI)*17+((i%13)-6)*1.1;
      tctx.fillStyle=`rgba(199,239,128,${.45+(i%4)*.10})`;tctx.beginPath();tctx.arc(px,py,2+(i%2),0,Math.PI*2);tctx.fill();
    }
  }

  /* Human activity remains present in smart-farm phases too. Positions change so the world stays alive. */
  drawFarmRestArea(92,302,{occupant:stage%3===0?'girl':stage%3===1?null:'boy',mode:stage%2?'sit':'lie',time,showSign:true});
  if(stage%2===0){drawFarmPerson(180,298,1,{skin:'#d29a76',shirt:'#8a5d6a',time});drawFarmActivityZone(728,310,{type:'plant',time});drawFarmPerson(650,294,1,{shirt:'#365e80',time});}
  else{drawFarmActivityZone(180,312,{type:'plant',time});drawFarmPerson(710,294,1,{shirt:'#365e80',time});drawFarmPerson(620,306,.92,{skin:'#c5835e',child:true,shirt:'#6c5b99',time});}

  if(dryAlpha>0){tctx.save();tctx.globalAlpha=dryAlpha;tctx.fillStyle='rgba(241,159,62,.46)';tctx.fillRect(520,292,145,92);tctx.strokeStyle='#ffd07d';tctx.lineWidth=3;tctx.strokeRect(520,292,145,92);tctx.fillStyle='#fff0cf';tctx.font='900 11px system-ui';tctx.textAlign='center';tctx.fillText(t('DRY ZONE','ZONE SÈCHE'),592,312);tctx.restore();}
  if(stressAlpha>0){tctx.save();tctx.globalAlpha=stressAlpha;tctx.fillStyle='rgba(219,188,74,.38)';tctx.fillRect(280,315,138,82);tctx.strokeStyle='#f7e47d';tctx.lineWidth=3;tctx.strokeRect(280,315,138,82);tctx.fillStyle='#fff6bd';tctx.font='900 11px system-ui';tctx.textAlign='center';tctx.fillText(t('CROP STRESS','CULTURE FAIBLE'),349,334);tctx.restore();}

  /* drone rotors and scan grid are continuously animated */
  tctx.save();tctx.translate(droneX,droneY);tctx.strokeStyle='#e5fbff';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(-20,0);tctx.lineTo(20,0);tctx.moveTo(0,-20);tctx.lineTo(0,20);tctx.stroke();
  for(const [rx,ry] of [[-22,-6],[22,-6],[-22,6],[22,6]]){tctx.save();tctx.translate(rx,ry);tctx.rotate(time*10+(rx+ry));tctx.beginPath();tctx.moveTo(-8,0);tctx.lineTo(8,0);tctx.moveTo(0,-8);tctx.lineTo(0,8);tctx.stroke();tctx.restore();}
  if(scan){
    const sweep=(Math.sin(time*4)+1)/2;tctx.strokeStyle='rgba(91,232,255,.50)';tctx.fillStyle='rgba(91,232,255,.08)';tctx.beginPath();tctx.moveTo(0,14);tctx.lineTo(-70,154);tctx.lineTo(70,154);tctx.closePath();tctx.fill();tctx.stroke();
    for(let yy=46;yy<145;yy+=22){tctx.strokeStyle='rgba(115,238,255,.24)';tctx.beginPath();tctx.moveTo(-yy*.38,yy);tctx.lineTo(yy*.38,yy);tctx.stroke();}
    tctx.strokeStyle='rgba(168,249,255,.92)';tctx.lineWidth=3;tctx.beginPath();const sy=44+sweep*96;tctx.moveTo(-sy*.36,sy);tctx.lineTo(sy*.36,sy);tctx.stroke();
  }
  tctx.restore();

  drawTractorAt(tractorX,tractorY,.48,{paint:vehiclePaintColor,glow:.50,wheelSpin,toolSpin:time*5.5,faceRight,smart:true,driver:true,implement});

  drawRoundedPanel(18,16,500,78,15,'rgba(4,20,29,.88)','rgba(147,232,255,.28)');tctx.fillStyle='#f0fbff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(stageLabel,32,40);tctx.fillStyle='#c9f3ff';tctx.font='700 11px system-ui';const lines=stageExplain.length>82?[stageExplain.slice(0,82),stageExplain.slice(82)]:[stageExplain];lines.forEach((line,i)=>tctx.fillText(line,32,61+i*15));
  drawRoundedPanel(548,16,234,118,15,'rgba(4,20,29,.88)','rgba(147,232,255,.26)');tctx.fillStyle='#eaf9ff';tctx.font='800 11px system-ui';const metrics=[t('Drone link: CONNECTED','Liaison drone : CONNECTÉE'),t(`Soil moisture: ${moisture}%`,`Humidité du sol : ${moisture} %`),t('GPS accuracy: 2.5 cm','Précision GPS : 2,5 cm'),p>.61?t('Response: TARGETED','Réponse : CIBLÉE'):t('Response: WAITING','Réponse : EN ATTENTE')];metrics.forEach((m,i)=>tctx.fillText(m,563,40+i*20));
  tctx.restore();
}
function drawTractorCelebration(){
  const W=templateCanvas.width,H=templateCanvas.height,p=vehicleRevealStage==='phase5'?clamp(vehiclePhase5Progress,0,1):1;tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,W,H);const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#e18b55');sky.addColorStop(.42,'#8d6570');sky.addColorStop(1,'#1d3440');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);tctx.fillStyle='rgba(255,222,150,.9)';tctx.beginPath();tctx.arc(650,102,38,0,Math.PI*2);tctx.fill();tctx.fillStyle='#527348';tctx.fillRect(0,260,W,H-260);for(let y=302;y<440;y+=20){tctx.strokeStyle='rgba(36,62,32,.52)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(0,y);tctx.lineTo(W,y);tctx.stroke();}
  const arrive=clamp(p/.42,0,1),settle=1-Math.pow(1-arrive,3);drawTractorAt(410+(1-settle)*230,330-(1-settle)*20,.70,{paint:vehiclePaintColor,glow:.56,wheelSpin:p<.42?-p*8:0,faceRight:true,smart:true,driver:true});
  /* The farm team remains naturally spread out in the final wide shot. */
  drawFarmPerson(78,327,1,{skin:'#d39a76',shirt:'#8a5d6a'});drawFarmPerson(123,336,.9,{child:true,shirt:'#d19943'});drawFarmPerson(704,325,1,{shirt:'#315e7d'});drawFarmPerson(655,338,.9,{skin:'#c5835e',child:true,shirt:'#6c5b99'});
  const a=clamp((p-.28)/.28,0,1);tctx.globalAlpha=a;tctx.textAlign='center';tctx.fillStyle='#fff7ec';tctx.font='900 24px system-ui';tctx.fillText(t('PRECISION FARM MISSION COMPLETE','MISSION AGRICOLE DE PRÉCISION TERMINÉE'),400,52);tctx.fillStyle='rgba(222,248,255,.95)';tctx.font='800 13px system-ui';tctx.fillText(t('Precision Agriculture Engineer','Ingénieur en agriculture de précision'),400,77);tctx.globalAlpha=1;
  const r=clamp((p-.52)/.28,0,1);tctx.globalAlpha=r;drawRoundedPanel(96,94,608,70,15,'rgba(8,28,34,.72)','rgba(205,246,255,.20)');tctx.fillStyle='#e7fbff';tctx.font='800 11px system-ui';tctx.fillText(t('Mowed ✓  Soil prepared ✓  Seeds planted ✓  Irrigated ✓  Land levelled ✓','Fauchage ✓  Sol préparé ✓  Semis ✓  Irrigation ✓  Nivellement ✓'),400,122);tctx.fillText(t('Drone scan ✓  Dry zone treated ✓  Crop-stress zone treated ✓','Scan drone ✓  Zone sèche traitée ✓  Zone de cultures faibles traitée ✓'),400,143);tctx.globalAlpha=1;tctx.restore();
}
function drawCanonicalFinishedVehicle(){
  if(vehicleIs('tractor')){drawTractorFinishedVehicleReveal();return;}
  if(vehicleIs('suv')){drawSUVFinishedVehicleReveal();return;}
  if(vehicleIs('van')){drawVanFinishedVehicleReveal();return;}
  if(vehicleIs('coach')){drawCoachFinishedVehicleReveal();return;}
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
  const paintBase=phase2?vehicleMixColour(vehiclePreviousPaintColor,vehiclePaintColor,vehiclePaintMix):(vehicleTransformationReplay?vehiclePaintColor:'#9fb0ba');
  const paintDark=(phase2||vehicleTransformationReplay)?vehicleShade(vehiclePaintColor,-72):'#435867';
  const paintLight=(phase2||vehicleTransformationReplay)?vehicleShade(vehiclePaintColor,72):'#dce6eb';
  tctx.save();tctx.translate(ox+(400+camSlide)*scale,oy+236*scale);tctx.scale(scale*(1+.055*camPulse),scale*(1+.055*camPulse));tctx.translate(-400,-236+camPulse*3);
  /* Final presentation always faces the real direction of travel: front/headlights to the right, rear lights to the left. */
  tctx.translate(400,0);tctx.scale(-1,1);tctx.translate(-400,0);
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
  if(vehicleReadyForTest()||!vehicleUnderAccess())return;
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
  if(vehicleRevealStage==='phase5'||vehicleRevealStage==='phase5-ready'||vehicleRevealStage==='phase5-complete'||vehicleRevealStage==='phase5-view'){drawVehiclePhaseFiveCelebration();syncInstalledVehicleParts();return;}
  if(vehicleRevealStage==='phase4'||vehicleRevealStage==='phase4-complete'){drawVehiclePhaseFourJourney();syncInstalledVehicleParts();return;}
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
  if(vehicleReadyForTest()){
    tctx.save();tctx.textAlign='center';tctx.fillStyle='rgba(152,244,205,.96)';tctx.font='900 15px system-ui';
    tctx.fillText(t('✓ VEHICLE BUILD COMPLETE — READY TO TEST','✓ CONSTRUCTION TERMINÉE — PRÊT À TESTER'),400,402);
    tctx.fillStyle='rgba(196,229,244,.90)';tctx.font='700 12px system-ui';
    tctx.fillText(t('All four build areas are complete. Press Test My Creation.','Les quatre zones sont terminées. Appuie sur Tester ma création.'),400,424);
    tctx.restore();syncInstalledVehicleParts();return;
  }
  projections.forEach(proj=>{
    if(!proj.visible||installed.has(proj.key)||!modeIds.has(proj.partId))return;
    /* Interior/underbody view stays uncluttered: only slots belonging to the active stage are shown. */
    if(vehicleViewMode==='interior'&&proj.view!=='interior')return;
    drawVehicleSlotGuide(proj,proj,false);
  });
  drawVehicleInteriorAccessLabel();
  tctx.save();tctx.fillStyle='rgba(145,236,255,.66)';tctx.font='700 13px system-ui';tctx.textAlign='center';
  let msg;
  if(activeMode==='power'){
    if(!vehiclePowertrain)msg=t('Power System: choose Petrol, Diesel, Electric or Hybrid below. The matching required components will then appear.','Système d’énergie : choisis Essence, Diesel, Électrique ou Hybride ci-dessous. Les composants requis correspondants apparaîtront ensuite.');
    else msg=vehicleUnderAccess()
      ?t('Power access: fit the internal and underbody components here. Exterior power parts use their matching outside view.','Accès énergie : place ici les composants internes et sous la caisse. Les pièces d’énergie extérieures utilisent leur vue extérieure correspondante.')
      :t('Power System: use Interior/underbody for hidden components, then side or top views for external ones.','Système d’énergie : utilise Intérieur/sous la caisse pour les composants cachés, puis les vues latérale ou dessus pour les pièces extérieures.');
  }else if(activeMode==='safety'){
    msg=vehicleUnderAccess()
      ?t('Safety: fit the seat belts, airbags, safety camera, warning control and emergency stop inside the cabin.','Sécurité : place les ceintures, airbags, caméra de sécurité, commande d’alerte et arrêt d’urgence dans l’habitacle.')
      :t('Safety: use Front, Rear and Side views for collision sensors and indicators; use Interior for cabin protection.','Sécurité : utilise les vues Avant, Arrière et Latérales pour les capteurs et clignotants ; utilise Intérieur pour la protection de l’habitacle.');
  }else if(activeMode==='future'){
    if(!vehicleFutureAbility)msg=t('Future Tech: choose Flying Car or Water / Amphibious Car below. Only the matching technology will appear.','Technologies futures : choisis Voiture volante ou Voiture aquatique / amphibie ci-dessous. Seule la technologie correspondante apparaîtra.');
    else if(vehicleFutureAbility==='flight'&&!vehicleFlightSystem)msg=t('Flying Car selected. Choose Propeller Flight, Jet Flight or Drone Lift below before fitting the flight hardware.','Voiture volante sélectionnée. Choisis Vol par hélices, Vol par réacteurs ou Portance par rotors avant de placer les équipements de vol.');
    else msg=vehicleUnderAccess()
      ?t('Future Tech access: fit the hidden wheel-retraction or amphibious components underneath the same car.','Accès technologie future : place sous la même voiture les mécanismes cachés de roues rétractables ou de coque amphibie.')
      :vehicleFutureAbility==='flight'
        ?t('Flying Car: use Top for wings or drone lift, Rear for propellers/jets, and Interior for retractable-wheel mechanisms.','Voiture volante : utilise Dessus pour les ailes ou rotors, Arrière pour les hélices/réacteurs et Intérieur pour les mécanismes de roues rétractables.')
        :t('Water / Amphibious: use Interior for the hull and retractable wheels, then Rear for water jets and stabilisers.','Aquatique / amphibie : utilise Intérieur pour la coque et les roues rétractables, puis Arrière pour les propulseurs aquatiques et stabilisateurs.');
  }else{
    msg=vehicleUnderAccess()
      ?t('Body & Movement: fit the steering wheel, seats and dashboard from underneath. Fitted pieces lock into the car.','Carrosserie et mouvement : place le volant, les sièges et le tableau de bord par dessous. Les pièces fixées se verrouillent dans la voiture.')
      :t('Body & Movement: use the side, front, rear and top views to match the exterior pieces. Rotate freely whenever you need a better angle.','Carrosserie et mouvement : utilise les vues latérales, avant, arrière et dessus pour placer les pièces extérieures. Tourne librement si tu as besoin d’un meilleur angle.');
  }
  tctx.fillText(msg,400,425);
  tctx.restore();
  syncInstalledVehicleParts();
}

function roomStyle(){return ROOM_STYLE_MAP[currentLibraryId]||ROOM_STYLE_MAP['room-scandi'];}
function roomObjects(){return [...objectLayer.children].filter(o=>o.dataset.kind==='part');}
function roomBudget(){return roomObjects().reduce((sum,o)=>sum+(ROOM_COSTS[o.dataset.partId]||80),0);}
function roomTagSet(){const set=new Set();roomObjects().forEach(o=>objectTags(o).forEach(tag=>set.add(tag)));return set;}
function roomDesignMetrics(){
  const tags=roomTagSet(),ids=new Set(roomObjects().map(o=>o.dataset.partId));
  const lounge=(ids.has('sofa')||ids.has('armchair'))&&ids.has('coffee-table')&&ids.has('television');
  const dining=ids.has('dining-table')&&roomObjects().filter(o=>o.dataset.partId==='dining-chair').length>=2;
  const kitchen=ids.has('kitchen-sink')&&ids.has('hob')&&ids.has('fridge');
  const light=tags.has('light');
  const smart=tags.has('smart');
  const storage=tags.has('storage');
  const budget=roomBudget(),budgetOK=budget<=2200;
  const collisions=roomCollisionIssues();
  let score=38+(lounge?12:0)+(dining?10:0)+(kitchen?14:0)+(light?8:0)+(smart?8:0)+(storage?5:0)+(budgetOK?5:0)-(collisions.length?10:0);
  score=clamp(score,35,100);
  return{lounge,dining,kitchen,light,smart,storage,budget,budgetOK,collisions,score};
}
function roomCollisionIssues(){
  const objects=roomObjects(),large=objects.filter(o=>objectTags(o).includes('collision-large')),issues=[];
  for(let i=0;i<large.length;i++)for(let j=i+1;j<large.length;j++){
    const a=large[i].getBoundingClientRect(),b=large[j].getBoundingClientRect();
    const w=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)),h=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const overlap=w*h,small=Math.min(a.width*a.height,b.width*b.height);if(small&&overlap/small>.34)issues.push(`${large[i].dataset.label} / ${large[j].dataset.label}`);
  }
  return issues;
}
function roomImageDrawCover(img){
  const W=templateCanvas.width,H=templateCanvas.height;if(!img||!img.complete||!img.naturalWidth)return false;
  const ir=img.naturalWidth/img.naturalHeight,cr=W/H;let sx=0,sy=0,sw=img.naturalWidth,sh=img.naturalHeight;
  if(ir>cr){sw=img.naturalHeight*cr;sx=(img.naturalWidth-sw)/2}else{sh=img.naturalWidth/cr;sy=(img.naturalHeight-sh)/2}
  tctx.drawImage(img,sx,sy,sw,sh,0,0,W,H);return true;
}
function drawRoomDesignTemplate(){
  const W=templateCanvas.width,H=templateCanvas.height,st=roomStyle(),m=roomDesignMetrics();
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,W,H);
  const wall=tctx.createLinearGradient(0,0,0,285);wall.addColorStop(0,'#f6f1ea');wall.addColorStop(1,st.wall);tctx.fillStyle=wall;tctx.fillRect(0,0,W,290);
  const floor=tctx.createLinearGradient(0,290,0,H);floor.addColorStop(0,st.floor);floor.addColorStop(1,'#3d332d');tctx.fillStyle=floor;tctx.fillRect(0,290,W,H-290);
  /* Perspective room shell */
  tctx.strokeStyle='rgba(255,255,255,.42)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(0,290);tctx.lineTo(400,205);tctx.lineTo(800,290);tctx.moveTo(400,205);tctx.lineTo(400,0);tctx.stroke();
  for(let x=-60;x<860;x+=70){tctx.strokeStyle='rgba(255,255,255,.09)';tctx.beginPath();tctx.moveTo(400,205);tctx.lineTo(x,450);tctx.stroke();}
  for(let y=315;y<450;y+=26){tctx.strokeStyle='rgba(255,255,255,.08)';tctx.beginPath();tctx.moveTo(0,y);tctx.lineTo(800,y);tctx.stroke();}
  /* Fixed architecture: window, media wall, studio kitchen */
  tctx.fillStyle='rgba(102,177,214,.28)';tctx.strokeStyle='rgba(205,241,255,.5)';tctx.lineWidth=3;tctx.fillRect(72,70,190,145);tctx.strokeRect(72,70,190,145);tctx.beginPath();tctx.moveTo(167,70);tctx.lineTo(167,215);tctx.moveTo(72,143);tctx.lineTo(262,143);tctx.stroke();
  tctx.fillStyle='rgba(35,42,48,.82)';tctx.fillRect(548,72,188,125);tctx.fillStyle='rgba(68,80,88,.88)';tctx.fillRect(570,96,145,77);tctx.fillStyle='rgba(93,228,255,.08)';tctx.fillRect(570,96,145,77);
  tctx.fillStyle='rgba(235,228,218,.93)';tctx.fillRect(475,215,282,58);tctx.fillStyle='rgba(74,65,58,.75)';tctx.fillRect(486,226,64,41);tctx.fillRect(559,226,64,41);tctx.fillRect(632,226,64,41);tctx.fillRect(705,226,42,41);
  tctx.fillStyle='#c3c8c9';tctx.beginPath();tctx.ellipse(531,220,23,8,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='#5c6b72';tctx.lineWidth=4;tctx.beginPath();tctx.moveTo(531,216);tctx.lineTo(531,196);tctx.quadraticCurveTo(551,188,552,207);tctx.stroke();
  tctx.fillStyle='#222a2d';tctx.fillRect(641,207,72,10);for(let i=0;i<4;i++){tctx.strokeStyle='#d99640';tctx.beginPath();tctx.arc(652+i*16,212,5,0,Math.PI*2);tctx.stroke();}
  /* Zone labels */
  const label=(x,y,w,text)=>{tctx.fillStyle='rgba(4,18,34,.65)';tctx.beginPath();tctx.roundRect(x,y,w,28,10);tctx.fill();tctx.fillStyle='#dff8ff';tctx.font='800 11px system-ui';tctx.textAlign='center';tctx.fillText(text,x+w/2,y+18)};
  label(80,244,150,t('LIVING ZONE','ZONE SALON'));label(306,244,132,t('DINING ZONE','COIN REPAS'));label(548,244,154,t('STUDIO KITCHEN','CUISINE STUDIO'));
  /* compact design HUD */
  tctx.fillStyle='rgba(4,18,34,.82)';tctx.beginPath();tctx.roundRect(20,18,318,75,14);tctx.fill();tctx.fillStyle='#f3fbff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(t('DREAM ROOM STUDIO','STUDIO CHAMBRE DE RÊVE'),35,43);tctx.fillStyle='#a8dff0';tctx.font='700 10px system-ui';tctx.fillText(t('Design for real life: comfort, flow, function and style.','Conçois pour la vraie vie : confort, circulation, fonction et style.'),35,62);tctx.fillText(`${t('Budget','Budget')}: £${m.budget.toLocaleString()} / £2,200   ·   ${t('Live score','Score')}: ${m.score}%`,35,80);
  tctx.fillStyle='rgba(4,18,34,.82)';tctx.beginPath();tctx.roundRect(608,18,172,118,14);tctx.fill();tctx.fillStyle='#f1fbff';tctx.font='900 11px system-ui';tctx.fillText(t('MISSION GOALS','OBJECTIFS'),622,39);tctx.font='700 10px system-ui';const goals=[[m.lounge,t('Comfortable lounge','Salon confortable')],[m.dining,t('Dining area','Coin repas')],[m.kitchen,t('Working kitchen','Cuisine fonctionnelle')],[m.light,t('Useful lighting','Éclairage utile')],[m.smart,t('Smart-home detail','Détail intelligent')]];goals.forEach(([ok,txt],i)=>{tctx.fillStyle=ok?'#75ebb6':'#8fa7bd';tctx.fillText(`${ok?'✓':'○'} ${txt}`,622,58+i*16)});
  tctx.restore();
}
function drawRoomHuman(x,y,scale=1,opts={}){
  const walk=opts.walk||0,skin=opts.skin||'#a97558',shirt=opts.shirt||'#d6c4ae',pants=opts.pants||'#354554',sit=!!opts.sit,carry=!!opts.carry;
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);if(opts.flip)tctx.scale(-1,1);tctx.globalAlpha=opts.alpha??1;
  tctx.fillStyle='rgba(0,0,0,.18)';tctx.beginPath();tctx.ellipse(0,31,16,5,0,0,Math.PI*2);tctx.fill();
  tctx.fillStyle=skin;tctx.beginPath();tctx.arc(0,-35,8,0,Math.PI*2);tctx.fill();
  tctx.fillStyle=shirt;tctx.beginPath();tctx.roundRect(-9,-26,18,28,7);tctx.fill();
  tctx.strokeStyle=skin;tctx.lineWidth=5;tctx.lineCap='round';tctx.beginPath();tctx.moveTo(-7,-18);tctx.lineTo(-15,-4+(carry?3:Math.sin(walk)*4));tctx.moveTo(7,-18);tctx.lineTo(15,-5+(carry?-2:-Math.sin(walk)*4));tctx.stroke();
  tctx.strokeStyle=pants;tctx.lineWidth=6;tctx.beginPath();if(sit){tctx.moveTo(-5,0);tctx.lineTo(-14,13);tctx.lineTo(1,18);tctx.moveTo(5,0);tctx.lineTo(13,13);tctx.lineTo(26,13)}else{tctx.moveTo(-5,1);tctx.lineTo(-8+Math.sin(walk)*5,28);tctx.moveTo(5,1);tctx.lineTo(8-Math.sin(walk)*5,28)}tctx.stroke();
  if(carry){tctx.fillStyle='#eef2f2';tctx.fillRect(12,-10,12,8);}
  tctx.restore();
}
function roomTvRect(){
  return ({'room-scandi':[640,118,138,100],'room-luxury':[640,88,150,112],'room-afro':[646,92,142,118],'room-industrial':[675,105,122,145],'room-smart':[8,82,145,175]})[currentLibraryId]||[640,118,138,100];
}
function roomKitchenPoint(){return ({'room-scandi':[523,183],'room-luxury':[530,176],'room-afro':[444,173],'room-industrial':[590,175],'room-smart':[650,170]})[currentLibraryId]||[525,180];}
function drawRoomAnimatedTV(p){
  const [x,y,w,h]=roomTvRect();tctx.save();tctx.beginPath();tctx.roundRect(x,y,w,h,5);tctx.clip();
  const g=tctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#0c3156');g.addColorStop(.5,'#4d4c9e');g.addColorStop(1,'#d06d48');tctx.fillStyle=g;tctx.fillRect(x,y,w,h);
  const sunX=x+w*(.20+.60*((p*1.7)%1));tctx.fillStyle='rgba(255,225,141,.95)';tctx.beginPath();tctx.arc(sunX,y+h*.28,8,0,Math.PI*2);tctx.fill();
  tctx.fillStyle='#183b50';tctx.beginPath();tctx.moveTo(x,y+h*.72);for(let i=0;i<7;i++)tctx.lineTo(x+i*w/6,y+h*(.42+.12*Math.sin(i*1.4+p*9)));tctx.lineTo(x+w,y+h);tctx.lineTo(x,y+h);tctx.fill();
  tctx.fillStyle='rgba(5,15,25,.75)';tctx.fillRect(x,y+h-22,w,22);tctx.fillStyle='#fff';tctx.font=`800 ${Math.max(8,w*.055)}px system-ui`;tctx.textAlign='left';tctx.fillText(t('Children World Live · Design Story','Children World Live · Histoire design'),x+6,y+h-8);
  tctx.restore();tctx.strokeStyle='rgba(225,246,255,.65)';tctx.lineWidth=2;tctx.strokeRect(x,y,w,h);
}
function drawRoomKitchenAnimation(p){
  const [x,y]=roomKitchenPoint();
  for(let i=0;i<6;i++){const q=(p*2+i/6)%1;tctx.strokeStyle=`rgba(244,246,248,${.42*(1-q)})`;tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(x+i*4,y);tctx.bezierCurveTo(x-8+i*4,y-18-q*30,x+10+i*3,y-28-q*40,x+i*4,y-45-q*45);tctx.stroke();}
  for(let i=0;i<11;i++){const q=(p*3+i/11)%1;tctx.fillStyle=`rgba(84,190,255,${.55*(1-q)})`;tctx.beginPath();tctx.arc(x-60+Math.sin(i)*6,y+28+q*45,2.5,0,Math.PI*2);tctx.fill();}
}
function drawRoomLiveFrame(ts){
  if(!roomLiveActive)return;roomLiveProgress=clamp((ts-roomLiveStart)/roomLiveDuration,0,1);const p=roomLiveProgress,W=templateCanvas.width,H=templateCanvas.height;
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.clearRect(0,0,W,H);
  const img=roomImageCache[currentLibraryId]||roomImageCache['room-scandi'];if(!roomImageDrawCover(img)){drawRoomDesignTemplate();tctx.restore();roomLiveRAF=requestAnimationFrame(drawRoomLiveFrame);return;}
  const evening=clamp((p-.55)/.45,0,1);tctx.fillStyle=`rgba(10,18,29,${.08+.22*evening})`;tctx.fillRect(0,0,W,H);
  /* lights breathe on rather than simply appearing */
  const glow=.08+.15*(.5+.5*Math.sin(p*12));const lg=tctx.createRadialGradient(420,128,10,420,128,260);lg.addColorStop(0,`rgba(255,218,147,${glow})`);lg.addColorStop(1,'rgba(255,218,147,0)');tctx.fillStyle=lg;tctx.fillRect(0,0,W,H);
  let label=t('Room waking up','La pièce prend vie'),sub=t('Lighting, media and people begin using the space.','L’éclairage, le média et les personnes commencent à utiliser la pièce.');
  if(p<.18){
    label=t('1 · LIGHTING & ARRIVAL','1 · ÉCLAIRAGE & ARRIVÉE');sub=t('A resident enters while the room shifts from daylight to a comfortable evening scene.','Une personne entre pendant que la pièce passe du jour à une ambiance du soir.');
    const q=p/.18;drawRoomHuman(100+250*q,346,1.04,{walk:q*18,shirt:'#d8c7b4',pants:'#334658',carry:q>.55});
  }else if(p<.36){
    label=t('2 · REMOTE → SOFA → TV','2 · TÉLÉCOMMANDE → CANAPÉ → TV');sub=t('She collects the remote, sits down and switches on moving media content.','Elle prend la télécommande, s’assoit et allume un contenu média animé.');
    const q=(p-.18)/.18;if(q<.45)drawRoomHuman(350+120*q,344,1.04,{walk:q*15,carry:true});else drawRoomHuman(470,352,1.04,{sit:true,carry:true});drawRoomAnimatedTV(q);
    const rx=360+110*Math.min(1,q*1.8),ry=320-8*Math.sin(q*Math.PI);tctx.fillStyle='#18232d';tctx.fillRect(rx,ry,17,5);
  }else if(p<.54){
    label=t('3 · WORKING KITCHEN','3 · CUISINE EN ACTION');sub=t('The hob heats, steam rises and running water shows that the kitchen really works.','La plaque chauffe, la vapeur monte et l’eau coule : la cuisine fonctionne réellement.');
    const q=(p-.36)/.18;drawRoomHuman(535,335,1.0,{walk:q*4,shirt:'#65715e',pants:'#303c46'});drawRoomKitchenAnimation(q);drawRoomAnimatedTV(q*.5);
  }else if(p<.70){
    label=t('4 · DINING & FAMILY USE','4 · REPAS & VIE DE FAMILLE');sub=t('A second person carries food to the table while the media and kitchen continue running.','Une deuxième personne apporte le repas pendant que le média et la cuisine restent actifs.');
    const q=(p-.54)/.16;drawRoomHuman(560-210*q,340,1.0,{walk:q*16,shirt:'#b97961',pants:'#394d62',carry:true,flip:true});drawRoomKitchenAnimation(q);drawRoomAnimatedTV(q);
  }else if(p<.86){
    label=t('5 · SMART HOME RESPONSE','5 · MAISON INTELLIGENTE');sub=t('The robot vacuum crosses the floor while lighting and media adapt automatically.','L’aspirateur robot traverse le sol pendant que lumière et média s’adaptent automatiquement.');
    const q=(p-.70)/.16;const vx=80+620*q,vy=410+8*Math.sin(q*Math.PI*4);tctx.fillStyle='#17232e';tctx.beginPath();tctx.ellipse(vx,vy,23,10,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='#5de4ff';tctx.lineWidth=2;tctx.stroke();tctx.fillStyle='#5de4ff';tctx.beginPath();tctx.arc(vx,vy-2,3,0,Math.PI*2);tctx.fill();drawRoomAnimatedTV(q);
  }else{
    const m=roomDesignMetrics();label=t('6 · LIVE-USE RESULT','6 · RÉSULTAT EN VIE');sub=t('The design is judged by comfort, function, kitchen use, lighting, smart-home detail and budget.','Le design est évalué selon confort, fonction, cuisine, lumière, maison intelligente et budget.');drawRoomAnimatedTV(p);
    tctx.fillStyle='rgba(4,18,30,.88)';tctx.beginPath();tctx.roundRect(185,112,430,225,20);tctx.fill();tctx.strokeStyle='rgba(93,228,255,.35)';tctx.stroke();tctx.textAlign='center';tctx.fillStyle='#fff';tctx.font='900 26px system-ui';tctx.fillText(t('DREAM ROOM — LIVE RESULT','CHAMBRE DE RÊVE — RÉSULTAT'),400,151);tctx.fillStyle='#75ebb6';tctx.font='900 46px system-ui';tctx.fillText(`${m.score}%`,400,207);tctx.fillStyle='#d7eff8';tctx.font='800 12px system-ui';const r=[`${m.lounge?'✓':'○'} ${t('Comfortable lounge','Salon confortable')}`,`${m.dining?'✓':'○'} ${t('Dining area','Coin repas')}`,`${m.kitchen?'✓':'○'} ${t('Working kitchen','Cuisine fonctionnelle')}`,`${m.light?'✓':'○'} ${t('Lighting','Éclairage')}`,`${m.smart?'✓':'○'} ${t('Smart home','Maison intelligente')}`,`${m.budgetOK?'✓':'○'} ${t('Budget','Budget')} £${m.budget.toLocaleString()} / £2,200`];r.forEach((x,i)=>tctx.fillText(x,400,238+i*16));
  }
  tctx.fillStyle='rgba(3,13,23,.82)';tctx.beginPath();tctx.roundRect(18,18,510,70,14);tctx.fill();tctx.fillStyle='#f4fbff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(label,33,43);tctx.fillStyle='#b9e9f7';tctx.font='700 10px system-ui';const words=sub.split(' ');let line='',yy=62;for(const word of words){const test=line?line+' '+word:word;if(tctx.measureText(test).width>474){tctx.fillText(line,33,yy);yy+=14;line=word}else line=test}if(line)tctx.fillText(line,33,yy);
  /* timeline */tctx.fillStyle='rgba(255,255,255,.18)';tctx.fillRect(18,420,764,8);tctx.fillStyle='#5de4ff';tctx.fillRect(18,420,764*p,8);
  tctx.restore();
  if(p>=1){roomLiveRAF=0;const m=roomDesignMetrics();$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${m.score}</b><small>/100</small></div><div><b>${t('Dream Room live-use test complete','Test d’usage réel terminé')}</b><p>${t('The room was tested as a living space — not just a static picture. Stop the test to return to editing and improve anything you want.','La pièce a été testée comme un vrai espace de vie — pas comme une image statique. Arrête le test pour revenir à l’édition et améliorer ce que tu veux.')}</p></div></div>`;$('creatorCoach').textContent=t('Live-use test complete. Check the score, then return to edit mode if you want to improve the room.','Test terminé. Vérifie le score puis reviens en édition si tu veux améliorer la pièce.');window.playTone?.(true);return;}
  roomLiveRAF=requestAnimationFrame(drawRoomLiveFrame);
}
function startRoomLiveTest(){
  const objs=roomObjects();if(objs.length<4){$('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Build more of the room first','Construis davantage la pièce')}</b><p>${t('Add at least four real room elements before running the live-use test.','Ajoute au moins quatre vrais éléments avant le test d’usage réel.')}</p></div>`;return;}
  stopTest(false);testRunning=true;roomLiveActive=true;roomLiveProgress=0;roomLiveStart=performance.now();stage.classList.add('testing','test-active','room-live-test');$('stopCreationTest').hidden=false;selectObject(null);simulation.className='creator-simulation';simulation.innerHTML='';
  const m=roomDesignMetrics();$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${m.score}</b><small>/100</small></div><div><b>${t('Live-use room test running','Test d’usage réel en cours')}</b><p>${t('Watch the lighting, people, TV, kitchen and smart-home activity. The scene runs as a continuous room story.','Observe la lumière, les personnes, la TV, la cuisine et la maison intelligente. La scène fonctionne comme une histoire continue.')}</p></div></div>`;$('creatorCoach').textContent=t('Keep watching: this test uses a full live-room sequence, not a static scan.','Continue à regarder : ce test utilise une séquence de pièce vivante, pas un simple scan statique.');roomLiveRAF=requestAnimationFrame(drawRoomLiveFrame);window.playTone?.(true);
}
function stopRoomLiveTest(){if(roomLiveRAF)cancelAnimationFrame(roomLiveRAF);roomLiveRAF=0;roomLiveActive=false;roomLiveProgress=0;stage.classList.remove('room-live-test');renderTemplate('room');}
function renderTemplate(id){
  tctx.clearRect(0,0,templateCanvas.width,templateCanvas.height);
  if(!templateOn&&!(id==='vehicle'&&vehicleRevealActive))return;
  if(id==='vehicle'){drawVehicleBlueprint();return}
  if(id==='room'){drawRoomDesignTemplate();return}
  tctx.save();tctx.strokeStyle='rgba(132,222,255,.30)';tctx.fillStyle='rgba(92,124,255,.06)';tctx.lineWidth=4;tctx.setLineDash([12,10]);
  if(id==='room'){tctx.strokeRect(120,70,560,320);tctx.strokeRect(140,92,250,120);tctx.strokeRect(420,92,230,120);tctx.beginPath();tctx.moveTo(400,70);tctx.lineTo(400,390);tctx.stroke()}
  else if(id==='park'){tctx.beginPath();tctx.moveTo(70,330);tctx.bezierCurveTo(220,210,330,410,480,250);tctx.bezierCurveTo(590,140,680,220,755,120);tctx.stroke();tctx.beginPath();tctx.ellipse(610,315,105,65,0,0,Math.PI*2);tctx.stroke()}
  tctx.restore();
}
function updateBlueprintVisibility(){
  stage.classList.toggle('blueprints-off',!templateOn);
  const generic=$('toggleTemplate'),vehicleToggle=$('vehicleToggleTemplate'),drawingToolbar=$('creatorDrawingToolbar');
  const label=templateOn?t('👻 Blueprint on','👻 Plan activé'):t('👻 Blueprint off','👻 Plan désactivé');
  if(generic){generic.textContent=label;generic.hidden=active==='vehicle';}
  if(vehicleToggle){vehicleToggle.textContent=label;vehicleToggle.classList.toggle('active',templateOn);}
  if(drawingToolbar)drawingToolbar.hidden=active==='vehicle'&&templateOn;
  if(active==='vehicle'&&templateOn&&tool!=='select')setTool('select');
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
function stashCurrentVehicleBuild(){
  if(active!=='vehicle'||!currentLibraryId)return;
  stashVehiclePowerVariant();stashVehicleFutureVariant();
  vehicleBuildStates[currentLibraryId]={objects:objectData(),activeMode,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePowertrain,vehicleHybridType,vehicleFutureAbility,vehicleFlightSystem,vehicleCreationName,vehiclePaintColor,vehiclePowerVariants:JSON.parse(JSON.stringify(vehiclePowerVariants||{})),vehicleFutureVariants:JSON.parse(JSON.stringify(vehicleFutureVariants||{}))};
}
function resetVehiclePresentationForSwitch(){
  /* Test/reveal state belongs to the vehicle that launched it. Never carry a celebration,
     colour phase or test-world frame into another vehicle. The fitted build itself is
     preserved separately in vehicleBuildStates. */
  hideVehicleStageNotice();
  resetVehiclePhaseOneReveal();
  testRunning=false;
  stage.classList.remove('testing','test-active');
  $('stopCreationTest').hidden=true;
  simulation.className='creator-simulation';simulation.innerHTML='';clearTestClasses();
  $('creatorTestResult').innerHTML='';
}
function restoreVehicleBuildFor(id){
  const st=vehicleBuildStates[id]||null;objectLayer.innerHTML='';selectObject(null);
  activeMode=st?.activeMode||'body';vehicleYaw=Number.isFinite(st?.vehicleYaw)?st.vehicleYaw:0;vehiclePitch=Number.isFinite(st?.vehiclePitch)?st.vehiclePitch:.10;vehicleViewMode=st?.vehicleViewMode||'left';
  vehiclePowertrain=st?.vehiclePowertrain||'';vehicleHybridType=st?.vehicleHybridType||'self';vehicleFutureAbility=st?.vehicleFutureAbility||'';vehicleFlightSystem=st?.vehicleFlightSystem||'';vehicleCreationName=st?.vehicleCreationName||'';vehiclePaintColor=st?.vehiclePaintColor||'#5de4ff';vehiclePowerVariants=JSON.parse(JSON.stringify(st?.vehiclePowerVariants||{}));vehicleFutureVariants=JSON.parse(JSON.stringify(st?.vehicleFutureVariants||{}));
  if(st?.objects?.length)restoreObjects(st.objects);
}

function renderLibrary(m){
  const panel=$('creatorLibraryPanel'),host=$('creatorLibrary');if(!m.library){panel.hidden=true;return}
  panel.hidden=false;$('creatorModeStep').textContent='2 • '+t('CHOOSE A DESIGN MODE','CHOISIS UN MODE');$('creatorDesignStep').textContent='3 • '+t('YOUR DESIGN','TON DESIGN');host.innerHTML='';
  if(active==='vehicle'){
    $('creatorLibraryTitle').textContent=t('Choose your vehicle.','Choisis ton véhicule.');
    $('creatorLibraryHelp').textContent=t('One vehicle is shown at a time. Choose Sport Car, 4×4 / SUV, Van, Intercity Coach or Farm Tractor from the compact list.','Un seul véhicule est affiché à la fois. Choisis Voiture de sport, 4×4 / SUV, Van, Autocar interurbain ou Tracteur agricole dans la liste compacte.');
    const current=vehicleLibrary.find(v=>v.id===currentLibraryId)||vehicleLibrary[0];currentLibraryId=current.id;
    const opts=VEHICLE_CATALOG.map(v=>`<option value="${v.id}" ${v.id===currentLibraryId?'selected':''} ${v.available?'':'disabled'}>${L(v.name)}${v.available?'':` — ${t('coming soon','bientôt')}`}</option>`).join('');
    host.className='creator-library-grid creator-vehicle-picker';
    host.innerHTML=`<div class="creator-vehicle-preview"><img src="${current.img}" alt="${current.name}" width="960" height="540" loading="eager" decoding="async" fetchpriority="high"><div class="creator-vehicle-preview-copy"><span><b>${current.name}</b><small>${current.subtitle}</small></span><strong>${t('Selected','Sélectionné')} ✓</strong></div></div><div class="creator-vehicle-picker-control"><label for="vehiclePickerSelect">${t('Vehicle list','Liste des véhicules')}</label><select id="vehiclePickerSelect">${opts}</select><small>${t('Each vehicle has its own blueprint proportions and puzzle fitting points. Switching vehicle starts or restores that vehicle build.','Chaque véhicule possède ses propres proportions de plan et ses propres emplacements de puzzle. Changer de véhicule démarre ou restaure sa construction.')}</small></div>`;
    const select=$('vehiclePickerSelect');if(select)select.onchange=()=>{const item=vehicleLibrary.find(v=>v.id===select.value);if(item)chooseLibrary(item)};
    return;
  }
  if(active==='room'){
    $('creatorLibraryTitle').textContent=t('Choose the room style you want to design.','Choisis le style de pièce que tu veux concevoir.');
    $('creatorLibraryHelp').textContent=t('This is your visual direction. Build your own layout, then Test My Creation turns it into a live-use room scene.','Ceci définit la direction visuelle. Construis ton propre agencement, puis Tester ma création transforme la pièce en scène vivante.');
    host.className='creator-library-grid creator-room-style-grid';
    m.library.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='creator-library-card'+(item.id===currentLibraryId?' active':'');b.dataset.libraryId=item.id;b.dataset.status=t('✓ selected style','✓ style sélectionné');b.innerHTML=`<img src="${item.img}" alt="${item.name}" loading="lazy" decoding="async"><span><b>${item.name}</b><small>${item.subtitle}</small></span>`;b.onclick=()=>chooseLibrary(item);host.appendChild(b)});
    return;
  }
  host.className='creator-library-grid';
  m.library.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='creator-library-card';b.dataset.libraryId=item.id;b.dataset.status=t('✓ blueprint added','✓ plan ajouté');b.innerHTML=`<img src="${item.img}" alt="${item.name}"><span><b>${item.name}</b><small>${item.subtitle}</small></span>`;b.onclick=()=>chooseLibrary(item);host.appendChild(b)});refreshLibraryCards();
}
function refreshLibraryCards(){document.querySelectorAll('.creator-library-card').forEach(card=>{const exists=(active==='vehicle'||active==='room')?card.dataset.libraryId===currentLibraryId:[...objectLayer.children].some(o=>o.dataset.kind==='blueprint'&&o.dataset.blueprintId===card.dataset.libraryId);card.classList.toggle('active',exists)});}
function chooseLibrary(item){if(active==='vehicle'){
  const changed=!!currentLibraryId&&currentLibraryId!==item.id;
  if(changed){stashCurrentVehicleBuild();resetVehiclePresentationForSwitch();}
  currentLibraryId=item.id;
  if(changed)restoreVehicleBuildFor(item.id);
  else if(!vehicleBuildStates[item.id]){vehicleYaw=0;vehiclePitch=.10;vehicleViewMode='left';}
  /* Re-render everything from the selected vehicle's own state. A completed SUV must not
     leave its Mission Complete canvas on the Sport Car, Van, Coach or Tractor. */
  renderLibrary(missions[active]);
  renderTemplate('vehicle');updateVehicleViewUI();renderModes(missions[active],activeMode);updateVehicleProgressUI();
  if(vehicleReadyForTest()){
    showVehicleStageNotice(t('Vehicle build complete — ready to test','Construction terminée — prêt à tester'),`${vehicleModelLabel()} · ${t('Press Test My Creation when you are ready.','Appuie sur Tester ma création quand tu es prêt.')}`,{duration:0});
  }else{
    hideVehicleStageNotice();
    $('creatorTestResult').innerHTML='';
  }
  commitHistory();return
}
if(active==='room'){
  currentLibraryId=item.id;
  renderLibrary(missions.room);
  renderTemplate('room');
  $('creatorCoach').textContent=t('Style selected. Now build a usable room: lounge, dining, kitchen, lighting and smart-home details.','Style sélectionné. Construis maintenant une pièce utilisable : salon, repas, cuisine, lumière et maison intelligente.');
  commitHistory();return;
}
currentLibraryId=item.id;const existing=[...objectLayer.children].find(o=>o.dataset.kind==='blueprint'&&o.dataset.blueprintId===item.id);if(existing){selectObject(existing);renderModes(missions[active],activeMode);return}const count=[...objectLayer.children].filter(o=>o.dataset.kind==='blueprint').length;const x=.30+((count%3)*.22),y=.30+(Math.floor(count/3)*.28);addBlueprint(item,clamp(x,.18,.82),clamp(y,.22,.78),active==='robot'?180:310,0,{commit:true,select:true});renderModes(missions[active],null);refreshLibraryCards();}

function renderModes(m,preferred){
  const modes=modesForMission(m);if(!modes.length)return;
  activeMode=(preferred&&modes.some(x=>x.id===preferred))?preferred:(activeMode&&modes.some(x=>x.id===activeMode)?activeMode:modes[0].id);
  const host=$('creatorModes');host.innerHTML='';
  modes.forEach(md=>{
    const complete=active==='vehicle'&&vehicleModeComplete(md.id);
    const b=document.createElement('button');b.type='button';b.className='creator-mode'+(md.id===activeMode?' active':'')+(complete?' is-complete':'');b.dataset.modeId=md.id;
    const modeCardHelp=(active==='vehicle'&&vehicleIs('tractor')&&md.id==='body')?t('Build the farm machine, cab and the real front/rear implement connection system.','Construis la machine agricole, la cabine et les vrais systèmes de connexion des outils avant/arrière.'):(active==='vehicle'&&vehicleIs('tractor')&&md.id==='future')?t('Fit precision GPS, soil sensing, crop cameras, autonomous guidance and the farm-drone dock.','Installe le GPS de précision, les capteurs du sol, les caméras de cultures, le guidage autonome et la station du drone agricole.'):L(md.help);
    b.innerHTML=`<span>${md.icon}</span><b>${L(md.label)}</b><small>${modeCardHelp}</small>${complete?`<small class="creator-mode-status">✓ ${t('Complete','Terminé')}</small>`:''}`;
    b.onclick=()=>{activeMode=md.id;renderModes(m,activeMode);if(active==='vehicle'){renderTemplate('vehicle');updateVehicleProgressUI();}if(active==='room')renderTemplate('room');commitHistory()};host.appendChild(b)
  });
  const selected=modes.find(x=>x.id===activeMode);
  $('creatorModeHelp').textContent=(active==='vehicle'&&vehicleIs('tractor')&&selected.id==='future')
    ?t('Build GPS guidance, soil sensing, crop cameras, autonomous control and a farm-drone dock — technology that makes real field work smarter and more precise.','Construis le guidage GPS, les capteurs du sol, les caméras de cultures, le contrôle autonome et la station du drone agricole — des technologies qui rendent le travail des champs plus intelligent et précis.')
    :L(selected.help);renderComponents(selected);
  if(active==='vehicle'){renderTemplate('vehicle');updateVehicleProgressUI();}
}
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
  commitHistory();if(active==='room')renderTemplate('room');return el;
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
    if(vehicleIs('tractor')){
      if(vehicleFutureAbility!=='smart-farm'){stashVehicleFutureVariant();removeVehicleSystemObjects('future');vehicleFutureAbility='smart-farm';vehicleFlightSystem='';restoreVehicleFutureVariant();}
      host.innerHTML=`<div class="creator-palette-title"><b>${t('Precision Agriculture Technology','Technologie d’agriculture de précision')}</b><small>${t('A farm tractor does not need to fly or swim. Build the sensing, GPS and autonomous-guidance systems that make one tractor work more accurately across a real farm.','Un tracteur agricole n’a pas besoin de voler ni de naviguer. Construis les systèmes de capteurs, GPS et guidage autonome qui lui permettent de travailler avec précision sur une vraie ferme.')}</small></div>`;
      const config=vehicleFutureConfig(),ids=new Set(vehicleFuturePartIdsForSelection());
      const title=document.createElement('div');title.className='creator-palette-title';title.innerHTML=`<b>${t('Required smart-farm systems','Systèmes agricoles intelligents requis')}</b><small>${t('Fit all five systems. They will be used later for route guidance, crop scanning, soil sensing and farm-drone coordination.','Installe les cinq systèmes. Ils serviront ensuite au guidage, au suivi des cultures, aux capteurs du sol et à la coordination avec le drone agricole.')}</small>`;host.appendChild(title);
      (md.parts||[]).filter(p=>ids.has(p.id)&&config.required.includes(p.id)).forEach(p=>appendVehiclePartButton(host,p));
      refreshVehicleComponentButtons();return;
    }
    host.innerHTML=`<div class="creator-palette-title"><b>${t('Choose the final Future Tech ability','Choisis la capacité finale de technologie future')}</b><small>${t('Choose one path for this same completed car: make it fly or make it travel on water.','Choisis une seule voie pour cette même voiture terminée : fais-la voler ou naviguer sur l’eau.')}</small></div>`;
    VEHICLE_FUTURE_ABILITIES.filter(choice=>choice.id!=='smart-farm').forEach(choice=>{const b=document.createElement('button');b.type='button';b.className='creator-component';if(vehicleFutureAbility===choice.id){b.style.borderColor='rgba(93,228,255,.85)';b.style.background='rgba(93,228,255,.14)';}b.innerHTML=`<span>${choice.icon}</span><small>${L(choice.label)}</small>`;b.onclick=()=>selectVehicleFutureAbility(choice.id);host.appendChild(b)});
    if(!vehicleFutureAbility){const note=document.createElement('div');note.className='creator-palette-title';note.innerHTML=`<small>${t('Choose Flying Car or Water / Amphibious Car. Only the technology required for that ability will appear.','Choisis Voiture volante ou Voiture aquatique / amphibie. Seule la technologie nécessaire à cette capacité apparaîtra.')}</small>`;host.appendChild(note);return;}
    const summary=document.createElement('div');summary.className='creator-palette-title';summary.innerHTML=`<b>${t('Selected','Sélectionné')}: ${vehicleFutureAbilityLabel()}</b><small>${vehicleFutureAbility==='flight'?t('The same completed vehicle will gain flight hardware.','Le même véhicule terminé recevra des équipements de vol.'):t('The same completed vehicle will gain a sealed hull and water propulsion.','Le même véhicule terminé recevra une coque étanche et une propulsion aquatique.')}</small>`;host.appendChild(summary);
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
  host.innerHTML=`<div class="creator-palette-title"><b>${t('Parts for','Pièces pour')} ${L(md.label)}</b><small>${t('Choose the matching puzzle piece. When every required copy is fitted, its button locks.','Choisis la pièce de puzzle correspondante. Quand tous les exemplaires requis sont fixés, son bouton se verrouille.')}</small></div>`;(md.parts||[]).filter(p=>active!=='vehicle'||vehiclePartRequirement(p.id)>0).forEach(p=>appendVehiclePartButton(host,p));refreshVehicleComponentButtons();
}
function vehiclePartDisplayLabel(p){
  if(active!=='vehicle')return L(p.label);const id=vehicleProfile().id;
  const map={
    suv:{door:t('SUV door','Porte de SUV'),window:t('SUV side window','Vitre latérale du SUV'),seat:t('Passenger seat','Siège passager')},
    van:{door:t('Cabin / sliding door','Porte cabine / coulissante'),window:t('Van side window','Vitre latérale du van'),'rear-cargo-door':t('Rear cargo door','Porte de chargement arrière'),seat:t('Passenger seat','Siège passager')},
    coach:{door:t('Coach passenger door','Porte passagers de l’autocar'),window:t('Coach passenger window','Vitre passagers de l’autocar'),hood:t('Engine service cover','Capot d’accès moteur'),seat:t('Passenger seat','Siège passager'),'luggage-bay-door':t('Lower luggage-bay door','Porte de soute à bagages'),'coach-toilet':t('Onboard toilet cabin','Cabine toilettes à bord'),'route-display':t('Destination / route display','Afficheur destination / itinéraire')},
    tractor:{door:t('Cabin door','Porte de cabine'),window:t('Cabin side window','Vitre latérale de cabine'),hood:t('Engine bonnet','Capot moteur'),roof:t('Cabin roof','Toit de cabine')}
  };return map[id]?.[p.id]||L(p.label);
}
function appendVehiclePartButton(host,p){const b=document.createElement('button');b.type='button';b.className='creator-component';b.dataset.partId=p.id;const need=active==='vehicle'?vehiclePartRequirement(p.id):0,done=active==='vehicle'?vehicleInstalledPartCount(p.id):0;b.innerHTML=`<span>${paletteVisual(p)}</span><small>${vehiclePartDisplayLabel(p)}${need?` <em data-part-counter>${done}/${need}</em>`:''}</small>`;b.onclick=()=>addPalettePart(p);host.appendChild(b);}

function roomPartSvg(id){
  const svg=(body,view='0 0 120 80')=>`<svg class="creator-object-icon room-object-svg" viewBox="${view}" aria-hidden="true">${body}</svg>`;
  const shadow='<ellipse cx="60" cy="70" rx="46" ry="6" fill="rgba(0,0,0,.18)"/>';
  switch(id){
    case 'sofa':return svg(`${shadow}<defs><linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5efe7"/><stop offset="1" stop-color="#b9a996"/></linearGradient></defs><rect x="13" y="31" width="94" height="31" rx="10" fill="url(#rs)" stroke="#6f655a"/><rect x="18" y="18" width="84" height="27" rx="10" fill="#ded2c5" stroke="#776d63"/><rect x="19" y="29" width="8" height="35" rx="4" fill="#9b8a78"/><rect x="93" y="29" width="8" height="35" rx="4" fill="#9b8a78"/><line x1="58" y1="22" x2="58" y2="43" stroke="#b7a99a"/>`);
    case 'armchair':return svg(`${shadow}<rect x="27" y="28" width="66" height="36" rx="12" fill="#c9b396" stroke="#665a4d"/><rect x="35" y="15" width="50" height="31" rx="12" fill="#dbcbb6"/><rect x="23" y="34" width="12" height="27" rx="6" fill="#a88d6f"/><rect x="85" y="34" width="12" height="27" rx="6" fill="#a88d6f"/>`);
    case 'coffee-table':return svg(`${shadow}<ellipse cx="60" cy="36" rx="45" ry="19" fill="#8b5d3b" stroke="#4a3427"/><ellipse cx="60" cy="32" rx="42" ry="16" fill="#a97750"/><rect x="54" y="42" width="12" height="25" rx="3" fill="#49352b"/>`);
    case 'television':return svg(`<rect x="10" y="10" width="100" height="58" rx="5" fill="#111b26" stroke="#93a8bb" stroke-width="2"/><rect x="15" y="15" width="90" height="48" rx="2" fill="url(#tvgrad)"/><defs><linearGradient id="tvgrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#153c70"/><stop offset=".5" stop-color="#7b4fb5"/><stop offset="1" stop-color="#ff8a55"/></linearGradient></defs><rect x="48" y="69" width="24" height="4" rx="2" fill="#5c6570"/>`);
    case 'tv-stand':return svg(`${shadow}<rect x="9" y="34" width="102" height="29" rx="4" fill="#6d513b" stroke="#3f3025"/><rect x="17" y="42" width="26" height="14" rx="2" fill="#261f1b"/><rect x="48" y="42" width="27" height="14" rx="2" fill="#8c6e50"/><rect x="80" y="42" width="23" height="14" rx="2" fill="#261f1b"/>`);
    case 'shelf':return svg(`<rect x="28" y="7" width="64" height="68" rx="3" fill="#5f4837" stroke="#30251e"/><g stroke="#c0996b" stroke-width="3"><line x1="31" y1="25" x2="89" y2="25"/><line x1="31" y1="43" x2="89" y2="43"/><line x1="31" y1="61" x2="89" y2="61"/></g><g fill="#d9b56f"><rect x="36" y="12" width="7" height="11"/><rect x="46" y="10" width="8" height="13"/><rect x="67" y="30" width="8" height="11"/><circle cx="77" cy="54" r="6" fill="#5d8d62"/></g>`);
    case 'dining-table':return svg(`${shadow}<polygon points="18,31 72,18 106,35 53,48" fill="#9b6e48" stroke="#49352a"/><line x1="27" y1="39" x2="25" y2="69" stroke="#4b382d" stroke-width="7"/><line x1="94" y1="39" x2="95" y2="69" stroke="#4b382d" stroke-width="7"/>`);
    case 'dining-chair':return svg(`${shadow}<rect x="39" y="27" width="42" height="27" rx="4" fill="#b99f81" stroke="#655543"/><rect x="42" y="8" width="36" height="27" rx="5" fill="#d2c1aa"/><g stroke="#53463a" stroke-width="5"><line x1="44" y1="52" x2="40" y2="72"/><line x1="76" y1="52" x2="80" y2="72"/></g>`);
    case 'kitchen-counter':return svg(`${shadow}<rect x="8" y="27" width="104" height="37" rx="3" fill="#b3a48e" stroke="#5e5549"/><rect x="6" y="22" width="108" height="9" rx="3" fill="#e6e0d6"/><g stroke="#756a5a"><line x1="42" y1="32" x2="42" y2="62"/><line x1="78" y1="32" x2="78" y2="62"/></g>`);
    case 'kitchen-sink':return svg(`<rect x="13" y="31" width="94" height="27" rx="4" fill="#ae9c80"/><ellipse cx="60" cy="40" rx="27" ry="10" fill="#bfcbd0" stroke="#687b84"/><path d="M60 36V18c0-10 22-10 22 1v10" fill="none" stroke="#596e76" stroke-width="5"/>`);
    case 'hob':return svg(`<rect x="15" y="20" width="90" height="48" rx="6" fill="#222a2d" stroke="#8da0a8"/><g fill="none" stroke="#e3a24b" stroke-width="3"><circle cx="39" cy="38" r="12"/><circle cx="80" cy="38" r="12"/><circle cx="59" cy="58" r="9"/></g>`);
    case 'oven':return svg(`<rect x="28" y="7" width="64" height="68" rx="5" fill="#2d3438" stroke="#8d9aa0"/><rect x="35" y="26" width="50" height="35" rx="3" fill="#151d22" stroke="#75858d"/><circle cx="40" cy="17" r="3" fill="#d4e4e9"/><circle cx="51" cy="17" r="3" fill="#d4e4e9"/>`);
    case 'fridge':return svg(`<rect x="33" y="4" width="54" height="72" rx="5" fill="#d6dde0" stroke="#75858d"/><line x1="35" y1="34" x2="85" y2="34" stroke="#89979d"/><line x1="77" y1="12" x2="77" y2="28" stroke="#4e5f66" stroke-width="3"/>`);
    case 'floor-lamp':return svg(`${shadow}<circle cx="61" cy="19" r="18" fill="#f0d3a2" stroke="#6c5a45"/><line x1="61" y1="36" x2="61" y2="69" stroke="#3d4650" stroke-width="5"/><ellipse cx="61" cy="72" rx="18" ry="4" fill="#343a40"/>`);
    case 'plant':return svg(`${shadow}<path d="M52 69h16l7-24H45z" fill="#a27453"/><g fill="#4f8b59"><ellipse cx="43" cy="32" rx="12" ry="24" transform="rotate(-25 43 32)"/><ellipse cx="75" cy="30" rx="12" ry="25" transform="rotate(28 75 30)"/><ellipse cx="60" cy="22" rx="11" ry="25"/></g>`);
    case 'robot-vacuum':return svg(`${shadow}<ellipse cx="60" cy="48" rx="38" ry="22" fill="#1d2730" stroke="#66d9ff" stroke-width="2"/><ellipse cx="60" cy="42" rx="32" ry="17" fill="#293744"/><circle cx="60" cy="42" r="5" fill="#64e4ff"/>`);
    case 'smart-speaker':return svg(`${shadow}<rect x="42" y="18" width="36" height="48" rx="18" fill="#252f38"/><ellipse cx="60" cy="24" rx="14" ry="5" fill="#64dfff"/><circle cx="60" cy="43" r="2" fill="#d9faff"/>`);
    case 'room-rug':return svg(`<polygon points="18,25 84,15 108,54 38,70" fill="#d8d0c2" stroke="#8d8273"/><path d="M30 31L88 24M35 42L95 34M42 53L100 45" stroke="#b0a698"/>`);
    default:return '';
  }
}
function paletteVisual(p){const carVisual=vehiclePartSvg(p.id);if(carVisual)return carVisual;const roomVisual=roomPartSvg(p.id);if(roomVisual)return roomVisual;if(p.className==='park-bench')return '<span class="creator-mini-bench"><i></i><i></i><i></i></span>';if(p.className==='shelf')return '▤';if(p.className==='sofa')return '🛋️';if(p.className==='fluorescent')return '▬';if(p.className==='chassis')return '▰';if(p.className==='amphibious')return '⛴️';if(p.className==='wing')return '🪽';return p.icon||'◆';}

function renderPlan(m,saved={}){const host=$('creatorPlanFields');host.innerHTML='';host.hidden=active==='vehicle';if(active!=='vehicle')m.prompts.forEach((q,i)=>{const l=document.createElement('label');l.textContent=L(q);const inp=document.createElement('input');inp.dataset.plan=i;inp.value=saved.plan?.[i]||'';l.appendChild(inp);host.appendChild(l)});$('creatorNotes').value=saved.notes||'';}

function vehiclePartSvg(id){
  const common='class="creator-object-icon creator-vehicle-part" viewBox="0 0 120 80" aria-hidden="true"';
  if(id==='wheel')return `<svg ${common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#202733" stroke="#d7e4ee" stroke-width="4"/><circle cx="50" cy="50" r="31" fill="#b8c4cf" stroke="#f4f8fb" stroke-width="3"/><circle cx="50" cy="50" r="8" fill="#303b48"/>${[0,72,144,216,288].map(a=>`<rect x="47" y="17" width="6" height="30" rx="3" fill="#4a5b69" transform="rotate(${a} 50 50)"/>`).join('')}</svg>`;
  if(['door','window','windscreen','rear-window','roof','mirror','headlight','taillight','bumper','rear-bumper','hood','trunk','rear-cargo-door','luggage-bay-door','route-display'].includes(id)){
    const pts=vehiclePartShape(id).map(([a,b])=>`${(60+a*52).toFixed(1)},${(40+b*31).toFixed(1)}`).join(' ');
    const style=vehiclePartFill(id);
    const handle=id==='door'?'<path d="M82 37h13" stroke="#33495b" stroke-width="4" stroke-linecap="round"/>':id==='rear-cargo-door'?'<path d="M60 18v44M52 40h6M68 40h-6" stroke="#33495b" stroke-width="3" stroke-linecap="round"/>':id==='luggage-bay-door'?'<path d="M18 24h84v32H18zM52 40h16" fill="none" stroke="#33495b" stroke-width="3"/>':id==='route-display'?'<path d="M25 40h70" stroke="#5de4ff" stroke-width="4" stroke-linecap="round"/>':'';
    return `<svg ${common}><polygon points="${pts}" fill="${style.fill}" stroke="#eef8ff" stroke-width="4" stroke-linejoin="round"/>${handle}</svg>`;
  }
  if(['dashboard','driver-seat','seat','belt','battery','camera','indicator','safety-light','petrol-engine','diesel-engine','inverter','fuel-tank','exhaust','radiator','dpf','solar','wing','jet','amphibious','stabiliser','future-sensor'].includes(id)){
    const pts=vehiclePartShape(id).map(([a,b])=>`${(60+a*52).toFixed(1)},${(40+b*31).toFixed(1)}`).join(' ');
    const fills={dashboard:'#475766','driver-seat':'#596a79',seat:'#596a79',belt:'#d9e4ed',battery:'#55d99a',camera:'#4abeE0',indicator:'#ffae36','safety-light':'#ed5968','petrol-engine':'#aeb8c2','diesel-engine':'#929eaa',inverter:'#55d99a','fuel-tank':'#b89b70',exhaust:'#9b8261',radiator:'#b7c2cb',dpf:'#a8b2bc',solar:'#418bd5',wing:'#7c7eff',jet:'#a770ff',amphibious:'#40b1e8',stabiliser:'#7c7eff','future-sensor':'#47e5de'};
    return `<svg ${common}><polygon points="${pts}" fill="${fills[id]||'#596a79'}" stroke="#e5edf3" stroke-width="4" stroke-linejoin="round"/></svg>`;
  }
  if(id==='coach-toilet')return `<svg ${common} viewBox="0 0 100 100"><rect x="21" y="12" width="58" height="76" rx="9" fill="#dce8ef" stroke="#ffffff" stroke-width="5"/><circle cx="50" cy="37" r="10" fill="none" stroke="#617789" stroke-width="5"/><path d="M50 48v19M36 56h28M41 85l9-18 9 18" fill="none" stroke="#617789" stroke-width="5" stroke-linecap="round"/></svg>`;
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
function visualHTML(p){const carVisual=vehiclePartSvg(p.id);if(carVisual)return carVisual;const roomVisual=roomPartSvg(p.id);if(roomVisual)return roomVisual;switch(p.className){case'park-bench':return '<span class="creator-object-icon creator-visual creator-bench-visual"><i></i><i></i><i></i><i></i></span>';case'shelf':return '<span class="creator-object-icon creator-visual creator-shelf-visual"></span>';case'sofa':return '<span class="creator-object-icon creator-visual creator-sofa-visual"></span>';case'fluorescent':return '<span class="creator-object-icon creator-visual creator-fluorescent-visual"></span>';case'tvstand':return '<span class="creator-object-icon creator-visual creator-tvstand-visual"></span>';case'settop':return '<span class="creator-object-icon creator-visual creator-settop-visual"></span>';case'chassis':return '<span class="creator-object-icon creator-visual creator-chassis-visual"></span>';case'amphibious':return '<span class="creator-object-icon creator-visual creator-amphibious-visual"></span>';case'wing':return '<span class="creator-object-icon creator-visual creator-wing-visual"></span>';case'toilet':return '<span class="creator-object-icon creator-toilet-visual"></span>';default:return `<span class="creator-object-icon">${p.icon||'◆'}</span>`;}}
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
function makeObjectInteractive(el){el.addEventListener('pointerdown',e=>{if(testRunning||el.dataset.installed==='1')return;e.preventDefault();e.stopPropagation();if(tool==='eraser'){selectObject(el);deleteSelected();return}selectObject(el);const r=stage.getBoundingClientRect(),sx=e.clientX,sy=e.clientY,startX=+el.dataset.x,startY=+el.dataset.y;el.setPointerCapture?.(e.pointerId);el.classList.add('dragging');const move=ev=>{el.dataset.installed='0';el.classList.remove('installed-part');clearVehicleProjectedStyle(el);el.dataset.x=clamp(startX+(ev.clientX-sx)/r.width,.02,.98);el.dataset.y=clamp(startY+(ev.clientY-sy)/r.height,.02,.98);applyObjectStyle(el)};const up=()=>{el.classList.remove('dragging');el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);softSnap(el);commitHistory();if(active==='room')renderTemplate('room')};el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)});}
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
    updateVehicleProgressUI();
    const completedMode=activeMode;
    if(vehicleModeComplete(completedMode))setTimeout(()=>advanceVehicleAfterCompletion(completedMode),260);
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
  const ready=vehicleIs('tractor')?vehicleFutureAbility==='smart-farm':(vehicleFutureAbility!=='flight'||!!vehicleFlightSystem);
  return{chosen:!!vehicleFutureAbility,ready,done:req.filter(x=>used.has(x.key)).length,total:req.length,missing:req.filter(x=>!used.has(x.key))};
}
function vehiclePuzzleProgress(){
  const body=vehicleBodyProgress(),power=vehiclePowerProgress(),safety=vehicleSafetyProgress(),future=vehicleFutureProgress();
  return{done:body.done+power.done+safety.done+future.done,total:body.total+power.total+safety.total+future.total,body,power,safety,future};
}

function vehicleModeComplete(id){
  if(active!=='vehicle')return false;
  if(id==='body'){const p=vehicleBodyProgress();return p.total>0&&p.done>=p.total;}
  if(id==='power'){const p=vehiclePowerProgress();return p.chosen&&p.total>0&&p.done>=p.total;}
  if(id==='safety'){const p=vehicleSafetyProgress();return p.total>0&&p.done>=p.total;}
  if(id==='future'){const p=vehicleFutureProgress();return p.chosen&&p.ready&&p.total>0&&p.done>=p.total;}
  return false;
}
function vehicleReadyForTest(){return ['body','power','safety','future'].every(vehicleModeComplete)}
function vehicleModeLabel(id){const md=modesForMission(missions.vehicle).find(x=>x.id===id);return md?L(md.label):id}
function updateVehicleProgressUI(){
  if(active!=='vehicle')return;
  document.querySelectorAll('#creatorModes .creator-mode[data-mode-id]').forEach(b=>{const complete=vehicleModeComplete(b.dataset.modeId);b.classList.toggle('is-complete',complete);let st=b.querySelector('.creator-mode-status');if(complete&&!st){st=document.createElement('small');st.className='creator-mode-status';st.textContent='✓ '+t('Complete','Terminé');b.appendChild(st)}else if(!complete&&st)st.remove();});
  const ready=vehicleReadyForTest(),btn=$('testCreation');if(btn){btn.disabled=!ready;btn.classList.toggle('vehicle-ready',ready);btn.title=ready?t('Your vehicle is ready to test.','Ton véhicule est prêt à être testé.'):t('Complete Body & Movement, Power System, Safety and Future Tech first.','Termine Carrosserie et mouvement, Système d’énergie, Sécurité et Technologies futures.');}
  /* A completed build is a stable state, not a short toast. If a child switches away
     from a completed power/future configuration and later returns to it, restore the
     permanent ready-to-test notice as well as the fitted pieces. */
  if(ready&&!testRunning)showVehicleStageNotice(t('Vehicle build complete — ready to test','Construction terminée — prêt à tester'),t('All four build areas are complete. Press Test My Creation when you are ready.','Les quatre zones sont terminées. Appuie sur Tester ma création quand tu es prêt.'),{duration:0});
}
function showVehicleStageNotice(title,detail,opts={}){
  const box=$('vehicleStageNotice');if(!box||active!=='vehicle')return;
  clearTimeout(vehicleNoticeTimer);box.innerHTML=`<b>${title}</b><span>${detail||''}</span>${opts.buttonLabel?`<button type="button" id="vehicleNoticeAction">${opts.buttonLabel}</button>`:''}`;box.hidden=false;
  const action=$('vehicleNoticeAction');if(action)action.onclick=()=>{opts.onAction?.();box.hidden=true;};
  if(opts.duration!==0)vehicleNoticeTimer=setTimeout(()=>{box.hidden=true},opts.duration||4200);
}
function hideVehicleStageNotice(){const box=$('vehicleStageNotice');if(box)box.hidden=true;clearTimeout(vehicleNoticeTimer);}
function advanceVehicleAfterCompletion(completedMode){
  if(active!=='vehicle'||!vehicleModeComplete(completedMode))return;
  const order=['body','power','safety','future'],start=order.indexOf(completedMode);let next=null;
  for(let step=1;step<=order.length;step++){const id=order[(start+step)%order.length];if(!vehicleModeComplete(id)){next=id;break}}
  if(next){
    activeMode=next;renderModes(missions.vehicle,next);renderTemplate('vehicle');updateVehicleProgressUI();
    showVehicleStageNotice(`✓ ${vehicleModeLabel(completedMode)} ${t('complete','terminé')}`,`${t('Next build area','Zone suivante')}: ${vehicleModeLabel(next)}. ${t('You can still choose any unfinished area yourself.','Tu peux toujours choisir toi-même une autre zone non terminée.')}`);
  }else{
    updateVehicleProgressUI();showVehicleStageNotice(t('Vehicle build complete — ready to test','Construction terminée — prêt à tester'),t('All four build areas are complete. Test My Creation is unlocked and this message will stay until you test or change to an unfinished configuration.','Les quatre zones sont terminées. Tester ma création est déverrouillé et ce message reste affiché jusqu’au test ou jusqu’au choix d’une configuration incomplète.'),{duration:0});window.playTone?.(true);
  }
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
function restoreObjects(items=[],opts={}){
  /* Full project/vehicle restores replace the object layer. Power/Future-Tech variant
     restores must APPEND only their own saved pieces; clearing the whole layer here
     would erase Body & Movement, Safety and the other completed systems. */
  const append=opts.append===true;
  if(!append){objectLayer.innerHTML='';selectedObject=null;}
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
function snapshot(){return{drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePowertrain,vehicleHybridType,vehicleFutureAbility,vehicleFlightSystem,vehiclePowerVariants:JSON.parse(JSON.stringify(vehiclePowerVariants||{})),vehicleFutureVariants:JSON.parse(JSON.stringify(vehicleFutureVariants||{}))};}
function resetHistory(){history=[snapshot()];historyIndex=0;updateHistoryButtons();}
function commitHistory(){if(restoring||!active)return;history=history.slice(0,historyIndex+1);history.push(snapshot());if(history.length>50)history.shift();historyIndex=history.length-1;updateHistoryButtons();}
function updateHistoryButtons(){$('undoDraw').disabled=historyIndex<=0;$('redoDraw').disabled=historyIndex<0||historyIndex>=history.length-1;}
function restoreDrawing(data,cb){ctx.clearRect(0,0,canvas.width,canvas.height);if(!data){cb?.();return}const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);cb?.()};img.onerror=()=>cb?.();img.src=data;}
function restoreSnapshot(s){restoring=true;templateOn=s.templateOn!==false;gridOn=!!s.gridOn;activeMode=s.activeMode;currentLibraryId=s.currentLibraryId;vehicleYaw=Number.isFinite(s.vehicleYaw)?s.vehicleYaw:vehicleYaw;vehiclePitch=Number.isFinite(s.vehiclePitch)?s.vehiclePitch:vehiclePitch;vehicleViewMode=s.vehicleViewMode||vehicleViewMode;vehiclePowertrain=s.vehiclePowertrain||'';vehicleHybridType=s.vehicleHybridType||'self';vehicleFutureAbility=s.vehicleFutureAbility||'';vehicleFlightSystem=s.vehicleFlightSystem||'';vehiclePowerVariants=JSON.parse(JSON.stringify(s.vehiclePowerVariants||{}));vehicleFutureVariants=JSON.parse(JSON.stringify(s.vehicleFutureVariants||{}));stage.classList.toggle('show-grid',gridOn);updateBlueprintVisibility();renderTemplate(active);updateVehicleViewUI();renderModes(missions[active],activeMode);restoreDrawing(s.drawing,()=>{restoreObjects(s.objects);restoring=false;updateHistoryButtons()});}

function openMission(id){const m=missions[id];if(!m)return;stopTest(false);active=id;activeMode=null;currentLibraryId=m.library?.[0]?.id||null;drawStrokes=0;selectedObject=null;ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';simulation.innerHTML='';$('creatorTestResult').innerHTML='';$('creatorTitle').textContent=L(m.title);$('creatorPrompt').textContent=L(m.prompt);$('creatorSteps').innerHTML=[t('Choose a blueprint if this mission offers one','Choisis un plan si la mission en propose un'),t('Choose a design mode and load the matching small parts','Choisis un mode et charge les petites pièces correspondantes'),t('Draw, arrange, resize, rotate and combine pieces','Dessine, organise, redimensionne, tourne et combine les pièces'),t('Test, stop, improve and test again','Teste, arrête, améliore puis reteste')].map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('');let saved=loadStore()[id]||{};if(id==='vehicle'&&saved.vehiclePuzzleVersion!==VEHICLE_PUZZLE_VERSION){saved={plan:saved.plan||[],notes:saved.notes||'',templateOn:true,gridOn:!!saved.gridOn,currentLibraryId:saved.currentLibraryId||currentLibraryId,vehicleYaw:0,vehiclePitch:.06,vehicleViewMode:'left',objects:[]};}templateOn=saved.templateOn!==false;gridOn=!!saved.gridOn;activeMode=saved.activeMode||null;currentLibraryId=saved.currentLibraryId||currentLibraryId;if(id==='vehicle'&&!vehicleLibrary.some(v=>v.id===currentLibraryId))currentLibraryId='vehicle-sport';if(id==='vehicle'){vehicleBuildStates=saved.vehicleBuildStates||{};if(!vehicleBuildStates[currentLibraryId]&&(saved.objects||[]).length)vehicleBuildStates[currentLibraryId]={objects:saved.objects,activeMode:saved.activeMode||'body',vehicleYaw:saved.vehicleYaw,vehiclePitch:saved.vehiclePitch,vehicleViewMode:saved.vehicleViewMode,vehiclePowertrain:saved.vehiclePowertrain,vehicleHybridType:saved.vehicleHybridType,vehicleFutureAbility:saved.vehicleFutureAbility,vehicleFlightSystem:saved.vehicleFlightSystem,vehicleCreationName:saved.vehicleCreationName,vehiclePaintColor:saved.vehiclePaintColor,vehiclePowerVariants:saved.vehiclePowerVariants||{},vehicleFutureVariants:saved.vehicleFutureVariants||{}};}const vehicleSaved=id==='vehicle'?(vehicleBuildStates[currentLibraryId]||saved):saved;if(id==='vehicle'&&!activeMode)activeMode=vehicleSaved.activeMode||'body';vehicleYaw=Number.isFinite(vehicleSaved.vehicleYaw)?vehicleSaved.vehicleYaw:0;vehiclePitch=Number.isFinite(vehicleSaved.vehiclePitch)?vehicleSaved.vehiclePitch:.10;vehicleViewMode=vehicleSaved.vehicleViewMode||'left';vehiclePowertrain=id==='vehicle'?(vehicleSaved.vehiclePowertrain||''):'';vehicleHybridType=id==='vehicle'?(vehicleSaved.vehicleHybridType||'self'):'self';vehicleFutureAbility=id==='vehicle'?(vehicleSaved.vehicleFutureAbility||''):'';vehicleFlightSystem=id==='vehicle'?(vehicleSaved.vehicleFlightSystem||''):'';vehicleCreationName=id==='vehicle'?(vehicleSaved.vehicleCreationName||''):'';vehiclePaintColor=id==='vehicle'?(vehicleSaved.vehiclePaintColor||'#5de4ff'):'#5de4ff';vehiclePowerVariants=id==='vehicle'?JSON.parse(JSON.stringify(vehicleSaved.vehiclePowerVariants||{})):{};vehicleFutureVariants=id==='vehicle'?JSON.parse(JSON.stringify(vehicleSaved.vehicleFutureVariants||{})):{};vehiclePhase5Named=!!vehicleCreationName;stage.classList.toggle('show-grid',gridOn);renderTemplate(id);updateBlueprintVisibility();updateVehicleViewUI();$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');renderLibrary(m);renderModes(m,activeMode);renderPlan(m,saved);$('creatorCoach').textContent=L(m.coach);$('creatorSaved').textContent=saved.updatedAt?t('Saved project restored. Keep creating.','Projet enregistré restauré. Continue à créer.'):'';$('creatorWorkspace').hidden=false;restoreDrawing(saved.drawing,()=>{restoreObjects(id==='vehicle'?(vehicleBuildStates[currentLibraryId]?.objects||saved.objects||[]):(saved.objects||[]));drawStrokes=saved.drawing?3:0;renderLibrary(m);renderModes(m,activeMode);updateBlueprintVisibility();if(id==='vehicle')updateVehicleProgressUI();if(id==='room')renderTemplate('room');resetHistory();$('creatorWorkspace').scrollIntoView({behavior:'smooth',block:'start'})});}

function save(){if(!active)return;if(active==='vehicle')stashCurrentVehicleBuild();const all=loadStore();const plan=[...document.querySelectorAll('#creatorPlanFields [data-plan]')].map(i=>i.value.trim());all[active]={plan,notes:$('creatorNotes').value.trim(),drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,currentLibraryId,vehicleYaw,vehiclePitch,vehicleViewMode,vehiclePowertrain:active==='vehicle'?vehiclePowertrain:undefined,vehicleHybridType:active==='vehicle'?vehicleHybridType:undefined,vehicleFutureAbility:active==='vehicle'?vehicleFutureAbility:undefined,vehicleFlightSystem:active==='vehicle'?vehicleFlightSystem:undefined,vehicleCreationName:active==='vehicle'?vehicleCreationName:undefined,vehiclePaintColor:active==='vehicle'?vehiclePaintColor:undefined,vehiclePowerVariants:active==='vehicle'?vehiclePowerVariants:undefined,vehicleFutureVariants:active==='vehicle'?vehicleFutureVariants:undefined,vehiclePuzzleVersion:active==='vehicle'?VEHICLE_PUZZLE_VERSION:undefined,vehicleBuildStates:active==='vehicle'?vehicleBuildStates:undefined,updatedAt:Date.now()};try{saveStore(all);$('creatorSaved').textContent=t('✅ Project saved. You can return and continue later.','✅ Projet enregistré. Tu peux revenir plus tard.')}catch(_){$('creatorSaved').textContent=t('This design is too large to save on this device.','Ce design est trop volumineux pour cet appareil.')}window.CWState?.setProgress?.('creator',Math.min(95,Object.keys(all).length*16),{lastMission:active});window.CWState?.logActivity?.({id:'creator-'+active,title:`Creator Studio: ${missions[active].title[0]}`,icon:'🎨',detail:'Saved interactive design',href:'creator.html'});}
function clearProjectNow(){stopTest(false);ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';drawStrokes=0;selectObject(null);if(active==='vehicle'){vehiclePowertrain='';vehicleHybridType='self';vehicleFutureAbility='';vehicleFlightSystem='';vehicleCreationName='';vehiclePhase5Named=false;vehiclePaintColor='#5de4ff';vehiclePreviousPaintColor='#5de4ff';vehicleBuildStates={};vehiclePowerVariants={};vehicleFutureVariants={};activeMode='body';currentLibraryId='vehicle-sport';templateOn=true;vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';}if(active==='room'){currentLibraryId='room-scandi';templateOn=true;activeMode='shell';}const all=loadStore();delete all[active];saveStore(all);$('creatorNotes').value='';document.querySelectorAll('#creatorPlanFields input').forEach(i=>i.value='');$('creatorSaved').textContent=t('Project cleared. Start a new design.','Projet effacé. Commence un nouveau design.');$('creatorTestResult').innerHTML='';renderLibrary(missions[active]);renderModes(missions[active],activeMode);updateBlueprintVisibility();if(active==='vehicle'){renderTemplate('vehicle');updateVehicleViewUI();updateVehicleProgressUI();}resetHistory();closeClearDialog();}
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
  if(vehiclePhase4RAF)cancelAnimationFrame(vehiclePhase4RAF);
  if(vehiclePhase5RAF)cancelAnimationFrame(vehiclePhase5RAF);
  if(vehicleRevealTimer)clearInterval(vehicleRevealTimer);
  if(vehiclePhase2Timer)clearInterval(vehiclePhase2Timer);
  if(vehiclePhase3Timer)clearInterval(vehiclePhase3Timer);
  if(vehiclePhase4Timer)clearInterval(vehiclePhase4Timer);
  if(vehiclePhase5Timer)clearInterval(vehiclePhase5Timer);
  if(vehiclePaintTimer)clearInterval(vehiclePaintTimer);
  vehicleRevealRAF=vehiclePhase2RAF=vehiclePhase3RAF=vehiclePhase4RAF=vehiclePhase5RAF=vehiclePaintRAF=0;
  vehicleRevealTimer=vehiclePhase2Timer=vehiclePhase3Timer=vehiclePhase4Timer=vehiclePhase5Timer=vehiclePaintTimer=0;
  vehicleRevealActive=false;vehicleRevealProgress=0;vehicleRevealStart=0;vehicleRevealStage='idle';
  vehiclePhase2Progress=0;vehiclePhase2Start=0;vehiclePhase3Progress=0;vehiclePhase3Start=0;vehiclePhase4Progress=0;vehiclePhase4Start=0;vehiclePhase5Progress=0;vehiclePhase5Start=0;vehicleTransformationReplay=false;vehiclePaintMix=1;
  [...objectLayer.children].filter(o=>o.dataset.kind==='part'&&o.dataset.installed==='1').forEach(o=>{o.style.filter='';});
  if(active==='vehicle'){syncInstalledVehicleParts();safeVehicleRender();updateBlueprintVisibility();}
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
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div style="width:100%"><b>${t('Choose your vehicle colour','Choisis la couleur de ton véhicule')}</b><p>${t('The reveal is complete. Try different paint colours before the test journey begins.','La présentation est terminée. Essaie différentes couleurs avant le début du trajet de test.')}</p><div id="vehiclePhase2Colours" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:12px 0">${swatches}</div><button type="button" id="vehicleConfirmPaint" style="padding:10px 16px;border:0;border-radius:999px;font-weight:800;cursor:pointer">${t('Use this colour','Utiliser cette couleur')}</button></div></div>`;
  $('creatorCoach').textContent=t('Choose any colour. The paint will sweep across the finished car. You can change it as many times as you want before confirming.','Choisis une couleur. La peinture balaiera la voiture finie. Tu peux la changer autant de fois que tu veux avant de confirmer.');
  document.querySelectorAll('[data-vehicle-paint]').forEach(b=>b.onclick=()=>{animateVehiclePaintChange(b.dataset.vehiclePaint);document.querySelectorAll('[data-vehicle-paint]').forEach(x=>x.style.borderColor=x===b?'#fff':'rgba(255,255,255,.35)')});
  const confirm=$('vehicleConfirmPaint');if(confirm)confirm.onclick=()=>{vehicleRevealStage='phase2-confirmed';safeVehicleRender();$('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Colour confirmed','Couleur confirmée')}</b><p>${t('Your finished vehicle is ready. Opening its test journey now.','Ton véhicule fini est prêt. Ouverture de son trajet de test.')}</p></div></div>`;$('creatorCoach').textContent=t('Your finished car and paint colour are locked. The Future Test World is opening now.','Ta voiture finie et sa couleur sont verrouillées. Le Monde de test futur s’ouvre maintenant.');showVehicleStageNotice(t('Colour confirmed','Couleur confirmée'),t('Opening the Future Test World…','Ouverture du Monde de test futur…'),{duration:2400});window.playTone?.(true);setTimeout(()=>{if(testRunning&&vehicleRevealActive)startVehiclePhaseThreeWorld()},700);};
  showVehicleStageNotice(t('Choose your colour','Choisis ta couleur'),t('Try colours, then confirm the one you want.','Essaie plusieurs couleurs, puis confirme celle que tu veux.'),{buttonLabel:t('Choose colour','Choisir la couleur'),onAction:()=>$('creatorTestResult').scrollIntoView?.({behavior:'smooth',block:'center'}),duration:0});
}
function startVehiclePhaseTwoReveal(){
  if(vehiclePhase2Timer)clearInterval(vehiclePhase2Timer);
  if(vehiclePhase2RAF)cancelAnimationFrame(vehiclePhase2RAF);
  vehiclePhase2RAF=0;vehiclePhase2Timer=0;
  vehicleRevealStage='phase2';vehiclePhase2Progress=0;vehiclePhase2Start=Date.now();
  vehiclePreviousPaintColor='#9fb0ba';vehiclePaintColor='#5de4ff';vehiclePaintMix=0;
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Finishing your car','Finition de ta voiture')}</b><p>${t('Paint, lights and the presentation camera are bringing your finished car to life.','La peinture, les feux et la caméra de présentation donnent vie à ta voiture finie.')}</p></div></div>`;
  $('creatorCoach').textContent=t('Watch the finished car receive its first paint and presentation pass.','Regarde la voiture finie recevoir sa première peinture et sa présentation.');
  const duration=vehicleIs('coach')?6200:5200;
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
  if(vehicleIs('tractor')){drawTractorAt(cx,cy,scale,opts);return;}
  if(vehicleIs('suv')){drawSUVAt(cx,cy,scale,opts);return;}
  if(vehicleIs('van')){drawVanAt(cx,cy,scale,opts);return;}
  if(vehicleIs('coach')){drawCoachAt(cx,cy,scale,opts);return;}
  const paint=opts.paint||vehiclePaintColor,glow=opts.glow||0,wheelSpin=opts.wheelSpin||0,angle=opts.angle||0,flight=!!opts.flight,water=!!opts.water,faceRight=!!opts.faceRight;
  const roadWheelSpin=-wheelSpin; // signed: positive=forward, negative=reverse
  /* Never let an old reveal alpha make the body disappear while wheels/lights remain. */
  tctx.globalAlpha=1;
  tctx.globalCompositeOperation='source-over';
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
  tctx.save();tctx.translate(cx,cy);tctx.rotate(angle);tctx.scale(faceRight?-scale:scale,scale);
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
  [[-130,47],[178,40]].forEach(([wx,wy],i)=>{const r=34;tctx.save();tctx.translate(wx,wy);if(!(water&&opts.retractWheels)){tctx.beginPath();tctx.arc(0,0,r,0,Math.PI*2);tctx.fillStyle='#10161b';tctx.fill();tctx.beginPath();tctx.arc(0,0,r*.61,0,Math.PI*2);const rg=tctx.createRadialGradient(-r*.12,-r*.18,2,0,0,r*.62);rg.addColorStop(0,'#f8fbfd');rg.addColorStop(.45,'#b7c3ca');rg.addColorStop(1,'#40515b');tctx.fillStyle=rg;tctx.fill();tctx.strokeStyle='rgba(245,250,252,.82)';tctx.lineWidth=1.5;for(let k=0;k<6;k++){const a=roadWheelSpin+(k*Math.PI/3);tctx.beginPath();tctx.moveTo(0,0);tctx.lineTo(Math.cos(a)*r*.49,Math.sin(a)*r*.49);tctx.stroke()}tctx.beginPath();tctx.arc(0,0,r*.13,0,Math.PI*2);tctx.fillStyle='#17232b';tctx.fill();}else{tctx.strokeStyle='rgba(225,244,252,.55)';tctx.lineWidth=3;tctx.strokeRect(-8,-8,16,16);}tctx.restore();});
  [[-234,16,'rgba(226,250,255,.98)'],[249,14,'rgba(255,67,86,.98)']].forEach(([x,y,c])=>{tctx.save();tctx.shadowBlur=16;tctx.shadowColor=c;tctx.fillStyle=c;tctx.beginPath();tctx.ellipse(x,y,16,7,0,0,Math.PI*2);tctx.fill();tctx.restore()});
  tctx.restore();
}

function drawVanPerson(x,y,scale=1,shirt='#ffd36e'){
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);tctx.fillStyle='#f2c7a8';tctx.beginPath();tctx.arc(0,-20,7,0,Math.PI*2);tctx.fill();tctx.strokeStyle='rgba(20,35,46,.85)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(0,-12);tctx.lineTo(0,10);tctx.moveTo(0,-2);tctx.lineTo(-9,4);tctx.moveTo(0,-2);tctx.lineTo(9,4);tctx.moveTo(0,10);tctx.lineTo(-7,22);tctx.moveTo(0,10);tctx.lineTo(7,22);tctx.stroke();tctx.strokeStyle=shirt;tctx.lineWidth=6;tctx.beginPath();tctx.moveTo(0,-10);tctx.lineTo(0,7);tctx.stroke();tctx.restore();
}
function drawVanCargoBox(x,y,scale=1,label=''){
  tctx.save();tctx.translate(x,y);tctx.scale(scale,scale);tctx.fillStyle='#c79255';tctx.fillRect(-13,-12,26,24);tctx.strokeStyle='#7a542d';tctx.lineWidth=2;tctx.strokeRect(-13,-12,26,24);tctx.beginPath();tctx.moveTo(0,-12);tctx.lineTo(0,12);tctx.moveTo(-13,-2);tctx.lineTo(13,-2);tctx.stroke();if(label){tctx.fillStyle='#fff5df';tctx.font='700 7px system-ui';tctx.textAlign='center';tctx.fillText(label,0,8)}tctx.restore();
}
function drawVanUtilityTestWorld(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase3Progress,0,1),roadY=348;
  tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.globalCompositeOperation='source-over';tctx.clearRect(0,0,W,H);
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#163850');sky.addColorStop(.58,'#78b3cf');sky.addColorStop(1,'#d9d9bd');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  tctx.fillStyle='#6e9d78';tctx.fillRect(0,250,W,95);tctx.fillStyle='#435968';tctx.fillRect(0,332,W,118);tctx.strokeStyle='rgba(248,252,255,.72)';tctx.lineWidth=3;tctx.setLineDash([18,14]);tctx.beginPath();tctx.moveTo(0,398);tctx.lineTo(W,398);tctx.stroke();tctx.setLineDash([]);
  /* Four useful real-world van stops. */
  drawRoundedPanel(68,232,130,48,14,'rgba(8,25,36,.72)','rgba(147,232,255,.22)');tctx.fillStyle='#edf9ff';tctx.textAlign='center';tctx.font='800 12px system-ui';tctx.fillText(t('Passenger pickup','Prise en charge'),133,252);tctx.font='700 10px system-ui';tctx.fillStyle='rgba(190,228,247,.94)';tctx.fillText(t('Community stop','Arrêt communautaire'),133,269);
  drawFutureBuilding(292,300,78,88,'#476585',4);drawFutureWorldLabel(331,216,t('School / community','École / communauté'));
  drawFutureBuilding(455,302,112,96,'#735e4c',2);drawFutureWorldLabel(511,214,t('Loading depot','Dépôt de chargement'));
  drawFutureBuilding(646,304,112,84,'#4f7188',3);drawFutureWorldLabel(702,220,t('Delivery point','Point de livraison'));
  let x=95,y=roadY-30,sideOpen=0,rearOpen=0,status=t('Driving to passenger pickup','En route vers la prise en charge');
  if(p<.16){const q=p/.16;x=95+75*q;status=t('Driving to passenger pickup','En route vers la prise en charge');}
  else if(p<.30){const q=(p-.16)/.14;x=170;sideOpen=Math.sin(q*Math.PI);status=t('Passenger pickup','Embarquement des passagers');
    const cols=['#ffd36e','#68d8ff','#ff8fb2','#8de28d'];for(let i=0;i<4;i++){const delay=i*.12,move=clamp((q-delay)/.55,0,1);if(move<.98)drawVanPerson(112+i*18+(x+12-(112+i*18))*move,323-8*i*(1-move),.78,cols[i]);}
  }else if(p<.44){const q=(p-.30)/.14;x=170+170*q;status=t('Passengers on board','Passagers à bord');}
  else if(p<.56){const q=(p-.44)/.12;x=340;sideOpen=Math.sin(q*Math.PI);status=t('Passenger drop-off','Dépose des passagers');
    const cols=['#ffd36e','#68d8ff','#ff8fb2','#8de28d'];for(let i=0;i<4;i++){const delay=i*.10,move=clamp((q-delay)/.60,0,1);if(move>.04)drawVanPerson(x+12+(365+i*18-(x+12))*move,322-6*i*move,.78,cols[i]);}
  }else if(p<.68){const q=(p-.56)/.12;x=340+170*q;status=t('Driving to loading depot','En route vers le dépôt');}
  else if(p<.80){const q=(p-.68)/.12;x=510;rearOpen=Math.sin(q*Math.PI);status=t('Loading cargo through rear doors','Chargement par les portes arrière');
    for(let i=0;i<3;i++){const delay=i*.12,move=clamp((q-delay)/.56,0,1);if(move<.97)drawVanCargoBox(555+i*24+(x-122-(555+i*24))*move,340-4*i,.86,String(i+1));}
  }else if(p<.92){const q=(p-.80)/.12;x=510+170*q;status=t('Cargo delivery run','Trajet de livraison');}
  else{const q=(p-.92)/.08;x=680;rearOpen=Math.sin(q*Math.PI);status=t('Unloading delivery','Déchargement de la livraison');
    for(let i=0;i<3;i++){const delay=i*.10,move=clamp((q-delay)/.58,0,1);if(move>.03)drawVanCargoBox(x-122+(720+i*20-(x-122))*move,340-4*i,.86,String(i+1));}
  }
  drawVanAt(x,y,.50,{paint:vehiclePaintColor,glow:.48,wheelSpin:p*26,faceRight:true,sideDoorOpen:sideOpen,rearDoorsOpen:rearOpen});
  drawRoundedPanel(18,16,276,88,16,'rgba(8,25,36,.75)','rgba(147,232,255,.24)');tctx.fillStyle='#f0f9ff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(t('Van Passenger & Cargo Test','Test passagers et chargement du van'),32,40);tctx.fillStyle='rgba(185,225,246,.94)';tctx.font='700 12px system-ui';tctx.fillText(status,32,62);tctx.fillText(`${t('Power','Énergie')}: ${vehiclePowertrainLabel()}`,32,82);
  drawPhase4Badge(620,118,t('Passengers','Passagers'),p>.30);drawPhase4Badge(620,154,t('Safe drop-off','Dépose sûre'),p>.56);drawPhase4Badge(620,190,t('Cargo loaded','Chargement'),p>.80);drawPhase4Badge(620,226,t('Delivery','Livraison'),p>.98);
  tctx.restore();
}
function drawVanFutureTechFinale(){
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase4Progress,0,1);tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  if(vehicleFutureAbility==='water'){
    const sky=tctx.createLinearGradient(0,0,0,230);sky.addColorStop(0,'#183b58');sky.addColorStop(1,'#88c7dc');tctx.fillStyle=sky;tctx.fillRect(0,0,W,240);tctx.fillStyle='#6d9b76';tctx.fillRect(0,220,W,75);const sea=tctx.createLinearGradient(0,270,0,H);sea.addColorStop(0,'#3aa2c7');sea.addColorStop(1,'#155b88');tctx.fillStyle=sea;tctx.fillRect(0,260,W,H-260);
    tctx.fillStyle='#9e8a68';tctx.beginPath();tctx.moveTo(0,450);tctx.lineTo(205,330);tctx.lineTo(275,330);tctx.lineTo(335,450);tctx.closePath();tctx.fill();tctx.beginPath();tctx.moveTo(635,450);tctx.lineTo(700,330);tctx.lineTo(800,330);tctx.lineTo(800,450);tctx.closePath();tctx.fill();
    drawFutureBuilding(688,300,88,76,'#566f82',3);drawFutureWorldLabel(730,214,t('Harbour delivery','Livraison au port'));
    const a=clamp(p/.22,0,1),b=clamp((p-.22)/.50,0,1),c=clamp((p-.72)/.28,0,1);let x,y,ang=0,retract=false;
    if(p<.22){x=105+180*a;y=330+55*a;ang=.14*a;retract=a>.62;}else if(p<.72){x=285+340*b;y=386-16*Math.sin(b*Math.PI*2);retract=true;}else{x=625+120*c;y=386-58*c;ang=-.16*c;retract=c<.58;}
    drawVanAt(x,y,.46,{paint:vehiclePaintColor,glow:.58,wheelSpin:p*20,angle:ang,faceRight:true,water:p>.14&&p<.88,retractWheels:retract});
    if(p>.22&&p<.80){tctx.strokeStyle='rgba(235,251,255,.68)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(x-92,y+28);tctx.quadraticCurveTo(x-150,y+40,x-208,y+25);tctx.stroke();}
  }else{
    const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0c3154');sky.addColorStop(.58,'#5595ba');sky.addColorStop(1,'#cad8ca');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);tctx.fillStyle='#344f63';tctx.beginPath();tctx.moveTo(0,310);tctx.lineTo(140,185);tctx.lineTo(280,304);tctx.lineTo(440,165);tctx.lineTo(605,304);tctx.lineTo(800,198);tctx.lineTo(800,365);tctx.lineTo(0,365);tctx.closePath();tctx.fill();tctx.fillStyle='#4f6350';tctx.fillRect(0,330,W,120);
    const a=clamp(p/.20,0,1),b=clamp((p-.20)/.58,0,1),c=clamp((p-.78)/.22,0,1);let x=120,y=315,ang=0,retract=false;
    if(vehicleFlightSystem==='drone'){if(p<.20){x=205;y=315-135*a;retract=a>.25;}else if(p<.78){x=205+400*b;y=180-42*Math.sin(b*Math.PI);ang=.04*Math.sin(b*Math.PI*2);retract=true;}else{x=605+110*c;y=180+135*c;ang=.09*c;retract=c<.68;}}
    else{if(p<.20){x=118+170*a;y=315-10*a;ang=-.04*a;retract=a>.70;}else if(p<.78){x=288+330*b;y=300-150*Math.sin(Math.min(1,b*1.2)*Math.PI*.72);ang=-.16+.30*b;retract=true;}else{x=618+105*c;y=190+125*c;ang=.12*(1-c);retract=c<.62;}}
    drawVanAt(x,y,.46,{paint:vehiclePaintColor,glow:.65,wheelSpin:p*24,angle:ang,faceRight:true,flight:true,retractWheels:retract});
    drawFutureBuilding(655,312,102,84,'#4f7188',4);drawFutureWorldLabel(706,225,t('Urgent delivery','Livraison urgente'));
  }
  drawRoundedPanel(18,16,286,88,16,'rgba(8,25,36,.75)','rgba(147,232,255,.24)');tctx.fillStyle='#f0f9ff';tctx.font='900 15px system-ui';tctx.textAlign='left';tctx.fillText(t('Van Future Delivery Finale','Finale livraison future du van'),32,40);tctx.fillStyle='rgba(185,225,246,.94)';tctx.font='700 12px system-ui';tctx.fillText(vehicleFutureAbility==='water'?t('Amphibious harbour delivery','Livraison amphibie au port'):vehicleFlightSystemLabel(),32,62);tctx.fillText(t('People • cargo • safety • future technology','Passagers • chargement • sécurité • technologie future'),32,82);
  drawPhase4Badge(622,112,t('Movement','Mouvement'),p>.12);drawPhase4Badge(622,148,t('Power','Énergie'),p>.30);drawPhase4Badge(622,184,t('Safety','Sécurité'),p>.50);drawPhase4Badge(622,220,t('Final delivery','Livraison finale'),p>.78);tctx.restore();
}
function drawVanCelebration(){
  const W=templateCanvas.width,H=templateCanvas.height,p=vehicleRevealStage==='phase5'?clamp(vehiclePhase5Progress,0,1):1;tctx.save();tctx.setTransform(1,0,0,1,0,0);tctx.globalAlpha=1;tctx.clearRect(0,0,W,H);
  const bg=tctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#12334e');bg.addColorStop(.55,'#37647b');bg.addColorStop(1,'#263f3c');tctx.fillStyle=bg;tctx.fillRect(0,0,W,H);tctx.fillStyle='#6b8e6e';tctx.fillRect(0,330,W,120);drawFutureBuilding(72,318,118,92,'#4c6a83',4);drawFutureBuilding(612,318,118,92,'#735e4c',3);
  tctx.fillStyle='rgba(93,228,255,.13)';tctx.beginPath();tctx.ellipse(400,344,245,51,0,0,Math.PI*2);tctx.fill();tctx.strokeStyle='rgba(137,234,255,.42)';tctx.lineWidth=2;tctx.beginPath();tctx.ellipse(400,344,220,41,0,0,Math.PI*2);tctx.stroke();
  const arrive=clamp(p/.42,0,1),settle=1-Math.pow(1-arrive,3);drawVanAt(400+(1-settle)*210,294-(1-settle)*18,.55+.035*Math.sin(clamp((p-.18)/.42,0,1)*Math.PI),{paint:vehiclePaintColor,glow:.82,wheelSpin:p<.42?-p*8:0,faceRight:true});if(vehicleRevealStage==='phase5')drawPhase5Confetti(p);
  const a=clamp((p-.28)/.28,0,1);tctx.globalAlpha=a;tctx.textAlign='center';tctx.shadowColor='rgba(82,228,255,.6)';tctx.shadowBlur=15;tctx.fillStyle='#f5fbff';tctx.font='900 26px system-ui';tctx.fillText(t('MISSION COMPLETE','MISSION TERMINÉE'),400,62);tctx.shadowBlur=0;tctx.fillStyle='rgba(178,234,255,.96)';tctx.font='800 13px system-ui';tctx.fillText(t('Transport & Delivery Engineer','Ingénieur transport et livraison'),400,86);tctx.globalAlpha=1;
  if(vehicleRevealStage!=='phase5-view'){const aa=clamp((p-.58)/.3,0,1);tctx.globalAlpha=aa;tctx.font='800 11px system-ui';tctx.fillStyle='#e5f6ff';const items=[t('Passengers ✓','Passagers ✓'),t('Cargo ✓','Chargement ✓'),t('Safety ✓','Sécurité ✓'),`${vehicleFinalTechLabel()} ✓`,t('Delivery Test ✓','Test livraison ✓')],xs=[120,265,400,535,680];items.forEach((lab,i)=>{drawRoundedPanel(xs[i]-60,397,120,28,13,'rgba(7,24,36,.62)','rgba(147,232,255,.18)');tctx.fillText(lab,xs[i],415)});tctx.globalAlpha=1;}
  if(vehicleRevealStage==='phase5-view'){drawRoundedPanel(250,365,300,46,18,'rgba(7,24,36,.74)','rgba(147,232,255,.22)');tctx.fillStyle='#e7f7ff';tctx.font='800 14px system-ui';tctx.fillText(vehicleCreationName||t('My Transport Van','Mon van de transport'),400,393);}tctx.restore();
}
function drawVehicleFutureTestWorld(){
  if(vehicleIs('tractor')){drawTractorFarmWorld();return;}
  if(vehicleIs('suv')){drawSUVAdventureTestWorld();return;}
  if(vehicleIs('van')){drawVanUtilityTestWorld();return;}
  if(vehicleIs('coach')){drawCoachIntercityWorld();return;}
  const W=templateCanvas.width,H=templateCanvas.height,p=clamp(vehiclePhase3Progress,0,1),baseRoadY=338,route=1360,cam=p*route;
  /* Phase 3 is a new presentation scene, not another blueprint pass. Reset any
     opacity/transform/compositing state left by the transformation/reveal canvas. */
  tctx.setTransform(1,0,0,1,0,0);
  tctx.globalAlpha=1;
  tctx.globalCompositeOperation='source-over';
  tctx.shadowBlur=0;
  tctx.shadowColor='transparent';
  tctx.filter='none';
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
    /* A readable shore: road -> launch ramp -> water -> open-water zone. */
    const shoreX=Math.max(0,waterStart-34),seaX=Math.max(0,waterStart+22);
    const sea=tctx.createLinearGradient(0,baseRoadY,0,H);sea.addColorStop(0,'#43a9d0');sea.addColorStop(1,'#17638f');tctx.fillStyle=sea;tctx.fillRect(seaX,baseRoadY+2,Math.max(0,W-seaX),H-baseRoadY-2);
    tctx.fillStyle='#dbc99e';tctx.beginPath();tctx.moveTo(shoreX,baseRoadY+4);tctx.lineTo(seaX+52,baseRoadY+58);tctx.lineTo(seaX+86,H);tctx.lineTo(shoreX,H);tctx.closePath();tctx.fill();
    tctx.fillStyle='#778891';tctx.beginPath();tctx.moveTo(shoreX-18,baseRoadY-5);tctx.lineTo(seaX+28,baseRoadY+45);tctx.lineTo(seaX+58,baseRoadY+45);tctx.lineTo(seaX+2,baseRoadY-5);tctx.closePath();tctx.fill();
    tctx.strokeStyle='rgba(215,249,255,.55)';tctx.lineWidth=2;for(let i=0;i<5;i++){const yy=baseRoadY+28+i*22;tctx.beginPath();tctx.moveTo(seaX+48,yy);tctx.quadraticCurveTo(seaX+112,yy+8,W,yy);tctx.stroke();}
    /* buoys / marina detail kept away from the driving path */
    [[seaX+118,baseRoadY+68],[seaX+170,baseRoadY+112]].forEach(([bx,by])=>{tctx.fillStyle='#ff8d55';tctx.beginPath();tctx.arc(bx,by,6,0,Math.PI*2);tctx.fill();tctx.strokeStyle='rgba(255,255,255,.7)';tctx.beginPath();tctx.moveTo(bx,by+6);tctx.lineTo(bx,by+18);tctx.stroke();});
  }
  drawFutureWorldLabel(worldX(486),210,t('Supermarket','Supermarché'));
  drawFutureWorldLabel(worldX(722),206,vehiclePowertrain==='electric'?t('EV Charge','Recharge EV'):t('Fuel stop','Station'));
  if(vehiclePowertrain==='hybrid')drawFutureWorldLabel(worldX(816),214,t('Hybrid option','Option hybride'));
  if(vehicleFutureAbility==='water')drawFutureWorldLabel(worldX(1246),200,t('Water zone','Zone aquatique'));
  else if(vehicleFutureAbility==='flight')drawFutureWorldLabel(worldX(1186),204,t('Flight lane','Couloir aérien'));
  const seg2=clamp((p-.22)/.22,0,1),seg3=clamp((p-.72)/.28,0,1);
  let carX=220,carY=baseRoadY-28,carAngle=0,flightMode=false,waterMode=false,retractWheels=false;
  if(vehicleFutureAbility==='flight'&&p>.72){flightMode=true;carX=220+seg3*170;carY=baseRoadY-28-(Math.sin(seg3*Math.PI*.82)*110+seg3*34);carAngle=-.08-.26*seg3;}
  if(vehicleFutureAbility==='water'&&p>.72){
    const enter=clamp(seg3/.48,0,1),cruise=clamp((seg3-.48)/.52,0,1);waterMode=seg3>.18;retractWheels=seg3>.38;
    carX=220+enter*112+cruise*66;carY=baseRoadY-28+enter*44+Math.sin(cruise*Math.PI*2)*2;carAngle=enter*.08*(1-cruise);
    if(seg3>.18&&seg3<.58){tctx.save();tctx.globalAlpha=.65*Math.sin(clamp((seg3-.18)/.4,0,1)*Math.PI);tctx.fillStyle='rgba(229,250,255,.82)';for(let i=0;i<6;i++){tctx.beginPath();tctx.arc(carX-38+i*14,carY+35+(i%2)*5,4+i%3,0,Math.PI*2);tctx.fill()}tctx.restore();}
  }
  drawPhase3VehicleAt(carX,carY,.58,{paint:vehiclePaintColor,glow:.72,wheelSpin:p*8,angle:carAngle,flight:flightMode,water:waterMode,retractWheels,faceRight:true});
  if(flightMode){cloud(468,94,.92);cloud(610,138,.74);}
  drawRoundedPanel(18,16,204,78,16,'rgba(8,25,36,.68)','rgba(147,232,255,.22)');
  tctx.fillStyle='rgba(235,247,255,.96)';tctx.textAlign='left';tctx.font='800 15px system-ui';tctx.fillText(t('Future Test World','Monde de test du futur'),32,40);
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
  /* The Test World must remain visible even if the child had switched the construction blueprint off. */
  stage.classList.remove('blueprints-off');
  vehicleRevealStage='phase3';vehiclePhase3Progress=0;vehiclePhase3Start=Date.now();
  const isVan=vehicleIs('van'),isCoach=vehicleIs('coach'),isTractor=vehicleIs('tractor');
  $('creatorTestResult').innerHTML=isTractor
    ?`<div class="creator-report"><div><b>${t('Multi-Purpose Farm Mission','Mission agricole multifonction')}</b><p>${t('The tractor will mow, prepare soil, plant seed, irrigate crops and move material before entering autonomous precision mode.','Le tracteur va faucher, préparer le sol, semer, irriguer les cultures et déplacer des matériaux avant de passer en mode de précision autonome.')}</p></div></div>`
    :isCoach
    ?`<div class="creator-report"><div><b>${t('Intercity Journey Test','Test du trajet interurbain')}</b><p>${t('Passengers will board at the departure terminal, luggage will be secured in the lower bays, the coach will complete a scheduled stopover and continue toward its final city.','Les passagers embarqueront au terminal de départ, les bagages seront rangés dans les soutes, l’autocar effectuera un arrêt intermédiaire puis continuera vers sa ville finale.')}</p></div></div>`
    :isVan
      ?`<div class="creator-report"><div><b>${t('Van Passenger & Cargo Test','Test passagers et chargement du van')}</b><p>${t('The finished van will pick up passengers, drop them off safely, load goods through the rear cargo doors and complete a delivery.','Le van fini va prendre des passagers, les déposer en sécurité, charger des marchandises par les portes arrière et effectuer une livraison.')}</p></div></div>`
      :`<div class="creator-report"><div><b>${t('Future Test World','Monde de test du futur')}</b><p>${t('Your finished car is entering a living world with roads, useful places and a special zone for its future ability.','Ta voiture finie entre dans un monde vivant avec routes, lieux utiles et une zone spéciale pour sa capacité future.')}</p></div></div>`;
  showVehicleStageNotice(isTractor?t('Precision farm mission','Mission agricole de précision'):isCoach?t('Intercity journey','Trajet interurbain'):isVan?t('Passenger & cargo test','Test passagers et chargement'):t('Entering Test World','Entrée dans le Monde de test'),isTractor?t('Five real farm jobs, visible driver and connected smart systems.','Cinq vrais travaux agricoles, conducteur visible et systèmes intelligents connectés.'):isCoach?t('Boarding, luggage, highway travel and a scheduled stopover.','Embarquement, bagages, trajet routier et arrêt intermédiaire.'):isVan?t('Passengers first, then cargo loading and delivery.','D’abord les passagers, puis le chargement et la livraison.'):t('Road test first, then your special vehicle ability.','D’abord le test routier, puis la capacité spéciale du véhicule.'),{duration:3500});
  $('creatorCoach').textContent=isTractor?t('Watch the driver and farm team work through mowing, soil preparation, planting, irrigation and levelling. Each implement has a real job.','Observe le conducteur et l’équipe agricole réaliser la fauche, la préparation du sol, le semis, l’irrigation et le nivellement. Chaque outil a un vrai rôle.'):isCoach?t('Follow the route display, boarding process, luggage loading, stopover and final-city journey.','Suis l’affichage d’itinéraire, l’embarquement, les bagages, l’arrêt intermédiaire et le trajet vers la ville finale.'):isVan?t('Watch how the van transports people, uses its rear cargo doors and completes a delivery route.','Observe comment le van transporte des personnes, utilise ses portes arrière et effectue une livraison.'):t('Watch the finished car drive through the town, pass the service area and use its future ability in the last zone.','Regarde la voiture finie traverser la ville, passer par la zone de service et utiliser sa capacité future dans la dernière zone.');
  const duration=isTractor?34000:isCoach?18000:isVan?15600:12800;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePhase3Timer)clearInterval(vehiclePhase3Timer);vehiclePhase3Timer=0;return}
    vehiclePhase3Progress=clamp((Date.now()-vehiclePhase3Start)/duration,0,1);
    safeVehicleRender();
    if(vehiclePhase3Progress>=1){
      clearInterval(vehiclePhase3Timer);vehiclePhase3Timer=0;vehicleRevealStage='phase3-complete';vehiclePhase3Progress=1;safeVehicleRender();
      const phase3Special=vehicleIs('tractor')
        ?t('Five farm jobs are complete. The tractor now enters Autonomous Precision Mode with GPS guidance, crop scanning, soil sensing and farm-drone coordination.','Cinq travaux agricoles sont terminés. Le tracteur passe maintenant en Mode de précision autonome avec guidage GPS, scan des cultures, capteurs du sol et coordination du drone agricole.')
        :vehicleIs('coach')
        ?t('The scheduled stopover is complete. The coach now continues toward the final city and its selected Future Tech route challenge.','L’arrêt intermédiaire est terminé. L’autocar poursuit maintenant vers la ville finale et son défi d’itinéraire avec la technologie future choisie.')
        :vehicleIs('van')
          ?t('Passenger transport and cargo delivery are complete. The same van now continues into its selected Future Tech delivery finale.','Le transport des passagers et la livraison de marchandises sont terminés. Le même van poursuit maintenant vers sa finale de livraison avec la technologie future choisie.')
          :vehicleFutureAbility==='flight'
          ?t('The car is already airborne. The full systems journey continues from this exact flight state — it does not restart take-off.','La voiture est déjà en vol. Le test complet continue exactement depuis cet état — sans redémarrer le décollage.')
          :t('The car is now genuinely in open water. The full systems journey continues from this exact amphibious state.','La voiture est maintenant réellement en eau libre. Le test complet continue depuis cet état amphibie.');
      $('creatorTestResult').innerHTML=vehicleIs('tractor')
        ?`<div class="creator-report"><div><b>${t('Five farm jobs complete','Cinq travaux agricoles terminés')}</b><p>${phase3Special}</p><p>${t('Continuing automatically into precision agriculture…','Passage automatique à l’agriculture de précision…')}</p></div></div>`
        :vehicleIs('coach')
        ?`<div class="creator-report"><div><b>${t('Scheduled stopover complete','Arrêt intermédiaire terminé')}</b><p>${phase3Special}</p><p>${t('Continuing automatically toward the final city…','Poursuite automatique vers la ville finale…')}</p></div></div>`
        :`<div class="creator-report"><div><b>${t('Future Test World complete','Monde de test terminé')}</b><p>${phase3Special}</p><p>${t('Continuing automatically to the full systems journey…','Passage automatique au parcours complet des systèmes…')}</p></div></div>`;
      $('creatorCoach').textContent=vehicleIs('tractor')?t('Keep watching — the field mission is moving into autonomous precision agriculture.','Continue de regarder — la mission passe à l’agriculture de précision autonome.'):vehicleIs('coach')?t('Keep watching — the coach is continuing from the stopover toward its route challenge and final terminal.','Continue de regarder — l’autocar poursuit depuis l’arrêt intermédiaire vers son défi d’itinéraire et le terminal final.'):t('Keep watching — the full systems test continues from the vehicle’s current position.','Continue de regarder — le test complet reprend depuis la position actuelle du véhicule.');
      showVehicleStageNotice(vehicleIs('coach')?t('Stopover complete','Arrêt terminé'):t('Special zone reached','Zone spéciale atteinte'),vehicleIs('coach')?t('Final-city journey continuing…','Trajet vers la ville finale…'):t('Full systems test continuing…','Suite du test complet des systèmes…'),{duration:2500});
      window.playTone?.(true);
      setTimeout(()=>{if(testRunning&&vehicleRevealActive&&vehicleRevealStage==='phase3-complete')startVehiclePhaseFourJourney()},900);
    }
  };
  tick();vehiclePhase3Timer=setInterval(tick,33);
}

function drawPhase4Badge(x,y,label,passed){
  tctx.save();
  drawRoundedPanel(x,y,150,30,14,passed?'rgba(31,108,83,.80)':'rgba(12,35,50,.72)',passed?'rgba(100,245,190,.65)':'rgba(147,232,255,.18)');
  tctx.font='800 12px system-ui';tctx.textAlign='left';tctx.textBaseline='middle';tctx.fillStyle=passed?'#d8fff0':'rgba(213,235,247,.86)';
  tctx.fillText((passed?'✓ ':'○ ')+label,x+12,y+15);
  tctx.restore();
}
function drawPhase4FlightWorld(p){
  const W=templateCanvas.width,H=templateCanvas.height;
  tctx.save();
  const sky=tctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#0c3154');sky.addColorStop(.48,'#256da1');sky.addColorStop(1,'#8fc9e6');tctx.fillStyle=sky;tctx.fillRect(0,0,W,H);
  const cloud=(x,y,s,a=.88)=>{tctx.save();tctx.globalAlpha=a;tctx.translate(x,y);tctx.scale(s,s);tctx.fillStyle='#f5fbff';[[0,0,25],[-21,7,16],[22,9,18],[4,-13,17]].forEach(([cx,cy,r])=>{tctx.beginPath();tctx.arc(cx,cy,r,0,Math.PI*2);tctx.fill()});tctx.fillRect(-27,0,55,17);tctx.restore();};
  cloud(122+(p*58)%100,84,1.05,.82);cloud(470-(p*80)%160,118,.80,.78);cloud(692-(p*44)%110,60,.72,.72);
  /* distant town and runway keep continuity with Phase 3 */
  tctx.fillStyle='#2b5b75';tctx.beginPath();tctx.moveTo(0,300);tctx.quadraticCurveTo(150,246,304,286);tctx.quadraticCurveTo(470,250,800,294);tctx.lineTo(800,338);tctx.lineTo(0,338);tctx.closePath();tctx.fill();
  tctx.fillStyle='#2e4a5f';tctx.fillRect(0,357,W,93);
  tctx.fillStyle='#405c6d';tctx.beginPath();tctx.moveTo(72,450);tctx.lineTo(248,338);tctx.lineTo(570,338);tctx.lineTo(792,450);tctx.closePath();tctx.fill();
  tctx.strokeStyle='rgba(246,251,255,.72)';tctx.lineWidth=4;tctx.setLineDash([22,18]);tctx.beginPath();tctx.moveTo(205,430);tctx.lineTo(395,354);tctx.lineTo(595,430);tctx.stroke();tctx.setLineDash([]);
  const a=clamp(p/.18,0,1),b=clamp((p-.18)/.32,0,1),c=clamp((p-.50)/.28,0,1),d=clamp((p-.78)/.22,0,1);
  let x=390,y=172,ang=-.22,sc=.58;
  if(p<.18){x=390+70*a;y=172-38*a;ang=-.22-.07*a;}
  else if(p<.50){x=460-215*b;y=134+Math.sin(b*Math.PI)*-42;ang=-.29+Math.sin(b*Math.PI*2)*.18;sc=.58+.04*Math.sin(b*Math.PI);}
  else if(p<.78){x=245+300*c;y=118+52*c;ang=.12+.16*c;}
  else{x=545-155*d;y=170+166*d;ang=.28*(1-d);sc=.58-.03*d;}
  const faceRight=p<.18?true:p<.50?false:p<.78?true:false;
  drawPhase3VehicleAt(x,y,sc,{paint:vehiclePaintColor,glow:.62,wheelSpin:p*18,angle:ang,flight:p<.88,water:false,faceRight});
  if(vehicleFlightSystem==='jet'&&p<.84){const dir=faceRight?-1:1;tctx.save();tctx.globalAlpha=.65;const fg=tctx.createLinearGradient(x+dir*85,y,x+dir*160,y);fg.addColorStop(0,'rgba(255,228,120,.95)');fg.addColorStop(.45,'rgba(255,95,54,.70)');fg.addColorStop(1,'rgba(255,95,54,0)');tctx.fillStyle=fg;tctx.beginPath();tctx.moveTo(x+dir*70,y-8);tctx.lineTo(x+dir*162,y);tctx.lineTo(x+dir*70,y+8);tctx.closePath();tctx.fill();tctx.restore();}
  if(d>0){tctx.save();tctx.globalAlpha=d*.75;tctx.strokeStyle='rgba(230,246,255,.82)';tctx.lineWidth=2;tctx.beginPath();tctx.moveTo(390,337);tctx.lineTo(390,410);tctx.stroke();tctx.restore();}
  tctx.restore();
}
function drawPhase4WaterWorld(p){
  const W=templateCanvas.width,H=templateCanvas.height;
  tctx.save();
  const sky=tctx.createLinearGradient(0,0,0,240);sky.addColorStop(0,'#163b5a');sky.addColorStop(1,'#72b9da');tctx.fillStyle=sky;tctx.fillRect(0,0,W,240);
  tctx.fillStyle='#6da989';tctx.beginPath();tctx.moveTo(0,235);tctx.quadraticCurveTo(170,200,324,230);tctx.quadraticCurveTo(540,190,800,230);tctx.lineTo(800,290);tctx.lineTo(0,290);tctx.closePath();tctx.fill();
  const sea=tctx.createLinearGradient(0,250,0,H);sea.addColorStop(0,'#2e91c4');sea.addColorStop(1,'#155b88');tctx.fillStyle=sea;tctx.fillRect(0,240,W,H-240);
  tctx.strokeStyle='rgba(218,248,255,.46)';tctx.lineWidth=2;for(let i=0;i<7;i++){const yy=270+i*26;tctx.beginPath();tctx.moveTo((i*75+p*180)%130-80,yy);tctx.quadraticCurveTo(320,yy+10,800,yy);tctx.stroke();}
  /* shoreline appears to the far right as the vehicle returns, never in front of it at the start. */
  const shoreA=clamp((p-.70)/.30,0,1);tctx.save();tctx.globalAlpha=shoreA;
  tctx.fillStyle='#d2c39c';tctx.beginPath();tctx.moveTo(650,450);tctx.lineTo(800,350);tctx.lineTo(800,450);tctx.closePath();tctx.fill();
  tctx.fillStyle='#63747d';tctx.beginPath();tctx.moveTo(670,450);tctx.lineTo(800,373);tctx.lineTo(800,414);tctx.lineTo(720,450);tctx.closePath();tctx.fill();tctx.restore();
  const a=clamp(p/.26,0,1),b=clamp((p-.26)/.30,0,1),c=clamp((p-.56)/.26,0,1),d=clamp((p-.82)/.18,0,1);
  let x=330,y=328,ang=0,sc=.56,retract=true;
  if(p<.26){x=330+230*a;y=328+Math.sin(a*Math.PI*2)*4;}
  else if(p<.56){x=560-270*b;y=328-50*Math.sin(b*Math.PI);ang=-.06+.18*Math.sin(b*Math.PI*2);}
  else if(p<.82){x=290+300*c;y=327+Math.sin(c*Math.PI*2)*3;ang=.02;}
  else{x=590+150*d;y=327+46*d;ang=.16*d;retract=d<.62;}
  const faceRight=p<.26?true:p<.56?false:true;
  drawPhase3VehicleAt(x,y,sc,{paint:vehiclePaintColor,glow:.55,wheelSpin:p*16,angle:ang,flight:false,water:true,retractWheels:retract,faceRight});
  /* wake always trails behind the direction of travel. */
  if(p<.86){const dir=faceRight?-1:1;tctx.save();tctx.strokeStyle='rgba(235,251,255,.62)';tctx.lineWidth=3;tctx.beginPath();tctx.moveTo(x+dir*115,y+28);tctx.quadraticCurveTo(x+dir*170,y+40,x+dir*230,y+24);tctx.stroke();tctx.restore();}
  tctx.restore();
}
function drawVehiclePhaseFourJourney(){
  if(vehicleIs('tractor')){drawTractorPrecisionFinale();return;}
  if(vehicleIs('suv')){drawSUVPhaseFourJourney();return;}
  if(vehicleIs('van')){drawVanFutureTechFinale();return;}
  if(vehicleIs('coach')){drawCoachPhaseFourJourney();return;}
  /* Phase 4 owns the full canvas state so it cannot inherit opacity/composite settings. */
  tctx.save();tctx.globalAlpha=1;tctx.globalCompositeOperation='source-over';tctx.setTransform(1,0,0,1,0,0);tctx.filter='none';tctx.shadowBlur=0;tctx.setLineDash([]);
  tctx.clearRect(0,0,templateCanvas.width,templateCanvas.height);
  const p=clamp(vehiclePhase4Progress,0,1);
  if(vehicleFutureAbility==='water')drawPhase4WaterWorld(p);else drawPhase4FlightWorld(p);
  drawRoundedPanel(18,16,242,92,16,'rgba(8,25,36,.74)','rgba(147,232,255,.24)');
  tctx.fillStyle='rgba(235,247,255,.97)';tctx.textAlign='left';tctx.font='800 15px system-ui';tctx.fillText(t('Full Systems Test','Test complet des systèmes'),32,40);
  tctx.font='600 12px system-ui';tctx.fillStyle='rgba(185,225,246,.94)';
  tctx.fillText(vehicleFutureAbility==='flight'?t('Continuing the flight from the Test World','Suite du vol depuis le Monde de test'):t('Continuing the amphibious journey','Suite du trajet amphibie'),32,61);
  tctx.fillText(`${vehiclePowertrainLabel()} · ${vehicleFutureAbility==='flight'?vehicleFlightSystemLabel():vehicleFutureAbilityLabel()}`,32,80);
  const pass1=p>.12,pass2=p>.30,pass3=p>.50,pass4=p>.72;
  drawPhase4Badge(622,110,t('Movement','Mouvement'),pass1);
  drawPhase4Badge(622,146,t('Power','Énergie'),pass2);
  drawPhase4Badge(622,182,t('Safety','Sécurité'),pass3);
  drawPhase4Badge(622,218,vehicleFutureAbility==='flight'?t('Flight system','Système de vol'):t('Water system','Système aquatique'),pass4);
  tctx.restore();
}
function startVehiclePhaseFourJourney(){
  if(vehiclePhase4Timer)clearInterval(vehiclePhase4Timer);
  if(vehiclePhase4RAF)cancelAnimationFrame(vehiclePhase4RAF);
  vehiclePhase4RAF=0;vehiclePhase4Timer=0;
  stage.classList.remove('blueprints-off');
  vehicleRevealStage='phase4';vehiclePhase4Progress=0;vehiclePhase4Start=Date.now();
  const continuity=vehicleIs('tractor')
    ?t('The drone now scans the field, identifies real problem zones and sends coordinates to the tractor. The tractor then drives smoothly to each target and performs the correct treatment.','Le drone analyse maintenant le champ, identifie de vraies zones à problème et envoie leurs coordonnées au tracteur. Le tracteur se rend ensuite doucement vers chaque cible et applique le traitement adapté.')
    :vehicleIs('coach')
    ?(vehicleFutureAbility==='flight'
      ?t('A route disruption has triggered the coach’s aerial bypass. Passenger safety, power and Future Tech are checked before the coach rejoins the motorway and reaches the final terminal.','Une coupure d’itinéraire déclenche la déviation aérienne de l’autocar. La sécurité passagers, l’énergie et la technologie future sont vérifiées avant le retour sur la route et l’arrivée au terminal final.')
      :t('The coach is taking an amphibious route crossing. Passenger safety, power and Future Tech are checked before it rejoins the road and reaches the final terminal.','L’autocar effectue une traversée amphibie. La sécurité passagers, l’énergie et la technologie future sont vérifiées avant le retour sur route et l’arrivée au terminal final.'))
    :vehicleIs('van')
      ?(vehicleFutureAbility==='flight'
        ?t('The van now uses its flight system for a final express delivery, while Movement, Power and Safety are checked together.','Le van utilise maintenant son système de vol pour une livraison express finale pendant que Mouvement, Énergie et Sécurité sont vérifiés ensemble.')
        :t('The van now uses its amphibious system for a harbour delivery, then returns safely to land.','Le van utilise maintenant son système amphibie pour une livraison au port, puis revient en sécurité sur la terre ferme.'))
      :vehicleFutureAbility==='flight'
        ?t('The car is already airborne. The test continues the flight, checks Movement, Power and Safety, then returns and lands.','La voiture est déjà en vol. Le test poursuit le vol, vérifie Mouvement, Énergie et Sécurité, puis revient et atterrit.')
        :t('The car is already in open water. The test continues across the water, checks Movement, Power and Safety, then returns to shore and deploys the wheels.','La voiture est déjà en eau libre. Le test poursuit le trajet aquatique, vérifie Mouvement, Énergie et Sécurité, puis revient sur la rive et redéploie les roues.');
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${vehicleIs('tractor')?t('Precision Agriculture Test','Test d’agriculture de précision'):t('Full Systems Test','Test complet des systèmes')}</b><p>${continuity}</p></div></div>`;showVehicleStageNotice(vehicleIs('tractor')?t('Autonomous Precision Mode','Mode de précision autonome'):t('Full Systems Test','Test complet des systèmes'),vehicleIs('tractor')?t('Watch the drone detect a problem, mark it, and guide the tractor to the exact treatment zone.','Observe le drone détecter un problème, le marquer et guider le tracteur vers la zone exacte à traiter.'):vehicleFutureAbility==='flight'?t('Flight, power and safety checks are running.','Les contrôles de vol, énergie et sécurité sont en cours.'):t('Water, power and safety checks are running.','Les contrôles aquatiques, énergie et sécurité sont en cours.'),{duration:3400});
  $('creatorCoach').textContent=continuity;
  const duration=vehicleIs('tractor')?24000:vehicleIs('coach')?14500:vehicleIs('van')?12400:15800;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePhase4Timer)clearInterval(vehiclePhase4Timer);vehiclePhase4Timer=0;return}
    vehiclePhase4Progress=clamp((Date.now()-vehiclePhase4Start)/duration,0,1);
    safeVehicleRender();
    if(vehiclePhase4Progress>=1){
      clearInterval(vehiclePhase4Timer);vehiclePhase4Timer=0;vehicleRevealStage='phase4-complete';vehiclePhase4Progress=1;safeVehicleRender();
      const special=vehicleIs('tractor')?t('Precision GPS, soil sensing, crop scanning and drone coordination complete','GPS de précision, capteurs du sol, scan des cultures et coordination du drone terminés'):vehicleFutureAbility==='flight'?t(`${vehicleFlightSystemLabel()} flight and landing complete`,`${vehicleFlightSystemLabel()} : vol et atterrissage terminés`):t('Amphibious water journey and shore return complete','Trajet amphibie et retour sur la rive terminés');
      $('creatorTestResult').innerHTML=vehicleIs('tractor')
        ?`<div class="creator-report"><div><b>${t('Precision farm mission passed','Mission agricole de précision réussie')}</b><p>${t('The tractor completed five different farm jobs, then used autonomous guidance and smart sensing to finish the field accurately.','Le tracteur a réalisé cinq travaux agricoles différents, puis a utilisé le guidage autonome et les capteurs intelligents pour terminer le champ avec précision.')}</p><ul><li class="pass">✓ ${t('Mowing and field clearing complete','Fauche et dégagement terminés')}</li><li class="pass">✓ ${t('Soil preparation and planting complete','Préparation du sol et semis terminés')}</li><li class="pass">✓ ${t('Precision irrigation complete','Irrigation de précision terminée')}</li><li class="pass">✓ ${t('Material moving and levelling complete','Déplacement et nivellement terminés')}</li><li class="pass">✓ ${special}</li></ul><p>${t('The farm team is safe and the field work is complete. The Precision Agriculture Engineer result is starting now.','L’équipe agricole est en sécurité et le travail du champ est terminé. Le résultat Ingénieur en agriculture de précision commence maintenant.')}</p></div></div>`
        :vehicleIs('coach')
        ?`<div class="creator-report"><div><b>${t('Intercity journey passed','Trajet interurbain réussi')}</b><p>${t('Passengers boarded safely, luggage was secured, the scheduled stopover was completed and the coach reached its final city after the Future Tech route challenge.','Les passagers ont embarqué en sécurité, les bagages ont été rangés, l’arrêt intermédiaire a été effectué et l’autocar a atteint sa ville finale après le défi de technologie future.')}</p><ul><li class="pass">✓ ${t('Passenger boarding verified','Embarquement des passagers vérifié')}</li><li class="pass">✓ ${t('Lower luggage bays verified','Soutes à bagages vérifiées')}</li><li class="pass">✓ ${t('Scheduled stopover completed','Arrêt intermédiaire terminé')}</li><li class="pass">✓ ${t('Final destination reached','Destination finale atteinte')}</li><li class="pass">✓ ${special}</li></ul><p>${t('The coach is safely at the terminal. The Intercity Transport Engineer result is starting now.','L’autocar est arrivé en sécurité au terminal. Le résultat Ingénieur transport interurbain commence maintenant.')}</p></div></div>`
        :vehicleIs('van')
          ?`<div class="creator-report"><div><b>${t('Van transport mission passed','Mission de transport du van réussie')}</b><p>${t('The same finished van transported passengers, handled cargo and completed its Future Tech delivery test.','Le même van fini a transporté des passagers, pris en charge du chargement et réussi son test de livraison avec technologie future.')}</p><ul><li class="pass">✓ ${t('Passengers transported safely','Passagers transportés en sécurité')}</li><li class="pass">✓ ${t('Rear-door cargo loading verified','Chargement par portes arrière vérifié')}</li><li class="pass">✓ ${t('Cargo delivery complete','Livraison de marchandises terminée')}</li><li class="pass">✓ ${special}</li></ul><p>${t('The van has returned safely. The final transport-and-delivery celebration is starting now.','Le van est revenu en sécurité. La célébration finale transport et livraison commence maintenant.')}</p></div></div>`
        :`<div class="creator-report"><div><b>${t('Full Systems Test passed','Test complet réussi')}</b><p>${t('The same finished car completed the full test without restarting the journey.','La même voiture finie a terminé le test complet sans redémarrer le parcours.')}</p><ul><li class="pass">✓ ${t('Movement verified','Mouvement vérifié')}</li><li class="pass">✓ ${vehiclePowertrainLabel()} ${t('power verified','énergie vérifiée')}</li><li class="pass">✓ ${t('Safety systems verified','Systèmes de sécurité vérifiés')}</li><li class="pass">✓ ${special}</li></ul><p>${t('The vehicle has returned safely. The final celebration and results are starting now.','Le véhicule est revenu en sécurité. La célébration et les résultats finaux commencent maintenant.')}</p></div></div>`;
      $('creatorCoach').textContent=vehicleIs('tractor')?t('The field work is complete and the smart-farm systems passed. Keep watching — the final result begins automatically.','Le travail du champ est terminé et les systèmes agricoles intelligents ont réussi. Continue de regarder — le résultat final démarre automatiquement.'):t('The car is safely returned. Keep watching — the final celebration starts automatically.','La voiture est revenue en sécurité. Continue de regarder — la célébration finale démarre automatiquement.');showVehicleStageNotice(vehicleIs('tractor')?t('Precision mission passed','Mission de précision réussie'):t('All systems passed','Tous les systèmes ont réussi'),t('Mission celebration starting…','La célébration de mission commence…'),{duration:2400});
      window.playTone?.(true);
      setTimeout(()=>{if(testRunning&&vehicleRevealActive&&vehicleRevealStage==='phase4-complete')startVehiclePhaseFiveCelebration()},900);
    }
  };
  tick();vehiclePhase4Timer=setInterval(tick,33);
}

function vehicleModelLabel(){
  return vehicleLibrary.find(v=>v.id===currentLibraryId)?.name||'Sport Car';
}
function vehicleFinalTechLabel(){
  if(vehicleIs('tractor'))return t('Precision Smart Farming','Agriculture intelligente de précision');
  return vehicleFutureAbility==='flight'?vehicleFlightSystemLabel():vehicleFutureAbilityLabel();
}
function vehicleAchievementLabel(){return vehicleIs('tractor')?t('Precision Agriculture Engineer','Ingénieur en agriculture de précision'):vehicleIs('suv')?t('Adventure Vehicle Engineer','Ingénieur véhicule d’aventure'):vehicleIs('van')?t('Transport & Delivery Engineer','Ingénieur transport et livraison'):vehicleIs('coach')?t('Intercity Transport Engineer','Ingénieur transport interurbain'):t('Future Vehicle Engineer','Ingénieur du véhicule du futur');}
function drawPhase5Confetti(p){
  const pieces=[
    [84,56,'#5de4ff',.3],[140,102,'#ffd84d',.5],[208,64,'#ff6d8c',.72],[272,118,'#6ee7a7',.18],
    [336,55,'#9d78ff',.61],[418,94,'#ff9b52',.42],[488,52,'#5de4ff',.87],[552,106,'#ffd84d',.27],
    [630,64,'#ff6d8c',.68],[704,116,'#6ee7a7',.35],[754,58,'#9d78ff',.8],[44,142,'#ff9b52',.56]
  ];
  const fall=clamp(p/.82,0,1);
  pieces.forEach(([x,y,c,offset],i)=>{
    const yy=y+fall*(120+offset*70),xx=x+Math.sin((fall+offset)*Math.PI*3)*18;
    tctx.save();tctx.translate(xx,yy);tctx.rotate((fall*5+offset*4));tctx.fillStyle=c;tctx.globalAlpha=.9*(1-clamp((p-.78)/.22,0,1));
    if(i%2){tctx.fillRect(-4,-9,8,18)}else{tctx.beginPath();tctx.arc(0,0,6,0,Math.PI*2);tctx.fill()}
    tctx.restore();
  });
}
function drawVehiclePhaseFiveCelebration(){
  if(vehicleIs('tractor')){drawTractorCelebration();return;}
  if(vehicleIs('suv')){drawSUVCelebration();return;}
  if(vehicleIs('van')){drawVanCelebration();return;}
  if(vehicleIs('coach')){drawCoachCelebration();return;}
  const W=templateCanvas.width,H=templateCanvas.height,p=vehicleRevealStage==='phase5'?clamp(vehiclePhase5Progress,0,1):1;
  tctx.save();tctx.globalAlpha=1;tctx.globalCompositeOperation='source-over';tctx.setTransform(1,0,0,1,0,0);tctx.filter='none';tctx.shadowBlur=0;tctx.setLineDash([]);tctx.clearRect(0,0,W,H);
  const bg=tctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#102b43');bg.addColorStop(.55,'#183d59');bg.addColorStop(1,'#0b2032');tctx.fillStyle=bg;tctx.fillRect(0,0,W,H);
  /* celebration spotlights */
  const beam=(x,flip=1)=>{const g=tctx.createLinearGradient(x,0,x+flip*170,H);g.addColorStop(0,'rgba(104,225,255,.22)');g.addColorStop(1,'rgba(104,225,255,0)');tctx.fillStyle=g;tctx.beginPath();tctx.moveTo(x,0);tctx.lineTo(x+flip*70,0);tctx.lineTo(x+flip*245,H);tctx.lineTo(x+flip*80,H);tctx.closePath();tctx.fill();};
  beam(80,1);beam(720,-1);
  tctx.fillStyle='rgba(93,228,255,.10)';tctx.beginPath();tctx.ellipse(400,344,248,52,0,0,Math.PI*2);tctx.fill();
  tctx.strokeStyle='rgba(129,232,255,.35)';tctx.lineWidth=2;tctx.beginPath();tctx.ellipse(400,344,226,42,0,0,Math.PI*2);tctx.stroke();
  const arrive=clamp(p/.42,0,1),settle=1-Math.pow(1-arrive,3),heroScale=.67+.05*Math.sin(clamp((p-.18)/.42,0,1)*Math.PI);
  const carX=400+(1-settle)*210,carY=300-(1-settle)*22;
  drawPhase3VehicleAt(carX,carY,heroScale,{paint:vehiclePaintColor,glow:.82,wheelSpin:vehicleRevealStage==='phase5'&&p<.42?-p*8:0,angle:(1-settle)*.06,flight:false,water:false,retractWheels:false,faceRight:true});
  if(vehicleRevealStage==='phase5')drawPhase5Confetti(p);
  const titleA=clamp((p-.30)/.28,0,1);
  tctx.save();tctx.globalAlpha=titleA;tctx.textAlign='center';tctx.shadowColor='rgba(82,228,255,.65)';tctx.shadowBlur=16;tctx.fillStyle='#f4fbff';tctx.font='900 26px system-ui';tctx.fillText(t('MISSION COMPLETE','MISSION TERMINÉE'),400,64);tctx.shadowBlur=0;tctx.fillStyle='rgba(169,231,255,.94)';tctx.font='800 13px system-ui';tctx.fillText(t('Future Vehicle Engineer','Ingénieur du véhicule du futur'),400,88);tctx.restore();
  const badgeA=clamp((p-.48)/.28,0,1);
  tctx.save();tctx.globalAlpha=badgeA;tctx.textAlign='center';tctx.fillStyle='rgba(220,255,241,.96)';tctx.font='800 14px system-ui';tctx.fillText('🏅  '+t('Achievement unlocked','Récompense débloquée'),400,122);tctx.restore();
  if(vehicleRevealStage!=='phase5-view'){
    const resultA=clamp((p-.62)/.28,0,1);tctx.save();tctx.globalAlpha=resultA;
    tctx.fillStyle='rgba(223,245,255,.96)';tctx.font='800 11px system-ui';tctx.textAlign='center';
    const items=[t('Body & Movement ✓','Carrosserie et mouvement ✓'),`${vehiclePowertrainLabel()} ✓`,t('Safety ✓','Sécurité ✓'),`${vehicleFinalTechLabel()} ✓`,t('Full Test ✓','Test complet ✓')];
    const xs=[120,265,400,535,680];items.forEach((label,i)=>{drawRoundedPanel(xs[i]-60,397,120,28,13,'rgba(7,24,36,.62)','rgba(147,232,255,.18)');tctx.fillText(label,xs[i],415)});
    tctx.restore();
  }
  if(vehicleRevealStage==='phase5-view'){
    drawRoundedPanel(256,362,288,46,18,'rgba(7,24,36,.74)','rgba(147,232,255,.22)');tctx.fillStyle='#e7f7ff';tctx.textAlign='center';tctx.font='800 14px system-ui';tctx.fillText(vehicleCreationName||t('My Future Vehicle','Mon véhicule du futur'),400,390);
  }
  tctx.restore();
}
function vehiclePhaseFiveFinalHTML(){
  const name=vehicleCreationName||t('My Future Vehicle','Mon véhicule du futur');
  const adminNote=document.documentElement.dataset.admin==='true'?`<small class="admin-only-note" style="display:block;margin-top:10px;opacity:.78">${t('Admin note: Save project currently keeps this build on this browser. My Garage will use account/server saving in production.','Note admin : Enregistrer le projet conserve actuellement cette création dans ce navigateur. Mon Garage utilisera la sauvegarde serveur du compte en production.')}</small>`:'';
  const coachRoute=vehicleIs('coach')?`<li class="pass">✓ ${coachRouteText()}</li><li class="pass">✓ ${t('Passenger boarding, luggage bays and scheduled stopover completed','Embarquement, soutes à bagages et arrêt intermédiaire terminés')}</li>`:'';
  const summary=vehicleIs('tractor')?t('You engineered a multi-purpose farm tractor, completed five real field jobs and finished an autonomous precision-agriculture mission.','Tu as conçu un tracteur agricole multifonction, réalisé cinq vrais travaux des champs et terminé une mission d’agriculture de précision autonome.'):vehicleIs('coach')?t('You engineered and completed a real intercity transport mission.','Tu as conçu et terminé une véritable mission de transport interurbain.'):t('You designed, built and tested a complete Future Vehicle.','Tu as conçu, construit et testé un véhicule du futur complet.');
  return `<div class="creator-report"><div style="width:100%"><b>${t('Mission complete','Mission terminée')} — ${name}</b><p>${summary}</p><ul><li class="pass">✓ ${vehicleModelLabel()}</li>${coachRoute}<li class="pass">✓ ${vehiclePowertrainLabel()}</li><li class="pass">✓ ${t('Safety system complete','Système de sécurité terminé')}</li><li class="pass">✓ ${vehicleFinalTechLabel()}</li><li class="pass">✓ ${t('Full Systems Test passed','Test complet des systèmes réussi')}</li></ul><p><b>🏅 ${t('Achievement unlocked','Récompense débloquée')}: ${vehicleAchievementLabel()}</b></p><div id="vehiclePhase5Actions" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px"><button type="button" id="vehicleKnowledgeQuiz" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">🧠 ${t('Test What You Learned','Teste ce que tu as appris')}</button><button type="button" id="vehicleReplayFullTest" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">▶ ${t('Replay Full Test','Rejouer le test complet')}</button><button type="button" id="vehicleReplayTransform" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">✨ ${t('Watch Transformation Again','Revoir la transformation')}</button><button type="button" id="vehicleViewFinalCar" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">🚘 ${t('View My Vehicle','Voir mon véhicule')}</button><button type="button" id="vehicleReturnCreator" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">🛠 ${t('Return to Creator Studio','Retour au Creator Studio')}</button></div>${adminNote}</div></div>`;
}
function vehicleQuizPool(){
  const scopes=new Set(['body','safety','general',vehiclePowertrain,vehicleFutureAbility==='water'?'water':vehicleFlightSystem]);
  return VEHICLE_QUIZ_BANK.filter(q=>scopes.has(q.scope));
}
function startVehicleKnowledgeQuiz(){
  const shuffle=a=>{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out};
  const pool=vehicleQuizPool(),recent=new Set(vehicleQuizRecentIds),fresh=pool.filter(q=>!recent.has(q.id));
  const source=fresh.length>=5?fresh:pool.filter(q=>!vehicleQuizRecentIds.slice(0,5).includes(q.id));
  const questions=shuffle(source.length>=5?source:pool).slice(0,Math.min(5,pool.length));
  vehicleQuizRecentIds=[...questions.map(q=>q.id),...vehicleQuizRecentIds.filter(id=>!questions.some(q=>q.id===id))].slice(0,15);
  vehicleQuizState={questions,index:0,score:0,answered:false};renderVehicleKnowledgeQuestion();
}
function renderVehicleKnowledgeQuestion(){
  const st=vehicleQuizState;if(!st)return;const host=$('creatorTestResult');
  if(st.index>=st.questions.length){host.innerHTML=`<div class="creator-report"><div class="vehicle-quiz"><div class="vehicle-quiz-head"><b>🧠 ${t('Vehicle Knowledge Challenge complete','Défi connaissances véhicule terminé')}</b><span class="vehicle-quiz-progress">${st.score}/${st.questions.length}</span></div><p>${st.score===st.questions.length?t('Excellent — you remembered every answer.','Excellent — tu as retenu toutes les réponses.'):t('Good work. Review the explanations and try another set when you want.','Bravo. Relis les explications et essaie une autre série quand tu veux.')}</p><div class="vehicle-quiz-actions"><button id="vehicleQuizAgain">↻ ${t('Try another 5','Essayer 5 autres')}</button><button id="vehicleQuizBack">← ${t('Back to mission results','Retour aux résultats')}</button></div></div></div>`;$('vehicleQuizAgain').onclick=startVehicleKnowledgeQuiz;$('vehicleQuizBack').onclick=()=>{$('creatorTestResult').innerHTML=vehiclePhaseFiveFinalHTML();bindVehiclePhaseFiveActions();};return;}
  const q=st.questions[st.index];const order=q.a.map((_,i)=>i).sort(()=>Math.random()-.5);st.optionOrder=order;st.answered=false;
  host.innerHTML=`<div class="creator-report"><div class="vehicle-quiz"><div class="vehicle-quiz-head"><b>🧠 ${t('Test What You Learned','Teste ce que tu as appris')}</b><span class="vehicle-quiz-progress">${st.index+1}/${st.questions.length}</span></div><div class="vehicle-quiz-question">${L(q.q)}</div><div class="vehicle-quiz-options">${order.map(i=>`<button type="button" class="vehicle-quiz-option" data-answer="${i}">${L(q.a[i])}</button>`).join('')}</div><div class="vehicle-quiz-feedback" id="vehicleQuizFeedback"></div><div class="vehicle-quiz-actions"><button id="vehicleQuizNext" disabled>${t('Next question','Question suivante')} →</button><button id="vehicleQuizBack">${t('Back to results','Retour aux résultats')}</button></div></div></div>`;
  document.querySelectorAll('.vehicle-quiz-option').forEach(b=>b.onclick=()=>{if(st.answered)return;st.answered=true;const chosen=+b.dataset.answer,correct=q.correct;if(chosen===correct){st.score++;b.classList.add('correct')}else{b.classList.add('wrong');document.querySelector(`.vehicle-quiz-option[data-answer="${correct}"]`)?.classList.add('correct')};document.querySelectorAll('.vehicle-quiz-option').forEach(x=>x.disabled=true);$('vehicleQuizFeedback').textContent=(chosen===correct?t('Correct. ','Correct. '):t('Not quite. ','Pas tout à fait. ')) + L(q.why);$('vehicleQuizNext').disabled=false;window.playTone?.(chosen===correct);});
  $('vehicleQuizNext').onclick=()=>{st.index++;renderVehicleKnowledgeQuestion()};$('vehicleQuizBack').onclick=()=>{$('creatorTestResult').innerHTML=vehiclePhaseFiveFinalHTML();bindVehiclePhaseFiveActions();};
}

function bindVehiclePhaseFiveActions(){
  const quiz=$('vehicleKnowledgeQuiz');if(quiz)quiz.onclick=startVehicleKnowledgeQuiz;
  const replay=$('vehicleReplayFullTest');if(replay)replay.onclick=()=>{vehiclePhase5Named=!!vehicleCreationName;startVehiclePhaseThreeWorld();};
  const transform=$('vehicleReplayTransform');if(transform)transform.onclick=startVehiclePhaseFiveTransformationReplay;
  const view=$('vehicleViewFinalCar');if(view)view.onclick=()=>{vehicleRevealStage='phase5-view';safeVehicleRender();$('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Viewing your finished vehicle','Vue de ton véhicule fini')}</b><p>${t('This is the vehicle you completed and tested.','Voici le véhicule que tu as terminé et testé.')}</p><button type="button" id="vehicleBackToResults" style="padding:10px 14px;border:0;border-radius:999px;font-weight:800;cursor:pointer">← ${t('Back to results','Retour aux résultats')}</button></div></div>`;const back=$('vehicleBackToResults');if(back)back.onclick=()=>{vehicleRevealStage='phase5-complete';safeVehicleRender();$('creatorTestResult').innerHTML=vehiclePhaseFiveFinalHTML();bindVehiclePhaseFiveActions();};};
  const ret=$('vehicleReturnCreator');if(ret)ret.onclick=()=>stopTest(true);
}
function showVehiclePhaseFiveNameUI(){
  vehicleRevealStage='phase5-ready';vehiclePhase5Progress=1;safeVehicleRender();
  const suggested=vehicleCreationName||(vehicleIs('tractor')?'AgriTech X1':vehicleIs('coach')?'Intercity X1':'Nova X1');
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div style="width:100%"><b>${t('Name your creation','Nomme ta création')}</b><p>${t('All systems passed. Give your finished vehicle a name to complete the mission.','Tous les systèmes ont réussi. Donne un nom à ton véhicule pour terminer la mission.')}</p><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px"><input id="vehicleCreationNameInput" type="text" maxlength="28" value="${String(suggested).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\"/g,'&quot;')}" aria-label="${t('Vehicle name','Nom du véhicule')}" style="min-width:180px;flex:1;padding:11px 14px;border-radius:12px;border:1px solid rgba(147,232,255,.35);background:rgba(8,25,36,.72);color:#fff;font-weight:800"><button type="button" id="vehicleConfirmName" style="padding:11px 16px;border:0;border-radius:999px;font-weight:800;cursor:pointer">🏁 ${t('Complete Mission','Terminer la mission')}</button></div></div></div>`;
  $('creatorCoach').textContent=t('Choose a name for the vehicle. You can use the suggestion or type your own name.','Choisis un nom pour le véhicule. Tu peux utiliser la suggestion ou saisir ton propre nom.');
  const input=$('vehicleCreationNameInput'),confirm=$('vehicleConfirmName');
  if(confirm)confirm.onclick=()=>{
    vehicleCreationName=(input?.value||'').trim().replace(/[<>]/g,'').slice(0,28)||(vehicleIs('tractor')?'AgriTech X1':vehicleIs('coach')?'Intercity X1':'Nova X1');vehiclePhase5Named=true;vehicleRevealStage='phase5-complete';safeVehicleRender();
    $('creatorTestResult').innerHTML=vehiclePhaseFiveFinalHTML();bindVehiclePhaseFiveActions();
    $('creatorCoach').textContent=t('Future Vehicle mission complete. Replay the tests, admire the finished car or return to Creator Studio.','Mission Véhicule du futur terminée. Rejoue les tests, admire la voiture finie ou retourne au Creator Studio.');
    window.playTone?.(true);showVehicleStageNotice(t('Mission complete','Mission terminée'),`${vehicleCreationName} · ${vehicleAchievementLabel()}`,{duration:4200});
  };
  $('creatorTestResult').scrollIntoView?.({behavior:'smooth',block:'nearest'});
}
function startVehiclePhaseFiveCelebration(){
  if(vehiclePhase5Timer)clearInterval(vehiclePhase5Timer);if(vehiclePhase5RAF)cancelAnimationFrame(vehiclePhase5RAF);
  vehiclePhase5RAF=0;vehiclePhase5Timer=0;vehicleRevealStage='phase5';vehiclePhase5Progress=0;vehiclePhase5Start=Date.now();
  const celebrationCopy=vehicleIs('tractor')
    ?t('The tractor completed mowing, soil preparation, planting, irrigation, levelling and autonomous precision farming. The Precision Agriculture Engineer result is starting now.','Le tracteur a terminé la fauche, la préparation du sol, le semis, l’irrigation, le nivellement et l’agriculture autonome de précision. Le résultat Ingénieur en agriculture de précision commence maintenant.')
    :vehicleIs('suv')
    ?t('The 4×4 has returned safely from its adventure test. Final results and the Adventure Vehicle Engineer celebration are starting now.','Le 4×4 est revenu en sécurité de son test aventure. Les résultats finaux et la célébration Ingénieur véhicule d’aventure commencent maintenant.')
    :vehicleIs('van')
      ?t('The van completed its passenger, cargo and Future Tech delivery tests. The Transport & Delivery Engineer celebration is starting now.','Le van a terminé ses tests passagers, chargement et livraison avec technologie future. La célébration Ingénieur transport et livraison commence maintenant.')
      :vehicleIs('coach')
        ?t('The intercity coach completed boarding, luggage handling, its scheduled stopover, Future Tech route challenge and final-city arrival. The Intercity Transport Engineer result is starting now.','L’autocar a terminé l’embarquement, la gestion des bagages, l’arrêt intermédiaire, le défi de technologie future et l’arrivée finale. Le résultat Ingénieur transport interurbain commence maintenant.')
        :t('The vehicle has returned safely. Final results and the Future Vehicle Engineer celebration are starting now.','Le véhicule est revenu en sécurité. Les résultats finaux et la célébration Ingénieur du véhicule du futur commencent maintenant.');
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Mission Complete','Mission terminée')}</b><p>${celebrationCopy}</p></div></div>`;
  $('creatorCoach').textContent=t('The final celebration is running. Your vehicle, chosen paint, power system and Future Tech are all being carried into the result.','La célébration finale est en cours. Ton véhicule, sa couleur, son énergie et sa technologie future sont conservés dans le résultat.');
  showVehicleStageNotice(t('Mission complete','Mission terminée'),vehicleIs('tractor')?t('Precision Agriculture Engineer result ready.','Résultat Ingénieur en agriculture de précision prêt.'):vehicleIs('suv')?t('Your Adventure Vehicle Engineer celebration is starting.','Ta célébration Ingénieur véhicule d’aventure commence.'):vehicleIs('van')?t('Your Transport & Delivery Engineer celebration is starting.','Ta célébration Ingénieur transport et livraison commence.'):vehicleIs('coach')?t('Your Intercity Transport Engineer result is starting.','Ton résultat Ingénieur transport interurbain commence.'):t('Your Future Vehicle Engineer celebration is starting.','Ta célébration Ingénieur du véhicule du futur commence.'),{duration:3000});
  const duration=5200;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){if(vehiclePhase5Timer)clearInterval(vehiclePhase5Timer);vehiclePhase5Timer=0;return}
    vehiclePhase5Progress=clamp((Date.now()-vehiclePhase5Start)/duration,0,1);safeVehicleRender();
    if(vehiclePhase5Progress>=1){clearInterval(vehiclePhase5Timer);vehiclePhase5Timer=0;vehiclePhase5Progress=1;showVehiclePhaseFiveNameUI();window.playTone?.(true);}
  };
  tick();vehiclePhase5Timer=setInterval(tick,33);
}
function startVehiclePhaseFiveTransformationReplay(){
  if(vehiclePhase5Timer)clearInterval(vehiclePhase5Timer);
  vehicleTransformationReplay=true;vehicleRevealStage='phase1';vehicleRevealProgress=0;vehicleRevealStart=Date.now();
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Transformation replay','Relecture de la transformation')}</b><p>${t('Replaying the blueprint-to-finished-car transformation. Your confirmed paint colour is preserved.','Relecture de la transformation du plan vers la voiture finie. Ta couleur confirmée est conservée.')}</p></div></div>`;
  const duration=6500;
  const tick=()=>{
    if(!testRunning||!vehicleRevealActive){clearInterval(vehiclePhase5Timer);vehiclePhase5Timer=0;vehicleTransformationReplay=false;return}
    vehicleRevealProgress=clamp((Date.now()-vehicleRevealStart)/duration,0,1);safeVehicleRender();
    if(vehicleRevealProgress>=1){clearInterval(vehiclePhase5Timer);vehiclePhase5Timer=0;vehicleRevealProgress=1;vehicleTransformationReplay=false;vehicleRevealStage='phase5-complete';safeVehicleRender();$('creatorTestResult').innerHTML=vehiclePhaseFiveFinalHTML();bindVehiclePhaseFiveActions();}
  };
  tick();vehiclePhase5Timer=setInterval(tick,33);
}
function startVehiclePhaseOneReveal(){
  stopTest(false);
  testRunning=true;vehicleRevealActive=true;vehicleRevealStage='phase1';vehicleRevealProgress=0;vehicleRevealStart=Date.now();
  vehiclePhase2Progress=0;vehiclePaintMix=1;
  /* The final presentation starts from a clean canonical view for the selected vehicle. */
  vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';updateVehicleViewUI();
  stage.classList.add('testing','test-active');$('stopCreationTest').hidden=false;selectObject(null);
  simulation.className='creator-simulation active';simulation.innerHTML='';
  syncInstalledVehicleParts();
  const revealModel=vehicleModelLabel();
  $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Vehicle transformation','Transformation du véhicule')}</b><p>${t(`The construction blueprint is merging into one clean finished ${revealModel}.`,`Le plan de construction fusionne pour devenir un ${revealModel} fini et propre.`)}</p></div></div>`;
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
      $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t(`Finished ${revealModel} formed`,`${revealModel} terminé`)}</b><p>${t('The construction views are no longer used for the finished result. The vehicle is now one complete shell with integrated glass, wheels and lights.','Les vues de construction ne sont plus utilisées pour le résultat fini. Le véhicule est maintenant une carrosserie complète avec vitrage, roues et feux intégrés.')}</p></div></div>`;
      window.playTone?.(true);showVehicleStageNotice(t('Vehicle transformed','Véhicule transformé'),t('Your finished car is ready for paint and final styling.','Ta voiture finie est prête pour la couleur et la finition.'),{duration:2600});
      setTimeout(()=>{if(testRunning&&vehicleRevealActive)startVehiclePhaseTwoReveal()},700);
    }
  };
  tick();vehicleRevealTimer=setInterval(tick,33);
}
function startTest(){if(!active)return;
  if(active==='vehicle'&&!vehicleReadyForTest()){updateVehicleProgressUI();return;}
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
      $('creatorCoach').textContent=vehicleIs('tractor')?t('Use Top, Side and Interior views to finish the GPS, crop, soil, guidance-computer and drone-dock systems.','Utilise les vues Dessus, Côté et Intérieur pour terminer les systèmes GPS, cultures, sol, ordinateur de guidage et station du drone.'):vehicleFutureAbility==='flight'?t('Use Top, Rear and Interior views to finish the flying-car hardware.','Utilise les vues Dessus, Arrière et Intérieur pour terminer les équipements de la voiture volante.'):t('Use Interior and Rear views to finish the amphibious system.','Utilise les vues Intérieur et Arrière pour terminer le système amphibie.');return;
    }
    vehicleYaw=0;vehiclePitch=.06;vehicleViewMode='left';renderTemplate('vehicle');updateVehicleViewUI();
    if(['vehicle-sport','vehicle-suv','vehicle-van','vehicle-coach','vehicle-tractor'].includes(currentLibraryId)){startVehiclePhaseOneReveal();return;}
    const model=vehicleModelLabel();
    $('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Vehicle build complete','Construction du véhicule terminée')} — ${model}</b><p>${t('All four build areas are complete. This vehicle is ready for its own unique final animation and test journey, which will be designed separately.','Les quatre zones de construction sont terminées. Ce véhicule est prêt pour sa propre animation finale et son parcours de test unique, qui seront conçus séparément.')}</p></div></div>`;
    $('creatorCoach').textContent=t('Build complete. Save this vehicle; its unique final test will be connected when we design this vehicle’s ending.','Construction terminée. Enregistre ce véhicule ; son test final unique sera connecté lorsque nous concevrons sa fin.');
    showVehicleStageNotice(t('Vehicle build complete','Construction terminée'),`${model} · ${t('ready for final test design','prêt pour la conception du test final')}`,{duration:0});window.playTone?.(true);return;
  }
  if(active==='room'){startRoomLiveTest();return;}
  const m=missions[active],objectCount=objectLayer.children.length,enough=drawStrokes>=1||objectCount>=2;if(!enough){$('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Needs more design work','Il faut encore travailler le design')}</b><p>${t('Add some drawing or at least two movable pieces before testing.','Ajoute un dessin ou au moins deux pièces avant de tester.')}</p></div>`;return}stopTest(false);testRunning=true;if(active==='vehicle')renderTemplate('vehicle');stage.classList.add('testing','test-active');$('stopCreationTest').hidden=false;selectObject(null);simulation.className='creator-simulation active';simulation.innerHTML='';addTestClasses();const tags=testTags();let special='';if(active==='vehicle'){const travel=Math.max(65,stage.clientWidth*.20);buildLayer.style.setProperty('--test-travel',travel+'px');if(tags.has('flight')){buildLayer.classList.add('test-fly');simulation.innerHTML='<span class="flight-cloud" style="top:18%">☁️</span><span class="flight-cloud">☁️</span>';special=t('Flying test: the completed vehicle lifts and flies because flight technology is installed.','Test de vol : le véhicule s’élève grâce aux technologies de vol.')}else if(tags.has('amphibious')){buildLayer.classList.add('test-water');simulation.innerHTML='<div class="water-test"></div>';[...objectLayer.children].filter(o=>objectTags(o).includes('wheel')).forEach(o=>{o.classList.remove('test-wheel');o.classList.add('test-water-wheel')});special=t('Water test: the environment changes to water and the wheels retract while the complete vehicle travels as one build.','Test aquatique : l’environnement devient aquatique et les roues se rétractent pendant que le véhicule complet avance.')}else{buildLayer.classList.add('test-road');special=t('Road test: the whole completed vehicle drives smoothly, pauses at each side, then reverses. The tyres rotate with the direction of travel.','Test routier : le véhicule complet roule en douceur, marque une pause à chaque côté puis repart. Les pneus tournent selon le sens.')}}else if(active==='room'){simulation.innerHTML='<div class="room-scan"></div>';special=roomCollisionReport();}else if(active==='park'){simulation.innerHTML='<span class="park-visitor" style="top:34%">🚶</span><span class="park-visitor">🧑‍🦽</span><span class="park-visitor">🧒</span>';special=t('Visitor simulation is running. Watch how people move through the park, then stop and improve the layout.','La simulation des visiteurs est en cours. Observe leurs déplacements puis arrête et améliore le parc.')}else if(active==='robot'){buildLayer.classList.add('test-robot');special=t('Robot systems test is running on the assembled design. This is the foundation for robot-specific movement tests in later upgrades.','Le test des systèmes fonctionne sur le robot assemblé.')}else if(active==='story'){simulation.innerHTML='<div class="story-frame"></div>';special=t('Story preview is running. Check whether the characters, setting and props communicate the scene clearly.','L’aperçu de l’histoire est en cours. Vérifie que personnages, décor et accessoires racontent clairement la scène.')}else if(active==='mars'){simulation.innerHTML='<div class="room-scan"></div>';special=t('Base systems scan is running. Check habitats, support systems, transport and connections.','Le contrôle de la base est en cours. Vérifie habitats, survie, transport et connexions.')}const checks=(m.checks||[]).map(([tag,label])=>({label,ok:tags.has(tag)||objectCount>=4}));let score=Math.min(100,40+objectCount*4+drawStrokes*5);$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${score}</b><small>/100</small></div><div><b>${t('Live test running','Test en direct')}</b><p>${special}</p>${checks.length?`<ul>${checks.map(c=>`<li class="${c.ok?'pass':'miss'}">${c.ok?'✓':'○'} ${c.label}</li>`).join('')}</ul>`:''}</div></div>`;$('creatorCoach').textContent=special;window.playTone?.(true);}
function stopTest(showMessage=true){hideVehicleStageNotice();if(roomLiveActive)stopRoomLiveTest();if(!testRunning&&showMessage)return;if(vehicleRevealActive)resetVehiclePhaseOneReveal();testRunning=false;stage.classList.remove('testing','test-active','room-live-test');$('stopCreationTest').hidden=true;simulation.className='creator-simulation';simulation.innerHTML='';clearTestClasses();if(active==='vehicle'){renderTemplate('vehicle');updateVehicleProgressUI();}if(active==='room')renderTemplate('room');if(showMessage){$('creatorCoach').textContent=t('Test stopped. Adjust any part, resize it or add something new, then test again.','Test arrêté. Modifie une pièce, redimensionne-la ou ajoute un élément puis reteste.');$('creatorTestResult').innerHTML=`<div class="creator-report"><div><b>${t('Test stopped — back to edit mode','Test arrêté — retour au mode édition')}</b><p>${t('Build → Test → Stop → Improve → Test again.','Construis → Teste → Arrête → Améliore → Reteste.')}</p></div></div>`;}}
function roomCollisionReport(){const issues=roomCollisionIssues();return issues.length?t(`Furniture collision found: ${issues[0]}. Move one object so the room remains usable.`,`Collision de mobilier : ${issues[0]}. Déplace un objet pour garder la pièce utilisable.`):t('The room has a clear circulation path and no major furniture collision was detected.','La pièce conserve une circulation claire et aucune collision importante n’a été détectée.');}

function setObjectSize(v,commit=false){if(!selectedObject||selectedObject.dataset.installed==='1')return;selectedObject.dataset.size=clamp(v,24,420);selectedObject.dataset.installed='0';selectedObject.classList.remove('installed-part');applyObjectStyle(selectedObject);if(active==='vehicle')tryVehicleSnap(selectedObject,true);if(commit)commitHistory();}
function setObjectRotation(v,commit=false){if(!selectedObject||selectedObject.dataset.installed==='1')return;selectedObject.dataset.rotation=v;selectedObject.dataset.installed='0';selectedObject.classList.remove('installed-part');applyObjectStyle(selectedObject);if(active==='vehicle')tryVehicleSnap(selectedObject,true);if(commit)commitHistory();}
function duplicateSelected(){if(!selectedObject||selectedObject.dataset.installed==='1')return;const d=objectData().find((_,i)=>objectLayer.children[i]===selectedObject);if(!d)return;let copy;if(d.kind==='blueprint'){const item=(missions[active].library||[]).find(x=>x.id===d.blueprintId);copy=addBlueprint(item,clamp(d.x+.05,.02,.98),clamp(d.y+.05,.02,.98),d.size,d.rotation,{select:true})}else if(d.kind==='vector')copy=addVector({type:d.vectorType,color:d.vectorColor,stroke:d.vectorStroke,path:d.vectorPath,x:clamp(d.x+.05,.02,.98),y:clamp(d.y+.05,.02,.98),size:d.size,aspect:d.aspect,rotation:d.rotation,label:d.label},{select:true});else{const p=findPart(d.partId)||part(d.partId,d.icon,d.label,d.label,JSON.parse(d.tags||'[]'),d.className);copy=addObject(p,clamp(d.x+.05,.02,.98),clamp(d.y+.05,.02,.98),d.size,d.rotation,{select:true})}commitHistory();if(active==='room')renderTemplate('room');return copy;}
function deleteSelected(){if(!selectedObject)return;if(selectedObject.dataset.installed==='1'){$('creatorCoach').textContent=t('That piece is already fitted into the car and is locked in place.','Cette pièce est déjà fixée dans la voiture et verrouillée.');return}selectedObject.remove();selectedObject=null;selectObject(null);refreshLibraryCards();refreshVehicleComponentButtons();commitHistory();if(active==='room')renderTemplate('room');}
function layerSelected(front){if(!selectedObject)return;front?objectLayer.appendChild(selectedObject):objectLayer.insertBefore(selectedObject,objectLayer.firstChild);commitHistory();if(active==='room')renderTemplate('room');}

// Controls
document.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>openMission(b.dataset.mission));
$('toolSelect').onclick=()=>setTool('select');$('toolPen').onclick=()=>setTool('pen');$('toolEraser').onclick=()=>setTool('eraser');$('toolLine').onclick=()=>setTool('line');$('toolCurve').onclick=()=>setTool('curve');$('toolRect').onclick=()=>setTool('rect');$('toolCircle').onclick=()=>setTool('circle');
const toggleBlueprint=()=>{templateOn=!templateOn;if(active==='vehicle'&&templateOn)setTool('select');renderTemplate(active);updateBlueprintVisibility();commitHistory();showVehicleStageNotice(templateOn?t('Build mode restored','Mode construction restauré'):t('Creative drawing tools available','Outils de dessin disponibles'),templateOn?t('Fit the matching vehicle pieces to the blueprint.','Place les pièces correspondantes sur le plan.'):t('The blueprint is hidden. Draw or decorate freely, then turn it back on to continue building.' ,'Le plan est masqué. Dessine ou décore librement, puis réactive-le pour continuer la construction.'),{duration:3000});};$('toggleTemplate').onclick=toggleBlueprint;if($('vehicleToggleTemplate'))$('vehicleToggleTemplate').onclick=toggleBlueprint;
$('toggleGrid').onclick=()=>{gridOn=!gridOn;stage.classList.toggle('show-grid',gridOn);$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');commitHistory()};
$('undoDraw').onclick=()=>{if(historyIndex<=0)return;historyIndex--;restoreSnapshot(history[historyIndex])};$('redoDraw').onclick=()=>{if(historyIndex>=history.length-1)return;historyIndex++;restoreSnapshot(history[historyIndex])};
$('objectSize').addEventListener('input',e=>setObjectSize(+e.target.value));$('objectSize').addEventListener('change',()=>commitHistory());$('objectRotate').addEventListener('input',e=>setObjectRotation(+e.target.value));$('objectRotate').addEventListener('change',()=>commitHistory());
$('shrinkObject').onclick=()=>setObjectSize((+selectedObject.dataset.size||68)-10,true);$('growObject').onclick=()=>setObjectSize((+selectedObject.dataset.size||68)+10,true);$('duplicateObject').onclick=duplicateSelected;$('deleteObject').onclick=deleteSelected;$('bringFrontObject').onclick=()=>layerSelected(true);$('sendBackObject').onclick=()=>layerSelected(false);
$('testCreation').onclick=startTest;$('stopCreationTest').onclick=()=>stopTest(true);$('saveIdea').onclick=save;$('clearIdea').onclick=openClearDialog;$('keepProject').onclick=closeClearDialog;$('confirmClearProject').onclick=clearProjectNow;$('creatorClearDialog').addEventListener('click',e=>{if(e.target===$('creatorClearDialog'))closeClearDialog()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(testRunning)stopTest(true);else if(!$('creatorClearDialog').hidden)closeClearDialog()}});
$('closeCreatorWorkspace').onclick=()=>{stopTest(false);$('creatorWorkspace').hidden=true;document.querySelector('.creator-grid').scrollIntoView({behavior:'smooth',block:'start'})};
document.querySelectorAll('[data-vehicle-view]').forEach(b=>b.onclick=()=>setVehicleView(b.dataset.vehicleView));
$('vehicleResetOrbit').onclick=()=>{vehicleYaw=0;vehiclePitch=.04;vehicleViewMode='left';renderTemplate('vehicle');updateVehicleViewUI();commitHistory()};
renderColours();setTool('select');updateHistoryButtons();updateVehicleViewUI();updateBlueprintVisibility();
})();
