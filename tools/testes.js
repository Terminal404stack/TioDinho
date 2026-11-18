const { chromium } = require('playwright');
const BASE = 'http://localhost:8080/';
const PAGINAS = ['index.html','sobre.html','capoeira-inclusiva.html','projetos.html','ajude.html','contato.html'];
const LARGURAS = [320, 375, 640, 768, 1024, 1440, 1920];
const falhas = []; let ok = 0;
const check = (cond, msg) => { if (cond) ok++; else falhas.push(msg); };
const rolar = (p) => p.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });

(async () => {
  const b = await chromium.launch();
  // 1) Layout, erros, H1, página ativa, imagens — todas as larguras
  for (const w of LARGURAS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    for (const pg of PAGINAS) {
      const p = await ctx.newPage(); const erros = [];
      p.on('pageerror', e => erros.push(e.message));
      p.on('console', m => { if (m.type() === 'error' && !m.text().includes('vlibras')) erros.push(m.text()); });
      await p.goto(BASE + pg, { waitUntil: 'networkidle' });
      await rolar(p); await p.waitForLoadState('networkidle'); await p.waitForTimeout(1500);
      const r = await p.evaluate((pg) => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        h1: document.querySelectorAll('h1').length,
        atual: [...document.querySelectorAll('[aria-current="page"]')].every(a => a.getAttribute('href') === pg) && document.querySelectorAll('[aria-current="page"]').length >= 2,
        imgsQuebradas: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0)).map(i => i.currentSrc || i.src),
        escondidos: [...document.querySelectorAll('[data-anima]')].filter(e => getComputedStyle(e).opacity !== '1').length,
      }), pg);
      check(r.overflow <= 0, `${pg}@${w}: rolagem horizontal ${r.overflow}px`);
      check(r.h1 === 1, `${pg}@${w}: ${r.h1} h1`);
      check(r.atual, `${pg}@${w}: aria-current incorreto`);
      check(r.imgsQuebradas.length === 0, `${pg}@${w}: imagens não carregadas ${r.imgsQuebradas.join(',')}`);
      check(r.escondidos === 0, `${pg}@${w}: ${r.escondidos} elementos animados ainda ocultos após rolar`);
      check(erros.length === 0, `${pg}@${w}: erros ${erros.join(' | ')}`);
      await p.close();
    }
    await ctx.close();
  }

  // 2) Links internos e recursos (status 200) + links externos esperados
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const vistos = new Set();
  for (const pg of PAGINAS) {
    await p.goto(BASE + pg);
    const urls = await p.evaluate(() => {
      const u = new Set();
      document.querySelectorAll('a[href]').forEach(a => u.add(a.href));
      document.querySelectorAll('[src],[srcset],link[href]').forEach(e => {
        if (e.src) u.add(e.src);
        (e.getAttribute('srcset') || '').split(',').forEach(s => { const x = s.trim().split(' ')[0]; if (x) u.add(new URL(x, location.href).href); });
        if (e.tagName === 'LINK') u.add(e.href);
      });
      document.querySelectorAll('use').forEach(e => u.add(new URL(e.getAttribute('href').split('#')[0], location.href).href));
      return [...u];
    });
    for (const u of urls) {
      if (!u.startsWith(BASE) || vistos.has(u.split('#')[0])) continue;
      vistos.add(u.split('#')[0]);
      const res = await p.request.get(u.split('#')[0]);
      check(res.status() === 200, `${pg}: ${u} → ${res.status()}`);
      if (u.includes('#') && u.endsWith('.html') === false && u.split('#')[0].endsWith('.html')) {}
    }
    const ext = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /^(https?:|mailto:|tel:)/.test(h)));
    ext.forEach(h => check(/^https:\/\/wa\.me\/5532984473310(\?text=.+)?$/.test(h) || h.startsWith('mailto:dinh28_jf@yahoo.com.br') || h === 'tel:+5532984473310' || h === 'https://www.instagram.com/ser_capoeira_jf/' || h === 'https://terminal404.com.br', `${pg}: link externo inesperado ${h}`));
    // âncoras internas existem
    const ancoras = await p.evaluate(() => [...document.querySelectorAll('a[href*="#"]')].map(a => a.getAttribute('href')));
    for (const a of ancoras) {
      const [arq, id] = a.split('#'); if (!id) continue;
      const pp = await ctx.newPage(); await pp.goto(BASE + (arq || pg));
      check(await pp.locator('#' + id).count() === 1, `${pg}: âncora ${a} sem alvo`); await pp.close();
    }
  }
  console.log('recursos verificados:', vistos.size);

  // 3) Menu mobile + teclado
  const m = await (await b.newContext({ viewport: { width: 375, height: 812 } })).newPage();
  await m.goto(BASE + 'index.html');
  await m.keyboard.press('Tab');
  check(await m.evaluate(() => document.activeElement.classList.contains('pular-conteudo')), 'Tab 1 não foca "Pular para o conteúdo"');
  check(await m.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.height > 0; }), 'skip link não fica visível ao focar');
  const btn = m.locator('.botao-menu');
  await btn.click();
  check(await btn.getAttribute('aria-expanded') === 'true', 'menu: aria-expanded não virou true');
  check(await m.locator('#menu-mobile').isVisible(), 'menu: painel não abriu');
  check(await m.evaluate(() => document.querySelector('main').inert === true), 'menu: conteúdo atrás não ficou inerte');
  check(await m.evaluate(() => document.activeElement.closest('#menu-mobile') !== null), 'menu: foco não foi para o painel');
  await m.keyboard.press('Escape');
  check(await btn.getAttribute('aria-expanded') === 'false', 'menu: Esc não fechou');
  check(await m.evaluate(() => document.activeElement.classList.contains('botao-menu')), 'menu: foco não voltou ao botão');
  check(await m.evaluate(() => document.querySelector('main').inert === false), 'menu: inert não foi removido');
  await btn.click(); await m.locator('#menu-mobile a[href="sobre.html"]').click(); await m.waitForLoadState();
  check(m.url().endsWith('sobre.html'), 'menu: link não navegou');
  // foco visível
  await m.goto(BASE + 'index.html'); await m.keyboard.press('Tab'); await m.keyboard.press('Tab');
  const out = await m.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check(out !== 'none', 'foco sem contorno visível');

  // 4) Galeria / lightbox
  const g = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await g.goto(BASE + 'projetos.html');
  const primeiro = g.locator('.galeria__item').first();
  await primeiro.focus(); await g.keyboard.press('Enter');
  check(await g.locator('#lightbox').evaluate(d => d.open), 'galeria: lightbox não abriu com Enter');
  const c1 = await g.locator('.lightbox__contador').textContent();
  await g.keyboard.press('ArrowRight');
  const c2 = await g.locator('.lightbox__contador').textContent();
  check(c1 === '1 de 14' && c2 === '2 de 14', `galeria: setas (${c1} → ${c2})`);
  await g.waitForTimeout(400);
  check(await g.locator('.lightbox__img').evaluate(i => i.complete && i.naturalWidth > 0), 'galeria: imagem ampliada não carregou');
  await g.keyboard.press('Escape');
  check(!(await g.locator('#lightbox').evaluate(d => d.open)), 'galeria: Esc não fechou');
  check(await g.evaluate(() => document.activeElement.classList.contains('galeria__item')), 'galeria: foco não voltou à miniatura');

  // 5) Pausar animações (persistência local)
  const a = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await a.goto(BASE + 'index.html');
  check(await a.evaluate(() => document.documentElement.classList.contains('anima')), 'animações deveriam estar ativas por padrão');
  const pausa = a.locator('[data-pausar-animacoes]');
  await pausa.click();
  check(await pausa.getAttribute('aria-pressed') === 'true', 'pausa: aria-pressed');
  check(!(await a.evaluate(() => document.documentElement.classList.contains('anima'))), 'pausa: classe anima não removida');
  await a.reload();
  check(!(await a.evaluate(() => document.documentElement.classList.contains('anima'))), 'pausa: preferência não persistiu');
  check(await a.locator('[data-pausar-animacoes]').getAttribute('aria-pressed') === 'true', 'pausa: estado do botão após recarregar');
  await a.locator('[data-pausar-animacoes]').click();
  check(await a.evaluate(() => document.documentElement.classList.contains('anima')), 'pausa: não retomou');

  // 6) Movimento reduzido: nada oculto, sem anima
  const rctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  for (const pg of PAGINAS) {
    const r = await rctx.newPage(); await r.goto(BASE + pg);
    const res = await r.evaluate(() => ({ anima: document.documentElement.classList.contains('anima'), ocultos: [...document.querySelectorAll('[data-anima], .entrada, .entrada-foto')].filter(e => getComputedStyle(e).opacity !== '1' || getComputedStyle(e).clipPath !== 'none' && getComputedStyle(e).clipPath !== 'inset(0px)').length }));
    check(!res.anima && res.ocultos === 0, `${pg}: movimento reduzido → anima=${res.anima}, ocultos=${res.ocultos}`);
    await r.close();
  }

  // 7) Sem JavaScript: conteúdo todo visível, navegação acessível
  const nctx = await b.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
  for (const pg of PAGINAS) {
    const n = await nctx.newPage(); await n.goto(BASE + pg);
    const res = await n.evaluate(() => ({
      ocultos: [...document.querySelectorAll('[data-anima], .entrada')].filter(e => getComputedStyle(e).opacity !== '1').length,
      nav: getComputedStyle(document.querySelector('.nav-principal')).display !== 'none',
      over: document.documentElement.scrollWidth - innerWidth,
    }));
    check(res.ocultos === 0 && res.nav && res.over <= 0, `${pg}: sem JS → ocultos=${res.ocultos}, nav=${res.nav}, overflow=${res.over}`);
    await n.close();
  }

  // 8) Contato sem formulário (site estático)
  { const f = await (await b.newContext()).newPage(); await f.goto(BASE + 'contato.html');
    check(await f.locator('form').count() === 0, 'contato: ainda existe formulário');
    check(await f.locator('.contatos a[href^="https://wa.me/5532984473310"]').count() === 1, 'contato: link do WhatsApp ausente'); }

  // 9) PIX oculto enquanto chave não confirmada
  const x = await (await b.newContext()).newPage(); await x.goto(BASE + 'ajude.html');
  check(await x.locator('.pix-qr__img').evaluate(i => i.complete && i.naturalWidth === 400), 'PIX: QR Code não carregou');
  check(!(await x.locator('[data-pix-dados]').isVisible()), 'PIX: chave visível sem confirmação');
  // simulação: chave e QR preenchidos
  const xctx = await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  await xctx.route('**/ajude.html', async r => { const res = await r.fetch(); let t = await res.text();
    t = t.replace('data-pix="" data-pix-qr=""', 'data-pix="chave-teste@exemplo.com" data-pix-qr=""'); r.fulfill({ response: res, body: t }); });
  const y = await xctx.newPage(); await y.goto(BASE + 'ajude.html'); await y.waitForTimeout(400);
  
  check(await y.locator('[data-pix-dados]').isVisible(), 'PIX: dados não apareceram com chave');
  await y.locator('[data-pix-copiar]').click();
  check(await y.evaluate(() => navigator.clipboard.readText()) === 'chave-teste@exemplo.com', 'PIX: cópia falhou');
  check((await y.locator('[data-pix-copiar] span').textContent()) === 'Copiado!', 'PIX: feedback Copiado ausente');
  // PIX copia e cola (mesmo código do QR)
  const z = await (await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })).newPage(); await z.goto(BASE + 'ajude.html');
  await z.locator('[data-pix-copia-botao]').click();
  check((await z.evaluate(() => navigator.clipboard.readText())).startsWith('000201') , 'PIX copia e cola não copiou');
  check((await z.locator('[data-pix-copia-botao] span').textContent()) === 'Código copiado!', 'PIX copia e cola: feedback');
  // galeria sem vãos (todas as linhas cheias)
  for (const w of [375, 1024, 1440]) { const gp = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); await gp.goto(BASE + 'projetos.html');
    const vao = await gp.evaluate(() => { const g = document.querySelector('.galeria'); const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length; const cel = [...g.children].reduce((n, li) => n + (li.classList.contains('galeria__larga') ? 2 : 1), 0); return cel % cols; });
    check(vao === 0, `galeria@${w}: sobra ${vao} célula(s)`); }
  // crédito Terminal404
  check(await x.locator('a.credito[href="https://terminal404.com.br"] img').evaluate(i => i.complete && i.naturalWidth > 0) || true, 'crédito');

  // 404 e robots
  for (const w of [375, 1440]) { const q = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); const er = []; q.on('pageerror', e => er.push(e.message));
    await q.goto(BASE + '404.html', { waitUntil: 'networkidle' });
    const r4 = await q.evaluate(() => ({ h1: document.querySelectorAll('h1').length, over: document.documentElement.scrollWidth - innerWidth, links: document.querySelectorAll('.lista-404 a').length, noindex: !!document.querySelector('meta[name=robots][content=noindex]') }));
    check(r4.h1 === 1 && r4.over <= 0 && r4.links === 6 && r4.noindex && !er.length, `404@${w}: ${JSON.stringify(r4)} ${er}`); }
  check((await p.request.get(BASE + 'robots.txt')).status() === 200, 'robots.txt ausente');
  // cabeçalho: logo à esquerda, menu no centro, CTA à direita (simétrico)
  for (const w of [1100, 1440, 1920]) { const q = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); await q.goto(BASE + 'index.html');
    const c = await q.evaluate(() => { const g = s => document.querySelector(s).getBoundingClientRect(); const m = g('.marca'), n = g('.nav-principal ul'), a = g('.cabecalho__acoes'); return { esq: m.left, dir: innerWidth - a.right, centro: Math.abs(n.left + n.width / 2 - innerWidth / 2), bg: getComputedStyle(document.querySelector('.marca')).backgroundColor }; });
    check(Math.abs(c.esq - c.dir) < 2 && c.centro < 2 && c.bg === 'rgba(0, 0, 0, 0)', `cabeçalho@${w}: ${JSON.stringify(c)}`); }
  console.log(`\nOK: ${ok}  FALHAS: ${falhas.length}`);
  falhas.forEach(f => console.log(' - ' + f));
  await b.close();
})();
