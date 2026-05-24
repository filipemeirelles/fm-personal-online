# Stack - FM Personal Online

## Stack Atual

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 com App Router |
| UI | React 19 |
| Linguagem | TypeScript em modo estrito |
| Estilo | Tailwind CSS |
| Lint | ESLint com configuração Next |
| Package manager | npm |

## Stack Planejada

| Camada | Tecnologia |
|---|---|
| Auth | Supabase Auth |
| Banco | Supabase Postgres |
| Segurança | Supabase RLS |
| Deploy | Vercel |

## Scripts Principais

```bash
npm run dev
npm run lint
npm run type-check
npm run build
npm run start
```

## Observações

- `@supabase/supabase-js` já está instalado.
- O client inicial do Supabase está em `src/lib/supabase/client.ts`.
- As variáveis esperadas estão em `.env.example`.
- Chaves reais devem ficar apenas em `.env.local`.
