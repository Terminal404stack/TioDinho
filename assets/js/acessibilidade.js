/* =========================================================
   acessibilidade.js — "Pausar animações" e VLibras sob demanda.
   Única persistência do site: a preferência de movimento
   (localStorage, não sensível).
   ========================================================= */
const raiz = document.documentElement;
const CHAVE = 'scia-movimento';
const sistemaReduz = window.matchMedia('(prefers-reduced-motion: reduce)');

const salvar = (valor) => { try { localStorage.setItem(CHAVE, valor); } catch { /* armazenamento indisponível */ } };
const anunciar = (t) => (window.sciaAnunciar ? window.sciaAnunciar(t) : null);

function atualizarBotoes() {
  const pausado = !raiz.classList.contains('anima');
  document.querySelectorAll('[data-pausar-animacoes]').forEach((b) => b.setAttribute('aria-pressed', String(pausado)));
}

function definirMovimento(ativo) {
  raiz.classList.toggle('anima', ativo);
  raiz.classList.toggle('movimento-pausado', !ativo);
  document.dispatchEvent(new CustomEvent('scia:movimento', { detail: { ativo } }));
  atualizarBotoes();
}

document.querySelectorAll('[data-pausar-animacoes]').forEach((botao) => {
  botao.hidden = false;
  botao.addEventListener('click', () => {
    const pausadoAgora = !raiz.classList.contains('anima');
    if (pausadoAgora) {
      if (sistemaReduz.matches) {
        anunciar('Seu dispositivo está configurado para reduzir movimento. As animações continuam desligadas.');
        return;
      }
      salvar('ativo');
      definirMovimento(true);
      anunciar('Animações retomadas.');
    } else {
      salvar('pausado');
      definirMovimento(false);
      anunciar('Animações pausadas. Todo o conteúdo fica parado.');
    }
  });
});
atualizarBotoes();

sistemaReduz.addEventListener('change', (e) => {
  if (e.matches) definirMovimento(false);
});

/* ---------- VLibras (recurso oficial do Governo Federal), carregado só após clique ---------- */
document.querySelectorAll('[data-vlibras]').forEach((botao) => {
  botao.hidden = false;
  botao.addEventListener('click', () => {
    if (document.querySelector('[vw]')) {
      document.querySelector('[vw-access-button]')?.click();
      return;
    }
    botao.setAttribute('aria-busy', 'true');
    const caixa = document.createElement('div');
    caixa.setAttribute('vw', '');
    caixa.className = 'enabled';
    caixa.innerHTML = '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.append(caixa);

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      try {
        // eslint-disable-next-line no-new
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        if (typeof window.onload === 'function') window.onload(new Event('load'));
        anunciar('VLibras ativado. Use o botão de Libras que aparece na lateral da tela.');
      } catch {
        anunciar('Não foi possível iniciar o VLibras agora. Tente novamente mais tarde.');
      }
      botao.removeAttribute('aria-busy');
    };
    script.onerror = () => {
      botao.removeAttribute('aria-busy');
      anunciar('Não foi possível carregar o VLibras. Verifique sua conexão.');
    };
    document.body.append(script);
  });
});
