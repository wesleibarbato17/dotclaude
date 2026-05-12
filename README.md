# dotclaude

Configurações pessoais do Claude Code pra fluxo Antigravity + VS Code no Windows.

Backup. Repo privada. Quando eu formatar máquina ou precisar levar o setup pra outro
notebook, é só clonar e copiar nos paths certos.

## O que essa config faz

- Quando o Claude edita um arquivo (`Write`, `Edit`, `MultiEdit`), o arquivo abre
  como **aba persistente** no editor (não some quando você aceita o diff).
- Detecta IDE automaticamente:
  - Antigravity → roda `antigravity --reuse-window <arquivo>`
  - VS Code → roda `code --reuse-window <arquivo>`
  - CLI puro / web / outro IDE → não faz nada
- Diff aparece **inline** (1 coluna com `+`/`-`) em vez de side-by-side.
- Delay de 2s antes de abrir → garante que o diff preview fechou primeiro.

## Como instalar em uma máquina nova

```bash
git clone https://github.com/wesleibarbato17/dotclaude.git
cd <projeto-onde-quero-usar>

# 1. Hook do Claude Code
mkdir -p .claude/hooks
cp ../dotclaude/claude/settings.json .claude/settings.json
cp ../dotclaude/claude/hooks/open-in-antigravity.mjs .claude/hooks/open-in-antigravity.mjs

# 2. Diff inline (mesclar no settings.json do workspace, NÃO sobrescrever)
mkdir -p .vscode
# Abra .vscode/settings.json e adicione a chave de ../dotclaude/vscode/settings-snippet.json
```

Verificar que `antigravity` e/ou `code` estão no `PATH`:

- Windows típico: `D:\Antigravity\bin\antigravity.cmd` e `D:\Microsoft VS Code\bin\code.cmd`
- Conferir com `which antigravity` e `which code` no git-bash.

## Arquivos

| Caminho | O que é |
|---|---|
| `claude/settings.json` | Hook `PostToolUse` (matcher `Write\|Edit\|MultiEdit`), modo async, timeout 15s |
| `claude/hooks/open-in-antigravity.mjs` | Script Node — lê JSON do stdin, detecta IDE via env var, setTimeout 2s, spawn detached |
| `vscode/settings-snippet.json` | `diffEditor.renderSideBySide: false` — pra mesclar no `.vscode/settings.json` do workspace |
| `docs/workflow-planejamento-em-abas.md` | Doc do padrão "planos vão em aba, não em chat" |

## Histórico — 3 iterações que falharam antes

1. **Hook global em `~/.claude/settings.json`** → disparava em qualquer sessão Claude
   Code local, incluindo conversas pela web → abria aba sem contexto. Resolvido movendo
   pra `.claude/settings.json` do projeto (escopo do projeto, commitável).
2. **Sem delay** → durante o diff preview, Antigravity entendia a URI como "já aberta"
   e só refocava. Ao aceitar, diff fechava levando o foco junto. Resolvido com
   `setTimeout 2000ms` antes de chamar `antigravity`.
3. **`--goto <file>:1:1` em vez de `--reuse-window`** → tentativa de bypass do diff
   preview. Não resolveu — Antigravity continuava vendo a URI ocupada. Resolvido
   abandonando essa ideia e indo no delay.

Config atual = **projeto-scoped + IDE-detect + delay 2s + diff inline**. Sem qualquer
um dos 4, o hook atrapalha mais que ajuda.

## Limitações conhecidas

- Não tem aceite "trecho-a-trecho" no editor (hunk-level) — extensão Claude Code
  hoje trata cada `Edit` como tudo-ou-nada via chat. Workaround: pedir Edits menores.
- Hook fica numa máquina; em outra máquina, precisa clonar/copiar este repo.

## Origem

Criado a partir do projeto peticaolegal.ai (Antigravity em 2026-05-11/12) após várias
iterações. Detalhes técnicos completos no `docs/workflow-planejamento-em-abas.md`.
