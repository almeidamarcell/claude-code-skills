# claude-laravel-skills

Dois slash commands para o [Claude Code](https://claude.ai/code) que transformam o Claude em um QA Engineer ativo e um pentester completo para aplicações Laravel.

O diferencial: o Claude usa o **Chrome DevTools MCP** para ver e interagir com o sistema exatamente como um usuário real faria — e no caso do `/qa`, já corrige o que encontrar na mesma sessão.

---

## Skills disponíveis

### `/qa` — QA funcional com correção imediata

Testa o sistema como um usuário legítimo com comportamento inesperado.  
Quando encontra um bug, lê o código responsável e corrige na hora.

```
/qa                         → Fluxo padrão completo (registro → login → OS)
/qa formulario /customers   → Destrói um formulário com dados extremos
/qa stress /work-orders     → Submissões repetidas, acúmulo de estado
/qa navegacao               → Todas as rotas + permissões por perfil
/qa regressao               → QA rápido após uma mudança
/qa lighthouse              → Auditoria Lighthouse (performance, SEO)
```

### `/audit` — Pentest completo

Ataca a aplicação em 9 fases. Roda ferramentas estáticas (`composer audit` + Enlightn) antes de abrir o browser. Não edita código — entrega relatório com achados confirmados e remediação Laravel específica.

```
/audit              → Pentest completo (todas as fases)
/audit auth         → Foco em autenticação (brute force, bypass, sessão)
/audit idor         → Foco em IDOR e isolamento cross-tenant
/audit injection    → Foco em XSS, SQLi, template injection
/audit headers      → Foco em headers HTTP de segurança
/audit deps         → Apenas ferramentas estáticas (sem browser)
```

---

## Requisitos

- [Claude Code](https://claude.ai/code) instalado
- [Chrome DevTools MCP](https://github.com/modelcontextprotocol/servers) configurado no Claude Code
- Aplicação Laravel rodando localmente
- `composer` disponível no terminal

---

## Instalação

1. Copie os arquivos para a pasta de comandos do Claude Code no seu projeto:

```bash
cp qa.md audit.md seu-projeto/.claude/commands/
```

2. Edite a seção **Contexto** em cada arquivo com os dados da sua aplicação:

```markdown
- **URL base:** http://sua-app.test
- **Credenciais:** ver README.md#credenciais-de-desenvolvimento
```

3. Adicione uma seção de credenciais no `README.md` do seu projeto (veja exemplo abaixo).

---

## Configuração de Credenciais

As skills referenciam as credenciais via link para o README do projeto — não ficam hardcoded nos arquivos de skill. Isso evita expor dados sensíveis no repositório.

Adicione esta seção no `README.md` do seu projeto:

```markdown
## Credenciais de Desenvolvimento

Criadas automaticamente via `php artisan migrate:fresh --seed`.

| Perfil         | Email                       | Senha      | Acesso                                        |
|----------------|-----------------------------|------------|-----------------------------------------------|
| Master Admin   | master@suaapp.com           | 12345678   | Painel master — gerencia todos os tenants     |
| Admin          | admin@suaapp.com           | 12345678   | Acesso administrativo completo                |
| Operador       | operador@suaapp.com        | 12345678   | Acesso operacional restrito                   |

> ⚠️ Exclusivo para ambiente de desenvolvimento. Nunca use em produção.

Para resetar:
```bash
php artisan migrate:fresh --seed
```
```

---

## Como adaptar para outros projetos

### Qualquer aplicação web
A parte de testes via browser funciona para qualquer stack. Ajuste só a seção de contexto com a URL e as credenciais do seu projeto.

### Substituindo comandos Laravel
Se seu projeto não usa Laravel, substitua os comandos específicos:

| Laravel | Equivalente |
|---------|-------------|
| `php artisan route:list` | `rails routes` / `flask routes` / `npm run routes` |
| `composer audit` | `npm audit` / `pip-audit` / `bundle audit` |
| `php artisan enlightn` | Equivalente de scanner da sua stack |
| `php artisan migrate:fresh --seed` | Comando de reset do seu banco |

### Ajustando o fluxo padrão do `/qa`
O fluxo padrão foi escrito para um SaaS com OS (Ordens de Serviço). Substitua as etapas pelo fluxo principal do seu sistema — o importante é cobrir: registro → login → cadastro de entidade principal → criação de transação principal → dashboard.

---

## Exemplo de uso

```
# QA completo do fluxo de onboarding
/qa

# QA focado num formulário específico
/qa formulario /customers/create

# Pentest completo antes de uma release
/audit

# Testar só isolamento de dados entre usuários
/audit idor

# Verificar dependências com CVEs
/audit deps
```

---

## Como funciona o Chrome DevTools MCP

O Claude usa o MCP para controlar um browser real — não simulação. Isso significa:

- Ele **vê a página** como o usuário vê (DOM, erros de console, requests de rede)
- Ele **interage** com formulários, cliques, navegação
- Ele **inspeciona** payloads JSON, headers HTTP, cookies
- Ele **executa JavaScript** para manipular estado e testar casos difíceis

Essa combinação é o que permite o ciclo `EXPLORAR → ENCONTRAR → CORRIGIR → CONFIRMAR` funcionar em tempo real, sem precisar de suíte de testes escrita previamente.

---

## Contribuindo

Pull requests são bem-vindos. Se adaptar para outra stack (Rails, Django, Node, etc.), abra uma PR com a versão adaptada na pasta `stacks/`.

---

## Licença

MIT
