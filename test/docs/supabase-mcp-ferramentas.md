# Documentação das Ferramentas Supabase MCP

Este documento lista e descreve todas as ferramentas disponíveis através do Supabase Model Context Protocol (MCP).

## Gerenciamento de Organizações

- **list_organizations**: Lista todas as organizações disponíveis para o usuário
- **get_organization**: Obtém detalhes de uma organização específica

## Gerenciamento de Projetos

- **list_projects**: Lista todos os projetos Supabase disponíveis
- **get_project**: Obtém detalhes de um projeto específico
- **get_cost**: Obtém o custo de criação de um novo projeto ou branch
- **confirm_cost**: Solicita confirmação do usuário sobre o custo de criação de um novo projeto/branch
- **create_project**: Cria um novo projeto Supabase
- **pause_project**: Pausa um projeto Supabase
- **restore_project**: Restaura um projeto Supabase pausado

## Banco de Dados

- **list_tables**: Lista todas as tabelas em um ou mais schemas
- **list_extensions**: Lista todas as extensões disponíveis ou instaladas
- **list_migrations**: Lista as migrações de um projeto
- **apply_migration**: Aplica uma migração ao banco de dados
- **execute_sql**: Executa SQL diretamente no banco de dados PostgreSQL

## Edge Functions

- **list_edge_functions**: Lista todas as Edge Functions disponíveis
- **deploy_edge_function**: Implanta uma nova Edge Function ou atualiza uma existente

## Utilitários

- **get_logs**: Obtém logs de um projeto Supabase por tipo de serviço
- **get_project_url**: Obtém a URL de um projeto
- **get_anon_key**: Obtém a chave API anônima de um projeto
- **generate_typescript_types**: Gera tipos TypeScript baseados no schema do banco de dados

## Gerenciamento de Branches

- **create_branch**: Cria um branch de desenvolvimento em um projeto Supabase
- **list_branches**: Lista todos os branches de desenvolvimento de um projeto
- **delete_branch**: Exclui um branch de desenvolvimento
- **merge_branch**: Mescla migrações e Edge Functions de um branch para produção
- **reset_branch**: Redefine migrações de um branch de desenvolvimento
- **rebase_branch**: Reaplica um branch de desenvolvimento na produção

## Exemplos de Uso

Para utilizar estas ferramentas, você precisa ter o MCP do Supabase configurado corretamente em seu ambiente.

### Exemplo - Listar Projetos:
```
mcp_github_comsupabase-communitysupabase-mcp_list_projects
```

### Exemplo - Obter Detalhes de um Projeto:
```
mcp_github_comsupabase-communitysupabase-mcp_get_project
  com o parâmetro: id (string) - O ID do projeto
```

### Exemplo - Executar SQL:
```
mcp_github_comsupabase-communitysupabase-mcp_execute_sql
  com os parâmetros: 
  - project_id (string) - O ID do projeto
  - query (string) - A consulta SQL a ser executada
``` 