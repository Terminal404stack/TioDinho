# Identidade visual

## Logo oficial: Ser Capoeira inclusiva (desde 18/11/2026)
- `assets/img/logo/ser-capoeira-original.png`: como foi enviada (fundo branco).
- `assets/img/logo/ser-capoeira.png`: mestre com fundo transparente (701×543). Fonte para os derivados.
- `ser-capoeira-{160,320,640}.webp`: usar no site (cabeçalho e selo 160/320, seção do nome 640).
- `ser-capoeira-emblema.png`: recorte com mão, arcos e "Ser", usado nos favicons pequenos.
- **Fundo claro:** logo original (`ser-capoeira-*.webp`, texto preto).
- **Nitidez:** derivados em **WebP lossless** com `srcset` 1x/2x; **nunca exibir maior que metade da largura do arquivo** (máx. 703 px → 350 px de CSS). Sem blur no alfa (borda suave por supersampling 2x). Script: `tools/logo-nitida.py`.
- Arquivos: original 128/192/350/703; clara 240/360/540.
- Larguras em `rem` (cabeçalho 7.5rem, compacto 6.25rem, celular 6rem) para crescer nos monitores ≥2200px; `sizes` do cabeçalho acompanha (120/135/150px).
- **Fundo escuro** (cabeçalho, rodapé): `ser-capoeira-clara.png` e `-clara-240/360/540.webp`,
  com "CAPOEIRA inclusiva" em branco e halos removidos. Sem fundo, sem pílula: o usuário quer a logo "100% PNG".
- **Símbolo do projeto** (figura de braços erguidos: "Y" amarelo, cabeça, costelas e pernas pretas), enviado em
  19/11/2026 e **no lugar das 4 peças de quebra-cabeça** no topo da Início. Original em `docs/identidade/simbolo-original.png`;
  SVG vetorizado em linha (`.simbolo`, contorno branco de adesivo para ler em fundo escuro e sobre foto).
- Outros elementos reaproveitáveis: arco azul, arco verde, símbolo de acessibilidade, cores das peças (faixa do rodapé,
  marcadores de lista).
- Logo antiga ("Tio Dinho") guardada em `assets/img/logo/antiga/`, só como histórico. **Não usar.**

## Cores (tokens para `:root`), com contraste medido (WCAG)
| Token | Hex | Branco | Tinta #0b0b14 | Uso |
|---|---|---|---|---|
| `--cor-vermelho` | `#e3141b` | 4.79 ✅ | 4.09 | botões, destaques |
| `--cor-vermelho-escuro` | `#c40f15` | 6.13 ✅ | — | texto/hover |
| `--cor-amarelo` | `#fbbf0a` | 1.67 ❌ | 11.71 ✅ | **só fundo com texto escuro**; nunca texto sobre branco |
| `--cor-verde` | `#0e9611` (logo) | 3.6 ⚠️ (só texto grande) | — | ícones, decoração |
| `--cor-verde-escuro` | `#1f7a1f` | 5.44 ✅ | — | botões e textos verdes |
| `--cor-azul` | `#0228ab` (logo) | 9.4 ✅ | — | links, botões |
| `--cor-azul-escuro` | `#011f92` | 12+ ✅ | — | hover |
| `--cor-noite` | `#0a1540` | 17.6 ✅ | — | topo, rodapé, `theme-color` |
| `--cor-tinta` | `#0b0b14` | 19.59 ✅ | — | texto principal |
| `--cor-prata` | `#c9ced6` | — | — | bordas, detalhes |
| `--cor-fundo` | `#fffdf7` | — | — | fundo claro levemente quente |

Ordem das cores das peças (faixa do rodapé, marcadores): **vermelho → amarelo → verde → azul**.

## Tipografia (auto-hospedar woff2 em `assets/fonts/`, `font-display: swap`)
- Títulos: **Montserrat 800 itálico**. Rótulos em caixa alta com `letter-spacing: .08em`.
- Texto: **Atkinson Hyperlegible Next** (feita para baixa visão) 400/700, base 18px, `line-height: 1.6`.
- Auto-hospedar evita enviar o IP do visitante ao Google (LGPD) e acelera o carregamento.

## Favicon, a partir da logo oficial
| Arquivo | Origem |
|---|---|
| `favicon.ico` (raiz) | 16/32/48 do emblema |
| `favicon-16x16.png` … `favicon-96x96.png` | emblema (mão + arcos + "Ser"), transparente |
| `apple-touch-icon.png` (180) | logo inteira sobre branco |
| `android-chrome-192x192.png`, `-512x512.png` | logo inteira sobre branco |
| `maskable-icon-512x512.png` | logo em 78 % sobre branco (zona segura) |
| `site.webmanifest` (raiz) | nomes, cores e ícones |

Trecho do `<head>`:
```html
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="assets/img/favicon/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="assets/img/favicon/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta name="theme-color" content="#0a1540">
```

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
