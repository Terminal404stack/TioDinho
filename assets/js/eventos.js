/* =========================================================
   eventos.js — agenda da página Eventos (aprimoramento progressivo).
   Sem JS, os cards aparecem como foram escritos no HTML.
   Com JS: ordena por data, move para "Eventos anteriores" o que já
   terminou e mostra um selo com quanto falta ("É hoje!", "Faltam 5 dias").
   Datas vêm de data-inicio / data-fim (AAAA-MM-DD) no <article data-evento>.
   Modelo de evento e regras: docs/eventos.md
   ========================================================= */
const lista = document.querySelector('[data-eventos]');
const secaoAnteriores = document.querySelector('[data-eventos-anteriores]');
const listaAnteriores = secaoAnteriores?.querySelector('ol');
const avisoVazio = document.querySelector('[data-eventos-vazio]');

const DIA = 24 * 60 * 60 * 1000;

/* "2026-12-05" → meia-noite local daquele dia (evita o fuso UTC de new Date('2026-12-05')) */
function dataLocal(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

function diasEntre(de, ate) {
  return Math.round((ate - de) / DIA);
}

function selo(evento, texto, classeExtra = '') {
  let el = evento.querySelector('[data-evento-selo]');
  if (!el) {
    el = document.createElement('p');
    el.setAttribute('data-evento-selo', '');
    evento.querySelector('.evento__corpo')?.prepend(el);
  }
  el.className = ['etiqueta', classeExtra].filter(Boolean).join(' ');
  el.textContent = texto;
}

if (lista && secaoAnteriores && listaAnteriores) {
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const proximos = [];
  const anteriores = [];
  const semData = [];

  [...lista.children].forEach((item) => {
    const evento = item.querySelector('[data-evento]');
    const inicio = dataLocal(evento?.dataset.inicio);
    if (!evento || !inicio) { semData.push(item); return; }
    const fim = dataLocal(evento.dataset.fim) || inicio;

    if (diasEntre(hoje, fim) < 0) {
      evento.classList.add('evento--passado');
      evento.querySelectorAll('[data-evento-participar]').forEach((el) => el.remove());
      selo(evento, 'Já aconteceu');
      anteriores.push({ item, inicio });
      return;
    }
    const faltam = diasEntre(hoje, inicio);
    if (faltam <= 0) selo(evento, faltam === 0 ? 'É hoje!' : 'Acontecendo agora', 'etiqueta--amarela');
    else if (faltam === 1) selo(evento, 'É amanhã!', 'etiqueta--amarela');
    else selo(evento, `Faltam ${faltam} dias`, 'etiqueta--amarela');
    proximos.push({ item, inicio });
  });

  // Próximos: do mais perto ao mais longe; eventos "data a confirmar" vêm depois
  proximos.sort((a, b) => a.inicio - b.inicio);
  lista.append(...proximos.map((p) => p.item), ...semData);

  // Anteriores: do mais recente ao mais antigo
  anteriores.sort((a, b) => b.inicio - a.inicio);
  listaAnteriores.append(...anteriores.map((p) => p.item));
  secaoAnteriores.hidden = listaAnteriores.children.length === 0;

  if (avisoVazio) avisoVazio.hidden = lista.children.length > 0;
}
