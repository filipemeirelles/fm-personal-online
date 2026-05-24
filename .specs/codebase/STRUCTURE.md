# Estrutura - FM Personal Online

## Estrutura Atual Principal

```txt
src/
├── app/
│   ├── (auth)/
│   ├── style-guide/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── shared/
│   └── ui/
├── hooks/
├── lib/
│   ├── supabase/
│   └── utils.ts
└── types/
```

## Estrutura de Specs

```txt
.specs/
├── project/
├── codebase/
├── features/
└── quick/
```

## Estrutura Desejada de Rotas

```txt
src/app/
├── (auth)/
│   ├── login/
│   └── cadastro/
├── (dashboard)/
│   ├── trainer/
│   └── student/
├── style-guide/
├── layout.tsx
└── page.tsx
```

## Finalidade de Cada Pasta

| Pasta | Finalidade |
|---|---|
| `.specs/project` | Visão, roadmap e estado do produto |
| `.specs/codebase` | Stack, arquitetura, convenções, riscos e banco |
| `.specs/features` | Specs por feature seguindo Specify, Design, Tasks e Execute |
| `.specs/quick` | Notas temporárias ou specs rápidas antes de formalizar uma feature |
| `docs` | Documentos legados e changelog mantido |
| `src/app` | Rotas do App Router |
| `src/components/ui` | Componentes base reutilizáveis |
| `src/components/shared` | Componentes compartilhados de aplicação |
| `src/lib` | Utilitários e integrações |
| `src/lib/supabase` | Client e helpers futuros do Supabase |
| `src/types` | Tipos TypeScript globais |
| `supabase/migrations` | Migrations SQL versionadas |
