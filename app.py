from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, urlencode
import sqlite3, os, json, secrets, hashlib, hmac, mimetypes, datetime, traceback, base64, re, smtplib
from email.utils import formataddr
from email.message import EmailMessage
from urllib.request import Request, urlopen

DATABASE_URL=os.getenv('DATABASE_URL','').strip()
USE_POSTGRES=bool(DATABASE_URL)
if USE_POSTGRES:
    import psycopg
    from psycopg.rows import dict_row
    DB_INTEGRITY_ERRORS=(sqlite3.IntegrityError, psycopg.IntegrityError)
else:
    DB_INTEGRITY_ERRORS=(sqlite3.IntegrityError,)

BASE=os.path.dirname(os.path.abspath(__file__))
DB=os.getenv('DATABASE_PATH', os.path.join(BASE,'africana.db'))
SESSIONS={}

def _pg_sql(sql):
    q=sql
    q=q.replace("date('now','localtime')", "to_char(current_date,'YYYY-MM-DD')")
    q=q.replace("date('now')", "to_char(current_date,'YYYY-MM-DD')")
    q=q.replace('?', '%s')
    low=q.lstrip().lower()
    if low.startswith('insert or ignore into '):
        q=re.sub(r'(?i)^\s*insert\s+or\s+ignore\s+into\s+', 'insert into ', q)
        q=q.rstrip().rstrip(';')+' ON CONFLICT DO NOTHING'
    return q

class PgCursorCompat:
    def __init__(self, cur): self.cur=cur
    def execute(self, sql, params=None):
        m=re.match(r'(?is)^\s*pragma\s+table_info\(([^)]+)\)\s*$', sql)
        if m:
            table=m.group(1).strip().strip('\"`')
            self.cur.execute("select column_name as name from information_schema.columns where table_schema='public' and table_name=%s order by ordinal_position", (table,))
        else:
            self.cur.execute(_pg_sql(sql), params or ())
        return self
    def executescript(self, script):
        pg=script.replace('INTEGER PRIMARY KEY AUTOINCREMENT','BIGSERIAL PRIMARY KEY')
        for stmt in pg.split(';'):
            stmt=stmt.strip()
            if stmt: self.cur.execute(stmt)
        return self
    def fetchone(self): return self.cur.fetchone()
    def fetchall(self): return self.cur.fetchall()
    def __iter__(self): return iter(self.cur)

class PgConnCompat:
    def __init__(self):
        self.con=psycopg.connect(DATABASE_URL, row_factory=dict_row)
    def cursor(self): return PgCursorCompat(self.con.cursor())
    def execute(self, sql, params=None):
        c=self.cursor(); return c.execute(sql, params)
    def commit(self): self.con.commit()
    def rollback(self): self.con.rollback()
    def close(self): self.con.close()

def firstval(row):
    if row is None:return None
    if isinstance(row,dict):return next(iter(row.values()))
    return row[0]

def normalize_price(value):
    """Store menu prices without currency symbols; presentation adds EUR automatically."""
    if value is None:
        return ''
    raw=str(value).strip()
    if not raw:
        return ''
    # Currency is a presentation concern. Never store the euro sign in editable values.
    raw=raw.replace('€','').strip()
    simple=raw.replace(',','.')
    if re.fullmatch(r'\d+(?:\.\d{1,2})?', simple):
        amount=float(simple)
        if amount.is_integer():
            return str(int(amount))
        return f"{amount:.2f}"
    # Preserve legacy multi-price/free-text structures, but remove embedded euro signs.
    return re.sub(r'\s+', ' ', raw).strip()

def next_free_order(con, table, where_sql='', params=()):
    sql=f'select sort_order from {table}' + (f' where {where_sql}' if where_sql else '')
    used=set()
    for r in con.execute(sql,params):
        try:
            n=int(firstval(r) or 0)
        except (TypeError,ValueError):
            n=0
        if n>0: used.add(n)
    n=1
    while n in used:n+=1
    return n

def repair_menu_item_orders(con):
    # Ensure every category has unique, positive order numbers. Keep valid positions and fill gaps.
    for cat in con.execute('select id from menu_categories order by sort_order,id').fetchall():
        used=set(); repair=[]
        for r in con.execute('select id,sort_order from menu_items where category_id=? order by id',(cat['id'],)).fetchall():
            try: order=int(r['sort_order'] or 0)
            except (TypeError,ValueError): order=0
            if order>0 and order not in used:
                used.add(order)
            else:
                repair.append(r['id'])
        for rid in repair:
            order=1
            while order in used:order+=1
            con.execute('update menu_items set sort_order=? where id=?',(order,rid));used.add(order)


def normalize_language(value):
    return 'en' if str(value or '').lower().startswith('en') else 'fr'

def valid_time24(value):
    return bool(re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d', str(value or '').strip()))

def reservation_ack_message(row):
    lang=normalize_language(row.get('language'))
    date=str(row.get('res_date') or '')
    time=str(row.get('res_time') or '')
    guests=row.get('party_size') or ''
    if lang=='en':
        return (
            'Africana Meltingpot — reservation request received',
            f'Your reservation request for {date} at {time} for {guests} guest(s) has been received. Our team will review it and you will receive a confirmation shortly.'
        )
    return (
        'Africana Meltingpot — demande de réservation reçue',
        f'Votre demande de réservation du {date} à {time} pour {guests} personne(s) a bien été reçue. Notre équipe va la traiter et vous recevrez une confirmation prochainement.'
    )

def notify_reservation_ack(con,row):
    subject,message=reservation_ack_message(row)
    lang=normalize_language(row.get('language'));results=[]
    email=str(row.get('email') or '').strip();phone=str(row.get('phone') or '').strip()
    if email:
        ok,err=send_email_notification(email,subject,message);state='Envoyé' if ok else ('Configuration requise' if 'Configuration' in err else 'Échec')
        _record_reservation_notification(con,row['id'],'email',email,lang,'Nouvelle',subject,message,state,err);results.append({'channel':'email','status':state})
    if phone:
        ok,err=send_sms_notification(phone,message);state='Envoyé' if ok else ('Configuration requise' if 'Configuration' in err else 'Échec')
        _record_reservation_notification(con,row['id'],'sms',phone,lang,'Nouvelle',subject,message,state,err);results.append({'channel':'sms','status':state})
    return results

def reservation_status_message(status, row):
    """Return (subject, message) in the customer's booking language.
    Internal-only statuses intentionally return None.
    """
    lang=normalize_language(row.get('language'))
    status=str(status or '')
    date=str(row.get('res_date') or '')
    time=str(row.get('res_time') or '')
    guests=row.get('party_size') or ''
    table=str(row.get('table_no') or '').strip()
    if lang=='en':
        templates={
            'En attente':('Africana Meltingpot — reservation pending',f'Your reservation request for {date} at {time} for {guests} guest(s) is being reviewed. We will confirm it as soon as possible.'),
            'Confirmée':('Africana Meltingpot — reservation confirmed',f'Your reservation at Africana Meltingpot is confirmed for {date} at {time} for {guests} guest(s).'+(f' Table: {table}.' if table else '')),
            'Refusée':('Africana Meltingpot — reservation request declined',f'We are sorry, but we cannot accept your reservation request for {date} at {time} for {guests} guest(s). Please choose another date or time.'),
            'Annulée':('Africana Meltingpot — reservation cancelled',f'Your reservation for {date} at {time} for {guests} guest(s) has been cancelled. Please contact us if you need assistance.'),
        }
    else:
        templates={
            'En attente':('Africana Meltingpot — réservation en attente',f'Votre demande de réservation du {date} à {time} pour {guests} personne(s) est en cours de traitement. Nous vous confirmerons la réservation dès que possible.'),
            'Confirmée':('Africana Meltingpot — réservation confirmée',f'Votre réservation chez Africana Meltingpot est confirmée pour le {date} à {time} pour {guests} personne(s).'+(f' Table : {table}.' if table else '')),
            'Refusée':('Africana Meltingpot — réservation refusée',f'Nous sommes désolés, mais nous ne pouvons pas accepter votre demande de réservation du {date} à {time} pour {guests} personne(s). Merci de choisir une autre date ou un autre horaire.'),
            'Annulée':('Africana Meltingpot — réservation annulée',f'Votre réservation du {date} à {time} pour {guests} personne(s) a été annulée. N’hésitez pas à nous contacter si vous avez besoin d’aide.'),
        }
    return templates.get(status)

def _record_reservation_notification(con,reservation_id,channel,recipient,language,status,subject,message,delivery_status,error=''):
    con.execute('insert into reservation_notifications(reservation_id,channel,recipient,language,reservation_status,subject,message,delivery_status,error,created_at,sent_at) values(?,?,?,?,?,?,?,?,?,?,?)',
                (reservation_id,channel,recipient,language,status,subject,message,delivery_status,error,now(),now() if delivery_status=='Envoyé' else None))

def send_email_notification(recipient,subject,message):
    host=os.getenv('SMTP_HOST','').strip()
    user=os.getenv('SMTP_USER','').strip()
    password=os.getenv('SMTP_PASSWORD','')
    sender_email=(os.getenv('SMTP_FROM_EMAIL','').strip() or os.getenv('SMTP_FROM','').strip())
    sender_name=os.getenv('SMTP_FROM_NAME','').strip() or 'Africana Meltingpot'
    if not host or not user or not password or not sender_email:
        return False,'Configuration email requise'
    port=int(os.getenv('SMTP_PORT','587') or 587)
    use_ssl=os.getenv('SMTP_SSL','0').lower() in ('1','true','yes')
    use_tls=os.getenv('SMTP_TLS','1').lower() not in ('0','false','no')
    msg=EmailMessage()
    msg['From']=formataddr((sender_name,sender_email))
    msg['To']=recipient
    msg['Subject']=subject
    msg.set_content(message)
    try:
        if use_ssl:
            server=smtplib.SMTP_SSL(host,port,timeout=15)
        else:
            server=smtplib.SMTP(host,port,timeout=15)
            if use_tls: server.starttls()
        with server:
            server.login(user,password)
            server.send_message(msg,from_addr=sender_email,to_addrs=[recipient])
        return True,''
    except Exception as e:
        err=str(e)[:300]
        print(f'SMTP send failed: {err}', flush=True)
        return False,err

def send_sms_notification(recipient,message):
    sid=os.getenv('TWILIO_ACCOUNT_SID','').strip(); token=os.getenv('TWILIO_AUTH_TOKEN','').strip(); from_no=os.getenv('TWILIO_FROM_NUMBER','').strip()
    if not sid or not token or not from_no:
        return False,'Configuration SMS requise'
    try:
        import urllib.request
        data=urlencode({'To':recipient,'From':from_no,'Body':message}).encode()
        req=Request(f'https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json',data=data,method='POST')
        auth=base64.b64encode(f'{sid}:{token}'.encode()).decode();req.add_header('Authorization',f'Basic {auth}');req.add_header('Content-Type','application/x-www-form-urlencoded')
        with urlopen(req,timeout=15) as r:
            if 200 <= getattr(r,'status',200) < 300:return True,''
        return False,'Réponse SMS invalide'
    except Exception as e:
        return False,str(e)[:300]

def notify_reservation_status(con,row,status):
    template=reservation_status_message(status,row)
    if not template:return []
    subject,message=template;lang=normalize_language(row.get('language'));results=[]
    email=str(row.get('email') or '').strip();phone=str(row.get('phone') or '').strip()
    if email:
        ok,err=send_email_notification(email,subject,message);state='Envoyé' if ok else ('Configuration requise' if 'Configuration' in err else 'Échec')
        _record_reservation_notification(con,row['id'],'email',email,lang,status,subject,message,state,err);results.append({'channel':'email','status':state})
    if phone:
        ok,err=send_sms_notification(phone,message);state='Envoyé' if ok else ('Configuration requise' if 'Configuration' in err else 'Échec')
        _record_reservation_notification(con,row['id'],'sms',phone,lang,status,subject,message,state,err);results.append({'channel':'sms','status':state})
    return results


ROLES=['Owner','Restaurant Manager','Club Manager','Restaurant Staff','Club Staff']
OWNER_ONLY={'finance','users','settings','reports','activity','supplier-prices','scheduled-reports','content'}

MENU_SEED=[
('Finger Foods','Pastels (x4)','Stuffed fritters','Beignets fourrés — Bœuf/poulet/thon/végé. Sauce Africana.','6,50 €'),
('Finger Foods','Tenders (x4/x8)','Breaded chicken breast sticks','Bâtonnets de blanc de poulet panés. Sauce Africana.','6,50 € / 11 €'),
('Finger Foods','Samoussas (x4)','Stuffed fritters','Beignets fourrés — Bœuf/poulet/végé. Sauce Africana.','6,50 €'),
('Finger Foods','Nems revisités à l’Africana (x6)','Africana-style spring rolls','Beignets roulés frits fourrés — Bœuf/porc/poulet/végé. Sauce aigre douce.','6 €'),
('Finger Foods','Mozzarella sticks (x5)','Breaded mozzarella sticks','Bâtonnets de mozzarella panés.','6 €'),
('Finger Foods','Onion rings (x6)','Fried onion rings','Beignets frits fourrés à l’oignon.','5 €'),
('Finger Foods','Tempura de crevette (x4/x8)','Breaded prawns','Crevettes panées, sauce aigre douce.','4 € / 6 €'),
('Finger Foods','Wings (x4/x8)','Marinated chicken wings','Ailes de poulet marinées — natures/piquantes.','5 € / 9 €'),
('Finger Foods','Brochette de poulet (x1/x10)','Chicken skewers','Brochette de poulet.','3 € / 25 €'),
('À partager','Plateau mixte','Mixed sharing platter','Mix de pastels, samoussas, nems, onion rings et wings (15 pièces).','20 €'),
('À partager','Plateau veggie','Vegetarian sharing platter','Mix de pastels, mozza sticks, onion rings, samoussas et nems (15 pièces).','20 €'),
('À partager','Plateau à composer','Build your own platter','Composez votre plateau à partager avec 5 types de finger foods au choix.','20 €'),
('Grillades','Poisson frit','Whole fried sea bass','Bar entier frit, accompagnement et sauce au choix.','16,50 €'),
('Grillades','Poulet braisé','Half grilled chicken','1/2 poulet braisé, accompagnement et sauce au choix.','14,50 €'),
('Grillades','Brochette de bœuf (x1/x10)','Beef skewers','Brochette de bœuf.','3 € / 25 €'),
('Plats','Mafé (poulet/bœuf)','Peanut stew with rice','Bœuf mijoté ou poulet braisé à la sauce arachide et riz blanc.','15 €'),
('Plats','Thieb','Chicken with vegetables and Wolof rice','Poulet accompagné de légumes mijotés et riz wolof.','15 €'),
('Plats','Yassa','Chicken with caramelised onions','Poulet nappé d’oignons caramélisés à la sauce moutarde et riz blanc.','15 €'),
('Burgers','L’Africana','Africana burger','Pain burger à l’encre de seiche noire, steak épicé au poivre de Penja, fromage, salade, tomates, oignons, sauce légèrement pimentée + accompagnement et sauce.','14,50 €'),
('Burgers','Le Biggy','Double steak burger','Pain burger, double steak, fromage, salade, tomates, oignons caramélisés, sauce burger + accompagnement et sauce.','15 €'),
('Burgers','Le Végé','Vegetarian burger','Pain burger, galette de pommes de terre, fromage, salade, tomates, oignons, sauce verte + accompagnement et sauce.','13 €'),
('Accompagnements','Frites classiques','Classic fries','Frites classiques.','3 €'),
('Accompagnements','Frites patates douces','Sweet potato fries','Frites patates douces.','3,50 €'),
('Accompagnements','Allocos','Fried plantain','Bananes plantains frites.','4 €'),
('Accompagnements','Riz blanc','White rice','Riz blanc.','3,50 €'),
('Desserts','Tiramisu','Coffee and speculoos','Café, spéculoos.','4 €'),
('Desserts','Crêpe Africana','Africana crêpe','Crêpe maison, banane écrasée, beurre de cacahuète fondant, sucre glace.','5 €'),
('Desserts','Boule de glace (x1/x3)','Ice cream','Chocolat/vanille/fraise.','2 € / 5 €'),
('Mocktails','Manus’s Melon Madness','Melon, lemonade and mint','Jus de melon, limonade, sirop de menthe, menthe fraîche.','7 €'),
('Mocktails','Vic’s Vibrant Vortex','Berry lemonade','Limonade, jus de baies, sirop de framboise, baies fraîches.','7 €'),
('Mocktails','Myli’s Fruity Fusion','Mango and pineapple','Jus de mangue, jus d’ananas, sirop de coco, tranche d’ananas.','7 €'),
('Mocktails','Zack’s Blueberry Bliss','Blueberry and lime','Jus de myrtille, soda citron vert, sirop de vanille, menthe fraîche.','7 €'),
('Mocktails','Sophie Sparkling Sunrise','Orange and grapefruit','Jus d’orange, soda pamplemousse, sirop de grenadine, tranche d’orange.','7 €'),
('Cocktails','Mojito','Classic mojito','Rhum blanc, eau gazeuse, jus de citrons verts, sucre de canne, menthe fraîche.','7 €'),
('Cocktails','Moscow Mule','Vodka mule','Vodka, ginger beer, jus de citrons verts.','8 €'),
('Cocktails','Punch','Rum punch','Rhum blanc, jus d’orange, nectar passion, jus de citrons verts, sucre de canne, cannelle.','8 €'),
('Cocktails','Cuba Libre','Rum and cola','Rhum ambré, Coca-Cola, tranche de citron.','8 €'),
('Cocktails','Cosmopolitan','Cosmopolitan','Vodka, jus de cranberry, jus de citrons verts, cointreau.','8 €'),
('Cocktails','Gin Tonic','Gin tonic','Gin, Schweppes Tonic.','8 €'),
('Cocktails','Old Fashioned','Whisky classic','Whisky, eau gazeuse, sucre, angostura bitters.','8 €'),
('Cocktails','Spritz','Spritz','Cinzano, prosecco, eau gazeuse.','7 €'),
('Cocktails','Tequila Sunrise','Tequila sunrise','Tequila, jus d’orange, sirop de grenadine.','7 €'),
('Cocktails','Zanzibar Zest','Signature rum cocktail','Rhum épicé, jus de citron vert, sirop de gingembre, zeste de citron vert.','9 €'),
('Cocktails','Mojito Savane','Signature mojito','Rhum anejo blanco, fruit de la passion, mangue, eau gazeuse, menthe fraîche.','9 €'),
('Cocktails','African Mule','Rum mule','Rhum blanc, ginger beer, jus de citron vert.','8 €'),
('Cocktails','WakanDaiquiri','Coconut daiquiri','Rhum blanc, jus de citron vert, sirop de sucre de canne, sirop de coco.','8 €'),
('Cocktails','Kilimandjaro Colada','African colada','Rhum blanc, lait de coco, jus d’ananas.','9 €'),
('Cocktails','Africana Kiss','Signature spiced rum cocktail','Rhum épicé, maracuja, citron vert, cannelle, Angostura.','10 €'),
('Cocktails','L’Afrikafé','Rum coffee cocktail','Rhum brun, liqueur de café, espresso, sirop de sucre de canne.','10 €'),
('Cocktails','Flex on the Beach','Rum fruit cocktail','Rhum blanc, rhum ambré, cranberry, orange, ananas, pêche.','9 €'),
('Cocktails','L’Africana','Champagne and bissap','Champagne, jus de bissap, sirop de framboise.','10 €'),
('Rhums','Diplomatico Reserva Exclusiva (4cl)','Aged rum','Rhum vieux.','9 €'),
('Rhums','Ron Zacapa 23 ans (4cl)','Aged rum','Rhum vieux.','12 €'),
('Rhums','Mount Gay XO (4cl)','Aged rum','Rhum vieux.','10 €'),
('Rhums','Bumbu (4cl)','Spiced rum','Rhum épicé.','8 €'),
('Rhums','The Kraken Black Spiced (4cl)','Spiced rum','Rhum épicé.','7 €'),
('Rhums','Sailor Jerry (4cl)','Spiced rum','Rhum épicé.','6 €'),
('Bières','Guinness (33cl)','Bottled beer','Guinness 33cl.','6,50 €'),
('Bières','Leffe blonde (33cl)','Bottled beer','Leffe blonde 33cl.','5,50 €'),
('Bières','Desperados (33cl)','Bottled beer','Desperados 33cl.','5,50 €'),
('Bières','Heineken (50cl)','Bottled beer','Heineken 50cl.','6,50 €'),
('Softs','Jus de Bissap (25cl)','Bissap juice','Jus de Bissap 25cl.','5 €'),
('Softs','Jus de gingembre (25cl)','Ginger juice','Jus de gingembre 25cl.','5 €'),
('Softs','Evian (50cl)','Water','Evian 50cl.','4 €'),
('Softs','Perrier (33cl)','Sparkling water','Perrier 33cl.','4 €'),
('Softs','Coca (25cl)','Coca-Cola','Coca 25cl.','4 €'),
('Softs','Red Bull (33cl)','Energy drink','Red Bull 33cl.','4,50 €'),
]

def connect():
    if USE_POSTGRES:
        return PgConnCompat()
    c=sqlite3.connect(DB)
    c.row_factory=sqlite3.Row
    c.execute('PRAGMA foreign_keys=ON')
    return c

def hash_pw(p,salt=None):
    salt=salt or secrets.token_hex(16)
    dk=hashlib.pbkdf2_hmac('sha256',p.encode(),salt.encode(),180000)
    return salt+':'+dk.hex()

def verify_pw(p,stored):
    try:
        salt,h=stored.split(':',1)
        return hmac.compare_digest(hash_pw(p,salt).split(':',1)[1],h)
    except: return False

def now(): return datetime.datetime.now().isoformat(timespec='seconds')

def init_db():
    con=connect(); c=con.cursor()
    c.executescript('''
    CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT UNIQUE,password_hash TEXT,role TEXT,department TEXT,active INTEGER DEFAULT 1,permissions TEXT DEFAULT '{}',created_at TEXT);
    CREATE TABLE IF NOT EXISTS sessions_dummy(id INTEGER);
    CREATE TABLE IF NOT EXISTS menu_items(id INTEGER PRIMARY KEY AUTOINCREMENT,category TEXT,name_fr TEXT,name_en TEXT,description_fr TEXT,description_en TEXT,price TEXT,available INTEGER DEFAULT 1,featured INTEGER DEFAULT 0,updated_at TEXT,updated_by INTEGER);
    CREATE TABLE IF NOT EXISTS menu_categories(id INTEGER PRIMARY KEY AUTOINCREMENT,name_fr TEXT UNIQUE,name_en TEXT,sort_order INTEGER DEFAULT 0,active INTEGER DEFAULT 1,updated_at TEXT,updated_by INTEGER);
    CREATE TABLE IF NOT EXISTS reservations(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',res_date TEXT,res_time TEXT,party_size INTEGER,customer_name TEXT,phone TEXT,email TEXT,notes TEXT,status TEXT DEFAULT 'Nouvelle',table_no TEXT,deposit REAL DEFAULT 0,language TEXT DEFAULT 'fr',created_at TEXT,updated_at TEXT,updated_by INTEGER,handled_by_name TEXT,handled_at TEXT);
    CREATE TABLE IF NOT EXISTS reservation_status_history(id INTEGER PRIMARY KEY AUTOINCREMENT,reservation_id INTEGER,old_status TEXT,new_status TEXT,changed_by INTEGER,changed_by_name TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS reservation_notifications(id INTEGER PRIMARY KEY AUTOINCREMENT,reservation_id INTEGER,channel TEXT,recipient TEXT,language TEXT,reservation_status TEXT,subject TEXT,message TEXT,delivery_status TEXT,error TEXT,created_at TEXT,sent_at TEXT);
    CREATE TABLE IF NOT EXISTS availability(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',res_date TEXT,res_time TEXT,status TEXT DEFAULT 'Open',note TEXT,updated_at TEXT,updated_by INTEGER);
    CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',title TEXT,description TEXT,event_date TEXT,event_time TEXT,status TEXT DEFAULT 'Brouillon',published INTEGER DEFAULT 0,capacity INTEGER,created_at TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS inventory(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',department TEXT,item_name TEXT,category TEXT,quantity REAL DEFAULT 0,unit TEXT,low_threshold REAL DEFAULT 0,status TEXT DEFAULT 'Disponible',location TEXT,notes TEXT,last_update TEXT,updated_by INTEGER);
    CREATE TABLE IF NOT EXISTS finance_records(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,kind TEXT,category TEXT,amount REAL,payment_method TEXT,record_date TEXT,supplier_payee TEXT,receipt TEXT,notes TEXT,status TEXT DEFAULT 'Validé',entered_by INTEGER,created_at TEXT);
    CREATE TABLE IF NOT EXISTS suppliers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,category TEXT,phone TEXT,email TEXT,notes TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,title TEXT,description TEXT,assigned_to TEXT,due_date TEXT,status TEXT DEFAULT 'À faire',priority TEXT DEFAULT 'Normal',created_at TEXT);
    CREATE TABLE IF NOT EXISTS maintenance(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,item TEXT,issue TEXT,status TEXT DEFAULT 'À réparer',priority TEXT DEFAULT 'Normal',cost REAL DEFAULT 0,created_at TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS shifts(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,user_name TEXT,shift_date TEXT,start_time TEXT,end_time TEXT,status TEXT DEFAULT 'Planifié',notes TEXT);
    CREATE TABLE IF NOT EXISTS promotions(id INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT,title TEXT,discount_type TEXT,value REAL,start_date TEXT,end_date TEXT,status TEXT DEFAULT 'Actif',usage_count INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS loyalty(id INTEGER PRIMARY KEY AUTOINCREMENT,customer_name TEXT,phone TEXT,email TEXT,points INTEGER DEFAULT 0,rewards TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS activity_logs(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,user_name TEXT,action TEXT,module TEXT,detail TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS tables_plan(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,zone TEXT,table_name TEXT,seats INTEGER,status TEXT DEFAULT 'Disponible');
    CREATE TABLE IF NOT EXISTS purchases(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,supplier TEXT,item TEXT,quantity REAL,unit TEXT,amount REAL,status TEXT DEFAULT 'Demandé',requested_by TEXT,approved_by TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS wastage(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,item TEXT,quantity REAL,unit TEXT,reason TEXT,cost REAL,record_date TEXT,recorded_by TEXT);
    CREATE TABLE IF NOT EXISTS cashups(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,shift_date TEXT,cash_total REAL,card_total REAL,online_total REAL,refunds REAL,discounts REAL,complimentary REAL,discrepancy REAL,locked INTEGER DEFAULT 0,manager TEXT,notes TEXT);
    CREATE TABLE IF NOT EXISTS hygiene(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,task TEXT,area TEXT,due_date TEXT,status TEXT DEFAULT 'À faire',assigned_to TEXT,completed_at TEXT);
    CREATE TABLE IF NOT EXISTS incidents(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,incident_date TEXT,type TEXT,description TEXT,action_taken TEXT,status TEXT DEFAULT 'Ouvert',reported_by TEXT);
    CREATE TABLE IF NOT EXISTS feedback(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,customer_name TEXT,rating INTEGER,comment TEXT,complaint INTEGER DEFAULT 0,resolution TEXT,status TEXT DEFAULT 'Nouveau',created_at TEXT);
    CREATE TABLE IF NOT EXISTS guest_list(id INTEGER PRIMARY KEY AUTOINCREMENT,event_name TEXT,guest_name TEXT,party_size INTEGER,vip INTEGER DEFAULT 0,table_zone TEXT,status TEXT DEFAULT 'Attendu',notes TEXT);
    CREATE TABLE IF NOT EXISTS leave_requests(id INTEGER PRIMARY KEY AUTOINCREMENT,user_name TEXT,start_date TEXT,end_date TEXT,type TEXT,status TEXT DEFAULT 'En attente',notes TEXT);
    CREATE TABLE IF NOT EXISTS training(id INTEGER PRIMARY KEY AUTOINCREMENT,user_name TEXT,training_name TEXT,completed_date TEXT,expiry_date TEXT,status TEXT,document TEXT);
    CREATE TABLE IF NOT EXISTS gift_cards(id INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT UNIQUE,value REAL,balance REAL,status TEXT DEFAULT 'Actif',issued_to TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS waitlist(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,res_date TEXT,res_time TEXT,customer_name TEXT,phone TEXT,party_size INTEGER,status TEXT DEFAULT 'En attente',created_at TEXT);
    CREATE TABLE IF NOT EXISTS equipment(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,name TEXT,category TEXT,location TEXT,condition TEXT,service_date TEXT,next_service TEXT,notes TEXT);
    CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,category TEXT,access_level TEXT,file_name TEXT,notes TEXT,created_at TEXT);
    CREATE TABLE IF NOT EXISTS checklists(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,check_type TEXT,task TEXT,status TEXT DEFAULT 'À faire',assigned_to TEXT,check_date TEXT,completed_at TEXT);
    CREATE TABLE IF NOT EXISTS stock_movements(id INTEGER PRIMARY KEY AUTOINCREMENT,item_name TEXT,movement_type TEXT,quantity REAL,unit TEXT,reason TEXT,created_at TEXT,recorded_by TEXT);

    CREATE TABLE IF NOT EXISTS recipes(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',dish_name TEXT,ingredient TEXT,quantity REAL,unit TEXT,inventory_item TEXT,active INTEGER DEFAULT 1,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS allergens(id INTEGER PRIMARY KEY AUTOINCREMENT,menu_item TEXT,allergen TEXT,dietary_tag TEXT,notes TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT DEFAULT 'Restaurant',order_no TEXT,table_name TEXT,channel TEXT,status TEXT DEFAULT 'Nouveau',items_json TEXT,total REAL DEFAULT 0,kitchen_status TEXT DEFAULT 'À préparer',bar_status TEXT DEFAULT 'À préparer',created_at TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS lost_found(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,item TEXT,description TEXT,found_date TEXT,location TEXT,status TEXT DEFAULT 'Conservé',claimed_by TEXT,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS supplier_prices(id INTEGER PRIMARY KEY AUTOINCREMENT,supplier TEXT,item TEXT,unit TEXT,unit_price REAL,minimum_order REAL,lead_time_days INTEGER,last_checked TEXT,notes TEXT);
    CREATE TABLE IF NOT EXISTS scheduled_reports(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,frequency TEXT,recipient TEXT,report_type TEXT,business TEXT DEFAULT 'Combined',enabled INTEGER DEFAULT 1,last_sent TEXT,next_send TEXT);
    CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY AUTOINCREMENT,business TEXT,title TEXT,message TEXT,severity TEXT DEFAULT 'Info',audience TEXT DEFAULT 'Staff',read_flag INTEGER DEFAULT 0,created_at TEXT);
    CREATE TABLE IF NOT EXISTS content_blocks(id INTEGER PRIMARY KEY AUTOINCREMENT,area TEXT,key TEXT UNIQUE,value_fr TEXT,value_en TEXT,media_path TEXT,enabled INTEGER DEFAULT 1,updated_at TEXT);
    CREATE TABLE IF NOT EXISTS club_entry_rules(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,rule_text TEXT,min_age INTEGER DEFAULT 18,enabled INTEGER DEFAULT 1,updated_at TEXT);
    ''')
    # Reservation schema migration for existing databases.
    reservation_cols={r['name'] for r in c.execute('pragma table_info(reservations)')}
    if 'language' not in reservation_cols: c.execute("ALTER TABLE reservations ADD COLUMN language TEXT DEFAULT 'fr'")
    if 'handled_by_name' not in reservation_cols: c.execute("ALTER TABLE reservations ADD COLUMN handled_by_name TEXT")
    if 'handled_at' not in reservation_cols: c.execute("ALTER TABLE reservations ADD COLUMN handled_at TEXT")

    # Menu schema migrations for existing databases.
    menu_cols={r['name'] for r in c.execute('pragma table_info(menu_items)')}
    for col,decl in [('category_id','INTEGER'),('sort_order','INTEGER DEFAULT 0'),('image_path','TEXT')]:
        if col not in menu_cols: c.execute(f'ALTER TABLE menu_items ADD COLUMN {col} {decl}')
    if not c.execute('select 1 from menu_categories limit 1').fetchone():
        preferred=['Plats','Burgers','Accompagnements','Finger Foods','À partager','Grillades','Desserts','Cocktails','Mocktails','Softs','Bières','Rhums']
        en={'Plats':'Main dishes','Burgers':'Burgers','Accompagnements':'Sides','Finger Foods':'Finger foods','À partager':'Sharing platters','Grillades':'Grilled dishes','Desserts':'Desserts','Cocktails':'Cocktails','Mocktails':'Mocktails','Softs':'Soft drinks','Bières':'Beers','Rhums':'Rums'}
        existing=[firstval(r) for r in c.execute("select distinct category from menu_items where category is not null and trim(category)<>''")]
        ordered=preferred+[x for x in existing if x not in preferred]
        for i,cat in enumerate(ordered,1):
            c.execute('insert or ignore into menu_categories(name_fr,name_en,sort_order,active,updated_at) values(?,?,?,?,?)',(cat,en.get(cat,cat),i,1,now()))
    for cat in c.execute('select id,name_fr from menu_categories').fetchall():
        c.execute('update menu_items set category_id=? where (category_id is null or category_id=0) and category=?',(cat['id'],cat['name_fr']))
    for cat in c.execute('select id from menu_categories').fetchall():
        rows=c.execute('select id from menu_items where category_id=? order by id',(cat['id'],)).fetchall()
        for i,r in enumerate(rows,1): c.execute('update menu_items set sort_order=coalesce(nullif(sort_order,0),?) where id=?',(i,r['id']))
    if not c.execute('select 1 from users limit 1').fetchone():
        c.execute('insert into users(name,email,password_hash,role,department,created_at) values(?,?,?,?,?,?)',('Owner','owner@africana.local',hash_pw('Africana2026!'),'Owner','All',now()))
        for name,email,role,dep in [('Restaurant Manager','restaurant.manager@africana.local','Restaurant Manager','Restaurant'),('Club Manager','club.manager@africana.local','Club Manager','Club'),('Restaurant Staff','restaurant.staff@africana.local','Restaurant Staff','Restaurant'),('Club Staff','club.staff@africana.local','Club Staff','Club')]:
            c.execute('insert into users(name,email,password_hash,role,department,created_at) values(?,?,?,?,?,?)',(name,email,hash_pw('Africana2026!'),role,dep,now()))
    if not c.execute('select 1 from menu_items limit 1').fetchone():
        for cat,name_fr,name_en,desc_fr,price in MENU_SEED:
            c.execute('insert into menu_items(category,name_fr,name_en,description_fr,description_en,price,available,updated_at) values(?,?,?,?,?,?,1,?)',(cat,name_fr,name_en,desc_fr,'',price,now()))
    # Ensure every menu category exists, including on a brand-new database after menu seeding.
    preferred=['Plats','Burgers','Accompagnements','Finger Foods','À partager','Grillades','Desserts','Cocktails','Mocktails','Softs','Bières','Rhums']
    en={'Plats':'Main dishes','Burgers':'Burgers','Accompagnements':'Sides','Finger Foods':'Finger foods','À partager':'Sharing platters','Grillades':'Grilled dishes','Desserts':'Desserts','Cocktails':'Cocktails','Mocktails':'Mocktails','Softs':'Soft drinks','Bières':'Beers','Rhums':'Rums'}
    existing=[firstval(r) for r in c.execute("select distinct category from menu_items where category is not null and trim(category)<>''")]
    ordered=preferred+[x for x in existing if x not in preferred]
    for i,cat in enumerate(ordered,1):
        c.execute('insert or ignore into menu_categories(name_fr,name_en,sort_order,active,updated_at) values(?,?,?,?,?)',(cat,en.get(cat,cat),i,1,now()))
    for cat in c.execute('select id,name_fr from menu_categories').fetchall():
        c.execute('update menu_items set category_id=? where (category_id is null or category_id=0) and category=?',(cat['id'],cat['name_fr']))
    for cat in c.execute('select id from menu_categories').fetchall():
        rows=c.execute('select id from menu_items where category_id=? order by id',(cat['id'],)).fetchall()
        for i,r in enumerate(rows,1):
            if not firstval(c.execute('select sort_order from menu_items where id=?',(r['id'],)).fetchone()): c.execute('update menu_items set sort_order=? where id=?',(i,r['id']))
    # Repair invalid or duplicate category order numbers created by older builds.
    # Keep valid unique positive numbers in place and move only duplicates/invalid rows
    # into the first free positive positions. Future new categories also fill the first gap.
    used=set()
    repair=[]
    for r in c.execute('select id,sort_order from menu_categories order by id').fetchall():
        try: order=int(r['sort_order'] or 0)
        except (TypeError,ValueError): order=0
        if order>0 and order not in used:
            used.add(order)
        else:
            repair.append(r['id'])
    for rid in repair:
        order=1
        while order in used: order+=1
        c.execute('update menu_categories set sort_order=? where id=?',(order,rid))
        used.add(order)
    repair_menu_item_orders(c)
    if not c.execute('select 1 from events limit 1').fetchone():
        c.execute('insert into events(business,title,description,event_date,event_time,status,published,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)',('Restaurant','Soirée Afro Live','Musique, cuisine et ambiance Africana.','2026-10-17','20:30','Publié',1,now(),now()))
        c.execute('insert into events(business,title,description,event_date,event_time,status,published,created_at,updated_at) values(?,?,?,?,?,?,?,?,?)',('Restaurant','Brunch Culture & Saveurs','Une rencontre autour des saveurs et de la culture.','2026-10-25','13:00','Publié',1,now(),now()))
    defaults={'club_enabled':'0','restaurant_name':'Africana Meltingpot','announcement':'','default_language':'fr'}
    for k,v in defaults.items(): c.execute('insert or ignore into settings(key,value,updated_at) values(?,?,?)',(k,v,now()))
    con.commit(); con.close()

MODULES={
'inventory':'inventory','events':'events','finance':'finance_records','users':'users','suppliers':'suppliers','tasks':'tasks','maintenance':'maintenance','shifts':'shifts','promotions':'promotions','loyalty':'loyalty','activity':'activity_logs','tables':'tables_plan','purchases':'purchases','wastage':'wastage','cashups':'cashups','hygiene':'hygiene','incidents':'incidents','feedback':'feedback','guest-list':'guest_list','leave':'leave_requests','training':'training','gift-cards':'gift_cards','waitlist':'waitlist','equipment':'equipment','documents':'documents','checklists':'checklists','stock-movements':'stock_movements','recipes':'recipes','allergens':'allergens','orders':'orders','lost-found':'lost_found','supplier-prices':'supplier_prices','scheduled-reports':'scheduled_reports','notifications':'notifications','content':'content_blocks','club-rules':'club_entry_rules'}

PUBLIC_GET={'menu','menu-categories','events','settings'}

def rowdict(r): return dict(r) if r else None

def log(con,user,action,module,detail=''):
    if user: con.execute('insert into activity_logs(user_id,user_name,action,module,detail,created_at) values(?,?,?,?,?,?)',(user['id'],user['name'],action,module,detail,now()))

def user_from(handler):
    token=handler.headers.get('X-Session')
    if not token:
        cookie=handler.headers.get('Cookie','')
        for p in cookie.split(';'):
            if p.strip().startswith('africana_session='): token=p.strip().split('=',1)[1]
    uid=SESSIONS.get(token)
    if not uid: return None
    con=connect(); r=con.execute('select id,name,email,role,department,active,permissions from users where id=?',(uid,)).fetchone(); con.close()
    return rowdict(r)

def can(user,module,write=False):
    if not user or not user.get('active'): return False
    if user['role']=='Owner': return True
    if module in OWNER_ONLY: return False
    if module in ('club','guest-list') and user['department']!='Club': return False
    if module in ('restaurant','reservations','menu','inventory') and user['department']=='Club': return False
    return True

class H(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw): super().__init__(*a,directory=BASE,**kw)
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
    def json(self,obj,status=200,cookie=None):
        data=json.dumps(obj,ensure_ascii=False).encode()
        self.send_response(status); self.send_header('Content-Type','application/json; charset=utf-8'); self.send_header('Content-Length',str(len(data)))
        if cookie:self.send_header('Set-Cookie',cookie)
        self.end_headers(); self.wfile.write(data)
    def body(self):
        n=int(self.headers.get('Content-Length','0') or 0)
        if not n:return {}
        try:return json.loads(self.rfile.read(n))
        except:return {}
    def do_GET(self):
        u=urlparse(self.path)
        if not u.path.startswith('/api/'): return super().do_GET()
        try:self.api_get(u)
        except Exception as e:
            traceback.print_exc(); self.json({'error':str(e)},500)
    def do_POST(self):
        u=urlparse(self.path)
        if not u.path.startswith('/api/'): return self.json({'error':'not found'},404)
        try:self.api_post(u,self.body())
        except Exception as e: traceback.print_exc(); self.json({'error':str(e)},500)
    def do_PATCH(self):
        u=urlparse(self.path)
        try:self.api_patch(u,self.body())
        except Exception as e: traceback.print_exc(); self.json({'error':str(e)},500)
    def do_DELETE(self):
        u=urlparse(self.path)
        try:self.api_delete(u)
        except Exception as e: traceback.print_exc(); self.json({'error':str(e)},500)
    def api_get(self,u):
        parts=[p for p in u.path.split('/') if p][1:]; name=parts[0] if parts else ''
        qs=parse_qs(u.query)
        if name=='menu':
            user=user_from(self); con=connect()
            include_hidden = bool(user) and qs.get('all')==['1']
            sql='''select m.*, c.name_fr as category_fr, c.name_en as category_en, c.sort_order as category_order, c.active as category_active
                   from menu_items m left join menu_categories c on c.id=m.category_id'''
            if not include_hidden: sql += ' where coalesce(m.available,1)=1 and coalesce(c.active,1)=1'
            sql += ' order by coalesce(c.sort_order,9999), coalesce(m.sort_order,9999), m.id'
            rows=[rowdict(r) for r in con.execute(sql)]; con.close(); return self.json(rows)
        if name=='menu-categories':
            user=user_from(self); con=connect(); include_hidden = bool(user) and qs.get('all')==['1']; sql='select * from menu_categories'
            if not include_hidden: sql += ' where active=1'
            sql += ' order by sort_order,id'; rows=[rowdict(r) for r in con.execute(sql)]; con.close(); return self.json(rows)
        if name=='events':
            con=connect(); sql='select * from events'; args=[]
            if qs.get('published')==['1']:sql+=' where published=1'
            sql+=' order by event_date'; rows=[rowdict(r) for r in con.execute(sql,args)]; con.close(); return self.json(rows)
        if name=='settings':
            con=connect(); d={r['key']:r['value'] for r in con.execute('select * from settings')};con.close(); d['club_enabled']=d.get('club_enabled')=='1';return self.json(d)
        if name=='me': return self.json(user_from(self) or {},200 if user_from(self) else 401)
        user=user_from(self)
        if name=='reservations':
            if not can(user,'reservations'):return self.json({'error':'forbidden'},403)
            con=connect(); rows=[rowdict(r) for r in con.execute('select * from reservations order by res_date,res_time')];con.close();return self.json(rows)
        if name=='availability':
            if not can(user,'reservations'):return self.json({'error':'forbidden'},403)
            con=connect();rows=[rowdict(r) for r in con.execute('select * from availability order by res_date,res_time')];con.close();return self.json(rows)
        if name=='dashboard':
            if not user:return self.json({'error':'unauthorized'},401)
            con=connect();
            d={'reservations_today':firstval(con.execute("select count(*) from reservations where res_date=date('now','localtime')").fetchone()),
               'pending':firstval(con.execute("select count(*) from reservations where status in ('Nouvelle','En attente')").fetchone()),
               'stock_low':firstval(con.execute("select count(*) from inventory where status in ('Stock faible','Rupture','Needed','Nécessaire') or quantity<=low_threshold").fetchone()),
               'events':firstval(con.execute("select count(*) from events where status not in ('Terminé','Annulé')").fetchone())}
            if user['role']=='Owner':
                d['income_month']=firstval(con.execute("select coalesce(sum(amount),0) from finance_records where kind='Revenu' and substr(record_date,1,7)=substr(date('now'),1,7)").fetchone())
                d['expense_month']=firstval(con.execute("select coalesce(sum(amount),0) from finance_records where kind='Dépense' and substr(record_date,1,7)=substr(date('now'),1,7)").fetchone())
            con.close();return self.json(d)
        if name in MODULES:
            if not can(user,name):return self.json({'error':'forbidden'},403)
            tbl=MODULES[name]; con=connect(); rows=[rowdict(r) for r in con.execute(f'select * from {tbl} order by id desc limit 500')];con.close();return self.json(rows)
        return self.json({'error':'not found'},404)
    def api_post(self,u,b):
        parts=[p for p in u.path.split('/') if p][1:]; name=parts[0] if parts else ''
        if name=='login':
            con=connect();r=con.execute('select * from users where email=? and active=1',(b.get('email',''),)).fetchone()
            if not r or not verify_pw(b.get('password',''),r['password_hash']):con.close();return self.json({'error':'Identifiants incorrects'},401)
            token=secrets.token_urlsafe(32);SESSIONS[token]=r['id'];log(con,rowdict(r),'Connexion','auth');con.commit();con.close();return self.json({'ok':True,'user':{'id':r['id'],'name':r['name'],'role':r['role'],'department':r['department']}},cookie=f'africana_session={token}; Path=/; HttpOnly; SameSite=Lax')
        if name=='logout':
            cookie=self.headers.get('Cookie','')
            for p in cookie.split(';'):
                if p.strip().startswith('africana_session='): SESSIONS.pop(p.strip().split('=',1)[1],None)
            return self.json({'ok':True},cookie='africana_session=; Path=/; Max-Age=0')
        if name=='reservations':
            lang=normalize_language(b.get('language'))
            res_time=str(b.get('res_time') or '').strip()
            phone=str(b.get('phone') or '').strip(); email=str(b.get('email') or '').strip()
            if not valid_time24(res_time):
                return self.json({'message':'Please enter the time in 24-hour format (HH:MM).' if lang=='en' else "Merci de saisir l'heure au format 24 h (HH:MM)."},400)
            if not phone and not email:
                return self.json({'message':'Please provide at least a phone number or an email address.' if lang=='en' else 'Merci de renseigner au moins un numéro de téléphone ou une adresse email.'},400)
            try: party_size=int(b.get('party_size') or 0)
            except (TypeError,ValueError): party_size=0
            if party_size<1:
                return self.json({'message':'Please enter the number of guests.' if lang=='en' else 'Merci de renseigner le nombre de personnes.'},400)
            con=connect(); full=con.execute("select 1 from availability where business=? and res_date=? and res_time=? and status='Full' limit 1",(b.get('business','Restaurant'),b.get('res_date'),res_time)).fetchone()
            if full:
                con.close();
                return self.json({'message':'This time slot is fully booked. Please choose another time or try again later.' if lang=='en' else 'Nous sommes actuellement complets pour ce créneau. Merci de choisir un autre horaire ou de réessayer plus tard.'},409)
            params=(b.get('business','Restaurant'),b.get('res_date'),res_time,party_size,b.get('customer_name'),phone,email,b.get('notes'),'Nouvelle',lang,now(),now())
            if USE_POSTGRES:
                rid=firstval(con.execute('insert into reservations(business,res_date,res_time,party_size,customer_name,phone,email,notes,status,language,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?) returning id',params).fetchone())
            else:
                con.execute('insert into reservations(business,res_date,res_time,party_size,customer_name,phone,email,notes,status,language,created_at,updated_at) values(?,?,?,?,?,?,?,?,?,?,?,?)',params);rid=firstval(con.execute('select last_insert_rowid()').fetchone())
            row=rowdict(con.execute('select * from reservations where id=?',(rid,)).fetchone())
            notification_results=notify_reservation_ack(con,row)
            con.commit();con.close();return self.json({'ok':True,'id':rid,'notifications':notification_results,'message':'Your reservation request has been received. Our team will review it and you will receive a confirmation shortly.' if lang=='en' else 'Votre demande de réservation a bien été reçue. Notre équipe va la traiter et vous recevrez une confirmation prochainement.'},201)
        user=user_from(self)
        if name=='availability':
            if not can(user,'reservations',True):return self.json({'error':'forbidden'},403)
            con=connect();con.execute('insert into availability(business,res_date,res_time,status,note,updated_at,updated_by) values(?,?,?,?,?,?,?)',(b.get('business','Restaurant'),b.get('res_date'),b.get('res_time'),b.get('status','Open'),b.get('note',''),now(),user['id']));log(con,user,'Création','availability',f"{b.get('res_date')} {b.get('res_time')} {b.get('status')}");con.commit();con.close();return self.json({'ok':True},201)
        if name=='menu-categories':
            if not can(user,'menu',True):return self.json({'error':'forbidden'},403)
            con=connect();
            try:
                # Category ordering is automatic. Ignore any client-supplied order number
                # and assign the first free positive position (fills gaps such as 5).
                requested=next_free_order(con,'menu_categories','sort_order>0')
                con.execute('insert into menu_categories(name_fr,name_en,sort_order,active,updated_at,updated_by) values(?,?,?,?,?,?)',(b.get('name_fr','').strip(),b.get('name_en','').strip(),requested,int(bool(b.get('active',True))),now(),user['id']))
                log(con,user,'Ajout','menu-categories',b.get('name_fr',''));con.commit();return self.json({'ok':True,'sort_order':requested},201)
            except DB_INTEGRITY_ERRORS:return self.json({'error':'Cette catégorie existe déjà.'},409)
            finally:con.close()
        if name=='menu-category-move':
            if not can(user,'menu',True):return self.json({'error':'forbidden'},403)
            con=connect()
            try:
                cid=int(b.get('id') or 0); direction=str(b.get('direction') or '').lower()
                if direction not in ('up','down'):return self.json({'error':'direction invalide'},400)
                rows=con.execute('select id,sort_order from menu_categories order by sort_order,id').fetchall()
                idx=next((i for i,r in enumerate(rows) if int(r['id'])==cid),None)
                if idx is None:return self.json({'error':'catégorie introuvable'},404)
                other_idx=idx-1 if direction=='up' else idx+1
                if other_idx<0 or other_idx>=len(rows):return self.json({'ok':True,'moved':False})
                cur,other=rows[idx],rows[other_idx]
                con.execute('update menu_categories set sort_order=?,updated_at=?,updated_by=? where id=?',(other['sort_order'],now(),user['id'],cur['id']))
                con.execute('update menu_categories set sort_order=?,updated_at=?,updated_by=? where id=?',(cur['sort_order'],now(),user['id'],other['id']))
                log(con,user,'Réorganisation','menu-categories',f"id {cid} {direction}");con.commit();return self.json({'ok':True,'moved':True})
            finally:con.close()
        if name=='menu-item-move':
            if not can(user,'menu',True):return self.json({'error':'forbidden'},403)
            con=connect()
            try:
                item_id=int(b.get('id') or 0); direction=str(b.get('direction') or '').lower()
                if direction not in ('up','down'):return self.json({'error':'direction invalide'},400)
                item=con.execute('select id,category_id from menu_items where id=?',(item_id,)).fetchone()
                if not item:return self.json({'error':'article introuvable'},404)
                repair_menu_item_orders(con)
                rows=con.execute('select id,sort_order from menu_items where category_id=? order by sort_order,id',(item['category_id'],)).fetchall()
                idx=next((i for i,r in enumerate(rows) if int(r['id'])==item_id),None)
                if idx is None:return self.json({'error':'article introuvable'},404)
                other_idx=idx-1 if direction=='up' else idx+1
                if other_idx<0 or other_idx>=len(rows):return self.json({'ok':True,'moved':False})
                cur,other=rows[idx],rows[other_idx]
                con.execute('update menu_items set sort_order=?,updated_at=?,updated_by=? where id=?',(other['sort_order'],now(),user['id'],cur['id']))
                con.execute('update menu_items set sort_order=?,updated_at=?,updated_by=? where id=?',(cur['sort_order'],now(),user['id'],other['id']))
                log(con,user,'Réorganisation','menu',f"id {item_id} {direction}");con.commit();return self.json({'ok':True,'moved':True})
            finally:con.close()
        if name=='menu-upload':
            if not can(user,'menu',True):return self.json({'error':'forbidden'},403)
            raw=b.get('data',''); filename=b.get('filename','image.jpg')
            if not raw.startswith('data:image/') or ',' not in raw:return self.json({'error':'Image invalide'},400)
            encoded=raw.split(',',1)[1]
            try:data=base64.b64decode(encoded,validate=True)
            except:return self.json({'error':'Image invalide'},400)
            if len(data)>6*1024*1024:return self.json({'error':'Image trop volumineuse (6 Mo max)'},400)
            ext=os.path.splitext(filename)[1].lower()
            if ext not in ('.jpg','.jpeg','.png','.webp'):return self.json({'error':'Format image non accepté'},400)
            # Store the image itself in the database as a data URL. This avoids Render's
            # ephemeral filesystem, so uploaded menu photos survive restarts/redeploys.
            return self.json({'ok':True,'path':raw},201)
        if name=='menu':
            if not can(user,'menu',True):return self.json({'error':'forbidden'},403)
            con=connect(); category_id=b.get('category_id')
            cat=con.execute('select name_fr from menu_categories where id=?',(category_id,)).fetchone() if category_id else None
            cols=['category_id','category','name_fr','name_en','description_fr','description_en','price','available','featured','sort_order','image_path']
            order=next_free_order(con,'menu_items','category_id=?',(category_id,)) if category_id else 1
            vals=[category_id,cat['name_fr'] if cat else b.get('category',''),b.get('name_fr'),b.get('name_en'),b.get('description_fr'),b.get('description_en'),normalize_price(b.get('price')),int(bool(b.get('available',True))),int(bool(b.get('featured',False))),order,b.get('image_path','')]
            con.execute('insert into menu_items('+','.join(cols)+',updated_at,updated_by) values('+','.join(['?']*(len(cols)+2))+')',vals+[now(),user['id']]);log(con,user,'Ajout','menu',b.get('name_fr',''));con.commit();con.close();return self.json({'ok':True},201)
        if name=='settings':
            if not user or user['role']!='Owner':return self.json({'error':'forbidden'},403)
            con=connect();
            for k,v in b.items():con.execute('insert into settings(key,value,updated_at) values(?,?,?) on conflict(key) do update set value=excluded.value,updated_at=excluded.updated_at',(k,'1' if v is True else '0' if v is False else str(v),now()))
            log(con,user,'Modification','settings',json.dumps(b,ensure_ascii=False));con.commit();con.close();return self.json({'ok':True})
        if name in MODULES:
            if not can(user,name,True):return self.json({'error':'forbidden'},403)
            tbl=MODULES[name]; con=connect(); cols=[r['name'] for r in con.execute(f'pragma table_info({tbl})') if r['name']!='id']; data={k:v for k,v in b.items() if k in cols}
            # defaults for audit-ish fields
            for k in ('created_at','updated_at','last_update'):
                if k in cols and k not in data:data[k]=now()
            if tbl=='users':
                if user['role']!='Owner':con.close();return self.json({'error':'forbidden'},403)
                if 'password' in b:data['password_hash']=hash_pw(b['password']);
                data.pop('password',None)
            if not data:con.close();return self.json({'error':'no fields'},400)
            keys=list(data);con.execute(f"insert into {tbl}({','.join(keys)}) values({','.join(['?']*len(keys))})",[data[k] for k in keys]);log(con,user,'Ajout',name,str(data)[:300]);con.commit();con.close();return self.json({'ok':True},201)
        return self.json({'error':'not found'},404)
    def api_patch(self,u,b):
        parts=[p for p in u.path.split('/') if p][1:];
        if len(parts)<2:return self.json({'error':'id required'},400)
        name,idv=parts[0],parts[1];user=user_from(self)
        if name=='reservations':tbl='reservations';module='reservations'
        elif name=='availability':tbl='availability';module='reservations'
        elif name=='menu-categories':tbl='menu_categories';module='menu'
        elif name=='menu':tbl='menu_items';module='menu'
        elif name in MODULES:tbl=MODULES[name];module=name
        else:return self.json({'error':'not found'},404)
        if not can(user,module,True):return self.json({'error':'forbidden'},403)
        if tbl=='users' and user['role']!='Owner':return self.json({'error':'forbidden'},403)
        con=connect();cols=[r['name'] for r in con.execute(f'pragma table_info({tbl})') if r['name']!='id'];data={k:v for k,v in b.items() if k in cols}
        old_category=None
        reservation_old=None
        if tbl=='reservations':
            reservation_old=rowdict(con.execute('select * from reservations where id=?',(idv,)).fetchone())
            if not reservation_old:
                con.close();return self.json({'error':'Réservation introuvable'},404)
            if 'res_time' in data and not valid_time24(data['res_time']):
                con.close();return self.json({'error':"L'heure doit être au format 24 h HH:MM."},400)
            if 'party_size' in data:
                try:data['party_size']=int(data['party_size'])
                except (TypeError,ValueError):data['party_size']=0
                if data['party_size']<1:con.close();return self.json({'error':'Le nombre de personnes doit être supérieur à 0.'},400)
            # The customer's booking language is immutable: staff cannot override it.
            data.pop('language',None)
            if 'status' in data and str(reservation_old.get('status'))!='Nouvelle' and str(data.get('status'))=='Nouvelle':
                con.close();return self.json({'error':'Une réservation traitée ne peut pas revenir au statut Nouvelle.'},409)
            if 'updated_by' in cols:data['updated_by']=user['id']
            if 'handled_by_name' in cols:data['handled_by_name']=user.get('name','')
            if 'handled_at' in cols:data['handled_at']=now()
        if tbl=='menu_categories':
            data.pop('sort_order',None)
            old=con.execute('select name_fr from menu_categories where id=?',(idv,)).fetchone(); old_category=old['name_fr'] if old else None
        if tbl=='menu_items':
            current_item=con.execute('select category_id,sort_order from menu_items where id=?',(idv,)).fetchone()
            if 'category_id' in data:
                cat=con.execute('select name_fr from menu_categories where id=?',(data['category_id'],)).fetchone(); data['category']=cat['name_fr'] if cat else data.get('category','')
                if current_item and str(current_item['category_id'])!=str(data['category_id']):
                    data['sort_order']=next_free_order(con,'menu_items','category_id=?',(data['category_id'],))
                else:
                    data.pop('sort_order',None)
            else:
                data.pop('sort_order',None)
            if 'available' in data:data['available']=int(bool(data['available']))
            if 'featured' in data:data['featured']=int(bool(data['featured']))
            if 'price' in data:data['price']=normalize_price(data['price'])
        if tbl=='menu_categories' and 'active' in data:data['active']=int(bool(data['active']))
        if 'password' in b and tbl=='users':data['password_hash']=hash_pw(b['password'])
        if 'updated_at' in cols:data['updated_at']=now()
        if 'last_update' in cols:data['last_update']=now()
        if not data:con.close();return self.json({'error':'no fields'},400)
        con.execute(f"update {tbl} set "+','.join([f'{k}=?' for k in data])+" where id=?",[data[k] for k in data]+[idv])
        if tbl=='menu_categories' and old_category and 'name_fr' in data:
            con.execute('update menu_items set category=? where category_id=?',(data['name_fr'],idv))
        notification_results=[]
        if tbl=='reservations' and reservation_old and 'status' in data and str(data['status'])!=str(reservation_old.get('status')):
            con.execute('insert into reservation_status_history(reservation_id,old_status,new_status,changed_by,changed_by_name,created_at) values(?,?,?,?,?,?)',(idv,reservation_old.get('status'),data['status'],user['id'],user.get('name',''),now()))
            updated=rowdict(con.execute('select * from reservations where id=?',(idv,)).fetchone())
            notification_results=notify_reservation_status(con,updated,data['status'])
        log(con,user,'Modification',module,f'id {idv}: {str(data)[:300]}');con.commit();con.close();return self.json({'ok':True,'notifications':notification_results})
    def api_delete(self,u):
        parts=[p for p in u.path.split('/') if p][1:];
        if len(parts)<2:return self.json({'error':'id required'},400)
        name,idv=parts[0],parts[1];user=user_from(self)
        if name=='menu-categories':tbl='menu_categories';module='menu'
        elif name=='menu':tbl='menu_items';module='menu'
        elif name=='reservations':tbl='reservations';module='reservations'
        elif name in MODULES:tbl=MODULES[name];module=name
        else:return self.json({'error':'not found'},404)
        if not can(user,module,True):return self.json({'error':'forbidden'},403)
        if tbl=='users' and user['role']!='Owner':return self.json({'error':'forbidden'},403)
        con=connect()
        if tbl=='menu_categories' and con.execute('select 1 from menu_items where category_id=? limit 1',(idv,)).fetchone():
            con.close();return self.json({'error':'Déplacez ou supprimez les articles de cette catégorie avant de la supprimer.'},409)
        item_category=None
        if tbl=='menu_items':
            r=con.execute('select category_id from menu_items where id=?',(idv,)).fetchone(); item_category=r['category_id'] if r else None
        con.execute(f'delete from {tbl} where id=?',(idv,))
        if tbl=='menu_items' and item_category is not None:
            rows=con.execute('select id from menu_items where category_id=? order by sort_order,id',(item_category,)).fetchall()
            for pos,r in enumerate(rows,1):con.execute('update menu_items set sort_order=? where id=?',(pos,r['id']))
        log(con,user,'Suppression',module,f'id {idv}');con.commit();con.close();return self.json({'ok':True})

if __name__=='__main__':
    init_db()
    port=int(os.getenv('PORT','8000'))
    print(f'Africana Meltingpot running on port {port}')
    ThreadingHTTPServer(('0.0.0.0',port),H).serve_forever()
