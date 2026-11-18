# Identidade visual

## Logo
- `assets/img/logo/logo-original.webp` — como foi enviada (xadrez de transparência **pintado**, não usar no site).
- `assets/img/logo/logo-tio-dinho.png` — mestre com fundo transparente (1247×1247). Fonte para gerar derivados.
- `assets/img/logo/logo-tio-dinho.webp` (1024) e `logo-tio-dinho-512.webp` — usar no site.
- Elementos da logo reaproveitáveis em animações/ícones: 4 peças de quebra-cabeça (inclusão/autismo),
  capoeirista em movimento (vermelho), berimbau (amarelo), cadeirante (verde), três pessoas unidas (azul),
  faixa ondulada verde-amarela, texto prateado cromado com contorno preto.

## Cores (tokens para `:root`) — contraste medido (WCAG)
| Token | Hex | Branco | Tinta #0b0b14 | Uso |
|---|---|---|---|---|
| `--cor-vermelho` | `#e3141b` | 4.79 ✅ | 4.09 | botões, destaques |
| `--cor-vermelho-escuro` | `#c40f15` | 6.13 ✅ | — | texto/hover |
| `--cor-amarelo` | `#fbbf0a` | 1.67 ❌ | 11.71 ✅ | **só fundo com texto escuro**; nunca texto sobre branco |
| `--cor-verde` | `#22a336` | 3.30 ⚠️ (só texto ≥ 24px/bold 19px) | 5.93 ✅ | ícones, fundos com texto escuro |
| `--cor-verde-escuro` | `#17802a` | 5.05 ✅ | — | botões com texto branco |
| `--cor-azul` | `#0a6fe0` | 4.81 ✅ | 4.07 | links, botões |
| `--cor-azul-escuro` | `#0857b8` | 6.85 ✅ | — | hover de links |
| `--cor-noite` | `#0f1a3a` | 17.08 ✅ | — | fundo escuro do topo/rodapé, `theme-color` |
| `--cor-tinta` | `#0b0b14` | 19.59 ✅ | — | texto principal |
| `--cor-prata` | `#c9ced6` | — | — | bordas, detalhes "cromados" |
| `--cor-fundo` | `#fffdf7` | — | — | fundo claro levemente quente |

Ordem das peças (usar igual em divisores, cards, confete): **vermelho → amarelo → verde → azul**.

## Tipografia (auto-hospedar woff2 em `assets/fonts/`, `font-display: swap`)
- Títulos: **Montserrat 800 itálico** (ecoa o "TIO DINHO" da logo). Subtítulos em caixa alta com
  `letter-spacing: .08em` ecoam "CAPOEIRA INCLUSIVA ADAPTADA".
- Texto: **Atkinson Hyperlegible Next** (feita para baixa visão) 400/700, base 18px, `line-height: 1.6`.
- Auto-hospedar evita enviar IP do visitante ao Google (LGPD) e acelera o carregamento.

## Favicon — já gerado
| Arquivo | Origem |
|---|---|
| `favicon.ico` (raiz) | 16 e 32 da marca simplificada + 48 da logo |
| `assets/img/favicon/favicon.svg` | marca simplificada (losango 4 peças) — escala perfeita |
| `favicon-16x16.png`, `favicon-32x32.png` | renderizados do SVG |
| `favicon-48x48.png`, `favicon-96x96.png` | logo completa |
| `apple-touch-icon.png` (180, fundo branco) | logo completa |
| `android-chrome-192x192.png`, `-512x512.png` | logo completa, transparente |
| `maskable-icon-512x512.png` | logo em 80 % sobre `#0f1a3a` (zona segura) |
| `site.webmanifest` (raiz) | nomes, cores e ícones |

Trecho do `<head>` (copiar quando o `index.html` for criado):
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/assets/img/favicon/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0f1a3a">
```
Se o site ficar num subdiretório (ex.: GitHub Pages de projeto), trocar `/` inicial por caminho relativo.

## Fotos (quando o usuário enviar)
1. Salvar como vieram em `assets/img/fotos/originais/` (não editar).
2. **Escolher as melhores** por: nitidez, rosto/ação visível, emoção (alegria, superação, roda),
   diversidade (idades, deficiências, famílias), boa luz, sem fundo poluído. Horizontais para o topo.
   Gerar uma folha de contato pequena (montage) para avaliar todas de uma vez — economiza tokens.
3. ⚠️ Crianças e pessoas com deficiência: confirmar com o usuário que há **autorização de uso de imagem**.
4. Otimizar para `assets/img/fotos/otimizadas/` com nomes descritivos (`roda-capoeira-adaptada-1280.webp`):
   - Topo: 1920 e 1280 px de largura · Cards: 800×600 · Galeria: 1200 px no maior lado · Miniaturas: 400 px.
   - WebP qualidade ~80 + JPEG ~82 de fallback, `-strip` (remove EXIF/GPS).
   - Usar `<picture>` + `srcset`/`sizes`; `alt` em português descrevendo a cena.
5. Registrar em `.claude/MEMORIA.md` quais fotos foram escolhidas e onde serão usadas.
