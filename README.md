# Claude Code Skills

**A curated collection of skills that supercharge [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — turning it into a domain expert on demand.**

Skills are structured knowledge packs that Claude Code loads contextually. When you invoke a skill, Claude gains deep expertise in that domain: the right frameworks, best practices, proven patterns, and production-ready code templates. No hallucination, no outdated APIs — just precise, battle-tested guidance.

## Quick Start

### Install all skills

```bash
# Clone into your Claude Code skills directory
git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills
```

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

### Product Design & Strategy

| Skill | Description |
|-------|-------------|
| **[shaping](shaping/)** | Collaborative problem definition and solution design using the Shape Up methodology |
| **[breadboarding](breadboarding/)** | Map systems into affordance tables and wiring diagrams |

### Brand

| Skill | Description |
|-------|-------------|
| **[anthropic-brand-guideline](anthropic-brand-guideline/)** | Apply Anthropic's official brand colors, typography, and design standards |

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
