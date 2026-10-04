(()=>{
  'use strict';
  function shuffled(items,random=Math.random){const x=[...items];for(let i=x.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
  function selectUnseenFirst(pool,seenIds,count,random=Math.random){const seen=new Set(seenIds||[]),unique=new Map();for(const q of pool||[]){const key=q?.conceptId||q?.id;if(key&&!unique.has(key))unique.set(key,q)}const rows=[...unique.values()];const unseen=shuffled(rows.filter(q=>!seen.has(q.conceptId||q.id)),random),old=shuffled(rows.filter(q=>seen.has(q.conceptId||q.id)),random);return [...unseen,...old].slice(0,count)}
  function initialScore(correct,total=20){return total>0?Math.round((Number(correct||0)/Number(total))*100):0}
  function missionOverall(stageScores){const vals=(stageScores||[]).map(Number).filter(Number.isFinite);return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0}
  function nextTier(current,total=5){return current<total-1?current+1:null}
  window.CWChallengeModel={shuffled,selectUnseenFirst,initialScore,missionOverall,nextTier};
})();
