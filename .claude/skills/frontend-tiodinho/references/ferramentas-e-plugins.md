# Ferramentas, skills e plugins

Inventário do ambiente (nov/2026). Use a ferramenta mais barata que resolve.

## Ferramentas locais (container)
| Ferramenta | Para quê | Como |
|---|---|---|
| **Playwright + Chromium** (pré-instalado) | screenshots, teste mobile/desktop, modo reduzido, erros de console, renderizar SVG→PNG | `require('playwright')` funciona de qualquer pasta (se não, `NODE_PATH=$(npm root -g)`); `chromium.launch()` sem opções. **Não** rodar `playwright install`. |
| **ImageMagick** (`convert`, `identify`, `montage`) | redimensionar, WebP, ICO, folha de contato de fotos | lê AVIF mas **não grava**; sem `rsvg` (SVG → usar Playwright) |
| **Pillow + numpy** (Python) | remoção de fundo, amostrar cores, quantizar PNG | rodar com `python3 -I` |
| `python3 -m http.server 8080` | servir o site estático localmente | depois chamar `report_preview_port` (porta 8080) para o usuário ver |
| `npx` (registro npm liberado) | ferramentas pontuais, sem instalar no projeto | `npx html-validate index.html`, `npx stylelint`, `npx lighthouse http://localhost:8080 --chrome-flags="--headless --no-sandbox"` com `CHROME_PATH=/opt/pw-browsers/chromium` |

### Receitas Playwright (conferência)
- Viewports: 375×812, 768×1024, 1440×900. Para mim mesmo: `deviceScaleFactor: 1` (imagem menor = menos tokens).
  Para mostrar ao usuário: `deviceScaleFactor: 2`.
- Movimento reduzido: `browser.newContext({ reducedMotion: 'reduce' })`.
- Sem JS: `newContext({ javaScriptEnabled: false })` — todo conteúdo deve continuar visível.
- Erros: `page.on('console')` e `page.on('pageerror')`.
- Animação ao rolar: `page.mouse.wheel(0, 800)` + `waitForTimeout(700)` antes do screenshot.
- Scripts de teste ficam no scratchpad, não no repositório.

### Receitas de imagem
```bash
# foto → WebP + JPEG, sem EXIF
convert original.jpg -auto-orient -resize 1280x -strip -quality 80 saida-1280.webp
convert original.jpg -auto-orient -resize 1280x -strip -sampling-factor 4:2:0 -interlace JPEG -quality 82 saida-1280.jpg
# folha de contato para escolher fotos de uma vez
montage originais/* -auto-orient -thumbnail 300x300 -geometry +6+6 -tile 6x -label '%f' contato.jpg
```

## Skills disponíveis e quando usar
| Skill | Uso neste projeto |
|---|---|
| **frontend-tiodinho** (esta) | qualquer trabalho de front-end |
| `skill-creator` | melhorar/ampliar esta skill |
| `run` | subir o site e tirar screenshot para confirmar uma mudança |
| `code-review` | revisar o diff antes do commit (nível `medium` padrão) |
| `simplify` | limpar CSS/JS duplicado após uma seção pronta |
| `security-review` | antes de publicar (links externos, formulários, scripts de terceiros) |
| `artifact-design` + ferramenta Artifact | publicar uma **prévia** privada para o usuário ver no celular |
| `artifact-emulator` | só para conferir artifacts publicados (não para o site em si) |
| `chrome-browser` / `built-in-browser` | testar no navegador real do usuário quando ele estiver no app desktop |
| `dataviz` | se a seção de impacto ganhar gráficos (cores e acessibilidade de gráfico) |
| `deep-research` | pesquisa ampla (ex.: referências de ONGs, legislação de inclusão) — cara, só se pedido |
| `docs` / `pdf` / `docx` | ler conteúdo institucional que o usuário enviar (estatuto, textos) |
| `init` | regenerar o `CLAUDE.md` se a estrutura mudar muito |
| `fewer-permission-prompts` | reduzir pedidos de permissão repetidos |

## Plugins
| Plugin | Uso |
|---|---|
| `pptx-deck:create-deck` | apresentação para patrocinadores/editais reaproveitando cores e logo do site |

## Recursos externos recomendados (no site)
- **VLibras** (gov.br) — widget oficial de tradução para Libras; essencial para um site de inclusão.
  Carregar com `defer` no fim do `<body>`.
- Fontes Montserrat e Atkinson Hyperlegible Next — baixar woff2 (Google Fonts) e **auto-hospedar**.
- Ícones: SVG próprios em `assets/icons/` (inline com `aria-hidden="true"`); sem fontes de ícones.

## Economia de tokens
- Ler `.claude/MEMORIA.md` em vez de reexplorar o repositório.
- Abrir só uma referência por vez; ler arquivos grandes por trechos (`offset/limit`).
- Conferir visual com 1 screenshot pequeno por viewport, não vários.
- Agrupar comandos independentes numa só chamada.
