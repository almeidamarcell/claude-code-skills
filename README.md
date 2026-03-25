![Chico Parrot](https://emojicreator.ai/packs/party-parrot/chico_parrot.gif)

# Claude Code Skills

**A curated collection of skills that supercharge [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — turning it into a domain expert on demand.**

Skills are structured knowledge packs that Claude Code loads contextually. When you invoke a skill, Claude gains deep expertise in that domain: the right frameworks, best practices, proven patterns, and production-ready code templates. No hallucination, no outdated APIs — just precise, battle-tested guidance.

## Quick Start

### Install all skills + settings

> **Requires [Bun](https://bun.sh) v1.0+** for gstack browser skills. Install with `curl -fsSL https://bun.sh/install | bash`

```bash
# Clone into your Claude Code skills directory
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills

# Sync settings + build gstack browser binary
~/.claude/skills/setup.sh
```

### Update on any device

```bash
cd ~/.claude/skills && git pull && ./setup.sh
```

This syncs both skills and plugin settings (`settings.json`) across all your devices.

### Install a single skill

```bash
# Copy just the skill you need
mkdir -p ~/.claude/skills
cp -r path/to/skill ~/.claude/skills/
```

### Use a skill

Skills activate automatically when Claude Code detects a matching context, or invoke them explicitly:

```
/animejs        # Generate anime.js v4 animations
/shaping        # Shape a solution collaboratively
/tdd            # Test-driven development workflow
/changelog      # Auto-generate changelogs from commits
/entire         # AI session tracking with checkpoints and rewind

# gstack skills
/browse         # Real Chromium browser automation
/qa             # QA testing with bug fixes
/review         # Staff engineer code review
/ship           # Release engineer workflow
/office-hours   # YC-style product review
```

---

## Tested Skills

These skills have been validated and are ready for use.

### Development & Engineering

| Skill | Description |
|-------|-------------|
| **[animejs](animejs/)** | Generate production-ready anime.js v4 animations — DOM, SVG, scroll-triggered, timelines, stagger, draggable, text splitting, and more |
| **[tdd](tdd/)** | Strict test-driven development workflow. Red-green-refactor with zero exceptions |
| **[mcp-builder](mcp-builder/)** | Build high-quality MCP (Model Context Protocol) servers in TypeScript or Python |
| **[web-artifacts-builder](web-artifacts-builder/)** | Create multi-component React + Tailwind + shadcn/ui artifacts for claude.ai |
| **[cheap-model-testing](cheap-model-testing/)** | Always use the cheapest LLM model during dev/testing — save costs, upgrade for prod |
| **[changelog](changelog/)** | Auto-generate user-facing changelogs from git commit history |

### Developer Workflow

| Skill | Description |
|-------|-------------|
| **[entire](entire/)** | Capture AI agent sessions in your git workflow — checkpoints, rewind, session history, and troubleshooting |

### Product Design & Strategy

| Skill | Description |
|-------|-------------|
| **[shaping](shaping/)** | Collaborative problem definition and solution design using the Shape Up methodology |
| **[breadboarding](breadboarding/)** | Map systems into affordance tables and wiring diagrams |

### Brand

| Skill | Description |
|-------|-------------|
| **[anthropic-brand-guideline](anthropic-brand-guideline/)** | Apply Anthropic's official brand colors, typography, and design standards |

### Deployment & Ops

| Skill | Description |
|-------|-------------|
| **[safe-deploy](safe-deploy/)** | Pre-deploy safety checks — verifies branch ancestry before shipping |
| **[clearshot](clearshot/)** | Structured screenshot analysis for UI implementation and critique |

### Impeccable Design

| Skill | Description |
|-------|-------------|
| **[impeccable](impeccable/)** | 18 design-focused sub-skills for UI/UX refinement (audit, polish, animate, harden, etc.) |

---

## gstack Skills

[gstack](https://github.com/garrytan/gstack) by Garry Tan — 28 skills that structure development as a complete sprint cycle: Think → Plan → Build → Review → Test → Ship → Reflect.

> **Requires [Bun](https://bun.sh) v1.0+** — gstack compiles a persistent browser daemon for QA/browsing skills.

### Workflow & Planning

| Skill | Description |
|-------|-------------|
| **[office-hours](gstack/office-hours/)** | YC Office Hours — six forcing questions that reframe your product before coding |
| **[plan-ceo-review](gstack/plan-ceo-review/)** | CEO/founder-mode plan review — rethink the problem, find the 10-star product |
| **[plan-eng-review](gstack/plan-eng-review/)** | Eng manager review — lock in architecture, data flow, edge cases, tests |
| **[plan-design-review](gstack/plan-design-review/)** | Senior designer review — rate design dimensions 0-10, detect AI slop |
| **[design-consultation](gstack/design-consultation/)** | Design partner — build a complete design system from scratch |
| **[autoplan](gstack/autoplan/)** | Auto-review pipeline — runs CEO → design → eng review automatically |

### Code Review & QA

| Skill | Description |
|-------|-------------|
| **[review](gstack/review/)** | Staff engineer code review — find production bugs that pass CI |
| **[qa](gstack/qa/)** | QA lead — test app, find bugs, fix with atomic commits, re-verify |
| **[qa-only](gstack/qa-only/)** | QA reporter — same as /qa but report-only, no code changes |
| **[design-review](gstack/design-review/)** | Designer who codes — design audit + fixes with before/after screenshots |
| **[investigate](gstack/investigate/)** | Systematic root-cause debugging — traces data flow, tests hypotheses |
| **[codex](gstack/codex/)** | Second opinion — independent code review from OpenAI Codex CLI |

### Release & Monitoring

| Skill | Description |
|-------|-------------|
| **[ship](gstack/ship/)** | Release engineer — sync main, run tests, audit coverage, push, open PR |
| **[land-and-deploy](gstack/land-and-deploy/)** | Merge PR, wait for CI, deploy, verify production health |
| **[canary](gstack/canary/)** | Post-deploy canary monitoring — watches for errors and regressions |
| **[benchmark](gstack/benchmark/)** | Performance engineer — baseline Core Web Vitals, compare before/after |
| **[document-release](gstack/document-release/)** | Technical writer — update docs to match shipped code |
| **[retro](gstack/retro/)** | Weekly engineering retrospective with per-person breakdowns |

### Browser & Infrastructure

| Skill | Description |
|-------|-------------|
| **[browse](gstack/browse/)** | Real Chromium browser automation — real clicks, real screenshots, ~100ms per command |
| **[setup-browser-cookies](gstack/setup-browser-cookies/)** | Import cookies from real browser for authenticated pages |

### Security & Compliance

| Skill | Description |
|-------|-------------|
| **[cso](gstack/cso/)** | Chief Security Officer — OWASP Top 10 + STRIDE threat model |

### Safety Tools

| Skill | Description |
|-------|-------------|
| **[careful](gstack/careful/)** | Warns before destructive commands (rm -rf, DROP TABLE, force-push) |
| **[freeze](gstack/freeze/)** | Restrict file edits to one directory |
| **[guard](gstack/guard/)** | Full safety — /careful + /freeze combined |
| **[unfreeze](gstack/unfreeze/)** | Remove the /freeze boundary |

### Configuration

| Skill | Description |
|-------|-------------|
| **[setup-deploy](gstack/setup-deploy/)** | One-time deploy configuration for /land-and-deploy |
| **[gstack-upgrade](gstack/gstack-upgrade/)** | Self-updater — upgrade gstack to latest |

---

## Anatomy of a Skill

Each skill is a directory containing a `SKILL.md` file with optional reference materials:

```
skill-name/
  SKILL.md              # Main skill file (YAML frontmatter + markdown)
  references/           # Optional supporting docs
    patterns.md
    frameworks.md
```

**SKILL.md format:**

```yaml
---
name: skill-name
description: When and how this skill should be activated...
---

# Skill Title

Detailed guidance, API references, code examples,
best practices, and production-ready patterns.
```

## Creating Your Own Skills

1. Create a directory under `~/.claude/skills/your-skill-name/`
2. Add a `SKILL.md` with YAML frontmatter (`name`, `description`)
3. Write comprehensive guidance — Claude performs best with detailed, opinionated instructions
4. Add a `references/` directory for extended lookup tables or pattern libraries
5. The `description` field doubles as the activation trigger — include phrases users might say

## Contributing

Contributions welcome! Whether it's a new skill, improvements to existing ones, or bug fixes:

1. Fork the repo
2. Create your branch (`git checkout -b feat/awesome-skill`)
3. Commit your changes
4. Push and open a PR

## License

This project is open source under the [Apache License 2.0](LICENSE).
