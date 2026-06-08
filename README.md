# dotclaude

Setup opinativo do Claude Code para **edição acompanhável** (parte por parte) em editores
baseados em VS Code — **Antigravity, VS Code, Cursor, Windsurf**.

Repositório público — pode clonar e usar.

## A ideia

Fazer o Claude Code editar de um jeito que dá pra **acompanhar**, não só aceitar um diff
gigante no chat. Três peças:

1. **Diff no editor** (não no chat) — rodar o Claude **dentro do IDE**. A extensão oficial
   do Claude Code já mostra o diff proposto no editor, com Aceitar/Rejeitar (por arquivo).
2. **Edições parte-por-parte** — um `CLAUDE.md` que instrui o Claude a investigar antes,
   anunciar cada mudança e fazer edições pequenas e sequenciais (em vez de reescrever o
   arquivo inteiro).
3. **Aba persistente** para docs/planos — um hook que abre o arquivo tocado como aba que
   não some quando você aceita o diff.

## O que muda tudo: rode DENTRO do IDE

O maior ganho é grátis e é sobre **onde** você roda o Claude:

- ✅ **Dentro do IDE** (extensão oficial ou terminal integrado do VS Code / Antigravity /
  Cursor / Windsurf) → o diff aparece **no editor**, com Aceitar/Rejeitar.
- ❌ **App Claude Desktop** ou **terminal externo** → sem conexão com o editor → o código
  aparece **no chat**.

Instale a extensão oficial do Claude Code no seu editor e rode a sessão por ela (ou pelo
terminal integrado dele).

## O que cada peça faz

| Caminho | O que é |
|---|---|
| `claude/CLAUDE.md` | Regras de investigação ampla + edição parte-por-parte. Copie para `~/.claude/CLAUDE.md` (global) ou mescle no `CLAUDE.md` do seu projeto. |
| `claude/settings.json` | Hook `PostToolUse` (matcher `Write\|Edit\|MultiEdit`), async, timeout 15s. |
| `claude/hooks/open-in-editor.mjs` | Script Node — lê JSON do stdin, detecta IDE (antigravity/code/cursor/windsurf) via env var, `setTimeout` 2s, spawn detached `--reuse-window`. Abre a aba persistente. |
| `vscode/settings-snippet.json` | `diffEditor.renderSideBySide: false` — diff inline. Mescle no settings do seu editor. |
| `docs/workflow-planejamento-em-abas.md` | O padrão "docs vão em aba, não no chat". |

## Instalar (manual)

```bash
git clone https://github.com/wesleibarbato17/dotclaude.git

# 1. Regras de edição — escolha UM:
#    global:        cp dotclaude/claude/CLAUDE.md ~/.claude/CLAUDE.md
#    por projeto:   mescle dotclaude/claude/CLAUDE.md no CLAUDE.md do seu repo

# 2. Hook de aba persistente (por projeto)
cd <seu-projeto>
mkdir -p .claude/hooks
cp ../dotclaude/claude/settings.json        .claude/settings.json
cp ../dotclaude/claude/hooks/open-in-editor.mjs .claude/hooks/open-in-editor.mjs

# 3. Diff inline (MESCLE, não sobrescreva)
#    adicione a chave de ../dotclaude/vscode/settings-snippet.json
#    no settings.json do seu editor
```

Conferir que o CLI do editor está no `PATH`:

- Windows típico: `D:\Antigravity\bin\antigravity.cmd`, `D:\Microsoft VS Code\bin\code.cmd`
- Conferir com `which antigravity code cursor windsurf` no git-bash.

> Instalador automático (`install.sh` / `install.ps1`, multiplataforma) está no roadmap —
> por ora a instalação é manual.

## O que isto NÃO faz (honestidade)

- **Não adiciona aceite trecho-a-trecho (hunk-level).** O Claude Code hoje aceita/rejeita
  a proposta **por arquivo inteiro**. As edições pequenas do `CLAUDE.md` *aproximam* o
  "parte por parte", mas aprovar/rejeitar por trecho dentro do editor exigiria uma
  extensão própria — e parte depende de API que a Anthropic ainda não expôs.
- **Não transforma o app Desktop em IDE.** Diff no editor exige rodar dentro do editor.

## Dúvidas comuns

**"A aba fecha quando clico em Aceitar — o hook quebrou?"**
Não. A aba de *preview* do diff é do próprio Claude Code e **fecha sozinha ao Aceitar/Rejeitar** —
comportamento nativo, não é o hook. O hook reabre o arquivo como aba normal ~2s depois, e essa fica.
Se esperar ~3s e ela não voltar, aí sim investigue (CLI no `PATH`? rodando dentro do IDE?).

**"Dá pra ter várias abas abertas ao mesmo tempo?"**
Sim — cada arquivo tocado vira a própria aba; elas **empilham**, não substituem a anterior
(`--reuse-window` reusa a *janela*, não a aba).

**"Posso pôr o hook no `~/.claude` global, pra valer em todo projeto?"**
Não recomendado: global ele dispara em **todos** os projetos abertos no IDE (foi a iteração #1 que
falhou). Deixe em `.claude/settings.json` do projeto.

## Histórico — iterações do hook que falharam antes

1. **Hook global em `~/.claude/settings.json`** → disparava em qualquer sessão Claude Code
   local, incluindo conversas pela web → abria aba sem contexto. Resolvido movendo para
   `.claude/settings.json` do projeto (escopo do projeto, commitável).
2. **Sem delay** → durante o diff preview, o editor entendia a URI como "já aberta" e só
   refocava. Ao aceitar, o diff fechava levando o foco junto. Resolvido com `setTimeout`
   2000ms antes de chamar o CLI.
3. **`--goto <file>:1:1` em vez de `--reuse-window`** → tentativa de bypass do diff
   preview. Não resolveu — o editor continuava vendo a URI ocupada. Abandonado em favor
   do delay.

Config atual do hook = **projeto-scoped + IDE-detect + delay 2s + diff inline**.

## Origem

Criado a partir do projeto peticaolegal.ai (Antigravity, 2026-05) e evoluído em 2026-06
para um setup instalável focado em edição acompanhável. Detalhes do padrão de abas em
`docs/workflow-planejamento-em-abas.md`.
