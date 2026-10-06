const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let me=null,current='dashboard';
const labels={dashboard:'Tableau de bord',restaurant:'Restaurant',club:'Night Club',reservations:'Réservations',menu:'Menu',inventory:'Stock & Inventaire',events:'Événements',finance:'Finances',staff:'Utilisateurs',operations:'Opérations',activity:"Journal d'activité"};
const groups={operations:[['tasks','Tâches'],['suppliers','Fournisseurs'],['maintenance','Maintenance'],['shifts','Planning'],['tables','Plan de salle'],['purchases','Achats'],['wastage','Pertes/Casse'],['cashups','Clôtures de caisse'],['hygiene','Hygiène'],['incidents','Incidents'],['feedback','Avis/Réclamations'],['guest-list','Guest list Club'],['leave','Congés'],['training','Formations'],['gift-cards','Cartes cadeaux'],['promotions','Promotions'],['loyalty','Fidélité'],['waitlist','Liste d’attente'],['equipment','Équipements'],['documents','Documents'],['checklists','Check-lists'],['stock-movements','Mouvements de stock']]};
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
async function api(path,opt={}){const r=await fetch('/api/'+path,{headers:{'Content-Type':'application/json',...(opt.headers||{})},...opt});let j={};try{j=await r.json()}catch{}if(!r.ok)throw j;return j}
async function init(){try{me=await api('me');if(!me.id)throw 0;showAdmin()}catch{$('#loginView').style.display='grid'}}
$('#loginForm').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));try{const j=await api('login',{method:'POST',body:JSON.stringify(d)});me=j.user;showAdmin()}catch(err){$('#loginErr').textContent=err.error||'Connexion impossible'}};
$('#logoutBtn').onclick=async()=>{await api('logout',{method:'POST'});location.reload()};
function showAdmin(){$('#loginView').style.display='none';$('#adminView').style.display='grid';$('#userBox').innerHTML=`<b>${me.name}</b><br><small>${me.role}</small>`;$$('#adminNav button').forEach(b=>b.onclick=()=>openPage(b.dataset.page));openPage('dashboard')}
async function openPage(p){current=p;$$('#adminNav button').forEach(b=>b.classList.toggle('on',b.dataset.page===p));$('#pageTitle').textContent=labels[p]||p;const box=$('#page');box.innerHTML='<p>Chargement…</p>';try{if(p==='dashboard')return dashboard();if(p==='restaurant')return settingsPanel('Restaurant');if(p==='club')return settingsPanel('Club');if(p==='reservations')return listModule('reservations');if(p==='menu')return menuAdmin();if(p==='inventory')return listModule('inventory');if(p==='events')return listModule('events');if(p==='finance')return listModule('finance');if(p==='staff')return listModule('users');if(p==='activity')return listModule('activity');if(p==='operations')return operations()}catch(e){box.innerHTML=`<div class="notice bad">${e.error||e.message||'Accès refusé'}</div>`}}
async function dashboard(){const d=await api('dashboard');$('#page').innerHTML=`<div class="admin-cards"><div class="stat"><small>Réservations aujourd'hui</small><br><b>${d.reservations_today}</b></div><div class="stat"><small>En attente</small><br><b>${d.pending}</b></div><div class="stat"><small>Stock faible</small><br><b>${d.stock_low}</b></div><div class="stat"><small>Événements actifs</small><br><b>${d.events}</b></div>${d.income_month!==undefined?`<div class="stat"><small>Revenus du mois</small><br><b>${Number(d.income_month).toFixed(2)} €</b></div><div class="stat"><small>Dépenses du mois</small><br><b>${Number(d.expense_month).toFixed(2)} €</b></div>`:''}</div><div class="card" style="margin-top:14px"><div class="pad"><h3>Aujourd'hui</h3><p class="muted">Un écran opérationnel simple pour voir réservations, stock faible, événements, tâches et alertes importantes.</p></div></div>`}
async function settingsPanel(type){const s=await api('settings');if(type==='Restaurant'){$('#page').innerHTML=`<div class="card"><div class="pad"><h3>Gestion Restaurant</h3><p>Le site Restaurant est actif. Le contenu quotidien se gère via Menu, Réservations, Événements, Stock et Opérations.</p><div class="actions"><button class="cta" onclick="openPage('menu')">Gérer le menu</button><button class="btn" onclick="openPage('reservations')">Voir les réservations</button></div></div></div>`}else{$('#page').innerHTML=`<div class="card"><div class="pad"><h3>Night Club</h3><p>État actuel : <b>${s.club_enabled?'ACTIF':'BIENTÔT DISPONIBLE'}</b></p>${me.role==='Owner'?`<button class="cta" id="clubToggle">${s.club_enabled?'Désactiver':'Activer'} le Club</button>`:''}</div></div>`;if($('#clubToggle'))$('#clubToggle').onclick=async()=>{await api('settings',{method:'POST',body:JSON.stringify({club_enabled:!s.club_enabled})});toast('Réglage enregistré');settingsPanel('Club')}}}
function esc(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]))}

function priceEditValue(v){return String(v??'').replace(/€/g,'').trim()}
function formatEuroPrice(v){
  const raw=String(v??'').trim(); if(!raw)return '';
  const clean=raw.replace(/€/g,'').trim();
  const one=x=>{const t=String(x).trim().replace(',','.');if(!/^\d+(?:\.\d{1,2})?$/.test(t))return String(x).trim();const n=Number(t);return (Number.isInteger(n)?String(n):n.toFixed(2).replace('.',','))+' €'};
  if(/^\s*\d+(?:[.,]\d{1,2})?\s*$/.test(clean))return one(clean);
  if(clean.includes('/'))return clean.split('/').map(one).join(' / ');
  return clean.replace(/(\d+(?:[.,]\d{1,2})?)/g,m=>one(m));
}
const visibleCols={reservations:['id','res_date','res_time','party_size','customer_name','phone','email','status','table_no','language','created_at','handled_by_name','handled_at'],menu:['id','category','name_fr','price','available'],inventory:['id','item_name','category','quantity','unit','status','location'],events:['id','business','title','event_date','status','published'],finance:['id','business','kind','category','amount','record_date','payment_method'],users:['id','name','email','role','department','active'],activity:['id','user_name','action','module','detail','created_at']};
const adminColLabels={
  id:'ID',res_date:'Date de réservation',res_time:'Heure',party_size:'Nombre de personnes',customer_name:'Nom du client',phone:'Téléphone',email:'Email',status:'Statut',table_no:'N° de table',language:'Langue client',created_at:'Réservé le',handled_by_name:'Traité par',handled_at:'Traité le',notes:'Notes'
};
async function listModule(mod){const endpoint=mod==='users'?'users':mod;const rows=await api(endpoint);const cols=visibleCols[mod]||Object.keys(rows[0]||{}).slice(0,8);let html=`<div class="toolbar"><div><b>${labels[current]||mod}</b> <span class="pill">${rows.length} enregistrements</span></div>${mod!=='activity'?`<button class="cta" id="addBtn">+ Ajouter</button>`:''}</div><div class="table-wrap"><table><thead><tr>${cols.map(c=>`<th>${adminColLabels[c]||c}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c==='available'||c==='published'||c==='active'?(r[c]?'Oui':'Non'):esc(r[c])}</td>`).join('')}<td><button class="smallbtn" data-edit="${r.id}">Modifier</button> <button class="smallbtn danger" data-del="${r.id}">Supprimer</button></td></tr>`).join('')}</tbody></table></div>`;$('#page').innerHTML=html;if($('#addBtn'))$('#addBtn').onclick=()=>openForm(mod,null);$$('[data-edit]').forEach(b=>b.onclick=()=>openForm(mod,rows.find(x=>String(x.id)===b.dataset.edit)));$$('[data-del]').forEach(b=>b.onclick=async()=>{if(confirm('Supprimer cet élément ?')){await api(`${endpoint}/${b.dataset.del}`,{method:'DELETE'});toast('Supprimé');listModule(mod)}})}
const forms={
reservations:[['res_date','date'],['res_time','time24'],['party_size','number'],['customer_name','text'],['phone','text'],['email','email'],['status','select: Nouvelle|En attente|Confirmée|Refusée|Annulée|Arrivée|Terminée|No-show'],['table_no','text'],['notes','textarea'],['language','readonly-lang']],
menu:[['category','text'],['name_fr','text'],['name_en','text'],['description_fr','textarea'],['description_en','textarea'],['price','text'],['available','checkbox'],['featured','checkbox']],
inventory:[['business','select:Restaurant|Club|Shared'],['department','text'],['item_name','text'],['category','text'],['quantity','number'],['unit','text'],['low_threshold','number'],['status','select:Disponible|Stock faible|Rupture|Cassé|À remplacer|À réparer|Nécessaire'],['location','text'],['notes','textarea']],
events:[['business','select:Restaurant|Club'],['title','text'],['description','textarea'],['event_date','date'],['event_time','time'],['status','select:Brouillon|Publié|Complet|Annulé|Terminé'],['published','checkbox'],['capacity','number']],
finance:[['business','select:Restaurant|Club|Shared'],['kind','select:Revenu|Dépense'],['category','text'],['amount','number'],['payment_method','text'],['record_date','date'],['supplier_payee','text'],['receipt','text'],['notes','textarea'],['status','text']],
users:[['name','text'],['email','email'],['password','text'],['role','select:Owner|Restaurant Manager|Club Manager|Restaurant Staff|Club Staff'],['department','select:All|Restaurant|Club'],['active','checkbox']]
};
function openForm(mod,row){let fields=(forms[mod]||[]).map(x=>[...x]);if(!fields.length)return toast('Utilisez la section Opérations pour ce module.');if(mod==='reservations'&&row&&row.status!=='Nouvelle'){fields=fields.map(([n,t])=>n==='status'?[n,'select:En attente|Confirmée|Refusée|Annulée|Arrivée|Terminée|No-show']:[n,t])}$('#modalTitle').textContent=row?'Modifier':'Ajouter';$('#recordFields').innerHTML=fields.map(([n,t])=>field(n,t,row?.[n])).join('');$('#modal').classList.add('show');$('#recordForm').onsubmit=async e=>{e.preventDefault();const d={};new FormData(e.target).forEach((v,k)=>d[k]=v);fields.filter(x=>x[1]==='checkbox').forEach(([n])=>d[n]=!!e.target.elements[n]?.checked);fields.filter(x=>x[1]==='number').forEach(([n])=>d[n]=d[n]===''?null:Number(d[n]));const ep=mod==='users'?'users':mod;try{const result=await api(row?`${ep}/${row.id}`:ep,{method:row?'PATCH':'POST',body:JSON.stringify(d)});$('#modal').classList.remove('show');if(mod==='reservations'&&result.notifications?.length){const sent=result.notifications.map(x=>`${x.channel.toUpperCase()}: ${x.status}`).join(' · ');toast(`Enregistré — ${sent}`)}else toast('Enregistré');listModule(mod)}catch(x){toast(x.error||'Erreur')}}}
function field(n,t,v){
  const label=adminColLabels[n]||n.replaceAll('_',' ');
  if(t==='textarea')return `<div class="field full"><label>${label}</label><textarea name="${n}">${esc(v)}</textarea></div>`;
  if(t==='checkbox')return `<div class="field"><label><input type="checkbox" name="${n}" ${v?'checked':''}> ${label}</label></div>`;
  if(t==='readonly-lang')return `<div class="field"><label>${label}</label><input type="text" value="${String(v||'fr').toUpperCase()}" disabled><small class="muted">Langue choisie par le client lors de la réservation — non modifiable.</small></div>`;
  if(t==='time24'){
    const options=[];for(let h=0;h<24;h++)for(let m of [0,15,30,45]){const x=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');options.push(`<option value="${x}" ${x===String(v||'')?'selected':''}>${x}</option>`)}
    return `<div class="field"><label>${label}</label><select name="${n}" required><option value="">—</option>${options.join('')}</select><small class="muted">Format 24 h</small></div>`;
  }
  if(t.startsWith('select:'))return `<div class="field"><label>${label}</label><select name="${n}">${t.slice(7).split('|').map(o=>`<option ${o==v?'selected':''}>${o}</option>`).join('')}</select></div>`;
  return `<div class="field"><label>${label}</label><input name="${n}" type="${t}" value="${esc(v)}"></div>`
}

async function menuAdmin(){
  const box=$('#page');
  const [cats,items]=await Promise.all([api('menu-categories?all=1'),api('menu?all=1')]);
  const catName=id=>cats.find(c=>String(c.id)===String(id))?.name_fr||'—';
  box.innerHTML=`
    <div class="admin-menu-head">
      <div><b>Gestion complète du menu</b><p class="muted">Catégories, ordre, traductions, prix, disponibilité et photos se gèrent ici sans modifier le code.</p></div>
      <div class="actions"><button class="btn" id="addCatBtn">+ Catégorie</button><button class="cta" id="addMenuItemBtn">+ Article</button></div>
    </div>
    <div class="card admin-menu-section"><div class="pad">
      <div class="toolbar"><h3>Catégories</h3><span class="pill">${cats.length}</span></div>
      <div class="table-wrap"><table><thead><tr><th>Ordre</th><th>Français</th><th>English</th><th>Visible</th><th>Articles</th><th>Actions</th></tr></thead><tbody>
      ${cats.map((c,idx)=>`<tr><td>${c.sort_order??0}</td><td>${esc(c.name_fr)}</td><td>${esc(c.name_en)}</td><td>${c.active?'Oui':'Non'}</td><td>${items.filter(i=>String(i.category_id)===String(c.id)).length}</td><td><button class="smallbtn" data-cat-up="${c.id}" ${idx===0?'disabled':''}>↑ Monter</button> <button class="smallbtn" data-cat-down="${c.id}" ${idx===cats.length-1?'disabled':''}>↓ Descendre</button> <button class="smallbtn" data-cat-edit="${c.id}">Modifier</button> <button class="smallbtn danger" data-cat-del="${c.id}">Supprimer</button></td></tr>`).join('')}
      </tbody></table></div>
    </div></div>
    <div class="card admin-menu-section"><div class="pad">
      <div class="toolbar"><h3>Articles du menu</h3><span class="pill">${items.length}</span></div>
      <div class="table-wrap"><table><thead><tr><th>Ordre</th><th>Photo</th><th>Catégorie</th><th>Nom FR</th><th>Nom EN</th><th>Prix</th><th>Disponible</th><th>Actions</th></tr></thead><tbody>
      ${items.map(i=>{const same=items.filter(x=>String(x.category_id)===String(i.category_id));const idx=same.findIndex(x=>String(x.id)===String(i.id));return `<tr><td>${i.sort_order??0}</td><td>${i.image_path?`<img class="admin-thumb" src="${esc(i.image_path)}" alt="">`:'—'}</td><td>${esc(catName(i.category_id))}</td><td>${esc(i.name_fr)}</td><td>${esc(i.name_en)}</td><td>${esc(formatEuroPrice(i.price))}</td><td>${i.available?'Oui':'Non'}</td><td><button class="smallbtn" data-item-up="${i.id}" ${idx===0?'disabled':''}>↑ Monter</button> <button class="smallbtn" data-item-down="${i.id}" ${idx===same.length-1?'disabled':''}>↓ Descendre</button> <button class="smallbtn" data-item-edit="${i.id}">Modifier</button> <button class="smallbtn danger" data-item-del="${i.id}">Supprimer</button></td></tr>`}).join('')}
      </tbody></table></div>
    </div></div>`;
  $('#addCatBtn').onclick=()=>openCategoryForm(null);
  $('#addMenuItemBtn').onclick=()=>openMenuItemForm(null,cats);
  $$('[data-cat-up]').forEach(b=>b.onclick=async()=>{try{await api('menu-category-move',{method:'POST',body:JSON.stringify({id:Number(b.dataset.catUp),direction:'up'})});toast('Catégorie déplacée');menuAdmin()}catch(e){toast(e.error||'Impossible de déplacer')}});
  $$('[data-cat-down]').forEach(b=>b.onclick=async()=>{try{await api('menu-category-move',{method:'POST',body:JSON.stringify({id:Number(b.dataset.catDown),direction:'down'})});toast('Catégorie déplacée');menuAdmin()}catch(e){toast(e.error||'Impossible de déplacer')}});
  $$('[data-cat-edit]').forEach(b=>b.onclick=()=>openCategoryForm(cats.find(c=>String(c.id)===b.dataset.catEdit)));
  $$('[data-cat-del]').forEach(b=>b.onclick=async()=>{if(confirm('Supprimer cette catégorie ?'))try{await api(`menu-categories/${b.dataset.catDel}`,{method:'DELETE'});toast('Catégorie supprimée');menuAdmin()}catch(e){toast(e.error||'Impossible de supprimer')}});
  $$('[data-item-up]').forEach(b=>b.onclick=async()=>{try{await api('menu-item-move',{method:'POST',body:JSON.stringify({id:Number(b.dataset.itemUp),direction:'up'})});toast('Article déplacé');menuAdmin()}catch(e){toast(e.error||'Impossible de déplacer')}});
  $$('[data-item-down]').forEach(b=>b.onclick=async()=>{try{await api('menu-item-move',{method:'POST',body:JSON.stringify({id:Number(b.dataset.itemDown),direction:'down'})});toast('Article déplacé');menuAdmin()}catch(e){toast(e.error||'Impossible de déplacer')}});
  $$('[data-item-edit]').forEach(b=>b.onclick=()=>openMenuItemForm(items.find(i=>String(i.id)===b.dataset.itemEdit),cats));
  $$('[data-item-del]').forEach(b=>b.onclick=async()=>{if(confirm('Supprimer cet article ?')){await api(`menu/${b.dataset.itemDel}`,{method:'DELETE'});toast('Article supprimé');menuAdmin()}});
}
function openCategoryForm(row){
  $('#modalTitle').textContent=row?'Modifier la catégorie':'Ajouter une catégorie';
  $('#recordFields').innerHTML=`
    <div class="field"><label>Nom français</label><input name="name_fr" value="${esc(row?.name_fr||'')}" required></div>
    <div class="field"><label>English name</label><input name="name_en" value="${esc(row?.name_en||'')}" required></div>
    ${row?`<div class="field"><label>Ordre actuel</label><input value="${row.sort_order??''}" disabled><small class="muted">Utilisez Monter / Descendre dans la liste pour changer l’ordre.</small></div>`:''}
    <div class="field"><label><input name="active" type="checkbox" ${row?.active!==0?'checked':''}> Visible sur le site</label></div>`;
  $('#modal').classList.add('show');
  $('#recordForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);const d={name_fr:fd.get('name_fr'),name_en:fd.get('name_en'),active:!!e.target.elements.active.checked};try{await api(row?`menu-categories/${row.id}`:'menu-categories',{method:row?'PATCH':'POST',body:JSON.stringify(d)});$('#modal').classList.remove('show');toast('Catégorie enregistrée');menuAdmin()}catch(x){toast(x.error||'Erreur')}};
}
async function uploadMenuImage(file){
  if(!file)return '';
  const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
  const out=await api('menu-upload',{method:'POST',body:JSON.stringify({filename:file.name,data})});return out.path||'';
}
function openMenuItemForm(row,cats){
  $('#modalTitle').textContent=row?'Modifier l’article':'Ajouter un article';
  $('#recordFields').innerHTML=`
    <div class="field"><label>Catégorie</label><select name="category_id" required><option value="">Choisir…</option>${cats.map(c=>`<option value="${c.id}" ${String(c.id)===String(row?.category_id)?'selected':''}>${esc(c.name_fr)} / ${esc(c.name_en)}</option>`).join('')}</select></div>
    ${row?`<div class="field"><label>Ordre actuel</label><input value="${row.sort_order??''}" disabled><small class="muted">Utilisez Monter / Descendre dans la liste pour changer l’ordre.</small></div>`:''}
    <div class="field"><label>Nom français</label><input name="name_fr" value="${esc(row?.name_fr||'')}" required></div>
    <div class="field"><label>English name</label><input name="name_en" value="${esc(row?.name_en||'')}" required></div>
    <div class="field full"><label>Description française</label><textarea name="description_fr">${esc(row?.description_fr||'')}</textarea></div>
    <div class="field full"><label>English description</label><textarea name="description_en">${esc(row?.description_en||'')}</textarea></div>
    <div class="field"><label>Prix</label><input name="price" inputmode="decimal" value="${esc(priceEditValue(row?.price||''))}" placeholder="Ex. 14,50 ou 14.50"><small class="muted">Saisissez uniquement le montant. Le symbole € est ajouté automatiquement.</small></div>
    <div class="field"><label>Photo actuelle</label><input name="image_path" value="${esc(row?.image_path||'')}" placeholder="assets/... (laisser vide pour photo automatique)"></div>
    <div class="field full"><label>Remplacer / ajouter une photo</label><input name="image_file" type="file" accept="image/jpeg,image/png,image/webp"><small class="muted">JPG, PNG ou WEBP, maximum 6 Mo.</small></div>
    <div class="field"><label><input name="available" type="checkbox" ${row?.available!==0?'checked':''}> Disponible / visible</label></div>
    <div class="field"><label><input name="featured" type="checkbox" ${row?.featured?'checked':''}> Mis en avant</label></div>`;
  $('#modal').classList.add('show');
  $('#recordForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);try{let imagePath=fd.get('image_path')||'';const file=e.target.elements.image_file.files[0];if(file){toast('Téléversement de la photo…');imagePath=await uploadMenuImage(file)}const d={category_id:Number(fd.get('category_id')),name_fr:fd.get('name_fr'),name_en:fd.get('name_en'),description_fr:fd.get('description_fr'),description_en:fd.get('description_en'),price:fd.get('price'),image_path:imagePath,available:!!e.target.elements.available.checked,featured:!!e.target.elements.featured.checked};await api(row?`menu/${row.id}`:'menu',{method:row?'PATCH':'POST',body:JSON.stringify(d)});$('#modal').classList.remove('show');toast('Article enregistré');menuAdmin()}catch(x){toast(x.error||'Erreur')}};
}
async function operations(){const cards=groups.operations.map(([k,l])=>`<button class="card opCard" data-op="${k}" style="text-align:left;cursor:pointer"><div class="pad"><h3>${l}</h3><p class="muted">Ouvrir le module</p></div></button>`).join('');$('#page').innerHTML=`<div class="feature-grid">${cards}</div><div id="opArea" style="margin-top:18px"></div>`;$$('.opCard').forEach(b=>b.onclick=()=>opList(b.dataset.op,b.textContent.trim()))}
async function opList(mod,title){const rows=await api(mod);const area=$('#opArea');const cols=Object.keys(rows[0]||{}).filter(x=>x!=='id').slice(0,6);area.innerHTML=`<div class="toolbar"><h3>${title}</h3><button class="cta" id="opAdd">+ Ajouter</button></div><div class="table-wrap"><table><thead><tr><th>ID</th>${cols.map(c=>`<th>${adminColLabels[c]||c}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.id}</td>${cols.map(c=>`<td>${esc(r[c])}</td>`).join('')}<td><button class="smallbtn danger" data-odel="${r.id}">Supprimer</button></td></tr>`).join('')}</tbody></table></div>`;$('#opAdd').onclick=()=>opQuickAdd(mod,title);$$('[data-odel]').forEach(b=>b.onclick=async()=>{if(confirm('Supprimer ?')){await api(`${mod}/${b.dataset.odel}`,{method:'DELETE'});opList(mod,title)}})}
function opQuickAdd(mod,title){const raw=prompt(`Ajouter dans ${title}.\nEntrez les données en JSON (exemple: {"title":"Ma tâche","status":"À faire"})`,'{}');if(raw===null)return;try{const d=JSON.parse(raw);api(mod,{method:'POST',body:JSON.stringify(d)}).then(()=>{toast('Ajouté');opList(mod,title)}).catch(e=>toast(e.error||'Erreur'))}catch{toast('JSON invalide')}}
$('#closeModal').onclick=()=>$('#modal').classList.remove('show');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('show')};init();
