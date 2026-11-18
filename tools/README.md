# Ferramentas de teste e manutenção

Ficam fora do site publicado (`_config.yml` exclui `tools/`). Precisam de Node.js com o Playwright
e o Chromium instalados (`npm i -g playwright && npx playwright install chromium`).

1. Na raiz do projeto, suba o site (é o que o CI `.github/workflows/deploy-sercapoeira.yml` faz):
   ```bash
   python3 -m http.server 8080
   ```
   Para testar outro endereço (ex.: GitHub Pages em subpasta), sirva a pasta de cima e use a variável `BASE`:
   ```bash
   BASE=http://localhost:8081/TioDinho/ node tools/testes.js
   ```
2. Em outro terminal, rode o que precisar:

| Comando | O que verifica |
|---|---|
| `node tools/testes.js` | Funcional completo (568 verificações): 6 páginas × 7 larguras (320–1920px), rolagem lateral, H1, menu ativo, imagens, links e arquivos, menu do celular, teclado e foco, galeria e lightbox, pausar animações, movimento reduzido, sem JavaScript, PIX e cópia, galeria sem vãos, 404, robots.txt, simetria do cabeçalho, regressões da revisão de código (nomes antigos, manifest, rolagem vazia, iframe, VLibras) |
| `node tools/auditoria.js 404` | Varredura de qualidade: elementos vazios, seções vazias, `alt` ausente/duplicado, links sem destino, âncoras quebradas, textos cortados, alvos de toque, contraste de todos os textos |
| `node tools/pentest.js` | Segurança (62 verificações): injeção de script por URL, localStorage malicioso, alteração via DevTools × outro visitante, CSP presente e bloqueando scripts, clickjacking, arquivos sensíveis |
| `node tools/responsivo.js [pasta]` | Todas as páginas em 24 telas reais (celular 320–430, celular deitado, tablets, notebooks, monitores até 3440px) + texto 200%, alto contraste e tema escuro: rolagem lateral, elementos fora da tela, sobreposição no cabeçalho e nos heros, fonte < 12px, imagem distorcida ou ampliada, linhas longas, botão principal abaixo da dobra. Com `[pasta]`, salva capturas da Início |
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
