(function(){
  if(!window.CWState)return;
  const state=CWState.load(), access=window.CWAccess?CWAccess.get():{}, li=CWState.levelInfo();
  const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val};
  set('pCountries',state.passport.length);set('pXp',li.xp.toLocaleString());set('pCompleted',Object.keys(state.completed||{}).length);set('pAchievements',state.achievements.length);
  set('pChildName',access.childNickname||'Explorer');set('pChildAvatar',access.childAvatar||'🦊');set('pChildMeta',`Age band ${access.childAge||'not set'} • Level ${li.level}`);set('pChildXp',`${li.xp.toLocaleString()} XP`);
  const bar=document.getElementById('pChildXpBar');if(bar)bar.style.width=li.percent+'%';
  const list=document.getElementById('parentActivityList');
  if(list){
    const recent=(state.recent||[]).slice(0,8);
    if(recent.length)list.innerHTML=recent.map(x=>`<div><span class="activity-icon">${x.icon||'✨'}</span><div><b>${x.title||'Activity'}</b><small>${x.detail||'Activity recorded'}</small></div><span>${friendlyTime(x.time)}</span></div>`).join('');
  }
  function friendlyTime(ts){const mins=Math.max(0,Math.floor((Date.now()-Number(ts||Date.now()))/60000));if(mins<1)return'Now';if(mins<60)return mins+'m ago';const h=Math.floor(mins/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago'}
  const form=document.getElementById('parentFeedbackForm');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const type=document.getElementById('feedbackType').value,msg=document.getElementById('feedbackMessage').value.trim();if(!msg)return;CWState.addFeedback({type,message:msg,from:access.parentEmail||'Prototype parent'});document.getElementById('feedbackResult').innerHTML='<div class="feedback-success">✓ Feedback saved in the prototype inbox on this device. The production version will send it securely to Admin Studio.</div>';form.reset();CWState.logActivity({id:'parent-feedback',title:'Parent feedback sent',icon:'💬',detail:type,href:'parent.html'})});
  const manage=document.getElementById('pManageChild');if(manage)manage.onclick=()=>location.href='family-setup.html';
})();
