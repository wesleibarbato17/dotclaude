# CLAUDE.md — Edições acompanháveis + investigação ampla

Esta config existe para uma coisa: fazer o Claude Code editar de um jeito que o **humano consiga acompanhar** (parte por parte) e **investigar o repositório a fundo** antes de mexer — em vez de despejar um diff gigante no chat.

Copie este arquivo para `~/.claude/CLAUDE.md` (vale para todas as sessões) **ou** mescle no `CLAUDE.md` do seu projeto.

## Investigar antes de agir

- **Nunca chute** nome de função, arquivo, símbolo, caminho, schema ou comportamento de API. Verifique com `grep`/`glob`/`read` antes de afirmar ou editar. Se não dá pra verificar barato, pergunte.
- Antes de editar, **leia o trecho-alvo inteiro** e o contexto ao redor — não só a linha que vai mudar.
- Para perguntas amplas ou mudanças que tocam vários arquivos: **mapeie primeiro** os pontos afetados (lista `arquivo:linha`), mostre, e só então edite.
- Investigação ampla → **subagentes em paralelo** (um por subsistema/pergunta), não leitura em série de tudo.

## Editar parte por parte (acompanhável)

- **Anuncie em 1 linha, antes de cada edição**, o que vai mudar e onde (`arquivo:função/linha`).
- Prefira **várias edições pequenas e sequenciais** — uma por mudança lógica / trecho coeso — a um `Write`/`Edit` gigante. É assim que o humano acompanha e aceita/rejeita arquivo por arquivo no editor.
- **Nunca reescreva o arquivo inteiro** quando uma edição pontual resolve. Reescrita completa só com motivo explícito.
- Mudança em múltiplos pontos: **descreva o plano primeiro** (use o modo plan), depois aplique trecho a trecho na ordem anunciada.
- Depois de um **bloco coeso de edições, pare** e deixe revisar antes de seguir para o próximo bloco.

## Para o diff aparecer NO editor (não no chat)

- Rode o Claude Code **de dentro do IDE**: extensão oficial ou terminal integrado do VS Code / Antigravity / Cursor / Windsurf. É isso que conecta a sessão ao editor (lockfile em `~/.claude/ide/`) e faz o diff abrir no editor, com **Aceitar/Rejeitar**.
- O **app Claude Desktop** e **terminais externos** não conectam no editor → o código aparece no chat. Para edição acompanhável, rode no IDE.
- **Honestidade:** o Claude Code hoje aceita/rejeita a proposta **por arquivo**, não por trecho. As edições pequenas acima são a forma de *aproximar* o "trecho a trecho".

## Qualidade

- Solução **mínima** que resolve — sem overengineering, sem abstração além do necessário.
- Procure utilitário **existente** (`grep`) antes de criar um novo.
- Comente o **porquê**, não o **o quê**.
