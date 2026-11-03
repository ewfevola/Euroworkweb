// Costruisce il sito EUROWORK (cartella "dist") a partire da contenuti/sito.json.
// Netlify lo esegue da solo a ogni modifica salvata dal pannello Pages CMS.
// Per provarlo sul computer: node build.js  (poi apri dist/index.html)

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'contenuti', 'sito.json'), 'utf8'));

// ---------- utilità ----------
const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const br = (v) => esc(v).replace(/\r?\n/g, '<br>');
const lista = (v) => (Array.isArray(v) ? v : []);
// Percorsi immagine: il pannello salva "/img/foto.jpg", il sito usa "img/foto.jpg"
const img = (p) => esc(String(p || '').replace(/^\/+/, ''));
const tel = (n) => {
  let x = String(n || '').replace(/[^\d+]/g, '');
  if (x && !x.startsWith('+')) x = '+39' + x;
  return x;
};
const inquadra = { alto: 'center 20%', centro: 'center', basso: 'center 80%' };

// ---------- icone ----------
const ICONE = {
  barriere: '<path d="M2 8l3-2 3 2 3-2 3 2 3-2 3 2 2-1"/><path d="M2 13l3-2 3 2 3-2 3 2 3-2 3 2 2-1"/><path d="M5 13v8M19 13v8"/>',
  segnaletica: '<rect x="4" y="3" width="16" height="10" rx="2"/><path d="M8 8h7M13 6l2 2-2 2M12 13v8"/>',
  fotovoltaico: '<path d="M3 14l18-5v3L3 17z"/><path d="M7 16v5M17 11v10"/><circle cx="18" cy="4" r="1.5"/>',
  antirumore: '<path d="M3 21V4M12 21V4M21 21V4"/><path d="M3 8h18M3 12h18M3 16h18"/>',
  strade: '<path d="M2 9h20M2 12h20"/><path d="M5 12v9M19 12v9"/><path d="M5 21c2-5 4-7 7-7s5 2 7 7"/>',
  guardiania: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  edilizia: '<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
  mezzi: '<path d="M3 17h13V9H3z"/><path d="M16 12h3l2 3v2h-5"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
};
const icona = (nome, colore) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="${colore}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONE[nome] || ICONE.barriere}</svg>`;
const SPUNTA = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#aa2b0a" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
const MEDAGLIA = (c) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-3 5 3-1.5-7.5"/></svg>`;

const a = d.apertura || {}, sv = d.servizi || {}, cs = d.chi_siamo || {}, es = d.esperienza || {};
const lv = d.lavori || {}, g = d.galleria || {}, q = d.qualificazioni || {}, c = d.contatti || {}, ds = d.dati_societari || {};
const fotoGalleria = lista(g.foto).filter((f) => f && f.immagine);

// ---------- pagina ----------
const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.seo?.titolo)}</title>
<meta name="description" content="${esc(d.seo?.descrizione)}">
<link rel="icon" type="image/png" href="img/favicon.png">
<meta name="theme-color" content="#aa2b0a">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="stile.css">
</head>
<body>

<header id="header">
  <div class="wrap nav">
    <a href="#" class="logo" aria-label="EUROWORK, torna all'inizio"><img src="img/logo.png" alt="EUROWORK" width="100" height="54"></a>
    <button class="menu" aria-expanded="false" aria-controls="menu" onclick="const u=document.getElementById('menu');this.setAttribute('aria-expanded',u.classList.toggle('aperto'))">Menu</button>
    <nav><ul id="menu" onclick="this.classList.remove('aperto')">
      <li><a href="#servizi">Servizi</a></li>
      <li><a href="#storia">Chi siamo</a></li>
      <li><a href="#esperienza">Esperienza</a></li>
      <li><a href="#lavori">Lavori</a></li>
      ${fotoGalleria.length ? '<li><a href="#galleria">Galleria</a></li>' : ''}
      <li><a href="#contatti" class="btn">Contattaci</a></li>
    </ul></nav>
  </div>
</header>

<main>
<div class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="pill">${esc(a.etichetta)}</span>
      <h1>${esc(a.titolo)}</h1>
      <p>${br(a.testo)}</p>
      <div class="azioni">
        <a href="#contatti" class="btn">Contattaci</a>
        <a href="#servizi" class="btn btn-chiaro">Scopri i servizi</a>
      </div>
    </div>
    <div class="hero-foto" role="img" aria-label="${esc(a.descrizione_foto)}" style="background-image:url('${img(a.foto)}')">
      ${a.badge_alto_titolo ? `<div class="badge b"><div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#aa2b0a" stroke-width="2" stroke-linecap="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg></div><div><b>${esc(a.badge_alto_titolo)}</b><span>${esc(a.badge_alto_testo)}</span></div></div>` : ''}
      ${a.badge_basso_titolo ? `<div class="badge a"><div class="ico">${MEDAGLIA('#aa2b0a')}</div><div><b>${esc(a.badge_basso_titolo)}</b><span>${esc(a.badge_basso_testo)}</span></div></div>` : ''}
    </div>
  </div>
</div>

<div class="wrap">
  <div class="numeri">
    ${lista(d.numeri).map((n) => `<div class="numero"><b>${esc(n.valore)}</b><span>${esc(n.descrizione)}</span></div>`).join('\n    ')}
  </div>
</div>

<section id="servizi">
  <div class="wrap">
    <div class="testa">
      <span class="pill">Servizi</span>
      <h2>${esc(sv.titolo)}</h2>
      <p>${br(sv.testo)}</p>
    </div>
    <div class="servizi">
      ${lista(sv.elenco).map((s) => `<div class="serv${s.in_evidenza ? ' principale' : ''}">
        <div class="ico">${icona(s.icona, s.in_evidenza ? '#fff' : '#aa2b0a')}</div>
        <h3>${esc(s.titolo)}</h3>
        <p>${br(s.testo)}</p>
      </div>`).join('\n      ')}
    </div>
    ${lista(sv.altri).length ? `<div class="altri">
      ${lista(sv.altri).map((gr) => `<details>
        <summary>${esc(gr.titolo)}</summary>
        <ul>${lista(gr.voci).map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
      </details>`).join('\n      ')}
    </div>` : ''}
  </div>
</section>

<section id="storia" class="storia-sez">
  <div class="wrap storia">
    <div class="testa">
      <span class="pill">Chi siamo</span>
      <h2>${esc(cs.titolo)}</h2>
      ${lista(cs.paragrafi).map((p) => `<p>${br(p)}</p>`).join('\n      ')}
      <div class="persone">
        ${lista(cs.persone).map((p) => `<div class="persona"><b>${esc(p.nome)}</b><span>${esc(p.ruolo)}</span></div>`).join('\n        ')}
      </div>
    </div>
    <ol class="timeline">
      ${lista(cs.tappe).map((t) => `<li${t.in_evidenza ? ' class="oggi"' : ''}><div class="punto">${esc(t.sigla)}</div><div class="card"><span class="anno">${esc(t.anno)}</span><h3>${esc(t.titolo)}</h3><p>${br(t.testo)}</p></div></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section id="esperienza">
  <div class="wrap esp">
    <div class="testa" style="margin-bottom:0">
      <span class="pill">Esperienza</span>
      <h2>${esc(es.titolo)}</h2>
      <p>${br(es.testo)}</p>
      ${lista(es.clienti).length ? `<div class="clienti">
        <p>${esc(es.clienti_titolo)}</p>
        <div class="loghi">${lista(es.clienti).map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      </div>` : ''}
      ${es.premio_titolo ? `<div class="premio">
        <div class="ico">${MEDAGLIA('#fff')}</div>
        <div><b>${esc(es.premio_titolo)}</b><br><span>${esc(es.premio_testo)}</span></div>
      </div>` : ''}
    </div>
    <div class="tratte" id="tratte">
      ${lista(es.tratte).map((t) => {
        const b = Math.max(0, Math.min(100, Number(t.barra) || 0));
        return `<div class="tratta"><div class="riga"><b>${esc(t.nome)}</b><strong>${esc(t.valore)}</strong></div>${b ? `<div class="barra"><i style="--l:${b}%"></i></div>` : ''}</div>`;
      }).join('\n      ')}
    </div>
  </div>
</section>

<section id="lavori" class="lavori-sez">
  <div class="wrap">
    <div class="testa">
      <span class="pill">Lavori</span>
      <h2>${esc(lv.titolo)}</h2>
    </div>
    <div class="lavori">
      ${lista(lv.elenco).map((l) => `<article class="lavoro"><img class="foto" src="${img(l.foto)}" alt="${esc(l.titolo)}" loading="lazy" style="object-position:${inquadra[l.inquadratura] || 'center'}"><div class="txt"><span class="tag">${esc(l.titolo)}</span></div></article>`).join('\n      ')}
    </div>
  </div>
</section>

${fotoGalleria.length ? `<section id="galleria">
  <div class="wrap">
    <div class="testa">
      <span class="pill">Galleria</span>
      <h2>${esc(g.titolo)}</h2>
      ${g.testo ? `<p>${br(g.testo)}</p>` : ''}
    </div>
    <div class="galleria" data-auto="${g.scorrimento_automatico ? '1' : '0'}" aria-roledescription="carosello" aria-label="Galleria foto">
      <div class="slides" tabindex="0">
        ${fotoGalleria.map((f, i) => `<figure class="slide" aria-roledescription="foto" aria-label="${i + 1} di ${fotoGalleria.length}">
          <div class="sfondo" style="background-image:url('${img(f.immagine)}')"></div>
          <img src="${img(f.immagine)}" alt="${esc(f.didascalia || 'Foto di un cantiere EUROWORK')}" loading="${i ? 'lazy' : 'eager'}">
          ${f.didascalia ? `<figcaption>${esc(f.didascalia)}</figcaption>` : ''}
        </figure>`).join('\n        ')}
      </div>
      ${fotoGalleria.length > 1 ? `<button class="freccia prec" aria-label="Foto precedente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button class="freccia succ" aria-label="Foto successiva"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="puntini">${fotoGalleria.map((_, i) => `<button aria-label="Vai alla foto ${i + 1}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div>` : ''}
    </div>
  </div>
</section>` : ''}

<section>
  <div class="wrap">
    <div class="testa">
      <span class="pill">Qualificazioni</span>
      <h2>${esc(q.titolo)}</h2>
    </div>
    <div class="qual">
      ${lista(q.elenco).map((x) => `<div class="q"><div class="ico">${SPUNTA}</div><div><b>${esc(x.titolo)}</b><span>${esc(x.testo)}</span></div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section id="contatti" style="padding-top:0">
  <div class="wrap">
    <div class="cta">
      <div>
        <h2>${esc(c.titolo_riquadro)}</h2>
        <p>${br(c.testo_riquadro)}</p>
      </div>
      <div class="azioni">
        ${c.email ? `<a class="btn" href="mailto:${esc(c.email)}?subject=Richiesta%20informazioni">Scrivici</a>` : ''}
        ${c.telefono ? `<a class="btn btn-linea" href="tel:${tel(c.telefono)}">Chiamaci</a>` : ''}
      </div>
    </div>
    <div class="contatti">
      <div class="contatto"><small>Sede legale</small><p>${esc(c.indirizzo)}<br>${esc(c.cap_citta)}</p></div>
      <div class="contatto"><small>Telefono e fax</small><p>${c.telefono ? `<a href="tel:${tel(c.telefono)}">${esc(c.telefono)}</a>` : ''}${c.cellulare ? `<br><a href="tel:${tel(c.cellulare)}">${esc(c.cellulare)}</a> (cell.)` : ''}</p></div>
      <div class="contatto"><small>${c.pec ? 'Email e PEC' : 'Email'}</small><p>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}${c.pec ? `<br>${esc(c.pec)}` : ''}</p></div>
      ${c.orari ? `<div class="contatto"><small>Orari</small><p>${br(c.orari)}</p></div>` : ''}
    </div>
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <span class="marchio"><img src="img/logo.png" alt="" width="55" height="30"><span>© <span id="anno"></span> ${esc(ds.ragione_sociale)} · P.IVA e C.F. ${esc(ds.piva_cf)} · REA ${esc(ds.rea)} · ${esc(ds.camera_commercio)}</span></span>
  </div>
</footer>

<script>
  document.getElementById('anno').textContent=new Date().getFullYear();
  const h=document.getElementById('header');
  addEventListener('scroll',()=>h.classList.toggle('ombra',scrollY>10),{passive:true});
  const t=document.getElementById('tratte');
  if(t){ if('IntersectionObserver' in window){
    new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){t.classList.add('visibile');o.disconnect()}},{threshold:.3}).observe(t);
  } else t.classList.add('visibile'); }

  // Slideshow della galleria
  document.querySelectorAll('.galleria').forEach(gal=>{
    const box=gal.querySelector('.slides'), slides=[...box.children], dots=[...gal.querySelectorAll('.puntini button')];
    if(slides.length<2) return;
    let i=0, timer=null;
    const vai=n=>{ i=(n+slides.length)%slides.length; box.scrollTo({left:slides[i].offsetLeft,behavior:'smooth'}); };
    gal.querySelector('.prec').onclick=()=>{vai(i-1);ferma()};
    gal.querySelector('.succ').onclick=()=>{vai(i+1);ferma()};
    dots.forEach((d,n)=>d.onclick=()=>{vai(n);ferma()});
    box.addEventListener('scroll',()=>{
      const n=Math.round(box.scrollLeft/box.clientWidth);
      if(n!==i){ i=n; }
      dots.forEach((d,k)=>d.setAttribute('aria-current',k===n?'true':'false'));
    },{passive:true});
    box.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){vai(i+1);ferma()} if(e.key==='ArrowLeft'){vai(i-1);ferma()} });
    const ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function parti(){ if(gal.dataset.auto==='1' && !ridotto && !timer) timer=setInterval(()=>vai(i+1),5000); }
    function ferma(){ clearInterval(timer); timer=null; }
    gal.addEventListener('mouseenter',ferma); gal.addEventListener('mouseleave',parti);
    gal.addEventListener('touchstart',ferma,{passive:true});
    parti();
  });
</script>
</body>
</html>
`;

// ---------- scrittura ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync(path.join(ROOT, 'stile.css'), path.join(OUT, 'stile.css'));
fs.cpSync(path.join(ROOT, 'img'), path.join(OUT, 'img'), { recursive: true });
console.log('Sito costruito in dist/');
