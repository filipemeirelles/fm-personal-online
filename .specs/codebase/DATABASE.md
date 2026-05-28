# Banco de Dados - FM Personal Online

## Modelo Inicial

### auth.users

Tabela nativa do Supabase Auth.

```txt
id uuid primary key
email text unique
created_at timestamptz
```

### profiles

Dados públicos e role do usuário autenticado.

```txt
id uuid primary key references auth.users(id) on delete cascade
name text not null
role text not null check role in ('trainer', 'student')
created_at timestamptz default now()
updated_at timestamptz default now()
```

### trainers

Perfil profissional do personal trainer.

```txt
id uuid primary key
profile_id uuid references profiles(id)
bio text
created_at timestamptz default now()
updated_at timestamptz default now()
```

### students

Alunas vinculadas a um trainer.

```txt
id uuid primary key
profile_id uuid references profiles(id)
trainer_id uuid references trainers(id)
active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

> **Importante:** o modelo desta seção é o esboço inicial do projeto. As tabelas
> `trainers` e `students` nunca foram criadas — a implementação real usa
> `profiles` com `role` + `trainer_id`. As tabelas de treino implementadas na
> Sprint 4 estão descritas em "Schema implementado — Sprint 4" abaixo.

## Schema implementado — Sprint 4 (Prescrição de Treinos)

Criado por `supabase/migrations/004_workout_prescription.sql`.

### exercises (biblioteca global por trainer)

```txt
id uuid primary key
trainer_id uuid references profiles(id) on delete cascade
name text not null
muscle_group text
video_url text
description text
is_active boolean not null default true
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### workout_plans

```txt
id uuid primary key
trainer_id uuid references profiles(id) on delete cascade
student_id uuid references profiles(id) on delete cascade
name text not null
description text
is_active boolean not null default true
starts_at date
ends_at date
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
-- índice único parcial: apenas um plano ativo por aluna
```

### workout_days (Treino A, B, C)

```txt
id uuid primary key
workout_plan_id uuid references workout_plans(id) on delete cascade
name text not null
focus text
sort_order integer not null default 0
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### workout_exercises (exercício prescrito)

```txt
id uuid primary key
workout_day_id uuid references workout_days(id) on delete cascade
exercise_id uuid references exercises(id) on delete restrict
sets integer not null default 3
reps text not null
suggested_load text   -- único campo editável pela aluna (RLS + trigger guard)
rest text
notes text
sort_order integer not null default 0
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

A aluna só pode alterar `suggested_load`, garantido pela função/trigger
`guard_workout_exercise_columns`.

## Esboço inicial (não implementado como abaixo)

### workout_logs

Registro de execução de treino.

```txt
id uuid primary key
student_id uuid references students(id)
workout_plan_id uuid references workout_plans(id)
completed_at timestamptz default now()
notes text
created_at timestamptz default now()
```

### exercise_logs

Registro de execução individual por exercício.

```txt
id uuid primary key
workout_log_id uuid references workout_logs(id)
exercise_id uuid references exercises(id)
actual_load text
actual_reps text
notes text
created_at timestamptz default now()
```

## RLS Inicial

- Policies devem usar `auth.uid()` como base de identidade.
- `profiles.id` deve corresponder a `auth.uid()`.
- Trainer só deve acessar alunas vinculadas a ele.
- Student só deve acessar dados próprios.
- Logs devem ser protegidos por vínculo com a aluna autenticada.

## Migration Existente

```txt
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_profile_on_signup.sql
supabase/migrations/003_student_management.sql
supabase/migrations/004_workout_prescription.sql   -- aguardando aplicar no remoto
supabase/migrations/005_seed_exercises.sql          -- scaffold, aguardando base do trainer
```

As migrations 001–003 criam `profiles`, RLS, trigger de criação automática de
profiles, gestão de alunas e convites. A 004 cria as tabelas de prescrição
(Sprint 4). A 005 é um scaffold idempotente para popular a biblioteca quando o
trainer fornecer o arquivo da base.

Status: 001–003 aplicadas no projeto Supabase remoto `emvisxoadtdeojddvumd`.
004 e 005 ainda não aplicadas no remoto.

## Decisões Pendentes

- Confirmar fluxo final de criação de `profiles` após signup.
- Definir política de imutabilidade de logs após 24 horas (Sprint 5).
