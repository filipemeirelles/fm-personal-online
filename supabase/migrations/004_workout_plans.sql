-- Sprint 4 - Prescricao de Treinos
-- Cria tabelas workout_plans e plan_exercises com RLS e trigger que garante
-- um unico plano ativo por aluna.

-- 1. workout_plans ----------------------------------------------------------

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_plans_student_id_idx
  on public.workout_plans (student_id);

create index if not exists workout_plans_trainer_id_idx
  on public.workout_plans (trainer_id);

create unique index if not exists workout_plans_one_active_per_student_idx
  on public.workout_plans (student_id)
  where is_active = true;

drop trigger if exists set_workout_plans_updated_at on public.workout_plans;

create trigger set_workout_plans_updated_at
before update on public.workout_plans
for each row
execute function public.set_updated_at();

alter table public.workout_plans enable row level security;

drop policy if exists "Trainers manage own plans" on public.workout_plans;

create policy "Trainers manage own plans"
on public.workout_plans
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

drop policy if exists "Students view own plans" on public.workout_plans;

create policy "Students view own plans"
on public.workout_plans
for select
to authenticated
using (student_id = auth.uid());

-- 2. Trigger plano ativo unico por aluna -----------------------------------

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

drop trigger if exists ensure_single_active_plan_trigger on public.workout_plans;

create trigger ensure_single_active_plan_trigger
before insert or update of is_active on public.workout_plans
for each row
when (new.is_active is true)
execute function public.ensure_single_active_plan();

-- 3. plan_exercises ---------------------------------------------------------

create table if not exists public.plan_exercises (
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

create index if not exists plan_exercises_plan_id_idx
  on public.plan_exercises (plan_id, order_index);

drop trigger if exists set_plan_exercises_updated_at on public.plan_exercises;

create trigger set_plan_exercises_updated_at
before update on public.plan_exercises
for each row
execute function public.set_updated_at();

alter table public.plan_exercises enable row level security;

drop policy if exists "Trainers manage exercises of own plans" on public.plan_exercises;

create policy "Trainers manage exercises of own plans"
on public.plan_exercises
for all
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

drop policy if exists "Students view exercises of own plans" on public.plan_exercises;

create policy "Students view exercises of own plans"
on public.plan_exercises
for select
to authenticated
using (
  exists (
    select 1 from public.workout_plans p
    where p.id = plan_exercises.plan_id
      and p.student_id = auth.uid()
  )
);
