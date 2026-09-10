(function(){
  const KEY='cw_profile_state_v2';
  const pageMeta={
    'japan.html':{id:'japan',title:'Japan World Mission',icon:'🇯🇵',href:'japan.html',kind:'Explore'},
    'game.html':{id:'flagquest',title:'Flag Quest',icon:'🎮',href:'game.html',kind:'Play'},
    'challenge.html':{id:'brainbattle',title:'Brain Battle',icon:'🧠',href:'challenge.html',kind:'Challenge'},
    'city-builder.html':{id:'citybuilder',title:'Build Your City',icon:'🏙️',href:'city-builder.html',kind:'Build'},
    'life-lab.html':{id:'lifelab',title:'£35 Life Lab',icon:'💷',href:'life-lab.html',kind:'Life'},
    'story-world.html':{id:'storyworld',title:'Story World',icon:'🎬',href:'story-world.html',kind:'Watch'},
    'creator.html':{id:'creator',title:'Creator Studio',icon:'🎨',href:'creator.html',kind:'Create'},
    'arcade.html':{id:'arcade',title:'Children World Arcade',icon:'🕹️',href:'arcade.html',kind:'Play'}
  };
  function blank(){return {xp:0,achievements:[],passport:[],completed:{},progress:{},recent:[],resume:null,feedback:[],searchLog:[],settings:{sound:true,reducedMotion:false},updatedAt:Date.now()}}
  function load(){let s=blank();try{s=Object.assign(s,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){};s.recent=Array.isArray(s.recent)?s.recent:[];s.passport=Array.isArray(s.passport)?s.passport:[];s.achievements=Array.isArray(s.achievements)?s.achievements:[];s.completed=s.completed||{};s.progress=s.progress||{};s.feedback=Array.isArray(s.feedback)?s.feedback:[];s.searchLog=Array.isArray(s.searchLog)?s.searchLog:[];return s}
  function save(s){s.updatedAt=Date.now();localStorage.setItem(KEY,JSON.stringify(s));return s}
  function logActivity(item){const s=load();const entry=Object.assign({time:Date.now()},item);s.recent=[entry,...s.recent.filter(x=>!(x.id===entry.id&&x.detail===entry.detail))].slice(0,20);return save(s)}
  function setProgress(id,value,meta={}){const s=load();s.progress[id]=Object.assign({},s.progress[id]||{},meta,{value,updatedAt:Date.now()});return save(s)}
  function setResume(item){const s=load();s.resume=Object.assign({updatedAt:Date.now()},item);return save(s)}
  function clearResume(id){const s=load();if(!id||s.resume?.id===id)s.resume=null;return save(s)}
  function addXP(amount,reason){const s=load();s.xp=Math.max(0,Number(s.xp||0)+Number(amount||0));if(reason) s.recent=[{id:'xp-'+Date.now(),title:'XP earned',icon:'⭐',detail:`+${amount} XP • ${reason}`,time:Date.now()},...s.recent].slice(0,20);return save(s)}
  function complete(id,meta={}){const s=load();s.completed[id]=Object.assign({completedAt:Date.now()},meta);if(s.resume?.id===id)s.resume=null;return save(s)}
  function addPassport(code,meta={}){const s=load();if(!s.passport.some(x=>x.code===code))s.passport.push(Object.assign({code,earnedAt:Date.now()},meta));return save(s)}
  function addAchievement(id,title,icon='🏆'){const s=load();if(!s.achievements.some(x=>x.id===id))s.achievements.push({id,title,icon,earnedAt:Date.now()});return save(s)}
  function levelInfo(){const s=load();const xp=Number(s.xp||0);const level=Math.floor(xp/600)+1;const current=xp%600;return {xp,level,current,next:600,percent:Math.round(current/600*100)}}
  function addFeedback(data){const s=load();s.feedback.unshift(Object.assign({id:'fb-'+Date.now(),status:'New',createdAt:Date.now()},data));return save(s)}
  function logSearch(query,resultCount=0){const q=String(query||'').trim().slice(0,120);if(!q)return load();const s=load();s.searchLog.unshift({query:q.toLowerCase(),results:Number(resultCount)||0,time:Date.now()});s.searchLog=s.searchLog.slice(0,500);return save(s)}
  function reset(){localStorage.removeItem(KEY)}
  function currentPage(){return location.pathname.split('/').pop()||'index.html'}
  window.CWState={load,save,logActivity,setProgress,setResume,clearResume,addXP,complete,addPassport,addAchievement,levelInfo,addFeedback,logSearch,reset,pageMeta};

  // Record meaningful visits and make them resumable. Home/account pages are intentionally excluded.
  const p=currentPage(),meta=pageMeta[p];
  if(meta){
    logActivity({id:meta.id,title:meta.title,icon:meta.icon,detail:`Opened ${meta.kind} activity`,href:meta.href});
    const s=load();
    if(!s.completed[meta.id])setResume({id:meta.id,title:meta.title,icon:meta.icon,href:meta.href,kind:meta.kind});
  }
})();
