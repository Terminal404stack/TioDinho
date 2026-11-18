# Pendências institucionais

Itens que dependem do responsável (Professor Dinho). Nada disso foi inventado no site; cada ponto
indica onde entra quando for confirmado.

| # | Pendência | Situação no site | Onde atualizar |
|---|---|---|---|
| 1 | **Termos de autorização de imagem** | Autorização informada verbalmente pelo responsável em 18/11/2026 (ele e as crianças). Recomendado guardar os termos assinados pelos responsáveis legais (ECA/LGPD). | — |
| 2 | Chave PIX | ✅ **Resolvida** em 18/11/2026: chave `dinho28_jf@yahoo.com.br` (com "o") confirmada e QR testado; o e-mail de contato `dinh28_jf@yahoo.com.br` (sem "o") também está certo. Chave em texto + botão Copiar publicados | — |
| 3 | Demais dados de doação (titular, banco, valores sugeridos) | Não exibidos | `R7JvqK3bng.html` → seção Doações |
| 4 | Endereço completo / locais e horários das aulas | Só "Juiz de Fora — MG"; visitante é orientado a perguntar no WhatsApp | `tYXytz9wxv.html` e rodapé |
| 5 | Datas da Tardezinha Inclusiva e outros eventos | "Data a confirmar" / "Datas e detalhes em breve" | `HMktb9HjQE.html` |
| 6 | Números de impacto (alunos, anos de projeto, eventos) | Não exibidos (contadores animados previstos na skill) | `index.html` |
| 7 | Certificações / formação do Professor Dinho | Não exibidas | `x2dKgtNI0v.html` |
| 8 | Parceiros e apoiadores | "Parceiros em breve" | `HMktb9HjQE.html` |
| 9 | Prestação de contas / destinação de recursos | "Em preparação" | `R7JvqK3bng.html` → Transparência |
| 10 | Aviso de privacidade | ✅ **Publicado** (`Rgw7Xw9lXM.html`, link no rodapé) com texto factual sobre o que o site faz. Recomendada revisão institucional/jurídica | `Rgw7Xw9lXM.html` |
| 11 | CNPJ / dados jurídicos (se houver) | Não exibidos | Rodapé |
| 12 | Endereço do site | ✅ **Definido**: `https://terminal404stack.github.io/TioDinho/` (canonical, og:url, og:image absolutos, `sitemap.xml`; a 404 funciona em qualquer pasta). Falta ligar o GitHub Pages em *Settings → Pages → main*. Como o site fica numa subpasta, o Google não lê o `robots.txt` dali: enviar o `sitemap.xml` pelo Google Search Console. Se mudar para domínio próprio, trocar o endereço nas 8 páginas (canonical/og), no sitemap e no robots | `<head>` das páginas, `sitemap.xml`, `404.html` |
| 13 | Foto do Professor Dinho | **Recebida** em 18/11/2026, no topo da página Sobre (`professor-dinho-*`) | — |
| 14 | Data de fundação / história detalhada | Não exibida | `x2dKgtNI0v.html` |
| 15 | **Logo em alta resolução** | A imagem enviada tem só 703 px de largura útil. Os arquivos foram refeitos sem perda e nunca são ampliados, mas para nitidez máxima em telas grandes, pedir a logo em **SVG/PDF ou PNG com 2000 px ou mais** | `assets/img/logo/` (regerar derivados) |
| 16 | **Endereço final × deploy no servidor próprio** | O workflow `.github/workflows/deploy-sercapoeira.yml` (enviado pelo usuário) publica no servidor `204.157.108.41` (`/var/www/sercapoeira`), mas o endereço informado foi o GitHub Pages. Se o site oficial for o do servidor, informar o domínio para trocar canonical/og:url/sitemap/robots. Para o deploy funcionar, cadastrar os Secrets `DEPLOY_SSH_KEY` e `DEPLOY_KNOWN_HOSTS` | `<head>` das páginas, `sitemap.xml`, `robots.txt` |
