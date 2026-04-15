import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { removeAgentsMd } from '../src/bin/uninstall-utils';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'codegraph-uninstall-test-'));
}

function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('uninstall cleanup', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('removes the marked AGENTS.md section and preserves surrounding content', () => {
    const agentsMdPath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(
      agentsMdPath,
      [
        '# Team Rules',
        '',
        'Before the section.',
        '',
        '<!-- CODEGRAPH_START -->',
        '## CodeGraph',
        '',
        'Installed instructions.',
        '',
        '<!-- CODEGRAPH_END -->',
        '',
        '## Notes',
        '',
        'Keep this content.',
        '',
      ].join('\n'),
    );

    removeAgentsMd(agentsMdPath);

    const final = fs.readFileSync(agentsMdPath, 'utf-8');
    expect(final).toContain('# Team Rules');
    expect(final).toContain('Before the section.');
    expect(final).toContain('## Notes');
    expect(final).toContain('Keep this content.');
    expect(final).not.toContain('CODEGRAPH_START');
    expect(final).not.toContain('Installed instructions.');
  });

  it('deletes AGENTS.md when only the installed section remains', () => {
    const agentsMdPath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(
      agentsMdPath,
      [
        '<!-- CODEGRAPH_START -->',
        '## CodeGraph',
        '',
        'Installed instructions.',
        '',
        '<!-- CODEGRAPH_END -->',
        '',
      ].join('\n'),
    );

    removeAgentsMd(agentsMdPath);

    expect(fs.existsSync(agentsMdPath)).toBe(false);
  });
});
