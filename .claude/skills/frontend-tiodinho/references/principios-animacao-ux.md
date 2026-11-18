# Princípios de animação e leis de UX

São os 12 princípios da animação e as leis de UX pedidos pelo usuário, traduzidos em regras para este
site. A acessibilidade continua acima de todos eles: tudo que se move só acontece com `html.anima`
(movimento permitido e não pausado). Tokens em `assets/css/base.css`; implementação em `animacoes.css`.

## 12 princípios da animação
| Princípio | Regra no site | Onde está aplicado |
|---|---|---|
| **Squash & stretch** (comprimir e esticar) | Só em microinterações de toque, e no máximo 6 %. | Botão pressionado: `scale(1.03, .94)` |
| **Anticipation** (antecipação) | Um recuo curto antes da ação principal. | Seta do `.link-seta` recua 3px e então avança |
| **Staging** (encenação) | **No máximo 1 destaque por seção**; o resto fica parado. | Topo: as peças se encaixando; seções: revelação única |
| **Straight ahead × Pose to pose** | Sempre *pose to pose*: keyframes com poses definidas (início, meio, fim). | `@keyframes encaixa`, `batimento`, `antecipa` |
| **Follow through** (continuidade) | Passar levemente do ponto e assentar, com `--ease-elastico`. | Soltar o botão, cards, peças da logo |
| **Slow in / slow out** (aceleração) | Nunca `linear` em movimento: entradas `--ease-saida`, estados `--ease-padrao`. | Todos os tokens de easing |
| **Arcs** (arcos) | Trajetórias curvas em vez de retas nos elementos de marca. | Peças do quebra-cabeça chegam girando em curva |
| **Secondary action** (ação secundária) | Um detalhe que acompanha a ação principal, sem competir com ela. | Ícone do botão cresce 12 % enquanto o fundo preenche |
| **Timing** (tempo) | 150ms (hover/foco) · 300ms (UI) · 600ms (entradas) · 1000ms (destaque único) | Tokens `--dur-*` |
| **Exaggeration** (exagero) | **Contido**: o público é sensível a estímulos. O exagero fica no visual estático (marca-texto inclinado, títulos grandes), não no movimento. | `.marca-texto`, `.lema` |
| **Solid drawing** (desenho sólido) | Ícones com o mesmo traço (2px, 24×24), mesma família de sombras e raios. | `assets/icons/sprite.svg`, tokens `--raio-*` |
| **Appeal** (apelo) | Cores da marca, fotos reais e alegres, cantos arredondados: acolhedor e confiável. | Identidade inteira |

## Leis de UX
| Lei | Regra no site | Onde está aplicada |
|---|---|---|
| **Fitts** / **Área de clique** | Alvo mínimo de 44×44px; ações principais grandes (52px) e perto do conteúdo; a linha inteira de contato é clicável. | `.botao`, `.contato a::after`, `.card--interativo a::after`, galeria |
| **Hick** | Poucas escolhas por vez: menu com 6 itens + 1 CTA e no máximo 2 botões por bloco. | Cabeçalho, `cta-final__acoes` |
| **Miller** | Agrupar em blocos de até 3 a 7 itens. | 9 pilares em **3 grupos de 3** (Receber, Envolver, Expressar); 6 competências; 4 formas de ajudar |
| **Jakob** | Usar padrões que as pessoas já conhecem. | Logo no topo leva ao início, "Menu" com rótulo, rodapé com contatos, ícones universais (WhatsApp, e-mail) |
| **Doherty** | Resposta em menos de 400ms em toda interação. | Hover em 150ms, lightbox em 220ms, menu em 450ms, "Copiado!" imediato |
| **Postel** | Ser tolerante com o que o usuário digita e rigoroso com o que o site entrega. | Formulário: aceita qualquer texto, ignora espaços nas pontas e explica o erro em texto e ícone |
| **Frequência** | Quanto mais frequente a interação, mais curta (ou nenhuma) é a animação. Efeitos longos só uma vez por carga. | Hover em 150ms; o topo anima uma vez; revelações rodam uma vez (`unobserve`) |

## Checklist rápido para qualquer nova animação
1. Ela tem função (feedback, orientação ou hierarquia)? Se não tiver, não entra.
2. Já existe outro destaque nesta seção? Então não entra (Staging).
3. Usa só `transform`/`opacity`, com duração dos tokens e easing dos tokens?
4. Está dentro de `html.anima`, e o estado final aparece sem JS e no modo reduzido?
5. Interação frequente? Então 150ms ou menos (Frequência e Doherty).
