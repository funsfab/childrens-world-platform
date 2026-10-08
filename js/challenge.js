(()=>{
  'use strict';
  const TIERS=['Explorer','Challenger','Investigator','Expert','Master Mission'];
  const PER_TIER=20;
  const PROGRESS_KEY='cw_age10_challenge_progress_v1';
  const SESSION_KEY='cw_age10_challenge_session_objective_v2';
  const PAUSED_KEY='cw_age10_challenge_paused_runs_objective_v2';
  const PREF_KEY='cw_age10_challenge_preferences_v1';
  const AGE_ACCESS_KEY='cw_curriculum_access_v1';
  const NEED_TEXT=1, OPEN_RESPONSE=2;
  const $=id=>document.getElementById(id);
  const intro=$('challengeIntro'),arena=$('challengeArena'),results=$('challengeResults');
  const lang=()=>window.CWLang?.current?.()==='fr'?'fr':'en';
  const tr=(en,fr)=>lang()==='fr'?fr:en;
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x};
  const safe=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&typeof x==='object'?x:fallback}catch(_){return fallback}};
  const access=()=>window.CWAccess?.get?.()||{};
  const defaultAge=()=>{const n=parseInt(String(access().childAge||'10').match(/\d+/)?.[0]||'10',10);return Math.max(10,Math.min(13,n||10))};
  const childKey=()=>{const a=access();return String(a.childId||`${a.childNickname||'Explorer'}|${a.childAge||'10'}|${a.childAvatar||''}`)};
  const contextKey=(age,country,language)=>`${childKey()}::age${age}::${country}::${language}`;
  const countryName=c=>c==='UK'?tr('United Kingdom','Royaume-Uni'):'France';
  let run=null,current=null,answered=false,answerState=null,bank=[],bankMap=new Map(),topicBuckets=new Map(),prefs=null;

  function unlockedAges(){
    const root=safe(AGE_ACCESS_KEY,{}),ck=childKey(),d=defaultAge();
    const row=root.children?.[ck]||root[ck]||{};
    const ages=new Set((row.unlockedAges||[d]).map(Number).filter(x=>x>=10&&x<=13));ages.add(d);return [...ages].sort((a,b)=>a-b);
  }
  function loadPrefs(){const p=safe(PREF_KEY,{}),ck=childKey(),ages=unlockedAges();const row=p[ck]||{};return {age:ages.includes(Number(row.age))?Number(row.age):defaultAge(),country:['UK','FR'].includes(row.country)?row.country:null}}
  function savePrefs(){const root=safe(PREF_KEY,{});root[childKey()]={age:prefs.age,country:prefs.country,updatedAt:Date.now()};localStorage.setItem(PREF_KEY,JSON.stringify(root))}
  function progressRoot(){return safe(PROGRESS_KEY,{contexts:{}})}
  function getContext(create=true){
    const root=progressRoot(),key=contextKey(prefs.age,prefs.country,lang());root.contexts=root.contexts||{};
    if(!root.contexts[key]&&create)root.contexts[key]={childKey:childKey(),age:prefs.age,country:prefs.country,language:lang(),cycles:[],seenIds:[],updatedAt:Date.now()};
    return {root,key,ctx:root.contexts[key]||null};
  }
  function saveContext(root,key,ctx){ctx.updatedAt=Date.now();root.contexts[key]=ctx;localStorage.setItem(PROGRESS_KEY,JSON.stringify(root))}
  function newCycle(ctx){const c={id:`cycle-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,startedAt:Date.now(),stages:Array.from({length:5},(_,tier)=>({tier,initialScore:null,baseCorrect:0,baseIds:[],missedIds:[],mastered:false})),completedAt:null};ctx.cycles.push(c);return c}
  function activeCycle(ctx){return ctx.cycles.find(c=>!c.completedAt)||ctx.cycles[ctx.cycles.length-1]||newCycle(ctx)}
  function firstIncompleteTier(cycle){for(let i=0;i<5;i++)if(!cycle.stages[i]?.mastered)return i;return 4}
  function unlockedTierIndexes(cycle){if(!cycle)return[0];if(cycle.completedAt)return[0,1,2,3,4];const max=firstIncompleteTier(cycle);return Array.from({length:max+1},(_,i)=>i)}
  function isTierUnlocked(cycle,tier){return unlockedTierIndexes(cycle).includes(tier)}
  function scoreText(){if(!run)return'0%';if(run.lockedScore!=null)return `${run.lockedScore}%`;return `${run.baseAnswered?Math.round((run.baseCorrect/run.baseAnswered)*100):0}%`}

  function ensureChooser(){
    if($('cwSyllabusChooser'))return;
    const box=document.createElement('div');box.id='cwSyllabusChooser';box.className='membership-card';box.style.margin='18px 0';box.style.color='#10223a';box.style.background='rgba(244,248,255,.96)';
    box.innerHTML=`<b style="color:#10223a">${tr('Choose curriculum for this mission','Choisis le programme de cette mission')}</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:12px"><label style="color:#35516f">${tr('Curriculum age','Âge du programme')}<select id="cwCurriculumAge" style="width:100%;margin-top:6px"></select></label><label style="color:#35516f">${tr('Country syllabus','Programme du pays')}<select id="cwCountrySyllabus" style="width:100%;margin-top:6px"><option value="">${tr('Choose…','Choisir…')}</option><option value="UK">🇬🇧 ${tr('United Kingdom','Royaume-Uni')}</option><option value="FR">🇫🇷 France</option></select></label></div><small id="cwChooserNote" style="display:block;margin-top:10px;color:#5a718b"></small>`;
    intro.querySelector('.challenge-intro-actions')?.before(box);
    const age=$('cwCurriculumAge');for(const n of unlockedAges()){const o=document.createElement('option');o.value=n;o.textContent=`Age ${n}`;age.appendChild(o)}
    age.value=String(prefs.age);$('cwCountrySyllabus').value=prefs.country||'';
    const sync=()=>{prefs.age=Number(age.value);prefs.country=$('cwCountrySyllabus').value||null;savePrefs();updateChooserNote();renderStageNavigators()};age.onchange=sync;$('cwCountrySyllabus').onchange=sync;updateChooserNote();
    ensureStageNavigator(intro,'cwIntroStageNavigator',intro.querySelector('.challenge-intro-actions'));
    ensureStageNavigator(results,'cwResultStageNavigator',results.querySelector('.challenge-result-actions'));
    const phase=$('challengePhase');ensureStageNavigator(arena,'cwArenaStageNavigator',phase);
    renderStageNavigators();
  }
  function updateChooserNote(){const n=$('cwChooserNote');if(!n)return;if(!prefs.country)n.textContent=tr('Website language stays separate. Choose a country syllabus to begin.','La langue du site reste séparée. Choisis un programme national pour commencer.');else n.textContent=tr(`Website language: ${lang()==='en'?'English':'French'} • ${countryName(prefs.country)} syllabus • Age ${prefs.age}`,`Langue du site : ${lang()==='en'?'anglais':'français'} • programme ${countryName(prefs.country)} • ${prefs.age} ans`)}
  function ensureStageNavigator(parent,id,beforeNode){
    if($(id))return;
    const wrap=document.createElement('div');wrap.id=id;wrap.style.margin='16px 0';const arenaNav=id==='cwArenaStageNavigator';wrap.innerHTML=`<small style="display:block;margin-bottom:8px;font-weight:700;color:${arenaNav?'#9fb8d1':'inherit'}">${arenaNav?tr('Move between unlocked stages — future stages stay locked until mastered','Passe entre les niveaux débloqués — les niveaux suivants restent verrouillés jusqu’à la maîtrise'):tr('Choose an unlocked stage','Choisis un niveau débloqué')}</small><div data-stage-buttons style="display:flex;flex-wrap:wrap;gap:8px"></div>`;
    parent.insertBefore(wrap,beforeNode||null);
  }
  function stageButtonLabel(stage,i){const score=stage?.initialScore;const done=stage?.mastered?' ✓':'';return `${TIERS[i]}${score!=null?` • ${score}%`:''}${done}`}
  function renderStageNavigator(id){
    const wrap=$(id);if(!wrap)return;
    const box=wrap.querySelector('[data-stage-buttons]');box.innerHTML='';
    if(!prefs?.country){wrap.hidden=true;return}wrap.hidden=false;
    const {ctx}=getContext(true),cycle=activeCycle(ctx),unlocked=new Set(unlockedTierIndexes(cycle));
    for(let i=0;i<TIERS.length;i++){
      const b=document.createElement('button');b.type='button';b.className='btn small secondary';const isArena=id==='cwArenaStageNavigator',isCurrent=isArena&&run&&run.cycleId===cycle.id&&run.tier===i;b.textContent=isCurrent?`${stageButtonLabel(cycle.stages[i],i)} • ${tr('Current','Actuel')}`:stageButtonLabel(cycle.stages[i],i);b.disabled=!unlocked.has(i)||isCurrent;b.title=!unlocked.has(i)?tr('Complete the previous stage first.','Termine d’abord le niveau précédent.'):(isCurrent?tr('You are already in this stage.','Tu es déjà dans ce niveau.'):'');
      b.onclick=()=>isArena?switchTier(i):startTier(i);box.appendChild(b);
    }
  }
  function renderStageNavigators(){renderStageNavigator('cwIntroStageNavigator');renderStageNavigator('cwResultStageNavigator');renderStageNavigator('cwArenaStageNavigator')}

  function topicKeyFromId(id){return String(id||'').replace(/-(EXPLORER|CHALLENGER|INVESTIGATOR|EXPERT|MASTER-MISSION)-\d+$/,'')}
  function cleanSourcePrompt(raw){
    let s=String(raw||'').trim();
    s=s.replace(/\s*\[Task\s+\d+\]\s*$/i,'').trim();
    s=s.replace(/^(?:Challenge|Défi)\s*\d+\s*[:：]\s*/i,'').trim();
    s=s.replace(/^.*?\s*-\s*(?:Challenge|Défi)\s*\d+\s*[:：]\s*/i,'').trim();
    const markers=lang()==='fr'
      ?[/\s+Cycle de preuve\s+\d+\s*[:：]/i,/\s+Cycle d[’']apprentissage\s+\d+\s*[:：]/i,/\s+Cycle\s+\d+\s*[:：]/i,/\s+Repère du thème\s+\d+(?:\.\d+)?\.?/i,/\s+Cycle de mission\s+\d+\.?/i]
      :[/\s+Evidence cycle\s+\d+\s*[:：]/i,/\s+Learning cycle\s+\d+\s*[:：]/i,/\s+Cycle\s+\d+\s*[:：]/i,/\s+Topic focus\s+\d+(?:\.\d+)?\.?/i,/\s+Mission cycle\s+\d+\.?/i];
    let cut=s.length;
    for(const re of markers){const m=s.match(re);if(m&&m.index<cut)cut=m.index}
    s=s.slice(0,cut).trim();
    s=s.replace(/\s+(?:Options?|Choices?|Choix)\s*:\s*[A-D][.)][\s\S]*$/i,'').trim();
    return s;
  }
  function cleanAnswer(raw){
    let s=String(raw||'').trim();
    if(lang()==='fr'){
      s=s.replace(/^(?:Attendu civique|Attendu pratique|Attendu créatif|Attendu historique|Attendu|Objectif d[’']apprentissage attendu)\s*:\s*/i,'');
      s=s.split(/\s+(?:Note d[’']apprentissage|Barème|Rubrique|Note pédagogique)\s*:/i)[0].trim();
    }else{
      s=s.replace(/^(?:Expected (?:creative|historical|civic|learning|health|scientific)?\s*focus|Expected focus|Expected learning focus|Expected historical focus|Expected civic focus)\s*:\s*/i,'');
      s=s.split(/\s+(?:Learning note|Skill|Teaching note)\s*:/i)[0].trim();
    }
    s=s.replace(/\s+(?:Explorer|Challenger|Investigator|Expert|Master Mission|Explorateur|Investigateur|Mission Ma[iî]tre)\s*-\s*\d+\b[\s\S]*$/i,'').trim();
    return s;
  }
  function cleanGuidance(raw){
    let s=String(raw||'').trim();
    if(!s)return'';
    if(lang()==='fr'){
      s=s.replace(/^(?:Objectif d[’']apprentissage attendu|Attendu civique|Attendu pratique|Attendu créatif|Attendu historique|Attendu)\s*:\s*/i,'');
      if(/^Rubrique\s*:/i.test(s)){const parts=s.replace(/^Rubrique\s*:\s*/i,'').split('. ');s=parts.length>1?parts[parts.length-1]:''}
    }else{
      s=s.replace(/^(?:Core knowledge|Expected core|Anchor the investigation in this fact|Use this core fact)\s*:\s*/i,'');
      if(/^Rubric\s*:/i.test(s)){const parts=s.replace(/^Rubric\s*:\s*/i,'').split('. ');s=parts.length>1?parts[parts.length-1]:''}
    }
    return cleanAnswer(s);
  }
  function objectiveFocus(raw){
    const s=cleanSourcePrompt(raw);
    let m;
    if(lang()==='fr'){
      m=s.match(/^Mission Ma[iî]tre(?:\s+\d+)?\s*:\s*.*?\bsur\s+(.+?)(?:\s+dans\b|\.)/i);if(m)return m[1].trim();
      const patterns=[
        /^Que signifie\s+(.+?)\??$/i,/^Qu[’']est-ce que\s+(.+?)\??$/i,/^Quelle est l[’']idée clé derrière\s+(.+?)\??$/i,
        /^Donne un fait exact sur\s+(.+?)\.?$/i,/^Explique\s+(.+?)\s+en une phrase claire(?: pour .*?)?\.?$/i,
        /^Pourquoi\s+(.+?)\s+est-il plus complexe\b/i,/^Critique une affirmation trop simple sur\s+(.+?)\./i,
        /^Quelle limite, perspective ou différence régionale faut-il considérer en étudiant\s+(.+?)\??$/i,
        /^Quel facteur, quelle limite ou quelle différence individuelle faut-il considérer en étudiant\s+(.+?)\??$/i,
        /^Pourquoi\s+(.+?)\s+est-il important\b/i,/^Comment\s+(.+?)\s+est-il lié\b/i,
        /^Quel élément de preuve ou quelle observation pourrait t[’']aider à étudier\s+(.+?)\??$/i,
        /^Quel compromis, quelle limite ou quel contexte compte lorsqu[’']on applique\s+(.+?)\??$/i,
        /^Quelles informations vérifierais-tu avant d[’']utiliser\s+(.+?)\b/i,/^Quel est le point essentiel à retenir sur\s+(.+?)\??$/i
      ];
      for(const re of patterns){m=s.match(re);if(m)return m[1].trim().replace(/\s+concept$/i,'')}
    }else{
      m=s.match(/^Master Mission(?:\s+\d+)?\s*:\s*.*?\babout\s+(.+?)(?:\s+within\b|\.)/i);if(m)return m[1].trim();
      m=s.match(/^Master Mission(?:\s+\d+)?\s*:\s*.*?\binvolving\s+(.+?)(?:\s+within\b|\.)/i);if(m)return m[1].trim();
      const patterns=[
        /^What does\s+(.+?)\s+mean\??$/i,/^What is (?:the key idea behind )?(.+?)\??$/i,/^What are\s+(.+?)\??$/i,
        /^Give one accurate fact about\s+(.+?)\.?$/i,/^Give one accurate everyday fact about\s+(.+?)\.?$/i,
        /^Explain\s+(.+?)(?: concept)?\s+in one clear sentence(?: for .*?)?\.?$/i,
        /^In one clear sentence,\s*explain\s+(.+?)(?:\.\s*Give .*)?\.?$/i,
        /^What should a beginner(?: artist)? remember first about\s+(.+?)\??$/i,/^How could you recognise\s+(.+?)\s+in\b/i,
        /^Choose the best everyday example of\s+(.+?)\s+and explain why it fits\.?$/i,
        /^Why is\s+(.+?)\s+more complex than\b/i,/^Critique an over-simple (?:claim|idea|rule|statement) about\s+(.+?)\./i,
        /^How could priorities or circumstances change a decision involving\s+(.+?)\??$/i,
        /^Explain one benefit, one limitation and one risk connected with\s+(.+?)\.?$/i,
        /^Give one cause, benefit or consequence connected with\s+(.+?)\.?$/i,
        /^Give one cause, purpose, right, duty or consequence connected with\s+(.+?)\.?$/i,
        /^Give one purpose, effect or use connected with\s+(.+?)\.?$/i,
        /^What trade-off, limitation or context matters when applying\s+(.+?)\??$/i,
        /^Explain why\s+(.+?)\s+matters\b/i,/^How does\s+(.+?)\s+connect\b/i,
        /^What evidence or observation could help you investigate\s+(.+?)\??$/i,
        /^What factor, limitation or individual difference should be considered when studying\s+(.+?)\??$/i,
        /^How could two people experience\s+(.+?)\s+differently\b/i,/^How could two lawful viewpoints about\s+(.+?)\s+disagree\b/i,
        /^Why should a claim about\s+(.+?)\s+be checked\b/i,/^What limitation, perspective or regional difference should be considered when investigating\s+(.+?)\??$/i,
        /^How could people reasonably disagree about\s+(.+?)\s+while\b/i,/^What information would you check before using\s+(.+?)\s+in\b/i,
        /^How could two people use\s+(.+?)\s+differently\b/i,/^Compare two possible ways of handling a situation involving\s+(.+?)\./i,
        /^Design a small investigation or comparison that tests understanding of\s+(.+?)\.?$/i,
        /^What materials, techniques or visual choices would you investigate when studying\s+(.+?)\??$/i,
        /^A museum label for Age 10 needs one clear sentence about\s+(.+?)\. What should it say\??$/i,
        /^What institutional difference, legal limit, regional variation or competing interest must be included when explaining\s+(.+?)\??$/i,
        /^What safety, context, individual difference or long-term effect must be included when explaining\s+(.+?)\??$/i,
        /^What constitutional, legal, local, social or European context must be included when explaining\s+(.+?)\??$/i,
        /^What evidence in an artwork would help you identify\s+(.+?)\??$/i,
        /^How could a table, record, receipt, advert, interview or survey help analyse\s+(.+?)\??$/i,
        /^Why is\s+(.+?)\s+important when\b/i,/^How could official records, personal testimony and material evidence be combined to study\s+(.+?)\??$/i,
        /^Use\s+(.+?)\s+in a scenario\b/i
      ];
      for(const re of patterns){m=s.match(re);if(m)return m[1].trim().replace(/\s+concept$/i,'')}
    }
    return'';
  }
  function genericRubricAnswer(s){
    const x=String(s||'').trim();
    return lang()==='fr'
      ?/^(?:Construction correcte|Couverture mondiale équilibrée|Réponse cohérente|Réponse pertinente|Réponse valide|Classification correcte|Un exemple pertinent)\b/i.test(x)
      :/^(?:Any\b|Valid\b|A coherent\b|Accurate classification\b|Reasoned\b|A relevant\b|A meaningful\b|A vague\b|Beginning,\s*problem\b|Strong response\b|An answer that\b|A response that\b)/i.test(x);
  }
  function objectiveQuestion(raw,answer,flags){
    const s=cleanSourcePrompt(raw),focus=objectiveFocus(raw),a=cleanAnswer(answer);
    if(!s||!a||genericRubricAnswer(a))return null;
    if(flags&OPEN_RESPONSE)return null;
    if(lang()==='fr'){
      if(/^(?:Crée|Créer|Écris|Écrire|Construis|Construire|Prépare|Préparer|Produis|Produire|Développe|Développer|Rédige|Rédiger|Compose|Composer|Invente|Inventer|Dessine|Dessiner|Joue|Jouer|Planifie|Planifier|Audit|Annote|Annoter|Intègre|Intégrer)\b/i.test(s)&&!/^Mission Ma[iî]tre/i.test(s))return null;
      if(/^Mission Ma[iî]tre/i.test(s))return focus?{question:`Quelle affirmation sur ${focus} est correcte ?`,focus}:null;
      if(focus&&/^(?:Donne|Explique|Critique|Compare|Quelle limite|Quel facteur|Quel compromis|Quelles informations|Pourquoi .+ plus complexe|Comment .+ pourrait|Quel élément de preuve)/i.test(s))return{question:`Quelle affirmation sur ${focus} est correcte ?`,focus};
      if(/\?$/.test(s)&&s.length<=700&&!/\b(?:ta propre|crée|écris|construis|annote|justifie ta)\b/i.test(s))return{question:s,focus};
      return focus?{question:`Quelle affirmation sur ${focus} est correcte ?`,focus}:null;
    }
    if(/^(?:Create|Write|Design|Build|Prepare|Produce|Develop|Draft|Compose|Invent|Draw|Role[- ]?play|Lead|Expand|Rewrite|Plan|Make|Construct|Record|Present|Debate|Discuss|Imagine|Audit|Annotate)\b/i.test(s)&&!/^Master Mission/i.test(s))return null;
    if(/\bSituation\s*:.*\bTask\s*:/i.test(s))return null;
    if(/^Master Mission/i.test(s))return focus?{question:`Which statement about ${focus} is correct?`,focus}:null;
    if(focus&&/^(?:Give|Explain|Critique|Compare|What should a beginner|How could|What evidence|What factor|What limitation|What trade-off|What information|What safety|What constitutional|What institutional|What materials|A museum label|Why is .+ more complex|Design a small investigation)/i.test(s))return{question:`Which statement about ${focus} is correct?`,focus};
    if(/\?$/.test(s)&&s.length<=700&&!/\b(?:your own|create|write|design|build|annotate|justify your|lead the)\b/i.test(s))return{question:s,focus};
    if(/^(?:Find|Calculate|Work out|Estimate and check|Solve)\b/i.test(s))return{question:`What is the correct answer to this problem: ${s.replace(/[.]+$/,'')}?`,focus};
    return focus?{question:`Which statement about ${focus} is correct?`,focus}:null;
  }
  function loadShard(tier){return new Promise((resolve,reject)=>{
    if(Number(prefs.age)!==10)return reject(new Error('AGE_NOT_AVAILABLE'));
    const src=`js/age10-bank/${lang()}_${tier}.js`;delete window.CW_AGE10_BANK_SHARD;
    const s=document.createElement('script');s.src=src;s.onload=()=>{const sh=window.CW_AGE10_BANK_SHARD;if(!sh||sh.tier!==tier||sh.language!==lang())return reject(new Error('SHARD_INVALID'));
      bank=sh.rows.filter(r=>!r[2]||r[2]===prefs.country).map(r=>{
        const subject=sh.subjects[r[1]],rawQ=String(r[3]||''),a=cleanAnswer(r[4]),g=cleanGuidance(r[5]||''),flags=Number(r[6]||0),obj=objectiveQuestion(rawQ,a,flags);
        if(!obj)return null;
        return{id:r[0],tier,subject:{en:subject,fr:subject},rawQ,q:{en:obj.question,fr:obj.question},a:{en:a,fr:a},guidance:g,flags:0,focus:obj.focus||'',topicKey:topicKeyFromId(r[0])};
      }).filter(Boolean);
      bankMap=new Map(bank.map(q=>[q.id,q]));topicBuckets=new Map();for(const q of bank){if(!topicBuckets.has(q.topicKey))topicBuckets.set(q.topicKey,[]);topicBuckets.get(q.topicKey).push(q)}s.remove();resolve(bank)};s.onerror=()=>reject(new Error('SHARD_LOAD_FAILED'));document.head.appendChild(s)
  })}
  function hashId(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function seededShuffle(items,seed){const x=[...items];let n=seed>>>0;for(let i=x.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[x[i],x[j]]=[x[j],x[i]]}return x}
  const STOP_EN=new Set('the a an and or of to in on for with from as at by is are was were be been being this that these those what why how when where which who one two three four give state explain choose best about into your you it they their its can could should would must may might do does did have has had challenge task evidence learning cycle'.split(' '));
  const STOP_FR=new Set('le la les un une des de du et ou à au aux en pour avec dans sur par est sont était être ce cette ces quel quelle quels quelles pourquoi comment quand où qui que quoi donne explique choisis votre ton ta tes tu il elle ils elles peut doivent tâche consigne'.split(' '));
  function contentTokens(text){const stop=lang()==='fr'?STOP_FR:STOP_EN;return new Set(String(text||'').toLowerCase().replace(/\d+/g,' ').match(/[a-zà-öø-ÿ']+/g)?.filter(w=>w.length>2&&!stop.has(w))||[])}
  function tokenOverlap(a,b){const A=contentTokens(a),B=contentTokens(b);if(!A.size||!B.size)return 0;let n=0;for(const x of A)if(B.has(x))n++;return n/Math.max(A.size,B.size)}
  function normalAnswer(s){return String(s||'').toLowerCase().replace(/[^a-zà-öø-ÿ0-9]+/g,' ').trim()}
  function answerEquivalent(a,b){const A=normalAnswer(a),B=normalAnswer(b);if(!A||!B)return false;if(A===B)return true;if(A.length>12&&B.length>12&&(A.includes(B)||B.includes(A)))return true;const ta=new Set(A.split(' ')),tb=new Set(B.split(' '));let n=0;for(const x of ta)if(tb.has(x))n++;return n/Math.max(1,Math.min(ta.size,tb.size))>.72}
  function answerType(s){const x=normalAnswer(s),words=x.split(' ').filter(Boolean);if(/^[-+]?\d+(?:[.,/]\d+)?(?:\s*[%a-zà-öø-ÿ]*)?$/.test(x))return'num';if(words.length<=2)return'short';if(/[;,]/.test(String(s))&&words.length>7)return'list';return'long'}
  function styleKey(q){let s=String(q||'').toLowerCase().replace(/^challenge\s*\d+\s*:\s*/,'').replace(/\[task\s*\d+\]/g,'').replace(/\d+/g,'#');const lastQ=s.match(/([^.!?]*\?)(?![\s\S]*\?)/);if(lastQ)s=lastQ[1].trim();const patterns=[['main idea',/what is the main idea/],['infer',/what can you infer/],['literal figurative',/literal or figurative|literal ou figur/],['word class',/word class|classe grammaticale|classe de mot/],['correct form',/choose the correct form|choisis la bonne forme|choisis la forme correcte/],['meaning',/what does .* mean|que signifie|sens de/],['example',/example|exemple/],['definition',/define|definition|définis|définition/],['compare',/\bcompare\b|\bsimilarity\b|\bcomparaison\b|ressemblance/]];for(const [k,r] of patterns)if(r.test(s))return k;return s.split(/\s+/).slice(0,7).join(' ')}
  function questionMode(q){let s=String(q||'').toLowerCase().replace(/^challenge\s*\d+\s*:\s*/,'').replace(/\[task\s*\d+\]/g,'').trim();const lastQ=s.match(/([^.!?]*\?)(?![\s\S]*\?)/);if(lastQ)s=lastQ[1].trim();const m=s.match(/^(what|why|how|which|who|where|when|is|are|can|could|should|does|do|if|state|give|explain|choose|write|describe|compare|name|identify|define|correct|rewrite|add|join|design|create|plan|formule|donne|explique|choisis|écris|décris|compare|nomme|identifie|définis|corrige|réécris|ajoute|crée)\b/);return m?m[1]:s.split(/\s+/)[0]||''}
  function extractInlineOptions(q){
    const text=String(q||'');let m=text.match(/(?:options?|choices?|choix)\s*:\s*(.+)$/i);
    if(m){const found=[...m[1].matchAll(/(?:^|\s)[A-D][.)]\s*([\s\S]*?)(?=(?:\s+[A-D][.)]\s)|$)/gi)].map(x=>x[1].trim()).filter(Boolean);if(found.length>=2)return found.slice(0,4)}
    m=text.match(/\(([^()\/]{1,40})\/([^()\/]{1,40})\)/);if(m)return[m[1].trim(),m[2].trim()];
    m=text.match(/\b([A-Za-zÀ-ÖØ-öø-ÿ-]{2,30})\s+(?:or|ou)\s+([A-Za-zÀ-ÖØ-öø-ÿ-]{2,30})\??\s*$/i);if(m)return[m[1].trim(),m[2].trim()];
    if(/\btrue\s+or\s+false\b/i.test(text))return['True','False'];
    if(/\bvrai\s+ou\s+faux\b/i.test(text))return['Vrai','Faux'];
    return[];
  }
  function makeChoice(text,correct=false){return{en:text,fr:text,correct}}
  function replaceFirst(text,re,replacement){return re.test(text)?text.replace(re,replacement):null}
  function oppositeVariant(text){
    const s=String(text||'').trim();
    const pairs=lang()==='fr'
      ?[[/\bvrai\b/i,'faux'],[/\bfaux\b/i,'vrai'],[/\baugmente\b/i,'diminue'],[/\bdiminue\b/i,'augmente'],[/\bplus\b/i,'moins'],[/\bmoins\b/i,'plus'],[/\bavant\b/i,'après'],[/\baprès\b/i,'avant'],[/\bnord\b/i,'sud'],[/\bsud\b/i,'nord'],[/\best\b/i,'ouest'],[/\bouest\b/i,'est'],[/\bconducteur\b/i,'isolant'],[/\bisolant\b/i,'conducteur'],[/\blittéral\b/i,'figuré'],[/\bfiguré\b/i,'littéral']]
      :[[/\btrue\b/i,'false'],[/\bfalse\b/i,'true'],[/\bincreases?\b/i,'decreases'],[/\bdecreases?\b/i,'increases'],[/\bmore\b/i,'less'],[/\bless\b/i,'more'],[/\bbefore\b/i,'after'],[/\bafter\b/i,'before'],[/\bnorth\b/i,'south'],[/\bsouth\b/i,'north'],[/\beast\b/i,'west'],[/\bwest\b/i,'east'],[/\bconductor\b/i,'insulator'],[/\binsulator\b/i,'conductor'],[/\bliteral\b/i,'figurative'],[/\bfigurative\b/i,'literal'],[/\brenewable\b/i,'non-renewable'],[/\bnon-renewable\b/i,'renewable']];
    for(const [re,rep] of pairs){const v=replaceFirst(s,re,rep);if(v&&normalAnswer(v)!==normalAnswer(s))return v}
    return'';
  }
  function negateStatement(text){
    const s=String(text||'').trim();if(!s)return'';
    const reps=lang()==='fr'
      ?[[/\bpeut\b/i,'ne peut pas'],[/\bpeuvent\b/i,'ne peuvent pas'],[/\bpermet\b/i,'ne permet pas'],[/\bpermettent\b/i,'ne permettent pas'],[/\baide\b/i,"n'aide pas"],[/\baident\b/i,"n'aident pas"],[/\bsignifie\b/i,'ne signifie pas'],[/\bcomprend\b/i,'ne comprend pas'],[/\bcontient\b/i,'ne contient pas'],[/\best\b/i,"n'est pas"],[/\bsont\b/i,'ne sont pas']]
      :[[/\bcan\b/i,'cannot'],[/\bmay\b/i,'cannot'],[/\bwill\b/i,'will not'],[/\bhelps\b/i,'does not help'],[/\ballows\b/i,'does not allow'],[/\bmeans\b/i,'does not mean'],[/\bincludes\b/i,'does not include'],[/\bcontains\b/i,'does not contain'],[/\brequires\b/i,'does not require'],[/\buses\b/i,'does not use'],[/\bshows\b/i,'does not show'],[/\bsupports\b/i,'does not support'],[/\bprovides\b/i,'does not provide'],[/\bexplains\b/i,'does not explain'],[/\bcombines\b/i,'does not combine'],[/\bdescribes\b/i,'does not describe'],[/\bidentifies\b/i,'does not identify'],[/\bstores\b/i,'does not store'],[/\bmoves\b/i,'does not move'],[/\brefers\b/i,'does not refer'],[/\brepresents\b/i,'does not represent'],[/\bforms\b/i,'does not form'],[/\bdiffers\b/i,'does not differ'],[/\bchanges\b/i,'does not change'],[/\bconnects\b/i,'does not connect'],[/\breduces\b/i,'does not reduce'],[/\bimproves\b/i,'does not improve'],[/\bprotects\b/i,'does not protect'],[/\bis\b/i,'is not'],[/\bare\b/i,'are not']];
    for(const [re,rep] of reps){const v=replaceFirst(s,re,rep);if(v&&normalAnswer(v)!==normalAnswer(s)&&!/not not/i.test(v))return v}
    return'';
  }
  function extremeVariant(text,focus){
    const s=String(text||'').trim();if(!s)return'';
    const reps=lang()==='fr'
      ?[[/\bcertains?\b/i,'tous'],[/\bsouvent\b/i,'toujours'],[/\bgénéralement\b/i,'toujours'],[/\bparfois\b/i,'toujours']]
      :[[/\bsome\b/i,'all'],[/\boften\b/i,'always'],[/\busually\b/i,'always'],[/\bsometimes\b/i,'always']];
    for(const [re,rep] of reps){const v=replaceFirst(s,re,rep);if(v&&normalAnswer(v)!==normalAnswer(s))return v}
    if(!focus)return'';
    return lang()==='fr'?`${focus} fonctionne toujours exactement de la même manière dans toutes les situations.`:`${focus} always works exactly the same way in every situation.`;
  }
  function numericDistractors(answer){
    const s=String(answer||'').trim(),out=[];
    const frac=s.match(/^(-?\d+)\s*\/\s*(\d+)(.*)$/);
    if(frac){const n=Number(frac[1]),d=Number(frac[2]),tail=frac[3]||'';for(const [a,b] of [[n+1,d],[Math.max(0,n-1),d],[d,n||1]])out.push(`${a}/${b}${tail}`);return out}
    const nums=[...s.matchAll(/-?\d+(?:[.,]\d+)?/g)];
    if(!nums.length)return out;
    const values=nums.map(m=>Number(m[0].replace(',','.')));
    const render=(arr)=>{let i=0;return s.replace(/-?\d+(?:[.,]\d+)?/g,()=>{const orig=nums[i][0],v=arr[i++];const dec=/[.,]/.test(orig)?Math.max(0,(orig.split(/[.,]/)[1]||'').length):0;let t=dec?v.toFixed(dec):String(Math.round(v));if(orig.includes(','))t=t.replace('.',',');return t})};
    const scale=v=>Math.max(1,Math.abs(v)>=100?10:Math.abs(v)>=20?5:1);
    const plus=values.map(v=>v+scale(v)),minus=values.map(v=>v-scale(v));
    out.push(render(plus),render(minus));
    if(values.length>1){const swap=[...values].reverse();out.push(render(swap))}
    else out.push(render(values.map(v=>v===0?2:v*2)));
    return out;
  }
  function shortDistractors(q,used){
    const out=[],bucket=topicBuckets.get(q.topicKey)||[],wanted=answerType(q.a.en),scored=[];
    for(const x of bucket){
      if(x.id===q.id||answerEquivalent(q.a.en,x.a.en)||answerType(x.a.en)!==wanted)continue;
      const n=normalAnswer(x.a.en);if(!n||used.has(n))continue;
      let score=tokenOverlap(q.rawQ,x.rawQ)+tokenOverlap(q.focus||'',x.focus||'')*1.4;
      if(questionMode(q.q.en)===questionMode(x.q.en))score+=.5;
      score-=Math.abs(normalAnswer(q.a.en).split(' ').length-normalAnswer(x.a.en).split(' ').length)*.04;
      scored.push([score,hashId(x.id)^hashId(q.id),x.a.en]);
    }
    scored.sort((a,b)=>b[0]-a[0]||a[1]-b[1]);
    for(const [score,,ans] of scored){if(score<.15)continue;const n=normalAnswer(ans);if(!used.has(n)){out.push(ans);used.add(n)}if(out.length===3)break}
    return out;
  }
  function relatedFalseVariants(q){
    const out=[],used=new Set([normalAnswer(q.a.en)]),add=v=>{const n=normalAnswer(v);if(v&&n&&!used.has(n)){out.push(v);used.add(n)}};
    add(oppositeVariant(q.a.en));add(negateStatement(q.a.en));
    if(q.guidance){add(oppositeVariant(q.guidance));add(negateStatement(q.guidance))}
    add(extremeVariant(q.a.en,q.focus));
    if(out.length<3&&q.focus){
      add(lang()==='fr'?`${q.focus} n’a aucun lien avec l’idée demandée dans cette question.`:`${q.focus} has no connection with the idea asked about in this question.`);
      add(lang()==='fr'?`${q.focus} signifie toujours exactement le contraire de l’idée correcte.`:`${q.focus} always means exactly the opposite of the correct idea.`);
    }
    return out.slice(0,3);
  }
  function buildChoices(q){
    const seed=hashId(q.id),correct=q.a.en,authored=extractInlineOptions(q.rawQ),choices=[makeChoice(correct,true)],used=new Set([normalAnswer(correct)]),correctNorm=normalAnswer(correct);
    if(authored.length>=2&&authored.some(x=>correctNorm===normalAnswer(x)||correctNorm.startsWith(normalAnswer(x)+' ')||normalAnswer(x).startsWith(correctNorm+' '))){
      for(const x of authored){const nx=normalAnswer(x);if(!nx||used.has(nx)||answerEquivalent(correct,x))continue;choices.push(makeChoice(x,false));used.add(nx);if(choices.length===4)break}
      if(authored.length===2){for(const x of (lang()==='fr'?['Les deux','Aucun des deux']:['Both','Neither'])){const n=normalAnswer(x);if(choices.length<4&&!used.has(n)){choices.push(makeChoice(x,false));used.add(n)}}}
    }
    if(choices.length<4){
      const type=answerType(correct);
      if(type==='num'){for(const x of numericDistractors(correct)){const n=normalAnswer(x);if(choices.length<4&&n&&!used.has(n)){choices.push(makeChoice(x,false));used.add(n)}}}
      else if(type==='short'){const opp=oppositeVariant(correct),on=normalAnswer(opp);if(opp&&on&&!used.has(on)){choices.push(makeChoice(opp,false));used.add(on)}for(const x of shortDistractors(q,used)){if(choices.length<4)choices.push(makeChoice(x,false))}}
      else{for(const x of relatedFalseVariants(q)){const n=normalAnswer(x);if(choices.length<4&&n&&!used.has(n)){choices.push(makeChoice(x,false));used.add(n)}}}
    }
    if(choices.length<4){for(const x of relatedFalseVariants(q)){const n=normalAnswer(x);if(choices.length<4&&n&&!used.has(n)){choices.push(makeChoice(x,false));used.add(n)}}}
    const fallback=lang()==='fr'
      ?[`${q.focus||'Cette idée'} ne correspond pas à la définition donnée.`,`${q.focus||'Cette idée'} est toujours identique dans toutes les situations.`,`${q.focus||'Cette idée'} n’a aucun rôle dans ce sujet.`]
      :[`${q.focus||'This idea'} does not match the definition in the question.`,`${q.focus||'This idea'} is always identical in every situation.`,`${q.focus||'This idea'} has no role in this subject.`];
    for(const x of fallback){const n=normalAnswer(x);if(choices.length<4&&!used.has(n)){choices.push(makeChoice(x,false));used.add(n)}}
    return seededShuffle(choices.slice(0,4),seed^0x85ebca6b);
  }
  function select20Unseen(pool,seen){const seenSet=new Set(seen||[]),unique=[...new Map(pool.map(q=>[q.id,q])).values()],unseen=unique.filter(q=>!seenSet.has(q.id));if(unseen.length<PER_TIER)return[];const picked=[],pickedIds=new Set(),bySubject=new Map();for(const q of unseen){const k=q.subject.en;if(!bySubject.has(k))bySubject.set(k,[]);bySubject.get(k).push(q)}for(const [,items] of shuffle([...bySubject.entries()])){const q=shuffle(items)[0];if(q&&!pickedIds.has(q.id)){picked.push(q);pickedIds.add(q.id)}if(picked.length===PER_TIER)return picked}const byTopic=new Map();for(const q of unseen){if(pickedIds.has(q.id))continue;if(!byTopic.has(q.topicKey))byTopic.set(q.topicKey,[]);byTopic.get(q.topicKey).push(q)}let topicGroups=shuffle([...byTopic.values()]);while(picked.length<PER_TIER&&topicGroups.length){const next=[];for(const group of topicGroups){const candidates=shuffle(group.filter(q=>!pickedIds.has(q.id)));if(candidates.length){const q=candidates[0];picked.push(q);pickedIds.add(q.id);if(candidates.length>1)next.push(candidates.slice(1))}if(picked.length===PER_TIER)break}topicGroups=next}if(picked.length<PER_TIER){for(const q of shuffle(unseen)){if(!pickedIds.has(q.id)){picked.push(q);pickedIds.add(q.id)}if(picked.length===PER_TIER)break}}return picked.slice(0,PER_TIER)}
  function saveSession(){if(run)localStorage.setItem(SESSION_KEY,JSON.stringify({run,answered,answerState,updatedAt:Date.now()}))}
  function clearSession(){localStorage.removeItem(SESSION_KEY)}
  function pausedRoot(){return safe(PAUSED_KEY,{runs:{}})}
  function pausedKey(context,cycleId,tier){return `${context}::${cycleId}::tier${tier}`}
  function savePausedRun(){
    if(!run)return;
    const root=pausedRoot();root.runs=root.runs||{};root.runs[pausedKey(run.contextKey,run.cycleId,run.tier)]={run,answered,answerState,updatedAt:Date.now()};localStorage.setItem(PAUSED_KEY,JSON.stringify(root));
  }
  function takePausedRun(context,cycleId,tier){
    const root=pausedRoot(),k=pausedKey(context,cycleId,tier),snapshot=root.runs?.[k]||null;if(snapshot){delete root.runs[k];localStorage.setItem(PAUSED_KEY,JSON.stringify(root))}return snapshot;
  }
  function clearPausedContext(context){const root=pausedRoot();for(const k of Object.keys(root.runs||{}))if(k.startsWith(`${context}::`))delete root.runs[k];localStorage.setItem(PAUSED_KEY,JSON.stringify(root))}
  function restoreRenderedAnswer(){
    if(!answered||!answerState)return;
    const buttons=[...document.querySelectorAll('#challengeOptions button')];buttons.forEach(b=>{b.disabled=true;if(b.dataset.correct==='1')b.classList.add('correct');if(b.dataset.answer===answerState.choice&&!answerState.correct)b.classList.add('wrong')});
    $('challengeFeedback').textContent=feedbackForState(answerState);updateWrittenStatus();
    const last=run.position===run.queue.length-1,stillMissed=run.phase==='review'&&run.missed.length>0;$('nextChallenge').textContent=last?(stillMissed?tr('Continue review →','Continuer la révision →'):tr('Finish round →','Terminer la série →')):tr('Next challenge →','Question suivante →');setHidden($('nextChallenge'),false);
  }
  function showRunSnapshot(snapshot){
    run=snapshot.run;answered=!!snapshot.answered;answerState=snapshot.answerState||null;intro.hidden=true;results.hidden=true;arena.hidden=false;current=findQuestion(run.queue[run.position]);if(!current)return false;current.choices=buildChoices(current);current.hint={en:current.guidance||tr('Review the question carefully.','Relis attentivement la question.'),fr:current.guidance||tr('Review the question carefully.','Relis attentivement la question.')};current.why={en:current.guidance||current.a.en,fr:current.guidance||current.a.en};renderQuestion();restoreRenderedAnswer();renderStageNavigators();saveSession();return true;
  }
  function switchTier(tierIndex){
    if(!run||tierIndex===run.tier)return;
    const {ctx}=getContext(false),cycle=ctx?.cycles.find(c=>c.id===run.cycleId);if(!cycle||!isTierUnlocked(cycle,tierIndex))return;
    savePausedRun();clearSession();startTier(tierIndex);
  }

  async function startTier(tierIndex){
    if(!prefs.country){alert(tr('Choose a country syllabus first.','Choisis d’abord un programme national.'));return}
    if(prefs.age!==10){alert(tr(`Age ${prefs.age} is unlocked for this child, but its verified Challenge bank is not installed yet. Age 10 progress is untouched.`,`Le programme ${prefs.age} ans est déverrouillé, mais sa banque Challenge vérifiée n’est pas encore installée. La progression 10 ans reste intacte.`));return}
    try{await loadShard(tierIndex)}catch(e){alert(tr('This verified curriculum bank is unavailable. No fallback was used.','Cette banque de programme vérifiée est indisponible. Aucun contenu de secours n’a été utilisé.'));return}
    if(bank.length<PER_TIER){alert(tr('Not enough verified eligible questions for this syllabus/stage. No fallback was used.','Pas assez de questions vérifiées éligibles pour ce programme/niveau. Aucun contenu de secours n’a été utilisé.'));return}
    const {root,key,ctx}=getContext(true),cycle=activeCycle(ctx),stage=cycle.stages[tierIndex];
    if(!isTierUnlocked(cycle,tierIndex)){alert(tr('Complete the previous stage first.','Termine d’abord le niveau précédent.'));return}
    const paused=takePausedRun(key,cycle.id,tierIndex);if(paused?.run){showRunSnapshot(paused);return}

    if(stage.mastered){
      const picked=select20Unseen(bank,ctx.seenIds);
      if(picked.length<PER_TIER){alert(tr('There are not 20 unseen questions left in this stage for this syllabus. No repeated questions were used.','Il ne reste pas 20 questions inédites dans ce niveau pour ce programme. Aucune question répétée n’a été utilisée.'));return}
      const ids=picked.map(q=>q.id);ctx.seenIds=[...new Set([...ctx.seenIds,...ids])];saveContext(root,key,ctx);
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'practice',phase:'base',queue:ids,position:0,missed:[],attempts:{},streak:0,baseAnswered:0,baseCorrect:0,lockedScore:stage.initialScore,practiceScore:null,textResponses:{}};
    }else if(stage.initialScore!=null&&stage.missedIds?.length){
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'progression',phase:'review',queue:shuffle(stage.missedIds),position:0,missed:[...stage.missedIds],attempts:{},streak:0,baseAnswered:PER_TIER,baseCorrect:stage.baseCorrect||0,lockedScore:stage.initialScore,textResponses:{}};
    }else{
      let ids=stage.baseIds;
      if(!ids.length){
        const picked=select20Unseen(bank,ctx.seenIds);
        if(picked.length<PER_TIER){alert(tr('There are not 20 unseen questions left in this stage for this syllabus. No repeated questions were used.','Il ne reste pas 20 questions inédites dans ce niveau pour ce programme. Aucune question répétée n’a été utilisée.'));return}
        ids=picked.map(q=>q.id);stage.baseIds=ids;stage.baseCorrect=0;stage.initialScore=null;stage.missedIds=[];ctx.seenIds=[...new Set([...ctx.seenIds,...ids])];saveContext(root,key,ctx);
      }
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'progression',phase:'base',queue:[...ids],position:0,missed:[...stage.missedIds],attempts:{},streak:0,baseAnswered:0,baseCorrect:0,lockedScore:stage.initialScore,textResponses:{}};
    }
    answered=false;answerState=null;saveSession();intro.hidden=true;results.hidden=true;arena.hidden=false;nextQuestion();
  }
  function findQuestion(id){return bankMap.get(id)}
  function txt(obj){return obj?.[lang()] ?? ''}
  function setHidden(el,hidden){if(!el)return;el.hidden=hidden;el.style.display=hidden?'none':''}
  function ensureWrittenUI(){
    const guide=$('cwAnswerGuide'),wrap=$('cwWrittenWrap');
    if(guide)setHidden(guide,true);
    if(wrap)setHidden(wrap,true);
    return{guide,wrap,ta:$('cwWrittenResponse'),status:$('cwWrittenStatus')};
  }
  function updateWrittenStatus(){}
  function renderWrittenUI(){ensureWrittenUI()}
  function renderQuestion(){renderStageNavigators();$('tierName').textContent=TIERS[run.tier];$('challengeScore').textContent=scoreText();$('challengeStreak').textContent=run.streak;$('challengeProgress').textContent=`${run.position+1} / ${run.queue.length}`;$('challengePhase').textContent=run.phase==='base'?(run.mode==='practice'?tr('Practice round','Série d’entraînement'):tr('Main round','Série principale')):tr('Review round','Révision');$('challengeSubject').textContent=txt(current.subject);$('challengeQuestion').textContent=txt(current.q);$('difficultyPips').innerHTML=Array.from({length:5},(_,i)=>`<i class="${i<=run.tier?'on':''}"></i>`).join('');$('challengeFeedback').textContent='';setHidden($('nextChallenge'),true);setHidden($('provePanel'),true);const choices=current.choices;const box=$('challengeOptions');box.innerHTML=choices.map((c,i)=>`<button type="button" data-choice="${i}"></button>`).join('');box.querySelectorAll('button').forEach((b,i)=>{b.textContent=`${['A','B','C','D'][i]}. ${txt(choices[i])}`;b.dataset.correct=choices[i].correct?'1':'0';b.dataset.answer=choices[i].en;b.onclick=()=>answer(b,choices[i])});renderWrittenUI()}
  function feedbackForState(state){if(state.correct)return tr('✅ Correct. Keep going.','✅ Correct. Continue.');const attempts=run.attempts[current.id]||1;return attempts>=2?tr(`Not quite. Hint: ${txt(current.hint)} This question will return.`,`Pas encore. Indice : ${txt(current.hint)} Cette question reviendra.`):tr('Not quite. This question will return in your review round.','Pas encore. Cette question reviendra pendant la révision.')}
  function answer(btn,choice){if(answered)return;answered=true;const correct=!!choice.correct;run.attempts[current.id]=(run.attempts[current.id]||0)+1;document.querySelectorAll('#challengeOptions button').forEach(b=>{b.disabled=true;if(b.dataset.correct==='1')b.classList.add('correct')});if(correct){btn.classList.add('correct');run.streak++;run.missed=run.missed.filter(id=>id!==current.id);if(run.phase==='base')run.baseCorrect++;if(run.tier>=2){setHidden($('provePanel'),false);$('provePanel').innerHTML=`<span class="eyebrow">${tr('WHY IT WORKS','POURQUOI')}</span><p>${txt(current.why)}</p>`}window.playTone?.(true)}else{btn.classList.add('wrong');run.streak=0;if(!run.missed.includes(current.id))run.missed.push(current.id);window.playTone?.(false)}if(run.phase==='base')run.baseAnswered++;answerState={choice:choice.en,correct};$('challengeFeedback').textContent=feedbackForState(answerState);$('challengeScore').textContent=scoreText();$('challengeStreak').textContent=run.streak;updateWrittenStatus();const last=run.position===run.queue.length-1,stillMissed=run.phase==='review'&&run.missed.length>0;$('nextChallenge').textContent=last?(stillMissed?tr('Continue review →','Continuer la révision →'):tr('Finish round →','Terminer la série →')):tr('Next challenge →','Question suivante →');setHidden($('nextChallenge'),false);saveSession()}
  function advance(){if(!run||!answered)return;if(current?.flags&NEED_TEXT)updateWrittenStatus();run.position++;answered=false;answerState=null;saveSession();nextQuestion()}
  function currentStage(){const {root,key,ctx}=getContext(false);const cycle=ctx?.cycles.find(c=>c.id===run.cycleId);return {root,key,ctx,cycle,stage:cycle?.stages[run.tier]}}
  function finishBaseRound(){
    if(run.mode==='practice'){
      run.practiceScore=Math.round((run.baseCorrect/PER_TIER)*100);saveSession();
      if(run.missed.length){showIntermission(tr(`${run.missed.length} practice question${run.missed.length===1?'':'s'} to strengthen.`,`${run.missed.length} question${run.missed.length===1?'':'s'} d’entraînement à renforcer.`),tr(`Practice round: ${run.practiceScore}%. Your stored ${TIERS[run.tier]} progress stays ${run.lockedScore}%. Master the missed questions, then choose any unlocked stage.`,`Entraînement : ${run.practiceScore} %. Ta progression ${TIERS[run.tier]} reste à ${run.lockedScore} %. Maîtrise les questions manquées, puis choisis n’importe quel niveau débloqué.`),tr('Start review →','Commencer la révision →'),beginReview)}else finishPractice();
      return;
    }
    run.lockedScore=Math.round((run.baseCorrect/PER_TIER)*100);const x=currentStage();x.stage.initialScore=run.lockedScore;x.stage.baseCorrect=run.baseCorrect;x.stage.missedIds=[...run.missed];saveContext(x.root,x.key,x.ctx);saveSession();if(run.missed.length){showIntermission(tr(`${run.missed.length} question${run.missed.length===1?'':'s'} to strengthen.`,`${run.missed.length} question${run.missed.length===1?'':'s'} à renforcer.`),tr(`Initial ${TIERS[run.tier]} score: ${run.lockedScore}%. That score is now permanent. Master the missed questions to unlock the next stage.`,`Score initial ${TIERS[run.tier]} : ${run.lockedScore} %. Ce score est maintenant permanent. Maîtrise les questions manquées pour débloquer la suite.`),tr('Start review →','Commencer la révision →'),beginReview)}else masterTier();
  }
  function beginReview(){run.phase='review';run.queue=shuffle(run.missed);run.position=0;answered=false;answerState=null;saveSession();results.hidden=true;arena.hidden=false;nextQuestion()}
  function finishReviewRound(){
    if(run.mode==='practice'){
      if(run.missed.length)showIntermission(tr(`${run.missed.length} still to master.`,`${run.missed.length} encore à maîtriser.`),tr(`Your stored ${TIERS[run.tier]} progress stays ${run.lockedScore}%. These missed practice questions will return again.`,`Ta progression ${TIERS[run.tier]} reste à ${run.lockedScore} %. Ces questions d’entraînement reviendront.`),tr('Review again →','Réviser encore →'),beginReview);else finishPractice();
      return;
    }
    const x=currentStage();x.stage.missedIds=[...run.missed];saveContext(x.root,x.key,x.ctx);if(run.missed.length)showIntermission(tr(`${run.missed.length} still to master.`,`${run.missed.length} encore à maîtriser.`),tr(`Your permanent stage score stays ${run.lockedScore}%. These missed questions will return again.`,`Ton score permanent reste ${run.lockedScore} %. Ces questions reviendront.`),tr('Review again →','Réviser encore →'),beginReview);else masterTier();
  }
  function finishPractice(){
    clearSession();
    const practiceScore=run.practiceScore??Math.round((run.baseCorrect/PER_TIER)*100),tierName=TIERS[run.tier],stored=run.lockedScore;
    showIntermission(tr(`${tierName} practice complete.`,`${tierName} : entraînement terminé.`),tr(`Practice score: ${practiceScore}%. Your stored ${tierName} progress remains ${stored}%. Choose any unlocked stage below.`,`Score d’entraînement : ${practiceScore} %. Ta progression ${tierName} reste à ${stored} %. Choisis un niveau débloqué ci-dessous.`),tr('Practice this stage again','Rejouer ce niveau'),()=>startTier(run.tier));
  }
  function masterTier(){const x=currentStage();x.stage.mastered=true;x.stage.missedIds=[];x.stage.completedAt=Date.now();const isMaster=run.tier===4;if(isMaster)x.cycle.completedAt=Date.now();saveContext(x.root,x.key,x.ctx);const tierName=TIERS[run.tier];if(window.CWState){CWState.addXP(180+(run.tier*40),`Brain Battle: ${tierName}`);CWState.setProgress('brainbattle',Math.round(((run.tier+1)/5)*100),{tier:tierName,score:run.lockedScore,curriculumAge:prefs.age,country:prefs.country});CWState.logActivity({id:'brain-'+Date.now(),title:`${tierName} mastered`,icon:'🧠',detail:`Initial score ${run.lockedScore}% • mastery complete`,href:'challenge.html'});if(isMaster){CWState.complete('brainbattle',{score:run.lockedScore});CWState.addAchievement('brain-master','Brain Battle Master','🧠')}}clearSession();if(isMaster)showIntermission(tr('Mission Complete!','Mission terminée !'),tr('All five stages are mastered. Your stage scores and this Mission Cycle are preserved. You can now practise any stage again with unseen questions, redo Master Mission, or start a New Mission Cycle.','Les cinq niveaux sont maîtrisés. Tes scores et ce cycle de mission sont conservés. Tu peux maintenant t’entraîner à nouveau sur n’importe quel niveau avec des questions inédites, refaire la Mission Maître ou commencer un nouveau cycle.'),tr('Start New Mission Cycle','Commencer un nouveau cycle'),startNewCycle,true);else showIntermission(tr(`${tierName} mastered.`,`${tierName} maîtrisé.`),tr(`Initial ${tierName} score remains ${run.lockedScore}%. ${TIERS[run.tier+1]} is now unlocked. You may continue forward or practise any stage already unlocked.`,`Le score initial ${tierName} reste ${run.lockedScore} %. ${TIERS[run.tier+1]} est maintenant débloqué. Tu peux continuer ou t’entraîner sur n’importe quel niveau déjà débloqué.`),tr(`Continue to ${TIERS[run.tier+1]} →`,`Continuer vers ${TIERS[run.tier+1]} →`),()=>startTier(run.tier+1));renderStageNavigators()}
  function startNewCycle(){const {root,key,ctx}=getContext(true);newCycle(ctx);saveContext(root,key,ctx);renderStageNavigators();startTier(0)}
  function showIntermission(title,copy,button,handler,isMaster=false){arena.hidden=true;results.hidden=false;$('challengeResultTitle').textContent=title;$('challengeResultCopy').textContent=copy;const b=$('againChallenge');b.textContent=button;b.onclick=handler;const restart=$('restartExplorer');restart.hidden=true;renderStageNavigators()}
  async function startFromIntro(){prefs=loadPrefs();prefs.age=Number($('cwCurriculumAge')?.value||prefs.age);prefs.country=$('cwCountrySyllabus')?.value||prefs.country;savePrefs();if(!prefs.country){alert(tr('Choose a country syllabus first.','Choisis d’abord un programme national.'));return}const {ctx}=getContext(true),cycle=activeCycle(ctx);if(cycle.completedAt){showIntermission(tr('Mission Complete!','Mission terminée !'),tr('Your completed stage scores are preserved. Choose any stage below for fresh practice, redo Master Mission, or start a New Mission Cycle.','Tes scores terminés sont conservés. Choisis un niveau ci-dessous pour un nouvel entraînement, refais la Mission Maître ou commence un nouveau cycle.'),tr('Start New Mission Cycle','Commencer un nouveau cycle'),startNewCycle,true);return}startTier(firstIncompleteTier(cycle))}
  function resetCurrentContext(){if(!prefs.country)return;if(!confirm(tr('Reset progress for this child, curriculum age, country syllabus and website language?','Réinitialiser la progression pour cet enfant, cet âge, ce programme national et cette langue du site ?')))return;const root=progressRoot(),key=contextKey(prefs.age,prefs.country,lang());delete root.contexts?.[key];localStorage.setItem(PROGRESS_KEY,JSON.stringify(root));clearPausedContext(key);clearSession();location.reload()}

  prefs=loadPrefs();ensureChooser();$('startChallenge').onclick=startFromIntro;$('nextChallenge').onclick=advance;$('resetBrain').onclick=resetCurrentContext;
  // Active sessions only resume inside the same child/age/country/language context. No silent cross-context fallback.
  const saved=safe(SESSION_KEY,null);if(saved?.run){saved.run.textResponses=saved.run.textResponses||{}}if(saved?.run&&prefs.country&&saved.run.contextKey===contextKey(prefs.age,prefs.country,lang())){run=saved.run;loadShard(run.tier).then(()=>showRunSnapshot(saved)).catch(()=>clearSession())}
})();
