/* =========================================================
   main.js — menu, cabeçalho, voltar ao topo, WhatsApp,
   compartilhar, PIX e proteção contra iframe.
   O conteúdo existe sem JS; aqui só há aprimoramentos.
   ========================================================= */
import './acessibilidade.js';
import './animacoes.js';
import './galeria.js';

const WHATSAPP = '5532984473310';

/* ---------- Região de anúncio global (aria-live) ---------- */
const anunciar = (() => {
  let regiao = document.getElementById('anuncio-global');
  if (!regiao) {
    regiao = document.createElement('div');
    regiao.id = 'anuncio-global';
    regiao.className = 'visualmente-oculto';
    regiao.setAttribute('aria-live', 'polite');
    document.body.append(regiao);
  }
  return (texto) => {
    regiao.textContent = '';
    window.setTimeout(() => { regiao.textContent = texto; }, 60);
  };
})();
window.sciaAnunciar = anunciar;

/* ---------- Menu mobile ---------- */
function iniciarMenu() {
  const botao = document.querySelector('.botao-menu');
  const painel = document.getElementById('menu-mobile');
  if (!botao || !painel) return;
  const cabecalho = botao.closest('header');
  const foraDoCabecalho = () => [...document.body.children].filter((el) => el !== cabecalho && el.tagName !== 'SCRIPT');
  const rotulo = botao.querySelector('.botao-menu__texto');

  const abrir = () => {
    painel.hidden = false;
    botao.setAttribute('aria-expanded', 'true');
    botao.setAttribute('aria-label', 'Fechar menu');
    if (rotulo) rotulo.textContent = 'Fechar';
    document.documentElement.classList.add('menu-aberto');
    foraDoCabecalho().forEach((el) => { el.inert = true; });
    painel.querySelector('a')?.focus();
  };
  const fechar = (devolverFoco = true) => {
    painel.hidden = true;
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
    if (rotulo) rotulo.textContent = 'Menu';
    document.documentElement.classList.remove('menu-aberto');
    foraDoCabecalho().forEach((el) => { el.inert = false; });
    if (devolverFoco) botao.focus();
  };

  painel.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
  botao.addEventListener('click', () => (painel.hidden ? abrir() : fechar()));
  painel.addEventListener('click', (e) => { if (e.target.closest('a')) fechar(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !painel.hidden) fechar();
  });
  window.matchMedia('(min-width: 1240px)').addEventListener('change', (e) => {
    if (e.matches && !painel.hidden) fechar(false);
  });
}

/* ---------- Cabeçalho compacto e voltar ao topo ---------- */
function iniciarRolagem() {
  const cabecalho = document.querySelector('.cabecalho');
  const topo = document.querySelector('.voltar-topo');
  const sentinela = (top) => {
    const s = document.createElement('div');
    s.setAttribute('aria-hidden', 'true');
    s.style.cssText = `position:absolute;top:${top};left:0;width:1px;height:1px;pointer-events:none;`;
    document.body.prepend(s);
    return s;
  };
  if (!('IntersectionObserver' in window)) return;
  if (cabecalho) {
    new IntersectionObserver(([e]) => cabecalho.classList.toggle('compacto', !e.isIntersecting && e.boundingClientRect.top < 0))
      .observe(sentinela('70px'));
  }
  const primeiraSecao = document.querySelector('main > section');
  if (topo && primeiraSecao) {
    // Aparece depois que o topo da página (hero) sai inteiro da tela
    new IntersectionObserver(([e]) => topo.classList.toggle('visivel', !e.isIntersecting && e.boundingClientRect.top < 0))
      .observe(primeiraSecao);
    topo.addEventListener('click', (e) => {
      e.preventDefault();
      const alvo = document.getElementById('conteudo');
      window.scrollTo({ top: 0 });
      alvo?.focus({ preventScroll: true });
    });
  }
}

/* ---------- WhatsApp com mensagem pré-preenchida ---------- */
function iniciarWhatsapp() {
  document.querySelectorAll('a[data-whatsapp]').forEach((a) => {
    const msg = a.dataset.whatsapp.trim();
    if (msg) a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  });
}

/* ---------- Compartilhar a página ---------- */
function iniciarCompartilhar() {
  document.querySelectorAll('[data-compartilhar]').forEach((botao) => {
    botao.hidden = false;
    const saida = document.getElementById(botao.getAttribute('aria-describedby') || '') || null;
    botao.addEventListener('click', async () => {
      const dados = {
        title: 'Ser Capoeira Inclusiva Adaptada',
        text: 'Conheça o Ser Capoeira Inclusiva Adaptada — capoeira para todos, em Juiz de Fora (MG).',
        url: botao.dataset.url || window.location.href,
      };
      if (navigator.share) {
        try { await navigator.share(dados); return; } catch (err) { if (err.name === 'AbortError') return; }
      }
      try {
        await navigator.clipboard.writeText(dados.url);
        const texto = 'Link copiado. Agora é só colar onde quiser compartilhar.';
        if (saida) saida.textContent = texto;
        anunciar(texto);
      } catch {
        const texto = `Copie este link para compartilhar: ${dados.url}`;
        if (saida) saida.textContent = texto;
        anunciar(texto);
      }
    });
  });
}

/* ---------- PIX: a chave em texto aparece só depois de confirmada ----------
   data-pix="chave" → mostra a chave e ativa "Copiar chave PIX" (o QR Code já está no HTML) */
function iniciarPix() {
  document.querySelectorAll('[data-pix]').forEach((bloco) => {
    const chave = (bloco.dataset.pix || '').trim();
    if (!chave) return; // chave ainda não confirmada
    const dados = bloco.querySelector('[data-pix-dados]');
    if (dados) dados.hidden = false;
    bloco.querySelectorAll('[data-pix-valor]').forEach((el) => { el.textContent = chave; });
    const botao = bloco.querySelector('[data-pix-copiar]');
    const saida = bloco.querySelector('[data-pix-feedback]');
    botao?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(chave);
        botao.querySelector('span').textContent = 'Copiado!';
        if (saida) saida.textContent = 'Chave PIX copiada.';
        window.setTimeout(() => { botao.querySelector('span').textContent = 'Copiar chave PIX'; }, 2000);
      } catch {
        if (saida) saida.textContent = 'Não foi possível copiar automaticamente. Selecione a chave acima e copie.';
      }
    });
  });
}

/* ---------- PIX Copia e Cola (mesmo código do QR Code) — útil no celular ---------- */
function iniciarPixCopiaCola() {
  document.querySelectorAll('[data-pix-copia]').forEach((bloco) => {
    const codigo = (bloco.dataset.pixCopia || '').trim();
    if (!codigo || !navigator.clipboard) return;
    bloco.hidden = false;
    const botao = bloco.querySelector('[data-pix-copia-botao]');
    const rotulo = botao.querySelector('span');
    const saida = bloco.querySelector('[data-pix-copia-feedback]');
    botao.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        rotulo.textContent = 'Código copiado!';
        saida.textContent = 'Código PIX copiado. Agora cole no app do seu banco.';
        window.setTimeout(() => { rotulo.textContent = 'Copiar código PIX'; }, 2500);
      } catch {
        saida.textContent = 'Não foi possível copiar automaticamente. Use o QR Code acima.';
      }
    });
  });
}

/* ---------- Proteção contra o site ser exibido dentro de outra página (clickjacking) ----------
   O GitHub Pages não permite o cabeçalho X-Frame-Options; então, se a página estiver dentro de um
   iframe de outro site, cobrimos o conteúdo com um aviso e um link para abrir o site original. */
function protegerMoldura() {
  let emoldurado = false;
  try { emoldurado = window.top !== window.self; } catch { emoldurado = true; }
  if (!emoldurado) return;
  const aviso = document.createElement('div');
  aviso.className = 'aviso-moldura';
  aviso.setAttribute('role', 'alert');
  const texto = document.createElement('p');
  texto.textContent = 'Esta página está sendo exibida dentro de outro site.';
  const link = document.createElement('a');
  link.href = window.location.href;
  link.target = '_top';
  link.rel = 'noopener';
  link.textContent = 'Abrir o site oficial do Ser Capoeira Inclusiva Adaptada';
  aviso.append(texto, link);
  [...document.body.children].forEach((el) => { if (el.tagName !== 'SCRIPT') el.inert = true; });
  document.body.append(aviso);
  link.focus();
}

/* ---------- Ano no rodapé ---------- */
function iniciarAno() {
  document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}

protegerMoldura();
iniciarMenu();
iniciarRolagem();
iniciarWhatsapp();
iniciarCompartilhar();
iniciarPix();
iniciarPixCopiaCola();
iniciarAno();
