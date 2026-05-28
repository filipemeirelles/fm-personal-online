-- Sprint 4 - Prescricao de Treinos
-- Cria a biblioteca de exercicios (global por trainer) e a hierarquia de
-- prescricao: workout_plans -> workout_days -> workout_exercises.
-- Inclui RLS para trainer e aluna e um trigger que garante que a aluna so
-- pode alterar a coluna suggested_load.

-- 1. Biblioteca de exercicios ----------------------------------------------

create table if not exists public.exercises (
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

create index if not exists exercises_trainer_id_idx
  on public.exercises (trainer_id);

create index if not exists exercises_muscle_group_idx
  on public.exercises (trainer_id, muscle_group);

drop trigger if exists set_exercises_updated_at on public.exercises;
create trigger set_exercises_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

-- 2. Planos de treino -------------------------------------------------------

create table if not exists public.workout_plans (
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

create index if not exists workout_plans_student_id_idx
  on public.workout_plans (student_id);

create index if not exists workout_plans_trainer_id_idx
  on public.workout_plans (trainer_id);

-- Apenas um plano ativo por aluna.
create unique index if not exists workout_plans_one_active_per_student_idx
  on public.workout_plans (student_id) where is_active = true;

drop trigger if exists set_workout_plans_updated_at on public.workout_plans;
create trigger set_workout_plans_updated_at
before update on public.workout_plans
for each row execute function public.set_updated_at();

-- 3. Treinos por dia (Treino A, B, C) --------------------------------------

create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  name text not null,
  focus text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_days_plan_id_idx
  on public.workout_days (workout_plan_id);

drop trigger if exists set_workout_days_updated_at on public.workout_days;
create trigger set_workout_days_updated_at
before update on public.workout_days
for each row execute function public.set_updated_at();

-- 4. Exercicios prescritos --------------------------------------------------

create table if not exists public.workout_exercises (
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

create index if not exists workout_exercises_day_id_idx
  on public.workout_exercises (workout_day_id);

drop trigger if exists set_workout_exercises_updated_at on public.workout_exercises;
create trigger set_workout_exercises_updated_at
before update on public.workout_exercises
for each row execute function public.set_updated_at();

-- 5. RLS: exercises ---------------------------------------------------------

alter table public.exercises enable row level security;

drop policy if exists "Trainers manage own exercises" on public.exercises;
create policy "Trainers manage own exercises"
on public.exercises for all to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

drop policy if exists "Students read trainer exercises" on public.exercises;
create policy "Students read trainer exercises"
on public.exercises for select to authenticated
using (
  trainer_id = (select trainer_id from public.profiles where id = auth.uid())
);

-- 6. RLS: workout_plans -----------------------------------------------------

alter table public.workout_plans enable row level security;

drop policy if exists "Trainers manage own plans" on public.workout_plans;
create policy "Trainers manage own plans"
on public.workout_plans for all to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

drop policy if exists "Students read own plans" on public.workout_plans;
create policy "Students read own plans"
on public.workout_plans for select to authenticated
using (student_id = auth.uid());

-- 7. RLS: workout_days ------------------------------------------------------

alter table public.workout_days enable row level security;

drop policy if exists "Trainers manage days of own plans" on public.workout_days;
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

drop policy if exists "Students read days of own plans" on public.workout_days;
create policy "Students read days of own plans"
on public.workout_days for select to authenticated
using (
  exists (select 1 from public.workout_plans p
          where p.id = workout_plan_id and p.student_id = auth.uid())
);

-- 8. RLS: workout_exercises -------------------------------------------------

alter table public.workout_exercises enable row level security;

drop policy if exists "Trainers manage exercises of own plans" on public.workout_exercises;
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

drop policy if exists "Students read exercises of own plans" on public.workout_exercises;
create policy "Students read exercises of own plans"
on public.workout_exercises for select to authenticated
using (
  exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = workout_day_id and p.student_id = auth.uid()
  )
);

drop policy if exists "Students update own prescribed exercises" on public.workout_exercises;
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

-- 9. Trigger guard: aluna so altera suggested_load -------------------------
--
-- Sem RLS por coluna no Postgres, garantimos via trigger que, quando o
-- chamador e a aluna dona do plano, apenas suggested_load pode mudar. O
-- trainer dono passa livre; service role (auth.uid() nulo) tambem.

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
    return new;
  end if;

  select exists (
    select 1 from public.workout_days d
    join public.workout_plans p on p.id = d.workout_plan_id
    where d.id = new.workout_day_id and p.student_id = caller
  ) into is_student;

  if not is_student then
    return new;
  end if;

  if new.workout_day_id is distinct from old.workout_day_id
     or new.exercise_id is distinct from old.exercise_id
     or new.sets is distinct from old.sets
     or new.reps is distinct from old.reps
     or new.rest is distinct from old.rest
     or new.notes is distinct from old.notes
     or new.sort_order is distinct from old.sort_order then
    raise exception 'A aluna so pode alterar a carga sugerida.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_workout_exercise_columns on public.workout_exercises;
create trigger guard_workout_exercise_columns
before update on public.workout_exercises
for each row execute function public.guard_workout_exercise_columns();
