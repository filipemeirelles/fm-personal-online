# Design - Prescrição de Treinos

## Decisão Técnica

Cada plano de treino pertence a um par (trainer, aluna) e contém uma lista linear ordenada de exercícios. Não existe biblioteca global de exercícios no MVP, e não há subdivisão em treino A/B/C — cada variação vira um plano distinto. Apenas um plano por aluna pode ficar ativo simultaneamente.

O banco e as policies são fonte de verdade. RLS impede que trainers vejam planos de alunas alheias e que alunas vejam planos que não são seus.

## Decisões Arquiteturais (registradas em STATE.md)

- **Exercícios por plano**, não biblioteca global. Cada exercício existe dentro de um único plano.
- **Sem `workout_days`**: cada treino (A, B, C) vira um plano separado. Simplicidade vence completude no MVP.
- **Plano ativo único por aluna**: garantido por trigger no banco que desativa demais planos ao ativar um.
- **Logs não imutáveis** no MVP (decisão registrada em design da Sprint 5).

## Modelo de Dados

### Tabela `workout_plans`

```sql
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workout_plans_student_id_idx on public.workout_plans (student_id);
create index workout_plans_trainer_id_idx on public.workout_plans (trainer_id);
create unique index workout_plans_one_active_per_student_idx
  on public.workout_plans (student_id)
  where is_active = true;
```

- `student_id` referencia `profiles.id` (a aluna).
- Índice único parcial garante no máximo um ativo por aluna.

### Tabela `plan_exercises`

```sql
create table public.plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  name text not null,
  sets integer,
  reps text,
  load text,
  rest text,
  notes text,
  video_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index plan_exercises_plan_id_idx on public.plan_exercises (plan_id, order_index);
```

- `reps`, `load`, `rest` são `text` para suportar formatos livres ("8-12", "60kg", "60s", "1 min").
- `order_index` define a ordem de exibição. Inserções novas recebem `max(order_index) + 1`.
- `on delete cascade` no `plan_id` deleta exercícios junto com o plano.

### Trigger de plano ativo único

```sql
create or replace function public.ensure_single_active_plan()
returns trigger
language plpgsql
as $$
begin
  if new.is_active is true then
    update public.workout_plans
      set is_active = false
      where student_id = new.student_id
        and id <> new.id
        and is_active = true;
  end if;
  return new;
end;
$$;

create trigger ensure_single_active_plan_trigger
before insert or update of is_active on public.workout_plans
for each row
when (new.is_active is true)
execute function public.ensure_single_active_plan();
```

## RLS

### `workout_plans`

```sql
alter table public.workout_plans enable row level security;

create policy "Trainers manage own plans"
on public.workout_plans for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "Students view own plans"
on public.workout_plans for select
to authenticated
using (student_id = auth.uid());
```

### `plan_exercises`

```sql
alter table public.plan_exercises enable row level security;

create policy "Trainers manage exercises of own plans"
on public.plan_exercises for all
to authenticated
using (
  exists (
    select 1 from public.workout_plans p
    where p.id = plan_exercises.plan_id
      and p.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_plans p
    where p.id = plan_exercises.plan_id
      and p.trainer_id = auth.uid()
  )
);

create policy "Students view exercises of own plans"
on public.plan_exercises for select
to authenticated
using (
  exists (
    select 1 from public.workout_plans p
    where p.id = plan_exercises.plan_id
      and p.student_id = auth.uid()
  )
);
```

## Rotas e Estrutura

```txt
src/app/(dashboard)/trainer/alunas/[id]/
├── page.tsx                          (existente, adiciona link para treinos)
├── deactivate-student-button.tsx     (existente)
└── treinos/
    ├── actions.ts                    Server Actions de plano e exercício
    ├── page.tsx                      Lista de planos da aluna
    ├── novo/
    │   ├── page.tsx                  Form de criar plano
    │   └── new-plan-form.tsx         Client component
    └── [planId]/
        ├── page.tsx                  Editor de plano (server)
        ├── plan-metadata-form.tsx    Editar título/descrição
        ├── plan-actions.tsx          Ativar/desativar/excluir plano
        ├── exercise-form.tsx         Form de adicionar exercício
        └── exercise-row.tsx          Linha com editar/remover/mover
```

## Server Actions (em `treinos/actions.ts`)

- `createPlan(studentId, title, description)` — cria plano inativo. Valida trainer dono da aluna.
- `updatePlanMetadata(planId, title, description)` — atualiza título/descrição.
- `setPlanActive(planId, isActive)` — ativa/desativa o plano.
- `deletePlan(planId)` — remove plano (cascade apaga exercícios).
- `addExercise(planId, data)` — insere exercício no fim da lista.
- `updateExercise(exerciseId, data)` — edita exercício.
- `deleteExercise(exerciseId)` — remove exercício.
- `moveExercise(exerciseId, direction)` — troca `order_index` com vizinho.

Todas validam sessão e role `trainer` e usam o cliente Supabase server-side (RLS faz o resto).

## Interface

Seguindo o design system:

- Listagem de planos: cards compactos com badge "Ativo" ou "Inativo".
- Editor: cabeçalho com título e descrição + lista de exercícios + form para adicionar exercício.
- Formulário de exercício usa inputs livres para `reps`, `load`, `rest` (texto). Campo `notes` usa `<Textarea>` (novo componente do design system).
- Mover ↑ / ↓ via botões pequenos por linha. Drag and drop fica para o futuro.

## Riscos

- Trigger de plano ativo único pode causar surpresa se o trainer ativar um plano sem perceber. Mitigação: confirmar visualmente o plano que foi desativado (toast/mensagem).
- Reordenar via dois `update` consecutivos não é atômico. Risco aceito no MVP — colisão simultânea entre dois clicks é raro.
- `load` e `reps` como texto livre dão flexibilidade mas dificultam análises futuras. Aceito no MVP; estruturar quando entrar evolução de carga.
