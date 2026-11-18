# Tio Dinho — Capoeira Inclusiva Adaptada

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
index.html               (ainda não criado)
favicon.ico              16/32/48 — raiz, pedido automático dos navegadores
site.webmanifest         PWA/ícones Android
assets/css/              estilos (tokens em :root)
assets/js/               scripts (módulos ES, sem dependências)
assets/fonts/            fontes woff2 auto-hospedadas
assets/icons/            ícones SVG da interface
assets/img/logo/         logo-original.webp (enviada), logo-tio-dinho.png (fundo removido, mestre), .webp otimizadas
assets/img/favicon/      favicon.svg, PNGs 16–512, apple-touch-icon, maskable
assets/img/fotos/originais/   fotos enviadas pelo usuário (sem mexer)
assets/img/fotos/otimizadas/  versões WebP/JPEG redimensionadas usadas no site
docs/                    textos e conteúdo do site
```

## Status
Fase 1 concluída: estrutura, favicon e skill. **O site ainda NÃO deve ser codificado** até o usuário pedir.
Fotos recebidas (26) — principal: foto-05; plano em `docs/fotos.md`. Próximo: textos institucionais e, quando pedido, o site.
