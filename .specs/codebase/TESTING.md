# Testing e Validação - FM Personal Online

## Comandos Obrigatórios

Antes de considerar uma etapa pronta, rodar quando possível:

```bash
npm run lint
npm run type-check
npm run build
```

## Critérios Mínimos Antes de Merge

- Escopo da alteração está claro.
- Documentação relevante foi atualizada.
- Não há dados sensíveis versionados.
- `npm run lint` passa.
- `npm run type-check` passa.
- `npm run build` passa.
- A alteração pode ser explicada em poucas frases.
- Não há funcionalidade fora da spec aprovada.

## Testes Manuais Recomendados

- Abrir `/` para validar a home simples.
- Abrir `/style-guide` após alterações visuais.
- Abrir `/login` e `/cadastro` após alterações de autenticação visual.
- Validar no Supabase Studio quando migrations forem aplicadas.

## Testes Automatizados Futuros

Ainda não há suite de testes automatizados. Quando o MVP avançar, considerar:

- Testes de componentes críticos.
- Testes de validação de formulários.
- Testes de policies/RLS no Supabase.
- Testes de fluxo principal do MVP.
