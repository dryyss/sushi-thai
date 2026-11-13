'use strict';
/* Sushi Thaï · maquette v2. Données de la carte dans data.js (MENU, WOK). Tout est simulé, rien n’est envoyé. */

/* ---------- utilitaires ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const NB = ' ';
const E = c => (c / 100).toFixed(2).replace('.', ',') + NB + '€';
const E0 = c => (c / 100).toLocaleString('fr-FR') + NB + '€';
const cents = p => Math.round((p || 0) * 100);
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

/* ---------- carte ---------- */
const ITEMS = {};
MENU.forEach(c => (c.items || []).forEach((it, i) => { it.id = c.id + '-' + i; it.base = cents(it.p); ITEMS[it.id] = it; }));
WOK.id = 'wok'; WOK.base = 1000; WOK.ic = 'noodle'; ITEMS.wok = WOK;
const COMBOS = ['Formule Pattaya', 'Menu enfant'];
const CRousty = Object.values(ITEMS).find(i => i.n === 'Thaï crousty');

/* ---------- formules et fonctionnalités (mêmes clés que src/config/features.ts) ---------- */
const PLANS = { essentiel: { l: 'Essentiel', p: 149000 }, pro: { l: 'Pro', p: 229000 }, premium: { l: 'Premium', p: 359000 } };
const RANK = { essentiel: 0, pro: 1, premium: 2 };
const FEAT = {
  delivery: { l: 'Livraison : villes, frais, fiche livreur', from: 'pro' },
  incentives: { l: 'Messages d’incitation dans le panier', from: 'pro' },
  lunchDiscount: { l: 'Remise du midi automatique', from: 'pro' },
  wokBuilder: { l: 'Compose ton wok en 5 étapes', from: 'pro' },
  combos: { l: 'Formules composables (Pattaya, Enfant)', from: 'pro' },
  reservations: { l: 'Réservation de table', from: 'pro' },
  availability: { l: 'Mise en épuisé rapide d’un plat', from: 'pro' },
  tracking: { l: 'Suivi de commande en temps réel', from: 'premium' },
  reorder: { l: 'Recommander en un clic', from: 'premium' },
  club: { l: 'Club Sushi Thaï', from: 'premium' },
  loyalty: { l: 'Fidélité à points', from: 'premium' },
  menuEditor: { l: 'Édition de la carte par le restaurant', from: 'premium' },
  stats: { l: 'Statistiques de vente', from: 'premium' },
  promoCodes: { l: 'Codes promo', from: 'option', price: 25000 },
  english: { l: 'Version anglaise', from: 'option', price: 49000 },
  qrTable: { l: 'Carte QR code à table', from: 'option', price: 29000, ghost: true },
  multiRestaurant: { l: 'Multi-restaurants', from: 'option', price: 60000, ghost: true },
  splitPayout: { l: 'Encaissement séparé par restaurant', from: 'option', price: 50000, ghost: true },
};
const PROMO = 'DEMO10';

/* ---------- état (partagé entre onglets via localStorage) ---------- */
const KEY = 'sushi-thai-maquette-v2';
const DEF = () => ({ plan: 'pro', on: {}, orders: [], res: [], soldout: Object.values(ITEMS).filter(i => i.soldout).map(i => i.id), prices: {}, paused: false, prep: 20, no: 101, club: false, points: 0 });
function load() { try { return { ...DEF(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return DEF(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* stockage indisponible : la démo reste utilisable */ } }
let st = load();
const Q = new URLSearchParams(location.search);
if (PLANS[Q.get('formule')]) { st.plan = Q.get('formule'); st.on = {}; save(); }
const on = k => (k in st.on ? st.on[k] : FEAT[k].from !== 'option' && RANK[st.plan] >= RANK[FEAT[k].from]);
const price = it => st.prices[it.id] ?? it.base;
const isOut = it => st.soldout.includes(it.id);

/* ---------- illustrations des plats (SVG générés, en attendant les photos HD) ---------- */
function rng(seed) { let s = 7; for (const ch of seed) s = (Math.imul(s, 31) + ch.charCodeAt(0)) >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
function art(it) {
  const n = it.n.toLowerCase(), r = rng(it.n), f = x => x.toFixed(1);
  const sc = (count, R, fn) => { let o = ''; for (let i = 0; i < count; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; o += fn(100 + Math.cos(a) * d, 100 + Math.sin(a) * d); } return o; };
  const rot = (x, y) => `transform="rotate(${(r() * 180) | 0} ${f(x)} ${f(y)})"`;
  const dot = (c, s) => (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s * (.7 + r() * .6))}" fill="${c}"/>`;
  const chunk = (c, c2, s) => (x, y) => `<rect x="${f(x - s / 2)}" y="${f(y - s * .4)}" width="${f(s * (1 + r() * .4))}" height="${f(s * (.7 + r() * .3))}" rx="${f(s * .3)}" fill="${c}" stroke="${c2}" stroke-width="2" ${rot(x, y)}/>`;
  const strip = (c, l) => (x, y) => `<rect x="${f(x - l / 2)}" y="${f(y - 2.5)}" width="${l}" height="5" rx="2.5" fill="${c}" ${rot(x, y)}/>`;
  const grain = (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="4.2" ry="1.9" fill="#fff" opacity=".9" ${rot(x, y)}/>`;
  const bowl = fill => `<circle cx="100" cy="100" r="97" fill="#0A070A"/><circle cx="100" cy="100" r="93" fill="#2A1E2A" stroke="#E5087F" stroke-width="2.5"/><circle cx="100" cy="100" r="80" fill="#140D14"/><circle cx="100" cy="100" r="76" fill="${fill}"/>`;
  const plate = () => `<circle cx="100" cy="100" r="97" fill="#0A070A"/><circle cx="100" cy="100" r="93" fill="#F4ECE4" stroke="#E5087F" stroke-width="2.5"/><circle cx="100" cy="100" r="72" fill="none" stroke="#DCCFC3" stroke-width="2"/>`;
  const roll = (x, y, c, c2, a = -18) => `<g transform="rotate(${a} ${x} ${y})"><rect x="${x - 46}" y="${y - 9}" width="92" height="18" rx="9" fill="${c}" stroke="${c2}" stroke-width="2"/><path d="M${x - 22} ${y - 8}v16M${x + 4} ${y - 8}v16M${x + 26} ${y - 8}v16" stroke="${c2}" stroke-width="1.5" opacity=".6"/></g>`;
  const dump = (x, y, a = 0) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x - 24} ${y + 6}a24 18 0 0 1 48 0Z" fill="#FBF4E6" stroke="#D2BE9C" stroke-width="2"/><path d="M${x - 12} ${y - 6}l3 7M${x} ${y - 10}v8M${x + 12} ${y - 6}l-3 7" stroke="#D2BE9C" stroke-width="2" stroke-linecap="round"/></g>`;
  const cup = `<circle cx="150" cy="150" r="21" fill="#fff" stroke="#DCCFC3" stroke-width="2"/><circle cx="150" cy="150" r="15" fill="#B3261E"/>`;
  const rice = () => bowl('#F3EADB') + sc(46, 68, grain);
  let g;
  if (it.ic === 'can') {
    const c = n.includes('pellegrino') ? '#2E8B57' : '#D8232A';
    g = `<circle cx="100" cy="100" r="97" fill="#0A070A"/><circle cx="100" cy="100" r="78" fill="${c}" stroke="#E5087F" stroke-width="2.5"/><circle cx="100" cy="100" r="62" fill="#D5D5DD"/><circle cx="100" cy="100" r="50" fill="none" stroke="#A9A9B4" stroke-width="3"/><ellipse cx="100" cy="88" rx="13" ry="20" fill="#B9B9C4" stroke="#8E8E9A" stroke-width="2"/><ellipse cx="100" cy="120" rx="10" ry="7" fill="#3a3a44"/>`;
  } else if (it.ic === 'drink') {
    const tea = n.includes('bubble');
    g = `<circle cx="100" cy="100" r="97" fill="#0A070A"/><circle cx="100" cy="100" r="80" fill="#fff" opacity=".18" stroke="#E5087F" stroke-width="2.5"/><circle cx="100" cy="100" r="68" fill="${tea ? '#D9A679' : '#F58CB8'}"/>` + (tea ? sc(16, 52, dot('#2B1710', 7)) : sc(5, 44, chunk('#fff', '#F9CFE0', 22)) + sc(4, 50, dot('#FFD54A', 6))) + `<rect x="96" y="14" width="9" height="92" rx="4.5" fill="#33C3CC" transform="rotate(28 100 100)"/>`;
  } else if (it.ic === 'dessert') {
    g = plate();
    if (/chocolat|fondant|daim|nutella/.test(n)) g += n.includes('maki') ? [0, 1, 2].map(i => `<circle cx="${62 + i * 38}" cy="100" r="17" fill="#fff" stroke="#DCCFC3" stroke-width="2"/><circle cx="${62 + i * 38}" cy="100" r="9" fill="#5A2E14"/>`).join('') : `<circle cx="100" cy="100" r="40" fill="#5A2E14" stroke="#3A1B0A" stroke-width="3"/><path d="M70 96c14-16 22 14 34-2s18 10 26-2" stroke="#8A4B22" stroke-width="5" fill="none" stroke-linecap="round"/>` + sc(8, 30, dot('#F4ECE4', 2.5));
    else if (/mang/.test(n)) g += (n.includes('sticky') ? `<ellipse cx="80" cy="108" rx="34" ry="28" fill="#fff" stroke="#E6DACB" stroke-width="2"/>` + sc(8, 20, dot('#1d1d1d', 1.6)) : '') + [0, 1, 2, 3].map(i => `<path d="M${98 + i * 12} 66q22 34 0 68q-12-34 0-68Z" fill="#FFC531" stroke="#E59A12" stroke-width="2"/>`).join('');
    else if (/tiramisu/.test(n)) g += `<rect x="64" y="66" width="72" height="68" rx="10" fill="#F6E7C8" stroke="#D8C39A" stroke-width="2"/>` + sc(40, 30, dot('#5A2E14', 2.4));
    else g += [['#F5B8D2', 76, 92], ['#fff', 118, 86], ['#BEE8C0', 100, 124]].slice(0, n.includes('litchi') ? 3 : 2 + (n.includes('mochi') ? 0 : 1)).map(([c, x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="${c}" stroke="#DCCFC3" stroke-width="2"/><circle cx="${x - 8}" cy="${y - 8}" r="5" fill="#fff" opacity=".7"/>`).join('');
  } else if (it.ic === 'nem' && /finger/.test(n)) {
    g = plate() + sc(5, 34, chunk('#E0932F', '#A8601A', 40)) + cup;
  } else if (it.ic === 'nem') {
    const tp = /tempura|fry/.test(n), ch = /chocolat/.test(n);
    g = plate() + [0, 1, 2, 3].map(i => roll(92, 58 + i * 25, ch ? '#C98A3C' : tp ? '#F2C76E' : '#E0A24A', ch ? '#8A5A1E' : '#B8782A') + (tp ? `<path d="M134 ${42 + i * 25}l16-10v16Z" fill="#E4572E"/>` : '')).join('') + (ch ? '' : cup);
  } else if (it.ic === 'dumpling') {
    g = plate() + dump(74, 80, -10) + dump(124, 76, 12) + dump(78, 126, 8) + dump(126, 124, -8);
  } else if (it.ic === 'mix') {
    g = plate() + roll(96, 62, '#E0A24A', '#B8782A', -8) + roll(96, 86, '#F2C76E', '#C9973A', -8) + dump(70, 128, -6) + dump(120, 132, 8) + `<path d="M40 104h120" stroke="#8A5A1E" stroke-width="3"/>` + [70, 96, 122].map(x => `<rect x="${x - 10}" y="96" width="20" height="16" rx="5" fill="#B5651D" stroke="#7A3F10" stroke-width="2"/>`).join('');
  } else if (it.ic === 'kid') {
    g = rice() + `<circle cx="80" cy="86" r="8" fill="#6FB04A"/><circle cx="120" cy="86" r="8" fill="#6FB04A"/><path d="M72 112q28 26 56 0" stroke="#F28C3B" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  } else if (it.ic === 'noodle') {
    g = `<clipPath id="cb"><circle cx="100" cy="100" r="76"/></clipPath>` + bowl('#D99A2B') + `<g clip-path="url(#cb)" fill="none" stroke-linecap="round">` + Array.from({ length: 11 }, (_, i) => { const y = 34 + i * 13, k = i % 2 ? 16 : -16; return `<path d="M22 ${y}C56 ${y + k} 78 ${y - k} 100 ${y}S150 ${y + k} 180 ${y}" stroke="${i % 3 ? '#F4CF78' : '#FBE3A6'}" stroke-width="7"/>`; }).join('') + `</g>` + sc(6, 54, strip('#E23B3B', 18)) + sc(6, 56, strip('#3E9B4F', 16)) + sc(8, 58, dot('#C98A3C', 3)) + `<path d="M132 48a20 20 0 0 1 28 28Z" fill="#B7E36A" stroke="#7FB23A" stroke-width="2"/>`;
  } else if (it.ic === 'curry') {
    g = bowl(n.includes('vert') ? '#8DB255' : '#D9532B') + `<path d="M58 96c18-30 54-26 62-4s-26 34-40 18 8-28 22-18" stroke="#FFF6E5" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>` + sc(6, 54, strip('#F5D04A', 18)) + sc(5, 54, strip(n.includes('vert') ? '#2E7D32' : '#3E9B4F', 16)) + sc(5, 52, dot('#E23B3B', 6.5)) + sc(4, 50, chunk('#F3E3C3', '#CDB58A', 18));
  } else if (it.ic === 'rice') {
    g = rice() + sc(10, 60, dot('#6FB04A', 4)) + sc(8, 60, dot('#F28C3B', 4)) + sc(6, 54, chunk('#F5D76A', '#D9B13B', 13));
  } else if (/crousty|dynamite|sel et poivre/.test(n)) {
    g = rice() + sc(9, 46, chunk('#E0932F', '#A8601A', 27)) + `<path d="M46 92l18 14 16-18 18 20 16-20 18 18 20-16" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + sc(12, 60, dot('#7A4416', 2.8)) + sc(9, 62, dot('#6FB04A', 3.4));
  } else if (/loc lac|kapao|bœuf/.test(n)) {
    g = bowl('#EBC2AE') + sc(34, 68, grain) + sc(8, 44, chunk('#7A3B1E', '#4E2410', 23)) + `<circle cx="132" cy="74" r="20" fill="#fff"/><circle cx="134" cy="76" r="9" fill="#F5B82E"/>` + [[62, 132], [80, 146], [58, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#B9E08F" stroke="#5E9C46" stroke-width="3"/>`).join('') + sc(5, 56, strip('#B03A6E', 16));
  } else {
    g = rice() + sc(7, 46, chunk('#B5651D', '#7A3F10', 23)) + sc(6, 58, strip('#E23B3B', 18)) + sc(6, 58, strip('#3E9B4F', 18)) + sc(6, 58, dot('#2B1B12', 4));
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${g}<path d="M30 78a74 74 0 0 1 44-46" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".22"/></svg>`;
}

/* ---------- horaires (carte imprimée, à confirmer) ---------- */
const H = { 1: [[690, 870], [1080, 1440]], 2: [[690, 870], [1080, 1440]], 3: [[690, 870], [1080, 1440]], 4: [[690, 870], [1080, 1440]], 5: [[690, 870], [1080, 1440]], 6: [[1080, 1440]], 0: [[1080, 1440]] };
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const hm = m => { const h = Math.floor(m / 60) % 24, mm = m % 60; return m % 1440 === 0 ? 'minuit' : `${h}${NB}h${mm ? NB + String(mm).padStart(2, '0') : ''}`; };
const nowMin = () => { const n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
const openRange = () => H[new Date().getDay()].find(r => nowMin() >= r[0] && nowMin() < r[1]);
function status() {
  const dot = $('#dot'), t = $('#statusTxt'), r = openRange();
  if (st.paused) { dot.className = 'dot off'; t.textContent = 'Commandes en ligne momentanément suspendues'; return; }
  if (r) { dot.className = 'dot'; t.textContent = 'Ouvert, jusqu’à ' + hm(r[1]); return; }
  const nx = H[new Date().getDay()].find(r => nowMin() < r[0]);
  dot.className = 'dot off'; t.textContent = nx ? 'Fermé, ouvre à ' + hm(nx[0]) : 'Fermé, commande pour demain';
}
function footToday() {
  const d = new Date().getDay();
  $('#fToday').innerHTML = `<span class="${$('#dot').className}"></span>${esc($('#statusTxt').textContent)}`;
  $('#fHours').textContent = DAYS[d] + ' : ' + H[d].map(r => hm(r[0]) + ' à ' + hm(r[1])).join(', ');
}

/* ---------- panier ---------- */
let cart = [], mode = 'emporter', city = 'Argenteuil', slot = '', pay = 'cb';
const form = { name: '', tel: '', email: '', addr: '', cp: '', comment: '', promo: '' };
const CITIES = { 'Argenteuil': 0, 'Sannois': 0, 'Saint-Gratien': 0, 'Bezons': 250, 'Cormeilles-en-Parisis': 250, 'Ermont': 250, 'Colombes': 350 };
function slots() {
  const out = [], n = new Date(), lead = st.prep + (mode === 'livraison' ? 30 : 0);
  for (let d = 0; d < 3 && out.length < 16; d++) {
    const day = new Date(n); day.setDate(n.getDate() + d);
    const m0 = d ? 0 : nowMin() + lead;
    H[day.getDay()].forEach(([a, b]) => { for (let m = a + 15; m <= b - 15; m += 15) if (m >= m0 && out.length < 16) out.push({ key: d + '-' + m, label: (d === 0 ? 'Aujourd’hui' : d === 1 ? 'Demain' : DAYS[day.getDay()]) + ' ' + hm(m), midi: a < 900 }); });
  }
  return out;
}
function totals() {
  const sub = cart.reduce((s, l) => s + l.unit * l.q, 0), S = slots(), sl = S.find(s => s.key === slot) || S[0];
  let disc = 0, discL = '';
  if (on('lunchDiscount') && mode === 'emporter' && sl && sl.midi && sub >= 1600) { disc = Math.round(sub * .1); discL = '−10' + NB + '% le midi'; }
  else if (on('promoCodes') && form.promo.trim().toUpperCase() === PROMO && sub > 0) { disc = Math.round(sub * .1); discL = 'Code ' + PROMO; }
  let del = 0;
  if (mode === 'livraison') { const fee = CITIES[city]; del = fee === 0 ? (sub >= 1500 ? 0 : 250) : fee; }
  return { sub, disc, discL, del, tot: sub - disc + del, sl, S };
}
const count = () => cart.reduce((s, l) => s + l.q, 0);
function addLine(it, unit, det) {
  const k = it.id + '|' + det, f = cart.find(l => l.k === k);
  f ? f.q++ : cart.push({ k, id: it.id, n: it.n, unit, det, q: 1 });
  renderCart(); toast(it.n + ' ajouté au panier');
  const b = $('#openCart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
const field = (id, label, extra = '') => `<label>${label}<input id="f-${id}" data-field="${id}" value="${esc(form[id])}" ${extra}></label>`;
const nudge = (txt, ratio) => `<div class="nudge">${txt}<i><u style="width:${Math.min(100, Math.round(ratio * 100))}%"></u></i></div>`;
function renderCart() {
  if (!on('delivery')) mode = 'emporter';
  const n = count();
  $('#cartN').textContent = n;
  const mb = $('#mbarBtn');
  mb.textContent = n ? `Mon panier · ${E(totals().tot)}` : 'Je commande 🔥';
  mb.dataset.cart = n ? '1' : '';
  const body = $('#cartBody'), foot = $('#cartFoot');
  if (!n) {
    const last = st.orders.find(o => o.st !== -1);
    body.innerHTML = `<div class="empty"><div class="big-e">🥢</div><p>Ton panier est vide.<br>Ajoute un plat depuis la carte.</p>${on('reorder') && last ? `<button class="btn w" data-reorder="${last.no}">Recommander ma dernière commande</button>` : ''}</div>`;
    foot.innerHTML = ''; return;
  }
  const t = totals(), S = t.S;
  if (!S.find(s => s.key === slot)) slot = S[0] ? S[0].key : '';
  const liv = mode === 'livraison';
  body.innerHTML =
    (st.paused ? `<div class="alert">Les commandes en ligne sont momentanément suspendues. Réessaie dans quelques minutes ou appelle-nous au 01 39 96 19 51.</div>` : !openRange() ? `<div class="alert">Le restaurant est fermé pour l’instant. Programme ta commande pour le prochain service.</div>` : '') +
    cart.map((l, i) => `<div class="line"><b>${esc(l.n)}</b><span>${E(l.unit * l.q)}</span>${l.det ? `<small>${esc(l.det)}</small>` : ''}<div class="qty"><button data-q="${i}" data-d="-1" aria-label="Retirer un ${esc(l.n)}">−</button><span>${l.q}</span><button data-q="${i}" data-d="1" aria-label="Ajouter un ${esc(l.n)}">+</button></div></div>`).join('') +
    (on('delivery') ? `<div class="seg"><button class="${liv ? '' : 'on'}" data-mode="emporter">À emporter</button><button class="${liv ? 'on' : ''}" data-mode="livraison">Livraison</button></div>` : `<p class="note" style="margin:14px 0 0">Commande à emporter, à retirer au restaurant.</p>`) +
    (liv ? `<label>Ville<select id="city">${Object.keys(CITIES).map(c => `<option ${c === city ? 'selected' : ''}>${c}</option>`).join('')}<option value="x">Autre ville</option></select></label>` + field('addr', 'Adresse', 'placeholder="N°, rue, étage, code" autocomplete="street-address"') + field('cp', 'Code postal', 'inputmode="numeric" autocomplete="postal-code" maxlength="5"') : '') +
    `<label>${liv ? 'Livraison souhaitée' : 'Retrait'}<select id="slot">${S.map(s => `<option value="${s.key}" ${s.key === slot ? 'selected' : ''}>${s.label}</option>`).join('')}</select></label>` +
    field('name', 'Nom', 'autocomplete="name"') + field('tel', 'Téléphone', 'type="tel" autocomplete="tel"') + field('email', 'E-mail', 'type="email" autocomplete="email"') +
    `<label>Un mot pour la cuisine (facultatif)<textarea data-field="comment" rows="2" placeholder="Sans oignons, bien épicé…">${esc(form.comment)}</textarea></label>` +
    (on('promoCodes') ? `<label>Code promo<input data-field="promo" data-rerender value="${esc(form.promo)}" placeholder="Essaie ${PROMO}" autocapitalize="characters"></label>` : '') +
    `<div class="seg"><button class="${pay === 'cb' ? 'on' : ''}" data-pay="cb">Payer en ligne</button><button class="${pay === 'place' ? 'on' : ''}" data-pay="place">${liv ? 'À la livraison' : 'Au retrait'}</button></div>`;
  let hint = '';
  if (on('incentives')) {
    if (on('lunchDiscount') && !liv && t.sl && t.sl.midi && t.sub < 1600) hint = nudge(`Plus que ${E(1600 - t.sub)} pour profiter de −10${NB}% le midi.`, t.sub / 1600);
    if (liv && CITIES[city] === 0 && t.sub < 1500) hint = nudge(`Plus que ${E(1500 - t.sub)} pour la livraison offerte.`, t.sub / 1500);
  }
  foot.innerHTML = `<div class="tot"><div><span>Sous-total</span><span>${E(t.sub)}</span></div>${t.disc ? `<div class="disc"><span>${t.discL}</span><span>−${E(t.disc)}</span></div>` : ''}${liv ? `<div><span>Livraison</span><span>${t.del ? E(t.del) : 'Offerte'}</span></div>` : ''}<div class="big"><span>Total</span><span>${E(t.tot)}</span></div></div>${hint}
  <button class="btn p" style="width:100%;margin-top:12px" id="checkout" ${st.paused || !S.length ? 'disabled' : ''}>${pay === 'cb' ? 'Payer ' + E(t.tot) : 'Valider la commande'}</button>`;
}
function checkout(btn) {
  const need = (id, msg) => { if (form[id].trim()) return true; toast(msg); const el = $('#f-' + id); el && el.focus(); return false; };
  if (mode === 'livraison') {
    if (city === 'x') { toast('On ne livre pas encore cette ville. Passe en « À emporter » ?'); return; }
    if (!need('addr', 'Ajoute ton adresse de livraison') || !need('cp', 'Ajoute ton code postal')) return;
  }
  if (!need('name', 'Ajoute ton nom') || !need('tel', 'Ajoute ton téléphone')) return;
  const t = totals();
  const o = { no: st.no++, t: Date.now(), name: form.name.trim(), tel: form.tel.trim(), mode, city, addr: form.addr.trim(), cp: form.cp.trim(), slot: t.sl ? t.sl.label : '', lines: cart.map(l => ({ ...l })), sub: t.sub, disc: t.disc, discL: t.discL, del: t.del, tot: t.tot, pay, comment: form.comment.trim(), st: 0, pts: on('loyalty') ? Math.floor(t.tot / 100) : 0 };
  const done = () => { st.orders.unshift(o); st.points += o.pts; save(); cart = []; form.comment = ''; form.promo = ''; closeAll(); renderCart(); sync(); location.hash = '#/commande/' + o.no; };
  if (pay === 'cb') { btn.disabled = true; btn.textContent = 'Paiement sécurisé…'; setTimeout(done, 900); } else done();
}

/* ---------- fiche plat et wok ---------- */
let cur = null, sel = [];
const req = g => g.type === 'one' && !g.opt;
const mPrice = () => price(cur) + cur.opts.reduce((s, g, gi) => s + sel[gi].reduce((a, ci) => a + cents(g.choices[ci].p), 0), 0);
function openItem(id) {
  const it = ITEMS[id];
  if (!it || isOut(it)) return;
  if (!it.opts) { addLine(it, price(it), ''); return; }
  cur = it; sel = it.opts.map(() => []);
  $('#mTitle').textContent = it.n; drawModal(); openO($('#modal'));
}
function drawModal() {
  const miss = cur.opts.findIndex((g, i) => req(g) && !sel[i].length);
  $('#mBody').innerHTML = `<div class="mhead">${art(cur)}<p class="note" style="font-size:14px;margin:0">${esc(cur.d || 'Ton wok, comme tu l’aimes : 5 choix et c’est parti.')}</p></div>` +
    cur.opts.map((g, gi) => `<div class="grp ${gi === miss ? 'miss' : ''}"><h4>${esc(g.name)}<em>${g.type === 'multi' ? 'jusqu’à ' + g.max : g.opt ? 'facultatif' : sel[gi].length ? '✓' : '1 au choix, obligatoire'}</em></h4><div class="opts">${g.choices.map((c, ci) => `<button class="${sel[gi].includes(ci) ? 'on' : ''}" aria-pressed="${sel[gi].includes(ci)}" data-g="${gi}" data-c="${ci}">${esc(c.n)}${c.p ? ` <small>+${E(cents(c.p))}</small>` : ''}</button>`).join('')}</div></div>`).join('');
  const b = $('#mAdd');
  b.disabled = miss > -1;
  b.textContent = miss > -1 ? 'Choisis : ' + cur.opts[miss].name.replace(/^\d\.\s*/, '').toLowerCase() : 'Ajouter · ' + E(mPrice());
}

/* ---------- carte ---------- */
let catIO = null;
function renderMenu() {
  const cats = MENU.filter(c => !(c.wok && !on('wokBuilder')));
  $('#catNav').innerHTML = cats.map(c => `<a href="#c-${c.id}" data-c="${c.id}">${c.name}</a>`).join('');
  $('#menu').innerHTML = cats.map(c => {
    let h = `<section class="block" id="c-${c.id}"><div class="bh"><h2>${c.name}</h2>${c.tag ? `<span class="tagp">${c.tag}</span>` : ''}</div>`;
    if (c.sub) h += `<p class="sub">${c.sub}</p>`;
    if (c.choice) h += `<div class="choice"><b>Viande au choix</b>${c.choice.map(x => `<span>${x}</span>`).join('')}</div>`;
    if (c.wok) {
      const W = WOK.opts, T = ['Choisis ta base', 'Choisis ta protéine', 'Choisis tes légumes', 'Choisis ta sauce', 'Choisis ton topping'];
      h += `<div class="wokgrid">${W.slice(0, 5).map((g, i) => `<div class="wstep"><h3><em>${i + 1}</em>${T[i]}</h3><div class="wbox">${g.choices.map(x => x.n).join(' · ')}</div></div>`).join('')}<div class="wstep"><h3 style="color:#fff"><em>+</em>Suppléments</h3><div class="wbox">${W[5].choices.map(x => x.n + ' ' + E(cents(x.p))).join(' · ')}</div></div></div><div class="center"><button class="btn p big" data-add="wok">Composer mon wok</button></div>`;
    } else if (c.todo) {
      h += `<div class="todo"><b>Menus midi, menus solo, Duo 1, Duo 2, Family Box, rolls à la carte, signatures et poke bowls.</b><br>Cette rubrique sera remplie avec ta carte sushi, au même format que les plats thaï.</div>`;
    } else {
      h += '<div class="grid">' + c.items.filter(it => on('combos') || !COMBOS.includes(it.n)).map(it => {
        const out = isOut(it);
        return `<article class="item ${out ? 'out' : ''}" data-id="${it.id}">${it.b ? `<span class="badge ${it.b === 'Nouveau' ? 'new' : ''}">${it.b === 'Nouveau' ? 'New' : it.b}</span>` : ''}<div class="ph">${art(it)}</div><h3>${it.n}</h3>${it.pcs ? `<span class="pcs">${it.pcs}</span>` : ''}<p>${it.d || ''}</p><div class="row"><span class="price">${E(price(it))}</span>${out ? '<button class="add" disabled>Épuisé</button>' : `<button class="add" data-add="${it.id}" aria-label="Ajouter ${esc(it.n)}">Ajouter</button>`}</div></article>`;
      }).join('') + '</div>';
    }
    return h + '</section>';
  }).join('');
  if (catIO) catIO.disconnect();
  const links = $$('#catNav a');
  catIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.toggle('on', l.dataset.c === e.target.id.slice(2)));
    const a = $('#catNav .on'), box = $('#catNav');
    if (a) box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
  }), { rootMargin: '-40% 0px -55% 0px' });
  cats.forEach(c => catIO.observe($('#c-' + c.id)));
}

/* ---------- confirmation et suivi ---------- */
function renderTrack() {
  const no = +location.hash.split('/')[2], o = st.orders.find(x => x.no === no), el = $('#trackBody');
  if (!o) { el.innerHTML = `<h1>Oups</h1><p>Cette commande est introuvable.</p><a class="btn p" href="#carte">Retour à la carte</a>`; return; }
  const liv = o.mode === 'livraison', L = ['Reçue', 'En préparation', 'Prête', liv ? 'Livrée' : 'Retirée'];
  el.innerHTML = `<a href="#accueil" class="logo" style="display:inline-flex"><svg aria-hidden="true"><use href="#lg"/></svg><span><b>Sushi Thaï</b></span></a>
  <h1>Merci<br><span class="pink">${esc(o.name.split(' ')[0])} !</span></h1>
  <div class="ono">Commande n° ${o.no} · ${o.pay === 'cb' ? 'payée' : (liv ? 'à régler à la livraison' : 'à régler au retrait')}</div>
  <p>${liv ? 'Livraison prévue' : 'Retrait au restaurant'} : <b>${o.slot}</b>.${liv ? `<br>${esc(o.addr)}, ${esc(o.cp)} ${esc(o.city)}` : '<br>120 bis boulevard Jean Allemane, Argenteuil'}<br>Un e-mail de confirmation t’est envoyé.</p>
  ${o.st === -1 ? `<div class="alert">Cette commande a été annulée par le restaurant. Appelle-nous au 01 39 96 19 51.</div>` : on('tracking') ? `<div class="panel" style="margin:18px 0"><h3>Suivi en direct</h3><div class="steps">${L.map((l, i) => `<div class="${i < o.st ? 'done' : i === o.st ? (o.st === 3 ? 'done' : 'done cur') : ''}">${l}</div>`).join('')}</div><p class="note" style="margin:8px 0 0">La page se met à jour toute seule dès que la cuisine avance.</p></div>` : ''}
  <div class="panel" style="margin:18px 0"><h3>Récapitulatif</h3><ul class="recap">${o.lines.map(l => `<li><span>${l.q} × ${esc(l.n)}${l.det ? `<small>${esc(l.det)}</small>` : ''}</span><b>${E(l.unit * l.q)}</b></li>`).join('')}${o.disc ? `<li class="pink"><span>${o.discL}</span><b>−${E(o.disc)}</b></li>` : ''}${liv ? `<li><span>Livraison</span><b>${o.del ? E(o.del) : 'Offerte'}</b></li>` : ''}<li><span class="disp" style="font-size:26px">Total</span><b class="disp" style="font-size:26px">${E(o.tot)}</b></li></ul></div>
  ${on('loyalty') && o.pts ? `<div class="pts"><b>+${o.pts} points fidélité</b>Ton solde : ${st.points} points.</div>` : ''}
  <div class="ctas" style="margin-top:22px"><a class="btn p" href="#carte">Retour à la carte</a>${on('reorder') ? `<button class="btn w" data-reorder="${o.no}">Recommander la même</button>` : ''}</div>`;
}
function reorder(no) {
  const o = st.orders.find(x => x.no === +no); if (!o) return;
  cart = o.lines.filter(l => ITEMS[l.id] && !isOut(ITEMS[l.id])).map(l => ({ ...l }));
  location.hash = '#carte'; renderCart(); openO($('#drawer'));
}

/* ---------- espace restaurant ---------- */
let rTab = 'orders', armed = 0, seen = Math.max(100, ...st.orders.map(o => o.no)), fresh = new Set(), actx = null;
const TABS = [['orders', 'Commandes'], ['dispo', 'Disponibilités', 'availability'], ['resa', 'Réservations', 'reservations'], ['regl', 'Réglages'], ['stats', 'Statistiques', 'stats']];
function ding() {
  if (!actx) return;
  const t = actx.currentTime;
  [880, 1175, 1568].forEach((fq, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = fq; o.connect(g); g.connect(actx.destination); g.gain.setValueAtTime(.0001, t + i * .16); g.gain.exponentialRampToValueAtTime(.3, t + i * .16 + .02); g.gain.exponentialRampToValueAtTime(.0001, t + i * .16 + .3); o.start(t + i * .16); o.stop(t + i * .16 + .32); });
}
function sync() {
  const mx = Math.max(100, ...st.orders.map(o => o.no));
  if (mx > seen) { st.orders.filter(o => o.no > seen).forEach(o => fresh.add(o.no)); seen = mx; ding(); setTimeout(() => fresh.clear(), 3500); }
  route();
}
function orderCard(o) {
  const liv = o.mode === 'livraison';
  return `<div class="ko ${fresh.has(o.no) ? 'fresh' : ''}"><header><span class="no">N° ${o.no}</span><span class="st ${o.pay === 'cb' ? 'paid' : 'due'}">${o.pay === 'cb' ? 'Payée' : 'À encaisser ' + E(o.tot)}</span></header>
  <div class="meta"><b>${esc(o.name)}</b> · ${liv ? 'Livraison' : 'À emporter'} · ${o.slot}${o.tel ? ` · <a href="tel:${esc(o.tel)}">${esc(o.tel)}</a>` : ''}</div>
  ${liv ? `<div class="meta">${esc(o.addr)}, ${esc(o.cp)} ${esc(o.city)} · <a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.addr + ' ' + o.cp + ' ' + o.city)}">Ouvrir le GPS</a></div>` : ''}
  <ul>${o.lines.map(l => `<li>${l.q} × ${esc(l.n)}${l.det ? `<br><small>${esc(l.det)}</small>` : ''}</li>`).join('')}</ul>
  ${o.comment ? `<div class="cm">« ${esc(o.comment)} »</div>` : ''}
  <div class="meta"><b>Total ${E(o.tot)}</b></div>
  <div class="acts"><button class="go" data-next="${o.no}">${['Lancer', 'Prête', 'Terminée'][o.st]}</button><button class="ko-x" data-print>Ticket</button><button class="ko-x" data-cancel="${o.no}">${armed === o.no ? 'Sûr ?' : 'Annuler'}</button></div></div>`;
}
const sw = (attr, checked, label) => `<button class="sw" role="switch" aria-checked="${checked}" aria-label="${esc(label)}" ${attr}></button>`;
function renderResto() {
  const tabs = TABS.filter(t => !t[2] || on(t[2]));
  if (!tabs.find(t => t[0] === rTab)) rTab = 'orders';
  const live = st.orders.filter(o => o.st >= 0 && o.st < 3);
  $('#rTabs').innerHTML = tabs.map(t => `<button role="tab" aria-selected="${t[0] === rTab}" class="${t[0] === rTab ? 'on' : ''}" data-tab="${t[0]}">${t[1]}${t[0] === 'orders' && live.length ? ' · ' + live.length : ''}</button>`).join('');
  $('#soundBtn').textContent = actx ? '🔔 Son activé' : '🔕 Activer le son';
  const b = $('#rBody');
  if (rTab === 'orders') {
    b.innerHTML = (st.paused ? `<div class="alert">Commandes en ligne en pause. Réactive-les dans Réglages.</div>` : '') + `<div class="kcols">${['Nouvelles', 'En préparation', 'Prêtes'].map((t, i) => { const L = st.orders.filter(o => o.st === i); return `<div class="kcol"><h2>${t}<span>${L.length}</span></h2>${L.map(orderCard).join('') || '<p class="note">Rien pour l’instant.</p>'}</div>`; }).join('')}</div>` + (st.orders.length ? '' : `<p class="note" style="margin-top:14px">Passe une commande depuis le site (ou clique sur « Simuler une commande ») pour la voir arriver ici. Astuce : ouvre le site sur ton téléphone et cet écran sur une tablette.</p>`);
  } else if (rTab === 'dispo') {
    b.innerHTML = `<div class="rlist">` + MENU.filter(c => c.items).map(c => `<h2 style="font-size:30px;margin-top:12px">${c.name}</h2>` + c.items.map(it => `<div class="rrow"><b>${it.n}</b>${on('menuEditor') ? `<label style="display:flex;align-items:center;gap:6px">Prix<input type="number" step="0.1" min="0" data-price="${it.id}" value="${(price(it) / 100).toFixed(2)}" aria-label="Prix de ${esc(it.n)}"></label>` : `<span>${E(price(it))}</span>`}<span class="note">${isOut(it) ? 'Épuisé' : 'Disponible'}</span>${sw(`data-out="${it.id}"`, !isOut(it), 'Disponibilité de ' + it.n)}</div>`).join('')).join('') + `</div>`;
  } else if (rTab === 'resa') {
    b.innerHTML = `<div class="rlist">` + (st.res.map(r => `<div class="rrow"><b>${esc(r.name)} · ${esc(r.pers)}<br><span class="note">${esc(r.date)} à ${esc(r.time)} · ${esc(r.tel)}${r.msg ? ' · « ' + esc(r.msg) + ' »' : ''}</span></b>${r.s === 'pending' ? `<button class="btn p" style="font-size:18px;padding:10px 16px 8px" data-res="${r.id}" data-s="confirmed">Confirmer</button><button class="btn w" style="font-size:18px;padding:10px 16px 8px" data-res="${r.id}" data-s="refused">Refuser</button>` : `<span class="st ${r.s === 'confirmed' ? 'paid' : 'due'}">${r.s === 'confirmed' ? 'Confirmée' : 'Refusée'}</span>`}</div>`).join('') || '<p class="note">Aucune demande de réservation. Envoie-en une depuis le site.</p>') + `</div>`;
  } else if (rTab === 'regl') {
    b.innerHTML = `<div class="rlist"><div class="rrow"><b>Commandes en ligne<br><span class="note">Coupe la prise de commande pendant un rush. Le site l’affiche tout de suite.</span></b><span class="note">${st.paused ? 'En pause' : 'Ouvertes'}</span>${sw('data-pause', !st.paused, 'Commandes en ligne')}</div>
    <div class="rrow"><b>Délai de préparation<br><span class="note">Décale le premier créneau proposé au client.</span></b><select data-prep style="width:auto" aria-label="Délai de préparation">${[10, 15, 20, 30, 45].map(m => `<option value="${m}" ${m === st.prep ? 'selected' : ''}>${m} min</option>`).join('')}</select></div>
    <div class="rrow"><b>Horaires<br><span class="note">${[1, 6].map(d => (d === 1 ? 'Lundi au vendredi' : 'Samedi, dimanche') + ' : ' + H[d].map(r => hm(r[0]) + ' à ' + hm(r[1])).join(', ')).join(' · ')}</span></b><span class="note">Modifiables ici dans le site final</span></div></div>`;
  } else {
    const ok = st.orders.filter(o => o.st !== -1), ca = ok.reduce((s, o) => s + o.tot, 0), top = {};
    ok.forEach(o => o.lines.forEach(l => top[l.n] = (top[l.n] || 0) + l.q));
    const T = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 6), mx = T[0] ? T[0][1] : 1, nl = ok.filter(o => o.mode === 'livraison').length;
    const bar = (l, v, m) => `<div class="bar"><span>${esc(l)}</span><i><u style="width:${m ? Math.round(v / m * 100) : 0}%"></u></i><span>${v}</span></div>`;
    b.innerHTML = ok.length ? `<p class="note">Calculé sur les commandes de cette démonstration.</p><div class="kpis"><div class="kpi"><b>${E(ca)}</b><span>Chiffre d’affaires</span></div><div class="kpi"><b>${ok.length}</b><span>Commandes</span></div><div class="kpi"><b>${E(Math.round(ca / ok.length))}</b><span>Panier moyen</span></div></div>
    <div class="infos"><div class="panel"><h3>Plats les plus vendus</h3><div class="bars">${T.map(([l, v]) => bar(l, v, mx)).join('')}</div></div><div class="panel"><h3>Emporter ou livraison</h3><div class="bars">${bar('À emporter', ok.length - nl, ok.length)}${bar('Livraison', nl, ok.length)}</div></div></div>` : '<p class="note">Les statistiques apparaissent dès la première commande.</p>';
  }
}
function simulate() {
  const pool = Object.values(ITEMS).filter(i => i.id !== 'wok' && !i.opts && !isOut(i)), names = ['Inès', 'Karim', 'Léa', 'Yanis', 'Sofia', 'Mehdi'];
  const lines = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => pool[Math.floor(Math.random() * pool.length)]).map(it => ({ k: it.id + '|', id: it.id, n: it.n, unit: price(it), det: '', q: 1 + Math.floor(Math.random() * 2) }));
  const sub = lines.reduce((s, l) => s + l.unit * l.q, 0), liv = on('delivery') && Math.random() < .4, payCb = Math.random() < .6, S = slots();
  st.orders.unshift({ no: st.no++, t: Date.now(), name: names[Math.floor(Math.random() * names.length)] + ' (démo)', tel: '', mode: liv ? 'livraison' : 'emporter', city: 'Argenteuil', addr: liv ? '12 rue de la Démo' : '', cp: liv ? '95100' : '', slot: S[0] ? S[0].label : '', lines, sub, disc: 0, discL: '', del: liv && sub < 1500 ? 250 : 0, tot: sub + (liv && sub < 1500 ? 250 : 0), pay: payCb ? 'cb' : 'place', comment: '', st: 0, pts: 0 });
  save(); sync();
}

/* ---------- panneau devis ---------- */
function renderDemo() {
  $('#demoPlan').textContent = PLANS[st.plan].l;
  const row = k => { const d = FEAT[k], inc = d.from !== 'option' && RANK[st.plan] >= RANK[d.from]; return `<div class="frow"><span>${d.l}${d.ghost ? ' <em>(non visible dans la maquette)</em>' : ''}</span><em>${d.from === 'option' ? '+' + E0(d.price) : inc ? 'inclus' : on(k) ? 'hors formule' : ''}</em>${sw(`data-feat="${k}"`, on(k), d.l)}</div>`; };
  const grp = (t, from) => `<h4>${t}</h4>` + Object.keys(FEAT).filter(k => FEAT[k].from === from).map(row).join('');
  $('#demoBody').innerHTML = `<p class="note" style="margin-top:0">Choisis une formule, puis active ou coupe chaque fonctionnalité : le site et l’espace restaurant s’adaptent en direct.</p>
  <div class="plans">${Object.entries(PLANS).map(([k, p]) => `<button class="${k === st.plan ? 'on' : ''}" data-plan="${k}">${p.l}<span>${E0(p.p)}</span></button>`).join('')}</div>
  <div class="fl"><p class="note" style="margin:14px 0 0"><b>Toujours inclus :</b> site sur mesure, carte complète, panier, commande à emporter, paiement en ligne, espace restaurant avec alerte sonore.</p>${grp('Dès la formule Pro', 'pro')}${grp('Formule Premium', 'premium')}${grp('Options à la carte', 'option')}</div>`;
  const opt = Object.keys(FEAT).filter(k => FEAT[k].from === 'option' && on(k)).reduce((s, k) => s + FEAT[k].price, 0);
  const extra = Object.keys(FEAT).filter(k => FEAT[k].from !== 'option' && on(k) && RANK[st.plan] < RANK[FEAT[k].from]).length;
  $('#demoFoot').innerHTML = `<div class="quote"><span>Total</span><span>${E0(PLANS[st.plan].p + opt)}</span></div><p class="note" style="margin:2px 0 10px">Formule ${PLANS[st.plan].l}${opt ? ' + ' + E0(opt) + ' d’options' : ''}${extra ? `. ${extra} fonctionnalité${extra > 1 ? 's' : ''} hors formule, à chiffrer` : ''}.</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn w" style="font-size:17px;padding:10px 14px 8px" href="#/restaurant" data-close>Espace restaurant</a><button class="btn o" style="font-size:17px;padding:10px 14px 8px" data-reset>Remettre à zéro</button></div>`;
}

/* ---------- rendu global et navigation ---------- */
const mq = (id, list) => { const a = list.filter(Boolean).map(t => `<span>${t}</span>`).join(''); $(id).innerHTML = a + a + a + a; };
function applyFlags() {
  $$('[data-f]').forEach(e => e.hidden = !on(e.dataset.f));
  $$('[data-nf]').forEach(e => e.hidden = on(e.dataset.nf));
  mq('#mq1', ['Fait maison', 'Depuis 2017', 'Wok minute', on('delivery') && 'Livraison offerte', 'Sushis roulés à la main', on('lunchDiscount') && 'Le midi −10' + NB + '%']);
  mq('#mq2', ['Thaï crousty', 'Bœuf loc lac', 'Dynamite', 'Pad thaï', 'Curry rouge', 'Mango sticky rice']);
  mq('#mq3', ['Je commande', 'À emporter', on('delivery') && 'En livraison', 'Sans attendre', 'Paiement en ligne']);
  if (st.club) $('#clubForm').innerHTML = '<p class="disp" style="font-size:30px;margin:0">Bienvenue dans le club 🔥</p>';
}
function route() {
  const h = location.hash, v = h.startsWith('#/restaurant') ? 'resto' : h.startsWith('#/commande/') ? 'track' : 'site';
  const was = !$('#' + v).hidden;
  ['site', 'resto', 'track'].forEach(id => $('#' + id).hidden = id !== v);
  $('#demoTab').hidden = Q.get('demo') === '0';
  status(); footToday(); renderDemo();
  if (v === 'resto') renderResto();
  if (v === 'track') renderTrack();
  if (!was) { if (v === 'site' && h.length > 1 && !h.startsWith('#/')) { const t = document.getElementById(h.slice(1)); t ? t.scrollIntoView() : scrollTo(0, 0); } else scrollTo(0, 0); }
}
function renderAll() { renderMenu(); applyFlags(); renderCart(); route(); }

/* ---------- fenêtres ---------- */
const scrim = $('#scrim');
let lastFocus = null;
function openO(el) { $$('.drawer,.modal').forEach(e => e.classList.remove('on')); lastFocus = document.activeElement; el.classList.add('on'); scrim.classList.add('on'); $('.mbar').hidden = true; setTimeout(() => el.querySelector('.x').focus(), 60); }
function closeAll() { $$('.drawer,.modal').forEach(e => e.classList.remove('on')); scrim.classList.remove('on'); $('.mbar').hidden = false; if (lastFocus && lastFocus.focus) lastFocus.focus(); lastFocus = null; }
let tt; function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('on'), 2000); }

/* ---------- événements ---------- */
document.addEventListener('click', e => {
  if (!e.target.closest('button,a')) {
    const card = e.target.closest('.item[data-id]');
    if (card) { openItem(card.dataset.id); return; }
    if (e.target.closest('#spotPic, .visual')) { openItem(CRousty.id); return; }
  }
  const b = e.target.closest('button,a'); if (!b) return;
  const d = b.dataset;
  if ('close' in d) closeAll();
  if (d.add) openItem(d.add);
  if (d.reorder) reorder(d.reorder);
  if (d.lang === 'en') toast('Version anglaise : option du devis, le site entier sera traduit.');
  if (b.id === 'mbarBtn' && d.cart) { e.preventDefault(); renderCart(); openO($('#drawer')); }
  // panier
  if (d.q !== undefined) { const l = cart[+d.q]; l.q += +d.d; if (l.q <= 0) cart.splice(+d.q, 1); renderCart(); }
  if (d.mode) { mode = d.mode; renderCart(); }
  if (d.pay) { pay = d.pay; renderCart(); }
  if (b.id === 'checkout') checkout(b);
  // fiche plat
  if (d.g !== undefined) { const gi = +d.g, ci = +d.c, g = cur.opts[gi], s = sel[gi], k = s.indexOf(ci); if (g.type === 'one') sel[gi] = k > -1 && g.opt ? [] : [ci]; else if (k > -1) s.splice(k, 1); else if (s.length < g.max) s.push(ci); else toast('Maximum ' + g.max + ' choix'); drawModal(); }
  // espace restaurant
  if (d.tab) { rTab = d.tab; renderResto(); }
  if (d.next) { const o = st.orders.find(x => x.no === +d.next); o.st++; armed = 0; save(); renderResto(); }
  if (d.cancel) { if (armed === +d.cancel) { st.orders.find(x => x.no === armed).st = -1; armed = 0; save(); } else armed = +d.cancel; renderResto(); }
  if ('print' in d) window.print();
  if (d.out) { const i = st.soldout.indexOf(d.out); i > -1 ? st.soldout.splice(i, 1) : st.soldout.push(d.out); save(); renderMenu(); renderResto(); }
  if ('pause' in d) { st.paused = !st.paused; save(); renderCart(); status(); renderResto(); }
  if (d.res) { st.res.find(r => r.id === +d.res).s = d.s; save(); renderResto(); }
  // devis
  if (d.plan) { st.plan = d.plan; st.on = {}; save(); renderAll(); }
  if (d.feat) { st.on[d.feat] = !on(d.feat); save(); renderAll(); }
  if ('reset' in d) { const plan = st.plan; st = DEF(); st.plan = plan; cart = []; save(); seen = 100; renderAll(); toast('Démo remise à zéro'); }
});
$('#openCart').onclick = () => { renderCart(); openO($('#drawer')); };
$('#demoTab').onclick = () => { renderDemo(); openO($('#demo')); };
$('#spotBtn').onclick = () => openItem(CRousty.id);
$('#mAdd').onclick = () => { const det = cur.opts.map((g, gi) => sel[gi].map(ci => g.choices[ci].n).join(', ')).filter(Boolean).join(' · '); addLine(cur, mPrice(), det); closeAll(); };
$('#simBtn').onclick = simulate;
$('#soundBtn').onclick = () => { if (actx) { actx.close(); actx = null; } else { actx = new (window.AudioContext || window.webkitAudioContext)(); ding(); } renderResto(); };
scrim.onclick = closeAll;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
document.addEventListener('input', e => { const k = e.target.dataset.field; if (k) form[k] = e.target.value; });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'city') { city = t.value; renderCart(); if (city === 'x') toast('On ne livre pas encore cette ville. Passe en « À emporter » ?'); }
  if (t.id === 'slot') { slot = t.value; renderCart(); }
  if ('rerender' in t.dataset) renderCart();
  if ('prep' in t.dataset) { st.prep = +t.value; save(); renderCart(); }
  if (t.dataset.price) { const v = cents(parseFloat(t.value)); if (v > 0) { st.prices[t.dataset.price] = v; save(); renderMenu(); toast('Prix mis à jour sur le site'); } }
});
addEventListener('hashchange', route);
addEventListener('storage', e => { if (e.key === KEY) { st = load(); renderMenu(); applyFlags(); renderCart(); sync(); } });

/* ---------- réservation, club ---------- */
const rDate = $('#rDate');
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
rDate.value = rDate.min = iso(new Date());
function fillTimes() { const d = new Date(rDate.value + 'T12:00'), rs = H[d.getDay()] || []; $('#rTime').innerHTML = rs.flatMap(([a, b]) => { const o = []; for (let m = a; m <= b - 60; m += 30) o.push(`<option>${hm(m)}</option>`); return o; }).join(''); }
rDate.onchange = fillTimes; fillTimes();
$('#rPers').innerHTML = Array.from({ length: 12 }, (_, i) => `<option>${i + 1} personne${i ? 's' : ''}</option>`).join('') + '<option>Groupe ou événement privé</option>';
$('#resForm').onsubmit = e => {
  e.preventDefault();
  const date = new Date(rDate.value + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  st.res.unshift({ id: Date.now(), date, time: $('#rTime').value, pers: $('#rPers').value, name: $('#rName').value, tel: $('#rTel').value, msg: $('#rMsg').value, s: 'pending' }); save();
  const m = $('#resMsg'); m.hidden = false; m.textContent = `Demande envoyée pour le ${date} à ${$('#rTime').value}. Le restaurant te confirme par SMS ou e-mail.`;
  e.target.reset(); rDate.value = iso(new Date()); fillTimes();
};
$('#clubForm').onsubmit = e => { e.preventDefault(); st.club = true; save(); applyFlags(); };

/* ---------- horaires, apparitions, compteurs ---------- */
$('#hours').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<div class="${d === new Date().getDay() ? 'today' : ''}"><span>${DAYS[d]}</span><span>${H[d].map(r => hm(r[0]) + ' à ' + hm(r[1])).join(', ')}</span></div>`).join('');
$('#heroBowl').innerHTML = art(CRousty);
$('#spotPic').innerHTML = art(CRousty) + `<span class="tagp">${E(price(CRousty))}</span>`;
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
const rvIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); rvIO.unobserve(e.target);
  e.target.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, from = Math.max(0, to - 40), t0 = performance.now();
    if (calm) return;
    const tick = t => { const p = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}), { threshold: .15 });
$$('.rv').forEach(e => rvIO.observe(e));

/* ---------- curseur personnalisé (ordinateur uniquement) ---------- */
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.body.insertAdjacentHTML('beforeend', '<div class="cur cur-ring" aria-hidden="true"><span></span></div><div class="cur cur-dot" aria-hidden="true"></div>');
  const ring = $('.cur-ring'), pt = $('.cur-dot'), lab = ring.firstElementChild;
  const LABELS = [['.item:not(.out)', 'Je veux'], ['#spotPic, .visual', '🔥']];
  let x = -100, y = -100, rx = x, ry = y, raf = 0;
  const loop = () => {
    const k = calm ? 1 : .2;
    rx += (x - rx) * k; ry += (y - ry) * k;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > .2 ? requestAnimationFrame(loop) : 0;
  };
  document.documentElement.classList.add('cc');
  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY;
    pt.style.transform = `translate(${x}px,${y}px)`;
    const t = e.target, field = !!t.closest('input,textarea,select'), click = t.closest('button,a,label,[role=switch]');
    const lb = !field && !click && LABELS.find(([s]) => t.closest(s));
    ring.classList.toggle('on', !field); pt.classList.toggle('on', !field);
    ring.classList.toggle('label', !!lb); if (lb) lab.textContent = lb[1];
    ring.classList.toggle('link', !lb && !!click);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { ring.classList.remove('on'); pt.classList.remove('on'); });
  addEventListener('mousedown', () => ring.classList.add('down'));
  addEventListener('mouseup', () => ring.classList.remove('down'));
}

renderAll();
setInterval(() => { status(); footToday(); }, 60000);
