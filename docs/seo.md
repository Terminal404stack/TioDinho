# SEO e indexação no Google

Endereço oficial: **https://sercapoeira.com.br/** (HTTPS, sem `www`). Atualizado em 19/11/2026.

## O que está no código
| Item | Onde | Regra |
|---|---|---|
| Título e descrição únicos | `<head>` de cada página | título 30–70 car., descrição 70–160 car. (testado em `tools/testes.js`) |
| Canonical absoluto | `<link rel="canonical">` | `https://sercapoeira.com.br/` + nome do arquivo (Início = raiz) |
| Idioma e viewport | `<html lang="pt-BR">`, `<meta name="viewport">` | em todas as páginas |
| Open Graph + Twitter | `og:*` e `twitter:*` | imagem `assets/img/og/og-padrao.jpg` 1200×630; Twitter espelha o OG |
| Dados estruturados | só em `index.html` | JSON-LD `Organization` + `WebSite` (array de objetos, cada um com `@context`) |
| Sitemap | `sitemap.xml` | 7 páginas públicas, URLs absolutas, **sem `lastmod`** (não inventar datas), sem a 404 |
| Robots | `robots.txt` | `Allow: /` + `Sitemap: https://sercapoeira.com.br/sitemap.xml`; não bloqueia CSS/JS/imagens |
| 404 | `404.html` | `noindex`, fora do sitemap |

**JSON-LD só com dados confirmados** (`docs/conteudo-institucional.md`): nome, nome curto, logo, imagem,
descrição, fundador (Elizomar Nascimento — Professor Dinho), área atendida (Juiz de Fora — MG) e
Instagram. **Não colocar** endereço, telefone, e-mail, CNPJ, avaliações, prêmios ou data de fundação
enquanto não forem confirmados. O JSON-LD não é script executável: não entra no hash da CSP.

## Cloudflare (fora do repositório — não alterar daqui)
A produção passa pela Cloudflare, que modifica o que o servidor entrega:
- **robots.txt gerenciado:** a Cloudflare acrescenta antes do nosso arquivo um bloco com `Content-Signal:
  search=yes,ai-train=no` e `Disallow` para robôs de IA (GPTBot, ClaudeBot, Google-Extended, GoogleOther…).
  **Googlebot não é bloqueado** (`User-agent: *` → `Allow: /`); `Google-Extended` só controla uso em IA.
- **Ofuscação de e-mail:** troca os `mailto:` por `/cdn-cgi/l/email-protection` e injeta
  `/cdn-cgi/scripts/…/email-decode.min.js` (mesmo domínio, permitido pela CSP). O e-mail volta ao normal no
  navegador. Por isso o hash do HTML em produção difere do commit — imagens e demais arquivos são idênticos.
- **Web Analytics (beacon):** a Cloudflare injeta `static.cloudflareinsights.com/beacon.min.js`. A CSP
  bloqueia (erro no console), o que mantém verdadeiro o aviso de privacidade ("sem estatística").
  Recomendado ao responsável: desligar a injeção automática do Web Analytics no painel da Cloudflare,
  ou, se quiser estatística, revisar o aviso de privacidade e a CSP antes.

## Google Search Console (precisa da conta Google do responsável)
1. Adicionar a propriedade **Domínio** `sercapoeira.com.br` (cobre http/https, com e sem www).
2. Verificar com o registro **TXT** que o Google mostrar, criado no DNS da Cloudflare pelo responsável.
3. Em **Sitemaps**, enviar `https://sercapoeira.com.br/sitemap.xml`.
4. Em **Inspeção de URL**, testar `https://sercapoeira.com.br/` e pedir indexação.

## Conferir em produção
`https://sercapoeira.com.br/robots.txt` e `https://sercapoeira.com.br/sitemap.xml` devem responder 200.
Páginas sem `noindex` e sem `X-Robots-Tag`. A 404 responde 404 com `noindex`.
