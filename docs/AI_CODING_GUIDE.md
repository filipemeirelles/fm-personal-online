# AI Coding Guide — FM Personal Online

## Objetivo

Este guia define como Claude, Codex ou qualquer assistente de IA deve contribuir com o projeto sem quebrar a organização, a documentação ou a arquitetura.

## Papel da IA

A IA atua como executora técnica e assistente de revisão. Ela deve seguir a documentação existente, propor melhorias quando necessário e limitar cada alteração a um escopo pequeno.

## Regras obrigatórias

1. Ler `docs/PROJECT_SPEC.md` antes de propor qualquer funcionalidade.
2. Atualizar documentação antes de implementar mudanças relevantes.
3. Não criar funcionalidades fora do MVP sem aprovação explícita.
4. Não alterar a stack sem justificar tecnicamente.
5. Não commitar dados sensíveis, tokens, chaves ou arquivos `.env.local`.
6. Explicar todos os arquivos criados ou alterados.
7. Priorizar código simples, legível e testável.
8. Não misturar várias funcionalidades em um único commit.

## Prompt padrão para novas tarefas

```txt
Você é o executor técnico do projeto FM Personal Online.

Antes de escrever código:
1. Leia a documentação em docs/PROJECT_SPEC.md.
2. Confirme o escopo desta tarefa.
3. Não implemente nada fora do escopo.
4. Atualize a documentação se necessário.
5. Ao final, explique os arquivos alterados e sugira a mensagem de commit seguindo Conventional Commits.

Tarefa:
[descrever tarefa pequena aqui]
```

## Prompt para revisão de código

```txt
Revise as alterações feitas nesta etapa do projeto FM Personal Online.

Verifique:
- se a alteração respeita docs/PROJECT_SPEC.md;
- se há arquivos desnecessários;
- se há riscos de segurança;
- se há código duplicado;
- se os nomes de arquivos e funções estão claros;
- se falta documentação;
- se o commit sugerido está correto.

Não implemente nada novo sem explicar primeiro.
```

## Escopo ideal por tarefa

Bom escopo:

```txt
Criar apenas a página de login visual, sem autenticação funcional.
```

Escopo ruim:

```txt
Criar todo o sistema de login, dashboard, alunos e treinos.
```

## Checklist antes de aceitar uma resposta da IA

- [ ] A IA respeitou o escopo?
- [ ] A documentação foi atualizada se necessário?
- [ ] Os arquivos alterados fazem sentido?
- [ ] A mensagem de commit está clara?
- [ ] Não há segredo exposto?
- [ ] A próxima etapa ficou clara?
