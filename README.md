# FM Personal Online

Plataforma web para personal trainers que atuam com consultoria online. Centraliza a gestão de alunos, prescrição de treinos e acompanhamento de evolução.

> Documentação completa: [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md)

---

## Stack

- **Next.js 14+** — App Router
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

**Sprint 0 — Fundação** (em andamento)

Veja o roadmap completo em [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md#9-roadmap-inicial).

## Convenção de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<escopo>): <descrição em português>
```

Exemplos: `feat(auth)`, `fix(workout)`, `docs(spec)`, `chore(config)`

Detalhes completos na spec: [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md#10-padrão-de-commits)
