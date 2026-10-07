(()=>{
  'use strict';
  const TIERS=['Explorer','Challenger','Investigator','Expert','Master Mission'];
  const PER_TIER=20;
  const PROGRESS_KEY='cw_age10_challenge_progress_v1';
  const SESSION_KEY='cw_age10_challenge_session_v1';
  const PREF_KEY='cw_age10_challenge_preferences_v1';
  const AGE_ACCESS_KEY='cw_curriculum_access_v1';
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
  let run=null,current=null,answered=false,answerState=null,bank=[],bankMap=new Map(),prefs=null;

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
    const box=document.createElement('div');box.id='cwSyllabusChooser';box.className='membership-card';box.style.margin='18px 0';
    box.innerHTML=`<b>${tr('Choose curriculum for this mission','Choisis le programme de cette mission')}</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:12px"><label>${tr('Curriculum age','Âge du programme')}<select id="cwCurriculumAge" style="width:100%;margin-top:6px"></select></label><label>${tr('Country syllabus','Programme du pays')}<select id="cwCountrySyllabus" style="width:100%;margin-top:6px"><option value="">${tr('Choose…','Choisir…')}</option><option value="UK">🇬🇧 ${tr('United Kingdom','Royaume-Uni')}</option><option value="FR">🇫🇷 France</option></select></label></div><small id="cwChooserNote" style="display:block;margin-top:10px"></small>`;
    intro.querySelector('.challenge-intro-actions')?.before(box);
    const age=$('cwCurriculumAge');for(const n of unlockedAges()){const o=document.createElement('option');o.value=n;o.textContent=`Age ${n}`;age.appendChild(o)}
    age.value=String(prefs.age);$('cwCountrySyllabus').value=prefs.country||'';
    const sync=()=>{prefs.age=Number(age.value);prefs.country=$('cwCountrySyllabus').value||null;savePrefs();updateChooserNote();renderStageNavigators()};age.onchange=sync;$('cwCountrySyllabus').onchange=sync;updateChooserNote();
    ensureStageNavigator(intro,'cwIntroStageNavigator',intro.querySelector('.challenge-intro-actions'));
    ensureStageNavigator(results,'cwResultStageNavigator',results.querySelector('.challenge-result-actions'));
    renderStageNavigators();
  }
  function updateChooserNote(){const n=$('cwChooserNote');if(!n)return;if(!prefs.country)n.textContent=tr('Website language stays separate. Choose a country syllabus to begin.','La langue du site reste séparée. Choisis un programme national pour commencer.');else n.textContent=tr(`Website language: ${lang()==='en'?'English':'French'} • ${countryName(prefs.country)} syllabus • Age ${prefs.age}`,`Langue du site : ${lang()==='en'?'anglais':'français'} • programme ${countryName(prefs.country)} • ${prefs.age} ans`)}
  function ensureStageNavigator(parent,id,beforeNode){
    if($(id))return;
    const wrap=document.createElement('div');wrap.id=id;wrap.style.margin='16px 0';wrap.innerHTML=`<small style="display:block;margin-bottom:8px;font-weight:700">${tr('Choose an unlocked stage','Choisis un niveau débloqué')}</small><div data-stage-buttons style="display:flex;flex-wrap:wrap;gap:8px"></div>`;
    parent.insertBefore(wrap,beforeNode||null);
  }
  function stageButtonLabel(stage,i){const score=stage?.initialScore;const done=stage?.mastered?' ✓':'';return `${TIERS[i]}${score!=null?` • ${score}%`:''}${done}`}
  function renderStageNavigator(id){
    const wrap=$(id);if(!wrap)return;
    const box=wrap.querySelector('[data-stage-buttons]');box.innerHTML='';
    if(!prefs?.country){wrap.hidden=true;return}wrap.hidden=false;
    const {ctx}=getContext(true),cycle=activeCycle(ctx),unlocked=new Set(unlockedTierIndexes(cycle));
    for(let i=0;i<TIERS.length;i++){
      const b=document.createElement('button');b.type='button';b.className='btn small secondary';b.textContent=stageButtonLabel(cycle.stages[i],i);b.disabled=!unlocked.has(i);b.title=b.disabled?tr('Complete the previous stage first.','Termine d’abord le niveau précédent.'):'';
      b.onclick=()=>startTier(i);box.appendChild(b);
    }
  }
  function renderStageNavigators(){renderStageNavigator('cwIntroStageNavigator');renderStageNavigator('cwResultStageNavigator')}

  function loadShard(tier){return new Promise((resolve,reject)=>{
    if(Number(prefs.age)!==10)return reject(new Error('AGE_NOT_AVAILABLE'));
    const src=`js/age10-bank/${lang()}_${tier}.js`;delete window.CW_AGE10_BANK_SHARD;
    const s=document.createElement('script');s.src=src;s.onload=()=>{const sh=window.CW_AGE10_BANK_SHARD;if(!sh||sh.tier!==tier||sh.language!==lang())return reject(new Error('SHARD_INVALID'));bank=sh.rows.filter(r=>!r[2]||r[2]===prefs.country).map(r=>{const subject=sh.subjects[r[1]],q=r[3],a=r[4],g=r[5]||'';return{id:r[0],tier,subject:{en:subject,fr:subject},q:{en:q,fr:q},a:{en:a,fr:a},guidance:g};});bankMap=new Map(bank.map(q=>[q.id,q]));s.remove();resolve(bank)};s.onerror=()=>reject(new Error('SHARD_LOAD_FAILED'));document.head.appendChild(s)
  })}
  function hashId(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function seededShuffle(items,seed){const x=[...items];let n=seed>>>0;for(let i=x.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[x[i],x[j]]=[x[j],x[i]]}return x}
  function buildChoices(q){const seed=hashId(q.id),answers=[q.a.en];const same=seededShuffle(bank.filter(x=>x.id!==q.id&&x.subject.en===q.subject.en&&x.a.en!==q.a.en),seed);for(const x of same){if(!answers.includes(x.a.en))answers.push(x.a.en);if(answers.length===4)break}if(answers.length<4){for(const x of seededShuffle(bank,seed^0x9e3779b9)){if(!answers.includes(x.a.en))answers.push(x.a.en);if(answers.length===4)break}}return seededShuffle(answers,seed^0x85ebca6b).map(v=>({en:v,fr:v}))}
  function select20Unseen(pool,seen){const seenSet=new Set(seen||[]),unique=[...new Map(pool.map(q=>[q.id,q])).values()],unseen=shuffle(unique.filter(q=>!seenSet.has(q.id)));return unseen.length>=PER_TIER?unseen.slice(0,PER_TIER):[]}
  function saveSession(){if(run)localStorage.setItem(SESSION_KEY,JSON.stringify({run,answered,answerState,updatedAt:Date.now()}))}
  function clearSession(){localStorage.removeItem(SESSION_KEY)}

  async function startTier(tierIndex){
    if(!prefs.country){alert(tr('Choose a country syllabus first.','Choisis d’abord un programme national.'));return}
    if(prefs.age!==10){alert(tr(`Age ${prefs.age} is unlocked for this child, but its verified Challenge bank is not installed yet. Age 10 progress is untouched.`,`Le programme ${prefs.age} ans est déverrouillé, mais sa banque Challenge vérifiée n’est pas encore installée. La progression 10 ans reste intacte.`));return}
    try{await loadShard(tierIndex)}catch(e){alert(tr('This verified curriculum bank is unavailable. No fallback was used.','Cette banque de programme vérifiée est indisponible. Aucun contenu de secours n’a été utilisé.'));return}
    if(bank.length<PER_TIER){alert(tr('Not enough verified eligible questions for this syllabus/stage. No fallback was used.','Pas assez de questions vérifiées éligibles pour ce programme/niveau. Aucun contenu de secours n’a été utilisé.'));return}
    const {root,key,ctx}=getContext(true),cycle=activeCycle(ctx),stage=cycle.stages[tierIndex];
    if(!isTierUnlocked(cycle,tierIndex)){alert(tr('Complete the previous stage first.','Termine d’abord le niveau précédent.'));return}

    if(stage.mastered){
      const picked=select20Unseen(bank,ctx.seenIds);
      if(picked.length<PER_TIER){alert(tr('There are not 20 unseen questions left in this stage for this syllabus. No repeated questions were used.','Il ne reste pas 20 questions inédites dans ce niveau pour ce programme. Aucune question répétée n’a été utilisée.'));return}
      const ids=picked.map(q=>q.id);ctx.seenIds=[...new Set([...ctx.seenIds,...ids])];saveContext(root,key,ctx);
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'practice',phase:'base',queue:ids,position:0,missed:[],attempts:{},streak:0,baseAnswered:0,baseCorrect:0,lockedScore:stage.initialScore,practiceScore:null};
    }else if(stage.initialScore!=null&&stage.missedIds?.length){
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'progression',phase:'review',queue:shuffle(stage.missedIds),position:0,missed:[...stage.missedIds],attempts:{},streak:0,baseAnswered:PER_TIER,baseCorrect:stage.baseCorrect||0,lockedScore:stage.initialScore};
    }else{
      let ids=stage.baseIds;
      if(!ids.length){
        const picked=select20Unseen(bank,ctx.seenIds);
        if(picked.length<PER_TIER){alert(tr('There are not 20 unseen questions left in this stage for this syllabus. No repeated questions were used.','Il ne reste pas 20 questions inédites dans ce niveau pour ce programme. Aucune question répétée n’a été utilisée.'));return}
        ids=picked.map(q=>q.id);stage.baseIds=ids;stage.baseCorrect=0;stage.initialScore=null;stage.missedIds=[];ctx.seenIds=[...new Set([...ctx.seenIds,...ids])];saveContext(root,key,ctx);
      }
      run={contextKey:key,cycleId:cycle.id,tier:tierIndex,mode:'progression',phase:'base',queue:[...ids],position:0,missed:[...stage.missedIds],attempts:{},streak:0,baseAnswered:0,baseCorrect:0,lockedScore:stage.initialScore};
    }
    answered=false;answerState=null;saveSession();intro.hidden=true;results.hidden=true;arena.hidden=false;nextQuestion();
  }
  function findQuestion(id){return bankMap.get(id)}
  function txt(obj){return obj?.[lang()] ?? ''}
  function nextQuestion(){if(!run)return;if(run.position>=run.queue.length){return run.phase==='base'?finishBaseRound():finishReviewRound()}current=findQuestion(run.queue[run.position]);if(!current){alert(tr('A verified question could not be loaded. No fallback was used.','Une question vérifiée n’a pas pu être chargée. Aucun contenu de secours n’a été utilisé.'));return}current.choices=buildChoices(current);current.hint={en:current.guidance||tr('Review the question carefully.','Relis attentivement la question.'),fr:current.guidance||tr('Review the question carefully.','Relis attentivement la question.')};current.why={en:current.guidance||current.a.en,fr:current.guidance||current.a.en};answered=false;answerState=null;renderQuestion();saveSession()}
  function renderQuestion(){$('tierName').textContent=TIERS[run.tier];$('challengeScore').textContent=scoreText();$('challengeStreak').textContent=run.streak;$('challengeProgress').textContent=`${run.position+1} / ${run.queue.length}`;$('challengePhase').textContent=run.phase==='base'?(run.mode==='practice'?tr('Practice round','Série d’entraînement'):tr('Main round','Série principale')):tr('Review round','Révision');$('challengeSubject').textContent=txt(current.subject);$('challengeQuestion').textContent=txt(current.q);$('difficultyPips').innerHTML=Array.from({length:5},(_,i)=>`<i class="${i<=run.tier?'on':''}"></i>`).join('');$('challengeFeedback').textContent='';$('nextChallenge').hidden=true;$('provePanel').hidden=true;const choices=shuffle(current.choices);const box=$('challengeOptions');box.innerHTML=choices.map((c,i)=>`<button type="button" data-choice="${i}"></button>`).join('');box.querySelectorAll('button').forEach((b,i)=>{b.textContent=txt(choices[i]);b.dataset.answer=choices[i].en;b.onclick=()=>answer(b,choices[i])})}
  function feedbackForState(state){if(state.correct)return tr('✅ Correct. Keep going.','✅ Correct. Continue.');const attempts=run.attempts[current.id]||1;return attempts>=2?tr(`Not quite. Hint: ${txt(current.hint)} This question will return.`,`Pas encore. Indice : ${txt(current.hint)} Cette question reviendra.`):tr('Not quite. This question will return in your review round.','Pas encore. Cette question reviendra pendant la révision.')}
  function answer(btn,choice){if(answered)return;answered=true;const correct=choice.en===current.a.en;run.attempts[current.id]=(run.attempts[current.id]||0)+1;document.querySelectorAll('#challengeOptions button').forEach(b=>{b.disabled=true;if(b.dataset.answer===current.a.en)b.classList.add('correct')});if(correct){btn.classList.add('correct');run.streak++;run.missed=run.missed.filter(id=>id!==current.id);if(run.phase==='base')run.baseCorrect++;if(run.tier>=2){$('provePanel').hidden=false;$('provePanel').innerHTML=`<span class="eyebrow">${tr('WHY IT WORKS','POURQUOI')}</span><p>${txt(current.why)}</p>`}window.playTone?.(true)}else{btn.classList.add('wrong');run.streak=0;if(!run.missed.includes(current.id))run.missed.push(current.id);window.playTone?.(false)}if(run.phase==='base')run.baseAnswered++;answerState={choice:choice.en,correct};$('challengeFeedback').textContent=feedbackForState(answerState);$('challengeScore').textContent=scoreText();$('challengeStreak').textContent=run.streak;$('nextChallenge').textContent=run.position===run.queue.length-1?tr('Finish round →','Terminer la série →'):tr('Next challenge →','Question suivante →');$('nextChallenge').hidden=false;saveSession()}
  function advance(){if(!run||!answered)return;run.position++;answered=false;answerState=null;saveSession();nextQuestion()}
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
  function resetCurrentContext(){if(!prefs.country)return;if(!confirm(tr('Reset progress for this child, curriculum age, country syllabus and website language?','Réinitialiser la progression pour cet enfant, cet âge, ce programme national et cette langue du site ?')))return;const root=progressRoot(),key=contextKey(prefs.age,prefs.country,lang());delete root.contexts?.[key];localStorage.setItem(PROGRESS_KEY,JSON.stringify(root));clearSession();location.reload()}

  prefs=loadPrefs();ensureChooser();$('startChallenge').onclick=startFromIntro;$('nextChallenge').onclick=advance;$('resetBrain').onclick=resetCurrentContext;
  // Active sessions only resume inside the same child/age/country/language context. No silent cross-context fallback.
  const saved=safe(SESSION_KEY,null);if(saved?.run&&prefs.country&&saved.run.contextKey===contextKey(prefs.age,prefs.country,lang())){run=saved.run;answered=saved.answered;answerState=saved.answerState;loadShard(run.tier).then(()=>{intro.hidden=true;results.hidden=true;arena.hidden=false;current=findQuestion(run.queue[run.position]);if(!current)return;current.choices=buildChoices(current);current.hint={en:current.guidance||'',fr:current.guidance||''};current.why={en:current.guidance||current.a.en,fr:current.guidance||current.a.en};renderQuestion();if(answered&&answerState){const buttons=[...document.querySelectorAll('#challengeOptions button')];buttons.forEach(b=>{b.disabled=true;if(b.dataset.answer===current.a.en)b.classList.add('correct');if(b.dataset.answer===answerState.choice&&!answerState.correct)b.classList.add('wrong')});$('challengeFeedback').textContent=feedbackForState(answerState);$('nextChallenge').hidden=false}}).catch(()=>clearSession())}
})();
