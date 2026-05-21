-- Sprint 3 - Gestao de Alunas
-- Adiciona soft delete e vinculo trainer<->aluna em profiles, cria tabela
-- student_invites e funcoes/policies de suporte ao fluxo de convite.

-- 1. Colunas novas em profiles ---------------------------------------------

alter table public.profiles
  add column if not exists is_active boolean not null default true,
  add column if not exists trainer_id uuid references public.profiles(id) on delete set null;

create index if not exists profiles_trainer_id_idx
  on public.profiles (trainer_id)
  where role = 'student';

-- 2. Trigger que evita aluna reativar a propria conta ou trocar trainer ----
--
-- Sem column-level RLS no Postgres, precisamos de um trigger para garantir
-- que somente o trainer responsavel altere is_active e trainer_id.

create or replace function public.guard_profile_sensitive_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
  is_active_changed boolean;
  trainer_id_changed boolean;
begin
  is_active_changed := new.is_active is distinct from old.is_active;
  trainer_id_changed := new.trainer_id is distinct from old.trainer_id;

  if not is_active_changed and not trainer_id_changed then
    return new;
  end if;

  -- auth.uid() pode ser nulo quando a alteracao vem da service role
  -- (Admin API / RPC security definer). Nessa situacao confiamos no chamador.
  if auth.uid() is null then
    return new;
  end if;

  select role into caller_role
  from public.profiles
  where id = auth.uid();

  if caller_role is distinct from 'trainer' then
    raise exception 'Somente o trainer responsavel pode alterar is_active ou trainer_id.';
  end if;

  if new.trainer_id is distinct from auth.uid() then
    raise exception 'Trainer so pode alterar alunas vinculadas a ele.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_sensitive_columns on public.profiles;

create trigger guard_profile_sensitive_columns
before update on public.profiles
for each row
execute function public.guard_profile_sensitive_columns();

-- 3. RLS de profiles: trainer ve e atualiza alunas vinculadas --------------

drop policy if exists "Trainers can view own students" on public.profiles;

create policy "Trainers can view own students"
on public.profiles
for select
to authenticated
using (trainer_id = auth.uid());

drop policy if exists "Trainers can update own students" on public.profiles;

create policy "Trainers can update own students"
on public.profiles
for update
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

-- 4. handle_new_user_profile agora propaga trainer_id e is_active ----------

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
  profile_role text;
  profile_trainer_id uuid;
begin
  profile_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    split_part(new.email, '@', 1)
  );

  profile_role := case
    when new.raw_user_meta_data->>'role' in ('trainer', 'student') then new.raw_user_meta_data->>'role'
    else 'student'
  end;

  profile_trainer_id := nullif(new.raw_user_meta_data->>'trainer_id', '')::uuid;

  insert into public.profiles (id, name, role, trainer_id, is_active)
  values (new.id, profile_name, profile_role, profile_trainer_id, true)
  on conflict (id) do update
  set
    name = excluded.name,
    role = excluded.role,
    trainer_id = excluded.trainer_id,
    is_active = excluded.is_active;

  return new;
end;
$$;

-- 5. Tabela student_invites -------------------------------------------------

create table if not exists public.student_invites (
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

create unique index if not exists student_invites_trainer_email_pending_idx
  on public.student_invites (trainer_id, lower(email))
  where status = 'pending';

create index if not exists student_invites_token_idx
  on public.student_invites (token);

alter table public.student_invites enable row level security;

-- 6. RLS de student_invites: trainer ve e gerencia os proprios convites ----

drop policy if exists "Trainers manage own invites" on public.student_invites;

create policy "Trainers manage own invites"
on public.student_invites
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

-- 7. Funcao publica que carrega convite por token --------------------------
--
-- Usada pela rota /convite/[token] antes da aluna autenticar. O retorno ja
-- normaliza o status para 'expired' quando o convite passou da data.

create or replace function public.get_invite_by_token(invite_token text)
returns table (
  id uuid,
  trainer_id uuid,
  trainer_name text,
  name text,
  email text,
  status text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    i.id,
    i.trainer_id,
    p.name as trainer_name,
    i.name,
    i.email,
    case
      when i.status = 'pending' and i.expires_at < now() then 'expired'
      else i.status
    end as status,
    i.expires_at
  from public.student_invites i
  join public.profiles p on p.id = i.trainer_id
  where i.token = invite_token;
end;
$$;

revoke all on function public.get_invite_by_token(text) from public;
grant execute on function public.get_invite_by_token(text) to anon, authenticated;
