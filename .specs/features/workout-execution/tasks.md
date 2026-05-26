# Tasks - Execução de Treinos

## 1. Spec, design e tasks

Status: concluído.

## 2. Migration `005_workout_logs.sql`

Status: pendente — arquivo criado, aplicação manual no remoto pendente.

Critérios de verificação:

- Tabelas `workout_logs` e `exercise_logs` criadas com índices.
- RLS habilitada com policies para aluna e leitura do trainer.
- FK em cascade.

## 3. Atualizar tipos de banco

Status: pendente.

Critérios de verificação:

- `src/types/database.ts` reflete `workout_logs` e `exercise_logs`.
- `npm run type-check` passa.

## 4. Server Actions de execução

Status: pendente.

Critérios de verificação:

- `recordWorkoutExecution(planId, logData, exerciseEntries)`.
- `updateWorkoutExecution(logId, logData, exerciseEntries)`.
- Validam sessão e role `student`.
- Em caso de erro parcial, fazem rollback manual (apagam workout_log órfão).

## 5. Dashboard `/student` mostrando plano ativo

Status: pendente.

Critérios de verificação:

- Plano ativo aparece com nome, descrição e lista resumida.
- Botão "Registrar treino" leva para `/student/treinos/[planId]/registrar`.
- Estado vazio quando não há plano ativo.

## 6. Página de execução

Status: pendente.

Critérios de verificação:

- `/student/treinos/[planId]/registrar` carrega o plano e monta o form.
- Cada exercício tem campos `sets_done`, `reps_done`, `load_done`, `notes`.
- Form geral tem campo `notes` final.
- Submit cria log e redireciona.

## 7. Página de detalhe/edição do log

Status: pendente.

Critérios de verificação:

- `/student/treinos/[planId]/historico/[logId]` carrega log e exercise_logs.
- Permite editar e salvar.

## 8. Histórico em `/student`

Status: pendente.

Critérios de verificação:

- Lista as últimas 5 execuções com data e link para detalhe.

## 9. Smoke test manual (fica para o usuário)

Status: pendente.

Critérios de verificação:

- Trainer cria plano ativo.
- Aluna logada vê plano e registra execução.
- Histórico aparece em `/student`.
- Edição de log anterior funciona.

## 10. Rodar validações

Status: pendente.

Critérios de verificação:

- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
