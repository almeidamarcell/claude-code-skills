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

echo "Claude Code Settings Sync"
echo "========================="
echo ""

# Check source settings exist
if [ ! -f "$SETTINGS_SRC" ]; then
  echo "Error: settings.json not found in skills repo ($SETTINGS_SRC)"
  exit 1
fi

# Ensure ~/.claude exists
mkdir -p "$CLAUDE_DIR"

# Backup existing settings if they differ
if [ -f "$SETTINGS_DST" ]; then
  if ! diff -q "$SETTINGS_SRC" "$SETTINGS_DST" > /dev/null 2>&1; then
    BACKUP="$SETTINGS_DST.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$SETTINGS_DST" "$BACKUP"
    echo "Backed up existing settings to: $BACKUP"
  else
    echo "Settings already up to date. Nothing to do."
    exit 0
  fi
fi

# Copy settings
cp "$SETTINGS_SRC" "$SETTINGS_DST"
echo "Settings synced to: $SETTINGS_DST"
echo ""
echo "Enabled plugins:"
grep -o '"[^"]*@[^"]*"' "$SETTINGS_DST" | sed 's/"//g' | while read -r plugin; do
  echo "  - $plugin"
done
echo ""
echo "Done! Restart Claude Code for changes to take effect."
