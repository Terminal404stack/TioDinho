/* =========================================================
   animacoes.js — revelação ao rolar (uma vez) e destaques.
   Só age quando <html> tem "anima" (movimento permitido).
   ========================================================= */
const raiz = document.documentElement;
const alvos = () => document.querySelectorAll('[data-anima], .batimento');

/* Escalonamento automático: filhos [data-anima] de um [data-anima-grupo] (máx. 6 passos) */
document.querySelectorAll('[data-anima-grupo]').forEach((grupo) => {
  grupo.querySelectorAll(':scope > [data-anima], :scope > li > [data-anima], :scope > [data-anima-item]').forEach((el, i) => {
    el.style.setProperty('--i', Math.min(i, 5));
  });
});

function mostrarTudo() {
  alvos().forEach((el) => el.classList.add('visivel'));
}

let observador = null;

function iniciar() {
  if (!raiz.classList.contains('anima') || !('IntersectionObserver' in window)) {
    mostrarTudo();
    return;
  }
  observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  alvos().forEach((el) => {
    // Elementos já visíveis na carga não são escondidos (evita "piscar")
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0 && !el.classList.contains('batimento')) {
      el.classList.add('visivel');
    } else {
      observador.observe(el);
    }
  });
  raiz.classList.add('anima-pronto');
}

/* Botão "Pausar animações" (acessibilidade.js) dispara este evento */
document.addEventListener('scia:movimento', (e) => {
  if (!e.detail.ativo) {
    observador?.disconnect();
    raiz.classList.remove('anima-pronto');
    mostrarTudo();
  }
});

iniciar();
