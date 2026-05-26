# FM Personal Online

Plataforma web para personal trainers que atuam com consultoria online. Centraliza a gestão de alunas, prescrição de treinos e acompanhamento de evolução.

> Documentação principal: [`.specs/project/PROJECT.md`](./.specs/project/PROJECT.md)

---

## Stack

- **Next.js 15+** — App Router
- **TypeScript** — tipagem estrita
- **Tailwind CSS** — estilização utilitária
- **Supabase** — banco de dados, autenticação e RLS
- **Vercel** — deploy contínuo

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencha os valores do Supabase em .env.local

# 3. Subir o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o build de produção |
| `npm run lint` | Verifica problemas de lint |
| `npm run type-check` | Verifica tipos TypeScript |

## Status do projeto

**MVP completo — fluxo principal implementado** (26/05/2026)

- Sprints 0 a 3 entregues e validadas (fundação, design system, autenticação, gestão de alunas).
- Sprints 4 a 6 implementadas: prescrição de treinos, execução pela aluna e dashboards utilizáveis.
- Migrations 004 e 005 criadas em `supabase/migrations/`, ainda pendentes de aplicação no projeto remoto.
- Smoke test manual fim-a-fim e primeiro deploy na Vercel são os próximos passos.

Veja o roadmap completo em [`.specs/project/ROADMAP.md`](./.specs/project/ROADMAP.md) e o estado em [`.specs/project/STATE.md`](./.specs/project/STATE.md).

## Deploy na Vercel

### Pré-requisitos

1. Projeto Supabase remoto configurado (já existe: `emvisxoadtdeojddvumd`).
2. Migrations aplicadas no remoto via `npx supabase db push`.
3. Conta na Vercel conectada ao GitHub.

### Variáveis de ambiente (obrigatórias)

Configurar em **Project Settings → Environment Variables** na Vercel:

| Nome | Origem |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API (campo `service_role`) |
| `NEXT_PUBLIC_APP_URL` | URL final do app na Vercel (ex: `https://fm-personal-online.vercel.app`) |

`SUPABASE_SERVICE_ROLE_KEY` é restrita a código server-only e nunca vai para o bundle do cliente (importada via `import "server-only"` em `src/lib/supabase/admin.ts`).

### Passos do primeiro deploy

1. Conectar o repositório `filipemeirelles/fm-personal-online` na Vercel.
2. Framework preset: **Next.js**. Sem comandos customizados — defaults bastam.
3. Adicionar as quatro variáveis acima.
4. Fazer o primeiro deploy.
5. Após deploy, copiar a URL final e atualizar `NEXT_PUBLIC_APP_URL`; refazer o deploy para os links de convite saírem corretos.
6. No Supabase, em **Authentication → URL Configuration**, adicionar a URL da Vercel em `Site URL` e `Redirect URLs`.

### Antes de cada deploy futuro

- Rodar `npm run lint && npm run type-check && npm run build` (com env vars dummy ou reais) localmente.
- Se houver migration nova em `supabase/migrations/`, aplicar com `npx supabase db push` **antes** do deploy.

## Documentação

A documentação principal segue um fluxo de Spec Driven Development inspirado nas fases Specify, Design, Tasks e Execute.

| Área | Arquivo |
|---|---|
| Visão do produto | [`.specs/project/PROJECT.md`](./.specs/project/PROJECT.md) |
| Roadmap | [`.specs/project/ROADMAP.md`](./.specs/project/ROADMAP.md) |
| Estado atual | [`.specs/project/STATE.md`](./.specs/project/STATE.md) |
| Stack | [`.specs/codebase/STACK.md`](./.specs/codebase/STACK.md) |
| Arquitetura | [`.specs/codebase/ARCHITECTURE.md`](./.specs/codebase/ARCHITECTURE.md) |
| Convenções | [`.specs/codebase/CONVENTIONS.md`](./.specs/codebase/CONVENTIONS.md) |
| Banco de dados | [`.specs/codebase/DATABASE.md`](./.specs/codebase/DATABASE.md) |
| Design system | [`.specs/features/design-system/spec.md`](./.specs/features/design-system/spec.md) |

O changelog permanece em [`docs/CHANGELOG.md`](./docs/CHANGELOG.md).

## Convenção de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<escopo>): <descrição em português>
```

Exemplos: `feat(auth)`, `fix(workout)`, `docs(spec)`, `chore(config)`

Detalhes completos em [`.specs/codebase/CONVENTIONS.md`](./.specs/codebase/CONVENTIONS.md).
