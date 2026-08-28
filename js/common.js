(function(){
  document.querySelectorAll('.world-card,.hq-world,.mission-card,.rail-card,.product-card').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(matchMedia('(pointer:fine)').matches){const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-2px)`}});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
  window.playTone=function(ok=true){try{const A=window.AudioContext||window.webkitAudioContext;const ctx=new A();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=ok?660:210;o.type='sine';g.gain.setValueAtTime(.06,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.19)}catch(e){}}
})();
