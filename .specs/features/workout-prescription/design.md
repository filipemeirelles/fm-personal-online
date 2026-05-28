# Design - Prescrição de Treinos

## Decisão Técnica

A hierarquia de prescrição é modelada em quatro tabelas:

```txt
exercises          (biblioteca global por trainer, reaproveitável)
workout_plans      (plano por aluna)
 └── workout_days        (Treino A, B, C dentro do plano)
      └── workout_exercises   (exercício prescrito = exercise + parâmetros)
```

A biblioteca (`exercises`) é separada do exercício prescrito (`workout_exercises`). Isso permite reaproveitar o mesmo exercício em vários treinos e alunas, mantendo nome, vídeo e instruções num só lugar. Os parâmetros que variam por prescrição (séries, reps, carga, descanso, observações) ficam em `workout_exercises`.

O banco e as policies são a fonte de verdade. A regra "a aluna só pode mudar a carga sugerida" é garantida por RLS + um trigger guard, no mesmo padrão do `guard_profile_sensitive_columns` da Sprint 3, já que o Postgres não tem RLS por coluna.

> **Nota de alinhamento:** o `.specs/codebase/DATABASE.md` previa tabelas `trainers`/`students` separadas, que nunca foram criadas. A implementação real usa `profiles` com `role` + `trainer_id`. Este design segue o schema real: `workout_plans.trainer_id` e `workout_plans.student_id` referenciam `profiles(id)`.

## Modelo de Dados

### `exercises` (biblioteca global do trainer)

```sql
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  muscle_group text,
  video_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exercises_trainer_id_idx on public.exercises (trainer_id);
create index exercises_muscle_group_idx on public.exercises (trainer_id, muscle_group);
```

- `is_active`: soft delete na biblioteca. Exercícios já prescritos continuam referenciados.
- `muscle_group`: armazenado como `text`, mas a UI restringe a uma lista fixa (ver "Listas fixas"). Manter como texto evita migration ao ajustar a lista.

### `workout_plans` (plano por aluna)

```sql
create table public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workout_plans_student_id_idx on public.workout_plans (student_id);
create index workout_plans_trainer_id_idx on public.workout_plans (trainer_id);

-- Apenas um plano ativo por aluna
create unique index workout_plans_one_active_per_student_idx
  on public.workout_plans (student_id) where is_active = true;
```

A aluna pode ter vários planos, mas o índice único parcial garante no máximo um ativo. A action `createPlan`/`activatePlan` desativa o plano ativo anterior na mesma operação antes de ativar o novo, evitando violar o índice.

### `workout_days` (Treino A, B, C)

```sql
create table public.workout_days (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  name text not null,
  focus text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workout_days_plan_id_idx on public.workout_days (workout_plan_id);
```

### `workout_exercises` (exercício prescrito)

```sql
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  sets integer not null default 3,
  reps text not null,
  suggested_load text,
  rest text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workout_exercises_day_id_idx on public.workout_exercises (workout_day_id);
```

- `exercise_id` usa `on delete restrict`: não dá pra apagar exercício da biblioteca que ainda está prescrito (deve-se desativar, não apagar).
- `reps` e `rest` são texto, mas a UI restringe a valores fixos (ver "Dropdowns").

## Listas fixas

Valores definidos em `src/lib/workout/options.ts` e usados nos `<select>`:

```ts
export const REPS_OPTIONS = ["6-8", "8-10", "8-12", "10-12", "12-15", "15-20", "Até a falha"];
export const REST_OPTIONS = ["30s", "45s", "60s", "90s", "2min", "3min"];
export const MUSCLE_GROUPS = [
  "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Antebraço",
  "Abdômen", "Quadríceps", "Posterior de coxa", "Glúteos",
  "Panturrilha", "Cardio", "Corpo inteiro",
];
```

São facilmente editáveis depois. Como `reps`/`rest`/`muscle_group` são `text` no banco, ampliar as listas não exige migration.

## RLS

### `exercises`

```sql
alter table public.exercises enable row level security;

-- Trainer gerencia a própria biblioteca
create policy "Trainers manage own exercises"
on public.exercises for all to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

-- Aluna lê os exercícios do próprio trainer (para renderizar o treino)
create policy "Students read trainer exercises"
on public.exercises for select to authenticated
using (
  trainer_id = (select trainer_id from public.profiles where id = auth.uid())
);
```

### `workout_plans`

```sql
alter table public.workout_plans enable row level security;

create policy "Trainers manage own plans"
on public.workout_plans for all to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "Students read own plans"
on public.workout_plans for select to authenticated
using (student_id = auth.uid());
```

### `workout_days`

```sql
alter table public.workout_days enable row level security;

create policy "Trainers manage days of own plans"
on public.workout_days for all to authenticated
using (
  exists (select 1 from public.workout_plans p
          where p.id = workout_plan_id and p.trainer_id = auth.uid())
)
with check (
  exists (select 1 from public.workout_plans p
          where p.id = workout_plan_id and p.trainer_id = auth.uid())
);

create policy "Students read days of own plans"
on public.workout_days for select to authenticated
using (
  exists (select 1 from public.workout_plans p
          where p.id = workout_plan_id and p.student_id = auth.uid())
);
```

### `workout_exercises`

```sql
alter table public.workout_exercises enable row level security;

-- Trainer: controle total dos exercícios dos próprios planos
create policy "Trainers manage exercises of own plans"
on public.workout_exercises for all to authenticated
using (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.trainer_id = auth.uid()
  )
);

-- Aluna: leitura dos exercícios dos próprios planos
create policy "Students read exercises of own plans"
on public.workout_exercises for select to authenticated
using (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.student_id = auth.uid()
  )
);

-- Aluna: pode atualizar (a coluna específica é restringida pelo trigger)
create policy "Students update own prescribed exercises"
on public.workout_exercises for update to authenticated
using (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.student_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.student_id = auth.uid()
  )
);
```

### Trigger guard: aluna só altera `suggested_load`

Como não há RLS por coluna, um trigger garante que, quando o chamador é a aluna dona do plano, apenas `suggested_load` pode mudar. O trainer (ou service role com `auth.uid()` nulo) passa livre. Mesmo padrão do `guard_profile_sensitive_columns`.

```sql
create or replace function public.guard_workout_exercise_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller uuid := auth.uid();
  is_student boolean;
begin
  if caller is null then
    return new; -- service role / RPC confiável
  end if;

  select exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = new.workout_day_id and p.student_id = caller
  ) into is_student;

  -- Trainer dono passa livre; quem não é aluna nem trainer é barrado pela RLS.
  if not is_student then
    return new;
  end if;

  -- Aluna: só suggested_load pode mudar.
  if new.workout_day_id is distinct from old.workout_day_id
     or new.exercise_id is distinct from old.exercise_id
     or new.sets is distinct from old.sets
     or new.reps is distinct from old.reps
     or new.rest is distinct from old.rest
     or new.notes is distinct from old.notes
     or new.sort_order is distinct from old.sort_order then
    raise exception 'A aluna só pode alterar a carga sugerida.';
  end if;

  return new;
end;
$$;

create trigger guard_workout_exercise_columns
before update on public.workout_exercises
for each row execute function public.guard_workout_exercise_columns();
```

## Rotas e Estrutura de Pastas

```txt
src/app/(dashboard)/
├── trainer/
│   ├── exercicios/
│   │   ├── page.tsx                 # biblioteca: lista + form
│   │   ├── actions.ts               # createExercise, updateExercise, deactivateExercise
│   │   └── exercise-form.tsx
│   └── alunas/[id]/
│       ├── page.tsx                 # + seção "Planos de treino" e botão criar
│       └── planos/
│           ├── actions.ts           # createPlan, deactivatePlan
│           └── [planId]/
│               ├── page.tsx         # editor do plano: dias + exercícios
│               ├── actions.ts       # addDay, updateDay, deleteDay, addExercise,
│               │                    #   updateExercise, deleteExercise, reorder
│               └── (componentes client do editor)
└── student/
    └── treinos/
        ├── page.tsx                 # plano vigente da aluna
        ├── actions.ts               # updateSuggestedLoad
        └── load-input.tsx           # campo client de carga
```

`src/lib/workout/options.ts` guarda as listas de dropdown.

## Server Actions

Trainer (em `actions.ts` correspondentes), todas validam sessão + role trainer + posse via RLS:

- `createExercise / updateExercise / deactivateExercise`
- `createPlan(studentId, …)` (desativa plano ativo anterior da aluna) / `activatePlan(planId)` / `deactivatePlan(planId)`
- `addDay / updateDay / deleteDay`
- `addExercise / updateExercise / deleteExercise` (exercício prescrito)
- Reordenação atualiza `sort_order`.

Aluna:

- `updateSuggestedLoad(workoutExerciseId, load)` — valida sessão e atualiza só `suggested_load`. A garantia real é do trigger + RLS.

Mutações usam o client server (`src/lib/supabase/server.ts`) com a sessão do usuário, para que a RLS atue. Não é necessário service role aqui.

## Tipos

Adicionar as quatro tabelas e o trigger a `src/types/database.ts` (Row/Insert/Update), seguindo o padrão já existente para `profiles` e `student_invites`.

## Interface

Tudo segue o design system (cards, botões, badges, fontes Playfair/Montserrat).

- **`/trainer/exercicios`**: cabeçalho "Biblioteca de exercícios" + botão "Novo exercício". Lista agrupada por grupo muscular com nome, link de vídeo e ações editar/desativar. Estado vazio acolhedor.
- **`/trainer/alunas/[id]`**: nova seção "Planos de treino" listando planos da aluna + botão "Novo plano".
- **`/trainer/alunas/[id]/planos/[planId]`**: editor. Lista de treinos (A, B, C) como cards/acordeão; dentro de cada treino, a lista de exercícios prescritos com séries, reps (dropdown), carga, descanso (dropdown) e observações; botões adicionar/reordenar/remover. Adicionar exercício abre seletor da biblioteca.
- **`/student/treinos`**: leitura limpa do plano vigente. Por treino, cartões de exercício com vídeo, séries, reps, descanso, observações e um campo editável de **carga sugerida** que salva via `updateSuggestedLoad` (debounce/blur). Estado vazio quando sem plano.

## Migrations

- `004_workout_prescription.sql` — tabelas, índices, RLS, trigger guard.
- `005_seed_exercises.sql` — seed da biblioteca, gerado quando o trainer enviar o arquivo (idempotente via `on conflict` ou `where not exists`).

## Riscos e Pontos de Atenção

- **Política RLS com `exists` aninhado** em `workout_days`/`workout_exercises` pode pesar em listas grandes. Mitigação: índices em `workout_plan_id`/`workout_day_id`; validar com `explain` no Studio se necessário.
- **Aluna burlando a edição** de campos além da carga. Mitigação: trigger guard no banco, testado por request manual, não só pela UI.
- **Exclusão de exercício da biblioteca em uso**: `on delete restrict` força desativar em vez de apagar; a UI deve oferecer "desativar", não "excluir".
- **Seed bloqueado**: a migration `005` depende do arquivo da base do trainer. Enquanto não chega, a biblioteca é populada manualmente pela tela.
- **Plano vigente x múltiplos planos**: nesta sprint `/student/treinos` mostra o(s) plano(s) ativo(s). Se houver mais de um ativo, listar todos; regra de "plano vigente único" fica para a Sprint 5/6 se necessário.
</content>
