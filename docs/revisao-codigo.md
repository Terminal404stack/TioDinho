# Revisão de código (18/11/2026)

Revisão completa de HTML, CSS, JavaScript, configurações e arquivos publicados, e troca dos nomes
das páginas por nomes aleatórios.

## Nomes das páginas
| Página | Arquivo antigo | Arquivo novo |
|---|---|---|
| Início | index.html | index.html (precisa deste nome para o site abrir) |
| Sobre | sobre.html | x2dKgtNI0v.html |
| Capoeira Inclusiva | capoeira-inclusiva.html | CznFDg5A5K.html |
| Projetos e Eventos | projetos.html | HMktb9HjQE.html |
| Ajude | ajude.html | R7JvqK3bng.html |
| Contato | contato.html | tYXytz9wxv.html |
| Erro | 404.html | 404.html (o GitHub Pages exige este nome) |

Só letras e números, porque caracteres especiais quebram links em alguns apps. Links antigos que
alguém já tenha salvo levam à página 404, que lista os endereços novos.

## Defeitos encontrados e corrigidos
| Arquivo | Problema | Correção |
|---|---|---|
| `site.webmanifest` | `start_url: "/"` abria o endereço errado quando o site era instalado como app a partir de `usuario.github.io/TioDinho/` | `start_url` e `scope` relativos (`./`), mais `id` e `description` |
| `_config.yml` | As 26 fotos originais das crianças (incluindo as não usadas no site) e os arquivos-mestre das logos eram publicados com nomes previsíveis (`foto-01.jpg`…) | Excluídos da publicação; continuam no repositório como fonte |
| `main.js` (voltar ao topo) | O marcador invisível ficava a 140% da altura da tela e podia criar rolagem vazia em páginas curtas | O botão passa a observar o fim do topo da página |
| `main.js` (anti-iframe) | O aviso cobria a tela, mas pelo teclado dava para chegar aos links por baixo | O conteúdo de trás fica inerte e o foco vai para o link do aviso |
| `acessibilidade.js` | Se o VLibras falhasse ao carregar, os cliques seguintes não tentavam de novo | Em caso de erro, os elementos criados são removidos e o próximo clique tenta de novo |
| `main.js` | Código do QR por atributo (`data-pix-qr`) sem uso, já que o QR está no HTML | Removido |
| CSS | 15 regras sem uso (`.estado-ativo`, `.linhas--duas`, `.pecas--canto`, `.pix-qr__vazio`, `.berimbau` e animação `vibra`, etc.) | Removidas |
| `sprite.svg` | 6 ícones sem uso | Removidos (32 → 26) |
| Imagens | 11 JPGs grandes da galeria nunca carregados (o lightbox usa WebP) | Removidos |

## Verificado e sem problema
Estrutura HTML das 7 páginas (IDs únicos, referências de acessibilidade, ordem dos títulos,
dimensões das imagens, metadados, cabeçalho e rodapé idênticos), sintaxe dos scripts, CSP, links
externos, formulários (nenhum) e segredos (nenhum).

## Resultados
html-validate e stylelint sem erros · `tools/testes.js` 495/495 · `tools/pentest.js` 62/62 sem falhas ·
`tools/auditoria.js` sem achados novos · Lighthouse: desempenho 93–99, acessibilidade 100,
boas práticas 100, SEO 100 (404: 66 por `noindex`).

## Limitação conhecida
Se alguém acessar um endereço inexistente **com subpasta** (ex.: `/algo/errado`), a página 404 abre
sem estilo, porque os caminhos são relativos e a raiz do site só é conhecida depois de definir o
domínio. Em endereços sem subpasta (o caso comum) ela abre normalmente. Resolver junto com o domínio
(ver `docs/pendencias.md`).
