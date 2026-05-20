# Database Schema — FM Personal Online

## Objetivo

Definir o modelo inicial de dados do MVP antes da implementação no Supabase.

## Entidades principais

### auth.users

Tabela nativa do Supabase Auth. Deve ser usada apenas para autenticação, email e identidade base do usuário.

```txt
id uuid primary key
email text unique
created_at timestamptz
```

### profiles

Representa os dados públicos e o perfil de acesso do usuário autenticado.

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

Alunos vinculados a um trainer.

```txt
id uuid primary key
profile_id uuid references profiles(id)
trainer_id uuid references trainers(id)
active boolean default true
created_at timestamptz default now()
updated_at timestamptz default now()
```

### workout_plans

Plano de treino atribuído a um aluno.

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

Registro de execução de um treino pelo aluno.

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

## RLS — Regras iniciais

As políticas devem usar `auth.uid()` como base de identidade e comparar esse valor com `profiles.id`.

### Trainer

- Pode visualizar apenas alunos vinculados a ele.
- Pode criar, editar e desativar seus próprios alunos.
- Pode gerenciar treinos dos próprios alunos.
- Pode visualizar logs dos próprios alunos.

### Student

- Pode visualizar apenas seu próprio perfil.
- Pode visualizar apenas treinos atribuídos a ele.
- Pode criar logs apenas para seus próprios treinos.
- Não pode editar plano de treino.

## Decisão definida

- Usar `auth.users` do Supabase para autenticação e `profiles` para dados públicos e role do usuário.

## Decisões pendentes

- Decidir se `exercises` será uma biblioteca global ou apenas exercícios por plano no MVP.
- Decidir se haverá `workout_days` para separar Treino A, B, C dentro do mesmo plano.
- Definir política de imutabilidade dos logs após 24 horas.
