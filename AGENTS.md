# AGENTS.md - Regras para esta workspace

## ⚠️ REGRAS CRÍTICAS DE SEGURANÇA

### Commits e Pushes
**SEMPRE pergunte ao usuário ANTES de executar qualquer comando que faça alterações permanentes no repositório:**

- `git commit`
- `git push`
- `git push --force`
- `git rebase`
- `git merge` (que cause conflitos)
- Qualquer comando que modifique o histórico do git

**Formato da pergunta:**
> "Posso fazer commit das alterações? Se sim, qual mensagem de commit devo usar?"

**Formato para push:**
> "Posso fazer push das alterações para o remote?"

### Exceções
- NÃO é necessário perguntar para: `git status`, `git diff`, `git log`, `git branch`, `git fetch`
- Se o usuário solicitar explicitamente o commit/push em uma mensagem, ainda assim CONFIRME antes de executar

### Motivo
Esta workspace contém projetos de múltiplas equipes/domínios e o usuário deseja manter controle total sobre o que entra no repositório.
