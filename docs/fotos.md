# Fotos do site

Recebidas em 18/11/2026 (`TIO.zip`, 26 fotos do WhatsApp, já sem EXIF/GPS).
Renomeadas para `assets/img/fotos/originais/foto-NN.jpg` (ordem natural dos nomes originais).

## ⭐ Foto principal (topo do site): `foto-05`
Menina pequena dançando na roda com o braço aberto e um sorriso enorme; o mestre com o berimbau
e o microfone atrás dela, e o banner "Enquanto existir AMOR não haverá diferenças" ao fundo.
Numa imagem só aparecem criança, alegria, movimento, música da capoeira e a mensagem de inclusão.
Está nítida e bem iluminada. É vertical (853×1280): fica ótima no celular e, no computador,
vai num layout dividido (foto de um lado, texto do outro).
Versões otimizadas: `otimizadas/destaque-alegria-na-roda-{853,600,400}.{webp,jpg}`.

## Sugestão de uso das demais (ainda não otimizadas)
| Seção | Fotos | Por quê |
|---|---|---|
| Sobre o Professor Dinho | 16 (abraço com sinal de joinha), 26 (retrato com berimbau) | vínculo afetivo; apresenta o mestre |
| Aulas / ginga | 09 (mestre conduzindo o aluno no movimento), 02 (menino na ginga com a turma) | capoeira em ação |
| Música | 11, 13 (atabaque), 06 (criança com instrumento), 21, 25 | instrumentos e participação |
| Nossa família / grupo | 20 (panorâmica horizontal), 23 (turma sentada no tatame), 10 | comunidade |
| Depoimentos / afeto | 18 (abraço no portão), 17, 07, 24 | emoção para pedidos de doação |
| Conquistas | 01, 12 (crianças com medalha) | resultados e orgulho |
| Galeria geral | 03, 08, 14, 15, 19 | complemento |
| Evitar | 04 (baixa resolução), 22 (marca d'água de data do celular) | qualidade |

## Fotos usadas no site (atualizado em 19/11/2026)
Derivadas em `otimizadas/foto-NN-480.{webp,jpg}` e `foto-NN-g.{webp,jpg}` (até 1200 px, nunca ampliadas, sem EXIF).
Todas as 26 fotos recebidas + a foto oficial do professor estão no site.
| Página | Fotos |
|---|---|
| Início | topo `destaque-alegria-na-roda` (05), 16, 09, 20 + faixa em "Nosso propósito": 01, 11, 12, 15 |
| Sobre | topo `professor-dinho`, 02, Quem conduz 26, Experiência 03 |
| Capoeira Inclusiva | topo 06, O que é 17, Público atendido 20, Música 13 e 21 |
| Projetos | topo 24, Tardezinha 18 + galeria (22): 05, 01, 08, 02, 07, 12, 10, 23, 15, 19, 11, 06, 14, 17, 22, 03, 13, 16, 09, 04, 21, 27 |
| Ajude | topo 07, Voluntariado 14, Divulgação 08 |
| Contato | topo 22, Canais 25, Juiz de Fora 23 |
| Privacidade / 404 | sem fotos (página legal e página de erro) |

Observações:
- **`foto-27`** = `originais/foto-26.jpg` (foto antiga do Professor Dinho tocando berimbau). O nome `foto-26` ficou
  com a foto nova do professor; os originais não foram renomeados.
- **`foto-22`**: derivados recortados embaixo (960×1280 → 960×1180) para tirar a marca "REDMI NOTE 12S" e a data
  impressas pelo celular; ninguém foi cortado.
- **`foto-04`**: só 401×686 → apenas `foto-04-g` (tamanho nativo), usada só na galeria.
- Recorte nas molduras: `object-fit: cover` centralizado; `.foco-topo`, `.foco-alto` e `.foco-baixo` deslocam o recorte
  para manter rostos à vista. `.moldura--limite` (máx. 440px) para arquivos com menos de ~700 px de largura.
Imagem de compartilhamento: `assets/img/og/og-padrao.jpg` (logo, sem pessoas).

## Autorização
Autorização de uso das imagens informada pelo responsável em 18/11/2026. Recomenda-se arquivar os
termos assinados (ver `docs/pendencias.md`). Os textos alternativos não citam nomes de pessoas.

## Atualização de 19/11/2026: foto do Professor Dinho (`foto-26`)
- Nova foto enviada pelo usuário, processada pelo workflow (`b96eb8b`): original `originais/foto-26.png`
  (900×1600) e `otimizadas/foto-26-480.{webp,jpg}` (480×853) e `foto-26-g.{webp,jpg}` (675×1200), 9:16.
  O `originais/foto-26.jpg` antigo foi preservado (sem uso).
- Usada em "(03) Quem conduz" (`x2dKgtNI0v.html`) com a moldura `.moldura--vertical` (9:16, foto inteira,
  sem corte) e `?v=20261119` nas URLs para não ficar presa no cache. A foto do topo da página Sobre
  continua sendo a `professor-dinho-*`.

