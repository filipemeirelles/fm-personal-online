# Development Workflow

## Objetivo

Definir como o projeto será desenvolvido, revisado e versionado usando Spec Driven Development, GitHub e assistência de IA.

## Fluxo padrão

1. Atualizar ou revisar a documentação antes de criar código.
2. Criar uma branch para cada etapa ou funcionalidade.
3. Fazer alterações pequenas e com escopo claro.
4. Rodar lint, type-check e build antes de mergear.
5. Abrir pull request para revisão.
6. Fazer merge na `main` apenas quando a etapa estiver validada.

## Branches

Use a branch `main` como versão estável.

Padrões de branches:

```txt
feature/sprint-0-foundation
feature/auth-login
feature/student-management
feature/workout-plans
fix/auth-redirect
chore/project-config
```

## Commits

Usar Conventional Commits em português:

```txt
<tipo>(<escopo>): <descrição curta em português>
```

Exemplos:

```txt
docs(spec): atualiza escopo do MVP
chore(config): configura TypeScript estrito
feat(auth): adiciona tela de login
fix(workout): corrige listagem de exercícios
```

## Pull Requests

Cada PR deve conter:

- Resumo do que foi alterado
- Arquivos principais modificados
- Como testar
- Checklist de qualidade

Template sugerido:

```md
## Resumo

## Como testar

## Checklist
- [ ] Documentação atualizada
- [ ] Lint executado
- [ ] Type-check executado
- [ ] Build executado
- [ ] Sem dados sensíveis commitados
```

## Regras para trabalhar com IA

- Nunca pedir "crie o app inteiro".
- Sempre limitar a tarefa a uma etapa pequena.
- Pedir explicação dos arquivos alterados.
- Pedir que a IA não implemente funcionalidades fora da spec.
- Revisar o diff antes de commitar.

## Comandos esperados futuramente

```bash
npm run lint
npm run type-check
npm run build
```

## Qualidade mínima para merge

Uma alteração só deve ir para `main` se:

- O escopo estiver claro.
- A documentação relevante estiver atualizada.
- Não houver segredo em arquivos versionados.
- O app compilar sem erro.
- A alteração puder ser explicada em poucas frases.
