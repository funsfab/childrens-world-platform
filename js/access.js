(function(){
  const KEY='cw_access_v1';
  const ADMIN_KEY='cw_admin_preview_v1';
  const levels={visitor:0,trial:1,active:2};
  const labels={visitor:'PUBLIC DEMO',trial:'EXPLORER ACCESS',active:'FULL WORLD'};
  function load(){
    let s={status:'visitor'};
    try{s=Object.assign(s,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
    if(s.status==='trial' && s.trialExpires && Date.now()>Number(s.trialExpires)) s.status='expired';
    return s;
  }
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s}
  function adminLoad(){try{return JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}')}catch(e){return {}}}
  function adminActive(){return adminLoad().active===true}
  function adminLogin(user,pin){
    const ok=String(user||'').trim().toLowerCase()==='owner' && String(pin||'').trim()==='2413';
    if(ok)localStorage.setItem(ADMIN_KEY,JSON.stringify({active:true,role:'owner-preview',startedAt:Date.now()}));
    return ok;
  }
  function adminLogout(){localStorage.removeItem(ADMIN_KEY)}
  function rank(status){return status==='expired'?0:(levels[status]||0)}
  function featureFrom(el){return el.dataset.feature || el.querySelector('b,h2,h3')?.textContent?.trim() || 'this adventure'}
  function lockUrl(feature){return 'locked.html?feature='+encodeURIComponent(feature)}
  const isAdmin=adminActive();
  window.CWAdmin={get:adminLoad,isActive:adminActive,login:adminLogin,logout:adminLogout};
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
  document.documentElement.dataset.admin=isAdmin?'true':'false';

  if(isAdmin && !document.querySelector('.admin-preview-bar')){
    const bar=document.createElement('div');
    bar.className='admin-preview-bar';
    bar.innerHTML='<span>🔐 OWNER / ADMIN PREVIEW</span><small>All implemented prototype access is unlocked for testing.</small><a href="admin.html">Admin dashboard</a><button type="button" id="adminExitPreview">Exit admin</button>';
    document.body.prepend(bar);
    bar.querySelector('#adminExitPreview').onclick=()=>{adminLogout();location.href='admin-login.html'};
  }

  // Status chip in headers. In admin preview it remains the underlying public/trial/full state,
  // so the owner can see what a normal visitor state currently is.
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
    if(isAdmin) banner.innerHTML='<div><b>🔐 Admin Preview</b><span>Owner testing mode is active. Normal visitor locks are bypassed while you review the prototype.</span></div><a href="admin.html">Admin dashboard →</a>';
    else if(statusForUi==='visitor') banner.innerHTML='<div><b>👀 Public Demo</b><span>Try a small sample. A grown-up can start the Family Trial to unlock more.</span></div><a href="register.html">Start Family Trial →</a>';
    else if(statusForUi==='trial'){
      const days=s.trialExpires?Math.max(0,Math.ceil((Number(s.trialExpires)-Date.now())/86400000)):7;
      banner.innerHTML='<div><b>🧭 Explorer Access</b><span>Family Trial • '+days+' day'+(days===1?'':'s')+' remaining • some Full World adventures stay locked.</span></div><a href="membership.html">Parent access →</a>';
    } else if(statusForUi==='active') banner.innerHTML='<div><b>🌍 Full World Unlocked</b><span>Your family membership has full prototype access.</span></div><a href="parent.html">Parent Centre →</a>';
  }

  const note=document.getElementById('storyAccessNote');
  if(note){
    note.innerHTML=isAdmin?'<b>🔐 Admin Preview:</b> sample and gated prototype items can be inspected. Unbuilt Full World items open an owner feature inspector.':statusForUi==='active'?'<b>🌍 Full World:</b> all implemented prototype episode cards are unlocked.':'<b>🎬 Story World access:</b> sample episodes are open; Full World episodes show a lock.';
  }

  // Mark and intercept gated links/buttons. Admin bypasses gates.
  document.querySelectorAll('[data-access]').forEach(el=>{
    const required=el.dataset.access;
    const enough=isAdmin || rank(statusForUi)>=rank(required);
    if(isAdmin){
      el.classList.remove('cw-locked');
      // Some Full World cards are placeholders whose normal href is the lock screen.
      // Give the owner a useful inspector instead of pretending the feature is built.
      if(el.matches('a[href^="locked.html"]')) el.href='admin-feature.html?feature='+encodeURIComponent(featureFrom(el));
      return;
    }
    if(!enough){
      el.classList.add('cw-locked');
      const hasBuiltInFullWorld=required==='active' && (el.querySelector('.full-world-tag') || Array.from(el.querySelectorAll('.arcade-status')).some(x=>x.textContent.includes('FULL WORLD')));
      if(!hasBuiltInFullWorld && !el.querySelector('.cw-lock-badge')){
        const badge=document.createElement('span');
        badge.className='cw-lock-badge'; badge.tabIndex=0; badge.setAttribute('role','note');
        badge.textContent='🔒'; badge.dataset.label=required==='active'?'Full World':'Explorer Access';
        badge.setAttribute('aria-label',required==='active'?'Full World access required':'Explorer Access required');
        el.appendChild(badge);
      }
      let touchArmed=false,timer=null;
      el.addEventListener('click',e=>{
        if(matchMedia('(pointer:coarse)').matches && !touchArmed){
          e.preventDefault(); touchArmed=true; el.classList.add('show-lock-tip');
          clearTimeout(timer); timer=setTimeout(()=>{touchArmed=false;el.classList.remove('show-lock-tip')},1700); return;
        }
        e.preventDefault(); location.href=lockUrl(featureFrom(el));
      });
    }
  });

  if(isAdmin){
    document.querySelectorAll('.full-world-tag').forEach(x=>x.textContent='FULL WORLD • ADMIN OPEN');
    document.querySelectorAll('.arcade-status').forEach(x=>{if(x.textContent.includes('FULL WORLD'))x.textContent='FULL WORLD • ADMIN OPEN'});
  }

  // Dynamic parent membership panel
  const state=document.getElementById('parentPlanState'), access=document.getElementById('parentPlanAccess'), noteEl=document.getElementById('parentPlanNote'), title=document.getElementById('parentPlanTitle');
  if(state){
    if(statusForUi==='visitor'){title.textContent='Public Demo';state.textContent='DEMO';access.textContent='Small sample only';noteEl.textContent='Start a Family Trial to create child profiles and save a real trial state.'}
    if(statusForUi==='trial'){title.textContent='Family Trial';state.textContent='TRIAL';access.textContent='Explorer Access';noteEl.textContent='Limited access • no card stored in this prototype.'}
    if(statusForUi==='active'){title.textContent='Family Membership';state.textContent='ACTIVE';access.textContent='Full World unlocked';noteEl.textContent='Test-mode membership state • no real payment taken.'}
  }
})();