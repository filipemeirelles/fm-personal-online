# Design - Gestão de Alunas

## Decisão Técnica

A relação trainer ↔ aluna é modelada como uma coluna `trainer_id` em `profiles`. O onboarding de alunas vira fluxo de convite com token, criado pelo trainer e consumido em rota pública `/convite/[token]`.

O banco e as policies são a fonte de verdade. O middleware checa `is_active` antes de liberar rotas `/student`. O envio de email entra como melhoria futura; nesta sprint o link é exibido para o trainer copiar e repassar.

## Modelo de Dados

### Alteração em `profiles`

```sql
alter table public.profiles
  add column if not exists is_active boolean not null default true,
  add column if not exists trainer_id uuid references public.profiles(id);

create index if not exists profiles_trainer_id_idx
  on public.profiles (trainer_id) where role = 'student';
```

- `is_active`: usado para soft delete. Default `true`.
- `trainer_id`: nulo para trainers; obrigatório (via policy/check) para students aceitos via convite.

### Tabela `student_invites`

```sql
create table public.student_invites (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  token text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'cancelled', 'expired')),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index student_invites_trainer_email_pending_idx
  on public.student_invites (trainer_id, lower(email))
  where status = 'pending';

create index student_invites_token_idx on public.student_invites (token);
```

- Token armazenado direto (UUID v4). Suficiente para MVP. Se virar requisito de segurança maior, trocar por hash.
- Índice único parcial impede dois convites pendentes para o mesmo email pelo mesmo trainer.

## Fluxo de Convite

1. Trainer abre `/trainer/alunas`.
2. Em um formulário inline ou modal, informa nome e email.
3. Server Action `createInvite` valida sessão, role trainer, gera token e insere convite com `expires_at = now() + 7 days`.
4. Server retorna o link `${NEXT_PUBLIC_APP_URL}/convite/${token}`.
5. Trainer copia e envia o link manualmente (WhatsApp/email/etc) nesta sprint.

## Fluxo de Aceite

1. Aluna abre `/convite/[token]`.
2. Server Component carrega o convite (via função `security definer` que filtra por token, status `pending` e `expires_at > now()`).
3. Se inválido/expirado/usado, página exibe mensagem clara e oferece contato.
4. Se válido, formulário pede senha. Email e nome aparecem somente leitura.
5. Server Action `acceptInvite` executa em uma transação no banco (via função RPC):
   - Cria usuário em `auth.users` via Supabase Admin API (service role no servidor).
   - Garante `profiles` com `role = student`, `trainer_id = invite.trainer_id`, `is_active = true`.
   - Marca convite como `accepted` com `accepted_at = now()`.
6. Após sucesso, autentica a aluna (`signInWithPassword`) e redireciona para `/student`.

## Fluxo de Desativação

1. Trainer abre `/trainer/alunas/[id]`.
2. Clica em "Desativar acesso", confirma.
3. Server Action atualiza `profiles.is_active = false` para o id especificado, validando que `profiles.trainer_id` é o trainer logado.
4. Aluna desativada que tenta logar é deslogada no `signInWithPassword` callback do form (consulta `is_active`) e/ou pelo middleware.

## Rotas e Estrutura de Pastas

```txt
src/app/
├── (auth)/
│   ├── login/
│   └── cadastro/              # desabilitado: redireciona para /login
├── (dashboard)/
│   ├── trainer/
│   │   ├── page.tsx
│   │   └── alunas/
│   │       ├── page.tsx                  # listagem ativas + pendentes
│   │       ├── novo-convite/
│   │       │   └── page.tsx              # opcional: form dedicado
│   │       └── [id]/
│   │           └── page.tsx              # perfil individual
│   └── student/
│       └── page.tsx
└── convite/
    └── [token]/
        └── page.tsx           # rota pública de aceite
```

Server Actions e queries de banco ficam em `src/app/(dashboard)/trainer/alunas/actions.ts` e `src/app/convite/[token]/actions.ts`.

## Server Actions

- `createInvite(name, email)` — em `trainer/alunas/actions.ts`. Valida sessão e role trainer. Retorna `{ link }` ou erro.
- `cancelInvite(id)` — marca convite como `cancelled`.
- `resendInvite(id)` — estende `expires_at`.
- `deactivateStudent(studentId)` — soft delete via `is_active = false`.
- `acceptInvite(token, password)` — em `convite/[token]/actions.ts`. Usa Supabase Admin API para criar usuário, atualizar profile e marcar convite.

## Supabase Admin API

Criar arquivo `src/lib/supabase/admin.ts` que instancia `createClient` com `SUPABASE_SERVICE_ROLE_KEY`. **Esse client só pode ser usado em código server-side (Server Actions, Route Handlers, server components com `"use server"`)**. Nunca importar em código `"use client"`.

Adicionar variável `SUPABASE_SERVICE_ROLE_KEY=` em `.env.example` (sem valor) e em `.env.local` (com valor real do dashboard). Não é `NEXT_PUBLIC`, portanto não vaza para o bundle do cliente.

## RLS

### `profiles`

Adicionar policies para trainers verem profiles dos próprios students:

```sql
create policy "Trainers can view own students"
on public.profiles for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'trainer'
      and profiles.trainer_id = p.id
  )
);

create policy "Trainers can deactivate own students"
on public.profiles for update to authenticated
using (
  trainer_id = auth.uid()
)
with check (
  trainer_id = auth.uid()
);
```

### `student_invites`

```sql
alter table public.student_invites enable row level security;

create policy "Trainers manage own invites"
on public.student_invites for all to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());
```

Aceite público é resolvido por uma função `security definer` que carrega o convite pelo token sem usar o client autenticado (RLS é bypassed pela function). A função é a única superfície pública de leitura por token.

## Middleware

Adicionar verificação de `is_active` ao trecho que carrega o profile:

```ts
const { data: profile } = await supabase
  .from("profiles")
  .select("role, is_active")
  .eq("id", user.id)
  .single();

if (profile && profile.is_active === false) {
  await supabase.auth.signOut();
  return NextResponse.redirect(loginUrlWithMessage("acesso suspenso"));
}
```

Cadastro público é desabilitado: a página `/cadastro` vira redirect server-side para `/login?info=convite`.

## Variáveis de Ambiente

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
```

## Interface

A página `/trainer/alunas` segue o design system:

- Cabeçalho com título "Alunas" e botão primário "Convidar aluna".
- Bloco "Convites pendentes" com lista compacta: nome, email, status, botão de copiar link, ações reenviar/cancelar.
- Bloco "Alunas ativas" com lista: nome, email, data de entrada, link para perfil.
- Estados vazios curtos e acolhedores em português brasileiro.

A página `/trainer/alunas/[id]` exibe nome, email, data de entrada e botão "Desativar acesso" com modal de confirmação.

A página `/convite/[token]` reaproveita o layout `(auth)`, com card centralizado, mensagem de boas-vindas mencionando o nome do trainer, formulário com email/nome read-only e campo de senha. Erros em destaque rosé claro.

## Riscos e Pontos de Atenção

- Vazamento da `SUPABASE_SERVICE_ROLE_KEY` no bundle. Mitigação: nunca importar `admin.ts` em código com `"use client"`; revisar no `npm run build`.
- Conflito de email entre `auth.users` e convites pendentes. Mitigação: `acceptInvite` deve tratar erro de email já existente em `auth.users` com mensagem clara.
- Convite copiado e repassado para terceiros. Risco aceito: trainer é responsável pelo destino do link. Mitigação parcial: expiração curta (7 dias) e cancelamento manual.
- Política RLS recursiva em `profiles` (trainer consultando own students). Validar com `explain` no Studio.
