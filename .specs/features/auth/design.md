# Design - Autenticação

## Decisão Técnica

A autenticação usará Supabase Auth.

Modelo definido:

- `auth.users`: identidade nativa do Supabase.
- `profiles`: dados públicos e role (`trainer` ou `student`).
- `profiles.id`: mesmo UUID de `auth.users.id`.

## Fluxo de Cadastro Planejado

1. Usuário preenche `/cadastro` com nome, email, senha e perfil.
2. App chama Supabase Auth para criar usuário.
3. App cria registro em `profiles` com `id = auth.user.id`.
4. Usuário é redirecionado conforme role.

## Fluxo de Login Planejado

1. Usuário preenche `/login` com email e senha.
2. App chama Supabase Auth para autenticar.
3. App consulta `profiles` para obter role.
4. Usuário é redirecionado para a área correta.

## Rotas Planejadas

```txt
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── cadastro/
│       └── page.tsx
└── (dashboard)/
    ├── trainer/
    │   └── page.tsx
    └── student/
        └── page.tsx
```

## Arquivos Técnicos Existentes

```txt
src/lib/supabase/client.ts
src/types/database.ts
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_profile_on_signup.sql
```

## Criação de Profile no Cadastro

O formulário de cadastro envia `name` e `role` nos metadados do Supabase Auth.

A migration `002_create_profile_on_signup.sql` cria um trigger em `auth.users` para inserir automaticamente o registro em `public.profiles` depois do signup.

Isso evita depender de uma inserção manual no frontend e mantém a criação do profile próxima do banco.

## Variáveis de Ambiente

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

As chaves reais devem ficar apenas em `.env.local`.

## RLS Inicial de Profiles

A migration inicial permite que usuário autenticado:

- veja o próprio profile;
- insira o próprio profile;
- atualize o próprio profile.

Antes de dados reais, as policies devem ser testadas no Supabase Studio.

## Interface

As páginas visuais já seguem o design system da marca:

- `/login`: email, senha, botão de entrar e link para cadastro.
- `/cadastro`: nome, email, senha, seleção de perfil e link para login.

Próximas alterações visuais devem preservar a identidade premium, minimalista e acolhedora.
