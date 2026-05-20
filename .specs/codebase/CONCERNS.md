# Concerns - FM Personal Online

## Riscos Técnicos

- Integrar Supabase sem RLS completa pode expor dados de alunas.
- Criar autenticação real antes do modelo de dados estar estável pode gerar retrabalho.
- Tipos do banco podem ficar defasados se migrations evoluírem sem atualização em `src/types/database.ts`.
- Build pode passar mesmo com policies incorretas, então validações no Supabase serão necessárias.

## Riscos de Escopo

- Implementar dashboard antes de autenticação e RLS.
- Criar CRUD completo de treinos antes de validar o fluxo principal.
- Adicionar funcionalidades futuras antes do MVP.
- Transformar a plataforma em produto multi-trainer antes de atender o uso real da consultoria.

## Risco de IA Implementar Coisa Demais

- A IA deve seguir a spec da etapa atual.
- Mudanças grandes devem ser quebradas em Specify, Design, Tasks e Execute.
- Se uma etapa parece exigir banco, UI e regra de negócio ao mesmo tempo, deve ser dividida.

## Risco de Autenticação/Banco Sem RLS

- Toda tabela sensível deve ter RLS desde o início.
- Policies devem ser revisadas antes de dados reais serem inseridos.
- Não confiar em filtros apenas no frontend.

## Risco de Design System Genérico

- A interface deve preservar a identidade premium, minimalista, feminina sem ser infantil e editorial.
- Evitar visual agressivo de academia.
- Evitar componentes genéricos sem personalidade de marca.

## Risco de Complexidade Antes do MVP

- Evitar biblioteca de exercícios global antes da decisão de modelagem.
- Evitar relatórios, gráficos, notificações e PWA antes do fluxo principal.
- Priorizar o caminho: personal cria treino, aluna acessa, aluna registra execução.
