# Claude Code Skills

**A curated collection of 34 skills that supercharge [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — turning it into a domain expert on demand.**

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
/copywriting    # Write high-converting marketing copy
```

---

## Skills

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

### Marketing — Conversion & Growth

| Skill | Description |
|-------|-------------|
| **[mkt-page-cro](mkt-page-cro/)** | Optimize any marketing page for conversions — homepage, landing, pricing, features |
| **[mkt-signup-flow-cro](mkt-signup-flow-cro/)** | Reduce signup friction and boost registration conversions |
| **[mkt-onboarding-cro](mkt-onboarding-cro/)** | Optimize post-signup activation and time-to-value |
| **[mkt-form-cro](mkt-form-cro/)** | Optimize lead capture, contact, demo request, and checkout forms |
| **[mkt-popup-cro](mkt-popup-cro/)** | Create and optimize popups, modals, overlays, and exit-intent triggers |
| **[mkt-paywall-upgrade-cro](mkt-paywall-upgrade-cro/)** | Design in-app paywalls, upgrade screens, and feature gates |
| **[mkt-ab-test-setup](mkt-ab-test-setup/)** | Plan, design, and implement A/B tests with proper statistical rigor |
| **[mkt-analytics-tracking](mkt-analytics-tracking/)** | Set up GA4, GTM, event tracking, conversion tracking, and UTM strategies |
| **[mkt-referral-program](mkt-referral-program/)** | Design referral and affiliate programs that drive viral growth |
| **[mkt-free-tool-strategy](mkt-free-tool-strategy/)** | Plan and build free tools as marketing engines — engineering as marketing |

### Marketing — Content & Copy

| Skill | Description |
|-------|-------------|
| **[mkt-copywriting](mkt-copywriting/)** | Write clear, compelling marketing copy that drives action |
| **[mkt-copy-editing](mkt-copy-editing/)** | Systematic multi-pass editing to polish existing marketing copy |
| **[mkt-content-strategy](mkt-content-strategy/)** | Plan what content to create, topic clusters, and editorial calendars |
| **[mkt-email-sequence](mkt-email-sequence/)** | Create drip campaigns, nurture sequences, and lifecycle email flows |
| **[mkt-social-content](mkt-social-content/)** | Create platform-specific content for LinkedIn, Twitter/X, Instagram, TikTok |
| **[mkt-marketing-psychology](mkt-marketing-psychology/)** | Apply 70+ mental models and behavioral science principles to marketing |
| **[mkt-marketing-ideas](mkt-marketing-ideas/)** | 139 proven marketing approaches organized by category |
| **[mkt-product-marketing-context](mkt-product-marketing-context/)** | Define your product positioning once, reference it across all marketing skills |

### Marketing — SEO & Channels

| Skill | Description |
|-------|-------------|
| **[mkt-seo-audit](mkt-seo-audit/)** | Audit technical SEO, on-page issues, meta tags, and ranking problems |
| **[mkt-programmatic-seo](mkt-programmatic-seo/)** | Build SEO-driven template pages at scale — directories, location pages, comparisons |
| **[mkt-competitor-alternatives](mkt-competitor-alternatives/)** | Create competitor comparison and alternative pages for SEO and sales |
| **[mkt-paid-ads](mkt-paid-ads/)** | Google Ads, Meta, LinkedIn, Twitter/X — campaign strategy, targeting, and ad copy |

### Marketing — Launch & Pricing

| Skill | Description |
|-------|-------------|
| **[mkt-launch-strategy](mkt-launch-strategy/)** | Plan phased product launches — Product Hunt, beta, early access, waitlists |
| **[mkt-pricing-strategy](mkt-pricing-strategy/)** | Design pricing tiers, packaging, freemium models, and monetization strategy |

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
