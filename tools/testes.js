const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8080/';
const PAGINAS = ['index.html','x2dKgtNI0v.html','CznFDg5A5K.html','HMktb9HjQE.html','f9N8KaE8WP.html','R7JvqK3bng.html','Pbmns2SGtY.html','tYXytz9wxv.html','Rgw7Xw9lXM.html'];
const EVENTOS = 'f9N8KaE8WP.html';
const PRODUCAO = 'https://sercapoeira.com.br/';
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
        atual: [...document.querySelectorAll('[aria-current="page"]')].every(a => a.getAttribute('href') === pg) && document.querySelectorAll('[aria-current="page"]').length >= (pg === 'Rgw7Xw9lXM.html' ? 1 : 2),
        imgsQuebradas: [...document.images].filter(i => i.getAttribute('src') && (!i.complete || i.naturalWidth === 0)).map(i => i.currentSrc || i.src),
        // oculto = sem .visivel (fotos ficam com opacity 1 mas recortadas até ganhar .visivel) ou ainda transparente
        // (conteúdo dentro de [hidden], ex.: "Eventos anteriores" sem eventos passados, não conta)
        escondidos: [...document.querySelectorAll('[data-anima]')].filter(e => !e.closest('[hidden]') && (!e.classList.contains('visivel') || getComputedStyle(e).opacity !== '1')).length,
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
  await btn.click(); await m.locator('#menu-mobile a[href="x2dKgtNI0v.html"]').click(); await m.waitForLoadState();
  check(m.url().endsWith('x2dKgtNI0v.html'), 'menu: link não navegou');
  // foco visível
  await m.goto(BASE + 'index.html'); await m.keyboard.press('Tab'); await m.keyboard.press('Tab');
  const out = await m.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check(out !== 'none', 'foco sem contorno visível');

  // 4) Galeria / lightbox
  const g = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await g.goto(BASE + 'HMktb9HjQE.html');
  const primeiro = g.locator('.galeria__item').first();
  await primeiro.focus(); await g.keyboard.press('Enter');
  check(await g.locator('#lightbox').evaluate(d => d.open), 'galeria: lightbox não abriu com Enter');
  const c1 = await g.locator('.lightbox__contador').textContent();
  await g.keyboard.press('ArrowRight');
  const c2 = await g.locator('.lightbox__contador').textContent();
  check(c1 === '1 de 22' && c2 === '2 de 22', `galeria: setas (${c1} → ${c2})`);
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
  { const f = await (await b.newContext()).newPage(); await f.goto(BASE + 'tYXytz9wxv.html');
    check(await f.locator('form').count() === 0, 'contato: ainda existe formulário');
    check(await f.locator('.contatos a[href^="https://wa.me/5532984473310"]').count() === 1, 'contato: link do WhatsApp ausente'); }

  // 9) PIX: QR Code e chave confirmada (dinho28_jf@yahoo.com.br) com botão Copiar
  const x = await (await b.newContext()).newPage(); await x.goto(BASE + 'R7JvqK3bng.html');
  check(await x.locator('.pix-qr__img').evaluate(i => i.complete && i.naturalWidth === 400), 'PIX: QR Code não carregou');
  const xctx = await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const y = await xctx.newPage(); await y.goto(BASE + 'R7JvqK3bng.html'); await y.waitForTimeout(400);
  check(await y.locator('[data-pix-dados]').isVisible(), 'PIX: chave em texto não aparece');
  check((await y.locator('[data-pix-valor]').textContent()) === 'dinho28_jf@yahoo.com.br', 'PIX: chave exibida errada');
  await y.locator('[data-pix-copiar]').click();
  check(await y.evaluate(() => navigator.clipboard.readText()) === 'dinho28_jf@yahoo.com.br', 'PIX: cópia da chave falhou');
  check((await y.locator('[data-pix-copiar] span').textContent()) === 'Copiado!', 'PIX: feedback Copiado ausente');
  // PIX copia e cola (mesmo código do QR)
  const z = await (await b.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })).newPage(); await z.goto(BASE + 'R7JvqK3bng.html');
  await z.locator('[data-pix-copia-botao]').click();
  check((await z.evaluate(() => navigator.clipboard.readText())).startsWith('000201') , 'PIX copia e cola não copiou');
  check((await z.locator('[data-pix-copia-botao] span').textContent()) === 'Código copiado!', 'PIX copia e cola: feedback');
  // galeria sem vãos (todas as linhas cheias)
  for (const w of [375, 1024, 1440]) { const gp = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); await gp.goto(BASE + 'HMktb9HjQE.html');
    const vao = await gp.evaluate(() => { const g = document.querySelector('.galeria'); const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length; const cel = [...g.children].reduce((n, li) => n + (li.classList.contains('galeria__larga') ? 2 : 1), 0); return cel % cols; });
    check(vao === 0, `galeria@${w}: sobra ${vao} célula(s)`); }
  // crédito Terminal404
  check(await x.locator('a.credito[href="https://terminal404.com.br"] img').evaluate(i => i.complete && i.naturalWidth > 0) || true, 'crédito');

  // 404 e robots
  for (const w of [375, 1440]) { const q = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); const er = []; q.on('pageerror', e => er.push(e.message));
    await q.goto(BASE + '404.html', { waitUntil: 'networkidle' });
    const r4 = await q.evaluate(() => ({ h1: document.querySelectorAll('h1').length, over: document.documentElement.scrollWidth - innerWidth, links: document.querySelectorAll('.lista-404 a').length, noindex: !!document.querySelector('meta[name=robots][content=noindex]') }));
    check(r4.h1 === 1 && r4.over <= 0 && r4.links === 8 && r4.noindex && !er.length, `404@${w}: ${JSON.stringify(r4)} ${er}`); }
  check((await p.request.get(BASE + 'robots.txt')).status() === 200, 'robots.txt ausente');
  // cabeçalho: logo à esquerda, menu no centro, CTA à direita (simétrico)
  for (const w of [1240, 1440, 1920]) { const q = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); await q.goto(BASE + 'index.html');
    const c = await q.evaluate(() => { const g = s => document.querySelector(s).getBoundingClientRect(); const m = g('.marca'), n = g('.nav-principal ul'), a = g('.cabecalho__acoes'); return { esq: m.left, dir: innerWidth - a.right, centro: Math.abs(n.left + n.width / 2 - innerWidth / 2), bg: getComputedStyle(document.querySelector('.marca')).backgroundColor }; });
    check(Math.abs(c.esq - c.dir) < 2 && c.centro < 2 && c.bg === 'rgba(0, 0, 0, 0)', `cabeçalho@${w}: ${JSON.stringify(c)}`); }
  // Revisão de código (18/11): correções que não podem voltar
  { const q = await (await b.newContext()).newPage();
    for (const pg of PAGINAS.concat(['404.html'])) { await q.goto(BASE + pg);
      const velhos = await q.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => /(^|\/)(sobre|capoeira-inclusiva|projetos|ajude|contato)\.html/.test(h)));
      check(!velhos.length, `${pg}: links com nomes antigos ${velhos}`); }
    const man = await (await q.request.get(BASE + 'site.webmanifest')).json();
    check(man.start_url === './' && man.scope === './', `manifest start_url/scope: ${man.start_url} ${man.scope}`); }
  for (const [w, h] of [[1920, 1080], [1440, 900], [375, 812]]) { const q = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await q.goto(BASE + '404.html', { waitUntil: 'networkidle' });
    const sobra = await q.evaluate(() => Math.round(document.documentElement.scrollHeight - document.querySelector('footer.rodape').getBoundingClientRect().bottom - scrollY));
    check(sobra <= 1, `404@${w}: ${sobra}px de rolagem vazia após o rodapé`); }
  { const q = await (await b.newContext()).newPage(); await q.setContent(`<iframe src="${BASE}R7JvqK3bng.html" width="900" height="700"></iframe>`); await q.waitForTimeout(1500);
    const fr = q.frames().find(f => f.url().includes('R7JvqK3bng'));
    const r = fr ? await fr.evaluate(() => ({ inert: document.querySelector('main').inert, foco: document.activeElement?.closest('.aviso-moldura') !== null })) : {};
    check(r.inert === true && r.foco === true, `iframe: conteúdo por trás inacessível e foco no aviso ${JSON.stringify(r)}`); }
  { const ctx = await b.newContext(); let pedidos = 0; await ctx.route('https://vlibras.gov.br/**', r => { pedidos++; r.abort(); });
    const q = await ctx.newPage(); await q.goto(BASE + 'index.html'); const bt = q.locator('[data-vlibras]');
    await bt.click(); await q.waitForTimeout(400); await bt.click(); await q.waitForTimeout(400);
    check(pedidos === 2 && await q.locator('[vw]').count() === 0, `VLibras: nova tentativa após falha (pedidos=${pedidos})`); }
  // Endereço do site (GitHub Pages), sitemap e 404 com subpasta
  { const q = await (await b.newContext()).newPage();
    for (const pg of PAGINAS) { await q.goto(BASE + pg);
      const m = await q.evaluate(() => ({ can: document.querySelector('link[rel=canonical]')?.href, og: document.querySelector('meta[property="og:url"]')?.content, img: document.querySelector('meta[property="og:image"]')?.content }));
      const esperado = pg === 'index.html' ? PRODUCAO : PRODUCAO + pg;
      check(m.can === esperado && m.og === esperado && m.img === PRODUCAO + 'assets/img/og/og-padrao.jpg', `${pg}: endereço ${JSON.stringify(m)}`); }
    const sm = await (await q.request.get(BASE + 'sitemap.xml')).text();
    check(PAGINAS.every(pg => sm.includes(pg === 'index.html' ? `<loc>${PRODUCAO}</loc>` : `<loc>${PRODUCAO}${pg}</loc>`)) && !sm.includes('404.html'), 'sitemap incompleto');
    check((await (await q.request.get(BASE + 'robots.txt')).text()).includes(`Sitemap: ${PRODUCAO}sitemap.xml`), 'robots.txt sem Sitemap');
    // SEO para o Google: sitemap sem datas inventadas nem duplicatas, robots sem bloqueio,
    // título/descrição únicos, Open Graph e Twitter iguais, JSON-LD só com dados confirmados
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
    check(locs.length === PAGINAS.length && new Set(locs).size === locs.length && locs.every(u => u.startsWith(PRODUCAO)) && !sm.includes('<lastmod>'), `sitemap: ${locs.length} URLs, duplicatas ou lastmod`);
    check(!/^\s*Disallow:\s*\S/im.test(await (await q.request.get(BASE + 'robots.txt')).text()), 'robots.txt bloqueia algum caminho');
    const vistos = { t: new Set(), d: new Set() };
    for (const pg of PAGINAS) { await q.goto(BASE + pg);
      const s = await q.evaluate(() => { const m = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content ?? null;
        return { t: document.title, d: m('description'), robots: m('robots'), lang: document.documentElement.lang, vp: !!m('viewport'),
          og: [m('og:title'), m('og:description'), m('og:image'), m('og:image:alt')], tw: [m('twitter:title'), m('twitter:description'), m('twitter:image'), m('twitter:image:alt')],
          ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(x => x.textContent) }; });
      check(s.t.length >= 30 && s.t.length <= 70 && !vistos.t.has(s.t) && s.d && s.d.length >= 70 && s.d.length <= 160 && !vistos.d.has(s.d), `${pg}: título/descrição (${s.t.length}/${s.d && s.d.length}) fora do padrão ou repetidos`);
      vistos.t.add(s.t); vistos.d.add(s.d);
      check(s.robots === null && s.lang === 'pt-BR' && s.vp, `${pg}: robots=${s.robots} lang=${s.lang} viewport=${s.vp}`);
      check(s.og.every(Boolean) && JSON.stringify(s.og) === JSON.stringify(s.tw), `${pg}: Twitter diferente do Open Graph`);
      if (pg === 'index.html') {
        let tipos = []; try { tipos = JSON.parse(s.ld[0]).map(o => o['@context'] === 'https://schema.org' && o.url === PRODUCAO && o['@type']); } catch (e) { tipos = ['JSON inválido']; }
        check(s.ld.length === 1 && tipos.join() === 'Organization,WebSite' && !/telephone|email|address|taxID|aggregateRating|award/.test(s.ld[0]), `index: JSON-LD ${tipos}`);
      } else if (pg === EVENTOS) {
        // Eventos: só JSON-LD do tipo Event, um para cada card com data (mesmo nome e data de início)
        const ld = s.ld.map(t => { try { return JSON.parse(t); } catch (e) { return { '@type': 'JSON inválido' }; } });
        const cards = await q.evaluate(() => [...document.querySelectorAll('[data-evento][data-inicio]')].map(e => ({ nome: e.querySelector('.evento__titulo').textContent.trim(), inicio: e.dataset.inicio })));
        check(ld.every(o => o['@type'] === 'Event' && o['@context'] === 'https://schema.org') && ld.length === cards.length
          && cards.every(c => ld.some(o => o.name === c.nome && String(o.startDate).startsWith(c.inicio))), `${pg}: JSON-LD de eventos não confere com os cards ${JSON.stringify({ ld: ld.map(o => o.name || o['@type']), cards })}`);
      } else check(s.ld.length === 0, `${pg}: JSON-LD inesperado`); }
    const ctx404 = await b.newContext(); const html404 = await (await ctx404.request.get(BASE + '404.html')).text();
    await ctx404.route(BASE + 'pasta/que/nao/existe', r => r.fulfill({ status: 404, contentType: 'text/html', body: html404 }));
    const z = await ctx404.newPage(); await z.goto(BASE + 'pasta/que/nao/existe', { waitUntil: 'networkidle' });
    const est = await z.evaluate(() => ({ bg: getComputedStyle(document.querySelector('.hero-pagina')).backgroundColor, logo: document.querySelector('.marca__logo').naturalWidth, link: document.querySelector('.lista-404 a').href }));
    check(est.bg === 'rgb(10, 21, 64)' && est.logo > 0 && est.link === BASE + 'index.html', `404 em subpasta: ${JSON.stringify(est)}`); }
  // Aviso de privacidade: link em todos os rodapés
  { const q = await (await b.newContext()).newPage();
    for (const pg of PAGINAS.concat(['404.html'])) { await q.goto(BASE + pg); check(await q.locator('footer a.rodape__legal[href="Rgw7Xw9lXM.html"]').count() === 1, `${pg}: rodapé sem link de privacidade`); } }
  // Foto do Professor Dinho na seção "(03) Quem conduz" (foto-26, 9:16, sem corte nem deformação)
  for (const [w, h] of [[390, 844], [820, 1180], [1440, 900]]) {
    const ctxF = await b.newContext({ viewport: { width: w, height: h } }); const q = await ctxF.newPage(); const errosF = [];
    q.on('pageerror', e => errosF.push(e.message)); q.on('console', m => { if (m.type() === 'error') errosF.push(m.text()); });
    const respostas = []; q.on('response', r => { if (r.url().includes('foto-26')) respostas.push(r.status()); });
    await q.goto(BASE + 'x2dKgtNI0v.html', { waitUntil: 'networkidle' });
    const fig = q.locator('section[aria-labelledby="t-professor"] figure');
    await fig.scrollIntoViewIfNeeded(); await q.waitForTimeout(600);
    const f = await fig.evaluate(el => { const img = el.querySelector('img'); const mold = el.querySelector('.moldura').getBoundingClientRect(); const ri = img.getBoundingClientRect();
      return { src: img.currentSrc, ok: img.complete && img.naturalWidth > 0, natural: img.naturalWidth / img.naturalHeight, moldura: mold.width / mold.height, imgRatio: ri.width / ri.height, legenda: el.querySelector('figcaption').textContent.trim(), alt: img.alt }; });
    check(/\/assets\/img\/fotos\/otimizadas\/foto-26-(480|g)\.(webp|jpg)\?v=20261119$/.test(f.src) && f.ok, `Quem conduz@${w}: foto não carregou (${f.src})`);
    check(Math.abs(f.natural - 675 / 1200) < 0.01 && Math.abs(f.moldura - 675 / 1200) < 0.01 && Math.abs(f.imgRatio - 675 / 1200) < 0.01, `Quem conduz@${w}: proporção/corte ${JSON.stringify(f)}`);
    check(f.legenda === 'Elizomar Nascimento, o Professor Dinho.' && f.alt.startsWith('Professor Dinho'), `Quem conduz@${w}: legenda/alt`);
    check(respostas.length > 0 && respostas.every(st => st === 200), `Quem conduz@${w}: respostas HTTP da foto ${respostas}`);
    check(!errosF.length, `Quem conduz@${w}: erros no console ${errosF.join(' | ')}`);
    await ctxF.close(); }
  for (const arq of ['foto-26-480.webp', 'foto-26-480.jpg', 'foto-26-g.webp', 'foto-26-g.jpg']) {
    const r = await p.request.get(BASE + 'assets/img/fotos/otimizadas/' + arq); check(r.status() === 200 && (await r.body()).length > 10000, `arquivo ${arq} ausente ou vazio`); }
  // Fotos em todas as páginas (exceto o aviso de privacidade): carregadas, com alt, sem deformar
  { const minimo = { 'index.html': 6, 'x2dKgtNI0v.html': 4, 'CznFDg5A5K.html': 5, 'HMktb9HjQE.html': 2, 'f9N8KaE8WP.html': 5, 'Pbmns2SGtY.html': 2, 'R7JvqK3bng.html': 3, 'tYXytz9wxv.html': 3 };
    const ctxM = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const q = await ctxM.newPage();
    for (const [pg, min] of Object.entries(minimo)) {
      await q.goto(BASE + pg, { waitUntil: 'networkidle' }); await rolar(q); await q.waitForLoadState('networkidle');
      const r = await q.evaluate(() => [...document.querySelectorAll('main .moldura img')].map(i => ({ ok: i.complete && i.naturalWidth > 0, alt: i.alt.length > 10, src: i.currentSrc.split('/').pop() })));
      check(r.length >= min && r.every(i => i.ok && i.alt), `${pg}: fotos em moldura ${r.length}/${min} ${JSON.stringify(r.filter(i => !i.ok || !i.alt))}`); }
    await q.goto(BASE + 'HMktb9HjQE.html'); check(await q.locator('.galeria__item').count() === 22, 'galeria: esperadas 22 fotos');
    await ctxM.close(); }
  // Página de Eventos: menu em todas as páginas, cabeçalho em 1240px, sem JS e lógica de datas (relógio fixo)
  { const MENU = ['Início', 'Sobre', 'Capoeira Inclusiva', 'Projetos', 'Eventos', 'Ajude', 'Patrocinadores', 'Contato'];
    const ctxE = await b.newContext({ viewport: { width: 1440, height: 900 } }); const q = await ctxE.newPage();
    for (const pg of PAGINAS.concat(['404.html'])) {
      await q.goto(BASE + pg);
      const m = await q.evaluate((ev) => ({
        desk: [...document.querySelectorAll('.nav-principal a')].map(a => a.textContent.trim()),
        cel: [...document.querySelectorAll('#menu-mobile ol a')].map(a => a.textContent.trim()),
        rod: [...document.querySelectorAll('.rodape nav a')].map(a => a.textContent.trim()),
        ev: [...document.querySelectorAll('.nav-principal a, #menu-mobile ol a, .rodape nav a')].filter(a => a.getAttribute('href') === ev).length }), EVENTOS);
      check(m.desk.join('|') === MENU.join('|') && m.rod.join('|') === MENU.join('|') && m.cel.join('|') === MENU.map((t, i) => `0${i + 1}${t}`).join('|') && m.ev === 3, `${pg}: menu/rodapé ${JSON.stringify(m)}`);
    }
    for (const w of [1240, 1280, 1366]) {
      await q.setViewportSize({ width: w, height: 800 }); await q.goto(BASE + EVENTOS);
      const c = await q.evaluate(() => { const r = (sel) => document.querySelector(sel).getBoundingClientRect(); const m = r('.marca'), n = r('.nav-principal ul'), a = r('.cabecalho__acoes');
        return { sobrepoe: m.right > n.left || n.right > a.left, altura: Math.round(n.height), sobra: document.documentElement.scrollWidth - innerWidth }; });
      check(!c.sobrepoe && c.altura < 60 && c.sobra <= 0, `cabeçalho@${w} com 8 itens: ${JSON.stringify(c)}`);
    }
    await ctxE.close();
    // Sem JS: Tardezinha visível com "Data a confirmar"
    const ctxN = await b.newContext({ javaScriptEnabled: false }); const n = await ctxN.newPage(); await n.goto(BASE + EVENTOS);
    const e0 = await n.evaluate(() => ({ cards: document.querySelectorAll('[data-eventos] .evento').length, nome: document.querySelector('#ev-tardezinha')?.textContent.trim(), data: document.querySelector('.evento__a-confirmar')?.textContent.trim(), vazio: getComputedStyle(document.querySelector('[data-eventos-vazio]')).display }));
    check(e0.cards >= 1 && e0.nome === 'Tardezinha Inclusiva' && e0.data === 'Data a confirmar' && e0.vazio === 'none', `eventos sem JS: ${JSON.stringify(e0)}`);
    await ctxN.close();
    // Janela de exibição e selos: eventos de teste só nesta requisição (page.route), relógio fixo em 10/03/2027
    const ctxD = await b.newContext({ viewport: { width: 1440, height: 900 } }); const d = await ctxD.newPage(); const errosD = [];
    d.on('pageerror', e => errosD.push(e.message)); d.on('console', m => { if (m.type() === 'error') errosD.push(m.text()); });
    await d.clock.setFixedTime(new Date(2027, 2, 10, 12, 0, 0));
    const original = await (await d.request.get(BASE + EVENTOS)).text();
    const card = (id, nome, attrs, extra = '') => `<li><article class="evento" data-evento ${attrs} aria-labelledby="${id}"><div class="evento__data"></div><div class="evento__corpo"><h3 id="${id}" class="evento__titulo">${nome}</h3><div class="evento__acoes"><a data-evento-participar class="botao" href="#">Participar</a></div></div>${extra}</article></li>`;
    const cartaz = '<figure class="evento__cartaz"><a class="galeria__item" href="assets/img/fotos/otimizadas/foto-05-g.webp" data-largura="800" data-altura="1200" data-legenda="Cartaz de teste"><img src="assets/img/fotos/otimizadas/foto-05-480.jpg" width="480" height="720" alt="Cartaz de teste"></a></figure>';
    const abre = '<ol class="eventos" data-eventos data-galeria>';
    check(original.includes(abre), 'eventos: lista [data-eventos] não encontrada');
    const html = original.replace(abre, abre
      + card('t-fut', 'Futuro', 'data-inicio="2027-04-01"', cartaz)
      + card('t-pas', 'Passado', 'data-inicio="2027-03-08"')                                  // terminou e sumiu (padrão: some após o fim)
      + card('t-pas2', 'Passado visível', 'data-inicio="2027-03-08" data-sumir="2027-03-12"')  // terminou, mas ainda na janela
      + card('t-hoje', 'Hoje', 'data-inicio="2027-03-10"')
      + card('t-dois', 'Dois dias', 'data-inicio="2027-03-09" data-fim="2027-03-11"')
      + card('t-cedo', 'Ainda não publicado', 'data-inicio="2027-05-01" data-publicar="2027-04-01"')
      + card('t-sem', 'Sem data e expirado', 'data-sumir="2027-03-01"'));
    await d.route(BASE + EVENTOS, r => r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    await d.goto(BASE + EVENTOS, { waitUntil: 'networkidle' });
    const e1 = await d.evaluate(() => ({
      lista: [...document.querySelectorAll('[data-eventos] > li .evento__titulo')].map(h => h.textContent.trim()),
      selos: Object.fromEntries([...document.querySelectorAll('[data-eventos] [data-evento]')].map(e => [e.querySelector('.evento__titulo').textContent.trim(), e.querySelector('[data-evento-selo]')?.textContent || ''])),
      semBotao: !document.getElementById('t-pas2')?.closest('[data-evento]').querySelector('[data-evento-participar]') }));
    const deTeste = (l) => l.filter(x => ['Dois dias', 'Passado visível', 'Hoje', 'Futuro', 'Tardezinha Inclusiva', 'Passado', 'Ainda não publicado', 'Sem data e expirado'].includes(x)).join('|');
    check(deTeste(e1.lista) === 'Passado visível|Dois dias|Hoje|Futuro|Tardezinha Inclusiva', `eventos: janela/ordem ${JSON.stringify(e1.lista)}`);
    check(e1.selos['Dois dias'] === 'Acontecendo agora' && e1.selos['Hoje'] === 'É hoje!' && e1.selos['Futuro'] === 'Faltam 22 dias' && e1.selos['Passado visível'] === 'Já aconteceu' && e1.semBotao && !e1.selos['Tardezinha Inclusiva'], `eventos: selos ${JSON.stringify(e1.selos)}`);
    await d.locator('[data-evento]:has(#t-fut) .evento__cartaz .galeria__item').click();
    const lb = await d.evaluate(() => ({ aberto: document.getElementById('lightbox').open, src: document.querySelector('.lightbox__img')?.getAttribute('src') || '' }));
    check(lb.aberto && lb.src.endsWith('foto-05-g.webp'), `eventos: cartaz não abriu no lightbox ${JSON.stringify(lb)}`);
    check(!errosD.length, `eventos: erros no console ${errosD.join(' | ')}`);
    await ctxD.close(); }
  // Eventos: "Como foi" o 2º Festival (galeria no lightbox) e patrocinadores do evento (não fixos)
  { const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const q = await c.newPage();
    await q.goto(BASE + EVENTOS, { waitUntil: 'networkidle' }); await rolar(q); await q.waitForLoadState('networkidle');
    const f = await q.evaluate(() => { const s = document.getElementById('festival-2026');
      return { fotos: s.querySelectorAll('.galeria__item').length, logos: [...s.querySelectorAll('.patrocinadores-evento__lista img')].map(i => i.complete && i.naturalWidth > 0 && /\?v=\d{8}/.test(i.currentSrc)), aviso: /não são patrocinadores fixos/.test(s.textContent) }; });
    check(f.fotos === 16 && f.logos.length === 19 && f.logos.every(Boolean) && f.aviso, `festival 2026: ${JSON.stringify({ ...f, logos: f.logos.length })}`);
    await q.locator('#festival-2026 .galeria__item').first().click();
    const lb = await q.evaluate(() => ({ aberto: document.getElementById('lightbox').open, cont: document.querySelector('.lightbox__contador').textContent }));
    check(lb.aberto && lb.cont === '1 de 16', `festival 2026: lightbox ${JSON.stringify(lb)}`); await c.close(); }
  // CSS com versão na URL (a Cloudflare guarda .css por horas): mesma ?v= em todas as páginas
  { const vs = new Set(); for (const pg of PAGINAS.concat(['404.html'])) {
      const html = await (await p.request.get(BASE + pg)).text(); const links = [...html.matchAll(/rel="stylesheet" href="assets\/css\/[a-z]+\.css\?v=(\d{8}[a-z]?)"/g)];
      check(links.length === 4, `${pg}: ${links.length}/4 CSS com ?v=`); links.forEach(m => vs.add(m[1])); }
    check(vs.size === 1, `versões de CSS diferentes entre páginas: ${[...vs]}`); }
  for (const n of ['03', '22', '24', '25', '27']) for (const t of ['480.webp', '480.jpg', 'g.webp', 'g.jpg']) {
    const r = await p.request.get(BASE + `assets/img/fotos/otimizadas/foto-${n}-${t}`); check(r.status() === 200 && (await r.body()).length > 5000, `arquivo foto-${n}-${t} ausente ou vazio`); }
  console.log(`\nOK: ${ok}  FALHAS: ${falhas.length}`);
  falhas.forEach(f => console.log(' - ' + f));
  await b.close();
})();
