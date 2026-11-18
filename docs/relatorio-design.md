# Relatório de design — 18/11/2026

Versão completa, com capturas: https://claude.ai/artifact/VupihXtcAei7SfRyd65F9v (privada).

## Defeito relatado: linha verde solta ao trocar de página
- **Causa:** a faixa ondulada (`.swoosh`) ficava na base do topo de cada página. A seção clara
  seguinte (`.secao--folha`, com margem negativa) cobria quase toda a faixa e sobrava só a ponta da
  direita, desenhada a cada carregamento.
- **Correção:** a faixa virou sublinhado do título (`.swoosh-titulo`, logo após o `<h1>` das 6 páginas),
  como na logo. Entrou também a transição suave entre páginas (`@view-transition`), com o cabeçalho
  fixo, desligada no modo de movimento reduzido e com as animações pausadas.

## Outras correções desta revisão
| Página | Correção |
|---|---|
| Projetos | Galeria sem vãos: 14 fotos (novas: 14 e 17), linhas de altura igual, 2 ou 4 colunas |
| Ajude | Botão "Copiar código PIX" (Pix Copia e Cola, mesmo código do QR) para quem está no celular |
| Contato | E-mail quebra depois do "@" (`<wbr>`), não mais em "com. / br" |
| Sobre, Projetos, Contato | Peças decorativas do topo maiores |

## Sugestões (dependem de conteúdo confirmado)
Foto principal mais cedo no celular · contadores de impacto · linha do tempo da história ·
depoimentos de famílias · quadro de turmas e horários · galeria só da Tardezinha · próxima edição
com data e inscrição.

## Medições
Lighthouse no celular: desempenho 97–98, acessibilidade/boas práticas/SEO 100 nas 6 páginas.
Playwright 471/471 · html-validate e stylelint sem erros.
