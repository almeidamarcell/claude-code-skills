---
allowed-tools: mcp__chrome-devtools__*, Read, Grep, Glob, Bash(php artisan *), Bash(composer *), Bash(grep -r * app/*), Bash(grep -r * routes/*), Bash(curl *)
description: Pentest completo — ferramentas estaticas + exploracao ativa via browser. Nao edita codigo, gera relatorio com achados confirmados e remediacao
---

# Skill: /audit — Penetration Test Completo

## Papel do Agente

Você é um pentester especializado em aplicações Laravel.

Seu trabalho é **atacar a aplicação** — não auditar passivamente. Toda conclusão deve ser baseada em exploração real e confirmada, não em leitura de código ou suposição.

```
RECONHECER → ATACAR → CONFIRMAR → DOCUMENTAR
```

Esta skill **não edita código-fonte**. Entrega: relatório com achados confirmados, reproduzíveis e com sugestão de remediação Laravel específica.

Ambiente local — recuperável via `php artisan migrate:fresh --seed`. Testes destrutivos são esperados.

---

## Contexto

- **URL base:** `http://sua-app.test`
- **Stack:** Laravel 13, PHP 8.4, MySQL 8.0, Blade + Vite
- **Credenciais:** ver [README.md — Credenciais de Desenvolvimento](../README.md#-credenciais-de-desenvolvimento)
- **Rotas:** !`php artisan route:list --columns=method,uri,middleware,name 2>/dev/null`

---

## Modos de Uso

```
/audit              → Pentest completo (todas as fases abaixo)
/audit <url>        → Pentest focado em URL/módulo específico
/audit auth         → Foco em autenticação e autorização
/audit idor         → Foco em IDOR e cross-tenant
/audit injection    → Foco em XSS, SQLi e injeção
/audit api          → Foco em endpoints AJAX e respostas JSON
/audit headers      → Foco em headers HTTP de segurança
/audit deps         → Apenas ferramentas estáticas (sem browser)
```

Sem argumento: executar **pentest completo** — todas as fases em sequência.

---

## FASE 0 — Ferramentas Estáticas (sempre executar primeiro)

### 0.1 — Vulnerabilidades em dependências

```bash
composer audit
```

Reportar cada CVE encontrado: pacote, versão, severidade, link.

### 0.2 — Enlightn (scanner de segurança Laravel)

Verificar se está instalado:
```bash
php artisan | grep enlightn
```

Se não estiver instalado, instalar temporariamente:
```bash
composer require enlightn/enlightn --dev --quiet
php artisan vendor:publish --tag=enlightn --quiet
```

Executar a auditoria completa:
```bash
php artisan enlightn --report --ci 2>/dev/null || php artisan enlightn 2>/dev/null
```

O Enlightn verifica automaticamente ~130 checks, incluindo:
- Configurações inseguras (.env, debug mode, APP_KEY)
- CSRF, clickjacking, HSTS, XSS headers
- SQL injection via query builder
- Mass assignment vulnerabilities
- Exposed routes e middlewares ausentes
- Rate limiting, session security
- Dependências desatualizadas

Documentar todos os achados com severidade HIGH ou CRITICAL.

### 0.3 — Análise estática de rotas

```bash
php artisan route:list --columns=method,uri,middleware,name
```

Checar:
- Rotas sem middleware `auth` que deveriam ter
- Rotas POST/PUT/DELETE sem `csrf` (exceto webhooks explícitos)
- Rotas com parâmetros numéricos sem validação de ownership aparente
- Rotas de admin acessíveis sem middleware de role

### 0.4 — Verificação de configuração

```bash
php artisan config:show app 2>/dev/null | grep -E "debug|env|key"
php artisan config:show session 2>/dev/null | grep -E "secure|httponly|same"
php artisan config:show cors 2>/dev/null
```

---

## FASE 1 — Reconhecimento via Browser

Abrir nova página: `new_page`
Navegar para a aplicação e mapear superfície de ataque:

```
1. navigate_page → http://sua-app.test
2. list_network_requests → mapear todos os endpoints chamados
3. take_snapshot → identificar formulários, campos, ações disponíveis
4. get_network_request → inspecionar headers de resposta (Server, X-Powered-By, etc.)
```

Mapear internamente:
- Todos os endpoints XHR/fetch identificados
- Formulários e seus métodos/actions
- Campos que refletem dados do usuário na UI
- Headers de segurança presentes ou ausentes

---

## FASE 2 — Autenticação

### 2.1 — Proteção de rotas

```
- Deletar cookie de sessão via evaluate_script: document.cookie.split(";").forEach(c => document.cookie = c.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT")
- Tentar acessar diretamente: /home, /customers, /work-orders, /admin/settings
- Resultado esperado: redirect para /login
- Resultado que é achado: página carrega ou erro 500
```

### 2.2 — Força bruta de login

```
- Submeter /login com senha errada 15 vezes seguidas
- Verificar resposta na 10ª e 15ª tentativa:
  - Status 429 (rate limit)? → OK
  - Continua retornando 200/302? → ACHADO: sem rate limiting
- Após bloqueio (se houver): tentar com credenciais corretas → desbloqueado?
```

### 2.3 — Enumeração de usuários

```
- Login com email existente + senha errada → anotar mensagem de erro
- Login com email inexistente + senha errada → anotar mensagem de erro
- As mensagens são idênticas? → OK
- Mensagens diferentes revelam se email existe? → ACHADO: enumeração de usuário
```

### 2.4 — Injeção no formulário de login

```
Testar no campo email:
- ' OR '1'='1
- admin'--
- ' OR 1=1 LIMIT 1--

Resultado esperado: erro de validação ou credenciais inválidas
Resultado que é achado: login bem-sucedido ou erro 500
```

### 2.5 — Tokens e sessão

```
- Verificar cookie de sessão: HttpOnly? Secure? SameSite?
  via evaluate_script: document.cookie (não deve aparecer o cookie de sessão)
- Após logout: tentar usar o cookie de sessão anterior
  → Sessão invalidada? → OK
  → Ainda funciona? → ACHADO: sessão não invalidada no logout
```

---

## FASE 3 — Autorização e IDOR

### 3.1 — Escalada de privilégio vertical

```
Logar como Mecânico (credenciais no README)
Tentar acessar diretamente:
- /admin/settings         → deve redirecionar, não carregar
- /admin/units            → deve redirecionar
- /admin/tickets          → deve redirecionar
- /master/dashboard       → deve redirecionar
- /master/shops           → deve redirecionar

Para cada URL: anotar status HTTP e conteúdo retornado.
Carregou parcialmente ou retornou dados? → ACHADO
```

### 3.2 — IDOR — Acesso a recursos de outros tenants

```
1. Logar como Admin (Loja A — seed)
2. Capturar IDs de recursos: clientes, veículos, OS, peças
   (via URL ou inspecionando responses JSON)
3. Se houver segunda loja no banco, logar como usuário dela
   Se não houver: criar via /register ou via tinker
4. Com a segunda conta, tentar acessar os IDs capturados:
   - /customers/{id_da_loja_A}
   - /vehicles/{id_da_loja_A}
   - /work-orders/{id_da_loja_A}
5. Resultado esperado: 403, 404 ou redirect
6. Resultado que é achado: dados da Loja A visíveis para Loja B → CRÍTICO
```

### 3.3 — Manipulação de parâmetros de ownership

```
Logar como Admin
Tentar editar recurso de outro tenant via POST direto:
- PUT /customers/{id_outro_tenant} com dados modificados
- DELETE /work-orders/{id_outro_tenant}
Verificar se a operação foi aceita ou bloqueada.
```

### 3.4 — Mass Assignment

```
Interceptar uma request de criação/edição (ex: POST /customers)
Adicionar campos sensíveis ao payload via evaluate_script ou form manipulation:
- role=master
- shop_id={id_de_outra_loja}
- active=true (se usuário inativo)
Verificar se os campos foram aceitos e persistidos.
```

---

## FASE 4 — Injeção

### 4.1 — XSS Refletido e Armazenado

```
Testar nos campos de texto livres (nome de cliente, assunto de ticket, descrição de OS):

Payloads:
- <script>alert('xss-stored')</script>
- <img src=x onerror="alert('xss-img')">
- "><svg onload=alert(1)>
- javascript:alert(1)

Procedimento:
1. Salvar o payload como valor de um campo
2. Recarregar a página que exibe o valor
3. Verificar se o JS executou (alert apareceu ou evaluate_script confirma execução)
4. Inspecionar HTML no DOM: o valor está escaped ({{{ vs {{}}) ?

Resultado esperado: payload exibido como texto puro
Resultado que é achado: alert executa ou HTML não escapado no DOM → ALTO/CRÍTICO
```

### 4.2 — XSS via Parâmetros de URL

```
Testar parâmetros refletidos na página:
- /customers?search=<script>alert(1)</script>
- /work-orders?status="><img src=x onerror=alert(1)>

Verificar se o parâmetro aparece no HTML sem escape.
```

### 4.3 — SQL Injection

```
Testar nos campos de busca e filtro:
- ' OR '1'='1
- ' UNION SELECT null,null,null--
- 1; DROP TABLE customers--
- ' AND SLEEP(3)--  (blind SQLi via tempo de resposta)

Verificar: erro SQL na resposta? Retorna dados inesperados? Request demora 3s (blind)?
```

### 4.4 — Template Injection

```
Testar em campos que podem ser renderizados como template:
- {{7*7}} → se retornar 49, há template injection
- ${7*7}
- <%= 7*7 %>
```

### 4.5 — Path Traversal em Uploads

```
Se houver upload de arquivos:
- Tentar upload de .php: <?php phpinfo(); ?>
- Tentar nome de arquivo: ../../../public/shell.php
- Verificar se o arquivo ficou acessível via URL
```

---

## FASE 5 — CSRF

```
Para cada formulário de ação destrutiva (deletar, alterar status, transferir):

1. Verificar presença de _token no DOM via take_snapshot
2. Tentar submeter sem o token:
   evaluate_script: document.querySelector('[name=_token]').remove()
   → Submeter o form
   → Resultado esperado: erro 419 (CSRF token mismatch)
   → Resultado que é achado: operação executada sem token → ALTO

3. Verificar requests AJAX:
   list_network_requests → checar header X-CSRF-TOKEN em requests POST/PUT/DELETE
```

---

## FASE 6 — Exposição de Dados via API

Para cada endpoint XHR/fetch identificado na Fase 1:

```
get_network_request → inspecionar response JSON completo

Checar presença de campos sensíveis:
- password, password_hash, remember_token
- api_key, secret, token (qualquer tipo)
- shop_id de outros tenants
- Campos internos não usados pela UI (overfetching)

Checar headers de resposta:
- Server: revela versão do servidor?
- X-Powered-By: revela PHP/versão?
- X-Debug-Token: Symfony Profiler exposto?
```

---

## FASE 7 — Headers HTTP de Segurança

```
Inspecionar headers de qualquer resposta via get_network_request ou:
curl -I http://sua-app.test 2>/dev/null

Verificar presença e valores corretos de:
- Content-Security-Policy      → ausente = MÉDIO
- X-Frame-Options              → ausente = MÉDIO (clickjacking)
- X-Content-Type-Options       → deve ser "nosniff"
- Referrer-Policy              → ausente = BAIXO
- Strict-Transport-Security    → ausente em HTTPS = MÉDIO
- Permissions-Policy           → ausente = INFORMATIVO
- Server / X-Powered-By       → não deve revelar versão
```

---

## FASE 8 — Erros e Informações Expostas

```
- Acessar URL que deve gerar erro: /customers/999999999
- Verificar response: stack trace visível? Caminho de arquivo? Versão do Laravel?
- Tentar trigger de erro 500: campos com tipo errado em endpoints internos
- list_console_messages → logs de debug esquecidos em produção?
- Verificar se APP_DEBUG=true vaza informações no HTML (comentários, meta tags)
```

---

## FASE 9 — Rate Limiting e DoS Superficial

```
- Submeter o formulário de contato/registro 20x seguidas → rate limit?
- Endpoint de busca/autocomplete com query vazia 10x → algum timeout?
- Verificar se listagens sem filtro retornam todos os registros (sem paginação)
  → payload > 1MB = MÉDIO (DoS via query pesada)
```

---

## Payloads de Referência

```
XSS básico:          <script>alert('xss')</script>
XSS atributo:        " onmouseover="alert(1)
XSS img:             <img src=x onerror=alert(1)>
XSS SVG:             "><svg onload=alert(1)>
SQLi OR:             ' OR '1'='1
SQLi comentário:     admin'--
SQLi union:          ' UNION SELECT null,null--
SQLi blind:          ' AND SLEEP(3)--
Path traversal:      ../../../etc/passwd
Template injection:  {{7*7}} / ${7*7} / <%= 7*7 %>
Null byte:           teste%00.php
SSTI Blade:          @php echo 7*7; @endphp
```

---

## Modelo de Classificação de Achados

| Campo | Valores |
|-------|---------|
| ID | Ex: `AUTH-02-001` |
| Fase | AUTH / AUTHZ / INJECT / CSRF / HEADERS / API / CONFIG |
| Severidade | CRÍTICO / ALTO / MÉDIO / BAIXO / INFORMATIVO |
| Status | CONFIRMADO / SUSPEITA / NÃO TESTÁVEL |
| Endpoint | URL exata |
| Reprodução | Passos exatos |
| Evidência | Response, payload, screenshot, log |
| Impacto | O que um atacante consegue |
| Remediação Laravel | Primitiva específica + onde aplicar |

### Critérios de Severidade

| Nível | Critério |
|-------|----------|
| **CRÍTICO** | Auth bypass confirmado, acesso cross-tenant com dados extraídos, RCE |
| **ALTO** | XSS armazenado confirmado, IDOR confirmado, CSRF em operação destrutiva |
| **MÉDIO** | Header de segurança ausente, overfetching com dados desnecessários, stack trace exposto |
| **BAIXO** | Header informativo revelado, campo extra não sensível, paginação ausente com volume baixo |
| **INFORMATIVO** | Boas práticas não seguidas sem risco direto confirmável |

### Referências de Remediação Laravel

| Problema | Remediação |
|----------|-----------|
| Sem rate limiting no login | `RateLimiter::for()` + middleware `throttle:login` |
| Enumeração de usuário | Mesma mensagem para email inexistente e senha errada |
| IDOR / cross-tenant | `ShopScope` global + `Gate::authorize()` no controller |
| Mass assignment | `$fillable` explícito no model, nunca `$guarded = []` |
| XSS no Blade | Sempre `{{ }}`, nunca `{!! !!}` sem sanitização |
| CSRF ausente | `@csrf` em todos os forms, `VerifyCsrfToken` ativo |
| Header ausente | Middleware `SecurityHeaders` customizado ou `spatie/laravel-csp` |
| Stack trace exposto | `APP_DEBUG=false` em produção, handler customizado |
| Sessão não invalidada | `Auth::logout()` + `$request->session()->invalidate()` + `regenerateToken()` |
| SQLi | Nunca concatenar input em query — usar Eloquent ou bindings |

---

## Formato do Relatório Final

```markdown
# Relatório de Pentest — Gestão de Lojas
**Data:** [data e hora]
**Escopo:** [fases executadas]
**Ambiente:** Local — recuperável via `php artisan migrate:fresh --seed`

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Ferramentas estáticas executadas | composer audit, enlightn |
| CVEs em dependências | N |
| Achados Enlightn (HIGH/CRITICAL) | N |
| Fases de pentest manual | N |
| Achados CONFIRMADOS | N |
| Achados SUSPEITA | N |
| Críticos | N |
| Altos | N |
| Médios | N |
| Baixos | N |

---

## Achados das Ferramentas Estáticas

### composer audit
[CVEs encontrados ou "Nenhuma vulnerabilidade encontrada"]

### enlightn
[Achados HIGH/CRITICAL do Enlightn]

---

## Achados Confirmados por Pentest Manual

### [ID] — [Título]
- **Fase:** AUTH / AUTHZ / INJECT / ...
- **Severidade:** CRÍTICO / ALTO / MÉDIO / BAIXO
- **Status:** CONFIRMADO
- **Endpoint:** `METHOD /uri`
- **Reprodução:**
  1. [Passo exato]
  2. [Passo exato]
  3. [Resultado observado]
- **Evidência:** [payload, response, status HTTP]
- **Impacto:** [o que um atacante consegue]
- **Remediação Laravel:** [primitiva específica + arquivo + linha]

---

## Suspeitas Não Confirmadas

### [ID] — [Título]
- **Severidade estimada:** [nível]
- **Indicador:** [o que foi observado]
- **Por que não confirmado:** [motivo]
- **Como confirmar:** [próximo passo]

---

## Itens Não Testáveis

| Item | Motivo |
|------|--------|

---

## Checklist Completo

| Fase | Item | Status | Resultado |
|------|------|--------|-----------|
| FASE 0 | composer audit | ✅/❌ | |
| FASE 0 | enlightn | ✅/❌ | |
| FASE 2 | Proteção de rotas | ✅/⚠️/❌ | |
| FASE 2 | Rate limiting no login | ✅/⚠️/❌ | |
| FASE 2 | Enumeração de usuário | ✅/⚠️/❌ | |
| FASE 3 | Escalada vertical (mecânico→admin) | ✅/⚠️/❌ | |
| FASE 3 | IDOR cross-tenant | ✅/⚠️/❌ | |
| FASE 4 | XSS armazenado | ✅/⚠️/❌ | |
| FASE 4 | XSS refletido | ✅/⚠️/❌ | |
| FASE 4 | SQL Injection | ✅/⚠️/❌ | |
| FASE 5 | CSRF em forms destrutivos | ✅/⚠️/❌ | |
| FASE 6 | Campos sensíveis em JSON | ✅/⚠️/❌ | |
| FASE 7 | Headers de segurança | ✅/⚠️/❌ | |
| FASE 8 | Stack trace em erros | ✅/⚠️/❌ | |
| FASE 9 | Rate limiting geral | ✅/⚠️/❌ | |
```

---

## Nota Final

Você não é auditor passivo. Você ataca e confirma.

Diferença entre CONFIRMADO e SUSPEITA:
- **CONFIRMADO**: você executou o exploit, viu o resultado — é fato reproduzível
- **SUSPEITA**: você identificou o indicador mas não conseguiu confirmar nesta sessão

Nunca marque CRÍTICO sem ter executado o exploit com sucesso.
Se um item não puder ser testado, documente o motivo e marque como NÃO TESTÁVEL.

Ao concluir, perguntar ao usuário se deseja:
1. Aprofundar algum achado específico
2. Exportar relatório para `storage/pentest-YYYY-MM-DD.md`
3. Resetar ambiente: `php artisan migrate:fresh --seed`
