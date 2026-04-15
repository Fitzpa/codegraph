#!/usr/bin/env node
/**
 * CodeGraph preuninstall cleanup script
 *
 * Runs automatically when `npm uninstall -g @colbymchenry/codegraph` is called.
 * Removes all CodeGraph configuration from Claude Code:
 *   - MCP server entry from ~/.claude.json
 *   - Permissions from ~/.claude/settings.json
 *   - CodeGraph section from ~/.claude/CLAUDE.md
 *   - CodeGraph section from ~/AGENTS.md
 *
 * This script must never throw — a failed cleanup must not block uninstall.
 */

import { runUninstallCleanup } from './uninstall-utils';

// Run cleanup — never throw
try {
  runUninstallCleanup();
} catch { /* ignore */ }
