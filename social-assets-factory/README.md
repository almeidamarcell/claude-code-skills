# social-assets-factory

A Claude Code skill for generating scroll-stopping social ad creatives (Instagram square 1080×1080, portrait 4:5, or story 9:16) for any business. Image generation runs through the **OpenAI Codex CLI** — it uses your existing Codex (ChatGPT) login, so there are **no API keys to manage and no per-image API billing**.

It bakes in a battle-tested, conversion-focused template — heavy display serif headlines, monospace terminal-style accents, dual color palette, floating dark proof cards, pose-aware portrait placement, safe zones for cropping, branded CTA pill.

> Adapted from [`ad-image`](https://github.com/almeidamarcell/ad-image-skill). Two changes: (1) it generates with **Codex** instead of the Higgsfield/OpenAI image APIs, and (2) it **follows the branding of the repo/session you're in** when one exists, falling back to a saved brand profile otherwise.

## What it does

Type `/social-assets-factory` and it walks you through generating a batch of 4 ad variations in the right brand style:

1. **Resolves your branding** (see below)
2. Asks for the angle/hook of the ad
3. Proposes 2–3 headline directions in your voice
4. Confirms composition (format, portrait pose, palette, proof card type, CTA)
5. Generates 4 layout variations with Codex
6. Normalizes them to exact pixel dimensions, saves to your output folder, opens them
7. Copies your picks to a `Keepers/` folder

## Branding resolution (the headline feature)

Every run, the skill resolves which brand identity to design with, in order:

1. **Repo / session design system (preferred).** If you run it inside a project that already declares a design system, it reads and uses that:
   - `DESIGN.md` (the gstack / `design-consultation` convention)
   - Brand docs: `BRAND.md`, `STYLEGUIDE.md`, `brand.json`, `theme.json`, `brand-guidelines.*`
   - `tailwind.config.*` theme colors + fonts
   - CSS custom properties (`:root { --color-... }`, `--primary`, `--accent`, `--font-*`)
   - Logos already in `public/`, `assets/`, `static/`
   It shows you what it extracted and lets you confirm or tweak before generating. The repo's live design system wins over any saved profile — assets should match the product you're building.
2. **Saved brand profile (fallback).** If the repo has no design system, it reads `~/.config/social-assets-factory/brand-profile.json` — the portable identity for one-off or repo-less runs.
3. **First-time setup wizard (last resort).** If neither exists, a one-time wizard captures your colors, fonts, portraits, logo, and voice, then saves the profile.

## Install

```bash
git clone https://github.com/almeidamarcell/claude-code-skills.git
# then copy this skill into your Claude Code skills directory:
cp -r claude-code-skills/social-assets-factory ~/.claude/skills/social-assets-factory
```

Then type `/social-assets-factory` in Claude Code.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- [OpenAI Codex CLI](https://github.com/openai/codex): `npm install -g @openai/codex` (or `brew install codex`), then `codex login` once.
  - No `OPENAI_API_KEY` needed. Codex authenticates from `~/.codex/auth.json` (your ChatGPT login). Generated images land in `~/.codex/generated_images/`.
- macOS `sips` (preinstalled) or ImageMagick for the exact-dimension normalize step.

## Why this template works

The visual rules come from many iterations of testing what converts for personal-brand and creator-led businesses:

- **Heavy display serif** (not sans-serif) — looks designed, not AI-generated
- **One focal element** sized ~2.5× the surrounding type — the eye lands once
- **Monospace terminal accent** — signals "tech / built / real product"
- **Floating dark proof card** — specificity instead of just claims
- **Pose-direction rule** — the pointing finger leads the eye to the headline, never off-frame
- **Safe zones** — every ad survives cropping to other placements (Reels, Stories, feed)

## Customization

Everything is configurable. Inside a branded repo, edit the repo's design source. For the portable fallback, edit `~/.config/social-assets-factory/brand-profile.json` (see `brand-profile.example.json` for the schema). The prompt template lives in `SKILL.md`; proof card variants in `prompt-blocks.md`. All plain Markdown.

## License

MIT — use it, fork it, share it.
