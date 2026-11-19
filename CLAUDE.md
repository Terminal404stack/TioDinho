# Ser Capoeira Inclusiva Adaptada (repositório TioDinho)

Site institucional estático e animado de uma instituição de caridade (capoeira inclusiva para pessoas
com deficiência, autismo e famílias). Somente **HTML5 + CSS3 + JavaScript puro** — sem framework, sem build.

## Regras rápidas (economia de tokens)
1. **Leia `.claude/MEMORIA.md` primeiro** — é o diário do que já foi feito. Atualize-o ao final de cada tarefa.
2. Para qualquer trabalho de front-end use a skill **`frontend-tiodinho`** (`.claude/skills/frontend-tiodinho/`).
   Abra só o arquivo de `references/` que a tarefa precisa — não leia todos.
3. Não reabra imagens grandes à toa; para conferir visual, tire screenshot pequeno (deviceScaleFactor 1).
4. Arquivos temporários vão no scratchpad, nunca no repositório.
5. Idioma do site e dos commits: **português do Brasil**.

## Estrutura
```
index.html               Início
x2dKgtNI0v.html          Sobre              (nomes aleatórios pedidos pelo usuário em 18/11/2026;
CznFDg5A5K.html          Capoeira Inclusiva  index.html e 404.html precisam manter o nome)
HMktb9HjQE.html          Projetos e Eventos
R7JvqK3bng.html          Ajude
tYXytz9wxv.html          Contato
Rgw7Xw9lXM.html          Aviso de privacidade (link no rodapé)
404.html (descobre a pasta do site: /TioDinho/ no GitHub Pages ou raiz), robots.txt, sitemap.xml, _config.yml (exclusões do GitHub Pages)
.github/workflows/deploy-sercapoeira.yml  CI do usuário: roda tools/testes.js e tools/pentest.js a cada push e publica no servidor próprio (precisa dos Secrets DEPLOY_SSH_KEY/DEPLOY_KNOWN_HOSTS)
tools/                   testes, auditoria, pentest e script da logo (ver tools/README.md)
favicon.ico              16/32/48 — raiz, pedido automático dos navegadores
site.webmanifest         PWA/ícones Android
assets/css/              estilos (tokens em :root)
assets/js/               scripts (módulos ES, sem dependências)
assets/fonts/            fontes woff2 auto-hospedadas
assets/icons/            ícones SVG da interface
assets/img/logo/         logo oficial: ser-capoeira-128/192/350/703.webp (fundo claro) e -clara-240/360/540.webp (fundo escuro), sem perda; mestres .png e antiga/ não são publicados
assets/img/favicon/      PNGs 16–512, apple-touch-icon, maskable
assets/img/fotos/originais/   fotos enviadas pelo usuário (sem mexer; NÃO publicadas, ver _config.yml)
assets/img/fotos/otimizadas/  versões WebP/JPEG redimensionadas usadas no site
assets/img/og/            imagem de compartilhamento 1200×630
docs/                    conteúdo institucional, pendências, fotos
```

## Status
M1 concluído: site multipágina (6 páginas) completo e testado. Nome público: **Ser Capoeira Inclusiva Adaptada**
(Professor Dinho — Elizomar Nascimento, Juiz de Fora — MG). Conteúdo em `docs/conteudo-institucional.md`;
o que falta confirmar em `docs/pendencias.md`. **Nunca inventar** PIX, datas, números, endereço ou certificados.
Logo oficial: **Ser Capoeira inclusiva**. Fundo claro → logo original; fundo escuro (cabeçalho/rodapé) → `ser-capoeira-clara` (texto branco), sem fundo nem pílula.
Cabeçalho: grid `1fr auto 1fr` (logo à esquerda, menu no centro, "Quero ajudar" à direita). Também existem `404.html` (noindex) e `robots.txt`.
Segurança: CSP por meta tag em todas as páginas (hash do script inline do `<head>`; recalcular se ele mudar) e aviso anti-iframe em `main.js`. Ver `docs/seguranca.md`. Site sem formulário (estático).
Logos: só arquivos sem perda e nunca ampliados (ver `identidade-visual.md`).
Endereço oficial: https://sercapoeira.com.br/ (canonical/og:url em cada página, sitemap e robots). Publicação pelo CI no servidor próprio (releases imutáveis + link `current`).
SEO: ver `docs/seo.md` (JSON-LD só na Início e só com dados confirmados; sitemap sem `lastmod`; produção passa pela Cloudflare).
Fotos: todas usadas (mapa em `docs/fotos.md`); `foto-27` = `originais/foto-26.jpg` antiga; molduras com `object-fit: cover` centralizado (`.foco-*` para ajustar).
Foto do Professor Dinho em "Quem conduz" (Sobre): `foto-26` 9:16 (moldura `.moldura--vertical`, sem corte) com `?v=AAAAMMDD` nas URLs; ao trocar a foto mantendo o nome, atualize a versão.
Rodar local: na raiz, `python3 -m http.server 8080` (igual ao CI; as ferramentas de `tools/` usam esse endereço). Para simular o GitHub Pages, sirva a pasta de cima e rode com `BASE=http://localhost:8081/TioDinho/`. O sprite SVG não funciona via file://.
**Cache da Cloudflare:** `.css` fica até 4 h no cache; ao alterar qualquer CSS, troque o `?v=AAAAMMDD` dos 4 links de CSS em **todas** as páginas (testado em `tools/testes.js`).
**Não quebrar o CI:** `tools/testes.js` precisa terminar em `FALHAS: 0` e o pentest sem linhas `FALHA`.
