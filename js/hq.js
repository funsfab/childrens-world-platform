const facts=['Octopuses have three hearts.','A day on Venus is longer than a year on Venus.','The Pacific Ocean is larger than all Earth’s land area combined.','Your skin is your body’s largest organ.','Some bamboo can grow extremely quickly under the right conditions.','The word “robot” came from a Czech word connected with forced work.'];
let factIndex=0;const quickFact=document.getElementById('quickFact');document.getElementById('newFactBtn').onclick=()=>{factIndex=(factIndex+1+Math.floor(Math.random()*(facts.length-1)))%facts.length;quickFact.textContent=facts[factIndex]};
const modal=document.getElementById('activityModal'),content=document.getElementById('modalContent');
const templates={
 safety:`<span class="eyebrow">SAFETY MISSION</span><h2>Spot the scam</h2><p>You receive: <b>“You won a new phone! Sign in with your game password in the next 5 minutes.”</b></p><div class="modal-options"><button data-safe="no">Click quickly so the prize is not lost.</button><button data-safe="yes">Do not click. Check the source and tell a trusted adult if worried.</button><button data-safe="no">Reply with the password instead.</button></div><p id="safeFeedback"></p>`,
 why:`<span class="eyebrow">ASK WHY?</span><h2>Why do volcanoes erupt?</h2><p>Earth's outer layer is broken into moving tectonic plates. In some places, movement allows molten rock called magma to rise. Pressure can build until magma, gases and other material escape through the crust.</p><p><b>Knowledge path:</b> Volcanoes → Plate tectonics → Earthquakes → Earth's layers.</p>`,
 create:`<span class="eyebrow">CREATIVE WORLD</span><h2>Design a city for 100,000 people.</h2><p>Where will you place housing, schools, hospitals, parks, transport, shops and emergency services? A future build will make this a drag-and-drop planning game.</p>`,
 mind:`<span class="eyebrow">ME, BODY & MIND</span><h2>Reset challenge</h2><p>You are frustrated because a task went wrong three times. Pick a healthy next move: take a short break, identify one thing to change, then try again or ask for help.</p>`,
 uk:`<span class="eyebrow">MY UK</span><h2>How does a law begin?</h2><p>This future interactive path will introduce Parliament, bills, debates, votes and Royal Assent in neutral, age-appropriate language, with differences across UK legal systems explained where relevant.</p>`,
 future:`<span class="eyebrow">MY FUTURE</span><h2>Run a tiny business</h2><p>Choose a product, estimate costs, set a price and see whether your pretend business makes a profit. This will connect money maths to real-life decision making.</p>`
};
function openModal(html){content.innerHTML=html;modal.classList.add('open');modal.setAttribute('aria-hidden','false');content.querySelectorAll('[data-safe]').forEach(b=>b.onclick=()=>{const ok=b.dataset.safe==='yes';document.getElementById('safeFeedback').innerHTML=ok?'✅ <b>Good choice.</b> Urgency + prize + password request are warning signs.':'⚠️ <b>Try again.</b> Never give a password because a message pressures you.';playTone(ok)})}
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{if(b.dataset.open==='quiz')startMiniQuiz();else openModal(templates[b.dataset.open])});
modal.querySelector('.modal-close').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
function startMiniQuiz(){const bank=[...WORLD_QUESTIONS].sort(()=>Math.random()-.5).slice(0,5);let i=0,score=0;const render=()=>{if(i>=bank.length){openModal(`<span class="eyebrow">MINI QUIZ COMPLETE</span><h2>${score}/5 correct</h2><p>${score>=4?'Excellent — your knowledge bank is growing.':'Good start. The full platform will explain every answer and serve a fresh set next time.'}</p>`);return}const q=bank[i];openModal(`<span class="eyebrow">QUICK KNOWLEDGE CHECK • ${i+1}/5</span><h2>${q.q}</h2><div class="modal-options">${q.choices.sort(()=>Math.random()-.5).map(x=>`<button data-answer="${x.replaceAll('"','&quot;')}">${x}</button>`).join('')}</div><p id="quizFeed"></p>`);content.querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>{const ok=btn.dataset.answer===q.a;document.getElementById('quizFeed').innerHTML=ok?'✅ Correct!':'❌ Not this time. Correct answer: <b>'+q.a+'</b>';playTone(ok);if(ok)score++;setTimeout(()=>{i++;render()},650)})};render()}
document.getElementById('surpriseBtn').onclick=()=>{const pool=[templates.why,templates.create,templates.future,templates.uk,templates.safety];openModal(pool[Math.floor(Math.random()*pool.length)])};
document.getElementById('saveLaterBtn').onclick=()=>{localStorage.setItem('savedJapan','yes');openModal('<span class="eyebrow">SAVED</span><h2>Japan mission saved.</h2><p>In the production platform this will sync to the child profile database so it follows them across approved devices.</p>')};
const searchIndex=[
 {keys:['japan','tokyo','culture','yen'],title:'Japan World Mission',path:'World Explorer → Japan → Tokyo → Culture',href:'japan.html',icon:'🇯🇵'},
 {keys:['city','build','planning','roads','hospital','school'],title:'Build Your City',path:'Build → City planning → Budget → Services',href:'city-builder.html',icon:'🏙️'},
 {keys:['game','arcade','play','flag'],title:'Children World Arcade',path:'Play → Arcade → Flag Quest and missions',href:'arcade.html',icon:'🎮'},
 {keys:['flag','capital','country'],title:'Flag Quest',path:'Play → Flag Quest → World knowledge',href:'game.html',icon:'🚩'},
 {keys:['brain','challenge','hard','prove','maths','science'],title:'Brain Battle',path:'Challenge → Adaptive difficulty → Prove It',href:'challenge.html',icon:'🧠'},
 {keys:['money','budget','shopping','food','life'],title:'£35 Life Lab',path:'Life Lab → Budgeting → Shopping decisions',href:'life-lab.html',icon:'💷'},
 {keys:['story','video','watch','scam','film'],title:'Story World',path:'Watch → Story World → Think → Play',href:'story-world.html',icon:'🎬'},
 {keys:['create','design','invent','art'],title:'Creator Studio',path:'Create → Design → Invent → Imagine',href:'creator.html',icon:'🎨'},
 {keys:['parent','family','progress','membership'],title:'Parent Centre',path:'Parent Centre → Progress → Controls → Membership',href:'parent.html',icon:'👨‍👩‍👧'}
];
function doSearch(){
  const v=document.getElementById('globalSearch').value.toLowerCase().trim();
  const hits=v?searchIndex.filter(item=>item.keys.some(k=>v.includes(k)||k.includes(v))).slice(0,5):[];
  if(v&&window.CWState)CWState.logSearch(v,hits.length);
  const html=hits.length?hits.map(x=>`<a class="search-live-result" href="${x.href}"><span>${x.icon}</span><div><b>${x.title}</b><small>${x.path}</small></div><i>Open →</i></a>`).join(''):'<p>Try: city, Japan, money, story, flags, science, create or parent.</p>';
  openModal(`<span class="eyebrow">GLOBAL SEARCH • WORKING PROTOTYPE</span><h2>${hits.length?'Results':'What do you want to discover?'}</h2><div class="search-live-results">${html}</div><p class="small-note">Pack 13 searches the activities currently built. The production index will expand as content is published.</p>`)
}
document.getElementById('searchBtn').onclick=doSearch;document.getElementById('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});

function syncHQState(){
  if(!window.CWState)return;
  const s=CWState.load(), li=CWState.levelInfo();
  const chip=document.querySelector('.profile-chip');
  if(chip){const b=chip.querySelector('b'),sm=chip.querySelector('small'); if(b&&window.CWAccess?.get().childNickname)b.textContent=CWAccess.get().childNickname; if(sm)sm.textContent=`Level ${li.level} • ${li.xp.toLocaleString()} XP`;}
  const ring=document.querySelector('.level-ring b');if(ring)ring.textContent=li.level;
  const xpCard=document.querySelector('.xp-card');if(xpCard){const bar=xpCard.querySelector('.progress span'),sm=xpCard.querySelector(':scope > small');if(bar)bar.style.width=li.percent+'%';if(sm)sm.textContent=`${li.next-li.current} XP to Level ${li.level+1}`;}
  const count=document.querySelector('.passport-count b');if(count)count.textContent=Math.max(0,s.passport.length);
  const stamps=document.querySelector('.stamp-row');if(stamps&&s.passport.length){const flagMap={JP:'🇯🇵',NG:'🇳🇬',FR:'🇫🇷',BR:'🇧🇷',CA:'🇨🇦'};stamps.innerHTML=s.passport.slice(-5).map(x=>`<span>${flagMap[x.code]||'🌍'}</span>`).join('');}
  const card=document.querySelector('.continue-card');
  if(card){
    const r=s.resume;
    const title=card.querySelector('.continue-info h2'), desc=card.querySelector('.continue-info p'), link=card.querySelector('.continue-actions a'), icon=card.querySelector('.continue-art span'), pctEl=card.querySelector('.continue-art i'), bar=card.querySelector('.progress span');
    if(r){const val=Math.max(1,Math.min(99,Number(s.progress[r.id]?.value||20)));if(title)title.textContent=r.title;if(desc)desc.textContent=`${r.kind||'Activity'} • continue where you stopped`;if(link){link.href=r.href;link.textContent='Continue →'}if(icon)icon.textContent=r.icon||'▶️';if(pctEl)pctEl.textContent=val+'%';if(bar)bar.style.width=val+'%';}
    else {if(title)title.textContent='Choose your next adventure';if(desc)desc.textContent='Nothing unfinished yet — start a game, build, story or mission.';if(link){link.href='arcade.html';link.textContent='Explore activities →'}if(icon)icon.textContent='✨';if(pctEl)pctEl.textContent='NEW';if(bar)bar.style.width='5%';}
  }
}
syncHQState();
