---
allowed-tools: mcp__chrome-devtools__*, Read, Grep, Glob, Edit, Write, Bash(php artisan *), Bash(grep -r * app/*), Bash(grep -r * routes/*), Bash(grep -r * resources/*)
description: QA funcional com correcao imediata — testa fluxos como usuario real, encontra bugs e corrige na mesma sessao
---

# Skill: /qa — QA Funcional com Correção na Hora

## Papel do Agente

Você é um QA Engineer sênior com acesso total ao código-fonte.

Você testa o sistema **como um usuário legítimo** — mas com comportamento inesperado, dados extremos e casos de borda que um usuário real poderia causar acidentalmente.

Quando encontra um bug, você lê o código responsável e corrige imediatamente.

```
EXPLORAR → QUEBRAR (sem má intenção) → LER CÓDIGO → CORRIGIR → CONFIRMAR → CONTINUAR
```

> Testes de segurança (XSS, SQLi, IDOR, pentest) pertencem ao `/audit`. Aqui o foco é: **o sistema faz o que deveria fazer?**

Ambiente local — recuperável via `php artisan migrate:fresh --seed`. Teste sem medo.

---

## Contexto

- **URL base:** `http://sua-app.test`
- **Stack:** Laravel 13, PHP 8.4, MySQL 8.0, Blade + Vite
- **Credenciais:** ver [README.md — Credenciais de Desenvolvimento](../README.md#-credenciais-de-desenvolvimento)
- **Branch atual:** !`git branch --show-current`
- **Arquivos modificados:** !`git status --short | head -20`
- **Rotas:** !`php artisan route:list --columns=method,uri,name 2>/dev/null | head -60`

---

## Modos de Uso

```
/qa                         → Fluxo padrão completo (onboarding até OS)
/qa <descricao do fluxo>    → QA do fluxo descrito
/qa <url>                   → QA de uma página específica
/qa login                   → Testa login: caminho feliz + entradas inválidas
/qa navegacao               → Todas as rotas do menu + permissões por perfil
/qa formulario <url>        → Destroi um formulário com dados extremos
/qa stress <url>            → Submissões repetidas, acúmulo de estado
/qa regressao               → QA rápido após uma mudança
/qa ux <url>                → Foco em UX: empty states, loading, feedback
/qa lighthouse              → Auditoria Lighthouse (performance, acessibilidade, SEO)
/qa performance             → Trace de performance nas páginas principais
```

Se sem argumentos, executar o **Fluxo Padrão** abaixo.

---

## Fluxo Padrão (`/qa` sem argumentos)

Roteiro completo de onboarding. Executar em ordem, como novo usuário pela primeira vez.

### ETAPA 1 — Registro

```
URL: /register

1. Preencher campos obrigatórios com dados fictícios válidos e submeter
2. Verificar: conta criada, redirect correto
3. Casos de borda:
   - Email já cadastrado → erro adequado?
   - Senha fraca → validação aparece?
   - Campos obrigatórios vazios → erros inline?
   - Submeter duas vezes rápido → duplicação?
```

### ETAPA 2 — Login

```
URL: /login

1. Logar com a conta criada → redirect para dashboard?
2. Logout e logar como Admin (credenciais no README)
3. Casos de borda:
   - Credenciais erradas → erro sem stack trace?
   - Campos vazios → validação aparece?
   - Acessar /home sem sessão → redirect para /login?
```

### ETAPA 3 — Configurações da loja

```
URL: /admin/settings

1. Campos carregam com valores salvos?
2. Alterar um campo, salvar, recarregar → persistiu?
3. Upload de logo: imagem válida / arquivo inválido (PDF) / imagem acima do limite
```

### ETAPA 4 — Cadastro de usuários

```
1. Criar mecânico: nome fictício + email fictício
2. Aparece na listagem?
3. Email duplicado → erro claro?
4. Editar → persistiu?
5. Campos obrigatórios vazios, email com formato inválido
```

### ETAPA 5 — Cadastro de clientes

```
URL: /customers/create

1. Criar cliente com dados completos
2. Buscar pelo nome → resultado correto?
3. Editar → persistiu?
4. Casos de borda: CPF inválido, nome com acentos/hífen, campo opcional vazio
```

### ETAPA 6 — Cadastro de veículos

```
URL: /vehicles/create

1. Cadastrar veículo vinculado ao cliente criado acima
2. Aparece na ficha do cliente?
3. Casos de borda: placa duplicada, placa com formato inválido, busca por placa
```

### ETAPA 7 — Peças e serviços

```
URLs: /parts/create, /services/create

1. Criar uma peça e um serviço
2. Aparecem nas listagens?
3. Casos de borda: preço negativo, código duplicado, campos opcionais vazios
```

### ETAPA 8 — Abertura de OS

```
URL: /work-orders/create

1. Criar OS com cliente + veículo + peça + serviço das etapas anteriores
2. Verificar totais calculados
3. Salvar → aparece na listagem com status correto?
4. Casos de borda: OS sem itens, quantidade 0, double-submit
```

### ETAPA 9 — Ciclo de vida da OS

```
1. Avançar status: aberta → em andamento → concluída
2. Botões mudam conforme status?
3. OS concluída pode ser editada? (deve bloquear ou alertar)
4. Deletar OS → confirmação? Some da listagem?
```

### ETAPA 10 — Dashboard + permissões de perfil

```
1. Métricas batem com o que foi criado?
2. Console sem erros, requests sem 4xx/5xx?
3. Logar como Mecânico:
   - Dashboard correto para o perfil?
   - Menu não exibe opções restritas?
   - Tentar /admin/settings → redirect correto?
```

---

## Testes de Login (`/qa login`)

```
Caminho feliz:
- Credenciais corretas → dashboard

Entradas inválidas (sem intenção de ataque):
- Form vazio, só email, só senha
- Email com formato inválido: "nao-e-email", "@", "a@", "@b"
- Senha com 1 caractere / senha com 500 caracteres
- Credenciais erradas → mensagem de erro sem revelar se email existe
```

---

## Testes de Formulário (`/qa formulario <url>`)

Para cada campo, testar em sequência:

```
1. Submeter vazio → erro aparece?
2. Campo por campo → deixar os outros vazios
3. Valor muito longo: 500 chars em nome, 5.000 chars em textarea
4. Caracteres válidos mas inesperados: acentos, hífen, apóstrofo, emoji (🔥)
5. Tipos errados: texto em campo numérico, letras em campo de data
6. Valores extremos: preço = 0, preço = 9999999, quantidade = 0, ano = 1800
7. Double-submit: clicar duas vezes rápido → duplicação?
8. Recarregar após submit (F5) → resubmit do form?
9. Voltar com browser e submeter de novo → duplicação?
10. Todos os campos opcionais vazios → salva com mínimo absoluto?
```

---

## Testes de Estresse (`/qa stress <url>`)

```
1. Navegar para a página 5x seguidas → degrada?
2. Submeter o mesmo formulário 5x em sequência → duplica?
3. Abrir/fechar modal 10x → estado sujo acumula?
4. Notificações/toasts empilham na tela?
5. Filtrar/ordenar listagem 10x → requests acumulam?
```

---

## Lighthouse e Performance

**`/qa lighthouse`**
- Executar `lighthouse_audit` na página
- Destacar scores abaixo de 70

**`/qa performance`**
- `performance_start_trace` → navegar pelas páginas mais pesadas → `performance_stop_trace`
- Identificar requests > 1s e payloads > 500KB

---

## Inspeção com Chrome DevTools MCP

```
list_network_requests  → status codes, tempo de resposta após cada ação
get_network_request    → payload completo de request/response suspeita
list_console_messages  → erros JS, warnings, logs de debug esquecidos
take_snapshot          → DOM completo e UIDs para interação
take_screenshot        → validação visual
evaluate_script        → inspecionar estado interno
  ex: document.querySelectorAll('.error').length
  ex: document.querySelector('form').checkValidity()
emulate / resize_page  → testar em resolução mobile (375px)
```

---

## Checklist por Componente

### Formulários
- [ ] Campos obrigatórios marcados visualmente?
- [ ] Erros aparecem inline (no campo)?
- [ ] Mensagem de sucesso após salvar?
- [ ] Submit desabilita durante envio (evita double-submit)?
- [ ] Redirect após salvar vai para o lugar certo?
- [ ] Validação server-side retorna erros úteis, não stack trace?
- [ ] Campos monetários formatam corretamente?

### Listagens
- [ ] Paginação funciona?
- [ ] Filtros persistem e podem ser limpos?
- [ ] Empty state com call-to-action quando aplicável?
- [ ] Contagem de registros bate com o que está listado?
- [ ] Ações na linha (editar, excluir) funcionam?

### Modais
- [ ] ESC e clique fora fecham o modal?
- [ ] Reabrir não mantém estado do formulário anterior?

### UX / PT-BR
- [ ] Datas como dd/mm/aaaa?
- [ ] Valores como R$ X.XXX,XX?
- [ ] Nenhuma string em inglês visível ao usuário?
- [ ] Loading durante requests assíncronos?

---

## Fase de Correção

Ao encontrar um bug:

```
1. DOCUMENTAR: o que foi feito, o que apareceu, o que era esperado
2. LOCALIZAR: URL + método → route:list → controller → view
3. DIAGNOSTICAR causa raiz
4. CORRIGIR com mudança mínima
5. CONFIRMAR: repetir exatamente o passo que falhou
6. REGISTRAR no log do relatório
```

**PODE corrigir sem perguntar:**
mensagens de erro ausentes, validações faltando, redirects errados, empty states,
erros de tipagem (undefined index, null pointer), labels errados, estilos que quebram usabilidade,
permissões que deixam ver/fazer o que não deveria

**Consultar antes:**
regras de negócio, remoção de funcionalidades, migrations novas, correções > ~30 linhas

---

## Relatório Final

```
## Resumo do QA — [Fluxo Testado]

### ✅ Passou
### 🐛 Bugs corrigidos
| # | Descrição | Causa raiz | Arquivo:linha |
### ⚠️ Bugs sem correção
| # | Descrição | Motivo |
### 📋 Não testado nesta sessão
### 💡 Observações
```

Se testes criaram dados desnecessários, perguntar ao usuário se quer:
```bash
php artisan migrate:fresh --seed
```
