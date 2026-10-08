(()=>{
  'use strict';
  const TIERS=['Explorer','Challenger','Investigator','Expert','Master Mission'];
  const PER_TIER=20;
  const PROGRESS_KEY='cw_age10_challenge_progress_v1';
  const SESSION_KEY='cw_age10_challenge_session_v1';
  const PAUSED_KEY='cw_age10_challenge_paused_runs_v1';
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
  function cleanPrompt(raw){
    let s=String(raw||'').trim();
    s=s.replace(/\s*\[Task\s+\d+\]\s*$/i,'').trim();
    s=s.replace(/^(?:Challenge|Défi)\s*\d+\s*[:：]\s*/i,'').trim();
    s=s.replace(/^.*?\s*-\s*(?:Challenge|Défi)\s*\d+\s*[:：]\s*/i,'').trim();

    // Master Mission source prompts are project briefs. Brain Battle shows the
    // same verified learning focus as a clean four-choice question; the child
    // can still explain their thinking in the optional writing box.
    let m;
    if(lang()==='en'){
      m=s.match(/^Master Mission\s+\d+\s*:\s*.*?\babout\s+(.+?)\s+within\b/i);
      if(m)return `Which statement about ${m[1].trim()} is correct?`;
    }else{
      m=s.match(/^Mission Ma[iî]tre\s+\d+\s*:\s*.*?\bsur\s+(.+?)\s+dans\b/i);
      if(m)return `Quelle affirmation sur ${m[1].trim()} est correcte ?`;
    }

    // Remove authoring / generation scaffolding. These notes belong to the
    // curriculum source, not to the child-facing Brain Battle question.
    const markers=[
      /\s+(?:Evidence cycle|Learning cycle|Cycle de preuve|Cycle d[’']apprentissage|Cycle)\s+\d+\s*[:：]\s*/i,
      /\s+(?:Topic focus|Repère du thème)\s+\d+(?:\.\d+)?\.?/i,
      /\s+(?:Mission cycle|Cycle de mission)\s+\d+\.?/i
    ];
    let cut=s.length;
    for(const re of markers){const hit=s.match(re);if(hit&&hit.index<cut)cut=hit.index}
    s=s.slice(0,cut).trim();

    // Authored inline options are used to build the buttons, but are not
    // repeated inside the question heading.
    s=s.replace(/\s+(?:Options?|Choices?)\s*:\s*[A-D][.)][\s\S]*$/i,'').trim();
    s=s.replace(/\s+(?:Options?|Choix)\s*:\s*[A-D][.)][\s\S]*$/i,'').trim();

    // Several curriculum banks use a repeated teaching template whose second
    // clause was intended for lesson planning. Present the verified concept as
    // a direct, answerable multiple-choice question instead.
    if(lang()==='en'){
      const direct=[
        [/^In one clear sentence,\s*explain\s+(.+?)\.\s*Give one simple computing example\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Explain\s+(.+?)\s+in one clear sentence for (?:an Age 10 learner|another 10-year-old)\.?$/i,m=>`Which statement about ${m[1].trim().replace(/\s+concept$/i,'')} is correct?`],
        [/^Give one accurate fact about\s+(.+?)\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What should a beginner artist remember first about\s+(.+?)\?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Explain why\s+(.+?)\s+matters\b[\s\S]*$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Give one cause, effect or consequence connected with\s+(.+?)\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How does\s+(.+?)\s+affect choices\b[\s\S]*$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Compare a sensible and less sensible use of\s+(.+?)\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How could\s+(.+?)\s+help someone plan ahead\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What trade-off or responsibility is connected with\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What evidence would help you investigate a real-world example of\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How could two different choices involving\s+(.+?)\s+lead to different outcomes\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What information should be checked before making a decision about\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Design a small investigation or comparison that tests understanding of\s+(.+?)\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What misleading assumption about\s+(.+?)\s+should an investigator avoid\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How could a table, record, receipt, advert, interview or survey help analyse\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Critique an over-simple claim about\s+(.+?)\.\s*What fuller explanation fits better\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Why is\s+(.+?)\s+more complex than one simple rule\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How could priorities or circumstances change a decision involving\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^Explain one benefit, one limitation and one risk connected with\s+(.+?)\.?$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^How could two people make different reasonable decisions about\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`],
        [/^What long-term consequence or ethical consideration should be included when explaining\s+(.+?)\??$/i,m=>`Which statement about ${m[1].trim()} is correct?`]
      ];
      for(const [re,fn] of direct){const hit=s.match(re);if(hit){s=fn(hit);break}}
    }else{
      const direct=[
        [/^En une phrase claire,\s*explique\s+(.+?)\.\s*Donne un exemple informatique simple\.?$/i,m=>`Quelle affirmation sur ${m[1].trim()} est correcte ?`],
        [/^Explique\s+(.+?)\s+en une phrase claire pour (?:un enfant de 10 ans|un élève de 10 ans)\.?$/i,m=>`Quelle affirmation sur ${m[1].trim().replace(/\s+concept$/i,'')} est correcte ?`],
        [/^Donne un fait exact sur\s+(.+?)\.?$/i,m=>`Quelle affirmation sur ${m[1].trim()} est correcte ?`]
      ];
      for(const [re,fn] of direct){const hit=s.match(re);if(hit){s=fn(hit);break}}
    }
    return s.trim();
  }
  function cleanAnswer(raw){
    let s=String(raw||'').trim();
    s=s.replace(/^Expected learning focus\s*:\s*/i,'').replace(/^Objectif d[’']apprentissage attendu\s*:\s*/i,'');
    s=s.replace(/\s+(?:Explorer|Challenger|Investigator|Expert|Master Mission|Explorateur|Investigateur|Mission Ma[iî]tre)\s*-\s*\d+\b[\s\S]*$/i,'').trim();
    return s;
  }
  function cleanGuidance(raw){return cleanAnswer(raw)}
  function loadShard(tier){return new Promise((resolve,reject)=>{
    if(Number(prefs.age)!==10)return reject(new Error('AGE_NOT_AVAILABLE'));
    const src=`js/age10-bank/${lang()}_${tier}.js`;delete window.CW_AGE10_BANK_SHARD;
    const s=document.createElement('script');s.src=src;s.onload=()=>{const sh=window.CW_AGE10_BANK_SHARD;if(!sh||sh.tier!==tier||sh.language!==lang())return reject(new Error('SHARD_INVALID'));
      bank=sh.rows.filter(r=>!r[2]||r[2]===prefs.country).map(r=>{const subject=sh.subjects[r[1]],rawQ=String(r[3]||''),q=cleanPrompt(rawQ),a=cleanAnswer(r[4]),g=cleanGuidance(r[5]||''),flags=Number(r[6]||0);return{id:r[0],tier,subject:{en:subject,fr:subject},rawQ,q:{en:q,fr:q},a:{en:a,fr:a},guidance:g,flags,topicKey:topicKeyFromId(r[0])};});
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
  function extractInlineOptions(q){const text=String(q||'');let m=text.match(/(?:options?|choices?)\s*:\s*(.+)$/i);if(m){const found=[...m[1].matchAll(/(?:^|\s)[A-D][.)]\s*([\s\S]*?)(?=(?:\s+[A-D][.)]\s)|$)/gi)].map(x=>x[1].trim()).filter(Boolean);if(found.length>=2)return found.slice(0,4)}m=text.match(/\(([^()\/]{1,30})\/([^()\/]{1,30})\)/);if(m)return[m[1].trim(),m[2].trim()];m=text.match(/\b([A-Za-zÀ-ÖØ-öø-ÿ-]{2,25})\s+(?:or|ou)\s+([A-Za-zÀ-ÖØ-öø-ÿ-]{2,25})\??\s*$/i);if(m)return[m[1].trim(),m[2].trim()];if(/\btrue\s+or\s+false\b/i.test(text))return['True','False'];if(/\bvrai\s+ou\s+faux\b/i.test(text))return['Vrai','Faux'];return[]}
  function makeChoice(text,correct=false){return{en:text,fr:text,correct}}
  function openResponseChoices(q){const wrong=lang()==='fr'?["Une réponse hors sujet qui ne répond pas à la consigne.","Une réponse vague qui n'inclut pas le détail demandé.","Une réponse qui répète seulement la consigne sans développer l'idée."]:["An unrelated response that does not answer the task.","A vague response that leaves out the detail the task asks for.","A response that only repeats the task without developing the idea."];return seededShuffle([makeChoice(q.a.en,true),...wrong.map(x=>makeChoice(x,false))],hashId(q.id)^0x51ed270b)}
  function fallbackDistractors(q){const t=answerType(q.a.en);if(lang()==='fr')return t==='short'?['Les deux autres choix','Aucun de ces choix','Pas assez d’informations']:['Cette réponse ne traite pas la question posée.','Cette réponse affirme l’inverse de l’idée attendue.','Il n’y a pas assez d’éléments pour soutenir cette réponse.'];return t==='short'?['Both of the other choices','None of these choices','Not enough information']:['This response does not address the question asked.','This response states the opposite of the required idea.','There is not enough information to support this response.']}
  function buildChoices(q){
    if(q.flags&OPEN_RESPONSE)return openResponseChoices(q);
    const seed=hashId(q.id),correct=q.a.en,authored=extractInlineOptions(q.rawQ||q.q.en),choices=[makeChoice(correct,true)],used=new Set([normalAnswer(correct)]);
    const correctNorm=normalAnswer(correct);
    if(authored.length>=2&&authored.some(x=>correctNorm===normalAnswer(x)||correctNorm.startsWith(normalAnswer(x)+' '))){
      for(const x of authored){const nx=normalAnswer(x);if(!nx||used.has(nx)||correctNorm===nx)continue;choices.push(makeChoice(x,false));used.add(nx)}
      if(authored.length===2){for(const x of (lang()==='fr'?['Les deux','Aucun des deux']:['Both','Neither']))if(!used.has(normalAnswer(x))){choices.push(makeChoice(x,false));used.add(normalAnswer(x))}}
    }
    const bucket=topicBuckets.get(q.topicKey)||[];const wantedType=answerType(correct),sk=styleKey(q.q.en);const scored=[];
    for(const x of bucket){if(x.id===q.id||answerEquivalent(correct,x.a.en))continue;const nx=normalAnswer(x.a.en);if(!nx||used.has(nx))continue;const guideCross=Math.max(tokenOverlap(correct,x.guidance||''),tokenOverlap(q.guidance||'',x.a.en));if(wantedType==='long'&&guideCross>.28)continue;let score=tokenOverlap(q.q.en,x.q.en);if(styleKey(x.q.en)===sk)score+=.85;if(questionMode(x.q.en)===questionMode(q.q.en))score+=.45;const candidateType=answerType(x.a.en);if(candidateType===wantedType)score+=.35;else if(wantedType==='long')score-=.30;else if(wantedType==='short'||wantedType==='num')score-=.25;score-=tokenOverlap(correct,x.a.en)*.35;score-=guideCross*.45;scored.push([score,hashId(x.id)^seed,x.a.en])}
    scored.sort((a,b)=>b[0]-a[0]||a[1]-b[1]);for(const [score,,ans] of scored){if(score<.18)continue;const n=normalAnswer(ans);if(used.has(n))continue;choices.push(makeChoice(ans,false));used.add(n);if(choices.length===4)break}
    for(const ans of fallbackDistractors(q)){if(choices.length===4)break;const n=normalAnswer(ans);if(!used.has(n)){choices.push(makeChoice(ans,false));used.add(n)}}
    return seededShuffle(choices.slice(0,4),seed^0x85ebca6b)
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
    const card=$('challengeQuestion')?.closest('.challenge-card');if(!card)return{};let guide=$('cwAnswerGuide'),wrap=$('cwWrittenWrap'),ta=$('cwWrittenResponse'),status=$('cwWrittenStatus');
    if(!guide){guide=document.createElement('p');guide.id='cwAnswerGuide';guide.style.cssText='margin:8px 0 0;color:#9fb8d1;font-size:.82rem;line-height:1.45';$('challengeOptions').before(guide)}
    if(!wrap){wrap=document.createElement('div');wrap.id='cwWrittenWrap';wrap.style.cssText='margin-top:14px;padding:14px;border:1px solid rgba(93,228,255,.18);border-radius:16px;background:rgba(4,20,38,.34)';wrap.innerHTML=`<label for="cwWrittenResponse" style="display:block;font-weight:850;color:#d9f7ff;margin-bottom:7px"></label><textarea id="cwWrittenResponse" rows="4" style="width:100%;box-sizing:border-box;resize:vertical;border:1px solid rgba(255,255,255,.16);border-radius:13px;background:#07182a;color:#eef8ff;padding:11px 12px;font:inherit;line-height:1.45;outline:none"></textarea><small id="cwWrittenStatus" style="display:block;margin-top:7px;color:#91a9c0;line-height:1.4"></small>`;$('challengeOptions').after(wrap);ta=$('cwWrittenResponse');status=$('cwWrittenStatus')}
    return{guide,wrap,ta,status}
  }
  function responseTokens(text){const stop=lang()==='fr'?STOP_FR:STOP_EN;return new Set((String(text||'').toLowerCase().match(/[a-zà-öø-ÿ']+/g)||[]).filter(w=>w.length>2&&!stop.has(w)))}
  function explanationResult(text){const t=String(text||'').trim();if(!t)return{pass:false,empty:true};const A=responseTokens(t),B=responseTokens(`${current.a.en} ${current.guidance||''}`);let shared=0;for(const x of A)if(B.has(x))shared++;const ratio=shared/Math.max(1,Math.min(8,B.size));const similar=answerEquivalent(t,current.a.en);return{pass:similar||(shared>=2&&ratio>=.22),empty:false,shared,ratio}}
  function updateWrittenStatus(){if(!(current?.flags&NEED_TEXT))return;const ui=ensureWrittenUI(),text=ui.ta?.value||'',r=explanationResult(text);run.textResponses=run.textResponses||{};run.textResponses[current.id]=text;if(r.empty){ui.status.textContent=tr('Your written explanation is practice. It does not reduce the four-choice score.','Ton explication écrite est un entraînement. Elle ne réduit pas le score des quatre choix.');ui.status.style.color='#91a9c0'}else if(r.pass){ui.status.textContent=tr('✅ Explanation check: Pass — your wording is close to the expected idea.','✅ Vérification de l’explication : validée — ta formulation est proche de l’idée attendue.');ui.status.style.color='#7debb4'}else{ui.status.textContent=tr('✍️ Response saved. Keep it clear and relevant; the four-choice answer controls the score.','✍️ Réponse enregistrée. Reste clair et pertinent ; le choix parmi quatre contrôle le score.');ui.status.style.color='#b7c8d8'}saveSession()}
  function renderWrittenUI(){const ui=ensureWrittenUI(),needed=!!(current.flags&NEED_TEXT),open=!!(current.flags&OPEN_RESPONSE);setHidden(ui.guide,!needed);setHidden(ui.wrap,!needed);if(!needed)return;ui.guide.textContent=open?tr('Choose what a strong answer should include, then write your own response below.','Choisis ce qu’une bonne réponse doit contenir, puis écris ta propre réponse ci-dessous.'):tr('Choose the best answer. You can also explain your thinking below.','Choisis la meilleure réponse. Tu peux aussi expliquer ton raisonnement ci-dessous.');ui.wrap.querySelector('label').textContent=open?tr('Your own response (practice)','Ta propre réponse (entraînement)'):tr('Explain your thinking (practice)','Explique ton raisonnement (entraînement)');ui.ta.placeholder=open?tr('Write your response here…','Écris ta réponse ici…'):tr('Write a short explanation here…','Écris une courte explication ici…');run.textResponses=run.textResponses||{};ui.ta.value=run.textResponses[current.id]||'';ui.ta.oninput=()=>updateWrittenStatus();updateWrittenStatus()}
  function nextQuestion(){if(!run)return;if(run.position>=run.queue.length){return run.phase==='base'?finishBaseRound():finishReviewRound()}current=findQuestion(run.queue[run.position]);if(!current){alert(tr('A verified question could not be loaded. No fallback was used.','Une question vérifiée n’a pas pu être chargée. Aucun contenu de secours n’a été utilisé.'));return}current.choices=buildChoices(current);current.hint={en:current.guidance||tr('Review the question carefully.','Relis attentivement la question.'),fr:current.guidance||tr('Review the question carefully.','Relis attentivement la question.')};current.why={en:current.guidance||current.a.en,fr:current.guidance||current.a.en};answered=false;answerState=null;renderQuestion();saveSession()}
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
