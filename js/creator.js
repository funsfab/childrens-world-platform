(()=>{
'use strict';
const lang=()=>window.CWLang?.current?.()||'en';
const t=(en,fr)=>lang()==='fr'?fr:en;
const L=(pair)=>pair?.[lang()==='fr'?1:0]||pair?.[0]||'';
const part=(id,icon,en,fr,tags=[],className='')=>({id,icon,label:[en,fr],tags,className});
const mode=(id,icon,en,fr,helpEn,helpFr,parts)=>({id,icon,label:[en,fr],help:[helpEn,helpFr],parts});
const missions={
 vehicle:{
  title:['Future Vehicle','Véhicule du futur'],
  prompt:['Design transport for 2050. Sketch the body, choose systems, then drive and test the finished vehicle.','Conçois un transport pour 2050. Dessine la carrosserie, choisis les systèmes puis conduis et teste le véhicule terminé.'],
  prompts:[['Who is it for?','Pour qui est-il ?'],['What problem does it solve?','Quel problème résout-il ?']],
  coach:['Can your passengers enter safely, and what happens if the main power source fails?','Les passagers peuvent-ils entrer en sécurité, et que se passe-t-il si la source d’énergie principale tombe en panne ?'],
  test:'Vehicle test complete. Check movement, power, safety and passenger access.',
  animation:'drive',
  checks:[['movement','Movement'],['power','Power'],['safety','Safety'],['passenger','Passenger design']],
  modes:[
   mode('body','🚘','Body & movement','Carrosserie et mouvement','Build the form and how it moves.','Construis la forme et son mode de déplacement.',[
    part('wheel','🛞','Wheel','Roue',['movement']),part('track','⚙️','Track / drive','Chenille / propulsion',['movement']),part('wing','🪽','Wing','Aile',['movement']),part('seat','💺','Passenger seat','Siège passager',['passenger'])]),
   mode('power','⚡','Power systems','Systèmes d’énergie','Choose how the vehicle gets its energy.','Choisis comment le véhicule reçoit son énergie.',[
    part('battery','🔋','Battery','Batterie',['power']),part('solar','☀️','Solar panel','Panneau solaire',['power']),part('hydrogen','💧','Hydrogen cell','Pile à hydrogène',['power'])]),
   mode('safety','🛡️','Safety','Sécurité','Add systems that protect people.','Ajoute des systèmes qui protègent les personnes.',[
    part('sensor','📡','Collision sensor','Capteur anticollision',['safety']),part('light','💡','Safety light','Feu de sécurité',['safety']),part('belt','🔒','Safety restraint','Retenue de sécurité',['safety'])]),
   mode('future','✨','Future tech','Technologies futures','Add useful technology without making it unsafe.','Ajoute une technologie utile sans compromettre la sécurité.',[
    part('ai','🧠','AI control','Commande IA',['safety']),part('camera','📷','Camera','Caméra',['safety']),part('nav','🧭','Smart navigation','Navigation intelligente',['movement'])])
  ]
 },
 room:{
  title:['Dream Room','Chambre de rêve'],
  prompt:['Plan a room, draw the layout, furnish it, style it and test whether people can use it comfortably.','Planifie une pièce, dessine l’agencement, meuble-la, décore-la puis teste si elle est confortable à utiliser.'],
  prompts:[['Main purpose','Fonction principale'],['Who uses it?','Qui l’utilise ?']],
  coach:['Can someone move around the room comfortably, reach storage and use the lighting where it is needed?','Peut-on circuler confortablement, atteindre les rangements et utiliser l’éclairage là où il est nécessaire ?'],
  test:'Room test complete. Check circulation, storage, lighting and purpose.',
  animation:'walk',
  checks:[['structure','Layout'],['furniture','Furniture'],['light','Lighting'],['storage','Storage']],
  modes:[
   mode('structure','📐','Structure','Structure','Plan walls, doors and windows first.','Planifie d’abord murs, portes et fenêtres.',[
    part('door','🚪','Door','Porte',['structure']),part('window','🪟','Window','Fenêtre',['structure']),part('divider','▰','Room divider','Cloison',['structure'])]),
   mode('furniture','🛋️','Furniture','Mobilier','Choose furniture for the purpose of the room.','Choisis le mobilier adapté à la fonction de la pièce.',[
    part('bed','🛏️','Bed','Lit',['furniture']),part('desk','🖥️','Desk','Bureau',['furniture']),part('chair','🪑','Chair','Chaise',['furniture']),part('sofa','🛋️','Sofa','Canapé',['furniture'])]),
   mode('lighting','💡','Lighting','Éclairage','Add useful natural and artificial light.','Ajoute une lumière naturelle et artificielle utile.',[
    part('lamp','💡','Lamp','Lampe',['light']),part('window-light','🌤️','Natural light','Lumière naturelle',['light'])]),
   mode('storage','🧰','Storage & organisation','Rangement et organisation','Make the room practical, not only pretty.','Rends la pièce pratique, pas seulement jolie.',[
    part('shelf','📚','Shelving','Étagères',['storage']),part('wardrobe','🚪','Wardrobe','Armoire',['storage']),part('box','📦','Storage box','Boîte de rangement',['storage'])])
  ]
 },
 park:{
  title:['Design a Park','Concevoir un parc'],
  prompt:['Design a real community park. Choose activity zones first, then draw paths, place facilities and simulate how visitors use it.','Conçois un vrai parc de quartier. Choisis d’abord les zones d’activité, puis dessine les chemins, place les équipements et simule l’utilisation par les visiteurs.'],
  prompts:[['Who will use it?','Qui l’utilisera ?'],['What should visitors feel?','Que doivent ressentir les visiteurs ?']],
  coach:['Can children, older visitors and wheelchair users reach the important areas safely without dangerous crossings?','Les enfants, les visiteurs âgés et les personnes en fauteuil roulant peuvent-ils atteindre les zones importantes en sécurité ?'],
  test:'Park visitor simulation complete. Check access, activities, nature, seating and facilities.',
  animation:'visitors',
  checks:[['play','Play'],['nature','Nature'],['access','Accessibility'],['seating','Seating']],
  modes:[
   mode('play','🛝','Play area','Aire de jeux','Choose different play activities, not one generic playground object.','Choisis différentes activités de jeu, pas un seul objet générique.',[
    part('slide','🛝','Slide','Toboggan',['play']),part('swing','🎠','Swings','Balançoires',['play']),part('climb','🧗','Climbing frame','Structure d’escalade',['play']),part('seesaw','↕️','Seesaw','Bascule',['play']),part('roundabout','🔄','Roundabout','Tourniquet',['play']),part('sand','🏖️','Sand play','Bac à sable',['play'])]),
   mode('nature','🌿','Trees & nature','Arbres et nature','Shape the landscape with shade, planting and water.','Aménage le paysage avec ombre, plantations et eau.',[
    part('tree','🌳','Shade tree','Arbre d’ombrage',['nature']),part('pine','🌲','Evergreen tree','Conifère',['nature']),part('flowers','🌼','Flower bed','Parterre de fleurs',['nature']),part('pond','💧','Pond','Bassin',['nature']),part('garden','🌿','Community garden','Jardin partagé',['nature'])]),
   mode('sports','⚽','Sports & movement','Sports et mouvement','Add active spaces for different interests.','Ajoute des espaces actifs pour différents centres d’intérêt.',[
    part('football','🥅','Football goal','But de football',['play']),part('basketball','🏀','Basketball court','Terrain de basket',['play']),part('tennis','🎾','Tennis area','Zone de tennis',['play']),part('running','🏃','Running loop','Boucle de course',['play']),part('cycle','🚲','Cycle route','Piste cyclable',['play'])]),
   mode('access','♿','Accessible paths','Chemins accessibles','Make routes usable by everyone.','Rends les parcours utilisables par tous.',[
    part('wide-path','🛤️','Wide path','Chemin large',['access']),part('ramp','♿','Ramp','Rampe',['access']),part('crossing','🚸','Safe crossing','Passage sécurisé',['access']),part('accessible-seat','🪑','Accessible seating','Assise accessible',['access','seating'])]),
   mode('facilities','🏞️','Facilities','Équipements','Add the practical things a real park needs.','Ajoute les éléments pratiques dont un vrai parc a besoin.',[
    part('park-bench','', 'Long park bench','Long banc de parc',['seating'],'park-bench'),part('picnic','🧺','Picnic table','Table de pique-nique',['seating']),part('toilet','🚻','Toilets','Toilettes',['facility']),part('bin','🗑️','Bin','Poubelle',['facility']),part('light','💡','Park light','Éclairage du parc',['facility']),part('water','🚰','Drinking water','Eau potable',['facility'])])
  ]
 },
 robot:{
  title:['Invent a Robot','Inventer un robot'],
  prompt:['Draw the body, add movement, sensors and tools, then make the robot move through a test.','Dessine le corps, ajoute mouvement, capteurs et outils, puis fais bouger le robot pendant un test.'],
  prompts:[['Robot job','Rôle du robot'],['Safety rule','Règle de sécurité']],
  coach:['How will the robot detect a person, a wall or danger before it moves?','Comment le robot détectera-t-il une personne, un mur ou un danger avant de bouger ?'],
  test:'Robot test complete. Check movement, sensing, useful tools and safety.',
  animation:'drive',
  checks:[['movement','Movement'],['sensor','Sensors'],['tool','Useful tool'],['safety','Safety']],
  modes:[
   mode('body','🤖','Body & movement','Corps et mouvement','Build how the robot stands and moves.','Construis la manière dont le robot se tient et se déplace.',[
    part('wheel','🛞','Wheel','Roue',['movement']),part('leg','🦿','Leg','Jambe',['movement']),part('arm','🦾','Arm','Bras',['tool']),part('gripper','🤏','Gripper','Pince',['tool'])]),
   mode('sensors','👁️','Sensors','Capteurs','Give the robot information about the world.','Donne au robot des informations sur son environnement.',[
    part('camera','📷','Camera','Caméra',['sensor']),part('distance','📡','Distance sensor','Capteur de distance',['sensor']),part('sound','🎙️','Sound sensor','Capteur sonore',['sensor'])]),
   mode('tools','🧰','Tools','Outils','Add the equipment needed for its job.','Ajoute l’équipement nécessaire à sa mission.',[
    part('light','🔦','Work light','Lampe de travail',['tool']),part('medical','🩹','Medical kit','Kit médical',['tool']),part('carrier','📦','Carrier','Porte-charge',['tool'])]),
   mode('safety','🛑','Safety','Sécurité','Plan how the robot stops and protects people.','Prévois comment le robot s’arrête et protège les personnes.',[
    part('stop','🛑','Emergency stop','Arrêt d’urgence',['safety']),part('bumper','🛡️','Soft bumper','Pare-chocs souple',['safety']),part('warning','🚨','Warning signal','Signal d’alerte',['safety'])])
  ]
 },
 story:{
  title:['Story Builder','Créateur d’histoires'],
  prompt:['Build a visual story with characters, settings, speech and events, then play through the panels.','Construis une histoire visuelle avec personnages, décors, dialogues et événements, puis lis les cases comme une séquence.'],
  prompts:[['Main character','Personnage principal'],['Big problem','Grand problème']],
  coach:['Does something clearly change between the first scene and the last scene?','Quelque chose change-t-il clairement entre la première et la dernière scène ?'],
  test:'Story preview complete. Check beginning, problem, change and ending.',
  animation:'story',
  checks:[['character','Character'],['place','Setting'],['speech','Dialogue'],['event','Event']],
  modes:[
   mode('characters','🙂','Characters','Personnages','Create who the story is about.','Crée les personnages de l’histoire.',[
    part('character','🙂','Character','Personnage',['character']),part('friend','🧒','Friend','Ami',['character']),part('reaction','😮','Reaction','Réaction',['character'])]),
   mode('speech','💬','Speech & thoughts','Dialogues et pensées','Show what characters say and think.','Montre ce que les personnages disent et pensent.',[
    part('speech','💬','Speech bubble','Bulle de dialogue',['speech']),part('thought','☁️','Thought bubble','Bulle de pensée',['speech'])]),
   mode('places','🏙️','Places','Lieux','Build the setting for each scene.','Construis le décor de chaque scène.',[
    part('home','🏠','Home','Maison',['place']),part('school','🏫','School','École',['place']),part('city','🏙️','City','Ville',['place']),part('nature','🌳','Outdoor place','Extérieur',['place'])]),
   mode('events','⭐','Events & props','Événements et accessoires','Add the objects and turning points that change the story.','Ajoute les objets et tournants qui font évoluer l’histoire.',[
    part('event','⭐','Turning point','Tournant',['event']),part('phone','📱','Phone','Téléphone',['event']),part('letter','✉️','Message','Message',['event']),part('clue','🔎','Clue','Indice',['event'])])
  ]
 },
 mars:{
  title:['Mars Base','Base martienne'],
  prompt:['Build a connected Mars base with habitats, power and life-support systems, then run a survival simulation.','Construis une base martienne reliée avec habitats, énergie et systèmes de survie, puis lance une simulation de survie.'],
  prompts:[['Crew size','Taille de l’équipage'],['Biggest danger','Plus grand danger']],
  coach:['If one life-support system fails, what keeps the crew alive long enough to repair it?','Si un système de survie tombe en panne, qu’est-ce qui garde l’équipage en vie assez longtemps pour le réparer ?'],
  test:'Mars survival simulation complete. Check shelter, power, water, oxygen and emergency backup.',
  animation:'systems',
  checks:[['habitat','Habitat'],['power','Power'],['life','Life support'],['backup','Emergency backup']],
  modes:[
   mode('habitat','🏠','Habitats','Habitats','Build safe living and work modules.','Construis des modules de vie et de travail sûrs.',[
    part('habitat','🛖','Habitat module','Module d’habitation',['habitat']),part('lab','🔬','Science lab','Laboratoire',['habitat']),part('airlock','🚪','Airlock','Sas',['habitat'])]),
   mode('power','⚡','Power','Énergie','Keep the base running day and night.','Maintiens la base en fonctionnement jour et nuit.',[
    part('solar','☀️','Solar array','Panneaux solaires',['power']),part('battery','🔋','Battery bank','Batteries',['power']),part('reactor','⚛️','Backup generator','Générateur de secours',['power','backup'])]),
   mode('life','💧','Life support','Systèmes de survie','Provide air, water and food.','Fournis air, eau et nourriture.',[
    part('water','💧','Water recycler','Recycleur d’eau',['life']),part('oxygen','🫧','Oxygen system','Système d’oxygène',['life']),part('greenhouse','🌱','Greenhouse','Serre',['life'])]),
   mode('safety','🚨','Safety & communications','Sécurité et communications','Prepare for failures and contact home.','Prépare les pannes et les communications.',[
    part('comms','📡','Communications','Communications',['backup']),part('medical','🩺','Medical bay','Infirmerie',['backup']),part('shelter','🛡️','Radiation shelter','Abri anti-radiations',['backup'])])
  ]
 }
};
const KEY='cw_creator_projects_v3';
const $=id=>document.getElementById(id);
const canvas=$('creatorCanvas'),ctx=canvas.getContext('2d'),template=$('creatorTemplate'),tctx=template.getContext('2d'),stage=$('creatorDesignStage'),objectLayer=$('creatorObjects'),simulation=$('creatorSimulation');
const colours=['#5de4ff','#ff77b7','#ffd45b','#5ee3a4','#ffffff','#ff647c','#9b6dff','#ff9d5d','#17243a'];
let active=null,activeMode=null,tool='pen',colour='#5de4ff',templateOn=true,gridOn=false,selectedObject=null,drawStrokes=0;
let history=[],historyIndex=-1,restoring=false,drawing=false,last=null,start=null,shapeBase=null,motionX=0;
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
function loadAll(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(_){return {}}}
function saveAll(v){localStorage.setItem(KEY,JSON.stringify(v))}
function allParts(m){return m.modes.flatMap(x=>x.parts)}
function findPart(id){return allParts(missions[active]||{modes:[]}).find(p=>p.id===id)}
function setTool(name){tool=name;['Pen','Eraser','Line','Rect','Circle'].forEach(n=>$('tool'+n)?.classList.toggle('active',name===n.toLowerCase()));canvas.style.cursor=name==='eraser'?'cell':'crosshair'}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}}
function renderTemplate(id){tctx.clearRect(0,0,template.width,template.height);if(!templateOn)return;tctx.save();tctx.strokeStyle='rgba(137,224,255,.38)';tctx.fillStyle='rgba(137,224,255,.055)';tctx.lineWidth=6;tctx.setLineDash([13,10]);
 const box=(x,y,w,h,r=22)=>{tctx.beginPath();if(tctx.roundRect)tctx.roundRect(x,y,w,h,r);else tctx.rect(x,y,w,h);tctx.fill();tctx.stroke()};
 const circle=(x,y,r)=>{tctx.beginPath();tctx.arc(x,y,r,0,Math.PI*2);tctx.fill();tctx.stroke()};
 if(id==='robot'){box(315,90,170,105,24);box(270,205,260,145,26);circle(365,140,11);circle(435,140,11);tctx.beginPath();tctx.moveTo(270,235);tctx.lineTo(205,285);tctx.moveTo(530,235);tctx.lineTo(595,285);tctx.moveTo(335,350);tctx.lineTo(320,420);tctx.moveTo(465,350);tctx.lineTo(480,420);tctx.stroke()}
 if(id==='vehicle'){box(170,190,455,120,42);tctx.beginPath();tctx.moveTo(260,190);tctx.lineTo(340,115);tctx.lineTo(500,115);tctx.lineTo(570,190);tctx.stroke();circle(275,325,45);circle(525,325,45)}
 if(id==='room'){box(110,70,580,320,8);box(160,235,210,105,12);box(470,210,140,95,12);box(470,105,120,75,8);tctx.beginPath();tctx.moveTo(400,70);tctx.lineTo(400,390);tctx.stroke()}
 if(id==='park'){tctx.beginPath();tctx.moveTo(70,355);tctx.bezierCurveTo(240,210,420,395,730,120);tctx.stroke();circle(165,140,55);circle(635,310,62);box(315,90,180,115,24)}
 if(id==='story'){box(45,55,220,335,12);box(290,55,220,335,12);box(535,55,220,335,12);circle(155,165,40);circle(400,165,40);circle(645,165,40)}
 if(id==='mars'){circle(250,250,115);circle(535,240,95);box(330,235,120,55,16);tctx.beginPath();tctx.moveTo(165,355);tctx.lineTo(635,355);tctx.moveTo(250,135);tctx.lineTo(250,70);tctx.moveTo(535,145);tctx.lineTo(600,80);tctx.stroke()}
 tctx.restore()}
function renderColours(){const box=$('creatorColors');box.innerHTML=colours.map((c,i)=>`<button type="button" class="creator-color${c===colour?' active':''}" data-colour="${c}" style="background:${c}" aria-label="Colour ${i+1}"></button>`).join('');box.querySelectorAll('[data-colour]').forEach(b=>b.onclick=()=>{colour=b.dataset.colour;box.querySelectorAll('.creator-color').forEach(x=>x.classList.toggle('active',x===b));setTool('pen')})}
function renderObjectVisual(o,partDef){o.innerHTML='';if(partDef?.className==='park-bench'){const v=document.createElement('span');v.className='creator-bench-visual';v.innerHTML='<i></i><i></i><i></i><i></i>';o.appendChild(v)}else{const v=document.createElement('span');v.className='creator-object-icon';v.textContent=partDef?.icon||o.dataset.icon||'✦';o.appendChild(v)}const s=document.createElement('small');s.textContent=L(partDef?.label)||o.dataset.label||'';o.appendChild(s)}
function applyObjectStyle(o){const size=+o.dataset.size||68,rot=+o.dataset.rotation||0;o.style.left=(+o.dataset.x*100)+'%';o.style.top=(+o.dataset.y*100)+'%';if(o.classList.contains('park-bench')){o.style.width=(size*1.65)+'px';o.style.height=(size*.82)+'px'}else{o.style.width=size+'px';o.style.height=size+'px'}o.style.setProperty('--object-rotation',rot+'deg');o.querySelector('.creator-object-icon')?.style.setProperty('font-size',(size*.45)+'px')}
function addObject(partDef,x=.5,y=.5,size=68,rotation=0,{commit=true,select=true}={}){if(!partDef)return;const o=document.createElement('div');o.className='creator-object'+(partDef.className?' '+partDef.className:'');o.dataset.partId=partDef.id;o.dataset.icon=partDef.icon||'';o.dataset.label=L(partDef.label);o.dataset.x=x;o.dataset.y=y;o.dataset.size=size;o.dataset.rotation=rotation;renderObjectVisual(o,partDef);applyObjectStyle(o);objectLayer.appendChild(o);bindObject(o);if(select)selectObject(o);if(commit)commitHistory();return o}
function bindObject(o){let draggingObj=false,moved=false,startX=0,startY=0;const move=e=>{if(!draggingObj)return;const r=stage.getBoundingClientRect();const x=Math.max(.03,Math.min(.97,(e.clientX-r.left)/r.width));const y=Math.max(.04,Math.min(.96,(e.clientY-r.top)/r.height));if(Math.abs(x-startX)>.002||Math.abs(y-startY)>.002)moved=true;o.dataset.x=x;o.dataset.y=y;applyObjectStyle(o)};o.addEventListener('pointerdown',e=>{e.stopPropagation();resetMotion();draggingObj=true;moved=false;startX=+o.dataset.x;startY=+o.dataset.y;o.setPointerCapture(e.pointerId);o.classList.add('dragging');selectObject(o)});o.addEventListener('pointermove',move);const end=()=>{if(!draggingObj)return;draggingObj=false;o.classList.remove('dragging');if(moved)commitHistory()};o.addEventListener('pointerup',end);o.addEventListener('pointercancel',end);o.addEventListener('click',e=>{e.stopPropagation();selectObject(o)})}
function selectObject(o){selectedObject=o;objectLayer.querySelectorAll('.creator-object').forEach(x=>x.classList.toggle('selected',x===o));const enabled=!!o;['objectSize','objectRotate','duplicateObject','sendBackObject','bringFrontObject','deleteObject'].forEach(id=>{$(id).disabled=!enabled});if(enabled){$('objectSize').value=o.dataset.size;$('objectRotate').value=o.dataset.rotation;$('selectedObjectLabel').textContent=o.dataset.label||t('Selected part','Élément sélectionné')}else{$('selectedObjectLabel').textContent=t('Select a movable part to edit it','Sélectionne un élément déplaçable pour le modifier')}}
stage.addEventListener('click',e=>{if(e.target===canvas||e.target===template||e.target===stage)selectObject(null)});
function objectData(){return [...objectLayer.children].map(o=>({partId:o.dataset.partId,icon:o.dataset.icon,label:o.dataset.label,x:+o.dataset.x,y:+o.dataset.y,size:+o.dataset.size,rotation:+o.dataset.rotation}))}
function restoreObjects(list){objectLayer.innerHTML='';(list||[]).forEach(d=>{const p=findPart(d.partId)||part(d.partId||('legacy-'+Math.random()),d.icon||d.emoji||'✦',d.label||'Part',d.label||'Élément');addObject(p,d.x,d.y,d.size||68,d.rotation||0,{commit:false,select:false})});selectObject(null)}
function snapshot(){return{drawing:ctx.getImageData(0,0,canvas.width,canvas.height),objects:JSON.parse(JSON.stringify(objectData())),templateOn,gridOn}}
function commitHistory(){if(restoring||!active)return;history=history.slice(0,historyIndex+1);history.push(snapshot());if(history.length>28)history.shift();historyIndex=history.length-1;updateHistoryButtons()}
function resetHistory(){history=[];historyIndex=-1;commitHistory()}
function updateHistoryButtons(){$('undoDraw').disabled=historyIndex<=0;$('redoDraw').disabled=historyIndex<0||historyIndex>=history.length-1}
function restoreSnapshot(s){if(!s)return;restoring=true;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.putImageData(s.drawing,0,0);templateOn=s.templateOn!==false;gridOn=!!s.gridOn;renderTemplate(active);stage.classList.toggle('show-grid',gridOn);$('toggleTemplate').textContent=templateOn?t('👻 Blueprint on','👻 Modèle activé'):t('👻 Blueprint off','👻 Modèle désactivé');$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');restoreObjects(s.objects);restoring=false;updateHistoryButtons()}
function restoreDrawing(data,done){ctx.clearRect(0,0,canvas.width,canvas.height);if(!data){done?.();return}const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);done?.()};img.onerror=()=>done?.();img.src=data}
function renderModes(m,savedMode){const host=$('creatorModes');const requested=savedMode&&m.modes.some(x=>x.id===savedMode)?savedMode:m.modes[0].id;activeMode=requested;host.innerHTML=m.modes.map(x=>`<button type="button" class="creator-mode${x.id===activeMode?' active':''}" data-mode="${x.id}"><span>${x.icon}</span><b>${L(x.label)}</b><small>${L(x.help)}</small></button>`).join('');host.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{activeMode=b.dataset.mode;host.querySelectorAll('.creator-mode').forEach(x=>x.classList.toggle('active',x===b));renderParts();$('creatorModeHelp').textContent=L(m.modes.find(x=>x.id===activeMode).help)});$('creatorModeHelp').textContent=L(m.modes.find(x=>x.id===activeMode).help);renderParts()}
function renderParts(){const m=missions[active],md=m?.modes.find(x=>x.id===activeMode);if(!md)return;const host=$('creatorComponents');host.innerHTML=`<div class="creator-palette-title"><b>${t('Parts for','Éléments pour')} ${L(md.label)}</b><small>${t('Tap a part, then move and resize it on your design.','Touche un élément, puis déplace-le et redimensionne-le sur ton design.')}</small></div>`+md.parts.map(p=>`<button type="button" class="creator-component" data-part="${p.id}">${p.className==='park-bench'?'<span class="creator-mini-bench"><i></i><i></i><i></i></span>':`<span>${p.icon}</span>`}<small>${L(p.label)}</small></button>`).join('');host.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>addObject(md.parts.find(p=>p.id===b.dataset.part),.5,.5,68,0,{commit:true,select:true}))}
function drawShapePreview(p){if(!shapeBase)return;ctx.putImageData(shapeBase,0,0);ctx.globalCompositeOperation='source-over';ctx.strokeStyle=colour;ctx.lineWidth=+$('brushSize').value;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(tool==='line'){ctx.moveTo(start.x,start.y);ctx.lineTo(p.x,p.y)}else if(tool==='rect'){ctx.rect(start.x,start.y,p.x-start.x,p.y-start.y)}else if(tool==='circle'){const rx=(p.x-start.x)/2,ry=(p.y-start.y)/2,cx=start.x+rx,cy=start.y+ry;ctx.ellipse(cx,cy,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2)}ctx.stroke()}
canvas.addEventListener('pointerdown',e=>{if(!active)return;resetMotion();drawing=true;canvas.setPointerCapture(e.pointerId);start=last=point(e);shapeBase=ctx.getImageData(0,0,canvas.width,canvas.height)});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=point(e);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=+$('brushSize').value;if(tool==='pen'||tool==='eraser'){ctx.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';ctx.strokeStyle=colour;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p}else drawShapePreview(p)});
function endDraw(e){if(!drawing)return;const p=e?.clientX!=null?point(e):last;if(['line','rect','circle'].includes(tool))drawShapePreview(p);drawing=false;shapeBase=null;ctx.globalCompositeOperation='source-over';drawStrokes++;commitHistory()}
canvas.addEventListener('pointerup',endDraw);canvas.addEventListener('pointercancel',endDraw);
function renderPlan(m,saved){$('creatorPlanFields').innerHTML=m.prompts.map((pair,i)=>`<label>${L(pair)}<input data-plan="${i}" value="${esc(saved.plan?.[i])}" placeholder="${t('Optional answer','Réponse facultative')}"></label>`).join('');$('creatorNotes').value=saved.notes||''}
function resetMotion(){motionX=0;stage.style.setProperty('--creation-shift','0px');stage.classList.remove('creation-moving')}
function openMission(id){const m=missions[id];if(!m)return;active=id;drawStrokes=0;selectedObject=null;resetMotion();simulation.innerHTML='';$('creatorLiveControls').hidden=true;$('creatorTestResult').innerHTML='';$('creatorTitle').textContent=L(m.title);$('creatorPrompt').textContent=L(m.prompt);$('creatorSteps').innerHTML=[t('Choose a design mode and load the right parts','Choisis un mode de conception et charge les bons éléments'),t('Draw, colour, arrange, resize and rotate parts','Dessine, colorie, organise, redimensionne et tourne les éléments'),t('Test the creation and study the Design Coach feedback','Teste la création et étudie les conseils du coach'),t('Improve it, test again, then save the project','Améliore, reteste puis enregistre le projet')].map((x,i)=>`<li><span>${i+1}</span>${x}</li>`).join('');
 const saved=loadAll()[id]||{};templateOn=saved.templateOn!==false;gridOn=!!saved.gridOn;renderTemplate(id);stage.classList.toggle('show-grid',gridOn);$('toggleTemplate').textContent=templateOn?t('👻 Blueprint on','👻 Modèle activé'):t('👻 Blueprint off','👻 Modèle désactivé');$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');renderColours();renderModes(m,saved.activeMode);renderPlan(m,saved);$('creatorCoach').textContent=L(m.coach);$('creatorSaved').textContent=saved.updatedAt?t('Saved project restored. Keep creating.','Projet enregistré restauré. Continue à créer.'):'';$('creatorWorkspace').hidden=false;restoreDrawing(saved.drawing,()=>{restoreObjects(saved.objects);drawStrokes=saved.drawing?3:0;resetHistory();$('creatorWorkspace').scrollIntoView({behavior:'smooth',block:'start'})})}
function save(){if(!active)return;const all=loadAll();const plan=[...document.querySelectorAll('#creatorPlanFields [data-plan]')].map(i=>i.value.trim());all[active]={plan,notes:$('creatorNotes').value.trim(),drawing:canvas.toDataURL('image/png'),objects:objectData(),templateOn,gridOn,activeMode,updatedAt:Date.now()};try{saveAll(all);$('creatorSaved').textContent=t('✅ Project saved. You can return and continue later.','✅ Projet enregistré. Tu peux revenir et continuer plus tard.')}catch(_){$('creatorSaved').textContent=t('This design is too large to save on this device. Remove some detail and try again.','Ce design est trop volumineux pour être enregistré sur cet appareil. Retire quelques détails et réessaie.')}if(window.CWState){CWState.setProgress('creator',Math.min(95,Object.keys(all).length*16),{lastMission:active});CWState.logActivity({id:'creator-'+active,title:`Creator Studio: ${missions[active].title[0]}`,icon:'🎨',detail:'Saved interactive design',href:'creator.html'})}}
function clearProjectNow(){if(!active)return;ctx.clearRect(0,0,canvas.width,canvas.height);objectLayer.innerHTML='';simulation.innerHTML='';drawStrokes=0;selectObject(null);resetMotion();const all=loadAll();delete all[active];saveAll(all);$('creatorNotes').value='';document.querySelectorAll('#creatorPlanFields input').forEach(i=>i.value='');$('creatorSaved').textContent=t('Project cleared. Start a new design.','Projet effacé. Commence un nouveau design.');$('creatorTestResult').innerHTML='';$('creatorLiveControls').hidden=true;resetHistory();closeClearDialog()}
function openClearDialog(){$('creatorClearDialog').hidden=false;document.body.classList.add('creator-dialog-open');setTimeout(()=>$('keepProject').focus(),0)}
function closeClearDialog(){$('creatorClearDialog').hidden=true;document.body.classList.remove('creator-dialog-open')}
function testTags(){const set=new Set();objectData().forEach(o=>{const p=findPart(o.partId);(p?.tags||[]).forEach(tag=>set.add(tag))});return set}
function showSimulation(m){simulation.innerHTML='';simulation.className='creator-simulation active sim-'+m.animation;if(m.animation==='visitors'||m.animation==='walk'){simulation.innerHTML='<span>🚶</span><span>🧑‍🦽</span><span>🧒</span>'}else if(m.animation==='systems'){simulation.innerHTML='<i></i><i></i><i></i><i></i>'}else if(m.animation==='story'){simulation.innerHTML='<b>1</b><b>2</b><b>3</b>'}else if(m.animation==='drive'){simulation.innerHTML='<span class="creator-motion-sprite">'+(active==='robot'?'🤖':'🚗')+'</span>'}}
function renderLiveControls(m){const host=$('creatorLiveControls');host.hidden=false;if(m.animation==='drive'){host.innerHTML=`<b>${t('Test movement:','Teste le mouvement :')}</b><button type="button" data-move="left">← ${t('Move left','Vers la gauche')}</button><button type="button" data-move="centre">${t('Centre','Centrer')}</button><button type="button" data-move="right">${t('Move right','Vers la droite')} →</button>`;host.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const dir=b.dataset.move;motionX=dir==='left'?-Math.min(120,stage.clientWidth*.18):dir==='right'?Math.min(120,stage.clientWidth*.18):0;stage.style.setProperty('--creation-shift',motionX+'px');stage.classList.add('creation-moving')})}else{host.innerHTML=`<b>${t('Simulation is running on your finished design.','La simulation fonctionne sur ton design terminé.')}</b><button type="button" id="runAgain">↻ ${t('Run again','Relancer')}</button>`;$('runAgain').onclick=()=>showSimulation(m)}}
function testCreation(){if(!active)return;const m=missions[active],objectCount=objectLayer.children.length,enough=drawStrokes>=2||objectCount>=3;if(!enough){$('creatorTestResult').innerHTML=`<div class="creator-report warning"><b>${t('Needs more design work','Il faut encore travailler le design')}</b><p>${t('Add more drawing or at least three movable parts before the simulation can give useful feedback.','Ajoute davantage de dessin ou au moins trois éléments déplaçables avant que la simulation puisse donner un retour utile.')}</p></div>`;$('creatorCoach').textContent=t('Build more of your idea first. A good test needs something meaningful to test.','Construis davantage ton idée. Un bon test a besoin de quelque chose de concret à tester.');return}
 const tags=testTags();const checks=m.checks.map(([tag,label])=>({label,ok:tags.has(tag)}));let score=checks.filter(x=>x.ok).length*20+Math.min(20,drawStrokes*4);score=Math.min(100,score);const missing=checks.filter(x=>!x.ok);showSimulation(m);renderLiveControls(m);stage.classList.remove('testing');void stage.offsetWidth;stage.classList.add('testing');$('creatorTestResult').innerHTML=`<div class="creator-report"><div class="creator-score-ring"><b>${score}</b><small>/100</small></div><div><b>${t('Design test report','Rapport de test du design')}</b><ul>${checks.map(c=>`<li class="${c.ok?'pass':'miss'}">${c.ok?'✓':'○'} ${c.label}</li>`).join('')}</ul></div></div>`;$('creatorCoach').textContent=missing.length?t(`Your next improvement: add or strengthen ${missing[0].label.toLowerCase()}.`,`Prochaine amélioration : ajoute ou renforce ${missing[0].label.toLowerCase()}.`):L(m.coach);window.playTone?.(true)}
function setObjectSize(v){if(!selectedObject)return;selectedObject.dataset.size=v;applyObjectStyle(selectedObject)}
function setObjectRotation(v){if(!selectedObject)return;selectedObject.dataset.rotation=v;applyObjectStyle(selectedObject)}
function duplicateSelected(){if(!selectedObject)return;const p=findPart(selectedObject.dataset.partId)||part(selectedObject.dataset.partId,selectedObject.dataset.icon,selectedObject.dataset.label,selectedObject.dataset.label);addObject(p,Math.min(.92,+selectedObject.dataset.x+.05),Math.min(.92,+selectedObject.dataset.y+.05),+selectedObject.dataset.size,+selectedObject.dataset.rotation,{commit:true,select:true})}
function deleteSelected(){if(!selectedObject)return;selectedObject.remove();selectedObject=null;selectObject(null);commitHistory()}
function layerSelected(front){if(!selectedObject)return;front?objectLayer.appendChild(selectedObject):objectLayer.insertBefore(selectedObject,objectLayer.firstChild);commitHistory()}
document.querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>openMission(b.dataset.mission));
$('toolPen').onclick=()=>setTool('pen');$('toolEraser').onclick=()=>setTool('eraser');$('toolLine').onclick=()=>setTool('line');$('toolRect').onclick=()=>setTool('rect');$('toolCircle').onclick=()=>setTool('circle');
$('toggleTemplate').onclick=()=>{templateOn=!templateOn;renderTemplate(active);$('toggleTemplate').textContent=templateOn?t('👻 Blueprint on','👻 Modèle activé'):t('👻 Blueprint off','👻 Modèle désactivé');commitHistory()};
$('toggleGrid').onclick=()=>{gridOn=!gridOn;stage.classList.toggle('show-grid',gridOn);$('toggleGrid').textContent=gridOn?t('# Grid on','# Grille activée'):t('# Grid off','# Grille désactivée');commitHistory()};
$('undoDraw').onclick=()=>{if(historyIndex<=0)return;historyIndex--;restoreSnapshot(history[historyIndex])};$('redoDraw').onclick=()=>{if(historyIndex>=history.length-1)return;historyIndex++;restoreSnapshot(history[historyIndex])};
$('objectSize').addEventListener('input',e=>setObjectSize(+e.target.value));$('objectSize').addEventListener('change',()=>commitHistory());$('objectRotate').addEventListener('input',e=>setObjectRotation(+e.target.value));$('objectRotate').addEventListener('change',()=>commitHistory());
$('duplicateObject').onclick=duplicateSelected;$('deleteObject').onclick=deleteSelected;$('bringFrontObject').onclick=()=>layerSelected(true);$('sendBackObject').onclick=()=>layerSelected(false);
$('testCreation').onclick=testCreation;$('saveIdea').onclick=save;$('clearIdea').onclick=openClearDialog;$('keepProject').onclick=closeClearDialog;$('confirmClearProject').onclick=clearProjectNow;$('creatorClearDialog').addEventListener('click',e=>{if(e.target===$('creatorClearDialog'))closeClearDialog()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('creatorClearDialog').hidden)closeClearDialog()});
$('closeCreatorWorkspace').onclick=()=>{$('creatorWorkspace').hidden=true;document.querySelector('.creator-grid').scrollIntoView({behavior:'smooth',block:'start'})};
renderColours();setTool('pen');updateHistoryButtons();
})();
