(function(){
  const KEY='cw_access_v1';
  const levels={visitor:0,trial:1,active:2};
  const labels={visitor:'PUBLIC DEMO',trial:'EXPLORER ACCESS',active:'FULL WORLD'};
  function load(){
    let s={status:'visitor'};
    try{s=Object.assign(s,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
    if(s.status==='trial' && s.trialExpires && Date.now()>Number(s.trialExpires)) s.status='expired';
    return s;
  }
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s}
  function rank(status){return status==='expired'?0:(levels[status]||0)}
  function featureFrom(el){return el.dataset.feature || el.querySelector('b,h2,h3')?.textContent?.trim() || 'this adventure'}
  function lockUrl(feature){return 'locked.html?feature='+encodeURIComponent(feature)}
  window.CWAccess={
    get:load,
    setStatus(status,extra={}){return save(Object.assign(load(),extra,{status}))},
    startTrial(){const now=Date.now();return save(Object.assign(load(),{status:'trial',trialStarted:now,trialExpires:now+7*86400000}))},
    activate(){return save(Object.assign(load(),{status:'active'}))},
    reset(){localStorage.removeItem(KEY)},
    labels
  };
  let s=load();
  const statusForUi=s.status==='expired'?'visitor':s.status;
  document.documentElement.dataset.access=statusForUi;
  // Status chip in headers
  const header=document.querySelector('.topbar,.hq-topbar,.sub-top,.parent-topbar');
  if(header && !header.querySelector('.access-status-chip')){
    const a=document.createElement('a'); a.className='access-status-chip';
    a.href=statusForUi==='visitor'?'register.html':'membership.html';
    a.innerHTML='<span>'+ (statusForUi==='active'?'🌍':statusForUi==='trial'?'🧭':'👀') +'</span><b>'+labels[statusForUi]+'</b>';
    header.appendChild(a);
  }
  // Child profile personalization
  if(s.childNickname){
    document.querySelectorAll('.profile-chip b').forEach(x=>x.textContent=s.childNickname);
    document.querySelectorAll('.profile-chip .avatar').forEach(x=>x.textContent=s.childAvatar||'🦊');
  }
  // Access banner on HQ
  const banner=document.getElementById('accessBanner');
  if(banner){
    if(statusForUi==='visitor') banner.innerHTML='<div><b>👀 Public Demo</b><span>Try a small sample. A grown-up can start the Family Trial to unlock more.</span></div><a href="register.html">Start Family Trial →</a>';
    if(statusForUi==='trial'){
      const days=s.trialExpires?Math.max(0,Math.ceil((Number(s.trialExpires)-Date.now())/86400000)):7;
      banner.innerHTML='<div><b>🧭 Explorer Access</b><span>Family Trial • '+days+' day'+(days===1?'':'s')+' remaining • some Full World adventures stay locked.</span></div><a href="membership.html">Parent access →</a>';
    }
    if(statusForUi==='active') banner.innerHTML='<div><b>🌍 Full World Unlocked</b><span>Your family membership has full prototype access.</span></div><a href="parent.html">Parent Centre →</a>';
  }
  const note=document.getElementById('storyAccessNote');
  if(note){note.innerHTML=statusForUi==='active'?'<b>🌍 Full World:</b> all prototype episode cards are unlocked.':'<b>🎬 Story World access:</b> sample episodes are open; Full World episodes show a lock.'}
  // Mark and intercept gated links/buttons
  document.querySelectorAll('[data-access]').forEach(el=>{
    const required=el.dataset.access;
    const enough=rank(statusForUi)>=rank(required);
    if(!enough){
      el.classList.add('cw-locked');
      if(!el.querySelector('.cw-lock-badge')){const badge=document.createElement('span');badge.className='cw-lock-badge';badge.textContent=required==='active'?'FULL WORLD 🔒':'EXPLORER ACCESS 🔒';el.appendChild(badge)}
      el.addEventListener('click',e=>{e.preventDefault();location.href=lockUrl(featureFrom(el))});
    }
  });
  // Dynamic parent membership panel
  const state=document.getElementById('parentPlanState'), access=document.getElementById('parentPlanAccess'), noteEl=document.getElementById('parentPlanNote'), title=document.getElementById('parentPlanTitle');
  if(state){
    if(statusForUi==='visitor'){title.textContent='Public Demo';state.textContent='DEMO';access.textContent='Small sample only';noteEl.textContent='Start a Family Trial to create child profiles and save a real trial state.'}
    if(statusForUi==='trial'){title.textContent='Family Trial';state.textContent='TRIAL';access.textContent='Explorer Access';noteEl.textContent='Limited access • no card stored in this prototype.'}
    if(statusForUi==='active'){title.textContent='Family Membership';state.textContent='ACTIVE';access.textContent='Full World unlocked';noteEl.textContent='Test-mode membership state • no real payment taken.'}
  }
})();