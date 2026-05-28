# Tasks - Prescrição de Treinos

> **PONTO DE RETOMADA:** código da Sprint 4 implementado e validado (`lint`, `type-check`, `build` passam). Falta aplicar as migrations no Supabase remoto (Task 4 — depende de acesso/credenciais) e o smoke test manual (Task 12). A Task 3 (seed) segue bloqueada aguardando o arquivo da base de exercícios do trainer. Branch ativa: `claude/github-project-analysis-vJMeq`.

## 1. Criar spec, design e tasks da feature

Status: concluído ao mergear este documento.

Critérios de verificação:

- Existe `.specs/features/workout-prescription/spec.md`.
- Existe `.specs/features/workout-prescription/design.md`.
- Existe `.specs/features/workout-prescription/tasks.md`.

## 2. Migration de prescrição

Status: concluído.

Critérios de verificação:

- Existe `supabase/migrations/004_workout_prescription.sql`.
- Cria `exercises`, `workout_plans`, `workout_days`, `workout_exercises` com os campos do `design.md`.
- Índices criados conforme design.
- RLS habilitada nas quatro tabelas com as policies de trainer e aluna.
- Trigger `guard_workout_exercise_columns` impede a aluna de alterar qualquer coluna além de `suggested_load`.

## 3. Migration de seed da biblioteca

Status: bloqueado (aguarda arquivo da base do trainer).

Critérios de verificação:

- Existe `supabase/migrations/005_seed_exercises.sql`.
- Popula `exercises` com a base fornecida, associada ao `trainer_id` correto.
- É idempotente (reaplicar não duplica).

## 4. Aplicar migrations no Supabase remoto

Status: pendente.

Critérios de verificação:

- `npx supabase db push` aplica as migrations sem erro.
- `npx supabase migration list` mostra local/remote alinhados.
- Tabelas, policies e trigger aparecem no Supabase Studio.

## 5. Atualizar tipos de banco

Status: concluído.

Critérios de verificação:

- `src/types/database.ts` inclui as quatro novas tabelas (Row/Insert/Update).
- `npm run type-check` passa.

## 6. Constantes de dropdown

Status: concluído.

Critérios de verificação:

- Existe `src/lib/workout/options.ts` exportando `REPS_OPTIONS`, `REST_OPTIONS` e `MUSCLE_GROUPS`.

## 7. Biblioteca de exercícios `/trainer/exercicios`

Status: concluído.

Critérios de verificação:

- Lista exercícios agrupados por grupo muscular, com nome, link de vídeo e ações editar/desativar.
- Form para criar/editar (nome, grupo muscular, vídeo/GIF, descrição).
- Desativação faz soft delete (`is_active = false`).
- Server Actions `createExercise`, `updateExercise`, `deactivateExercise` validam sessão e role trainer.
- Estado vazio claro. Estilo segue o design system.

## 8. Criar plano a partir do perfil da aluna

Status: concluído.

Critérios de verificação:

- `/trainer/alunas/[id]` ganha seção "Planos de treino" listando os planos da aluna (com destaque do ativo).
- Botão "Novo plano" cria plano com nome, descrição e datas opcionais.
- Trainer pode ativar/desativar planos; só um fica ativo por aluna.
- Server Actions `createPlan`, `activatePlan`, `deactivatePlan` validam posse da aluna (`trainer_id = auth.uid()`) e mantêm um único plano ativo.

## 9. Editor do plano `/trainer/alunas/[id]/planos/[planId]`

Status: concluído.

Critérios de verificação:

- Lista treinos (A, B, C) com nome e foco; permite adicionar, editar, reordenar e remover treinos.
- Dentro de cada treino, lista exercícios prescritos.
- Adicionar exercício abre seletor da biblioteca do trainer.
- Por exercício: séries (número), reps (dropdown), carga sugerida (texto), descanso (dropdown), observações.
- Permite editar, reordenar e remover exercícios prescritos.
- Server Actions: `addDay`, `updateDay`, `deleteDay`, `addExercise`, `updateExercise`, `deleteExercise`, reordenação.

## 10. Visualização da aluna `/student/treinos`

Status: concluído.

Critérios de verificação:

- Mostra o(s) plano(s) ativo(s) com treinos e exercícios.
- Por exercício: nome, vídeo/GIF (link), séries, reps, carga sugerida, descanso, observações.
- Estado vazio acolhedor quando não há plano.

## 11. Aluna edita carga sugerida

Status: concluído.

Critérios de verificação:

- Campo de carga sugerida editável na tela da aluna, salvando via `updateSuggestedLoad`.
- Aluna não consegue alterar nenhum outro campo (validado contra request manual, não só UI).

## 12. Smoke test manual

Status: pendente.

Critérios de verificação:

- Trainer cadastra exercícios na biblioteca.
- Trainer cria plano para a aluna, adiciona Treino A/B/C e prescreve exercícios.
- Reps e descanso saem de dropdowns; séries e carga aceitam os valores.
- Aluna vê o plano em `/student/treinos`.
- Aluna edita a carga sugerida e a alteração persiste.
- Tentativa da aluna de alterar outro campo (via request) é barrada pelo trigger.
- RLS: trainer não vê biblioteca/planos de outro trainer; aluna não vê plano de outra aluna.

## 13. Rodar validações

Status: concluído.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
</content>
