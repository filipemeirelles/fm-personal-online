# Design - Execução de Treinos

## Decisão Técnica

O registro de execução é modelado como um `workout_log` por sessão da aluna, com um `exercise_log` por exercício prescrito que ela quis registrar. A captura é toda em uma única tela: a aluna preenche o que fez, marca como concluído, e o sistema persiste tudo em uma transação leve (insert do log + insert dos exercise_logs).

No MVP os logs são editáveis sem janela de tempo. Isso simplifica o uso quando a aluna percebe que registrou errado, e é uma decisão consciente registrada em STATE.md.

## Modelo de Dados

### Tabela `workout_logs`

```sql
create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workout_logs_student_id_idx on public.workout_logs (student_id, completed_at desc);
create index workout_logs_plan_id_idx on public.workout_logs (plan_id);
```

- `completed_at null` = em andamento. No MVP, criação acontece direto como concluído (`completed_at = now()`).
- `notes` é observação geral do treino.

### Tabela `exercise_logs`

```sql
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  plan_exercise_id uuid not null references public.plan_exercises(id) on delete cascade,
  sets_done integer,
  reps_done text,
  load_done text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exercise_logs_workout_log_idx on public.exercise_logs (workout_log_id);
create unique index exercise_logs_unique_per_exercise
  on public.exercise_logs (workout_log_id, plan_exercise_id);
```

- `reps_done` e `load_done` como `text` para refletir os campos da prescrição.
- Índice único garante no máximo um registro por exercício por sessão.

## RLS

```sql
alter table public.workout_logs enable row level security;

create policy "Students manage own workout logs"
on public.workout_logs for all
to authenticated
using (student_id = auth.uid())
with check (student_id = auth.uid());

create policy "Trainers read workout logs of own students"
on public.workout_logs for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = workout_logs.student_id
      and p.trainer_id = auth.uid()
  )
);

alter table public.exercise_logs enable row level security;

create policy "Students manage own exercise logs"
on public.exercise_logs for all
to authenticated
using (
  exists (
    select 1 from public.workout_logs wl
    where wl.id = exercise_logs.workout_log_id
      and wl.student_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_logs wl
    where wl.id = exercise_logs.workout_log_id
      and wl.student_id = auth.uid()
  )
);

create policy "Trainers read exercise logs of own students"
on public.exercise_logs for select
to authenticated
using (
  exists (
    select 1 from public.workout_logs wl
    join public.profiles p on p.id = wl.student_id
    where wl.id = exercise_logs.workout_log_id
      and p.trainer_id = auth.uid()
  )
);
```

## Rotas e Estrutura

```txt
src/app/(dashboard)/student/
├── page.tsx                              (dashboard com plano ativo + histórico)
└── treinos/
    └── [planId]/
        ├── page.tsx                      Visualização do plano (read-only)
        ├── registrar/
        │   ├── page.tsx                  Form de execução (server component)
        │   ├── execution-form.tsx        Client component com o formulário grande
        │   └── actions.ts                Server Actions de registro
        └── historico/
            └── [logId]/
                ├── page.tsx              Detalhe de uma execução (server)
                └── edit-form.tsx         Form para editar
```

## Server Actions

- `recordWorkoutExecution(planId, logData, exerciseEntries)` — cria `workout_log` + `exercise_logs` em sequência. Em caso de falha em algum exercise_log, deleta o workout_log para não deixar lixo.
- `updateWorkoutExecution(logId, logData, exerciseEntries)` — atualiza um log existente.
- Toda action valida sessão e que a aluna é a dona via Supabase server client (RLS reforça).

## Fluxo de Execução

1. Aluna em `/student` vê o plano ativo e clica "Registrar treino".
2. Vai para `/student/treinos/[planId]/registrar`.
3. Página carrega os exercícios prescritos, monta o form com uma seção por exercício.
4. Aluna preenche o que conseguir e submete.
5. Server Action cria `workout_log` (com `completed_at = now()`) e os `exercise_logs` correspondentes.
6. Redireciona para `/student` com mensagem de sucesso.

## Edição

- `/student/treinos/[planId]/historico/[logId]` carrega o log e exercícios.
- Form reutiliza o componente de execução em modo edição.
- Submit chama `updateWorkoutExecution`.

## Trainer (Sprint 6)

A página `/trainer/alunas/[id]` consulta `workout_logs` (count + últimos N) e exibe um resumo. Não há rota dedicada para o trainer abrir detalhes; isso fica para uma futura iteração de acompanhamento.

## Riscos

- Form grande pode virar pesado se houver muitos exercícios. Mitigação: lista compacta, scroll natural, sem JS pesado.
- Edição livre de logs pode mascarar erros. Aceito no MVP; reavaliar com a Filipe antes de go-live real.
- Sem distinção entre "rascunho" e "concluído" — a aluna se compromete ao apertar o botão. Mitigação: confirmação no botão final.
