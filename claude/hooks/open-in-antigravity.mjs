#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf-8'));
} catch {
  process.exit(0);
}

const filePath = input?.tool_input?.file_path;
if (!filePath) process.exit(0);

if (process.env.CLAUDE_CODE_ENTRYPOINT !== 'claude-vscode') process.exit(0);

const execPath = (process.env.CLAUDE_CODE_EXECPATH ?? '').toLowerCase();

let cli;
if (execPath.includes('.antigravity')) {
  cli = 'antigravity';
} else if (execPath.includes('.vscode') || execPath.includes('microsoft vs code')) {
  cli = 'code';
} else {
  process.exit(0);
}

setTimeout(() => {
  const child = spawn(cli, ['--reuse-window', filePath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    shell: true,
  });
  child.unref();
}, 2000);
