/* =========================================================
   eventos.js — agenda da página Eventos (aprimoramento progressivo).
   Cada <article data-evento> pode ter (datas AAAA-MM-DD, horário local):
     data-inicio   dia do evento (obrigatório para eventos com data)
     data-fim      último dia do evento (padrão: data-inicio)
     data-publicar primeiro dia em que o card aparece (padrão: já aparece)
     data-sumir    último dia em que o card aparece (padrão: data-fim)
   Fora dessa janela o card é removido da página. Também ordena por data e
   mostra um selo ("É hoje!", "Faltam 5 dias"). Roda uma vez, ao carregar:
   sem temporizadores nem requisições, não pesa na página.
   Modelo e regras: docs/eventos.md
   ========================================================= */
const lista = document.querySelector('[data-eventos]');
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

function selo(evento, texto) {
  const el = document.createElement('p');
  el.setAttribute('data-evento-selo', '');
  el.className = 'etiqueta etiqueta--amarela';
  el.textContent = texto;
  evento.querySelector('.evento__corpo')?.prepend(el);
}

if (lista) {
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const comData = [];
  const semData = [];

  [...lista.children].forEach((item) => {
    const evento = item.querySelector('[data-evento]');
    if (!evento) return;
    const d = evento.dataset;
    const inicio = dataLocal(d.inicio);
    const fim = dataLocal(d.fim) || inicio;
    const publicar = dataLocal(d.publicar);
    const sumir = dataLocal(d.sumir) || fim;

    // Fora da janela de exibição: o card sai da página
    if ((publicar && hoje < publicar) || (sumir && hoje > sumir)) { item.remove(); return; }
    if (!inicio) { semData.push(item); return; }

    const faltam = diasEntre(hoje, inicio);
    if (hoje > fim) selo(evento, 'Já aconteceu');
    else if (faltam <= 0) selo(evento, faltam === 0 ? 'É hoje!' : 'Acontecendo agora');
    else if (faltam === 1) selo(evento, 'É amanhã!');
    else selo(evento, `Faltam ${faltam} dias`);
    if (hoje > fim) evento.querySelectorAll('[data-evento-participar]').forEach((el) => el.remove());
    comData.push({ item, inicio });
  });

  // Do mais perto ao mais longe; eventos "data a confirmar" vêm depois
  comData.sort((a, b) => a.inicio - b.inicio);
  lista.append(...comData.map((p) => p.item), ...semData);

  if (avisoVazio) avisoVazio.hidden = lista.children.length > 0;
}
