# Ferramentas de teste e manutenção

Ficam fora do site publicado (`_config.yml` exclui `tools/`). Precisam de Node.js com o Playwright
e o Chromium instalados (`npm i -g playwright && npx playwright install chromium`).

1. Na raiz do projeto, suba o site:
   ```bash
   python3 -m http.server 8080
   ```
2. Em outro terminal, rode o que precisar:

| Comando | O que verifica |
|---|---|
| `node tools/testes.js` | Funcional completo (495 verificações): 6 páginas × 7 larguras (320–1920px), rolagem lateral, H1, menu ativo, imagens, links e arquivos, menu do celular, teclado e foco, galeria e lightbox, pausar animações, movimento reduzido, sem JavaScript, PIX e cópia, galeria sem vãos, 404, robots.txt, simetria do cabeçalho, regressões da revisão de código (nomes antigos, manifest, rolagem vazia, iframe, VLibras) |
| `node tools/auditoria.js 404` | Varredura de qualidade: elementos vazios, seções vazias, `alt` ausente/duplicado, links sem destino, âncoras quebradas, textos cortados, alvos de toque, contraste de todos os textos |
| `node tools/pentest.js` | Segurança (62 verificações): injeção de script por URL, localStorage malicioso, alteração via DevTools × outro visitante, CSP presente e bloqueando scripts, clickjacking, arquivos sensíveis |
| `python3 tools/logo-nitida.py` | Regera `ser-capoeira.png` e `ser-capoeira-clara.png` a partir de `ser-capoeira-original.png` (depois gerar os `.webp` sem perda, ver `identidade-visual.md`) |

Validação extra:
```bash
npx html-validate *.html
```
```bash
npx stylelint "assets/css/*.css"
```
```bash
npx lighthouse http://localhost:8080/index.html --view
```

Resultado esperado: `FALHAS: 0` nos três scripts. Os avisos conhecidos e aceitos estão em
`docs/auditoria-frontend.md` e `docs/seguranca.md`.
