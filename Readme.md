# Francos Corporation — site estático

Coleção de páginas responsivas em HTML, CSS e JavaScript, sem etapa de build ou dependências npm. O catálogo reúne páginas de Hannibal e da trilogia Matrix; o player genérico reproduz um vídeo escolhido no dispositivo, sem fazer upload.

## Abrir o site

Sirva a pasta raiz com um servidor HTTP local:

```bash
python3 -m http.server --bind 127.0.0.1 8000
```

Depois, abra `http://localhost:8000`. Para testar o player local, acesse `/video.html` e escolha um arquivo de vídeo. Alguns navegadores restringem recursos quando a página é aberta diretamente como `file://`.

## Páginas

| Página | O que oferece |
|---|---|
| `index.html` | Página inicial, catálogo e contato pelo WhatsApp |
| `HomeFilmes/homeFilmes.html` | Seleção de Hannibal ou trilogia Matrix |
| `Hannibal/Hannibal.html` | Seleção de temporada e episódio com controles nativos de vídeo |
| `MatrixTrilogia/Matrix.html` | Seleção de filme, player nativo e suporte a legendas VTT |
| `video.html` | Player para um arquivo de vídeo local |

## Arquivos principais

```text
.
├── index.html                 # início e navegação
├── styleindex.css             # estilos da página inicial
├── HomeFilmes/
│   ├── homeFilmes.html        # catálogo
│   └── sss.css                # estilos do catálogo
├── Hannibal/Hannibal.html     # seleção de episódios
├── MatrixTrilogia/Matrix.html # seleção de filmes
├── main/
│   ├── script.js              # seleção de títulos e fontes do player
│   └── style.css              # estilos dos players de títulos
├── video.html                # player para arquivo local
├── video-player.js           # seleção e ciclo de vida do arquivo local
├── video.css                 # estilos do player genérico
├── images/                   # logo e imagens de capa
└── usaremcasode80-443.htaccess # exemplo de redirecionamento Apache
```

## Mídia do catálogo

Os vídeos não estão versionados neste repositório. As páginas de Hannibal e Matrix apontam para arquivos no servidor de mídia configurado no HTML; atualize esses caminhos se o domínio ou a localização dos arquivos mudar. A página `video.html` é independente e usa o arquivo selecionado no navegador.

`usaremcasode80-443.htaccess` é um exemplo e não é carregado pelo Apache com esse nome. Ajuste o domínio de destino antes de renomeá-lo para `.htaccess` em um servidor.

## Revisão antes de publicar

- O link do WhatsApp contém um número de telefone público; confirme que continua sendo o contato correto.
- O código ainda contém identificadores legados do Google Analytics; confirme a configuração de privacidade e medição antes de publicar.

## Licença

MIT — consulte [LICENSE](LICENSE).
