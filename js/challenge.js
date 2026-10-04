(()=>{
  'use strict';
  const C=window.CWCurriculum;
  if(!C)return;
  const {TIERS,COUNTRIES,PER_STAGE}=C;
  const M=window.CWChallengeModel;
  const STORAGE='cw_brain_battle_v5';
  const SESSION='cw_brain_battle_active_v3';
  const $=id=>document.getElementById(id);
  const intro=$('challengeIntro'), syllabus=$('syllabusPanel'), arena=$('challengeArena'), results=$('challengeResults');
  let run=null,current=null,answered=false,answerState=null;

  const lang=()=>window.CWLang?.current?.()||'en';
  // Strict delivery-language rule: no cross-language fallback for curriculum fields.
  const txt=(obj)=>obj&&typeof obj==='object'&&Object.prototype.hasOwnProperty.call(obj,lang())?obj[lang()]:null;
  const tr=(en,fr)=>lang()==='fr'?fr:en;
  const shuffle=a=>M.shuffled(a);
  const keyFor=(childId,age,country)=>`${childId}:${age}:${country}`;
  const pct=n=>M.initialScore(n,PER_STAGE);
  const loadAll=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{"profiles":{}}')}catch(_){return {profiles:{}}}};
  const saveAll=s=>{localStorage.setItem(STORAGE,JSON.stringify(s));return s};
  function profile(){const p=C.preferences();const all=loadAll();return all.profiles?.[keyFor(p.childId,p.age,p.country)]||{childId:p.childId,age:p.age,country:p.country,cycles:[],activeCycle:1,seenIds:[]}}
  function saveProfile(pf){const all=loadAll();all.profiles=all.profiles||{};all.profiles[keyFor(pf.childId||C.childId(),pf.age,pf.country)]=pf;saveAll(all);return pf}
  function currentCycle(pf=profile()){let c=pf.cycles.find(x=>x.number===pf.activeCycle);if(!c){c={number:pf.activeCycle,stages:{},completed:false,startedAt:Date.now()};pf.cycles.push(c);saveProfile(pf)}return c}
  function stageState(tier,pf=profile()){const c=currentCycle(pf);return c.stages[tier]||null}
  function firstIncompleteTier(){const pf=profile(),c=currentCycle(pf);if(c.completed)return null;for(let i=0;i<TIERS.length;i++)if(!c.stages[i]?.mastered)return i;return 4}
  function saveSession(){if(run)localStorage.setItem(SESSION,JSON.stringify({run,answered,answerState,updatedAt:Date.now()}))}
  const clearSession=()=>localStorage.removeItem(SESSION);
  function loadSession(){try{const s=JSON.parse(localStorage.getItem(SESSION)||'null');const p=C.preferences();if(!s?.run||s.run.childId!==p.childId||s.run.age!==p.age||s.run.country!==p.country)return null;return s}catch(_){return null}}
  function qById(id){return C.findByConcept(id,lang())}
  function languageComplete(q){return !!(txt(q.q)&&txt(q.a))}
  function poolFor(tier){const p=C.preferences();return C.eligible({age:p.age,country:p.country,tier,language:lang()}).filter(languageComplete)}
  function chooseQuestions(tier){
    const pf=profile();return M.selectUnseenFirst(poolFor(tier),pf.seenIds||[],PER_STAGE);
  }
  function ensureReady(tier){
    const pool=poolFor(tier),ids=new Set(pool.map(q=>q.conceptId||q.id));
    if(pool.length<PER_STAGE||ids.size<PER_STAGE){showDataBlock(tier,pool.length);return false}
    return true;
  }
  function startTier(tier=firstIncompleteTier()){
    const p=C.preferences();if(!p.country)return showSyllabus();if(Number(p.age)!==10)return showUnavailableAge(p.age);const pf=profile(),cycle=currentCycle(pf);if(cycle.completed||tier===null)return showMissionComplete(cycle);
    if(!ensureReady(tier))return;
    const questions=chooseQuestions(tier);
    run={childId:p.childId,age:p.age,country:p.country,cycle:profile().activeCycle,tier,phase:'base',queue:questions.map(q=>q.conceptId||q.id),position:0,missed:[],attempts:{},baseCorrect:0,baseAnswers:0,streak:0,initialScore:null};
    answered=false;answerState=null;saveSession();intro.hidden=true;syllabus.hidden=true;results.hidden=true;arena.hidden=false;nextQuestion();
  }
  function nextQuestion(){
    if(!run)return;
    if(run.position>=run.queue.length)return run.phase==='base'?finishBaseRound():finishReviewRound();
    current=qById(run.queue[run.position]);if(!current||!languageComplete(current)){return showDataBlock(run.tier,0)}
    answered=false;answerState=null;renderQuestion();saveSession();
  }
  function renderQuestion(){
    $('tierName').textContent=TIERS[run.tier];
    $('challengeScore').textContent=run.phase==='base'?`${run.baseCorrect} / ${PER_STAGE}`:`${run.initialScore}%`;
    $('challengeStreak').textContent=run.streak;
    $('challengeProgress').textContent=`${run.position+1} / ${run.queue.length}`;
    $('challengePhase').textContent=run.phase==='base'?tr('Main round','Série principale'):tr('Mastery review • original score stays fixed','Révision de maîtrise • le score initial reste fixe');
    $('challengeSubject').textContent=txt(current.subject)||current.subjectCode||'CURRICULUM';
    $('challengeQuestion').textContent=txt(current.q)||tr('This question is unavailable in the selected website language.','Cette question est indisponible dans la langue choisie.');
    $('missionContext').textContent=`${COUNTRIES[run.country]?.flag||''} ${txt(COUNTRIES[run.country]?.label)||run.country} • Age ${run.age} • ${tr('Mission','Mission')} ${run.cycle}`;
    $('difficultyPips').innerHTML=Array.from({length:5},(_,i)=>`<i class="${i<=run.tier?'on':''}"></i>`).join('');
    $('challengeFeedback').textContent='';$('nextChallenge').hidden=true;$('provePanel').hidden=true;
    const box=$('challengeOptions'),open=$('openResponse');box.innerHTML='';open.hidden=true;$('openAnswerKey').hidden=true;$('openSelfCheck').hidden=true;$('openAnswer').value='';$('openAnswer').disabled=false;$('revealAnswer').disabled=false;$('selfCorrect').disabled=false;$('selfReview').disabled=false;
    if(Array.isArray(current.choices)&&current.choices.length>=2&&current.choices.every(c=>txt(c))){
      const choices=shuffle(current.choices);box.hidden=false;box.innerHTML=choices.map((_,i)=>`<button type="button" data-choice="${i}"></button>`).join('');
      box.querySelectorAll('button').forEach((b,i)=>{b.textContent=txt(choices[i]);b.dataset.answerId=String(current.choices.indexOf(choices[i]));b.onclick=()=>answer(b,choices[i])});
    }else{
      box.hidden=true;open.hidden=false;$('revealAnswer').onclick=()=>{const guide=txt(current.why)||txt(current.guidance)||'';$('openAnswerKey').hidden=false;$('openAnswerKey').innerHTML=`<span class="eyebrow">${tr('EXPECTED ANSWER / SUCCESS CRITERIA','RÉPONSE ATTENDUE / CRITÈRES')}</span><p><b>${txt(current.a)}</b></p>${guide?`<p>${guide}</p>`:''}`;$('openSelfCheck').hidden=false};$ ('selfCorrect').onclick=()=>answerOpen(true);$('selfReview').onclick=()=>answerOpen(false);
    }
  }
  function isCorrectChoice(choice){const answer=txt(current.a);return txt(choice)===answer}
  function feedbackForState(state){
    if(state.correct)return tr('✅ Correct. Keep going.','✅ Correct. Continue.');
    const attempts=run.attempts[current.conceptId||current.id]||1;
    const hint=txt(current.hint);
    if(attempts>=2&&hint)return tr(`Not quite. Hint: ${hint} This question will return.`,`Pas encore. Indice : ${hint} Cette question reviendra.`);
    return tr('Not quite. This question will return in mastery review.','Pas encore. Cette question reviendra pendant la révision de maîtrise.');
  }
  function answer(btn,choice){
    if(answered)return;answered=true;const correct=isCorrectChoice(choice);run.attempts[current.conceptId||current.id]=(run.attempts[current.conceptId||current.id]||0)+1;
    document.querySelectorAll('#challengeOptions button').forEach(b=>{b.disabled=true;const idx=Number(b.dataset.answerId);if(isCorrectChoice(current.choices[idx]))b.classList.add('correct')});
    if(correct){btn.classList.add('correct');run.streak++;if(run.phase==='base'){run.baseCorrect++;run.baseAnswers++}run.missed=run.missed.filter(id=>id!==(current.conceptId||current.id));const why=txt(current.why);if(correct&&run.tier>=2&&why){$('provePanel').hidden=false;$('provePanel').innerHTML=`<span class="eyebrow">${tr('WHY IT WORKS','POURQUOI')}</span><p>${why}</p>`}window.playTone?.(true)}
    else{btn.classList.add('wrong');run.streak=0;if(run.phase==='base')run.baseAnswers++;if(!run.missed.includes(current.conceptId||current.id))run.missed.push(current.conceptId||current.id);window.playTone?.(false)}
    answerState={choiceText:txt(choice),correct};$('challengeFeedback').textContent=feedbackForState(answerState);$('challengeScore').textContent=run.phase==='base'?`${run.baseCorrect} / ${PER_STAGE}`:`${run.initialScore}%`;$('challengeStreak').textContent=run.streak;
    $('nextChallenge').textContent=run.position===run.queue.length-1?tr('Finish round →','Terminer la série →'):tr('Next challenge →','Question suivante →');$('nextChallenge').hidden=false;saveSession();
  }

  function answerOpen(correct){
    if(answered)return;answered=true;run.attempts[current.conceptId||current.id]=(run.attempts[current.conceptId||current.id]||0)+1;
    $('openAnswer').disabled=true;$('revealAnswer').disabled=true;$('selfCorrect').disabled=true;$('selfReview').disabled=true;
    if(correct){run.streak++;if(run.phase==='base'){run.baseCorrect++;run.baseAnswers++}run.missed=run.missed.filter(id=>id!==(current.conceptId||current.id));window.playTone?.(true)}
    else{run.streak=0;if(run.phase==='base')run.baseAnswers++;if(!run.missed.includes(current.conceptId||current.id))run.missed.push(current.conceptId||current.id);window.playTone?.(false)}
    answerState={open:true,typed:$('openAnswer').value,correct};$('challengeFeedback').textContent=feedbackForState(answerState);$('challengeScore').textContent=run.phase==='base'?`${run.baseCorrect} / ${PER_STAGE}`:`${run.initialScore}%`;$('challengeStreak').textContent=run.streak;$('nextChallenge').textContent=run.position===run.queue.length-1?tr('Finish round →','Terminer la série →'):tr('Next challenge →','Question suivante →');$('nextChallenge').hidden=false;saveSession();
  }
  function restoreAnsweredState(state){
    if(!state)return;answered=true;answerState=state;if(state.open){$('openAnswer').value=state.typed||'';$('openAnswer').disabled=true;$('revealAnswer').click();$('revealAnswer').disabled=true;$('selfCorrect').disabled=true;$('selfReview').disabled=true}else{const buttons=[...document.querySelectorAll('#challengeOptions button')];buttons.forEach(b=>{b.disabled=true;const idx=Number(b.dataset.answerId);if(isCorrectChoice(current.choices[idx]))b.classList.add('correct');if(b.textContent===state.choiceText&&!state.correct)b.classList.add('wrong')})}$('challengeFeedback').textContent=feedbackForState(state);$('nextChallenge').hidden=false;
  }
  function advance(){if(!run||!answered)return;run.position++;answered=false;answerState=null;saveSession();nextQuestion()}
  function persistInitialStage(){
    const pf=profile(),cycle=currentCycle(pf);run.initialScore=pct(run.baseCorrect);cycle.stages[run.tier]={tier:run.tier,initialCorrect:run.baseCorrect,initialScore:run.initialScore,mastered:false,questionIds:[...run.queue],missedInitial:[...run.missed],startedAt:cycle.stages[run.tier]?.startedAt||Date.now(),updatedAt:Date.now()};
    const seen=new Set(pf.seenIds||[]);run.queue.forEach(id=>seen.add(id));pf.seenIds=[...seen];saveProfile(pf);
  }
  function finishBaseRound(){persistInitialStage();saveSession();if(run.missed.length){showIntermission(`${run.initialScore}% • ${run.missed.length} ${tr('to master','à maîtriser')}`,tr('That is your official stage score. It will not change. Now master only the questions you missed before moving up.','C’est ton score officiel pour cette étape. Il ne changera pas. Maintenant, maîtrise uniquement les questions manquées avant de progresser.'),tr('Start mastery review →','Commencer la révision →'),beginReview)}else masterTier()}
  function beginReview(){run.phase='review';run.queue=shuffle(run.missed);run.position=0;answered=false;answerState=null;saveSession();results.hidden=true;arena.hidden=false;nextQuestion()}
  function finishReviewRound(){saveSession();if(run.missed.length){showIntermission(`${run.initialScore}% • ${run.missed.length} ${tr('still to master','encore à maîtriser')}`,tr('Your original score is unchanged. These missed questions will return again until they are mastered.','Ton score initial ne change pas. Ces questions reviendront jusqu’à leur maîtrise.'),tr('Review again →','Réviser encore →'),beginReview)}else masterTier()}
  function masterTier(){
    const pf=profile(),cycle=currentCycle(pf),st=cycle.stages[run.tier]||{};st.mastered=true;st.masteredAt=Date.now();st.initialScore=run.initialScore??st.initialScore;cycle.stages[run.tier]=st;
    const tierName=TIERS[run.tier],isMaster=run.tier===4;
    if(isMaster){cycle.completed=true;cycle.completedAt=Date.now();cycle.overallScore=M.missionOverall(TIERS.map((_,i)=>cycle.stages[i]?.initialScore||0))}
    saveProfile(pf);clearSession();
    if(window.CWState){CWState.addXP(180+(run.tier*40),`Brain Battle: ${tierName}`);CWState.setProgress(`brainbattle-age${run.age}-${run.country}`,Math.round(((run.tier+1)/TIERS.length)*100),{tier:tierName,initialScore:st.initialScore,mastery:'complete',cycle:run.cycle});CWState.logActivity({id:`brain-${run.age}-${run.country}-${run.cycle}-${run.tier}`,title:`${tierName} mastered`,icon:'🧠',detail:`Initial score ${st.initialScore}% • mastery complete`,href:'challenge.html'});if(isMaster){CWState.addAchievement(`brain-master-${run.age}-${run.country}-${run.cycle}`,`Age ${run.age} Mission ${run.cycle} Mastered`,'🧠');CWState.addPassport(`brain-${run.age}-${run.country}-${run.cycle}`,{title:`Age ${run.age} Mission ${run.cycle}`,country:run.country})}}
    if(isMaster)return showMissionComplete(cycle);
    showIntermission(tr(`${tierName} mastered.`,`${tierName} maîtrisé.`),tr(`Your official ${tierName} score is ${st.initialScore}%. Mastery is complete. Next: ${TIERS[run.tier+1]}.`,`Ton score officiel ${tierName} est ${st.initialScore} %. Maîtrise terminée. Ensuite : ${TIERS[run.tier+1]}.`),tr(`Continue to ${TIERS[run.tier+1]} →`,`Continuer vers ${TIERS[run.tier+1]} →`),()=>startTier(run.tier+1));
  }
  function scoreBoard(cycle){return TIERS.map((name,i)=>`<div><small>${name}</small><b>${cycle.stages[i]?.initialScore??'—'}%</b><span>${cycle.stages[i]?.mastered?tr('Mastered','Maîtrisé'):tr('Not complete','Non terminé')}</span></div>`).join('')}
  function showMissionComplete(cycle){
    arena.hidden=true;intro.hidden=true;syllabus.hidden=true;results.hidden=false;$('resultEyebrow').textContent=tr('MISSION COMPLETE','MISSION TERMINÉE');$('challengeResultTitle').textContent=tr(`Age ${run.age} Mission ${run.cycle} mastered!`,`Mission ${run.cycle} de l’âge ${run.age} maîtrisée !`);$('challengeResultCopy').textContent=tr(`Overall initial performance: ${cycle.overallScore}%. Every missed question was mastered. Your original stage scores are preserved.`,`Performance initiale globale : ${cycle.overallScore} %. Toutes les questions manquées ont été maîtrisées. Tes scores initiaux sont conservés.`);$('stageScoreBoard').innerHTML=scoreBoard(cycle);$('againChallenge').textContent=tr('Start New Mission →','Commencer une nouvelle mission →');$('againChallenge').onclick=startNewMission;$('restartExplorer').hidden=true;
  }
  function startNewMission(){const pf=profile();pf.activeCycle=Math.max(...pf.cycles.map(c=>c.number),0)+1;saveProfile(pf);clearSession();startTier(0)}
  function showIntermission(title,copy,button,handler){arena.hidden=true;intro.hidden=true;syllabus.hidden=true;results.hidden=false;$('resultEyebrow').textContent=tr('LEVEL CHECKPOINT','ÉTAPE DU NIVEAU');$('challengeResultTitle').textContent=title;$('challengeResultCopy').textContent=copy;$('stageScoreBoard').innerHTML='';$('againChallenge').textContent=button;$('againChallenge').onclick=handler;$('restartExplorer').hidden=true}
  function showDataBlock(tier,count){showIntermission(tr('Curriculum data connection needed','Connexion aux données du programme requise'),tr(`This engine needs at least ${PER_STAGE} unique ${TIERS[tier]} activities for this exact age, syllabus and website language. ${count} are currently connected in this test package. The engine will not invent or duplicate curriculum questions.`,`Ce moteur a besoin d’au moins ${PER_STAGE} activités uniques de niveau ${TIERS[tier]} pour cet âge, ce programme et cette langue. ${count} sont actuellement connectées dans ce paquet de test. Le moteur n’inventera ni ne dupliquera les questions.`),tr('Choose another syllabus','Choisir un autre programme'),showSyllabus)}
  function showUnavailableAge(age){showIntermission(tr(`Age ${age} is parent-unlocked but not built yet.`,`L’âge ${age} est autorisé par le parent mais pas encore construit.`),tr('Age 10 is the curriculum being coded and tested first. Your permission is saved; the later age can be connected without changing the child profile.','Le programme de 10 ans est construit et testé en premier. L’autorisation est enregistrée ; l’autre âge pourra être connecté plus tard sans modifier le profil de l’enfant.'),tr('Back to age choice','Retour au choix de l’âge'),showSyllabus)}
  function renderIntro(){const p=C.preferences(),pf=p.country?profile():null,c=pf?currentCycle(pf):null;const country=p.country?`${COUNTRIES[p.country].flag} ${txt(COUNTRIES[p.country].label)||COUNTRIES[p.country].code}`:tr('Choose syllabus','Choisir le programme');$('curriculumSummary').innerHTML=`<span>${tr('Age','Âge')} <b>${p.age}</b></span><span>${tr('Syllabus','Programme')} <b>${country}</b></span><span>${tr('Mission','Mission')} <b>${c?.number||1}${c?.completed?' ✓':''}</b></span>`;$('startChallenge').textContent=!p.country?tr('Choose syllabus','Choisir le programme'):c?.completed?tr('View Mission Complete','Voir la mission terminée'):tr('Continue learning','Continuer')}
  function showSyllabus(){
    clearSession();intro.hidden=true;arena.hidden=true;results.hidden=true;syllabus.hidden=false;const access=C.accessState(),p=C.preferences();$('ageAccessStrip').innerHTML=`<b>${tr('Curriculum age','Âge du programme')}:</b>`+access.unlockedAges.map(age=>`<button type="button" class="age-chip ${Number(p.age)===age?'selected':''}" data-age="${age}">${age}${age===access.defaultAge?' • '+tr('default','défaut'):''}</button>`).join('');$('ageAccessStrip').querySelectorAll('button').forEach(b=>b.onclick=()=>{C.savePreferences({age:Number(b.dataset.age)});showSyllabus()});
    $('syllabusGrid').innerHTML=Object.values(COUNTRIES).map(c=>`<button type="button" class="syllabus-card ${p.country===c.code?'selected':''}" data-country="${c.code}"><span>${c.flag}</span><b>${txt(c.label)||c.code}</b><small>${tr('Use this country syllabus','Utiliser ce programme national')}</small></button>`).join('');$('syllabusGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>{C.savePreferences({country:b.dataset.country});renderIntro();syllabus.hidden=true;intro.hidden=false});
    $('challengeDataNote').textContent=tr('Country choice does not change the website language. Parent-approved curriculum ages appear above.','Le choix du pays ne change pas la langue du site. Les âges autorisés par le parent apparaissent ci-dessus.');
  }
  $('startChallenge').onclick=()=>C.preferences().country?startTier(firstIncompleteTier()):showSyllabus();$('changeSyllabus').onclick=showSyllabus;$('nextChallenge').onclick=advance;
  const saved=loadSession();renderIntro();if(!C.preferences().country){showSyllabus()}else if(saved){run=saved.run;answered=saved.answered;answerState=saved.answerState;intro.hidden=true;syllabus.hidden=true;results.hidden=true;arena.hidden=false;current=qById(run.queue[run.position]);if(current){renderQuestion();if(answered)restoreAnsweredState(answerState)}else startTier(firstIncompleteTier())}
})();
