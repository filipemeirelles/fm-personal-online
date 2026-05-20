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

### workout_plans

Planos de treino atribuídos a alunas.

```txt
id uuid primary key
trainer_id uuid references trainers(id)
student_id uuid references students(id)
name text not null
description text
active boolean default true
starts_at date
ends_at date
created_at timestamptz default now()
updated_at timestamptz default now()
```

### exercises

Exercícios dentro de um plano de treino.

```txt
id uuid primary key
workout_plan_id uuid references workout_plans(id)
name text not null
sets integer
reps text
load text
rest text
notes text
video_url text
sort_order integer default 0
created_at timestamptz default now()
updated_at timestamptz default now()
```

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
```

Essa migration cria `profiles`, habilita RLS e adiciona policies mínimas para o próprio usuário autenticado.

## Decisões Pendentes

- Confirmar fluxo final de criação de `profiles` após signup.
- Decidir se `exercises` será biblioteca global ou apenas exercício por plano no MVP.
- Decidir se haverá `workout_days` para separar Treino A, B, C dentro do mesmo plano.
- Definir política de imutabilidade de logs após 24 horas.
