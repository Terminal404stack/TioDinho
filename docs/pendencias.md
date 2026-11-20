# Pendências institucionais

Itens que dependem do responsável (Professor Dinho). Nada disso foi inventado no site; cada ponto
indica onde entra quando for confirmado.

| # | Pendência | Situação no site | Onde atualizar |
|---|---|---|---|
| 1 | **Termos de autorização de imagem** | Autorização informada verbalmente pelo responsável em 18/11/2026 (ele e as crianças). Recomendado guardar os termos assinados pelos responsáveis legais (ECA/LGPD). | — |
| 2 | Chave PIX | ✅ **Resolvida** em 18/11/2026: chave `dinho28_jf@yahoo.com.br` (com "o") confirmada e QR testado; o e-mail de contato `dinh28_jf@yahoo.com.br` (sem "o") também está certo. Chave em texto + botão Copiar publicados | — |
| 3 | Demais dados de doação (titular, banco, valores sugeridos) | Não exibidos | `R7JvqK3bng.html` → seção Doações |
| 4 | Endereço completo / locais e horários das aulas | Só "Juiz de Fora — MG"; visitante é orientado a perguntar no WhatsApp | `tYXytz9wxv.html` e rodapé |
| 5 | Datas da Tardezinha Inclusiva e outros eventos | "Data a confirmar" / "Datas e detalhes em breve" | `f9N8KaE8WP.html` (página de Eventos pronta em 19/11/2026; ver `docs/eventos.md`) |
| 6 | Números de impacto (alunos, anos de projeto, eventos) | Não exibidos (contadores animados previstos na skill) | `index.html` |
| 7 | Certificações / formação do Professor Dinho | Não exibidas | `x2dKgtNI0v.html` |
| 8 | Parceiros e apoiadores | ✅ Patrocinadores oficiais publicados em 20/11/2026 (Terminal404 e Besouro Capoeira), página `Pbmns2SGtY.html`, sem links (pedido do usuário) | `Pbmns2SGtY.html` |
| 9 | Prestação de contas / destinação de recursos | "Em preparação" | `R7JvqK3bng.html` → Transparência |
| 10 | Aviso de privacidade | ✅ **Publicado** (`Rgw7Xw9lXM.html`, link no rodapé) com texto factual sobre o que o site faz. Recomendada revisão institucional/jurídica | `Rgw7Xw9lXM.html` |
| 11 | CNPJ / dados jurídicos (se houver) | Não exibidos | Rodapé |
| 12 | Endereço do site | ✅ **Resolvido** em 19/11/2026: domínio oficial `https://sercapoeira.com.br/` (canonical, og:url, og:image, `sitemap.xml`, `robots.txt`); a 404 funciona na raiz | — |
| 13 | Foto do Professor Dinho | **Recebida** em 18/11/2026, no topo da página Sobre (`professor-dinho-*`) | — |
| 14 | Data de fundação / história detalhada | Não exibida | `x2dKgtNI0v.html` |
| 15 | **Logo em alta resolução** | A imagem enviada tem só 703 px de largura útil. Os arquivos foram refeitos sem perda e nunca são ampliados, mas para nitidez máxima em telas grandes, pedir a logo em **SVG/PDF ou PNG com 2000 px ou mais** | `assets/img/logo/` (regerar derivados) |
| 16 | Endereço final × deploy | ✅ **Resolvido**: o site oficial é o do servidor próprio (`sercapoeira.com.br`), publicado pelo workflow `deploy-sercapoeira.yml` | — |
| 17 | **Google Search Console** | Site pronto para indexação (sitemap, robots, canonical, JSON-LD). O cadastro exige a conta Google do responsável e a verificação do domínio por registro TXT no DNS da Cloudflare — passo a passo em `docs/seo.md` | Painel do Google + Cloudflare |
| 18 | `www.sercapoeira.com.br` responde 200 com o mesmo conteúdo | O canonical aponta para o endereço sem `www`, então o Google consolida; o ideal é um redirecionamento 301 `www` → sem `www` (regra na Cloudflare ou no site do Nginx — fora do repositório) | Cloudflare / servidor |
| 19 | Beacon do Cloudflare Web Analytics injetado pela borda | Bloqueado pela CSP (erro no console). Desligar a injeção automática no painel da Cloudflare, ou revisar o aviso de privacidade antes de liberar | Cloudflare |
