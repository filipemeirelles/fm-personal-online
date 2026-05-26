# Tasks - Prescrição de Treinos

## 1. Criar spec, design e tasks da feature

Status: concluído.

Critérios de verificação:

- Existe `.specs/features/workout-prescription/spec.md`.
- Existe `.specs/features/workout-prescription/design.md`.
- Existe `.specs/features/workout-prescription/tasks.md`.

## 2. Migration `004_workout_plans.sql`

Status: pendente — arquivo criado, aplicação manual no remoto pendente.

Critérios de verificação:

- Cria tabela `workout_plans` e índices descritos no design.
- Cria tabela `plan_exercises` com FK `on delete cascade` no `plan_id`.
- Cria trigger `ensure_single_active_plan` que garante apenas um ativo por aluna.
- Habilita RLS e cria policies para trainer e student.

## 3. Atualizar tipos de banco

Status: pendente.

Critérios de verificação:

- `src/types/database.ts` reflete as novas tabelas `workout_plans` e `plan_exercises`.
- `npm run type-check` passa.

## 4. Server Actions em `treinos/actions.ts`

Status: pendente.

Critérios de verificação:

- `createPlan`, `updatePlanMetadata`, `setPlanActive`, `deletePlan`.
- `addExercise`, `updateExercise`, `deleteExercise`, `moveExercise`.
- Cada action valida sessão e role `trainer`.
- Mensagens de erro em português brasileiro.

## 5. Componente Textarea no design system

Status: pendente.

Critérios de verificação:

- Existe `src/components/ui/textarea.tsx` seguindo o estilo do `Input`.
- Exportado e usado pelo form de plano e de exercício.

## 6. Página de listagem `/trainer/alunas/[id]/treinos`

Status: pendente.

Critérios de verificação:

- Lista todos os planos da aluna em ordem decrescente.
- Plano ativo aparece destacado.
- Botão primário "Novo plano".
- Estado vazio orienta a criar o primeiro plano.

## 7. Formulário de criação `/trainer/alunas/[id]/treinos/novo`

Status: pendente.

Critérios de verificação:

- Form simples com título e descrição.
- Submit chama `createPlan` e redireciona para o editor do plano criado.

## 8. Editor `/trainer/alunas/[id]/treinos/[planId]`

Status: pendente.

Critérios de verificação:

- Carrega plano e exercícios via Supabase server client.
- Permite editar metadados, adicionar/editar/remover exercícios, reordenar, ativar/desativar e excluir o plano.
- Confirmação no exclusão.

## 9. Link no perfil da aluna

Status: pendente.

Critérios de verificação:

- `/trainer/alunas/[id]` exibe link/atalho para `/trainer/alunas/[id]/treinos`.

## 10. Smoke test (manual, fica para o usuário)

Status: pendente — depende do usuário rodar.

Critérios de verificação:

- Trainer cria plano, adiciona exercícios, ativa e o plano anterior fica inativo.
- Aluna logada consegue ler o plano ativo via RLS no console do Supabase.
- Trainer de outra aluna não vê esse plano.

## 11. Rodar validações

Status: pendente.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
