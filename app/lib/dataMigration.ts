import { supabase } from './supabaseClient';
import { useAppStore } from '../store';
import { useFinancasStore } from '../stores/financasStore';
import { useAlimentacaoStore } from '../stores/alimentacaoStore';
import { useAutoconhecimentoStore } from '../stores/autoconhecimentoStore';
import { useHiperfocosStore } from '../stores/hiperfocosStore';
import { usePerfilStore } from '../stores/perfilStore';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { usePrioridadesStore } from '../stores/prioridadesStore';
import { useRegistroEstudosStore } from '../stores/registroEstudosStore';
import { useSonoStore } from '../stores/sonoStore';
import { useAtividadesStore } from '../stores/atividadesStore';
import { useHistoricoSimuladosStore } from '../stores/historicoSimuladosStore';

/**
 * Classe responsável pela migração de dados do localStorage para o Supabase.
 * Implementa métodos para cada módulo/entidade do sistema.
 */
export class DataMigrationService {
  private userId: string | null = null;

  constructor() {
    // Inicialização vazia
  }

  /**
   * Define o ID do usuário atual para as operações de migração
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Verifica se o usuário já possui dados no Supabase
   * @returns Promise<boolean> indicando se o usuário já tem dados
   */
  async usuarioTemDadosNoSupabase(): Promise<boolean> {
    if (!this.userId) return false;

    // Verificar se o usuário já tem um perfil no Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', this.userId)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar dados no Supabase:', error);
      return false;
    }

    return data && data.length > 0;
  }

  /**
   * Migra todos os dados do localStorage para o Supabase
   * @returns Promise<boolean> indicando se a migração foi bem-sucedida
   */
  async migrarTodosDados(): Promise<boolean> {
    if (!this.userId) {
      console.error('ID do usuário não definido para migração');
      return false;
    }

    try {
      // Verificar se o usuário já tem dados no Supabase
      const jaTemDados = await this.usuarioTemDadosNoSupabase();
      if (jaTemDados) {
        console.log('Usuário já possui dados no Supabase. Migração cancelada.');
        return true; // Não é um erro, apenas já está migrado
      }

      // Migrar dados do perfil
      await this.migrarPerfilUsuario();

      // Migrar dados financeiros
      await this.migrarDadosFinanceiros();

      // Migrar tarefas e prioridades
      await this.migrarTarefasEPrioridades();

      // Migrar dados de saúde
      await this.migrarDadosSaude();

      // Migrar dados de sono
      await this.migrarDadosSono();

      // Migrar blocos de tempo
      await this.migrarBlocosDeTempo();

      console.log('Migração de dados concluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro durante a migração de dados:', error);
      return false;
    }
  }

  /**
   * Migra o perfil do usuário
   */
  async migrarPerfilUsuario(): Promise<boolean> {
    if (!this.userId) return false;

    const perfilState = usePerfilStore.getState();
    const appState = useAppStore.getState();

    // Extrair dados relevantes
    const perfil = {
      id: this.userId,
      nome_completo: perfilState.perfil?.nome_completo || 'Usuário',
      preferenciasVisuais: {
        textoGrande: perfilState.perfil?.preferenciasVisuais?.textoGrande || false,
        altoContraste: perfilState.perfil?.preferenciasVisuais?.altoContraste || false,
        reducaoEstimulos: perfilState.perfil?.preferenciasVisuais?.reducaoEstimulos || false
      },
      // Usando snake_case para corresponder exatamente à coluna no banco de dados
      metas_diarias: {
        horasSono: perfilState.perfil?.metasDiarias?.horasSono || 8,
        coposAgua: perfilState.perfil?.metasDiarias?.coposAgua || 8,
        pausasProgramadas: perfilState.perfil?.metasDiarias?.pausasProgramadas || 4,
        tarefasPrioritarias: perfilState.perfil?.metasDiarias?.tarefasPrioritarias || 3
      }
    };

    // Inserir no Supabase
    const { error } = await supabase
      .from('profiles')
      .insert(perfil);

    if (error) {
      console.error('Erro ao migrar perfil para Supabase:', error);
      return false;
    }

    // Migrar configurações do usuário
    const configuracoes = {
      user_id: this.userId,
      // Usando valores padrão para campos que não existem no tipo ConfiguracaoUsuario
      notificacoes: true,
      pausaativa: true,
      tempofoco: appState.configuracao?.tempoFoco || 25,
      tempopausa: appState.configuracao?.tempoPausa || 5,
      temaescuro: appState.configuracao?.temaEscuro || false,
      reducaoestimulos: appState.configuracao?.reducaoEstimulos || false
    };

    const { error: errorConfig } = await supabase
      .from('user_configurations')
      .insert(configuracoes);

    if (errorConfig) {
      console.error('Erro ao migrar configurações para Supabase:', errorConfig);
      return false;
    }

    return true;
  }

  /**
   * Migra dados financeiros
   */
  async migrarDadosFinanceiros(): Promise<boolean> {
    if (!this.userId) return false;

    const financasState = useFinancasStore.getState();
    let success = true;

    // Migrar categorias financeiras
    if (financasState.categorias && financasState.categorias.length > 0) {
      const categorias = financasState.categorias.map(cat => ({
        user_id: this.userId,
        nome: cat.nome,
        cor: cat.cor,
        icone: cat.icone
      }));

      const { error } = await supabase
        .from('finance_categories')
        .insert(categorias);

      if (error) {
        console.error('Erro ao migrar categorias financeiras:', error);
        success = false;
      }
    }

    // Obter categorias para mapear IDs
    const { data: categoriasDB } = await supabase
      .from('finance_categories')
      .select('id, nome')
      .eq('user_id', this.userId);

    // Criar mapa de nomes para IDs
    const mapaCategorias = new Map();
    if (categoriasDB) {
      categoriasDB.forEach((cat: { nome: string; id: string }) => {
        mapaCategorias.set(cat.nome, cat.id);
      });
    }

    // Migrar transações financeiras
    if (financasState.transacoes && financasState.transacoes.length > 0) {
      const transacoes = financasState.transacoes.map(trans => {
        // Encontrar ID da categoria baseado no nome
        const categoriaOriginal = financasState.categorias.find(c => c.id === trans.categoriaId);
        const categoriaid = categoriaOriginal ? mapaCategorias.get(categoriaOriginal.nome) : null;

        return {
          user_id: this.userId,
          data: trans.data,
          valor: trans.valor,
          descricao: trans.descricao,
          categoriaid: categoriaid,
          tipo: trans.tipo
        };
      }).filter(t => t.categoriaid); // Filtrar apenas as que têm categoriaId válido

      if (transacoes.length > 0) {
        const { error } = await supabase
          .from('finance_transactions')
          .insert(transacoes);

        if (error) {
          console.error('Erro ao migrar transações financeiras:', error);
          success = false;
        }
      }
    }

    // Migrar envelopes financeiros
    if (financasState.envelopes && financasState.envelopes.length > 0) {
      const envelopes = financasState.envelopes.map(env => ({
        user_id: this.userId,
        nome: env.nome,
        cor: env.cor,
        valoralocado: env.valorAlocado,
        valorutilizado: env.valorUtilizado
      }));

      const { error } = await supabase
        .from('finance_envelopes')
        .insert(envelopes);

      if (error) {
        console.error('Erro ao migrar envelopes financeiros:', error);
        success = false;
      }
    }

    return success;
  }

  /**
   * Migra tarefas e prioridades
   */
  async migrarTarefasEPrioridades(): Promise<boolean> {
    if (!this.userId) return false;

    const prioridadesState = usePrioridadesStore.getState();
    const appState = useAppStore.getState(); // Usando appState pois as tarefas estão lá
    let success = true;

    // Migrar tarefas
    if (appState.tarefas && appState.tarefas.length > 0) {
      const tarefas = appState.tarefas.map((task: {
        texto: string;
        concluida: boolean;
        categoria: string;
        data: string;
      }) => ({
        user_id: this.userId,
        texto: task.texto,
        concluida: task.concluida,
        categoria: task.categoria,
        data: task.data
      }));

      const { error } = await supabase
        .from('tasks')
        .insert(tarefas);

      if (error) {
        console.error('Erro ao migrar tarefas:', error);
        success = false;
      }
    }

    // Migrar prioridades
    if (prioridadesState.prioridades && prioridadesState.prioridades.length > 0) {
      const prioridades = prioridadesState.prioridades.map(prio => ({
        user_id: this.userId,
        texto: prio.texto,
        concluida: prio.concluida,
        data: prio.data,
        tipo: prio.tipo || 'geral',
        origemid: prio.origemId || null
      }));

      const { error } = await supabase
        .from('priorities')
        .insert(prioridades);

      if (error) {
        console.error('Erro ao migrar prioridades:', error);
        success = false;
      }
    }

    return success;
  }

  /**
   * Migra blocos de tempo
   */
  async migrarBlocosDeTempo(): Promise<boolean> {
    if (!this.userId) return false;

    const appState = useAppStore.getState(); // Usando appState pois os blocos estão lá

    // Migrar blocos de tempo
    if (appState.blocosTempo && appState.blocosTempo.length > 0) {
      const blocos = appState.blocosTempo.map((bloco: {
        hora: string;
        atividade: string;
        categoria: string;
        data: string;
      }) => ({
        user_id: this.userId,
        hora: bloco.hora,
        atividade: bloco.atividade,
        categoria: bloco.categoria,
        data: bloco.data
      }));

      const { error } = await supabase
        .from('time_blocks')
        .insert(blocos);

      if (error) {
        console.error('Erro ao migrar blocos de tempo:', error);
        return false;
      }
    }

    return true;
  }

  /**
   * Migra dados de saúde
   */
  async migrarDadosSaude(): Promise<boolean> {
    if (!this.userId) return false;

    const appState = useAppStore.getState();
    let success = true;

    // Migrar medicamentos
    if (appState.medicamentos && appState.medicamentos.length > 0) {
      const medicamentos = appState.medicamentos.map(med => ({
        user_id: this.userId,
        nome: med.nome,
        dosagem: med.dosagem,
        frequencia: med.frequencia,
        horarios: med.horarios,
        observacoes: med.observacoes,
        datainicio: med.dataInicio,
        ultimatomada: med.ultimaTomada,
        intervalo: med.intervalo
      }));

      const { error } = await supabase
        .from('medications')
        .insert(medicamentos);

      if (error) {
        console.error('Erro ao migrar medicamentos:', error);
        success = false;
      }
    }

    // Migrar registros de humor
    if (appState.registrosHumor && appState.registrosHumor.length > 0) {
      const registros = appState.registrosHumor.map(reg => ({
        user_id: this.userId,
        data: reg.data,
        nivel: reg.nivel,
        fatores: reg.fatores,
        notas: reg.notas
      }));

      const { error } = await supabase
        .from('mood_logs')
        .insert(registros);

      if (error) {
        console.error('Erro ao migrar registros de humor:', error);
        success = false;
      }
    }

    return success;
  }

  /**
   * Migra dados de sono
   */
  async migrarDadosSono(): Promise<boolean> {
    if (!this.userId) return false;

    const sonoState = useSonoStore.getState();
    let success = true;

    // Migrar registros de sono
    if (sonoState.registros && sonoState.registros.length > 0) {
      // Usando um tipo mais genérico para evitar erros de tipo
      const registros = sonoState.registros.map((reg: any) => ({
        user_id: this.userId,
        inicio: reg.inicio,
        fim: reg.fim,
        qualidade: reg.qualidade,
        notas: reg.notas
      }));

      const { error } = await supabase
        .from('sleep_logs')
        .insert(registros);

      if (error) {
        console.error('Erro ao migrar registros de sono:', error);
        success = false;
      }
    }

    // Migrar lembretes de sono
    if (sonoState.lembretes && sonoState.lembretes.length > 0) {
      // Usando um tipo mais genérico para evitar erros de tipo
      const lembretes = sonoState.lembretes.map((lem: any) => ({
        user_id: this.userId,
        horario: lem.horario,
        ativo: lem.ativo,
        // Adaptando campo para o formato esperado pelo banco
        diassemana: Array.isArray(lem.diasSemana) ? lem.diasSemana : 
                   (Array.isArray(lem.diassemana) ? lem.diassemana : [])
      }));

      const { error } = await supabase
        .from('sleep_reminders')
        .insert(lembretes);

      if (error) {
        console.error('Erro ao migrar lembretes de sono:', error);
        success = false;
      }
    }

    return success;
  }
}

// Exportar uma única instância do serviço
export const dataMigrationService = new DataMigrationService();
