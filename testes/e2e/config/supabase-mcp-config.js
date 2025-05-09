/**
 * Configuração para integração das ferramentas Supabase MCP com os testes E2E
 * Este módulo facilita o uso de ferramentas Supabase MCP nos testes automatizados
 */

// Funções auxiliares para trabalhar com as ferramentas MCP do Supabase
const supabaseMCPTools = {
  /**
   * Inicializa o ambiente de teste
   * Pode criar um projeto de teste temporário ou branch para testes isolados
   */
  async setupTestEnvironment(options = {}) {
    const {
      createNewProject = false,
      createBranch = false,
      organizationId = process.env.SUPABASE_ORG_ID,
      projectName = `test-project-${Date.now()}`,
      branchName = `test-branch-${Date.now()}`
    } = options;

    try {
      // Verifica se a integração MCP está disponível
      const hasMCPTools = typeof mcp4_list_projects === 'function';
      if (!hasMCPTools) {
        console.warn('Ferramentas Supabase MCP não disponíveis. Usando configuração padrão.');
        return {
          success: false,
          message: 'Ferramentas MCP não disponíveis',
          projectId: process.env.SUPABASE_PROJECT_ID || null
        };
      }

      // Lista projetos existentes
      const { data: projects } = await mcp4_list_projects();
      
      // Se não precisa criar projeto novo, usa o configurado por env
      if (!createNewProject) {
        const projectId = process.env.SUPABASE_PROJECT_ID;
        if (!projectId) {
          throw new Error('SUPABASE_PROJECT_ID não definido no ambiente');
        }
        
        // Se precisar criar branch para testes
        if (createBranch) {
          // Obter custo do branch
          const { data: costData } = await mcp4_get_cost({
            organization_id: organizationId,
            type: 'branch'
          });
          
          // Confirmar custo
          const { data: costConfirmation } = await mcp4_confirm_cost({
            amount: costData.amount,
            recurrence: costData.recurrence,
            type: 'branch'
          });
          
          // Criar branch
          const { data: branchData } = await mcp4_create_branch({
            confirm_cost_id: costConfirmation.id,
            name: branchName,
            project_id: projectId
          });
          
          return {
            success: true,
            projectId: projectId,
            branchId: branchData.ref,
            isBranch: true
          };
        }
        
        return {
          success: true,
          projectId: projectId,
          isBranch: false
        };
      }
      
      // Criação de novo projeto para testes (caso necessário)
      if (createNewProject) {
        // Obter custo do projeto
        const { data: costData } = await mcp4_get_cost({
          organization_id: organizationId,
          type: 'project'
        });
        
        // Confirmar custo
        const { data: costConfirmation } = await mcp4_confirm_cost({
          amount: costData.amount,
          recurrence: costData.recurrence,
          type: 'project'
        });
        
        // Criar projeto
        const { data: projectData } = await mcp4_create_project({
          confirm_cost_id: costConfirmation.id,
          name: projectName,
          organization_id: organizationId
        });
        
        return {
          success: true,
          projectId: projectData.id,
          isBranch: false,
          isNewProject: true
        };
      }
    } catch (error) {
      console.error('Erro na configuração do ambiente de teste:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  },

  /**
   * Executa uma migração no banco de dados para configurar o teste
   */
  async applyTestMigration(projectId, migrationSQL, migrationName = `test_setup_${Date.now()}`) {
    try {
      if (!projectId) {
        throw new Error('ID do projeto é necessário para aplicar migração');
      }

      const hasMCPTools = typeof mcp4_apply_migration === 'function';
      if (!hasMCPTools) {
        console.warn('Ferramenta apply_migration não disponível. Pulando migração.');
        return { success: false };
      }

      const { data, error } = await mcp4_apply_migration({
        project_id: projectId,
        name: migrationName,
        query: migrationSQL
      });

      if (error) {
        throw new Error(`Erro ao aplicar migração: ${error.message}`);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao aplicar migração de teste:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  },

  /**
   * Executa SQL diretamente no banco de dados
   */
  async executeSQL(projectId, sql) {
    try {
      if (!projectId) {
        throw new Error('ID do projeto é necessário para executar SQL');
      }

      const hasMCPTools = typeof mcp4_execute_sql === 'function';
      if (!hasMCPTools) {
        console.warn('Ferramenta execute_sql não disponível.');
        return { success: false };
      }

      const { data, error } = await mcp4_execute_sql({
        project_id: projectId,
        query: sql
      });

      if (error) {
        throw new Error(`Erro ao executar SQL: ${error.message}`);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Erro ao executar SQL:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  },

  /**
   * Limpa o ambiente de testes (remove branches ou projetos criados temporariamente)
   */
  async cleanupTestEnvironment(options = {}) {
    const {
      projectId,
      branchId,
      deleteProject = false,
      isBranch = false
    } = options;

    try {
      const hasMCPTools = typeof mcp4_delete_branch === 'function';
      if (!hasMCPTools) {
        console.warn('Ferramentas Supabase MCP não disponíveis para limpeza.');
        return { success: false };
      }

      // Remover branch se for um teste baseado em branch
      if (isBranch && branchId) {
        const { data, error } = await mcp4_delete_branch({
          branch_id: branchId
        });

        if (error) {
          throw new Error(`Erro ao excluir branch: ${error.message}`);
        }

        return {
          success: true,
          message: `Branch ${branchId} removido com sucesso`
        };
      }

      // Pausar projeto se foi criado temporariamente e solicitado para remoção
      if (deleteProject && projectId) {
        const { data, error } = await mcp4_pause_project({
          project_id: projectId
        });

        if (error) {
          throw new Error(`Erro ao pausar projeto: ${error.message}`);
        }

        return {
          success: true,
          message: `Projeto ${projectId} pausado com sucesso`
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro na limpeza do ambiente de teste:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  },

  /**
   * Obtém logs do Supabase para debug de testes
   */
  async getTestLogs(projectId, service = 'postgres') {
    try {
      if (!projectId) {
        throw new Error('ID do projeto é necessário para obter logs');
      }

      const hasMCPTools = typeof mcp4_get_logs === 'function';
      if (!hasMCPTools) {
        console.warn('Ferramenta get_logs não disponível.');
        return { success: false };
      }

      const { data, error } = await mcp4_get_logs({
        project_id: projectId,
        service
      });

      if (error) {
        throw new Error(`Erro ao obter logs: ${error.message}`);
      }

      return {
        success: true,
        logs: data
      };
    } catch (error) {
      console.error('Erro ao obter logs de teste:', error);
      return {
        success: false,
        message: error.message,
        error
      };
    }
  }
};

module.exports = supabaseMCPTools;
