# Pendências institucionais

Itens que dependem do responsável (Professor Dinho). Nada disso foi inventado no site; cada ponto
indica onde entra quando for confirmado.

| # | Pendência | Situação no site | Onde atualizar |
|---|---|---|---|
| 1 | **Termos de autorização de imagem** | Autorização informada verbalmente pelo responsável em 18/11/2026 (ele e as crianças). Recomendado guardar os termos assinados pelos responsáveis legais (ECA/LGPD). | — |
| 2 | **Chave PIX** — ⚠️ conferir | QR Code **publicado** em `R7JvqK3bng.html` a pedido do usuário (18/11/2026), arquivo `assets/img/pix/qrcode-pix.png`. A chave dentro do QR é `dinho28_jf@yahoo.com.br` (com "o"); o e-mail de contato informado é `dinh28_jf@yahoo.com.br` (sem "o"). Confirmar qual está certo. Chave em texto + botão Copiar continuam ocultos. | Chave: `data-pix="CHAVE"` no bloco `.pix`; QR: substituir o arquivo |
| 3 | Demais dados de doação (titular, banco, valores sugeridos) | Não exibidos | `R7JvqK3bng.html` → seção Doações |
| 4 | Endereço completo / locais e horários das aulas | Só "Juiz de Fora — MG"; visitante é orientado a perguntar no WhatsApp | `tYXytz9wxv.html` e rodapé |
| 5 | Datas da Tardezinha Inclusiva e outros eventos | "Data a confirmar" / "Datas e detalhes em breve" | `HMktb9HjQE.html` |
| 6 | Números de impacto (alunos, anos de projeto, eventos) | Não exibidos (contadores animados previstos na skill) | `index.html` |
| 7 | Certificações / formação do Professor Dinho | Não exibidas | `x2dKgtNI0v.html` |
| 8 | Parceiros e apoiadores | "Parceiros em breve" | `HMktb9HjQE.html` |
| 9 | Prestação de contas / destinação de recursos | "Em preparação" | `R7JvqK3bng.html` → Transparência |
| 10 | Política de privacidade e textos legais | Não criados (o site não coleta dados, não usa cookies nem analytics; guarda apenas a preferência "Pausar animações" no navegador). VLibras é carregado só após clique. | Criar página com validação institucional |
| 11 | CNPJ / dados jurídicos (se houver) | Não exibidos | Rodapé |
| 12 | Domínio definitivo (também para `sitemap.xml` e `canonical`) | `og:image` usa caminho relativo; com o domínio, trocar por URL absoluta e adicionar `og:url`/`canonical` | `<head>` das 6 páginas |
| 13 | Foto do Professor Dinho | **Recebida** em 18/11/2026, no topo da página Sobre (`professor-dinho-*`) | — |
| 14 | Data de fundação / história detalhada | Não exibida | `x2dKgtNI0v.html` |
| 15 | **Logo em alta resolução** | A imagem enviada tem só 703 px de largura útil. Os arquivos foram refeitos sem perda e nunca são ampliados, mas para nitidez máxima em telas grandes, pedir a logo em **SVG/PDF ou PNG com 2000 px ou mais** | `assets/img/logo/` (regerar derivados) |
