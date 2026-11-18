# Checklist antes de entregar / commitar

## HTML
- [ ] `<html lang="pt-BR">`, `<meta charset>`, `viewport`, `<title>` e `description` únicos.
- [ ] Open Graph (`og:title`, `og:description`, `og:image` 1200×630) para compartilhar no WhatsApp/redes.
- [ ] Landmarks: `header`, `nav`, `main`, `footer`; um único `<h1>`; títulos sem pular nível.
- [ ] Link "Pular para o conteúdo" como primeiro item focável.
- [ ] Toda imagem com `alt` (decorativa: `alt=""`), `width` e `height`.
- [ ] Links externos com `rel="noopener"`; telefones `tel:`, WhatsApp `https://wa.me/`.
- [ ] `npx html-validate index.html` sem erros.

## CSS
- [ ] Cores/durações/espaços só via tokens de `:root`.
- [ ] Contraste ≥ 4.5:1 (texto) e ≥ 3:1 (texto grande e componentes) — ver `identidade-visual.md`.
- [ ] `:focus-visible` com contorno bem visível em todos os interativos.
- [ ] Funciona de 320 px a 1920 px sem rolagem horizontal; alvos de toque ≥ 44 px.
- [ ] Zoom de 200 % sem perder conteúdo.

## Animações
- [ ] Só `transform`/`opacity`; nenhuma mudança de layout (CLS ≈ 0).
- [ ] `prefers-reduced-motion: reduce` e botão "Pausar animações" testados — nada se move além de fades curtos.
- [ ] Sem JS (`javaScriptEnabled: false`) todo o conteúdo aparece.
- [ ] Nenhum loop infinito chamativo; nada pisca > 3×/s; carrossel sem autoplay ou com Pausar.
- [ ] Máximo 1 animação de destaque por seção.

## JavaScript
- [ ] Sem erros no console (Playwright `pageerror`).
- [ ] `localStorage` sempre em try/catch.
- [ ] Teclado: menu, diálogo da galeria e carrossel operáveis com Tab/Enter/Esc/setas; foco retorna ao fechar.

## Desempenho
- [ ] Imagem do topo sem `lazy` e com `fetchpriority="high"`; demais `loading="lazy"`.
- [ ] Fontes woff2 com `preload` só da fonte do título.
- [ ] Lighthouse ≥ 90 em Desempenho, Acessibilidade, Boas práticas e SEO.

## Privacidade e conteúdo
- [ ] Fotos sem EXIF; autorização de imagem confirmada para crianças/PcD.
- [ ] Textos revisados em português; chave PIX e contatos conferidos com o usuário.

## Depois
- [ ] `/code-review` no diff.
- [ ] Entrada nova em `.claude/MEMORIA.md`.
- [ ] Commit em português, descritivo.
