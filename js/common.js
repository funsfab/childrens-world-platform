(function(){
  document.querySelectorAll('.world-card,.hq-world,.mission-card,.rail-card,.product-card').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(matchMedia('(pointer:fine)').matches){const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-2px)`}});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  window.playTone=function(ok=true){try{const A=window.AudioContext||window.webkitAudioContext;const ctx=new A();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=ok?660:210;o.type='sine';g.gain.setValueAtTime(.06,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.19)}catch(e){}};

  // Deliberate compact navigation for tablet portrait + both mobile modes.
  const top=document.querySelector('.topbar');
  if(top && !top.querySelector('.compact-nav-toggle')){
    const btn=document.createElement('button');btn.className='compact-nav-toggle';btn.type='button';btn.setAttribute('aria-expanded','false');btn.innerHTML='☰ <span>Menu</span>';
    const panel=document.createElement('nav');panel.className='compact-nav-panel';panel.setAttribute('aria-label','Children World navigation');
    const status=window.CWAccess?.get()?.status||'visitor';
    const statusLabel=status==='active'?'Full World':status==='trial'?'Explorer Access':'Public Demo';
    panel.innerHTML=`<a href="#experience">Experience <span>↓</span></a><a href="arcade.html">Arcade <span>🎮</span></a><a href="story-world.html">Story World <span>🎬</span></a><a href="hq.html">My World HQ <span>🌍</span></a><a href="parent.html">Parent Centre <span>👨‍👩‍👧</span></a><a href="register.html">Start Family Trial <span>→</span></a><a class="compact-status" href="${status==='visitor'?'register.html':'membership.html'}">${statusLabel}<span>${status==='visitor'?'👀':status==='trial'?'🧭':'🌍'}</span></a>`;
    top.append(btn,panel);
    const close=()=>{panel.classList.remove('open');btn.setAttribute('aria-expanded','false')};
    btn.onclick=e=>{e.stopPropagation();const open=!panel.classList.contains('open');panel.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))};
    panel.addEventListener('click',()=>close());document.addEventListener('click',e=>{if(!panel.contains(e.target)&&e.target!==btn)close()});
  }
})();