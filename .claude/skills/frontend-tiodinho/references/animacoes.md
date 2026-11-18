# Animações — site de instituição de caridade (Tio Dinho)

Pesquisa (nov/2026) resumida em regras. Fontes no fim.

## Princípios
1. **Animação serve à mensagem** (impacto, confiança, doação), não à decoração. Seleção > quantidade:
   animar tudo cansa — **1 destaque por seção**, o resto estático.
2. **Calmo e previsível.** O símbolo do quebra-cabeça remete ao autismo: público sensível a estímulos.
   Nada de loops infinitos chamativos, piscadas, sacudidas fortes ou parallax intenso.
3. **Só `transform` e `opacity`** (GPU, sem reflow). Nunca animar `width/height/top/left/margin`.
4. **Uma vez só:** revelações ao rolar acontecem na primeira entrada e param (`unobserve`).
5. **Conteúdo visível sem JS e sem animação.** O número final do contador e o texto da meta já estão no HTML.
6. **Movimento reduzido** (WCAG 2.3.3, técnica C39): sob `prefers-reduced-motion: reduce` **ou** com o
   botão "Pausar animações" ativo, trocar movimento por troca instantânea ou fade curto (≤ 200 ms).
   Não usar `animation: none !important` global às cegas — indicadores de progresso/carregamento
   continuam funcionando (só sem deslocamento).
7. **Nada pisca mais de 3×/s** (WCAG 2.3.1). Conteúdo que se move sozinho por > 5 s precisa de pausar (2.2.2).

## Tokens (definir em `:root`, usar sempre)
| Token | Valor | Uso |
|---|---|---|
| `--dur-rapida` | 150ms | hover, foco, botões |
| `--dur-media` | 300ms | menus, abas, troca de estado |
| `--dur-entrada` | 600ms | revelar ao rolar |
| `--dur-destaque` | 1000ms | entrada do topo, contadores, barra de meta |
| `--ease-saida` | `cubic-bezier(.22,1,.36,1)` | entradas (desacelera suave) |
| `--ease-padrao` | `cubic-bezier(.4,0,.2,1)` | estados de UI |
| `--stagger` | 80ms | atraso entre itens de uma lista (máx. 6 itens escalonados) |
| `--desloc` | 20px | distância de fade-up |

## Catálogo (o que usar e onde)

### A. Topo (hero) — primeira impressão
| # | Animação | Detalhes |
|---|---|---|
| A1 | **Montagem do quebra-cabeça** (assinatura da marca) | As 4 peças (vermelho, amarelo, verde, azul) entram dos 4 lados e encaixam; 1000–1200 ms, stagger 120 ms, `--ease-saida`; depois o nome "Tio Dinho" aparece. Exige as peças vetorizadas em SVG; **até lá**: logo com `scale(.92)→1` + fade 600 ms. Reduzido: fade 200 ms. |
| A2 | Título palavra a palavra | fade + `translateY(12px)`, stagger 60 ms. Texto real no `<h1>`; os `<span>` de cada palavra recebem `aria-hidden="true"` e o `<h1>` mantém o texto acessível (ou `aria-label`). |
| A3 | Faixa verde-amarela (o "swoosh" da logo) se desenhando | SVG `stroke-dasharray/dashoffset`, 800 ms, uma vez. Também serve como divisor de seções. |
| A4 | CTA "Quero ajudar" aparece por último | fade-up 400 ms após A1/A2 — guia o olhar para a doação. |

### B. Ao rolar
| # | Animação | Detalhes |
|---|---|---|
| B1 | Revelar seção/cartões | `data-anima="fade-up"` → IntersectionObserver (`threshold: .15`, `rootMargin: '0px 0px -10% 0px'`), 600 ms, stagger 80 ms. **Não** usar listener de `scroll`. Sem mudança de layout (CLS = 0). |
| B2 | **Contadores de impacto** (alunos atendidos, anos de projeto, aulas, famílias) | Conta de 0 ao valor em **1,2–1,8 s** com easing de saída (mais lento que isso o visitante passa sem ver o número). Dispara ao entrar na tela; `font-variant-numeric: tabular-nums` evita "pulo" de largura; valor final escrito no HTML (`data-contador="250"`), `aria-live` desligado. Reduzido: mostra o valor final direto. Ideal ao lado do botão de doar. |
| B3 | **Barra de meta de arrecadação** | `transform: scaleX(0→p)` com `transform-origin: left`, 1200 ms. Texto "R$ X de R$ Y (Z%)" sempre visível; usar `<progress>` ou `role="progressbar"` com `aria-valuenow`. |
| B4 | Linha do tempo da história | Linha vertical "se desenha" conforme rola: CSS `animation-timeline: view()` **dentro de `@supports (animation-timeline: view())`**; sem suporte → linha estática completa. |
| B5 | Cabeçalho compacto | Depois de ~80 px de rolagem: reduz altura via `transform`/padding fixo + sombra (classe via IntersectionObserver num sentinela no topo). |
| B6 | Botão "voltar ao topo" | fade + `translateY` 200 ms quando o topo sai da tela. |

### C. Microinterações (feedback, não enfeite)
| # | Animação | Detalhes |
|---|---|---|
| C1 | Botão **Doar** | hover/foco: `translateY(-2px)` + sombra/brilho 150 ms. "Batimento" (`scale 1→1.04→1`) **2 vezes** quando entra na tela — nunca infinito. |
| C2 | **Copiar chave PIX** | Clique → `navigator.clipboard.writeText` → botão vira "✓ Copiado!" por 2 s; anúncio em região `aria-live="polite"`. Mini-confete nas 4 cores da marca (≤ 12 partículas, ≤ 700 ms) — desativado no modo reduzido. |
| C3 | Cartões (turmas, projetos, apoiadores) | hover **e** `:focus-within`: `translateY(-4px)` + sombra na cor da peça correspondente. |
| C4 | Berimbau (ícone) | hover: a corda "vibra" — `rotate(±1deg)` 3 ciclos, 300 ms. Puramente decorativo (`aria-hidden`). |
| C5 | Ginga (silhueta de capoeirista) | balanço lateral suave (`translateX ±6px`) por **2 ciclos** quando a seção aparece; não fica em loop. |
| C6 | Galeria de fotos | hover: `scale(1.05)` na imagem dentro de moldura com `overflow:hidden`, 400 ms. Ampliar em `<dialog>` nativo com fade 200 ms, foco preso, Esc fecha. |
| C7 | Depoimentos | carrossel com `scroll-snap` nativo; **sem autoplay** (se houver, botão Pausar visível e pausa em hover/foco). Botões anterior/próximo com `aria-label`. |
| C8 | Menu mobile | painel com `translateX` + fade 250 ms, `aria-expanded`, foco preso, Esc fecha. |
| C9 | Links âncora | `scroll-behavior: smooth` **somente** dentro de `@media (prefers-reduced-motion: no-preference)`. |
| C10 | Formulário (voluntário/contato) | validação inline com mensagem que desliza 4 px + ícone; sucesso com check desenhado (SVG stroke). Erros também em texto, não só cor. |

### D. Controle de movimento (obrigatório)
- Botão **"Pausar animações"** no cabeçalho/barra de acessibilidade → adiciona `html.movimento-reduzido`
  e salva em `localStorage` (com try/catch). Estado inicial = `prefers-reduced-motion`.
- Todas as regras de movimento ficam sob o seletor
  `@media (prefers-reduced-motion: no-preference) { html:not(.movimento-reduzido) … }`.
- No JS: `const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('movimento-reduzido')`
  → aplicar estado final direto.

## Proibido
Scroll-jacking/rolagem "suave" por biblioteca (Lenis, Locomotive), parallax forte, preloader de tela
cheia, cursor customizado, vídeo em autoplay com som, texto que digita sozinho em loop, efeitos 3D de
inclinação, qualquer coisa piscando, animações bloqueando o clique, bibliotecas de animação inteiras
para um efeito só.

## Tecnologia escolhida
- **CSS** (transitions/keyframes) para quase tudo.
- **IntersectionObserver** para disparar uma vez ao entrar na tela (B1, B2, B3, C1, C5).
- **CSS scroll-driven** (`animation-timeline: view()`) apenas como melhoria em `@supports` (B4) —
  suporte entre navegadores ainda é desigual; conteúdo correto sem ela.
- **Web Animations API** (`element.animate`) para contadores/confete quando precisar de controle em JS.
- GSAP/ScrollTrigger: **não usar** (desnecessário para este escopo). Reavaliar só se A1 exigir linha do
  tempo complexa.

## Fontes da pesquisa
- WCAG 2.3.3 Animation from Interactions — https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions
- Técnica C39 (prefers-reduced-motion) — https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- Animated UI em sites de caridade — https://www.studiorepublic.com/blog/the-impact-of-animated-ui-on-charity-website-engagement/
- Contadores animados (duração 1–2 s) — https://www.poper.ai/blog/animated-number-counter-examples/
- Homepage de ONG e doações — https://homepagedream.vercel.app/blog/nonprofit-homepage-fundraising
- Microinterações como feedback — https://fivejars.com/insights/website-microinteractions-small-details-shaping-big-experiences/
- CSS scroll-triggered + fallback IntersectionObserver — https://developer.chrome.com/blog/scroll-triggered-animations
- Introdução a scroll()/view() — https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view
