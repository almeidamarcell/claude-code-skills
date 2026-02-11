---
name: changelog-generator
description: Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes. Always persists the changelog to CHANGELOG.md in the project root.
---

# Changelog Generator

This skill transforms technical git commits into polished, user-friendly changelogs that your customers and users will actually understand and appreciate.

## Critical Rule: Always Persist to File

**ALWAYS write/update the `CHANGELOG.md` file in the project root.** The changelog must be committed alongside the code so it's versioned in git and visible on GitHub.

### Workflow

1. **Read existing `CHANGELOG.md`** (if it exists) to understand the current format and last documented version
2. **Scan git history** for commits since the last documented version
3. **Generate new entries** following the existing format
4. **Prepend new entries** to `CHANGELOG.md` (newest version at the top, below the header)
5. **Show the user** what was added

Never just print the changelog to chat — always write it to the file.

## When to Use This Skill

- After completing a batch of commits (bug fixes, features, etc.)
- Before creating a git tag or release
- When the user asks for a changelog or release notes
- As part of a PR or deploy workflow

## What This Skill Does

1. **Scans Git History**: Analyzes commits from a specific time period or between versions
2. **Categorizes Changes**: Groups into: Adicionado, Corrigido, Alterado, Removido (or the project's language)
3. **Translates Technical → User-Friendly**: Converts developer commits into customer language
4. **Formats Professionally**: Clean, structured entries following [Keep a Changelog](https://keepachangelog.com/) conventions
5. **Filters Noise**: Excludes internal commits (refactoring, tests, CI, docs unless user-facing)
6. **Persists to File**: Writes to `CHANGELOG.md` in the project root

## Format

Follow the project's existing `CHANGELOG.md` format. If none exists, use this default:

```markdown
# Changelog

Todas as mudancas relevantes deste projeto estao documentadas aqui.

---

## [VERSION] - YYYY-MM-DD

### Adicionado
- **Feature name**: User-friendly description

### Corrigido
- **Bug name**: What was fixed and why it matters

### Alterado
- **Change name**: What changed and the impact
```

### Rules

- Use the project's language (PT-BR if the project is in Portuguese)
- One section per version, newest first
- Group related commits into a single bullet point
- Bold the feature/fix name, then describe the impact
- Skip commits that are purely internal (test fixes, refactoring, CI config)
- Use semantic versioning: MAJOR.MINOR.PATCH
- Include the date in ISO format (YYYY-MM-DD)

## How to Use

```
/changelog
```

```
Generate changelog for commits since last release
```

```
Create release notes for version 2.5.0
```

## Tips

- Run from your git repository root
- The skill auto-detects the last documented version and only adds new entries
- If `CHANGELOG.md` doesn't exist, it creates one with the full history
- Review the output in the file before committing