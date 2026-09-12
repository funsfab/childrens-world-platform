(()=>{
  'use strict';
  const TIERS=['Explorer','Challenger','Investigator','Expert','Master Mission'];
  const STORAGE='cw_brain_battle_v3';
  const SESSION='cw_brain_battle_active_v1';
  const PER_TIER=20;
  const bank=Array.isArray(window.BRAIN_BANK)?window.BRAIN_BANK:[];
  const $=id=>document.getElementById(id);
  const intro=$('challengeIntro'), arena=$('challengeArena'), results=$('challengeResults');
  let run=null,current=null,answered=false,answerState=null;

  const lang=()=>window.CWLang?.current?.()||'en';
  const txt=(obj)=>obj?.[lang()] ?? obj?.en ?? String(obj??'');
  const tr=(en,fr)=>lang()==='fr'?fr:en;
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x};

  function loadProgress(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch(_){return {}}}
  function saveProgress(data){localStorage.setItem(STORAGE,JSON.stringify(data))}
  function saveSession(){if(run)localStorage.setItem(SESSION,JSON.stringify({run,answered,answerState,updatedAt:Date.now()}))}
  function clearSession(){localStorage.removeItem(SESSION)}
  function loadSession(){try{const s=JSON.parse(localStorage.getItem(SESSION)||'null');if(!s?.run||!Array.isArray(s.run.queue)||!Number.isInteger(s.run.tier))return null;return s}catch(_){return null}}
  function firstIncompleteTier(){const p=loadProgress();const mastered=Array.isArray(p.mastered)?p.mastered:[];for(let i=0;i<TIERS.length;i++)if(!mastered.includes(i))return i;return 4}
  function startTier(tierIndex=firstIncompleteTier()){
    const pool=shuffle(bank.filter(q=>q.tier===tierIndex)).slice(0,PER_TIER);
    if(pool.length<PER_TIER){alert('Brain Battle question bank is incomplete for this level.');return}
    run={tier:tierIndex,phase:'base',queue:pool.map(q=>q.id),position:0,missed:[],attempts:{},score:0,streak:0,baseAnswered:0};
    answered=false;answerState=null;saveSession();intro.hidden=true;results.hidden=true;arena.hidden=false;nextQuestion();
  }
  function findQuestion(id){return bank.find(q=>q.id===id)}
  function nextQuestion(){
    if(!run)return;
    if(run.position>=run.queue.length){if(run.phase==='base')return finishBaseRound();return finishReviewRound()}
    current=findQuestion(run.queue[run.position]);if(!current){run.position++;saveSession();return nextQuestion()}
    answered=false;answerState=null;renderQuestion();saveSession();
  }
  function renderQuestion(){
    $('tierName').textContent=TIERS[run.tier];$('challengeScore').textContent=run.score;$('challengeStreak').textContent=run.streak;
    $('challengeProgress').textContent=`${run.position+1} / ${run.queue.length}`;$('challengePhase').textContent=run.phase==='base'?tr('Main round','Série principale'):tr('Review round','Révision');
    $('challengeSubject').textContent=txt(current.subject);$('challengeQuestion').textContent=txt(current.q);$('difficultyPips').innerHTML=Array.from({length:5},(_,i)=>`<i class="${i<=run.tier?'on':''}"></i>`).join('');
    $('challengeFeedback').textContent='';$('nextChallenge').hidden=true;$('provePanel').hidden=true;
    const choices=shuffle(current.choices);const box=$('challengeOptions');box.innerHTML=choices.map((c,i)=>`<button type="button" data-choice="${i}"></button>`).join('');
    box.querySelectorAll('button').forEach((b,i)=>{b.textContent=txt(choices[i]);b.dataset.answer=choices[i].en;b.onclick=()=>answer(b,choices[i])});
  }
  function feedbackForState(state){
    if(state.correct)return tr('✅ Correct. Keep going.','✅ Correct. Continue.');
    const attempts=run.attempts[current.id]||1;
    return attempts>=2?tr(`Not quite. Hint: ${txt(current.hint)} This question will return.`,`Pas encore. Indice : ${txt(current.hint)} Cette question reviendra.`):tr('Not quite. This question will return in your review round.','Pas encore. Cette question reviendra pendant la révision.');
  }
  function restoreAnsweredState(state){
    if(!state)return;answered=true;answerState=state;
    const buttons=[...document.querySelectorAll('#challengeOptions button')];buttons.forEach(b=>{b.disabled=true;if(b.dataset.answer===current.a.en)b.classList.add('correct');if(b.dataset.answer===state.choice&&!state.correct)b.classList.add('wrong')});
    $('challengeFeedback').textContent=feedbackForState(state);
    if(state.correct&&run.tier>=2){$('provePanel').hidden=false;$('provePanel').innerHTML=`<span class="eyebrow">${tr('WHY IT WORKS','POURQUOI')}</span><p>${txt(current.why)}</p>`}
    $('nextChallenge').textContent=run.position===run.queue.length-1?tr('Finish round →','Terminer la série →'):tr('Next challenge →','Question suivante →');$('nextChallenge').hidden=false;
  }
  function answer(btn,choice){
    if(answered)return;answered=true;const correct=choice.en===current.a.en;run.attempts[current.id]=(run.attempts[current.id]||0)+1;
    document.querySelectorAll('#challengeOptions button').forEach(b=>{b.disabled=true;if(b.dataset.answer===current.a.en)b.classList.add('correct')});
    if(correct){btn.classList.add('correct');run.score+=100+(run.tier*30)+(run.phase==='review'?25:0);run.streak++;run.missed=run.missed.filter(id=>id!==current.id);if(run.tier>=2){$('provePanel').hidden=false;$('provePanel').innerHTML=`<span class="eyebrow">${tr('WHY IT WORKS','POURQUOI')}</span><p>${txt(current.why)}</p>`}window.playTone?.(true)}
    else{btn.classList.add('wrong');run.streak=0;run.score=Math.max(0,run.score-15);if(!run.missed.includes(current.id))run.missed.push(current.id);window.playTone?.(false)}
    answerState={choice:choice.en,correct};$('challengeFeedback').textContent=feedbackForState(answerState);$('challengeScore').textContent=run.score;$('challengeStreak').textContent=run.streak;
    $('nextChallenge').textContent=run.position===run.queue.length-1?tr('Finish round →','Terminer la série →'):tr('Next challenge →','Question suivante →');$('nextChallenge').hidden=false;saveSession();
  }
  function advance(){if(!run||!answered)return;run.position++;answered=false;answerState=null;saveSession();nextQuestion()}
  function finishBaseRound(){run.baseAnswered=PER_TIER;saveSession();if(run.missed.length){showIntermission(tr(`${run.missed.length} question${run.missed.length===1?'':'s'} to strengthen.`,`${run.missed.length} question${run.missed.length===1?'':'s'} à renforcer.`),tr('You are not moving up yet. Retry only the questions you missed until you master them.','Tu ne passes pas encore au niveau suivant. Reprends uniquement les questions manquées jusqu’à les maîtriser.'),tr('Start review →','Commencer la révision →'),()=>beginReview())}else masterTier()}
  function beginReview(){run.phase='review';run.queue=shuffle(run.missed);run.position=0;answered=false;answerState=null;saveSession();results.hidden=true;arena.hidden=false;nextQuestion()}
  function finishReviewRound(){saveSession();if(run.missed.length){showIntermission(tr(`${run.missed.length} still to master.`,`${run.missed.length} encore à maîtriser.`),tr('Good effort. Those questions will come back again — with a hint if you need one.','Bon effort. Ces questions vont revenir — avec un indice si nécessaire.'),tr('Review again →','Réviser encore →'),()=>beginReview())}else masterTier()}
  function masterTier(){
    const progress=loadProgress();const mastered=new Set(Array.isArray(progress.mastered)?progress.mastered:[]);mastered.add(run.tier);saveProgress({mastered:[...mastered].sort(),lastTier:run.tier,updatedAt:Date.now()});
    const tierName=TIERS[run.tier];if(window.CWState){CWState.addXP(180+(run.tier*40),`Brain Battle: ${tierName}`);CWState.setProgress('brainbattle',Math.round((mastered.size/TIERS.length)*100),{tier:tierName,score:run.score});CWState.logActivity({id:'brain-'+Date.now(),title:`${tierName} mastered`,icon:'🧠',detail:`20 questions mastered • ${run.score} points`,href:'challenge.html'});if(run.tier===4){CWState.complete('brainbattle',{score:run.score});CWState.addAchievement('brain-master','Brain Battle Master','🧠')}}
    const isMaster=run.tier===4;clearSession();showIntermission(isMaster?tr('Brain Battle Mastered!','Brain Battle maîtrisé !'):tr(`${tierName} mastered.`,`${tierName} maîtrisé.`),isMaster?tr('You completed all five levels and mastered every missed question. Choose whether to replay Master Mission or begin a completely fresh journey from Explorer.','Tu as terminé les cinq niveaux et maîtrisé toutes les questions manquées. Choisis de rejouer la Mission Maître ou de recommencer un nouveau parcours depuis Explorateur.'):tr(`You mastered all 20 ${tierName} questions. The next level is ${TIERS[run.tier+1]}.`,`Tu as maîtrisé les 20 questions ${tierName}. Le prochain niveau est ${TIERS[run.tier+1]}.`),isMaster?tr('Play Master Mission Again','Rejouer la Mission Maître'):tr(`Continue to ${TIERS[run.tier+1]} →`,`Continuer vers ${TIERS[run.tier+1]} →`),()=>startTier(isMaster?4:run.tier+1),isMaster)
  }
  function showIntermission(title,copy,button,handler,isMaster=false){arena.hidden=true;results.hidden=false;$('challengeResultTitle').textContent=title;$('challengeResultCopy').textContent=copy;const b=$('againChallenge');b.textContent=button;b.onclick=handler;const restart=$('restartExplorer');restart.hidden=!isMaster;restart.textContent=tr('Start Again from Explorer','Recommencer depuis Explorateur');restart.onclick=()=>{localStorage.removeItem(STORAGE);clearSession();startTier(0)}}
  $('startChallenge').onclick=()=>startTier(firstIncompleteTier());$('nextChallenge').onclick=advance;$('resetBrain').onclick=()=>{if(confirm(tr('Reset Brain Battle level progress?','Réinitialiser la progression de Brain Battle ?'))){localStorage.removeItem(STORAGE);clearSession();startTier(0)}};

  // Resume an active question/review after a language switch or accidental reload.
  const saved=loadSession();
  if(saved){run=saved.run;intro.hidden=true;results.hidden=true;arena.hidden=false;if(run.position>=run.queue.length)nextQuestion();else{current=findQuestion(run.queue[run.position]);if(current){answered=false;answerState=null;renderQuestion();if(saved.answered&&saved.answerState)restoreAnsweredState(saved.answerState)}else nextQuestion()}}
})();
