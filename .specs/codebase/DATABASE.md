# Banco de Dados - FM Personal Online

## Modelo Implementado

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
is_active boolean not null default true
trainer_id uuid references profiles(id) on delete set null
created_at timestamptz default now()
updated_at timestamptz default now()
```

- `is_active`: usado para soft delete da aluna.
- `trainer_id`: nulo para trainers; preenchido para students vinculados.
- Trigger `guard_profile_sensitive_columns` impede que a própria aluna altere `is_active` ou `trainer_id`.

### student_invites

Convites de aluna gerados pelo trainer.

```txt
id uuid primary key default gen_random_uuid()
trainer_id uuid not null references profiles(id) on delete cascade
name text not null
email text not null
token text not null unique
status text not null default 'pending' check (status in ('pending','accepted','cancelled','expired'))
expires_at timestamptz not null
accepted_at timestamptz
created_at timestamptz not null default now()
```

- Índice único parcial garante no máximo um convite pendente por email por trainer.
- Função `get_invite_by_token(text)` `security definer` lê o convite por token na rota pública.

### workout_plans

Planos de treino atribuídos a uma aluna.

```txt
id uuid primary key default gen_random_uuid()
trainer_id uuid not null references profiles(id) on delete cascade
student_id uuid not null references profiles(id) on delete cascade
title text not null
description text
is_active boolean not null default false
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

- Índice único parcial garante apenas um plano ativo por aluna.
- Trigger `ensure_single_active_plan` desativa os demais planos da aluna quando um novo é ativado.

### plan_exercises

Exercícios prescritos dentro de um plano.

```txt
id uuid primary key default gen_random_uuid()
plan_id uuid not null references workout_plans(id) on delete cascade
name text not null
sets integer
reps text
load text
rest text
notes text
video_url text
order_index integer not null default 0
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

- `reps`, `load` e `rest` são `text` para aceitar formatos livres ("8-12", "60kg", "60s").
- `order_index` controla a ordem de exibição.

### workout_logs

Registro de execução de uma sessão de treino pela aluna.

```txt
id uuid primary key default gen_random_uuid()
student_id uuid not null references profiles(id) on delete cascade
plan_id uuid not null references workout_plans(id) on delete cascade
started_at timestamptz not null default now()
completed_at timestamptz
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

- No MVP, `completed_at` é preenchido com `now()` na criação (não há fluxo de rascunho).
- Histórico editável sem janela de tempo.

### exercise_logs

Registro por exercício dentro de uma sessão.

```txt
id uuid primary key default gen_random_uuid()
workout_log_id uuid not null references workout_logs(id) on delete cascade
plan_exercise_id uuid not null references plan_exercises(id) on delete cascade
sets_done integer
reps_done text
load_done text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

- Índice único garante um registro por exercício por sessão.

## RLS Resumida

- `profiles`: usuário gerencia o próprio; trainer vê/atualiza alunas com `trainer_id = auth.uid()`. Trigger protege `is_active` e `trainer_id`.
- `student_invites`: trainer gerencia próprios convites; rota pública usa função security definer por token.
- `workout_plans`: trainer faz `for all` nos próprios; aluna faz `select` nos próprios.
- `plan_exercises`: trainer gerencia exercícios via join no plano dele; aluna lê exercícios dos próprios planos.
- `workout_logs`: aluna gerencia próprios; trainer faz `select` dos logs das próprias alunas.
- `exercise_logs`: mesma lógica de `workout_logs`, com join via workout_log.

## Migrations Existentes

```txt
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_profile_on_signup.sql
supabase/migrations/003_student_management.sql
supabase/migrations/004_workout_plans.sql
supabase/migrations/005_workout_logs.sql
```

Status: 001, 002 e 003 aplicadas no remoto. 004 e 005 criadas, pendentes de aplicação (`npx supabase db push`).

## Decisões Documentadas

- Exercícios por plano, sem biblioteca global no MVP.
- Sem `workout_days` no MVP — cada variação A/B/C é um plano separado.
- Plano ativo único por aluna garantido por índice único parcial + trigger.
- Logs editáveis sem janela de tempo no MVP.
