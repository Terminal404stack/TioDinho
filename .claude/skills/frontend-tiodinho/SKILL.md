---
name: frontend-tiodinho
description: Front-end do site da instituição Tio Dinho (Capoeira Inclusiva Adaptada) — página estática e animada em HTML5, CSS3 e JavaScript puro. Use sempre que for criar ou alterar HTML, CSS, JS, animações, favicon, logo, fotos, fontes, cores, acessibilidade ou desempenho deste repositório, ou quando o usuário enviar novas fotos para o site.
---

# Front-end Tio Dinho

Site de uma instituição de caridade de **capoeira inclusiva** (pessoas com deficiência, autismo, famílias).
O público inclui pessoas sensíveis a movimento e a estímulos — **acessibilidade vem antes do efeito visual**.

## Antes de começar (economia de tokens)
1. Leia `.claude/MEMORIA.md` (o que já foi feito). Não refaça trabalho registrado ali.
2. Abra **somente** a referência necessária:

| Tarefa | Arquivo |
|---|---|
| Qualquer animação, transição ou microinteração | `references/animacoes.md` |
| Cores, fontes, logo, favicon, `<head>`, fotos | `references/identidade-visual.md` |
| Qual ferramenta / skill / plugin usar e como | `references/ferramentas-e-plugins.md` |
| Revisar antes de entregar ou commitar | `references/checklist-qualidade.md` |

3. Ao terminar: acrescente uma entrada curta em `.claude/MEMORIA.md` (feito / decisões / pendências).

## Regras fixas
- **Stack:** HTML5 semântico + CSS3 (custom properties, grid/flex, `clamp()`, `@supports`, `@layer`)
  + JavaScript puro em módulos ES (`<script type="module" defer>`). **Sem framework, sem build, sem npm no site.**
- **Arquivos:** `index.html` na raiz; CSS em `assets/css/` (`base.css`, `layout.css`, `componentes.css`,
  `animacoes.css`); JS em `assets/js/` (`main.js`, `animacoes.js`, `acessibilidade.js`).
- **Aprimoramento progressivo:** sem JS o conteúdo aparece inteiro. Estados iniciais "escondidos" de
  animação só valem sob `html.js` **e** `prefers-reduced-motion: no-preference`.
- **Mobile first**, largura mínima 320 px, sem rolagem horizontal, alvos de toque ≥ 44 px.
- **Acessibilidade WCAG 2.2 AA** (contraste, foco visível, teclado, `alt`, landmarks, `lang="pt-BR"`).
  Botão visível **"Pausar animações"** + respeito a `prefers-reduced-motion`.
- **Imagens:** WebP com fallback JPEG, `width`/`height` sempre, `loading="lazy"` exceto a do topo,
  EXIF removido (GPS!). Fotos de crianças/PcD só com autorização de uso de imagem (ECA + LGPD).
- **Desempenho:** animar só `transform`/`opacity`; nada de bibliotecas pesadas; meta Lighthouse ≥ 90
  em todas as categorias.
- Textos do site em **português do Brasil**, tom acolhedor e direto.

## Fluxo padrão
1. Planejar a seção → conferir `animacoes.md` para escolher **no máximo 1 animação de destaque por seção**.
2. Escrever HTML semântico → CSS com tokens → JS só onde CSS não resolve.
3. Servir local (`python3 -m http.server 8080`), conferir com Playwright em 375 / 768 / 1440 px
   e com `reducedMotion: 'reduce'` (ver `ferramentas-e-plugins.md`).
4. Passar o `checklist-qualidade.md` → `/code-review` → commit em português.
