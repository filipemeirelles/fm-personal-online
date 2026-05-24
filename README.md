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

**Sprint 2 — Autenticação** (em andamento)

Base Next.js, documentação inicial, design system da marca, páginas visuais de autenticação, client inicial do Supabase e migration inicial de `profiles` já configurados. A autenticação real, proteção de rotas e deploy ainda não foram concluídos.

Veja o roadmap completo em [`.specs/project/ROADMAP.md`](./.specs/project/ROADMAP.md).

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
