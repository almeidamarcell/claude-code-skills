# Humanizer (PT-BR)

Skill para o Claude Code e o OpenCode que remove sinais de escrita gerada por IA, fazendo o texto soar mais natural e humano.

> Versão em português do Brasil. Para a versão original em inglês, veja [README.md](README.md).

## TL;DR

- Detecta e corrige **29 padrões** clássicos de escrita por LLM (ChatGPT, Claude, Gemini).
- Baseado no guia ["Signs of AI writing" da Wikipédia](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
- Roda uma auditoria final ("o que ainda denuncia que isso é IA?") e reescreve uma segunda vez.
- Opcional: calibra a voz a partir de uma amostra da sua própria escrita.

## Instalação

### Claude Code

Clone direto na pasta de skills do Claude Code:

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

Ou copie o arquivo manualmente se você já tem este repositório clonado:

```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md ~/.claude/skills/humanizer/
```

### OpenCode

Clone direto na pasta de skills do OpenCode:

```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/blader/humanizer.git ~/.config/opencode/skills/humanizer
```

Ou copie o arquivo manualmente:

```bash
mkdir -p ~/.config/opencode/skills/humanizer
cp SKILL.md ~/.config/opencode/skills/humanizer/
```

> **Observação:** o OpenCode também varre `~/.claude/skills/` por compatibilidade, então um único clone em `~/.claude/skills/humanizer/` funciona pros dois.

## Uso

### Claude Code

```
/humanizer

[cole seu texto aqui]
```

### OpenCode

```
/humanizer

[cole seu texto aqui]
```

Ou peça pro modelo humanizar o texto direto:

```
Humanize esse texto: [seu texto]
```

### Calibração de voz

Pra fazer o resultado bater com o seu estilo, forneça uma amostra do que você escreveu:

```
/humanizer

Aqui vai uma amostra da minha escrita pra calibrar a voz:
[cole 2-3 parágrafos seus]

Agora humanize esse texto:
[cole o texto de IA pra humanizar]
```

A skill vai analisar seu ritmo de frases, escolhas de palavra e cacoetes, e aplicar isso na reescrita em vez de produzir um output genérico "limpinho".

## Visão geral

Baseado no guia ["Signs of AI writing" da Wikipédia](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), mantido pelo WikiProject AI Cleanup. O guia veio da observação de milhares de exemplos de texto gerado por IA na própria Wikipédia.

A skill também faz um passo final de auditoria ("o que faz isso parecer obviamente gerado por IA?") e uma segunda reescrita, pra pegar os vestígios que sobraram no primeiro rascunho.

### Insight central da Wikipédia

> "LLMs usam algoritmos estatísticos pra chutar o que vem em seguida. O resultado tende ao mais estatisticamente provável que se aplica à maior variedade de casos."

## Os 29 padrões detectados (com exemplos antes/depois)

### Padrões de conteúdo

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 1 | **Inflação de importância** | "marcando um momento crucial na evolução de..." | "foi estabelecido em 1989 pra coletar estatísticas regionais" |
| 2 | **Apelo a notabilidade** | "citado em NYT, BBC, FT e Folha" | "Em entrevista de 2024 à Folha, ela argumentou..." |
| 3 | **Análises superficiais com gerúndio** | "simbolizando... refletindo... destacando..." | Remover ou expandir com fontes reais |
| 4 | **Linguagem promocional** | "aninhada na deslumbrante região" | "é uma cidade na região do Gonder" |
| 5 | **Atribuições vagas** | "especialistas acreditam que desempenha um papel crucial" | "segundo levantamento de 2019 do..." |
| 6 | **"Desafios e perspectivas" formulaicos** | "Apesar dos desafios... continua prosperando" | Fatos específicos sobre desafios reais |

### Padrões de linguagem

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 7 | **Vocabulário típico de IA** | "Ademais... vale ressaltar... testemunho... panorama... evidenciando" | "também... continua comum" |
| 8 | **Fuga do verbo "é/são"** | "serve como... apresenta... ostenta" | "é... tem" |
| 9 | **Paralelismos negativos / negações ao fim** | "Não é só X, é Y", "..., sem adivinhação" | Dizer direto |
| 10 | **Regra de três** | "inovação, inspiração e insights" | Use o número natural de itens |
| 11 | **Ciclagem de sinônimos** | "protagonista... personagem principal... figura central... herói" | "protagonista" (repita quando for mais claro) |
| 12 | **Falsos intervalos** | "do Big Bang à matéria escura" | Liste os tópicos direto |
| 13 | **Voz passiva / frases sem sujeito** | "Nenhum arquivo de configuração é necessário" | Nomeie o ator quando ajuda a clareza |

### Padrões de estilo

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 14 | **Travessão em excesso** | "instituições — não as pessoas — mas isso continua —" | Prefira vírgula ou ponto |
| 15 | **Negrito em excesso** | "**OKRs**, **KPIs**, **BMC**" | "OKRs, KPIs, BMC" |
| 16 | **Listas com cabeçalho inline** | "**Performance:** Performance melhorou" | Converta pra prosa |
| 17 | **Caixa Alta Em Cada Palavra Do Título** | "Negociações Estratégicas E Parcerias Globais" | "Negociações estratégicas e parcerias globais" |
| 18 | **Emojis** | "🚀 Fase de Lançamento: 💡 Insight-Chave:" | Remover emojis |
| 19 | **Aspas curvas** | `disse "o projeto"` (aspas tipográficas) | `disse "o projeto"` (aspas retas) |
| 26 | **Pares de palavras hifenizados** | "multi-funcional, data-driven, voltado-ao-cliente" | Tire o hífen em pares comuns |
| 27 | **Tropos de autoridade persuasiva** | "No fundo, o que realmente importa é..." | Diga o ponto direto |
| 28 | **Anúncios de transição** | "Vamos mergulhar", "Eis o que você precisa saber" | Comece pelo conteúdo |
| 29 | **Cabeçalhos fragmentados** | "## Performance" + "Velocidade importa." | Deixe o cabeçalho falar sozinho |

### Padrões de comunicação

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 20 | **Artefatos de chatbot** | "Espero que ajude! Me avise se..." | Remover por completo |
| 21 | **Desculpas de corte de conhecimento** | "Embora detalhes sejam limitados nas fontes disponíveis..." | Achar fontes ou remover |
| 22 | **Tom bajulador** | "Ótima pergunta! Você está absolutamente certo!" | Respondeu direto |

### Enchimento e hedging

| # | Padrão | Antes | Depois |
|---|---|---|---|
| 23 | **Frases de enchimento** | "A fim de", "Devido ao fato de que" | "Para", "Porque" |
| 24 | **Hedging excessivo** | "poderia potencialmente possivelmente" | "pode" |
| 25 | **Conclusões positivas genéricas** | "O futuro é promissor" | Planos ou fatos específicos |

## Exemplo completo

**Antes (com cara de IA):**
> Ótima pergunta! Aqui vai um ensaio sobre o tema. Espero que ajude!
>
> A codificação assistida por IA serve como um testemunho duradouro do potencial transformador dos grandes modelos de linguagem, marcando um momento crucial na evolução do desenvolvimento de software. No panorama tecnológico em rápida evolução de hoje, essas ferramentas inovadoras — aninhadas na interseção entre pesquisa e prática — estão reformulando como engenheiros idealizam, iteram e entregam, sublinhando seu papel vital nos fluxos de trabalho modernos.
>
> No fundo, a proposta de valor é clara: agilizar processos, aprimorar a colaboração e fomentar o alinhamento. Não se trata só de autocompletar; trata-se de desbloquear a criatividade em escala, garantindo que as organizações permaneçam ágeis enquanto entregam experiências fluidas, intuitivas e poderosas aos usuários. A ferramenta serve como um catalisador. O assistente funciona como um parceiro. O sistema se posiciona como uma base para a inovação.
>
> Observadores da indústria notaram que a adoção acelerou de experimentos amadores a implantações corporativas, de devs solo a times multi-funcionais. A tecnologia foi destaque no New York Times, Wired e The Verge. Ademais, a capacidade de gerar documentação, testes e refatorações evidencia como a IA pode contribuir pra melhores resultados, destacando a interação intricada entre automação e julgamento humano.
>
> - 💡 **Velocidade:** A geração de código é significativamente mais rápida, reduzindo fricção e capacitando devs.
> - 🚀 **Qualidade:** A qualidade do output foi aprimorada por treinamento melhor, contribuindo pra padrões mais altos.
> - ✅ **Adoção:** O uso continua crescendo, refletindo tendências mais amplas da indústria.
>
> Embora detalhes específicos sejam limitados com base nas informações disponíveis, poderia-se potencialmente argumentar que essas ferramentas talvez tenham algum efeito positivo. Apesar dos desafios típicos de tecnologias emergentes — incluindo alucinações, vieses e responsabilização — o ecossistema continua a prosperar. A fim de realizar plenamente esse potencial, os times devem se alinhar às melhores práticas.
>
> Em conclusão, o futuro é promissor. Tempos empolgantes nos aguardam à medida que continuamos essa jornada rumo à excelência. Me avise se quiser que eu expanda alguma seção!

**Depois (humanizado):**
> Assistente de código com IA acelera a parte chata do trabalho. Não tudo. Arquitetura definitivamente não.
>
> Ele é bom em boilerplate: arquivo de config, scaffolding de teste, o código de cola que ninguém quer escrever. Também é bom em parecer certo sendo errado. Já aceitei sugestão que compilou, passou no lint, e ainda assim fazia a coisa errada porque eu parei de prestar atenção.
>
> O pessoal que eu converso geralmente se divide em dois grupos. Uns usam tipo autocomplete pras tarefas chatas e revisam linha por linha. Outros desativam depois que a ferramenta insiste em sugerir um padrão que eles não querem. Os dois fazem sentido.
>
> Métrica de produtividade é escorregadia. O GitHub pode dizer que usuários do Copilot "aceitam 30% das sugestões", mas aceitação não é correção, e correção não é valor. Se você não tem teste, está chutando.

## FAQ

**Pra quem é essa skill?**
Pra qualquer pessoa que escreve texto que vai ser lido por humanos: dev escrevendo READMEs e blog posts, marqueteiro produzindo copy, estudante limpando um draft, redator revisando texto de cliente. Especialmente útil quando você usa LLM como rascunho zero.

**Funciona em texto que não é em inglês?**
Funciona, sim. Os padrões são quase todos transferíveis — vocabulário pomposo de IA, regra de três, paralelismo negativo, travessão em excesso, bajulação. Em português, o vocabulário típico de IA tem suas próprias marcas registradas: "vale ressaltar", "no cerne", "panorama", "papel crucial", "navegar pelas complexidades", "em última análise".

**Vai escapar do detector de IA tipo GPTZero / Originality.ai?**
A skill foca em fazer o texto soar humano, não em derrotar detectores específicos. Detectores mudam o algoritmo o tempo todo. Se o texto está genuinamente bem reescrito (com voz, opinião e especificidade), ele passa na maior parte das vezes — mas a skill não promete bypass.

**Qual a diferença pro "Rewrite this to sound more human" simples?**
A skill aplica um framework explícito de 29 padrões + uma auditoria de segundo passo. Pedido vago de "humanize" geralmente troca um problema por outro (sai do tom corporativo, entra no tom "blog post 2014").

**Posso usar a calibração de voz com o estilo de outra pessoa?**
Pode tecnicamente, mas pense duas vezes. Calibrar pra imitar outra pessoa publicamente é território de plágio. Pra estudo do próprio estilo, pra ghostwriting com consentimento, ou pra manter consistência de um manual de marca, faz sentido.

## Referências

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) — fonte primária
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) — organização mantenedora

## Histórico de versões

- **2.5.1** — Adicionada regra de voz passiva / frases sem sujeito, totalizando 29 padrões
- **2.5.0** — Adicionados padrões para autoridade persuasiva, anúncios de transição e cabeçalhos fragmentados; paralelismos negativos expandidos pra cobrir negações ao fim; ajuste no fraseado sobre travessão; correção no frontmatter pra usar "frases de enchimento"
- **2.4.0** — Adicionada calibração de voz: combinar o estilo pessoal do usuário a partir de amostras
- **2.3.0** — Adicionado padrão #25: uso excessivo de pares de palavras hifenizados
- **2.2.0** — Adicionada auditoria final "obviamente IA gerada" + segunda reescrita
- **2.1.1** — Correção no exemplo do padrão #18 (aspas curvas vs retas)
- **2.1.0** — Exemplos antes/depois para todos os 24 padrões
- **2.0.0** — Reescrita completa baseada no conteúdo bruto do artigo da Wikipédia
- **1.0.0** — Release inicial

## Licença

MIT
