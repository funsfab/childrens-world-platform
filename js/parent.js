(function(){
  if(!window.CWState)return;
  const state=CWState.load(), access=window.CWAccess?CWAccess.get():{}, li=CWState.levelInfo();
  const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val};
  set('pCountries',state.passport.length);set('pXp',li.xp.toLocaleString());set('pCompleted',Object.keys(state.completed||{}).length);set('pAchievements',state.achievements.length);
  set('pChildName',access.childNickname||'Explorer');set('pChildAvatar',access.childAvatar||'🦊');set('pChildMeta',`Age band ${access.childAge||'not set'} • Level ${li.level}`);set('pChildXp',`${li.xp.toLocaleString()} XP`);
  const bar=document.getElementById('pChildXpBar');if(bar)bar.style.width=li.percent+'%';
  const list=document.getElementById('parentActivityList');
  if(list){const recent=(state.recent||[]).slice(0,8);if(recent.length)list.innerHTML=recent.map(x=>`<div><span class="activity-icon">${x.icon||'✨'}</span><div><b>${x.title||'Activity'}</b><small>${x.detail||'Activity recorded'}</small></div><span>${friendlyTime(x.time)}</span></div>`).join('')}
  function friendlyTime(ts){const mins=Math.max(0,Math.floor((Date.now()-Number(ts||Date.now()))/60000));if(mins<1)return'Now';if(mins<60)return mins+'m ago';const h=Math.floor(mins/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago'}

  // Parent-only curriculum age permissions. Profile age is always protected as the default.
  const ageBox=document.getElementById('parentAgePermissions');
  if(ageBox&&window.CWCurriculum){
    const render=()=>{
      const a=CWCurriculum.accessState();
      ageBox.innerHTML=Array.from({length:CWCurriculum.AGE_MAX-CWCurriculum.AGE_MIN+1},(_,i)=>CWCurriculum.AGE_MIN+i).map(age=>`<label class="age-permission ${age===a.defaultAge?'default-age':''}"><span><b>Age ${age}</b><small>${age===a.defaultAge?'Profile default':'Optional curriculum access'}</small></span><input type="checkbox" data-parent-age="${age}" ${a.unlockedAges.includes(age)?'checked':''} ${age===a.defaultAge?'disabled':''}></label>`).join('');
      ageBox.querySelectorAll('input').forEach(input=>input.onchange=()=>{
        const current=CWCurriculum.accessState();const setAges=new Set(current.unlockedAges);const age=Number(input.dataset.parentAge);input.checked?setAges.add(age):setAges.delete(age);setAges.add(current.defaultAge);CWCurriculum.saveAccess({unlockedAges:[...setAges]});
        const status=document.getElementById('agePermissionStatus');if(status){status.hidden=false;status.textContent=`✓ Curriculum access updated. Age ${current.defaultAge} remains the child's default.`;setTimeout(()=>status.hidden=true,2600)}
      });
    };render();
  }


  const challengeSummary=document.getElementById('parentChallengeSummary');
  if(challengeSummary&&window.CWCurriculum){
    try{
      const prefs=CWCurriculum.preferences(),raw=JSON.parse(localStorage.getItem('cw_brain_battle_v5')||'{"profiles":{}}'),key=`${prefs.childId}:${prefs.age}:${prefs.country}`;
      const pf=raw.profiles?.[key];
      if(pf&&prefs.country){
        const cycle=pf.cycles?.find(x=>x.number===pf.activeCycle)||pf.cycles?.[pf.cycles.length-1];
        const country=CWCurriculum.COUNTRIES[prefs.country];
        if(cycle){
          const stageCards=CWCurriculum.TIERS.map((name,i)=>{const st=cycle.stages?.[i];return `<div><small>${name}</small><b>${st?.initialScore??'—'}${st?'%':''}</b><span>${st?.mastered?'Mastered':st?'Review / in progress':'Not started'}</span></div>`}).join('');
          challengeSummary.innerHTML=`<div class="parent-mission-meta"><span>${country?.flag||''} ${country?.label?.en||prefs.country}</span><span>Age ${prefs.age}</span><span>Mission ${cycle.number}${cycle.completed?' • Complete':''}</span>${cycle.completed?`<span>Overall initial score ${cycle.overallScore}%</span>`:''}</div><div class="parent-stage-scores">${stageCards}</div><p class="small-note">Mastery completion never rewrites these initial stage scores.</p>`;
        }
      }
    }catch(_){/* keep empty-state copy */}
  }

  const form=document.getElementById('parentFeedbackForm');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const type=document.getElementById('feedbackType').value,msg=document.getElementById('feedbackMessage').value.trim();if(!msg)return;CWState.addFeedback({type,message:msg,from:access.parentEmail||'Prototype parent'});document.getElementById('feedbackResult').innerHTML='<div class="feedback-success">✓ Feedback saved in the prototype inbox on this device. The production version will send it securely to Admin Studio.</div>';form.reset();CWState.logActivity({id:'parent-feedback',title:'Parent feedback sent',icon:'💬',detail:type,href:'parent.html'})});
  const manage=document.getElementById('pManageChild');if(manage)manage.onclick=()=>location.href='family-setup.html';
})();
