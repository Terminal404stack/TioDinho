const { chromium } = require('playwright');
const PAGS = ['index','sobre','capoeira-inclusiva','projetos','ajude','contato'].concat(process.argv[2] ? process.argv[2].split(',') : []);
(async () => {
 const b = await chromium.launch(); const achados = [];
 for (const w of [375, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  for (const pg of PAGS) {
   const p = await ctx.newPage(); await p.goto(`http://localhost:8080/${pg}.html`, { waitUntil: 'networkidle' });
   await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); });
   const r = await p.evaluate(() => {
    const out = []; const vis = el => { const s = getComputedStyle(el); const rc = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && rc.width > 0 && rc.height > 0 && !el.closest('[hidden],.visualmente-oculto,dialog:not([open])'); };
    const nome = el => (el.textContent || '').trim() || el.getAttribute('aria-label') || [...el.querySelectorAll('img[alt]')].map(i => i.alt).join('');
    const desc = el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' "' + (el.textContent || '').trim().slice(0, 40) + '"';
    // 1 vazios
    document.querySelectorAll('p,h1,h2,h3,h4,li,a,button,figcaption,dt,dd,label,option').forEach(el => {
      if (!vis(el)) return; if (el.matches('[role=status],[aria-live],.feedback,.campo__erro')) return;
      if (!nome(el) && !el.querySelector('picture,img,svg title,input,select,textarea')) out.push(['vazio', desc(el)]); });
    // 2 seções sem texto
    document.querySelectorAll('main section').forEach(s => { if (vis(s) && !(s.innerText || '').trim()) out.push(['secao-vazia', s.getAttribute('aria-labelledby') || s.className]); });
    // 3 imagens
    const alts = {}; document.querySelectorAll('img').forEach(i => { if (!i.hasAttribute('alt')) out.push(['img-sem-alt', i.src]); else if (i.alt) { alts[i.alt] = (alts[i.alt] || 0) + 1; if (/^(imagem|foto|image|logo)$/i.test(i.alt.trim())) out.push(['alt-generico', i.alt]); } });
    Object.entries(alts).forEach(([a, n]) => { if (n > 1 && !a.startsWith('Logo')) out.push(['alt-duplicado', a.slice(0, 60) + ' x' + n]); });
    // 4 links
    document.querySelectorAll('a').forEach(a => { const h = a.getAttribute('href'); if (h === null || h === '' || h === '#') out.push(['link-sem-destino', desc(a)]); else if (h.startsWith('#') && h.length > 1 && !document.getElementById(h.slice(1))) out.push(['ancora-quebrada', h]); });
    // 5 texto cortado
    document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,dd,dt,label').forEach(el => { if (!vis(el)) return; const s = getComputedStyle(el); if ((s.overflow === 'hidden' || s.textOverflow === 'ellipsis' || s.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 1) out.push(['texto-cortado', desc(el)]); if (el.getBoundingClientRect().right > innerWidth + 1) out.push(['passa-da-tela', desc(el)]); });
    // 6 alvos de toque (WCAG 2.5.8 mínimo 24px; projeto pede 44px), ignora links dentro de parágrafos
    document.querySelectorAll('a,button,input,select,textarea,summary').forEach(el => { if (!vis(el) || el.closest('p') && el.tagName === 'A' && !el.className) return; const rc = el.getBoundingClientRect(); if (rc.height < 44 || rc.width < 24) out.push([rc.height < 24 || rc.width < 24 ? 'alvo<24' : 'alvo<44', desc(el) + ` ${Math.round(rc.width)}x${Math.round(rc.height)}`]); });
    // 7 contraste
    const rgb = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : null; };
    const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const fundo = el => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== 'none' && !s.backgroundImage.includes('gradient')) return null; const c = rgb(s.backgroundColor); if (c && (c[3] === undefined || c[3] > .5)) return c; } return [255, 255, 255]; };
    const vistos = new Set();
    document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,dd,dt,label,figcaption,small,strong,em,b,code').forEach(el => {
      if (!vis(el) || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; if (el.closest('.marca-texto') && el !== el.closest('.marca-texto')) return;
      const s = getComputedStyle(el); const fg = rgb(s.color); let bg = fundo(el); if (el.matches('.marca-texto')) bg = [251, 191, 10]; if (!bg || !fg) return;
      const a = fg[3] === undefined ? 1 : fg[3]; const mix = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
      const L1 = lum(mix), L2 = lum(bg.slice(0, 3)); const cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      const px = parseFloat(s.fontSize), bold = parseInt(s.fontWeight) >= 700; const grande = px >= 24 || (bold && px >= 18.66);
      if (cr < (grande ? 3 : 4.5)) { const k = desc(el); if (!vistos.has(k)) { vistos.add(k); out.push(['contraste', `${k} ${cr.toFixed(2)}:1`]); } } });
    return out; });
   r.forEach(x => achados.push([pg, w, ...x])); await p.close();
  }
 }
 const porTipo = {}; achados.forEach(a => { (porTipo[a[2]] = porTipo[a[2]] || []).push(`${a[0]}@${a[1]}: ${a[3]}`); });
 for (const [t, l] of Object.entries(porTipo)) { console.log(`\n## ${t} (${l.length})`); [...new Set(l)].slice(0, 25).forEach(x => console.log(' - ' + x)); }
 if (!achados.length) console.log('NENHUM ACHADO');
 require('fs').writeFileSync(require('os').tmpdir() + '/auditoria-achados.json', JSON.stringify(porTipo, null, 1));
 await b.close(); })();
