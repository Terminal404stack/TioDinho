# Página de Eventos (`f9N8KaE8WP.html`)

Agenda do Ser Capoeira. **Nunca inventar** datas, horários, locais ou eventos: publique só o que o responsável
confirmar.

## Como incluir um evento
1. Copie o `<li>` abaixo para dentro de `<ol class="eventos" data-eventos data-galeria>`.
2. Preencha `data-inicio` no formato `AAAA-MM-DD`. Se o evento durar mais de um dia, preencha também `data-fim`.
3. Se o evento tiver **data e local confirmados**, acrescente o JSON-LD `Event` no `<head>`. O teste exige um JSON-LD
   para cada card com data.

```html
<li data-anima>
  <article class="evento" data-evento data-inicio="AAAA-MM-DD" aria-labelledby="ev-ID">
    <div class="evento__data">
      <time datetime="AAAA-MM-DD"><span class="evento__dia">DD</span> <span class="evento__mes">mês</span></time>
      <span class="evento__semana">dia da semana</span>
    </div>
    <div class="evento__corpo">
      <h3 id="ev-ID" class="evento__titulo">Nome do evento</h3>
      <p>Descrição confirmada.</p>
      <dl class="info"><!-- Horário, Local, Como participar --></dl>
      <div class="evento__acoes"><!-- botão WhatsApp com data-evento-participar --></div>
    </div>
    <!-- opcional: cartaz -->
    <figure class="evento__cartaz"><a class="galeria__item" href="…-g.webp" data-largura="W" data-altura="H" data-legenda="Cartaz de …"><img src="…-480.jpg" width="480" height="H" alt="Cartaz de …" loading="lazy"></a></figure>
  </article>
</li>
```

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Event","name":"Nome do evento","startDate":"AAAA-MM-DDTHH:MM-03:00",
 "eventStatus":"https://schema.org/EventScheduled","eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
 "location":{"@type":"Place","name":"Local","address":{"@type":"PostalAddress","addressLocality":"Juiz de Fora","addressRegion":"MG","addressCountry":"BR"}},
 "organizer":{"@id":"https://sercapoeira.com.br/#organizacao"},"description":"…"}
</script>
```

**Cartaz:**
- Otimize em `assets/img/fotos/otimizadas/cartaz-AAAAMMDD-nome-{480,g}.{webp,jpg}`.
- Nunca amplie a imagem além do tamanho original.

## Quando o card aparece e some (`assets/js/eventos.js`)
Atributos no `<article data-evento>` (datas `AAAA-MM-DD`):

| Atributo | Para quê | Se omitir |
|---|---|---|
| `data-inicio` | dia do evento | evento "data a confirmar" |
| `data-fim` | último dia do evento | igual a `data-inicio` |
| `data-publicar` | primeiro dia em que o card aparece | aparece já |
| `data-sumir` | **último dia** em que o card aparece; no dia seguinte some sozinho | igual a `data-fim` |

Exemplo: começa dia 22, quer que fique até dia 23 → `data-inicio="2026-11-22" data-sumir="2026-11-23"` (some no dia 24).

- **Selos:** "Faltam N dias", "É amanhã!", "É hoje!", "Acontecendo agora" e, se ainda estiver na janela depois do fim,
  "Já aconteceu" (sem o botão de participar).
- **Ordem:** os eventos com data ficam em ordem, e os "data a confirmar" vêm depois.
- **Desempenho:** o script roda uma vez, ao abrir a página, sem temporizadores nem requisições.
- **Limites:**
  - quem navega sem JavaScript continua vendo o card até ele ser apagado do HTML;
  - vale apagar o `<li>` e o JSON-LD depois de um tempo, para manter o arquivo limpo.
- **Cache:** ao mudar o `eventos.js`, troque o `?v=` dele na página, porque a Cloudflare guarda `.js` por horas.
