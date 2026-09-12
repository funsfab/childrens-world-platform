(()=>{
'use strict';
const $=id=>document.getElementById(id);
const intro=$('gameIntro'),arena=$('gameArena'),results=$('gameResults');
const SET_SIZE=20;
let mode='mixed',phase='main',round=0,score=0,baseCorrect=0,xp=0,combo=0,lives=5,current=[],mainSet=[],missed=new Set(),timerId,time=20,locked=false,advanceTimer=null;
const visualCache=new Map();
const lang=()=>window.CWLang?.current?.()||'en';
const tr=(en,fr)=>lang()==='fr'?fr:en;
const local=(q,key)=>lang()==='fr'?(q[key+'Fr']??q[key]):q[key];
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x};
const findQuestion=id=>WORLD_QUESTIONS.find(q=>q.id===id);
function flagEmoji(code){if(!/^[A-Z]{2}$/.test(code||''))return '🌍';return String.fromCodePoint(...[...code].map(c=>127397+c.charCodeAt()))}

document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode});
function getPool(){
 let pool=WORLD_QUESTIONS.filter(q=>q.mode===mode);if(mode==='mixed')pool=WORLD_QUESTIONS.filter(q=>q.mode==='mixed');
 const key='flagquest_seen_v3_'+mode;let seen=[];try{seen=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){}
 let unseen=pool.filter(q=>!seen.includes(q.id));if(unseen.length<SET_SIZE){seen=[];unseen=[...pool]}
 mainSet=shuffle(unseen).slice(0,Math.min(SET_SIZE,unseen.length));localStorage.setItem(key,JSON.stringify([...seen,...mainSet.map(q=>q.id)]));
}
function preloadVisual(src){if(!src)return Promise.resolve(true);if(visualCache.has(src))return visualCache.get(src).promise;let resolve;const promise=new Promise(r=>resolve=r);const record={ok:false,img:null,promise};visualCache.set(src,record);const img=new Image();record.img=img;img.onload=()=>{record.ok=true;resolve(true)};img.onerror=()=>{record.ok=false;resolve(false)};img.decoding='async';img.src=src;return promise}
async function preloadQuestions(list){const sources=[...new Set(list.map(q=>q.visual).filter(Boolean))];await Promise.all(sources.map(preloadVisual))}
async function start(){
 getPool();const btn=$('startGame');const old=btn.textContent;btn.disabled=true;btn.textContent=tr('LOADING VISUALS…','CHARGEMENT DES VISUELS…');await preloadQuestions(mainSet);btn.disabled=false;btn.textContent=old;
 phase='main';current=[...mainSet];missed=new Set();round=0;score=0;baseCorrect=0;xp=0;combo=0;lives=5;intro.hidden=true;results.hidden=true;arena.hidden=false;updateHud();showRound();
}
function updateHud(){$('gameXp').textContent=xp;$('combo').textContent=combo;$('lives').textContent=lives;$('score').textContent=score}
function renderVisual(q){
 const holder=$('questionIcon');holder.innerHTML='';holder.classList.toggle('flag-visual',q.mode==='flags');
 if(q.code){const code=document.createElement('strong');code.className='country-code';code.textContent=q.code;holder.appendChild(code)}
 if(q.visual){const rec=visualCache.get(q.visual);if(rec?.ok&&rec.img){const img=rec.img;img.alt=local(q,'visualAlt')||tr('Country or question visual','Drapeau ou illustration');img.loading='eager';img.decoding='sync';holder.appendChild(img)}else{const fallback=document.createElement('span');fallback.className='flag-fallback';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',tr('Flag fallback','Drapeau de secours'));fallback.textContent=q.code?flagEmoji(q.code):(q.icon||'🌍');holder.appendChild(fallback)}}
 else if(q.icon){const span=document.createElement('span');span.className='quest-emoji';span.textContent=q.icon;holder.appendChild(span)}
}
function showRound(){
 if(round>=current.length){finishRound();return}locked=false;clearTimeout(advanceTimer);$('nextFlagQuestion').hidden=true;const q=current[round];
 $('roundLabel').textContent=phase==='review'?tr(`REVIEW ${round+1} / ${current.length}`,`RÉVISION ${round+1} / ${current.length}`):tr(`ROUND ${round+1} / ${current.length}`,`MANCHE ${round+1} / ${current.length}`);
 renderVisual(q);$('questionCategory').textContent=local(q,'category');$('gameQuestion').textContent=local(q,'q');$('gameFeedback').textContent='';$('gameFeedback').classList.remove('timeout-note');
 const enChoices=[...q.choices],frChoices=q.choicesFr||q.choices,order=enChoices.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 const grid=$('answerGrid');grid.innerHTML=order.map(i=>`<button type="button" data-index="${i}"></button>`).join('');grid.querySelectorAll('button').forEach(b=>{const i=+b.dataset.index;b.textContent=lang()==='fr'?frChoices[i]:enChoices[i];b.onclick=()=>answer(b,q,enChoices[i])});
 time=20;$('timerBar').style.width='100%';clearInterval(timerId);timerId=setInterval(()=>{time--;$('timerBar').style.width=(time/20*100)+'%';if(time<=0){clearInterval(timerId);timeout(q)}},1000);
 // Warm the next visual while the child is thinking.
 const next=current[round+1];if(next?.visual)preloadVisual(next.visual);
}
function correctText(q){return lang()==='fr'?(q.aFr||q.a):q.a}
function markMissed(q){missed.add(q.id)}
function timeout(q){if(locked)return;locked=true;markMissed(q);lives=Math.max(0,lives-1);combo=0;document.querySelectorAll('#answerGrid button').forEach(b=>b.disabled=true);$('gameFeedback').classList.add('timeout-note');$('gameFeedback').textContent=tr('⏱️ Time’s up — we’ll come back to this one.','⏱️ Temps écoulé — cette question reviendra.');window.playTone?.(false);updateHud();advanceTimer=setTimeout(()=>{round++;showRound()},950)}
function answer(btn,q,enValue){
 if(locked)return;locked=true;clearInterval(timerId);const ok=enValue===q.a;const buttons=[...document.querySelectorAll('#answerGrid button')];buttons.forEach(b=>b.disabled=true);
 if(ok){btn.classList.add('correct');if(phase==='main')baseCorrect++;else missed.delete(q.id);combo++;const bonus=100+combo*15+time*2+(phase==='review'?25:0);score+=bonus;xp+=20+combo*2;$('gameFeedback').textContent=tr(`✅ Correct! +${bonus}`,`✅ Correct ! +${bonus}`);window.playTone?.(true);advanceTimer=setTimeout(()=>{round++;showRound()},850)}
 else{btn.classList.add('wrong');markMissed(q);combo=0;lives=Math.max(0,lives-1);buttons.forEach(b=>{const idx=+b.dataset.index;if(q.choices[idx]===q.a)b.classList.add('correct')});$('gameFeedback').textContent=tr(`❌ Correct answer: ${correctText(q)}. Read it carefully — this question will return in review.`,`❌ Bonne réponse : ${correctText(q)}. Lis-la bien — cette question reviendra en révision.`);window.playTone?.(false);$('nextFlagQuestion').hidden=false}
 updateHud();
}
function next(){if(!locked)return;round++;showRound()}
async function beginReview(){const qs=[...missed].map(findQuestion).filter(Boolean);current=shuffle(qs);phase='review';round=0;results.hidden=true;arena.hidden=false;await preloadQuestions(current);showRound()}
function finishRound(){clearInterval(timerId);if(phase==='main'&&missed.size){showReviewGate();return}if(phase==='review'&&missed.size){showReviewGate(true);return}endGame()}
function showReviewGate(again=false){arena.hidden=true;results.hidden=false;$('gameResults').querySelector('h2').textContent=again?tr('Review again','Révision encore'):tr('Review round','Série de révision');$('resultCopy').textContent=again?tr(`${missed.size} question${missed.size===1?'':'s'} still need mastering. They will be shuffled and return again.`,`${missed.size} question${missed.size===1?'':'s'} reste${missed.size===1?'':'nt'} à maîtriser. Elles seront mélangées et reviendront.`):tr(`${missed.size} of the 20 questions were wrong or timed out. Master those before you finish this quest.`,`${missed.size} des 20 questions sont fausses ou hors délai. Maîtrise-les avant de terminer cette quête.`);$('finalScore').textContent=score;$('finalCorrect').textContent=`${baseCorrect}/${mainSet.length}`;$('finalXp').textContent=missed.size;$('playAgain').textContent=again?tr('Review again','Réviser encore'):tr('Start review','Commencer la révision');$('playAgain').onclick=beginReview;$('chooseMode').hidden=false}
function endGame(){
 arena.hidden=true;results.hidden=false;$('gameResults').querySelector('h2').textContent=tr('Quest mastered!','Quête maîtrisée !');$('resultCopy').textContent=tr(`You completed all ${mainSet.length} questions and then mastered every question you missed.`,`Tu as terminé les ${mainSet.length} questions puis maîtrisé toutes celles que tu avais manquées.`);$('finalScore').textContent=score;$('finalCorrect').textContent=`${mainSet.length}/${mainSet.length}`;$('finalXp').textContent=xp;$('playAgain').textContent=tr('Play another set','Jouer une autre série');$('playAgain').onclick=start;$('chooseMode').hidden=false;
 localStorage.setItem('lastFlagQuest',JSON.stringify({mode,score,correct:mainSet.length,total:mainSet.length,xp,date:Date.now()}));if(window.CWState){CWState.addXP(xp,'Flag Quest');CWState.setProgress('flagquest',100,{score,correct:mainSet.length,total:mainSet.length,mode});CWState.logActivity({id:'flagquest-result-'+Date.now(),title:'Flag Quest mastered',icon:'🚩',detail:`${mainSet.length}/${mainSet.length} mastered • ${score} points • +${xp} XP`,href:'game.html'});CWState.addAchievement('flag-ace','Flag Ace','🚩')}
}
$('nextFlagQuestion').onclick=next;$('startGame').onclick=start;$('playAgain').onclick=start;$('chooseMode').onclick=()=>{clearInterval(timerId);clearTimeout(advanceTimer);results.hidden=true;arena.hidden=true;intro.hidden=false};
})();
