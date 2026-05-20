# Integrações - FM Personal Online

## Supabase

Status: planejado e parcialmente preparado.

Uso previsto:

- Auth por email e senha.
- PostgreSQL para dados do app.
- RLS para segurança por perfil e vínculo trainer/student.

Estado atual:

- `@supabase/supabase-js` instalado.
- Client inicial em `src/lib/supabase/client.ts`.
- `.env.example` contém `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Migration inicial de `profiles` criada em `supabase/migrations/001_create_profiles.sql`.

## Vercel

Status: planejado.

Uso previsto:

- Deploy do app Next.js.
- Configuração de variáveis de ambiente.
- Preview deployments para PRs futuramente.

## GitHub

Status: em uso.

Uso previsto:

- Controle de versão.
- Branches pequenas por etapa.
- Pull requests para revisão.
- Histórico profissional para portfólio.

## Futuras Integrações Possíveis

- Stripe para planos de assinatura.
- Storage para fotos de progresso.
- Geração de PDF para relatórios.
- Notificações in-app.
- Wearables futuramente.
