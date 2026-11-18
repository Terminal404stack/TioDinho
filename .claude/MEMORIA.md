# Memória do projeto (diário)

> Uma entrada curta por sessão: data, o que foi feito, decisões, pendências. Mais novo no topo.

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
