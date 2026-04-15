import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const CODEGRAPH_SECTION_START = '<!-- CODEGRAPH_START -->';
const CODEGRAPH_SECTION_END = '<!-- CODEGRAPH_END -->';

function readJson(filePath: string): Record<string, any> | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJson(filePath: string, data: Record<string, any>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function removeMarkedSection(filePath: string): void {
  try {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    const startIdx = content.indexOf(CODEGRAPH_SECTION_START);
    const endIdx = content.indexOf(CODEGRAPH_SECTION_END);

    if (startIdx === -1 || endIdx <= startIdx) return;

    const before = content.substring(0, startIdx).trimEnd();
    const after = content.substring(endIdx + CODEGRAPH_SECTION_END.length).trimStart();
    content = before + (before && after ? '\n\n' : '') + after;

    if (content.trim() === '') {
      fs.unlinkSync(filePath);
    } else {
      fs.writeFileSync(filePath, content.trim() + '\n');
    }
  } catch {
    // Never fail
  }
}

export function removeMcpConfig(filePath = path.join(os.homedir(), '.claude.json')): void {
  const config = readJson(filePath);
  if (!config?.mcpServers?.codegraph) return;

  delete config.mcpServers.codegraph;

  if (Object.keys(config.mcpServers).length === 0) {
    delete config.mcpServers;
  }

  writeJson(filePath, config);
}

export function removeSettings(filePath = path.join(os.homedir(), '.claude', 'settings.json')): void {
  const settings = readJson(filePath);
  if (!settings) return;

  if (Array.isArray(settings.permissions?.allow)) {
    const before = settings.permissions.allow.length;
    settings.permissions.allow = settings.permissions.allow.filter(
      (permission: string) => !permission.startsWith('mcp__codegraph__'),
    );
    if (settings.permissions.allow.length === before) return;

    if (settings.permissions.allow.length === 0) {
      delete settings.permissions.allow;
    }
    if (Object.keys(settings.permissions).length === 0) {
      delete settings.permissions;
    }

    writeJson(filePath, settings);
  }
}

export function removeClaudeMd(filePath = path.join(os.homedir(), '.claude', 'CLAUDE.md')): void {
  removeMarkedSection(filePath);
}

export function removeAgentsMd(filePath = path.join(os.homedir(), 'AGENTS.md')): void {
  removeMarkedSection(filePath);
}

export function runUninstallCleanup(): void {
  removeMcpConfig();
  removeSettings();
  removeClaudeMd();
  removeAgentsMd();
}
