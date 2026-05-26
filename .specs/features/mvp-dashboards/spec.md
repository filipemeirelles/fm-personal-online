# Feature Spec - MVP Utilizável (Dashboards e Deploy)

## Objetivo

Tornar o produto utilizável fim a fim: melhorar os painéis iniciais de trainer e student, adicionar visão resumida da atividade da aluna no perfil dela, revisar RLS e deixar tudo pronto para deploy na Vercel.

## Contexto

As Sprints 4 e 5 entregam prescrição e execução. Falta consolidar a navegação, fechar a experiência de entrada e preparar o deploy. Sem esta sprint, a aplicação existe mas a Filipe não consegue usar de forma fluida nem publicar.

## Escopo

- Dashboard `/trainer` mostra cartões com contagem de alunas ativas, planos ativos, últimos logs registrados e atalhos para "Convidar aluna" e "Ver alunas".
- Perfil da aluna em `/trainer/alunas/[id]` ganha bloco "Resumo de atividade" com últimas execuções (data + número de exercícios registrados) e link "Ver treinos".
- Dashboard `/student` consolida o que foi entregue na Sprint 5 (plano ativo + histórico). Esta sprint apenas garante polidez e copy adequado.
- README atualizado com instruções de deploy na Vercel.
- `.env.example` atualizado com `NEXT_PUBLIC_APP_URL` em produção.
- Revisão de RLS via checklist documentado.

## Fora de Escopo

- Configurar domínio próprio.
- Configurar provedor de email transacional.
- Gráficos de evolução.
- PWA, notificações ou métricas analíticas.

## Requisitos

### MVP-001 - Dashboard do trainer

A página `/trainer` exibe:

- Saudação com o nome do trainer.
- Cards-resumo: alunas ativas, convites pendentes, planos ativos atribuídos e execuções nos últimos 7 dias.
- Atalhos para `/trainer/alunas`.

### MVP-002 - Resumo de atividade no perfil da aluna

A página `/trainer/alunas/[id]` ganha bloco com:

- Plano ativo (título e data de criação) ou aviso "Sem plano ativo".
- Lista das últimas 5 execuções (data + número de exercícios registrados).
- Link "Ver treinos".

### MVP-003 - Dashboard da aluna polido

`/student` mostra plano ativo, lista de exercícios e histórico das últimas execuções. Estado vazio acolhedor quando não há plano ativo.

### MVP-004 - Checklist de RLS

Documentar em `docs/RLS_REVIEW.md` (ou em `.specs/codebase/CONCERNS.md`) a verificação manual de que:

- Trainer não vê dados de aluna alheia.
- Aluna não vê planos/logs de outra aluna.
- `student_invites` segue limitado ao trainer dono.

### MVP-005 - Instruções de deploy na Vercel

README ganha seção "Deploy na Vercel" com:

- Variáveis de ambiente necessárias.
- Passos para conectar o projeto.
- Lembrete de aplicar migrations no Supabase remoto antes do primeiro deploy.

### MVP-006 - Atualizar roadmap e state

`ROADMAP.md` marca Sprints 4, 5 e 6 como concluídas; `STATE.md` documenta decisões tomadas e próximos passos.

## Critérios de Aceite da Feature

- `npm run lint`, `npm run type-check` e `npm run build` passam.
- README descreve como deployar.
- Trainer abre `/trainer` e vê o panorama da consultoria.
- Trainer abre o perfil de uma aluna e vê o status atual dela.
- Aluna abre `/student` e vê tudo que precisa para treinar e registrar.
