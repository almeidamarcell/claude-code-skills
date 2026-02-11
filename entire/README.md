# Entire Skill for Claude Code

A comprehensive skill for integrating [Entire](https://entire.io) - the AI session tracking platform - into Claude Code workflows.

## What is Entire?

Entire is a developer platform that hooks into your git workflow to capture AI agent sessions on every push. It creates checkpoints that you can rewind to, explains how code was created, and preserves the full context of AI-assisted development.

## What This Skill Does

This skill helps Claude Code users:

### 🚀 Setup & Installation
- Guide users through Entire installation (Homebrew or Go)
- Enable Entire in repositories with appropriate strategy
- Configure project and personal settings
- Verify installation and health

### ⏪ Rewind & Recovery
- Suggest rewinding when changes break code
- Guide users through checkpoint selection
- Restore code to previous states
- Explain rewind options for different strategies

### 📖 Session Exploration
- Explain how code was created
- Show full session transcripts
- Understand agent reasoning and decisions
- Explore session history

### 🔄 Workflow Integration
- Resume previous work on branches
- Check session status
- Integrate checkpoints into development flow
- Manage concurrent sessions

### 🩺 Troubleshooting
- Diagnose stuck sessions with `entire doctor`
- Fix shadow branch conflicts
- Clean orphaned data
- Reset corrupted state
- Debug SSH authentication issues

## Key Features

### Proactive Suggestions
The skill enables Claude to proactively suggest Entire commands when:
- Changes break tests or functionality
- User expresses regret about changes
- Complex refactoring is underway
- Switching branches or tasks

### Clear Communication
Provides clear messaging about:
- What checkpoints are and how they work
- When checkpoints are created (based on strategy)
- Rewind options and reversibility
- Session state and history

### Strategy Awareness
Understands both Entire strategies:
- **manual-commit** (default) - Clean git history, checkpoints on commits
- **auto-commit** - Automatic commits after each response

### Complete Command Coverage
Covers all Entire CLI commands:
- `entire enable` - Setup and configuration
- `entire status` - Current session state
- `entire rewind` - Restore to checkpoint
- `entire resume` - Continue previous work
- `entire explain` - Understand code creation
- `entire doctor` - Diagnose issues
- `entire clean` - Remove orphaned data
- `entire reset` - Nuclear option for corruption
- `entire disable` - Stop tracking

## Usage Examples

### Example 1: Breaking Changes

```
User: "Claude just broke my authentication, I want to go back"

Claude (using /entire skill):
Let's rewind to before those changes.

$ entire rewind

[Shows interactive checkpoint list]
[Guides user to select appropriate checkpoint]
[Explains what will be restored]
```

### Example 2: Understanding Code

```
User: "How was this payment processing implemented?"

Claude (using /entire skill):
Let me show you the session that created this code.

$ entire explain src/payment/processor.ts

[Shows full session transcript with prompts and responses]
[Explains reasoning and decisions made]
```

### Example 3: Setup

```
User: "Set up Entire for me"

Claude (using /entire skill):
I'll install and enable Entire in this repository.

[Checks if installed]
[Installs via Homebrew if needed]
[Enables with appropriate strategy]
[Verifies installation]
[Explains how to use]
```

## Skill Activation

This skill is automatically activated when users:
- Mention "entire", "checkpoints", or "rewinding"
- Want to undo AI-generated changes
- Ask about session history
- Need to troubleshoot Entire issues
- Want to install/setup Entire

## Configuration

The skill understands Entire's configuration system:

### Project Settings (`.entire/settings.json`)
```json
{
  "strategy": "manual-commit",
  "agent": "claude-code",
  "enabled": true,
  "strategy_options": {
    "push_sessions": true,
    "summarize": {
      "enabled": true
    }
  }
}
```

### Local Overrides (`.entire/settings.local.json`)
```json
{
  "log_level": "debug",
  "enabled": false
}
```

## Best Practices

### When to Suggest Entire

**Proactively suggest:**
- Before risky refactoring
- After breaking changes
- When user seems uncertain
- During complex multi-step work

**Always verify first:**
1. Check if Entire is installed
2. Check if enabled in current repo
3. Verify it's a git repository

### Communication Guidelines

**Be specific:**
- Explain what will happen
- Show checkpoint details
- Clarify reversibility
- Interpret command output

**Be helpful:**
- Guide step-by-step
- Explain concepts clearly
- Provide context for decisions
- Suggest next steps

## Technical Details

### Strategies Explained

| Strategy | Commits | Branch | Metadata | Use Case |
|----------|---------|--------|----------|----------|
| **manual-commit** | None on your branch | Shadow branch per HEAD | `.git/entire-sessions/` + `entire/checkpoints/v1` | Clean git history |
| **auto-commit** | Auto commits on branch | N/A | `entire/checkpoints/v1` only | Automatic commits |

### Session Structure

**Session ID:** `YYYY-MM-DD-<UUID>`
- Example: `2026-02-11-abc123de-f456-7890-abcd-ef1234567890`

**Checkpoint ID:** 12-character hex
- Example: `a3b2c4d5e6f7`

**Storage:**
- Active sessions: `.git/entire-sessions/`
- Committed: `entire/checkpoints/v1` branch

### Git Worktrees

Each git worktree gets independent session tracking:
- Separate shadow branches
- Isolated session state
- No cross-worktree conflicts

## Troubleshooting Guide

The skill can diagnose and fix:

| Issue | Solution |
|-------|----------|
| Not installed | Guide through Homebrew/Go install |
| Not enabled | Run `entire enable` |
| No checkpoints | Explain strategy and how to create |
| Shadow branch conflict | `entire reset --force` |
| SSH errors | Add GitHub keys to known_hosts |
| Stuck sessions | `entire doctor` then `entire reset` |

## Resources

- **Entire Website:** https://entire.io
- **GitHub Repository:** https://github.com/entireio/cli
- **Blog Post:** https://entire.io/blog/hello-entire-world/
- **Issues:** https://github.com/entireio/cli/issues

## Skill Metadata

- **Name:** `entire`
- **Description:** Capture AI agent sessions in your git workflow
- **Version:** 1.0.0
- **Author:** Based on Entire CLI documentation
- **License:** MIT (following Entire CLI license)

## Contributing

This skill was created by analyzing:
- Entire CLI source code
- Official README documentation
- CLAUDE.md architecture docs
- CONTRIBUTING.md guidelines

To improve this skill:
1. Test with real Entire workflows
2. Identify gaps in coverage
3. Add more scenarios
4. Clarify confusing sections
5. Update as Entire CLI evolves

## Notes

### Known Limitations

- Entire requires macOS/Linux (Windows via WSL)
- SSH authentication requires manual known_hosts setup
- Gemini CLI support is in preview
- Auto-summarization requires Claude CLI

### Future Enhancements

Potential additions:
- Visual checkpoint timeline
- Diff preview before rewind
- Batch operations on multiple checkpoints
- Integration with CI/CD workflows
- Advanced search across sessions

---

**This skill makes Entire a first-class citizen in Claude Code workflows.**