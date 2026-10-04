(()=>{
  'use strict';
  const TIERS=['Explorer','Challenger','Investigator','Expert','Master Mission'];
  const COUNTRIES={
    UK:{code:'UK',label:{en:'United Kingdom',fr:'Royaume-Uni'},flag:'🇬🇧'},
    FR:{code:'FR',label:{en:'France',fr:'France'},flag:'🇫🇷'}
  };
  const AGE_MIN=10,AGE_MAX=13,PER_STAGE=20;
  const ACCESS_KEY='cw_curriculum_access_v2',PREF_KEY='cw_curriculum_preferences_v2';
  const ageFromBand=band=>{const n=parseInt(String(band||'').match(/\d+/)?.[0]||'10',10);return Number.isFinite(n)?Math.min(AGE_MAX,Math.max(AGE_MIN,n)):10};
  const childId=()=>String(window.CWAccess?.get?.()?.childId||'legacy-primary');
  const safeJSON=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'?v:fallback}catch(_){return fallback}};

  function accessState(){
    const access=window.CWAccess?.get?.()||{},id=childId(),defaultAge=ageFromBand(access.childAge);
    const root=safeJSON(ACCESS_KEY,{children:{}});root.children=root.children||{};
    let saved=root.children[id];
    if(!saved){
      // migrate earlier single-child prototype value when present
      const old=safeJSON('cw_curriculum_access_v1',{});saved={defaultAge,unlockedAges:Array.isArray(old.unlockedAges)?old.unlockedAges:[defaultAge]};
    }
    const set=new Set((saved.unlockedAges||[]).map(Number).filter(n=>n>=AGE_MIN&&n<=AGE_MAX));set.add(defaultAge);
    return {childId:id,defaultAge,unlockedAges:[...set].sort((a,b)=>a-b)};
  }
  function saveAccess(next){
    const cur=accessState(),root=safeJSON(ACCESS_KEY,{children:{}});root.children=root.children||{};
    const set=new Set((next?.unlockedAges||cur.unlockedAges).map(Number).filter(n=>n>=AGE_MIN&&n<=AGE_MAX));set.add(cur.defaultAge);
    root.children[cur.childId]={defaultAge:cur.defaultAge,unlockedAges:[...set].sort((a,b)=>a-b),updatedAt:Date.now()};localStorage.setItem(ACCESS_KEY,JSON.stringify(root));return root.children[cur.childId];
  }
  function preferences(){
    const a=accessState(),root=safeJSON(PREF_KEY,{children:{}});root.children=root.children||{};const p={age:a.defaultAge,country:null,...(root.children[a.childId]||{})};
    if(!a.unlockedAges.includes(Number(p.age)))p.age=a.defaultAge;if(p.country&&!COUNTRIES[p.country])p.country=null;return {...p,childId:a.childId};
  }
  function savePreferences(patch){
    const a=accessState(),root=safeJSON(PREF_KEY,{children:{}});root.children=root.children||{};const p={...preferences(),...patch,updatedAt:Date.now()};
    if(!a.unlockedAges.includes(Number(p.age)))p.age=a.defaultAge;if(p.country&&!COUNTRIES[p.country])p.country=null;delete p.childId;root.children[a.childId]=p;localStorage.setItem(PREF_KEY,JSON.stringify(root));return {...p,childId:a.childId};
  }

  let bankCache=null,idCache=null,conceptCache=null,bucketCache=null;
  function normalizedBank(){
    if(bankCache)return bankCache;
    if(Array.isArray(window.AGE10_CURRICULUM)&&window.AGE10_CURRICULUM.length){bankCache=window.AGE10_CURRICULUM.map(q=>({...q,conceptId:q.conceptId||q.id,sourceMode:q.sourceMode||'verified'}))}
    else{
      const legacy=Array.isArray(window.BRAIN_BANK)?window.BRAIN_BANK:[];
      bankCache=legacy.map(q=>({...q,conceptId:q.id,age:10,language:null,countries:q.subject?.en==='MY UK'?['UK']:['UK','FR'],subjectCode:String(q.subject?.en||'GENERAL').replace(/[^A-Z0-9]+/g,'_'),topicCode:'LEGACY_ENGINE_FIXTURE',sourceMode:'fixture'}));
    }
    idCache=new Map();conceptCache=new Map();bucketCache=new Map();
    for(const q of bankCache){idCache.set(q.id,q);const langs=q.language?[q.language]:['en','fr'];for(const l of langs)conceptCache.set(`${q.conceptId}:${l}`,q)}
    return bankCache;
  }
  function findById(id){normalizedBank();return idCache.get(id)}
  function findByConcept(conceptId,language){normalizedBank();return conceptCache.get(`${conceptId}:${language}`)}
  function eligible({age,country,tier,language}){
    const key=`${Number(age)}:${country}:${Number(tier)}:${language||'*'}`;normalizedBank();if(bucketCache.has(key))return bucketCache.get(key);
    const rows=bankCache.filter(q=>Number(q.age??10)===Number(age)&&Number(q.tier)===Number(tier)&&(q.country===country||q.countries?.includes?.(country))&&(!language||!q.language||q.language===language));bucketCache.set(key,rows);return rows;
  }
  function readiness({age,country,tier,language}){const pool=eligible({age,country,tier,language}),unique=new Set(pool.map(q=>q.conceptId||q.id));return {count:pool.length,uniqueConcepts:unique.size,ready:unique.size>=PER_STAGE,verified:pool.length>0&&pool.every(q=>String(q.sourceMode).startsWith('verified'))}}
  window.CWCurriculum={TIERS,COUNTRIES,AGE_MIN,AGE_MAX,PER_STAGE,ageFromBand,childId,accessState,saveAccess,preferences,savePreferences,normalizedBank,findById,findByConcept,eligible,readiness};
})();
