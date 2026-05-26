-- Sprint 5 - Execucao de Treinos
-- Cria tabelas workout_logs e exercise_logs com RLS. Aluna gerencia os
-- proprios registros; trainer le os registros das alunas vinculadas.

-- 1. workout_logs -----------------------------------------------------------

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.workout_plans(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_logs_student_id_idx
  on public.workout_logs (student_id, completed_at desc);

create index if not exists workout_logs_plan_id_idx
  on public.workout_logs (plan_id);

drop trigger if exists set_workout_logs_updated_at on public.workout_logs;

create trigger set_workout_logs_updated_at
before update on public.workout_logs
for each row
execute function public.set_updated_at();

alter table public.workout_logs enable row level security;

drop policy if exists "Students manage own workout logs" on public.workout_logs;

create policy "Students manage own workout logs"
on public.workout_logs
for all
to authenticated
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "Trainers read workout logs of own students" on public.workout_logs;

create policy "Trainers read workout logs of own students"
on public.workout_logs
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = workout_logs.student_id
      and p.trainer_id = auth.uid()
  )
);

-- 2. exercise_logs ----------------------------------------------------------

create table if not exists public.exercise_logs (
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

create index if not exists exercise_logs_workout_log_idx
  on public.exercise_logs (workout_log_id);

create unique index if not exists exercise_logs_unique_per_exercise
  on public.exercise_logs (workout_log_id, plan_exercise_id);

drop trigger if exists set_exercise_logs_updated_at on public.exercise_logs;

create trigger set_exercise_logs_updated_at
before update on public.exercise_logs
for each row
execute function public.set_updated_at();

alter table public.exercise_logs enable row level security;

drop policy if exists "Students manage own exercise logs" on public.exercise_logs;

create policy "Students manage own exercise logs"
on public.exercise_logs
for all
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

drop policy if exists "Trainers read exercise logs of own students" on public.exercise_logs;

create policy "Trainers read exercise logs of own students"
on public.exercise_logs
for select
to authenticated
using (
  exists (
    select 1 from public.workout_logs wl
    join public.profiles p on p.id = wl.student_id
    where wl.id = exercise_logs.workout_log_id
      and p.trainer_id = auth.uid()
  )
);
