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
index.html, sobre.html, capoeira-inclusiva.html, projetos.html, ajude.html, contato.html, 404.html, robots.txt
favicon.ico              16/32/48 — raiz, pedido automático dos navegadores
site.webmanifest         PWA/ícones Android
assets/css/              estilos (tokens em :root)
assets/js/               scripts (módulos ES, sem dependências)
assets/fonts/            fontes woff2 auto-hospedadas
assets/icons/            ícones SVG da interface
assets/img/logo/         logo oficial "Ser Capoeira inclusiva": ser-capoeira.png (mestre), -160/-320/-640.webp, emblema; antiga/ só histórico
assets/img/favicon/      favicon.svg, PNGs 16–512, apple-touch-icon, maskable
assets/img/fotos/originais/   fotos enviadas pelo usuário (sem mexer)
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
Rodar local: `python3 -m http.server 8080` na raiz (o sprite SVG não funciona via file://).
