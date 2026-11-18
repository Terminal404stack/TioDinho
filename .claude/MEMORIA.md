# Memória do projeto (diário)

> Uma entrada curta por sessão: data, o que foi feito, decisões, pendências. Mais novo no topo.

## 2026-11-18 — Revisão completa do código e nomes aleatórios nas páginas
- Páginas renomeadas (pedido do usuário; index.html e 404.html mantidas): Sobre `x2dKgtNI0v.html`,
  Capoeira Inclusiva `CznFDg5A5K.html`, Projetos `HMktb9HjQE.html`, Ajude `R7JvqK3bng.html`,
  Contato `tYXytz9wxv.html`. As referências foram atualizadas em páginas, `tools/`, docs e skill.
- Corrigidos: manifest com `start_url`/`scope` `./`; `_config.yml` deixa de publicar as fotos
  originais e os mestres das logos; "voltar ao topo" observa o hero (não cria rolagem vazia);
  anti-iframe deixa o conteúdo inerte; VLibras tenta de novo após falha; CSS morto (15 regras),
  6 ícones do sprite e 11 JPGs sem uso removidos.
- Testes 495/495 (13 novos de regressão), pentest 62/62. Detalhes em `docs/revisao-codigo.md`.

## 2026-11-18 — Logo nítida, pentest e remoção do formulário
- Logo borrada: mestre só tem 703 px; derivados eram WebP com perda (q92) com alfa desfocado, e a
  seção do nome ampliava a imagem em telas 2x. Refeito: fundo removido em 2x com redução Lanczos
  (sem blur), WebP **lossless**, srcset 1x/2x (cabeçalho 240/360, rodapé 360/540, selo 128/192,
  nome 350/703 com máx. 350 px de CSS). Pedido de logo em alta resolução está em pendências.
- Pentest (`tools/pentest.js`, 62 verificações, 0 falhas; testes em `tools/`): XSS por URL, localStorage,
  DevTools × outro visitante, CSP, clickjacking. Adicionados: CSP + referrer (meta), anti-iframe
  (`protegerMoldura`), `_config.yml` excluindo `docs/`, `CLAUDE.md` e `README.md` do Pages.
  Relatório em `docs/seguranca.md`.
- Formulário do Contato removido (HTML, `iniciarFormulario`, CSS `.formulario/.campo*`). A seção
  Canais virou coluna única (`.contato-unico`).
- Testes 482/482; Lighthouse 94–99 / 100 / 100 / 100.

## 2026-11-18 — Logo PNG no cabeçalho e rodapé, foto do professor, auditoria completa
- `ser-capoeira-clara.png` (+ webp 240/480): texto branco **só na região das palavras**. Recolorir
  todos os neutros deixou o contorno escuro das formas 3D branco (erro). Halos externos e o miolo
  do "e" foram removidos.
- Cabeçalho em grid `1fr auto 1fr` com largura total (até 1760px); `.marca`/nav/acoes fixados nas
  colunas 1/2/3; sem pílula. A barra de acessibilidade usa a mesma largura. Rodapé: logo clara 180px.
- Foto oficial do professor (`professor-dinho-*`) no topo da página Sobre.
- Criados `404.html` (noindex) e `robots.txt`. Corrigidos o contraste de `.card__num`, o alt do
  lightbox e o e-mail do contato.
- Script `scratchpad/auditoria.js` (elementos vazios, alt, âncoras, cortes, alvos, contraste).
  Testes 482/482. Relatório em `docs/auditoria-frontend.md` + artifact.

## 2026-11-18 — Nova identidade: logo oficial "Ser Capoeira inclusiva"
**Feito**
- A logo "Tio Dinho" estava errada (pedido do Professor Dinho). Logo nova sem o fundo branco (flood-fill)
  → `ser-capoeira.png` + webp 160/320/640. A antiga foi para `assets/img/logo/antiga/`; `favicon.svg`
  (losango) removido.
- Favicon 16–96 do emblema (mão + arcos + "Ser"); ícones grandes, OG e maskable com a logo inteira
  sobre branco.
- Cores tiradas da logo: azul `#0228ab`, azul-escuro `#011f92`, verde `#0e9611`, verde-escuro
  `#1f7a1f`, noite `#0a1540`.
- Logo no cabeçalho e no rodapé dentro de "pílula" branca (o texto da logo é preto). Cabeçalho com 96px.
- Peças decorativas viraram peças de quebra-cabeça (4 grupos SVG; ordem de desenho invertida para
  os encaixes aparecerem).
- Página Início: nova seção (01) "O significado do nome" (Ser / Capoeira / Inclusiva, texto do
  professor) com linhas pontilhadas. As outras seções foram renumeradas de (02) a (06).
- Marcador `FOTO-PROFESSOR` em `x2dKgtNI0v.html` para trocar pela foto que ele vai enviar.

## 2026-11-18 — Revisão crítica dos textos
- Removido texto inventado (ex.: "jogar capoeira e celebrar a diversidade", "responde pessoalmente",
  descrições de atividades não confirmadas, legenda "afeto no centro de cada encontro", seção "missão"
  que parafraseava o material) e vícios de IA (slogans como "Encontros que aproximam", "Quem caminha
  junto", "Empresas e instituições que acreditam"; travessões explicativos; "muito além de qualquer
  diagnóstico"; "não X, mas Y"; frases que falam do próprio texto).
- Regra: texto padrão, frases curtas, só fatos de `docs/conteudo-institucional.md`. Travessão só como
  separador de nome/lugar ("Juiz de Fora — MG").
- Títulos repetidos ("... é para todos") trocados por títulos descritivos.

## 2026-11-18 — Revisão de design + relatório
**Feito**
- Corrigida a "linha solta" na divisa do topo: o `.swoosh` saiu e virou `.swoosh-titulo` (sublinhado sob o h1).
- View Transitions entre páginas (`animacoes.css`), com o cabeçalho fixo e respeito à pausa e ao movimento reduzido.
- Galeria: `grid-auto-rows` fixo, 2/4 colunas, 14 fotos (14 e 17 novas) → sem vãos.
- PIX Copia e Cola (`data-pix-copia`, `iniciarPixCopiaCola` em main.js). `<wbr>` no e-mail do contato.
- Relatório: artifact https://claude.ai/artifact/VupihXtcAei7SfRyd65F9v + `docs/relatorio-design.md`.
- Testes 471/471; Lighthouse 97–98/100/100/100. **Sem commit** (aguardando autorização).

## 2026-11-18 — QR Code PIX publicado
- A pedido do usuário, QR (mesmo arquivo de antes, chave `dinho28_jf@yahoo.com.br`) virou `assets/img/pix/qrcode-pix.png`, direto no HTML de `R7JvqK3bng.html` (funciona sem JS). Aviso trocado para "Doe com segurança: confira o recebedor no app". Divergência com o e-mail `dinh28_jf` segue em `docs/pendencias.md`.

## 2026-11-18 — Ajustes: QR Code PIX, crédito Terminal404, princípios de animação/UX
**Feito**
- `R7JvqK3bng.html`: painel "Doe via PIX" com espaço do QR Code ("em breve"). `main.js/iniciarPix`:
  `data-pix-qr` troca o espaço pela imagem; `data-pix` mostra a chave + Copiar. Ícone `i-qrcode` no sprite.
- QR recebido decodificado: BR Code válido, chave `dinho28_jf@yahoo.com.br` ≠ e-mail `dinh28_jf@...` →
  salvo como `assets/img/pix/qrcode-pix-rascunho.png`, **não publicado** até confirmação.
- Rodapé das 6 páginas: crédito "Site desenvolvido por Terminal404" com logo (`assets/img/creditos/`) → https://terminal404.com.br.
- Nova referência da skill `principios-animacao-ux.md` (12 princípios + Fitts, Hick, Miller, Jakob,
  Doherty, Postel, área de clique, frequência). Aplicado: squash/follow-through no botão, ícone como
  ação secundária, antecipação na seta, arcos + overshoot nas peças, token `--ease-elastico`,
  9 pilares em 3 grupos de 3 (Miller).
- Testes: html-validate e stylelint limpos; Playwright 460/460; Lighthouse sem perda (97–99/100/100/100).

## 2026-11-18 — M1: site multipágina completo (sem commit — aguardando autorização)
**Feito**
- 6 páginas reais: `index`, `sobre`, `capoeira-inclusiva`, `projetos`, `ajude`, `contato` (.html na raiz),
  cabeçalho/rodapé repetidos em cada arquivo; página ativa via `aria-current`.
- CSS em camadas (`@layer reset, base, layout, componentes, animacoes, utilidades`): `base.css` (tokens
  do briefing, fontes, temas `data-tema` claro/suave/noite/amarelo, `data-acento`), `layout.css`,
  `componentes.css`, `animacoes.css`. Regras de visibilidade do cabeçalho ficam em `utilidades`
  (senão `.botao` vence). `[hidden]` forçado com !important.
- Movimento: script inline no `<head>` põe `html.anima` só se movimento permitido e não pausado;
  todo movimento depende de `.anima` (+ `.anima-pronto` para revelar ao rolar).
- JS (módulos): `main.js` (menu com `inert`, header compacto e voltar-ao-topo por sentinelas,
  WhatsApp `?text=`, compartilhar, gerador de mensagem, PIX), `animacoes.js`, `acessibilidade.js`
  (Pausar animações + VLibras sob demanda), `galeria.js` (`<dialog>`).
- Ícones próprios em `assets/icons/sprite.svg` (`<use href>` → exige servidor http, não file://).
- Fontes woff2 (só subconjunto latin) + licenças OFL em `assets/fonts/`. Logo 128/192 webp. OG 1200×630.
- Fotos otimizadas (19) — ver `docs/fotos.md`. Docs: `conteudo-institucional.md`, `pendencias.md`.
- Testes: html-validate sem erros; stylelint limpo; Playwright 447/447 (6 páginas × 320–1920 px,
  menu, teclado, galeria, pausa, reduzido, sem JS, links, formulário); Lighthouse mobile 97–99 / 100 / 100 / 100.

**Decisões**
- Páginas foram geradas por script no scratchpad (não versionado); editar os HTML direto daqui pra frente.
- Header NÃO some ao rolar; sem grayscale; sem contadores (não há números confirmados).
- Formulário de contato só monta texto e abre WhatsApp/e-mail (aviso explícito).

**Pendências** — ver `docs/pendencias.md` (PIX, datas, números, endereço, domínio, textos legais).

## 2026-11-18 — Fotos recebidas
**Feito**
- 26 fotos do `TIO.zip` salvas como `assets/img/fotos/originais/foto-01..26.jpg` (WhatsApp, sem EXIF).
- Avaliadas por folha de contato. **Foto principal escolhida: `foto-05`** (menina dançando na roda,
  banner "Enquanto existir AMOR...") → `otimizadas/destaque-alegria-na-roda-{853,600,400}.{webp,jpg}`.
- Plano de uso das outras fotos por seção em `docs/fotos.md` (não otimizadas ainda).

**Pendências**
- Autorização de imagem das crianças; relação "Ser Capoeira Inclusiva" × "Tio Dinho".
- Otimizar as demais fotos só quando cada seção for codificada.

## 2026-11-18 — Fase 1: preparação
**Feito**
- Estrutura de pastas criada (vazia, sem código do site).
- Logo enviada salva em `assets/img/logo/logo-original.webp` (1254×1254). Ela vinha com xadrez de
  "transparência" **pintado** na imagem (sem canal alfa) → removido por flood-fill a partir das bordas
  (pixels cinza-claros de baixa saturação). Resultado: `logo-tio-dinho.png` (mestre transparente) +
  `logo-tio-dinho.webp` (1024) + `logo-tio-dinho-512.webp`.
- Favicon: a logo completa vira ruído em 16/32 px → criada marca simplificada `favicon.svg`
  (losango com as 4 peças: amarelo topo, verde direita, azul baixo, vermelho esquerda).
  16/32 px vêm do SVG (renderizado no Chromium/Playwright — não há `rsvg` no container);
  48 px+, apple-touch (fundo branco) e android/maskable (fundo #0f1a3a) usam a logo completa.
  `favicon.ico` (16/32/48) na raiz + `site.webmanifest`.
- Skill `frontend-tiodinho` criada com pesquisa de animações para site de caridade.

**Decisões**
- Zero dependências: CSS + IntersectionObserver; scroll-driven CSS só com `@supports`.
- Fontes: Montserrat 800 itálico (títulos, ecoa a logo) + Atkinson Hyperlegible Next (texto).
- Botão "Pausar animações" visível + respeito a `prefers-reduced-motion` (público autista/PcD).

**Pendências**
- Receber fotos do usuário → selecionar e otimizar.
- Textos institucionais (história, contato, chave PIX, redes sociais) — pedir ao usuário.
- Só depois: codificar o site.
