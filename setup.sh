#!/bin/bash
# Claude Code Skills + Settings Setup
# Run this after cloning the skills repo to sync settings across devices.
#
# Usage:
#   git clone https://github.com/almeidamarcell/claude-code-skills.git ~/.claude/skills
#   ~/.claude/skills/setup.sh
#
# Or after pulling updates:
#   cd ~/.claude/skills && git pull && ./setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"
SETTINGS_SRC="$SCRIPT_DIR/settings.json"
SETTINGS_DST="$CLAUDE_DIR/settings.json"

# Parse flags
SKILLS_ONLY=false
NO_GSTACK=false
for arg in "$@"; do
  case "$arg" in
    --skills-only) SKILLS_ONLY=true ;;
    --no-gstack)   NO_GSTACK=true ;;
    --help|-h)
      echo "Usage: setup.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skills-only   Skip settings.json sync (keep your existing settings)"
      echo "  --no-gstack     Skip building the gstack browser daemon (no Bun required)"
      echo "  --help, -h      Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg (try --help)"
      exit 1
      ;;
  esac
done

echo "Claude Code Skills Setup"
echo "========================"
echo ""

# Ensure ~/.claude exists
mkdir -p "$CLAUDE_DIR"

# Settings sync (unless --skills-only)
if [ "$SKILLS_ONLY" = true ]; then
  echo "Skipping settings.json sync (--skills-only)"
else
  if [ ! -f "$SETTINGS_SRC" ]; then
    echo "Error: settings.json not found in skills repo ($SETTINGS_SRC)"
    exit 1
  fi

  # Backup existing settings if they differ
  if [ -f "$SETTINGS_DST" ]; then
    if ! diff -q "$SETTINGS_SRC" "$SETTINGS_DST" > /dev/null 2>&1; then
      BACKUP="$SETTINGS_DST.backup.$(date +%Y%m%d_%H%M%S)"
      cp "$SETTINGS_DST" "$BACKUP"
      echo "Backed up existing settings to: $BACKUP"
    else
      echo "Settings already up to date."
    fi
  fi

  cp "$SETTINGS_SRC" "$SETTINGS_DST"
  echo "Settings synced to: $SETTINGS_DST"
  echo ""
  echo "Enabled plugins:"
  grep -o '"[^"]*@[^"]*"' "$SETTINGS_DST" | sed 's/"//g' | while read -r plugin; do
    echo "  - $plugin"
  done
fi

# Symlink impeccable sub-skills to top level (Claude Code only discovers skills one level deep)
IMPECCABLE_DIR="$SCRIPT_DIR/impeccable"
if [ -d "$IMPECCABLE_DIR" ]; then
  echo ""
  echo "Linking impeccable skills..."
  for skill_dir in "$IMPECCABLE_DIR"/*/; do
    skill_name="$(basename "$skill_dir")"
    if [ -f "$skill_dir/SKILL.md" ]; then
      link_path="$SCRIPT_DIR/$skill_name"
      if [ -L "$link_path" ]; then
        # Already symlinked — skip
        :
      elif [ -e "$link_path" ]; then
        echo "  WARNING: $skill_name already exists at top level, skipping"
      else
        ln -s "impeccable/$skill_name" "$link_path"
        echo "  - $skill_name"
      fi
    fi
  done
  echo "Impeccable skills linked."
fi

# Build gstack (unless --no-gstack)
GSTACK_DIR="$SCRIPT_DIR/gstack"
if [ "$NO_GSTACK" = true ]; then
  echo ""
  echo "Skipping gstack build (--no-gstack)"
elif [ -d "$GSTACK_DIR" ] && [ -f "$GSTACK_DIR/setup" ]; then
  echo ""
  echo "Building gstack skills..."
  echo "========================="
  cd "$GSTACK_DIR" && ./setup
  echo "gstack skills ready."
fi

echo ""
echo "Done! Restart Claude Code for changes to take effect."
