# site_html_basico_avancado

## 🐳 Instalação e Execução (Docker) — recomendado

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose

### Rodar com Docker
```bash
docker compose up --build
```
Para servir via container:
```bash
docker run --rm -p 8080:80 -v $(pwd):/usr/share/nginx/html:ro nginx:alpine
```

### Sem Docker (local)
```bash
# abre o index.html no navegador
open index.html
```

**Projeto de estudo** de HTML e CSS — site estático com páginas temáticas de filmes e um player de vídeo customizado, desenvolvido em fevereiro de 2021.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-3-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Status](https://img.shields.io/badge/status-projeto%20de%20estudo-blue)

## Sobre

Exercício de front-end estático feito para praticar HTML, CSS, Bootstrap 3 e plugins jQuery: monta uma "Francos Corporation" com menu lateral deslizante, seções animadas, páginas de filmes (Hannibal, Matrix, HomeFilmes) e um player de vídeo com a biblioteca Plyr. Não há back-end nem build obrigatório — é uma coleção de páginas abertas direto no navegador.

## Funcionalidades

Comprovadas pelos arquivos versionados:

- `index.html` — landing com jumbotron, logo, menu lateral "pushy" e botões para a página de filmes e WhatsApp;
- `HomeFilmes/homeFilmes.html`, `Hannibal/Hannibal.html` e `MatrixTrilogia/Matrix.html` — páginas temáticas com CSS próprio;
- `video.html` — player de vídeo usando [Plyr](https://plyr.io/) via CDN (o `<source>` está vazio e deve ser apontado para o arquivo `.mp4` desejado);
- `assets/` — jQuery e plugins de UI (Pushy, Masonry, Magnific Popup, WOW/Animate, Odometer) com os respectivos CSS;
- `usaremcasode80-443.htaccess` — regra de rewrite para forçar HTTPS no host `francoscorp.sytes.net`;
- `tsconfig.json` — configuração usada para compilar `main/script.js` a partir de TypeScript.

## Stack

- **HTML5** e **CSS3** puros
- **Bootstrap 3** local (`bootstrap/`)
- **jQuery** + plugins: Pushy, Masonry, Magnific Popup, WOW/Animate.css, Odometer
- **Plyr** (player de vídeo via CDN)
- Fontes e ícones via CDN (Google Fonts, Typicons, Font Awesome) e snippet do Google Analytics

## Como rodar

Não requer build. Basta abrir o `index.html` no navegador ou servir a pasta:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

Para o player de vídeo, edite `video.html` e informe o caminho do `.mp4` em `<source src="...">`. A página referencia um `back.css` que não está versionado — o visual principal vem do CSS do Plyr (CDN).

## Estrutura do projeto

```
.
├── index.html                 # landing page
├── video.html                 # player de vídeo (Plyr)
├── styleindex.css             # estilos da landing
├── Hannibal/                  # página temática
├── HomeFilmes/                # página temática + css
├── MatrixTrilogia/            # página temática
├── main/                      # script.js + style.css de apoio
├── assets/                    # jQuery, plugins e CSS de terceiros
├── bootstrap/                 # Bootstrap 3 local (css, js, fonts)
├── images/                    # imagens usadas nas páginas
└── usaremcasode80-443.htaccess
```

## Observações

- Páginas de estudo, sem acessibilidade/responsividade revisadas a fundo.
- O `index.html` contém um link de WhatsApp com número pessoal e um ID antigo do Google Analytics (`UA-34344036-1`); se o site for publicado, vale revisar esses dados.

## Licença

MIT — veja [LICENSE](LICENSE).
