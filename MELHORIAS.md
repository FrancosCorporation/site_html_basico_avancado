# MELHORIAS — site_html_basico_avancado

> **Gerado por análise de código em 2026-10-05** · Stack: HTML/CSS/JS estático (era 2014-2015) · sem build · sem package.json
> Branch `main` · jQuery local 1.11.3 + Bootstrap 3.3.5 vendored (ambos não referenciados) · sem testes · sem CI
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata, critério de aceite e comando de verificação.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. **Site estático é legítimo** — não migrar para framework (§9). As decisões são: CDN morto, libs mortas/atualizadas, `.htaccess`.
4. **Idioma:** português.

---

## 1. Diagnóstico executivo

Coleção de páginas estáticas (index, Hannibal, HomeFilmes, Matrix, video) com assets vendored (jQuery 1.11.3, Bootstrap 3.3.5, masonry, magnific-popup, holder, shims IE) e GA inline.

**O que está bem (não regredir):**

| Item | Evidência |
|---|---|
| Sem servidor/back-end (superfície zero) | sem package.json/rotas |
| `.gitignore`, LICENSE, README | raiz |
| Páginas usam jQuery de CDN atualizado (3.5.1) | `Hannibal/Hannibal.html:247` |

**O que está quebrado:**

1. **CDN morto em produção:** `index.html:17-18` carrega `html5shiv`/`respond` de `oss.maxcdn.com` — serviço **desligado em 2018**; requests penduram ou 404 (e domínio morto é risco de sequestro DNS).
2. **Bibliotecas órfãs versionadas:** `assets/js/jquery.min.js` **v1.11.3** (2015, CVE-2015-9251/2019-11358/2020-11022) e `bootstrap/` **v3.3.5** (2015) — grep por referência nas páginas = **vazio** (jQuery local e Bootstrap não são carregados por nenhuma `.html`).
3. `tsconfig.json` órfão: não há **nenhum arquivo `.ts`** no projeto (`find -name '*.ts'` vazio); `out` nem é opção válida (é `outDir`).
4. `usaremcasode80-443.htaccess` redireciona **tudo** de :80 para `https://francoscorp.sytes.net/` (domínio hardcoded, sem HSTS, mata URLs internas).

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| SEC-01 | CDN morto `oss.maxcdn.com` (html5shiv/respond) | **P1** | `index.html:17-18` | — |
| SEC-02 | jQuery 1.11.3 + Bootstrap 3.3.5 (2015) vendored, não referenciados | **P2** | `assets/js/jquery.min.js`, `bootstrap/` | — |
| BUG-01 | `tsconfig.json` órfão (sem `.ts`; opção `out` inválida) | **P2** | `tsconfig.json` | — |
| BUG-02 | `.htaccess` redireciona tudo para domínio hardcoded | **P2** | `usaremcasode80-443.htaccess` | — |
| TEST-01 | Sem validação de HTML/links | **P2** | *(ausente)* | — |
| DEVOPS-01 | Sem CI | **P2** | *(ausente)* `.github/workflows/` | — |
| DOC-01 | README — inventário do que existe e do que é órfão | **P3** | `Readme.md` | — |
| IMP-01 | shims IE e holder.js em produção | **P3** | `index.html`, `assets/js/` | SEC-01 |

---

## 3. Segurança

### SEC-01 · CDN morto `oss.maxcdn.com` em `index.html` · [P1]

- **Arquivo:** `index.html:17-18`
- **Evidência:**
  ```html
  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  ```
  O CDN OSS da MaxCDN foi **desligado em 2018**. Em 2026 essas URLs não servem nada útil.
- **Impacto:** (a) requests que penduram agradam a page load; (b) domínio abandonado pode ser **registrado/seqüestrado** — se alguém servir JS por ali, ele executa no contexto do site (risco de supply-chain póstumo); (c) os shims são só para IE<9, público ~zero.
- **Mudança:** **remover as duas tags** (IE<9 não é alvo em 2026) — ou, se quiser preservar, copiar os arquivos para `assets/js/` locais.
- **Aceite:** nenhuma referência a `oss.maxcdn.com` no repo.
- **Verificação:**
  ```bash
  grep -rn 'oss.maxcdn' . --include='*.html' || echo OK
  ```

### SEC-02 · jQuery 1.11.3 e Bootstrap 3.3.5 (2015) — vendored e órfãos · [P2]

- **Arquivo:** `assets/js/jquery.min.js`, `bootstrap/css/bootstrap.css`, `bootstrap/js/`
- **Evidência:** cabeçalho `jQuery v1.11.3` (2015) e `Bootstrap v3.3.5` (2015). Grep por `assets/js/jquery` e `css/bootstrap` em todas as `.html` = **zero referências**. As páginas que usam jQuery carregam **3.5.1 via Google CDN** (`Hannibal.html:247`, `Matrix.html`).
- **Impacto:** bibliotecas com CVEs conhecidas (XSS em `html()`/`ajax`, prototype pollution) **moram no repo** convidando alguém a referenciá-las num HTML novo; confundem manutenção (duas versões de jQuery no mesmo site).
- **Mudança:** **apagar** `assets/js/jquery.min.js` e `bootstrap/` (confirmado sem referência); se algum uso aparecer num grep futuro, atualizar para 3.7.x em vez de ressuscitar a 1.11.3.
- **Aceite:** árvore sem as libs mortas; site continua idêntico (era órfã).
- **Verificação:**
  ```bash
  grep -rn 'assets/js/jquery\|bootstrap/css' . --include='*.html' || echo "sem referencia"
  ls assets/js/jquery.min.js bootstrap/ 2>/dev/null || echo "removidas"
  ```

---

## 4. Bugs e defeitos funcionais

### BUG-01 · `tsconfig.json` órfão · [P2]

- **Arquivo:** `tsconfig.json`
- **Evidência:** `find . -name '*.ts'` → **nenhum arquivo**; config usa `"out": "js/script.js"` (opção inexistente — o correto é `outDir`); `watch: true` não é opção de compilerOptions.
- **Impacto:** quem tentar `tsc` recebe erro; arquiteto sugere build TS que não existe (o `main/script.js` é JS puro).
- **Mudança:** remover o arquivo (não há TS) — ou, se o intenção era migrar `main/script.js` para TS, abrir item de feature à parte.
- **Aceite:** sem `tsconfig.json` órfão (ou com build TS real documentado).
- **Verificação:**
  ```bash
  find . -name '*.ts' -not -path './.vscode/*' | wc -l   # 0 ⇒ remover tsconfig
  ```

### BUG-02 · `.htaccess` redireciona tudo para domínio hardcoded · [P2]

- **Arquivo:** `usaremcasode80-443.htaccess`
- **Evidência:**
  ```apache
  RewriteCond %{SERVER_PORT} 80
  RewriteRule ^(.*)$ https://francoscorp.sytes.net/ [R,L]
  ```
  (1) destino é a **home do domínio**, não a URL pedida (`$1` é descartado) — `/Hannibal/` em :80 vira a home; (2) domínio `sytes.net` hardcoded — servir sob outro host quebra/move tráfego; (3) sem HSTS (a regra manda para HTTPS mas nada força HTTPS nas visitas seguintes).
- **Impacto:** perda de URLs (redirect para home), acoplamento a um host específico.
- **Mudança:** `RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]` + `Header always set Strict-Transport-Security` — ou remover o arquivo se não estiver em uso (o nome sugere "exemplo"; verificar se o servidor Apache de produção o lê).
- **Aceite:** `/qualquer` em :80 → `https://<host>/qualquer` (mantém path).
- **Verificação:**
  ```bash
  grep -n 'HTTP_HOST\|\$1' usaremcasode80-443.htaccess
  ```

---

## 5. Qualidade: testes

### TEST-01 · Sem validação de HTML nem link-check · [P2]

- **Arquivo:** *(ausente)* CI/validação
- **Evidência:** nenhuma checagem; páginas com HTML de 2014 sem tooling.
- **Impacto:** links quebrados (CDN morto do `SEC-01` passou anos) e HTML inválido sem sinal.
- **Mudança:** CI com `html-validate` (ou W3C API) + `lychee`/`markdown-link-check` para links externos.
- **Aceite:** CI acusa link morto.
- **Verificação:**
  ```bash
  npx html-validate index.html 2>&1 | tail -3
  ```

---

## 6. DevOps / Infra

### DEVOPS-01 · Sem CI · [P2]

- **Arquivo:** *(ausente)* `.github/workflows/`
- **Evidência:** nenhum workflow.
- **Impacto:** `SEC-01` (CDN morto) é exatamente o que um link-check automático pegaria.
- **Mudança:** workflow com link-check + html-validate (junto com `TEST-01`).
- **Aceite:** PR com link morto é bloqueado.
- **Verificação:**
  ```bash
  ls .github/workflows/
  ```

---

## 7. Documentação

### DOC-01 · README sem inventário do que é órfão · [P3]

- **Arquivo:** `Readme.md`
- **Evidência:** README descreve o site; não lista que `jquery.min.js` local, `bootstrap/`, `tsconfig.json` e os shims são resíduos.
- **Impacto:** quem herda o repo não sabe o que pode apagar com segurança.
- **Mudança:** seção "Inventário" (usado vs órfão) após executar `SEC-02`/`BUG-01`.
- **Aceite:** tabela usados/órfãos confere com a árvore.
- **Verificação:**
  ```bash
  grep -ni 'órfão\|inventário' Readme.md
  ```

### IMP-01 · Shims IE e holder.js em produção · [P3]

- **Arquivo:** `index.html` (linhas 17-18 — junto com `SEC-01`), `assets/js/holder.min.js`, `ie-emulation-modes-warning.js`, `ie10-viewport-bug-workaround.js`
- **Evidência:** shims para IE8-10 e placeholder de imagens (holder) — utilitários de dev da era Bootstrap.
- **Impacto:** peso morto; verifique por grep quais páginas os referenciam antes de apagar (o `SEC-01` já remove os de CDN).
- **Mudança:** grep de referência → remover não referenciados.
- **Aceite:** só assets carregados na árvore.
- **Verificação:**
  ```bash
  grep -rln 'holder.min\|ie-emulation' . --include='*.html' || echo "nao referenciados"
  ```

---

## 8. Ordem de execução (waves)

### Wave 1 — Rede (P1)
1. **`SEC-01`** — matar CDN morto.

### Wave 2 — Limpeza (P2)
2. **`SEC-02`** — apagar jQuery/Bootstrap órfãos (só depois do grep de confirmação).
3. **`BUG-01`** + **`BUG-02`** — tsconfig e .htaccess.
4. **`TEST-01`** + **`DEVOPS-01`** — link-check + CI.

### Wave 3 — Doc (P3)
5. **`DOC-01`** · **`IMP-01`**.

**Dependências:** `IMP-01` junto do `SEC-01` (mesmas tags) · `DOC-01` por último (inventário só faz sentido depois da limpeza).

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Migrar para React/Next | **Não** | Site estático é adequado ao conteúdo. |
| Atualizar Bootstrap usado nas páginas | **N/A hoje** | Bootstrap não é referenciado — será removido, não atualizado. |
| Trocar Google Analytics | **Decisão do dono** | GA inline em `index.html:88-103` — privacidade/LGPD é escolha de produto. |
| Subir jQuery local (1.11.3) para as páginas | **Nunca** | CDN 3.5.1 já é o que as páginas usam; 1.11.3 tem CVEs. |

**Riscos:** apagar `bootstrap/`/jquery local sem grep final pode quebrar página não órfã — rodar o grep do `SEC-02` antes do `rm`.

---

## 10. Definição de pronto (DoD)

**Segurança**
- [ ] `SEC-01` — zero `oss.maxcdn.com`
- [ ] `SEC-02` — jQuery 1.11.3 e Bootstrap 3.3.5 removidos (sem referência quebrada)

**Bugs**
- [ ] `BUG-01` — sem tsconfig órfão
- [ ] `BUG-02` — redirect mantém path + host correto

**Qualidade/infra/doc**
- [ ] `TEST-01` — html-validate + link-check rodando
- [ ] `DEVOPS-01` — CI no ar
- [ ] `DOC-01` — inventário no README
- [ ] `IMP-01` — shims mortos removidos

**Validação final:**
```bash
grep -rn 'oss.maxcdn\|jquery.min.js\|css/bootstrap' . --include='*.html' || echo OK
find . -name '*.ts' -not -path './.vscode/*' | wc -l
npx html-validate index.html 2>&1 | tail -3
```

---

*Fim do plano. Gerado por leitura direta do código em 2026-10-05. Nenhum item já estava corrigido — todos apontam para defeitos ainda presentes.*
