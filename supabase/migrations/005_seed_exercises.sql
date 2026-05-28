-- Sprint 4 - Seed da biblioteca de exercicios
--
-- SCAFFOLD: este arquivo esta pronto para receber a base de exercicios do
-- trainer (hoje no computador dele). Preencha o array `seed` abaixo com os
-- exercicios reais e rode `npx supabase db push`.
--
-- O bloco e idempotente: associa cada exercicio ao trainer informado e nao
-- duplica ao reaplicar (deduplica por trainer_id + lower(name)).
--
-- COMO PREENCHER:
--   1. Ajuste a busca do trainer (por email) na variavel `target_trainer`.
--   2. Adicione uma linha por exercicio no VALUES do CTE `seed`:
--        (name, muscle_group, video_url, description)
--      muscle_group deve bater com a lista fixa em src/lib/workout/options.ts
--      (Peito, Costas, Ombros, Biceps, Triceps, Antebraco, Abdomen,
--       Quadriceps, Posterior de coxa, Gluteos, Panturrilha, Cardio,
--       Corpo inteiro). video_url e description podem ser null.

do $$
declare
  target_trainer uuid;
begin
  -- Trainer dono da biblioteca. Ajuste o email para o do trainer real.
  select id into target_trainer
  from public.profiles
  where role = 'trainer'
  order by created_at asc
  limit 1;

  if target_trainer is null then
    raise notice 'Nenhum trainer encontrado. Seed de exercicios ignorado.';
    return;
  end if;

  with seed (name, muscle_group, video_url, description) as (
    values
      -- EXEMPLO (remova e cole a base real do trainer aqui):
      -- ('Supino reto', 'Peito', 'https://...', 'Barra, 4 series'),
      -- ('Puxada frontal', 'Costas', null, null),
      (null::text, null::text, null::text, null::text)
  )
  insert into public.exercises (trainer_id, name, muscle_group, video_url, description)
  select target_trainer, s.name, s.muscle_group, s.video_url, s.description
  from seed s
  where s.name is not null
    and not exists (
      select 1 from public.exercises e
      where e.trainer_id = target_trainer
        and lower(e.name) = lower(s.name)
    );
end $$;
