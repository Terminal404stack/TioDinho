# Segurança do site (pentest de 18/11/2026)

Site 100% estático (HTML, CSS e JavaScript), sem back-end, sem banco de dados, sem login e sem
formulário. Não guarda dados de visitantes. A única informação gravada no navegador é a preferência
"Pausar animações".

## Pergunta: alguém consegue trocar o título, os textos ou o QR Code do PIX?
**Pelo site, não.** Testado:
- Um visitante pode alterar a página **só no próprio navegador** (pelo "Inspecionar elemento"). Isso
  não muda nada para outras pessoas e desaparece ao recarregar. No teste, título, texto e QR foram
  alterados em uma janela e uma segunda janela continuou mostrando o original.
- Mudar o site de verdade exige **acesso de escrita ao repositório no GitHub** (ou à hospedagem). A
  proteção real é proteger essa conta.

### Recomendações para quem administra
1. Ativar **verificação em duas etapas (2FA)** na conta do GitHub de quem tem acesso.
2. Conferir em *Settings → Collaborators* quem tem acesso de escrita e remover quem não precisa.
3. Proteger a branch publicada (*Settings → Branches*), exigindo revisão antes de mudanças.
4. De tempos em tempos, fazer um PIX de teste de R$ 0,01 pelo QR do site e conferir o recebedor.
5. Manter o aviso "Doe com segurança: confira o recebedor no app do banco" na página Ajude.

## O que foi testado (62 verificações, 0 falhas)
| Ataque | Resultado |
|---|---|
| Injeção de script pela URL (`?q=<script>`, `#<img onerror>`, `#javascript:`, `__proto__`), 6 variações × 7 páginas | Nada executa |
| Valor malicioso no armazenamento do navegador (`localStorage`) | Ignorado |
| Script externo injetado na página | Bloqueado pela política de segurança (CSP) |
| Script inline injetado | Bloqueado pela CSP |
| Site exibido dentro de outro site (clickjacking) | A página fica coberta por um aviso com link para o site oficial |
| Arquivos sensíveis (`.env`, configurações locais) | Não existem / não publicados |
| Links externos (`target=_blank`) | Todos com `rel="noopener"` |
| Segredos no repositório (chaves, senhas, tokens) | Nenhum |

Análise do código: nenhum uso perigoso de `eval`, `document.write` ou HTML vindo de fora. O único
`innerHTML` usa um texto fixo (o contêiner do VLibras).

## Proteções aplicadas
- **Content-Security-Policy** (meta tag em todas as páginas): scripts só do próprio site, do hash do
  script inline do `<head>` e do VLibras (`vlibras.gov.br`); `object-src 'none'`, `frame-src 'none'`,
  `base-uri 'self'`, `form-action 'none'`.
  - **Importante:** se o script inline do `<head>` mudar, o hash
    `sha256-TiQm6U7OAOW467bHSWY6hErq4DQFSY4yX0/Hxpicv/Q=` precisa ser recalculado nas 7 páginas.
  - Para o avatar do VLibras (Unity/WebAssembly) funcionar, a CSP permite `'unsafe-eval'` e
    `'wasm-unsafe-eval'`. Como só scripts do próprio site e do VLibras podem rodar, o risco é baixo.
    O carregamento real do VLibras não pôde ser testado neste ambiente (o domínio é bloqueado aqui).
    Testar em produção ao clicar em "Ativar Libras".
- **Referrer-Policy** `strict-origin-when-cross-origin`.
- **Anti-clickjacking** em JavaScript (`protegerMoldura` em `assets/js/main.js`).
- **`_config.yml`**: o GitHub Pages não publica `docs/`, `tools/`, `CLAUDE.md`, as **fotos originais** e os arquivos-mestre das logos. As pastas `.git/`
  e `.claude/` (que começam com ponto) já não são publicadas.
- Formulário de contato **removido** (o site não tem back-end).

## Limitações do GitHub Pages
O GitHub Pages não permite configurar cabeçalhos HTTP (`X-Frame-Options`, `Content-Security-Policy`
por cabeçalho, `Strict-Transport-Security` personalizado). Por isso usamos as meta tags e o aviso em
JavaScript. Se um dia quiserem os cabeçalhos completos, dá para colocar o Cloudflare (plano gratuito)
na frente do domínio.
