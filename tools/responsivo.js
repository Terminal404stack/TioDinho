// Varredura responsiva: todas as páginas × telas reais de celular, tablet, notebook e desktop.
// Uso: com o site em http://localhost:8080, rode `node tools/responsivo.js [pasta-de-capturas]`.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'http://localhost:8080/';
const PAGINAS = fs.readdirSync(path.join(__dirname, '..')).filter((f) => f.endsWith('.html')).sort();
const TELAS = [
  ['celular', 320, 568], ['celular', 360, 800], ['celular', 375, 667], ['celular', 390, 844], ['celular', 412, 915], ['celular', 430, 932],
  ['celular-deitado', 667, 375], ['celular-deitado', 844, 390], ['celular-deitado', 932, 430],
  ['tablet', 600, 960], ['tablet', 768, 1024], ['tablet', 820, 1180], ['tablet', 834, 1194], ['tablet', 1024, 768], ['tablet', 1024, 1366], ['tablet', 1180, 820],
  ['desktop', 1280, 720], ['desktop', 1366, 768], ['desktop', 1440, 900], ['desktop', 1536, 864], ['desktop', 1680, 1050], ['desktop', 1920, 1080], ['desktop', 2560, 1440], ['desktop', 3440, 1440],
];
const PASTA = process.argv[2] || null;

async function analisar(p) {
  return p.evaluate(() => {
    const achados = [];
    const vis = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0 && !el.closest('[hidden],.visualmente-oculto,dialog:not([open]),.menu-mobile'); };
    const nome = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} "${(el.textContent || el.alt || '').trim().slice(0, 30)}"`;
    const W = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > W + 1) achados.push(['rolagem-lateral', `${document.documentElement.scrollWidth - W}px`]);
    document.querySelectorAll('body *').forEach((el) => {
      if (!vis(el) || el.closest('.pecas,.swoosh-titulo,svg')) return;
      const r = el.getBoundingClientRect();
      if (r.right > W + 1 || r.left < -1) {
        // ignora o que está dentro de contêiner com overflow escondido (molduras, galeria)
        let pai = el.parentElement; let cortado = false;
        while (pai && pai !== document.body) { if (getComputedStyle(pai).overflowX !== 'visible') { cortado = true; break; } pai = pai.parentElement; }
        if (!cortado) achados.push(['sai-da-tela', nome(el)]);
      }
    });
    // texto pequeno demais
    document.querySelectorAll('p,li,a,span,small,figcaption,dd,dt,label,button,h1,h2,h3,h4').forEach((el) => {
      if (!vis(el) || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) achados.push(['fonte<12px', `${nome(el)} ${fs}px`]);
    });
    // imagens distorcidas (sem object-fit cover/contain)
    document.querySelectorAll('img').forEach((img) => {
      if (!vis(img) || !img.naturalWidth) return;
      const fit = getComputedStyle(img).objectFit; if (fit === 'cover' || fit === 'contain') return;
      const r = img.getBoundingClientRect(); const a = r.width / r.height; const n = img.naturalWidth / img.naturalHeight;
      if (Math.abs(a - n) / n > 0.03) achados.push(['imagem-distorcida', `${img.currentSrc.split('/').pop()} ${a.toFixed(2)} vs ${n.toFixed(2)}`]);
      // largura real do arquivo: com srcset em "w", naturalWidth vem dividido pela densidade escolhida
      const fontes = [img.getAttribute('srcset'), ...[...(img.parentElement?.tagName === 'PICTURE' ? img.parentElement.querySelectorAll('source') : [])].map((s) => s.getAttribute('srcset'))].filter(Boolean).join(',');
      const cand = fontes.split(',').map((c) => c.trim().split(/\s+/)).find(([u]) => u && img.currentSrc.endsWith(u.replace(/^\.?\//, '')));
      const largArquivo = cand && /w$/.test(cand[1] || '') ? parseInt(cand[1], 10) : img.naturalWidth;
      if (r.width * devicePixelRatio > largArquivo * 1.02 && !img.closest('.galeria')) achados.push(['imagem-ampliada', `${img.currentSrc.split('/').pop()} ${Math.round(r.width * devicePixelRatio)}px na tela > ${largArquivo}px do arquivo`]);
    });
    // números curtos (01, 1/3…) não podem quebrar em duas linhas
    document.querySelectorAll('[class*="__num"], .grupo-pilares__titulo span').forEach((e) => {
      if (!vis(e)) return; const rg = document.createRange(); rg.selectNodeContents(e);
      if (new Set([...rg.getClientRects()].map((x) => Math.round(x.top))).size > 1) achados.push(['numero-quebrado', nome(e)]);
    });
    // cabeçalho: logo, menu e ações sem sobreposição
    const caixa = (s) => { const e = document.querySelector(s); if (!e || !vis(e)) return null; return e.getBoundingClientRect(); };
    const m = caixa('.marca'), n = caixa('.nav-principal ul'), a = caixa('.cabecalho__acoes');
    const sobrepoe = (x, y) => x && y && x.left < y.right && y.left < x.right && x.top < y.bottom && y.top < x.bottom;
    if (sobrepoe(m, n) || sobrepoe(n, a) || sobrepoe(m, a)) achados.push(['cabecalho-sobreposto', '']);
    // heros: texto e mídia não se sobrepõem
    document.querySelectorAll('.hero__grid, .hero-pagina__grid').forEach((g) => {
      const [t, mid] = g.children; if (!t || !mid || !vis(mid)) return;
      const a1 = t.getBoundingClientRect(), b1 = mid.getBoundingClientRect();
      if (sobrepoe(a1, b1) && Math.min(a1.right, b1.right) - Math.max(a1.left, b1.left) > 4 && Math.min(a1.bottom, b1.bottom) - Math.max(a1.top, b1.top) > 4) achados.push(['hero-sobreposto', '']);
    });
    // linhas longas demais (legibilidade): parágrafos com mais de ~90 caracteres por linha
    document.querySelectorAll('main p').forEach((p) => {
      if (!vis(p)) return; const fs = parseFloat(getComputedStyle(p).fontSize); const cpl = p.getBoundingClientRect().width / (fs * 0.5);
      if (cpl > 95) achados.push(['linha-longa', `${nome(p)} ~${Math.round(cpl)} car.`]);
    });
    // primeira dobra: o primeiro botão do hero deve aparecer sem rolar (exceto celular deitado, só avisa)
    const cta = document.querySelector('.hero .hero__acoes .botao, .hero-pagina .hero__acoes .botao');
    if (cta && vis(cta) && cta.getBoundingClientRect().bottom > innerHeight) achados.push(['cta-abaixo-da-dobra', `${Math.round(cta.getBoundingClientRect().bottom)}px > ${innerHeight}px`]);
    return achados;
  });
}

(async () => {
  const b = await chromium.launch();
  const total = {};
  for (const [tipo, w, h] of TELAS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    for (const pg of PAGINAS) {
      const p = await ctx.newPage();
      const erros = []; p.on('pageerror', (e) => erros.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
      await p.goto(BASE + pg, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } scrollTo(0, 0); });
      await p.waitForTimeout(150);
      const ach = await analisar(p);
      erros.forEach((e) => ach.push(['erro-console', e.slice(0, 120)]));
      ach.forEach(([t, d]) => { (total[t] = total[t] || new Set()).add(`${pg} @${tipo} ${w}x${h}: ${d}`); });
      if (PASTA && ['index.html'].includes(pg)) await p.screenshot({ path: path.join(PASTA, `${tipo}-${w}x${h}-${pg.replace('.html', '')}.png`) });
      await p.close();
    }
    await ctx.close();
  }
  // modos especiais: texto em 200% e alto contraste
  const especiais = [
    ['texto-200%', { viewport: { width: 390, height: 844 } }, async (p) => p.addStyleTag({ content: 'html{font-size:200%!important}' })],
    ['alto-contraste', { viewport: { width: 1440, height: 900 }, forcedColors: 'active' }, null],
    ['tema-escuro', { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' }, null],
  ];
  for (const [nomeModo, opt, prep] of especiais) {
    const ctx = await b.newContext({ ...opt, reducedMotion: 'reduce' });
    for (const pg of PAGINAS) {
      const p = await ctx.newPage(); await p.goto(BASE + pg, { waitUntil: 'networkidle' }); if (prep) await prep(p);
      const ach = await analisar(p);
      if (nomeModo === 'alto-contraste') {
        await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
        const foco = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2; });
        if (!foco) ach.push(['foco-invisivel', '']);
      }
      ach.filter(([t]) => !['linha-longa', 'cta-abaixo-da-dobra', 'fonte<12px'].includes(t) || nomeModo !== 'texto-200%')
        .forEach(([t, d]) => { (total[t] = total[t] || new Set()).add(`${pg} @${nomeModo}: ${d}`); });
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  let n = 0;
  for (const [t, s] of Object.entries(total)) { console.log(`\n## ${t} (${s.size})`); [...s].slice(0, 40).forEach((x) => console.log(' - ' + x)); n += s.size; }
  console.log(`\nTELAS ${TELAS.length} × PÁGINAS ${PAGINAS.length} + 3 modos · ACHADOS ${n}`);
})();
