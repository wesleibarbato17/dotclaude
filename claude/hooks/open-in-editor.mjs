#!/usr/bin/env node
// PostToolUse hook: abre o arquivo tocado como ABA PERSISTENTE no editor da sessao.
//
// Proposito: manter docs/planos abertos pra revisao. O diff das EDICOES em si ja e
// mostrado dentro do editor pela extensao oficial do Claude Code (quando a sessao roda
// no IDE) — este hook NAO substitui isso, so garante que a aba nao some ao aceitar o diff.
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

// So age quando a sessao roda DENTRO de um IDE (extensao / terminal integrado).
// App Desktop e terminal externo nao tem editor pra abrir.
if (process.env.CLAUDE_CODE_ENTRYPOINT !== 'claude-vscode') process.exit(0);

const execPath = (process.env.CLAUDE_CODE_EXECPATH ?? '').toLowerCase();

// Detecta o editor da sessao pelo caminho do executavel. Forks especificos primeiro,
// VS Code por ultimo (o mais generico). Todos sao base Code-OSS e aceitam --reuse-window.
let cli;
if (execPath.includes('.antigravity')) cli = 'antigravity';
else if (execPath.includes('cursor')) cli = 'cursor';
else if (execPath.includes('windsurf')) cli = 'windsurf';
else if (execPath.includes('.vscode') || execPath.includes('microsoft vs code')) cli = 'code';
else process.exit(0);

// Delay: garante que o preview do diff fechou antes de reabrir a aba. Sem isso, o editor
// so refoca a URI ocupada e a aba some ao aceitar o diff.
setTimeout(() => {
  const child = spawn(cli, ['--reuse-window', filePath], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    shell: true,
  });
  child.unref();
}, 2000);
