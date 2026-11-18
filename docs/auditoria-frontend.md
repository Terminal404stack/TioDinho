# Auditoria do front-end (18/11/2026)

Relatório completo com capturas (privado): https://claude.ai/artifact/TJczcnfqEbDD7NZ2PNDZfE

## Pedidos do usuário
| Pedido | Feito |
|---|---|
| Logo do cabeçalho sem o fundo redondo, em PNG | Logo PNG transparente com "CAPOEIRA inclusiva" em branco (`ser-capoeira-clara`) |
| Logo mais à esquerda, menu no centro, "Quero ajudar" na direita | Grid `1fr auto 1fr` em largura total; medido: menu centralizado (diferença 0px), logo e botão à mesma distância das bordas de 375 a 1920px |
| Logo do rodapé sem o quadrado | Logo PNG transparente direto sobre o fundo |
| Foto do Professor Dinho | No topo da página Sobre (o lado direito estava vazio) |

## O que a auditoria verificou
Rolagem lateral, links e recursos (106), erros de console, imagens, elementos vazios, seções vazias,
`alt` ausente/duplicado/genérico, links sem destino, âncoras quebradas, textos cortados, alvos de
toque, contraste de todos os textos, teclado, menu, galeria, pausa das animações, sem JavaScript,
formulário, PIX, 404 e simetria do cabeçalho.

## Encontrado e corrigido
- Números decorativos dos cartões de competências com contraste 1.58:1 → 3.8:1.
- Imagem do lightbox criada sem `alt` → `alt=""` até abrir.
- E-mail do contato quebrando em duas linhas no computador → cabe em uma (900–1920px).
- Menu do cabeçalho 22px fora do centro (colunas laterais desiguais) → centralizado.
- Botão "Menu" saindo da borda no celular depois da mudança de grid → fixado na coluna da direita.
- Halos brancos e miolo branco do "e" na versão clara da logo → removidos.

## Criado (faltava)
- `404.html`: página "não encontrada" com links para todas as páginas (`noindex`).
- `robots.txt`: o sitemap fica para quando houver domínio.

## Avisos que não são defeitos
- Links "Doações / Voluntariado / Parcerias / Divulgação" (Início) medem 24–31px de altura, mas o
  cartão inteiro é clicável (área bem maior que 44px).
- A 404 tem SEO 66 no Lighthouse porque usa `noindex`, de propósito.

## Resultados
html-validate e stylelint sem erros · Playwright 482/482 · Lighthouse no celular: desempenho
94–99, acessibilidade 100, boas práticas 100, SEO 100 (404: 66 por `noindex`).
