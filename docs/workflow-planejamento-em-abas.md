# Workflow — Planejamento em abas (não em chat)

Criado em 2026-05-11 com base em discussão Dom/Claude.
Hook automático ativo desde 2026-05-11.

## Princípio

Documento de "pensar" não vai no chat. Vai em arquivo, abre como **aba persistente**
do editor (Antigravity ou VS Code), e fica aberto pro Dom revisar/comentar/riscar.

## Três categorias de arquivo

| Categoria | Onde fica | Exemplo de path |
|---|---|---|
| **Planejamento do projeto** | `docs/` raiz ou `docs/specs/` | `docs/plano_refactor_X.md` |
| **Arquivos do projeto** | onde já mora no `src/` | código mesmo (`src/lib/...`) |
| **Checklists** | `docs/` ou `docs/specs/` | `docs/checklist_<tema>.md` |

Rascunho puro (1 uso, descartável) ainda pode ir em `.claude/scratch/` —
mas se vai virar referência futura, é `docs/`.

## Como o Claude aplica

Cada vez que eu produzo:
- Plano de implementação
- Diagrama Mermaid
- Análise / investigação
- Checklist
- Proposta arquitetural

Eu:
1. **Escrevo o arquivo** no caminho da tabela acima (`Write`).
2. **Abro como aba persistente** com `antigravity <caminho>` (no Windows / Antigravity).
3. **No chat fica só:** 1 linha de resumo + link clicável.
4. **Nunca fecho a aba** — você decide quando fechar.

Se a sessão estiver em outro IDE (VS Code) ou web/CLI, o passo 2 muda:
- VS Code → `code <caminho>`
- CLI / web → não abre nada (não tem janela local)

Detecção via env var `CLAUDE_CODE_ENTRYPOINT` + path da extensão.

## Como o Dom usa

- Lê na aba, não no chat.
- Comenta direto no arquivo (edita, adiciona `// dom:`, risca trecho).
- Quando aprovar, vira commit normal (`git add docs/...` + commit).
- Quando descartar, deleta o arquivo.

## Por que isso é diferente do hook que foi removido em 2026-05-11

O hook anterior (`PostToolUse` global em `~/.claude/settings.json`) abria **toda**
edição de arquivo automaticamente — incluindo arquivos `.ts` do `src/`, em
**qualquer** sessão Claude Code local (mesmo se você estivesse conversando
pela web). Era ruído visual demais e vazava entre ambientes.

Este padrão é manual e escopo justo:
- Só dispara quando **eu** decido escrever um doc (não toda edição).
- Só abre no IDE da sessão atual (detectado por env var).
- Sessão web/CLI não dispara abertura local.

## TODO / pontos abertos

- [ ] Decidir se vira hook `PostToolUse` (automação) ou fica manual.
- [ ] Se virar hook: deve disparar só pra paths que casam com `docs/**` e
      `.claude/scratch/**`, ignorar `src/**`.
- [ ] Definir pasta canônica pra checklists (`docs/checklists/`?).

-- Dom / Claude
