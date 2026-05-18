# Database Schema — FM Personal Online

## Objetivo

Definir o modelo inicial de dados do MVP antes da implementação no Supabase.

## Entidades principais

### users

Representa usuários autenticados da aplicação.

```txt
id uuid primary key
email text unique not null
role text not null check role in ('trainer', 'student')
name text not null
created_at timestamptz default now()
updated_at timestamptz default now()
```

### trainers

Perfil profissional do personal trainer.

```txt
id uuid primary key
user_id uuid references users(id)
bio text
created_at timestamptz default now()
updated_at timestamptz default now()
```

### students

Alunos vinculados a um trainer.

```txt
id uuid primary key
user_id uuid references users(id)
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

## Decisões pendentes

- Confirmar se `users` será tabela própria ou `profiles` vinculada diretamente ao `auth.users` do Supabase.
- Decidir se `exercises` será uma biblioteca global ou apenas exercícios por plano no MVP.
- Decidir se haverá `workout_days` para separar Treino A, B, C dentro do mesmo plano.
- Definir política de imutabilidade dos logs após 24 horas.
