# Revisão final (18/11/2026)

## Telas verificadas
`tools/responsivo.js` rodou as 8 páginas em 24 telas reais e em 3 modos especiais:
- **Celular:** 320×568, 360×800, 375×667, 390×844, 412×915, 430×932
- **Celular deitado:** 667×375, 844×390, 932×430
- **Tablet:** 600×960, 768×1024, 820×1180, 834×1194, 1024×768, 1024×1366, 1180×820
- **Notebook e monitor:** 1280×720, 1366×768, 1440×900, 1536×864, 1680×1050, 1920×1080, 2560×1440, 3440×1440
- **Modos:** texto ampliado em 200% (no celular), alto contraste do Windows, tema escuro do sistema

Em cada uma: números quebrados, rolagem lateral, elementos fora da tela, sobreposição (cabeçalho e topo), texto
cortado, fonte menor que 12px, imagem distorcida ou ampliada, linhas longas demais, botão
principal fora da primeira tela, foco visível e erros no console.

## Encontrado e corrigido
| Problema | Onde | Correção |
|---|---|---|
| Botão "Conheça nossa história / Quero ajudar" só aparecia depois de rolar | Início, em notebooks (1280×720, 1366×768, 1536×864), tablet deitado e celular 375×667 | Foto do topo limitada à altura da tela, título proporcional à altura, espaços menores, texto alinhado ao topo e cabeçalho mais baixo em telas baixas |
| Barra de acessibilidade em duas linhas, gastando 88px | Celular 320px | Em até 360px o botão mostra "Libras"; o nome completo continua para leitores de tela |
| Conteúdo pequeno e perdido no meio da tela | Monitores 2560 e 3440px | Texto 12,5–25% maior e área de conteúdo de 1440/1600px; logo em `rem` com `sizes` ajustado |
| Página vazando para os lados com texto ampliado | Celular com texto em 200% | Destaque amarelo pode quebrar linha no celular; palavras longas e e-mail quebram em vez de vazar |
| Cabeçalho alto demais com o celular deitado | Celulares deitados | Cabeçalho de 60px em telas com até 520px de altura |
| Número "03" quebrando em "0" e "3" | Aviso de privacidade no celular; números dos pilares e da experiência com texto ampliado | Números não encolhem nem quebram; a coluna dos números cresce com o texto |

## Cores
- `tools/auditoria.js`: o contraste de todos os textos está OK.
- Hover de **182 links e botões** nas 8 páginas: todos com contraste de 4.5:1 ou mais.
- Alto contraste do Windows: foco e botões continuam visíveis.

## Pendências fechadas nesta revisão
- **Chave PIX** confirmada (`dinho28_jf@yahoo.com.br`): chave em texto e botão Copiar publicados.
- **Endereço do site** (`https://terminal404stack.github.io/TioDinho/`): endereço canônico,
  `og:url`, imagem de compartilhamento com endereço completo, `sitemap.xml`, `robots.txt` e
  página 404 funcionando em endereços com subpasta.
- **Aviso de privacidade** publicado (`Rgw7Xw9lXM.html`, link no rodapé de todas as páginas).
- Branch `main` criada para o GitHub Pages.

## Limites que não são defeito
- No iPhone SE antigo (320×568) e em celulares deitados (375–430px de altura), o botão principal
  aparece depois de uma rolagem curta. Só o cabeçalho e o título já ocupam quase a tela toda.
- Os links dos cartões "Doações / Voluntariado…" medem menos de 44px, mas o cartão inteiro é clicável.
- A página 404 tem SEO baixo de propósito (`noindex`).

## Resultados
| Verificação | Resultado |
|---|---|
| html-validate | sem erros |
| stylelint | sem erros |
| `node --check` (JS) | sem erros |
| `tools/testes.js` | 568/568 |
| `tools/pentest.js` | 69 verificações, 0 falhas |
| `tools/auditoria.js` | sem achados novos |
| `tools/responsivo.js` | 24 telas × 8 páginas + 3 modos, só os limites acima |
| Lighthouse celular | desempenho 93–99 · acessibilidade 100 · boas práticas 100 · SEO 100 (404: 63) |
| Lighthouse desktop | **100 em tudo** nas 8 páginas (404: SEO 63) |

## O que ainda depende do Professor Dinho
Ver `docs/pendencias.md`: dados bancários extras, locais e horários das aulas, data da Tardezinha
Inclusiva, números de impacto, certificações, parceiros, prestação de contas, CNPJ, data de
fundação, logo em alta resolução e guarda dos termos de autorização de imagem.
