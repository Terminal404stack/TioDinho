/* =========================================================
   galeria.js — lightbox com <dialog> nativo.
   Sem JS, cada miniatura é um link para a foto ampliada.
   ========================================================= */
const galerias = document.querySelectorAll('[data-galeria]');
const dialogo = document.getElementById('lightbox');

if (galerias.length && dialogo && typeof dialogo.showModal === 'function') {
  const img = document.createElement('img');
  img.className = 'lightbox__img';
  img.decoding = 'async';
  dialogo.querySelector('.lightbox__quadro').append(img);
  const legenda = dialogo.querySelector('.lightbox__legenda');
  const contador = dialogo.querySelector('.lightbox__contador');
  const btnAnterior = dialogo.querySelector('[data-anterior]');
  const btnProxima = dialogo.querySelector('[data-proxima]');
  const btnFechar = dialogo.querySelector('[data-fechar]');

  let itens = [];
  let atual = 0;
  let gatilho = null;

  const mostrar = (indice) => {
    atual = (indice + itens.length) % itens.length;
    const link = itens[atual];
    const miniatura = link.querySelector('img');
    img.src = link.getAttribute('href');
    img.width = Number(link.dataset.largura) || 1200;
    img.height = Number(link.dataset.altura) || 800;
    img.alt = miniatura?.alt || '';
    legenda.textContent = link.dataset.legenda || miniatura?.alt || '';
    contador.textContent = `${atual + 1} de ${itens.length}`;
  };

  galerias.forEach((galeria) => {
    const links = [...galeria.querySelectorAll('a.galeria__item')];
    links.forEach((link, i) => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        itens = links;
        gatilho = link;
        mostrar(i);
        dialogo.showModal();
        btnFechar.focus();
      });
    });
  });

  btnAnterior.addEventListener('click', () => mostrar(atual - 1));
  btnProxima.addEventListener('click', () => mostrar(atual + 1));
  btnFechar.addEventListener('click', () => dialogo.close());

  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(atual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(atual + 1); }
  });
  // Clique fora da imagem (no fundo) fecha
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener('close', () => {
    img.removeAttribute('src');
    gatilho?.focus();
  });
}
