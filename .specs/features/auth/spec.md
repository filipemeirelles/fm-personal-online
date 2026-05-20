# Feature Spec - Autenticação

## Objetivo

Permitir que trainers e alunas acessem o FM Personal Online com email e senha usando Supabase Auth, mantendo separação por perfil e preparando a base para rotas protegidas.

## Contexto

A autenticação é necessária para validar o MVP: personal cria treino, aluna acessa e aluna registra execução. Antes de qualquer dashboard real, o sistema precisa identificar o usuário autenticado e seu perfil (`trainer` ou `student`).

## Escopo

- Usar Supabase Auth com email e senha.
- Usar `auth.users` como identidade base.
- Usar `profiles` para nome e role.
- Permitir cadastro com nome, email, senha e perfil inicial.
- Permitir login com email e senha.
- Permitir logout.
- Preparar redirecionamento por perfil.
- Preparar proteção de rotas por perfil.

## Fora de Escopo

- Recuperação de senha.
- Confirmação customizada de email.
- Login social.
- Convite por email.
- Dashboard funcional.
- CRUD de alunas.
- Treinos, exercícios ou logs.
- Multi-trainer.

## Requisitos

### AUTH-001 - Cadastro visual

A página `/cadastro` deve existir com campos de nome completo, email, senha e perfil.

Status: concluído visualmente.

### AUTH-002 - Login visual

A página `/login` deve existir com campos de email e senha.

Status: concluído visualmente.

### AUTH-003 - Supabase client

O projeto deve ter um client Supabase inicial usando `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Status: concluído.

### AUTH-004 - Schema de profiles

Deve existir uma migration para criar `profiles` com RLS mínima para o próprio usuário.

Status: migration criada e aplicada no projeto Supabase remoto.

### AUTH-005 - Cadastro funcional

O formulário `/cadastro` deve criar usuário no Supabase Auth e criar o respectivo profile.

Status: pendente.

### AUTH-006 - Login funcional

O formulário `/login` deve autenticar o usuário com Supabase Auth.

Status: pendente.

### AUTH-007 - Logout

Usuário autenticado deve conseguir encerrar sessão.

Status: pendente.

### AUTH-008 - Redirecionamento por perfil

Após login, trainer e student devem ser direcionados para suas áreas correspondentes.

Status: pendente.

### AUTH-009 - Proteção de rotas

Rotas privadas devem exigir sessão válida e role compatível.

Status: pendente.

## Critérios de Aceite da Feature

- Cadastro cria `auth.users` e `profiles` corretamente.
- Login autentica com email e senha.
- Usuário sem sessão não acessa rotas privadas.
- Trainer não acessa rotas exclusivas de student.
- Student não acessa rotas exclusivas de trainer.
- RLS impede acesso indevido mesmo se alguém manipular requests.
- Todo texto visível permanece em português brasileiro.
- `npm run lint`, `npm run type-check` e `npm run build` passam.
