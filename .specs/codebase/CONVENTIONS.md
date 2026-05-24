# Convenções - FM Personal Online

## Commits

Usar Conventional Commits em português:

```txt
<tipo>(<escopo>): <descrição curta em português>
```

Exemplos:

```txt
docs(specs): reorganiza documentação em fluxo spec-driven
feat(auth): cria páginas visuais de login e cadastro
chore(auth): configura client inicial do Supabase
fix(workout): corrige listagem de exercícios
```

Tipos sugeridos:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `ci`

## Branches

Usar `main` como branch estável.

Padrões sugeridos:

```txt
docs/specs-reorganization
feature/auth-login
feature/student-management
feature/workout-plans
fix/auth-redirect
chore/project-config
```

## Pull Requests

Cada PR deve conter:

- Resumo do que foi alterado.
- Arquivos principais modificados.
- Como testar.
- Checklist de qualidade.
- Confirmação de ausência de dados sensíveis.

## Nomes de Arquivos

- Componentes React: kebab-case para arquivos, PascalCase para funções exportadas.
- Rotas App Router: seguir convenções do Next.js (`page.tsx`, `layout.tsx`).
- Specs de feature: `spec.md`, `design.md`, `tasks.md`.
- Documentação estrutural: nomes em maiúsculas quando forem documentos principais.

## Escopo Pequeno por Alteração

- Uma mudança deve ter um propósito claro.
- Não misturar documentação, banco, UI e autenticação real sem necessidade.
- Criar features grandes em etapas: spec, design, tasks e execute.
- Preferir PRs pequenos e revisáveis.

## Regras Para IA

- Ler `.specs/project/PROJECT.md`, `.specs/project/STATE.md` e a feature spec antes de implementar.
- Não criar funcionalidades fora da spec.
- Não criar login, dashboard, banco ou Supabase antes da etapa correspondente.
- Não commitar `.env.local`, tokens, chaves ou dados sensíveis.
- Explicar arquivos criados ou alterados.
- Rodar `npm run lint`, `npm run type-check` e `npm run build` quando possível.
- Todo texto visível no webapp deve estar em português brasileiro.
