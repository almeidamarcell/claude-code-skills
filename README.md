[![Pepe Smoking](https://emojicreator.ai/packs/pepe-emojis-pack/pepesmoking.gif)](https://emojicreator.ai/emojis/pepesmoking)

by [Emoji Creator](https://emojicreator.ai/packs)

# Claude Code Skills

**A curated collection of skills that supercharge [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — turning it into a domain expert on demand.**

Skills are structured knowledge packs that Claude Code loads contextually. When you invoke a skill, Claude gains deep expertise in that domain: the right frameworks, best practices, proven patterns, and production-ready code templates. No hallucination, no outdated APIs — just precise, battle-tested guidance.

## Quick Start

### Install all skills + settings

> **Requires [Bun](https://bun.sh) v1.0+** for gstack browser skills. Install with `curl -fsSL https://bun.sh/install | bash`

```bash
# Clone into your Claude Code skills directory
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills

# Run setup (required — links impeccable skills, syncs settings, builds gstack)
~/.claude/skills/setup.sh
```

> **Why is `setup.sh` required?** Claude Code only discovers skills one level deep (`~/.claude/skills/*/SKILL.md`). The 21 [Impeccable](https://github.com/pbakaus/impeccable) design skills and 17 [SEO](https://github.com/AgriciDaniel/claude-seo) skills live under `impeccable/` and `claude-seo/` (two levels deep) and won't be visible without the symlinks that `setup.sh` creates. Always run `setup.sh` after cloning or pulling updates.

### Update on any device

```bash
cd ~/.claude/skills && git pull && ./setup.sh
```

This syncs skills, recreates impeccable and SEO symlinks, and updates plugin settings (`settings.json`) across all your devices.

### Install a single skill

```bash
# Copy just the skill you need (top-level skills only — impeccable skills require setup.sh)
mkdir -p ~/.claude/skills
cp -r path/to/skill ~/.claude/skills/
```

---

## Team Installation

For teams where each member may have their own `settings.json` or doesn't need every skill.

### Option 1: Full install (recommended)

```bash
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills
~/.claude/skills/setup.sh
```

This gives you everything: all skills (including impeccable and SEO), shared settings, and gstack browser daemon.

### Option 2: Skills only (keep your own settings)

```bash
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills
~/.claude/skills/setup.sh --skills-only
```

Installs all skills and impeccable/SEO symlinks but doesn't overwrite your existing `settings.json`.

### Option 3: Lightweight (no Bun required)

```bash
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills
~/.claude/skills/setup.sh --skills-only --no-gstack
```

Installs all skills (including impeccable and SEO) without building the gstack browser daemon. No Bun dependency required.

### Option 4: Cherry-pick skills into an existing repo

If your team already has a skills repo or wants to vendor specific skills:

```bash
# Copy individual skills into your team's skills directory
cp -r tdd/ shaping/ safe-deploy/ /path/to/your-team-skills/

# For impeccable skills, copy each sub-skill directly (not the parent directory)
for skill in impeccable/*/; do cp -r "$skill" /path/to/your-team-skills/; done

# For SEO skills, copy each sub-skill directly (not the parent directory)
for skill in claude-seo/*/; do cp -r "$skill" /path/to/your-team-skills/; done

# For gstack skills, copy the whole gstack/ directory (it has shared dependencies)
cp -r gstack/ /path/to/your-team-skills/
cd /path/to/your-team-skills/gstack && ./setup
```

### Team onboarding checklist

1. **Clone the repo** — `git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills`
2. **Run setup** (always required for impeccable and SEO skills):
   - Full install (solo/opinionated): `./setup.sh`
   - Skills only (keep your settings): `./setup.sh --skills-only`
   - Lightweight (no browser): `./setup.sh --skills-only --no-gstack`
3. **Restart Claude Code** for skills to take effect
4. **Verify impeccable skills** — run `/polish` or `/critique` in Claude Code to confirm they work
5. **Update anytime** — `cd ~/.claude/skills && git pull && ./setup.sh [same flags]`

### Use a skill

Skills activate automatically when Claude Code detects a matching context, or invoke them explicitly:

```
/tdd            # Test-driven development workflow
/shaping        # Shape a solution collaboratively
/animejs        # Generate anime.js v4 animations
/changelog      # Auto-generate changelogs from commits
/clearshot      # Analyze a UI screenshot

# gstack skills
/browse         # Real Chromium browser automation
/qa             # QA testing with bug fixes
/review         # Staff engineer code review
/ship           # Release engineer workflow
/office-hours   # YC-style product review
```

---

## Skills

### Development & Engineering

| Skill | Description |
|-------|-------------|
| **[tdd](tdd/)** | Strict test-driven development workflow. Red-green-refactor with zero exceptions |
| **[mcp-builder](mcp-builder/)** | Build high-quality MCP (Model Context Protocol) servers in TypeScript or Python |
| **[web-artifacts-builder](web-artifacts-builder/)** | Create multi-component React + Tailwind + shadcn/ui artifacts for claude.ai |
| **[animejs](animejs/)** | Generate production-ready anime.js v4 animations — DOM, SVG, scroll-triggered, timelines, stagger, draggable |
| **[cheap-model-testing](cheap-model-testing/)** | Always use the cheapest LLM model during dev/testing — save costs, upgrade for prod |
| **[changelog](changelog/)** | Auto-generate user-facing changelogs from git commit history |
| **[safe-deploy](safe-deploy/)** | Pre-deploy safety checks — verifies branch ancestry before shipping |

### Product Design & Strategy

| Skill | Description |
|-------|-------------|
| **[shaping](shaping/)** | Collaborative problem definition and solution design using the Shape Up methodology |
| **[breadboarding](breadboarding/)** | Map systems into affordance tables and wiring diagrams |
| **[clearshot](clearshot/)** | Structured screenshot analysis for UI implementation and critique — 5x5 spatial grid, element inventory, design system extraction |
| **[anthropic-brand-guideline](anthropic-brand-guideline/)** | Apply Anthropic's official brand colors, typography, and design standards |

### Impeccable Design (21 sub-skills)

A collection of design-focused skills from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) for UI/UX refinement. Each targets a specific aspect of interface quality.

> **Important:** Impeccable skills live under `impeccable/` but Claude Code only discovers skills one level deep (`~/.claude/skills/*/SKILL.md`). **You must run `setup.sh`** to create symlinks at the top level (e.g., `~/.claude/skills/polish` → `impeccable/polish`). Without this step, impeccable skills will **not** be available in Claude Code. If you cloned without running `setup.sh`, run it now.

| Skill | Description |
|-------|-------------|
| **[adapt](impeccable/adapt/)** | Adapt designs across screen sizes, devices, and contexts |
| **[animate](impeccable/animate/)** | Enhance features with purposeful animations and micro-interactions |
| **[arrange](impeccable/arrange/)** | Improve layout, spacing, and visual rhythm |
| **[audit](impeccable/audit/)** | Comprehensive audit of accessibility, performance, and interface quality |
| **[bolder](impeccable/bolder/)** | Amplify safe or boring designs to be more visually stimulating |
| **[clarify](impeccable/clarify/)** | Improve UX copy, error messages, microcopy, labels, and instructions |
| **[colorize](impeccable/colorize/)** | Add strategic color to monochromatic interfaces |
| **[critique](impeccable/critique/)** | Evaluate design effectiveness from a UX perspective |
| **[delight](impeccable/delight/)** | Add moments of joy and personality to interfaces |
| **[distill](impeccable/distill/)** | Strip designs to their essence by removing unnecessary complexity |
| **[extract](impeccable/extract/)** | Extract reusable components, design tokens, and patterns |
| **[frontend-design](impeccable/frontend-design/)** | Create distinctive, production-grade frontend interfaces |
| **[harden](impeccable/harden/)** | Improve resilience — error handling, i18n, text overflow, edge cases |
| **[normalize](impeccable/normalize/)** | Normalize design to match your design system |
| **[onboard](impeccable/onboard/)** | Design onboarding flows, empty states, and first-time user experiences |
| **[optimize](impeccable/optimize/)** | Improve performance — loading, rendering, animations, image optimization |
| **[overdrive](impeccable/overdrive/)** | Push interfaces past conventional limits — shaders, physics, 60fps animations |
| **[polish](impeccable/polish/)** | Final quality pass — alignment, spacing, consistency, detail fixes |
| **[quieter](impeccable/quieter/)** | Tone down overly bold or aggressive designs |
| **[teach-impeccable](impeccable/teach-impeccable/)** | One-time setup — gathers design context for your project |
| **[typeset](impeccable/typeset/)** | Improve typography — font choices, hierarchy, sizing, weight, readability |

### SEO Skills (17 sub-skills)

A comprehensive SEO toolkit from [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) covering technical audits, content quality, local SEO, schema markup, and more.

> **Important:** SEO skills live under `claude-seo/` but Claude Code only discovers skills one level deep (`~/.claude/skills/*/SKILL.md`). **You must run `setup.sh`** to create symlinks at the top level (e.g., `~/.claude/skills/seo` → `claude-seo/seo`). Without this step, SEO skills will **not** be available in Claude Code.

| Skill | Description |
|-------|-------------|
| **[seo](claude-seo/seo/)** | Comprehensive SEO analysis — full site audits, E-E-A-T, Core Web Vitals, schema, GEO |
| **[seo-audit](claude-seo/seo-audit/)** | Full website technical audits with parallel subagent delegation |
| **[seo-page](claude-seo/seo-page/)** | Deep single-page SEO analysis |
| **[seo-technical](claude-seo/seo-technical/)** | Technical SEO audits — crawlability, indexability, security, Core Web Vitals |
| **[seo-content](claude-seo/seo-content/)** | Content quality and E-E-A-T analysis with AI citation readiness |
| **[seo-schema](claude-seo/seo-schema/)** | Schema.org structured data detection, validation, and generation |
| **[seo-sitemap](claude-seo/seo-sitemap/)** | XML sitemap analysis and generation |
| **[seo-images](claude-seo/seo-images/)** | Image optimization — alt text, file sizes, formats, lazy loading |
| **[seo-image-gen](claude-seo/seo-image-gen/)** | AI image generation for SEO assets (OG images, hero images, infographics) |
| **[seo-plan](claude-seo/seo-plan/)** | Strategic SEO planning — SaaS, e-commerce, local, publisher, agency templates |
| **[seo-local](claude-seo/seo-local/)** | Local SEO — Google Business Profile, NAP consistency, citations |
| **[seo-maps](claude-seo/seo-maps/)** | Maps intelligence — geo-grid rank tracking, GBP auditing, review analysis |
| **[seo-geo](claude-seo/seo-geo/)** | Generative Engine Optimization — AI Overviews, ChatGPT search, Perplexity |
| **[seo-hreflang](claude-seo/seo-hreflang/)** | Hreflang and international SEO validation |
| **[seo-competitor-pages](claude-seo/seo-competitor-pages/)** | Competitor comparison and alternatives page generation |
| **[seo-programmatic](claude-seo/seo-programmatic/)** | Programmatic SEO for pages generated at scale |
| **[seo-dataforseo](claude-seo/seo-dataforseo/)** | Live SEO data via DataForSEO — SERP analysis, keyword research, backlinks |

---

## gstack Skills

[gstack](https://github.com/garrytan/gstack) by Garry Tan — 27 skills that structure development as a complete sprint cycle: Think → Plan → Build → Review → Test → Ship → Reflect. Includes a persistent Chromium browser daemon for real QA testing.

> **Requires [Bun](https://bun.sh) v1.0+** — gstack compiles a browser daemon for QA/browsing skills. Built automatically by `setup.sh`.

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

### Security & Safety

| Skill | Description |
|-------|-------------|
| **[cso](gstack/cso/)** | Chief Security Officer — OWASP Top 10 + STRIDE threat model |
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

## Marketing Skills (untested)

25 marketing-focused skills covering A/B testing, analytics, copywriting, CRO, email sequences, SEO, pricing, and more. These have not been validated yet — use at your own risk.

See [`mkt-skills(not-tested)/`](mkt-skills(not-tested)/) for the full list.

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
