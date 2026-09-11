(function(){
  const MUTE_KEY='cw_music_muted_v1';
  const SESSION_KEY='cw_music_session_v1';
  const tracks=Array.from({length:30},(_,i)=>`assets/music/cw_track_${String(i+1).padStart(2,'0')}.wav`);
  const audio=new Audio();
  audio.preload='auto';
  audio.volume=.23;
  let started=false;
  let state={index:Math.floor(Math.random()*tracks.length),startedAt:Date.now(),offset:0};
  try{state=Object.assign(state,JSON.parse(sessionStorage.getItem(SESSION_KEY)||'{}'))}catch(e){}
  const muted=()=>localStorage.getItem(MUTE_KEY)==='1';
  function save(){
    state.offset=Number(audio.currentTime)||0;
    state.startedAt=Date.now();
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(state))}catch(e){}
  }
  function chooseNext(){
    let next=state.index;
    while(next===state.index&&tracks.length>1)next=Math.floor(Math.random()*tracks.length);
    state.index=next; state.offset=0; save();
    audio.src=tracks[state.index];
  }
  function updateButton(){
    const btn=document.getElementById('cwMusicToggle');
    if(!btn)return;
    btn.textContent=muted()?'🔇':'🔊';
    const label=window.CWLang?.t?.(muted()?'Music muted':'Music on')||(muted()?'Music muted':'Music on');
    btn.setAttribute('aria-label',label);
    btn.title=label;
  }
  function ensureDock(){
    let dock=document.querySelector('.cw-utility-dock');
    if(!dock){dock=document.createElement('div');dock.className='cw-utility-dock';document.body.appendChild(dock)}
    if(!dock.querySelector('#cwMusicToggle')){
      const btn=document.createElement('button');btn.id='cwMusicToggle';btn.className='cw-music-toggle';btn.type='button';
      dock.appendChild(btn);
      btn.onclick=()=>{
        const next=!muted();localStorage.setItem(MUTE_KEY,next?'1':'0');audio.muted=next;updateButton();
        if(!next)start(true);
      };
    }
    updateButton();
  }
  async function start(force=false){
    if(muted()&&!force)return;
    if(!audio.src){
      audio.src=tracks[state.index%tracks.length];
      audio.currentTime=Math.max(0,Number(state.offset)||0);
    }
    audio.muted=muted();
    try{await audio.play();started=true}catch(e){started=false}
  }
  audio.addEventListener('ended',()=>{chooseNext();start()});
  audio.addEventListener('timeupdate',()=>{if(Math.floor(audio.currentTime)%4===0)save()});
  window.addEventListener('beforeunload',save);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
  ensureDock();
  // Browser autoplay policies may block sound. The first normal tap/click starts it.
  const unlock=()=>{if(!started&&!muted())start();document.removeEventListener('pointerdown',unlock,true);document.removeEventListener('keydown',unlock,true)};
  document.addEventListener('pointerdown',unlock,true);
  document.addEventListener('keydown',unlock,true);
  if(!muted())start();
  window.CWMusic={start,muted};
})();
