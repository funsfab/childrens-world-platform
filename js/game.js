(()=>{
'use strict';
const intro=document.getElementById('gameIntro'),arena=document.getElementById('gameArena'),results=document.getElementById('gameResults');
const SET_SIZE=20;let mode='mixed',round=0,score=0,correct=0,xp=0,combo=0,lives=5,current=[],timerId,time=20,locked=false,advanceTimer=null;
const lang=()=>window.CWLang?.current?.()||'en';const tr=(en,fr)=>lang()==='fr'?fr:en;
const local=(q,key)=>lang()==='fr'?(q[key+'Fr']??q[key]):q[key];
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x};

document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode});
function getPool(){
 let pool=WORLD_QUESTIONS.filter(q=>q.mode===mode);if(mode==='mixed')pool=WORLD_QUESTIONS.filter(q=>q.mode==='mixed');
 const key='flagquest_seen_v2_'+mode;let seen=[];try{seen=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){}
 let unseen=pool.filter(q=>!seen.includes(q.id));
 if(unseen.length<SET_SIZE){seen=[];unseen=[...pool]}
 current=shuffle(unseen).slice(0,Math.min(SET_SIZE,unseen.length));
 localStorage.setItem(key,JSON.stringify([...seen,...current.map(q=>q.id)]));
}
function start(){getPool();round=0;score=0;correct=0;xp=0;combo=0;lives=5;intro.hidden=true;results.hidden=true;arena.hidden=false;updateHud();showRound()}
function updateHud(){gameXp.textContent=xp;document.getElementById('combo').textContent=combo;document.getElementById('lives').textContent=lives;document.getElementById('score').textContent=score}
function renderVisual(q){
 const holder=document.getElementById('questionIcon');holder.innerHTML='';holder.classList.toggle('flag-visual',q.mode==='flags');
 if(q.code){const code=document.createElement('strong');code.className='country-code';code.textContent=q.code;holder.appendChild(code)}
 if(q.visual){const img=document.createElement('img');img.src=q.visual;img.alt=local(q,'visualAlt')||tr('Question visual','Illustration de la question');img.loading='eager';holder.appendChild(img)}
 else if(q.icon){const span=document.createElement('span');span.className='quest-emoji';span.textContent=q.icon;holder.appendChild(span)}
}
function showRound(){
 if(round>=current.length){endGame();return}locked=false;clearTimeout(advanceTimer);nextFlagQuestion.hidden=true;const q=current[round];
 roundLabel.textContent=tr(`ROUND ${round+1} / ${current.length}`,`MANCHE ${round+1} / ${current.length}`);renderVisual(q);questionCategory.textContent=local(q,'category');gameQuestion.textContent=local(q,'q');gameFeedback.textContent='';
 const enChoices=[...q.choices];const frChoices=q.choicesFr||q.choices;const order=enChoices.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 const grid=answerGrid;grid.innerHTML=order.map(i=>`<button type="button" data-index="${i}"></button>`).join('');grid.querySelectorAll('button').forEach(b=>{const i=+b.dataset.index;b.textContent=lang()==='fr'?frChoices[i]:enChoices[i];b.onclick=()=>answer(b,q,enChoices[i])});
 time=20;timerBar.style.width='100%';clearInterval(timerId);timerId=setInterval(()=>{time--;timerBar.style.width=(time/20*100)+'%';if(time<=0){clearInterval(timerId);timeout(q)}},1000)
}
function correctText(q){return lang()==='fr'?(q.aFr||q.a):q.a}
function timeout(q){if(locked)return;locked=true;lives=Math.max(0,lives-1);combo=0;document.querySelectorAll('#answerGrid button').forEach(b=>{const idx=+b.dataset.index;b.disabled=true;if(q.choices[idx]===q.a)b.classList.add('correct')});gameFeedback.textContent=tr(`⏱️ Time. Correct answer: ${correctText(q)}. Read it, then continue when you are ready.`,`⏱️ Temps écoulé. Bonne réponse : ${correctText(q)}. Lis-la puis continue quand tu es prêt.`);window.playTone?.(false);updateHud();nextFlagQuestion.hidden=false}
function answer(btn,q,enValue){if(locked)return;locked=true;clearInterval(timerId);const ok=enValue===q.a;document.querySelectorAll('#answerGrid button').forEach(b=>{const idx=+b.dataset.index;b.disabled=true;if(q.choices[idx]===q.a)b.classList.add('correct')});if(ok){btn.classList.add('correct');correct++;combo++;const bonus=100+combo*15+time*2;score+=bonus;xp+=20+combo*2;gameFeedback.textContent=tr(`✅ Correct! +${bonus}`,`✅ Correct ! +${bonus}`);window.playTone?.(true);advanceTimer=setTimeout(()=>{round++;showRound()},850)}else{btn.classList.add('wrong');lives=Math.max(0,lives-1);combo=0;gameFeedback.textContent=tr(`❌ Correct answer: ${correctText(q)}. Take a moment to remember it, then press Next question.`,`❌ Bonne réponse : ${correctText(q)}. Prends le temps de la retenir, puis appuie sur Question suivante.`);window.playTone?.(false);nextFlagQuestion.hidden=false}updateHud()}
function endGame(){clearInterval(timerId);arena.hidden=true;results.hidden=false;finalScore.textContent=score;finalCorrect.textContent=`${correct}/${current.length}`;finalXp.textContent=xp;resultCopy.textContent=correct>=16?tr('Excellent world knowledge. Your next set will avoid the questions you just used.','Excellentes connaissances du monde. La prochaine série évitera les questions déjà utilisées.'):correct>=10?tr('Solid run. A fresh shuffled set is ready when you are.','Bonne série. Une nouvelle série mélangée t’attend.'):tr('Good start. Try another set and keep exploring.','Bon début. Essaie une autre série et continue d’explorer.');
 localStorage.setItem('lastFlagQuest',JSON.stringify({mode,score,correct,total:current.length,xp,date:Date.now()}));
 if(window.CWState){CWState.addXP(xp,'Flag Quest');CWState.setProgress('flagquest',Math.min(100,Math.round(correct/current.length*100)),{score,correct,total:current.length,mode});CWState.logActivity({id:'flagquest-result-'+Date.now(),title:'Flag Quest complete',icon:'🚩',detail:`${correct}/${current.length} correct • ${score} points • +${xp} XP`,href:'game.html'});if(correct>=16)CWState.addAchievement('flag-ace','Flag Ace','🚩')}
}
nextFlagQuestion.onclick=()=>{if(!locked)return;round++;showRound()};startGame.onclick=start;playAgain.onclick=start;chooseMode.onclick=()=>{results.hidden=true;arena.hidden=true;intro.hidden=false};
})();
