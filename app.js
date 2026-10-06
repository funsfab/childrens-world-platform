const $$=(s,r=document)=>[...r.querySelectorAll(s)]; const $=(s,r=document)=>r.querySelector(s);
let LANG=localStorage.getItem('africana-lang')||'fr';
function setLang(l){LANG=l;localStorage.setItem('africana-lang',l);document.documentElement.lang=l;$$('[data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===l));$$('[data-fr]').forEach(el=>{el.textContent=el.dataset[l]||el.dataset.fr});if(window.__menuRows)renderMenu(window.__menuActive||'all');}
function initNav(){const b=$('.menuBtn'),n=$('.nav');if(b&&n)b.onclick=()=>n.classList.toggle('open');$$('[data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));setLang(LANG)}
async function api(p,o={}){const r=await fetch('/api/'+p,o);let j={};try{j=await r.json()}catch{};if(!r.ok)throw j;return j}
async function loadMenu(){
  const grid=$('#menuGrid'),tabs=$('#menuTabs');if(!grid)return;
  try{
    const [rows,cats]=await Promise.all([api('menu'),api('menu-categories')]);
    window.__menuRows=rows;window.__menuCats=cats;window.__menuActive='all';
    const allLabel=LANG==='en'?'All':'Tous';
    tabs.innerHTML=[`<button class="chip on" data-cat="all">${allLabel}</button>`,...cats.map(c=>`<button class="chip" data-cat="${c.id}">${LANG==='en'?(c.name_en||c.name_fr):c.name_fr}</button>`)].join('');
    $$('[data-cat]',tabs).forEach(b=>b.onclick=()=>{window.__menuActive=b.dataset.cat;$$('[data-cat]',tabs).forEach(x=>x.classList.remove('on'));b.classList.add('on');renderMenu(window.__menuActive)});
    renderMenu('all');
  }catch{grid.innerHTML=`<div class="notice bad">${LANG==='en'?'Menu temporarily unavailable.':'Menu momentanément indisponible.'}</div>`}
}
function renderMenu(catId='all'){
  const grid=$('#menuGrid'),tabs=$('#menuTabs');if(!grid||!window.__menuRows)return;
  const rows=window.__menuRows,cats=window.__menuCats||[];
  if(tabs){
    const all=tabs.querySelector('[data-cat="all"]');if(all)all.textContent=LANG==='en'?'All':'Tous';
    cats.forEach(c=>{const b=tabs.querySelector(`[data-cat="${c.id}"]`);if(b)b.textContent=LANG==='en'?(c.name_en||c.name_fr):c.name_fr});
  }
  const chosen=catId==='all'?cats:cats.filter(c=>String(c.id)===String(catId));
  const blocks=[];
  for(const c of chosen){
    const rr=rows.filter(x=>String(x.category_id)===String(c.id)); if(!rr.length)continue;
    const title=LANG==='en'?(c.name_en||c.name_fr):c.name_fr;
    blocks.push(`<section class="menu-category-block"><div class="menu-category-head"><h2>${escHtml(title)}</h2><span>${rr.length} ${LANG==='en'?'items':'articles'}</span></div><div class="menu-grid">${rr.map((x,i)=>menuCard(x,i)).join('')}</div></section>`);
  }
  grid.innerHTML=blocks.join('')||`<div class="notice">${LANG==='en'?'No items in this category.':'Aucun article dans cette catégorie.'}</div>`;
}

function formatEuroPrice(v){
  const raw=String(v??'').trim(); if(!raw)return '';
  const clean=raw.replace(/€/g,'').trim();
  const one=x=>{const t=String(x).trim().replace(',','.');if(!/^\d+(?:\.\d{1,2})?$/.test(t))return String(x).trim();const n=Number(t);return (Number.isInteger(n)?String(n):n.toFixed(2).replace('.',','))+' €'};
  if(/^\s*\d+(?:[.,]\d{1,2})?\s*$/.test(clean))return one(clean);
  if(clean.includes('/'))return clean.split('/').map(one).join(' / ');
  return clean.replace(/(\d+(?:[.,]\d{1,2})?)/g,m=>one(m));
}
function menuCard(x,i){
  const name=LANG==='en'?(x.name_en||x.name_fr):x.name_fr;
  const desc=LANG==='en'?(x.description_en||x.description_fr||''):(x.description_fr||'');
  const img=x.image_path||`assets/${pickImage(x.category_fr||x.category,i)}`;
  const featured=Number(x.featured||0)===1;
  const badge=featured?`<span class="featured-badge">${LANG==='en'?'Featured':'Mis en avant'}</span>`:'';
  return `<article class="menu-item${featured?' featured-item':''}"><img src="${escAttr(img)}" alt="${escAttr(name)}"><div class="menu-item-copy">${badge}<div class="name">${escHtml(name)}</div><div class="desc">${escHtml(desc)}</div></div><div class="price">${escHtml(formatEuroPrice(x.price))}</div></article>`;
}
function escHtml(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]))}
function escAttr(v){return escHtml(v)}
function pickImage(cat,i){const m={'Finger Foods':['pastels.jpg','tenders.jpg','nems.jpg','onion-rings.jpg','wings.jpg'],'Grillades':['chicken-skewers.jpg','beef-skewers.jpg','chicken-fries.jpg'],'Plats':['mafe.jpg','thieb.jpg','yassa.jpg','fufu-stew.jpg'],'Burgers':['food-spread.jpg'],'Accompagnements':['food-spread.jpg'],'Desserts':['cocktail-alt.jpg'],'Cocktails':['cocktail-pour.jpg','cocktail-alt.jpg'],'Mocktails':['cocktail.jpeg'],'Bières':['cocktail.jpg'],'Rhums':['cocktail-alt.jpg'],'Softs':['cocktail.jpeg'],'À partager':['food-spread.jpg']};const a=m[cat]||['food-spread.jpg','mafe-alt.jpg'];return a[i%a.length]}
async function loadEvents(){const el=$('#eventList');if(!el)return;try{const rows=await api('events');el.innerHTML=rows.filter(x=>x.published).map(x=>`<article class="event"><div class="event-date">${(x.event_date||'').slice(5).replace('-','/')}</div><div><b>${x.title}</b><div class="muted">${x.description||''}</div></div><div><span class="pill">${x.event_time||''}</span></div></article>`).join('')||'<p class="muted">Aucun événement publié pour le moment.</p>'}catch{el.innerHTML='<p class="muted">Événements à venir.</p>'}}
function reserve(){const f=$('#reserveForm');if(!f)return;const ts=$('#reservationTime');if(ts&&!ts.options.length){ts.innerHTML='<option value="">—</option>';for(let h=0;h<24;h++)for(const m of [0,15,30,45]){const x=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');const o=document.createElement('option');o.value=x;o.textContent=x;ts.appendChild(o)}}f.onsubmit=async e=>{e.preventDefault();const n=$('#reserveNotice');const d=Object.fromEntries(new FormData(f));d.party_size=Number(d.party_size||0);d.business='Restaurant';d.language=LANG;d.phone=(d.phone||'').trim();d.email=(d.email||'').trim();d.res_time=(d.res_time||'').trim();if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(d.res_time)){n.className='notice bad';n.textContent=LANG==='en'?'Please enter the time in 24-hour format (HH:MM).':"Merci de saisir l'heure au format 24 h (HH:MM).";return}if(!d.party_size||d.party_size<1){n.className='notice bad';n.textContent=LANG==='en'?'Please enter the number of guests.':'Merci de renseigner le nombre de personnes.';return}if(!d.phone&&!d.email){n.className='notice bad';n.textContent=LANG==='en'?'Please provide at least a phone number or an email address.':'Merci de renseigner au moins un numéro de téléphone ou une adresse email.';return}try{const j=await api('reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});n.className='notice ok';n.textContent=j.message||(LANG==='en'?'Your reservation request has been received.':'Votre demande a été enregistrée.');f.reset()}catch(x){n.className='notice bad';n.textContent=x.message||x.error||(LANG==='en'?'This time slot is fully booked. Please try another time.':'Ce créneau est complet. Merci de réessayer plus tard.')}}}
document.addEventListener('DOMContentLoaded',()=>{initNav();loadMenu();loadEvents();reserve()});
