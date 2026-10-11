# MELHORIAS — site_html_basico_avancado

> Revisado em 2026-10-11 · HTML/CSS/JavaScript estático · branch `master` · sem build.
> Implementação concluída para SEC-01/02/03, BUG-01/02/03, UX-01, DOC-01 e IMP-01.
> TEST-01 e DEVOPS-01 continuam pendentes.

## 0. Como usar este documento

1. Siga P0 → P1 → P2 → P3.
2. Ao concluir um item, marque o estado e registre o commit.
3. O projeto permanece estático, sem framework ou etapa de build.
4. O conteúdo das mídias de Hannibal e Matrix não está neste repositório.

## 1. Diagnóstico executivo

O repositório contém a página inicial, o catálogo, páginas de seleção de Hannibal e Matrix e um player genérico. As páginas agora usam CSS próprio e controles nativos de vídeo. O player genérico seleciona um arquivo do dispositivo e não o envia a um servidor.

As páginas de Hannibal e Matrix ainda dependem das URLs de mídia externas gravadas nelas. A configuração legada do Google Analytics e o número do WhatsApp foram preservados para revisão do responsável pelo site.

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Estado |
|---|---|---:|---|---|
| SEC-01 | Remover shims IE de CDN legado | P1 | `index.html` | Concluído |
| SEC-02 | Remover bibliotecas antigas sem uso | P2 | `assets/`, `bootstrap/` | Concluído após retirar referências |
| SEC-03 | Limitar o servidor HTTP local ao loopback | P2 | `Readme.md` | Concluído |
| BUG-01 | Remover configuração TypeScript órfã | P2 | `tsconfig.json` | Concluído |
| BUG-02 | Preservar caminho na regra Apache | P2 | `usaremcasode80-443.htaccess` | Concluído |
| BUG-03 | Corrigir seleção e carregamento dos players | P2 | `main/script.js`, páginas de título | Concluído |
| UX-01 | Tornar o player genérico utilizável | P2 | `video.html`, `video-player.js`, `video.css` | Concluído |
| TEST-01 | Validar HTML e links | P2 | — | Pendente |
| DEVOPS-01 | Adicionar CI | P2 | `.github/workflows/` | Pendente |
| DOC-01 | Atualizar inventário e instruções | P3 | `Readme.md` | Concluído |
| IMP-01 | Remover shims e plugins sem uso | P3 | `assets/`, `bootstrap/` | Concluído |

## 3. Segurança

### SEC-01 · Shims IE de CDN legado · [P1] — concluído

- **Arquivo:** `index.html` (antigas linhas 17–18)
- **Evidência:** a versão anterior carregava `html5shiv` e `respond` de `oss.maxcdn.com`.
- **Mudança:** removidas as tags junto com a navegação antiga baseada em um template que as exigia.
- **Aceite:** nenhum HTML aponta para `oss.maxcdn.com`.
- **Verificação:** `rg -n 'oss\.maxcdn\.com' --glob '*.html' .` não encontra referências.

### SEC-02 · Bibliotecas antigas sem uso · [P2] — concluído

- **Arquivo:** antigos `assets/js/jquery.min.js`, `bootstrap/` e plugins em `assets/`
- **Evidência:** a landing e os players foram revisados; não há referências remanescentes às bibliotecas.
- **Mudança:** removido o bundle antigo após substituir a landing e usar controles nativos de vídeo.
- **Aceite:** HTML, CSS e JavaScript não referenciam o bundle removido.
- **Verificação:** `rg -n 'assets/|bootstrap/|jquery\.min|holder|masonry|magnific|odometer|pushy|wow' --glob '*.{html,css,js}' .` não encontra referências.

### SEC-03 · Servidor HTTP local escutava em todas as interfaces · [P2] — concluído

- **Arquivo:** `Readme.md:10`.
- **Evidência:** o comando documentado `python3 -m http.server 8000` não restringia o bind ao loopback.
- **Impacto:** a prévia estática poderia aceitar conexões de outros dispositivos na rede local.
- **Mudança:** o comando agora inclui `--bind 127.0.0.1`.
- **Aceite:** o servidor documentado escuta apenas na máquina local.
- **Verificação:** conferir `python3 -m http.server --bind 127.0.0.1 8000` na seção “Abrir o site”.

## 4. Bugs e experiência de uso

### BUG-01 · Configuração TypeScript órfã · [P2] — concluído

- **Arquivo:** `tsconfig.json`
- **Evidência:** não havia arquivos TypeScript; a configuração tinha opções inválidas para `compilerOptions`.
- **Mudança:** removido o arquivo sem uso.
- **Aceite:** não há configuração TypeScript sem código TypeScript correspondente.
- **Verificação:** `find . -name '*.ts' -not -path './.git/*'` não encontra arquivos.

### BUG-02 · Regra Apache descartava o caminho · [P2] — concluído

- **Arquivo:** `usaremcasode80-443.htaccess:1`
- **Evidência:** a regra antiga redirecionava qualquer URL para a raiz do domínio.
- **Mudança:** a regra preserva `%{REQUEST_URI}` e usa o domínio canônico existente. O arquivo mantém o nome de exemplo e não é ativado automaticamente.
- **Aceite:** o destino inclui o caminho solicitado; o domínio deve ser ajustado se o host de publicação mudar.
- **Verificação:** conferir a regra `RewriteRule` e a nota de ativação no arquivo.

### BUG-03 · Seleção e carregamento do vídeo · [P2] — concluído

- **Arquivo:** `main/script.js:1`
- **Evidência:** a versão anterior tentava acessar elementos inexistentes ao selecionar a opção inicial e chamava `document.refresh()`, que não existe.
- **Mudança:** a seleção agora trata ausência de título, mostra apenas a lista escolhida, atualiza a fonte do vídeo e configura legendas quando disponíveis. jQuery e o JS de demonstração do Plyr foram removidos.
- **Aceite:** as páginas de Hannibal e Matrix usam os controles nativos do navegador sem chamar `document.refresh()`.
- **Verificação:** conferir as referências a `setSrc`, `player.load()` e ao estado `hidden` nas páginas e no script.

### UX-01 · Player genérico · [P2] — concluído

- **Arquivo:** `video.html:1`
- **Evidência:** a página anterior não tinha fonte selecionável, apontava para `back.css` ausente e carregava o script de demonstração do Plyr.
- **Mudança:** adicionados seletor de arquivo local, estado acessível, controles nativos, feedback de formato não suportado e liberação da URL temporária.
- **Aceite:** a página permite selecionar um vídeo local sem upload.
- **Verificação:** conferir o `input[type=file]`, `URL.createObjectURL` e `URL.revokeObjectURL`.

## 5. Qualidade

### TEST-01 · Validação automática de HTML e links · [P2] — pendente

- **Arquivo:** ferramenta de validação ainda não configurada.
- **Evidência:** o projeto não possui validação automática.
- **Mudança planejada:** adotar validação de HTML e links externos.
- **Aceite:** a validação documentada aponta erros e links quebrados.
- **Verificação planejada:** definir após escolher e configurar as ferramentas.

## 6. DevOps / Infra

### DEVOPS-01 · CI · [P2] — pendente

- **Arquivo:** `.github/workflows/` ainda não existe.
- **Evidência:** não há workflow de validação.
- **Mudança planejada:** adicionar workflow estático depois de definir a validação do TEST-01.
- **Aceite:** mudanças propostas passam pela validação automática.
- **Verificação planejada:** conferir o workflow após sua implementação.

## 7. Documentação

### DOC-01 · Instruções e inventário · [P3] — concluído

- **Arquivo:** `Readme.md:1`
- **Evidência:** a documentação anterior listava dependências que não eram carregadas e um player genérico vazio.
- **Mudança:** README reescrito com páginas, arquivos, execução local, dependência das mídias externas e itens para revisar antes de publicar.
- **Aceite:** o README descreve os arquivos e o comportamento atual.
- **Verificação:** comparar a árvore com as seções “Páginas” e “Arquivos principais”.

### IMP-01 · Shims e plugins legados sem uso · [P3] — concluído

- **Arquivo:** antigos `assets/` e `bootstrap/`
- **Evidência:** os scripts e estilos do template antigo não eram usados pelas páginas finais.
- **Mudança:** removidos após tirar as referências do HTML e substituir a interação por código nativo.
- **Aceite:** nenhum asset legado permanece referenciado.
- **Verificação:** usar o comando de referência do SEC-02.

## 8. Ordem e execução

1. SEC-01: remoção do CDN legado.
2. SEC-02 e IMP-01: remoção de dependências após substituir as páginas.
3. BUG-01, BUG-02, BUG-03 e UX-01: configuração órfã, URLs, seleção e player.
4. DOC-01: instruções atualizadas.
5. TEST-01 e DEVOPS-01 permanecem como próximos itens.

## 9. Fora de escopo e decisões preservadas

| Item | Decisão | Motivo |
|---|---|---|
| Migrar para framework | Não | O site é estático e não precisa de build. |
| Incluir as mídias no Git | Não | Vídeos externos não fazem parte deste repositório. |
| Trocar o Google Analytics | Revisão do responsável | Identificador legado preservado por ser uma decisão de medição e privacidade. |
| Alterar o telefone do WhatsApp | Revisão do responsável | O número existente foi preservado e documentado. |
| TEST-01 e DEVOPS-01 | Pendentes | A validação e a CI não foram adicionadas nesta execução. |

## 10. Definição de pronto

- [x] SEC-01 — shims de CDN removidos.
- [x] SEC-02 — bibliotecas sem uso removidas após revisão das referências.
- [x] SEC-03 — servidor HTTP documentado limitado ao loopback.
- [x] BUG-01 — `tsconfig.json` removido.
- [x] BUG-02 — redirecionamento preserva o caminho.
- [x] BUG-03 — lista e player corrigidos.
- [x] UX-01 — player genérico seleciona arquivo local.
- [ ] TEST-01 — validação HTML/links pendente.
- [ ] DEVOPS-01 — CI pendente.
- [x] DOC-01 — README atualizado.
- [x] IMP-01 — assets antigos removidos.
