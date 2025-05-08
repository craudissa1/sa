import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { useAppStore } from '../store';

// Lista de tabelas para assinar
const REALTIME_TABLES = [
  'tasks',
  'time_blocks',
  'meals',
  'medications',
  'mood_logs',
  'user_configurations',
  'user_profiles',
  'pomodoro_configurations'
];

class SupabaseRealtime {
  private channels: Record<string, any> = {};
  private userId: string | null = null;
  private isSubscribed = false;

  // Inicializar as subscrições para o usuário atual
  public initialize(user: User | null) {
    // Remover subscrições existentes
    this.cleanupSubscriptions();
    
    if (!user) {
      this.userId = null;
      return;
    }
    
    this.userId = user.id;
    
    // Criar subscrições para todas as tabelas
    REALTIME_TABLES.forEach(table => {
      this.subscribeToTable(table);
    });
    
    this.isSubscribed = true;
    console.log('Supabase Realtime: Subscrições inicializadas para o usuário', user.id);
  }
  
  // Limpar todas as subscrições
  public cleanupSubscriptions() {
    if (!this.isSubscribed) return;
    
    Object.values(this.channels).forEach(channel => {
      if (channel && channel.unsubscribe) {
        supabase.removeChannel(channel).catch(err => 
          console.error('Erro ao remover canal:', err)
        );
      }
    });
    
    this.channels = {};
    this.isSubscribed = false;
    console.log('Supabase Realtime: Subscrições limpas');
  }
  
  // Subscrever a uma tabela específica
  private subscribeToTable(table: string) {
    if (!this.userId) return;
    
    try {
      const channel = supabase
        .channel(`public:${table}:${this.userId}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: table, 
            filter: `user_id=eq.${this.userId}` 
          },
          (payload) => this.handleRealtimeUpdate(table, payload)
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscrito à tabela ${table} para o usuário ${this.userId}`);
          }
          if (status === 'CHANNEL_ERROR') {
            console.error(`Erro ao subscrever à tabela ${table}:`, err);
          }
          if (status === 'TIMED_OUT') {
            console.warn(`Subscrição à tabela ${table} expirou`);
          }
        });
      
      this.channels[table] = channel;
    } catch (error) {
      console.error(`Erro ao subscrever à tabela ${table}:`, error);
    }
  }
  
  // Processar atualizações recebidas em tempo real
  private handleRealtimeUpdate(table: string, payload: any) {
    console.log(`Atualização em tempo real na tabela ${table}:`, payload);
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    const store = useAppStore.getState();
    
    // Verificar se o registro pertence ao usuário atual
    if (newRecord && newRecord.user_id !== this.userId) {
      console.warn(`Recebido registro de outro usuário (${newRecord.user_id}) quando esperava ${this.userId}`);
      return;
    }
    
    switch (table) {
      case 'tasks':
        this.updateTarefas(eventType, newRecord, oldRecord);
        break;
      case 'time_blocks':
        this.updateBlocosTempo(eventType, newRecord, oldRecord);
        break;
      case 'meals':
        this.updateRefeicoes(eventType, newRecord, oldRecord);
        break;
      case 'medications':
        this.updateMedicamentos(eventType, newRecord, oldRecord);
        break;
      case 'mood_logs':
        this.updateRegistrosHumor(eventType, newRecord, oldRecord);
        break;
      case 'user_configurations':
        if (eventType === 'UPDATE' || eventType === 'INSERT') {
          useAppStore.setState({ configuracao: newRecord });
        }
        break;
      // Outros casos específicos podem ser adicionados conforme necessário
      default:
        // Por padrão, apenas recarregar todos os dados
        if (this.userId) {
          store.fetchInitialData(this.userId);
        }
    }
  }
  
  // Métodos específicos de atualização para cada tipo de dado
  private updateTarefas(eventType: string, newRecord: any, oldRecord: any) {
    const store = useAppStore.getState();
    const tarefas = [...store.tarefas];
    
    switch (eventType) {
      case 'INSERT':
        useAppStore.setState({ tarefas: [...tarefas, newRecord] });
        break;
      case 'UPDATE':
        useAppStore.setState({ tarefas: tarefas.map(t => t.id === newRecord.id ? newRecord : t) });
        break;
      case 'DELETE':
        useAppStore.setState({ tarefas: tarefas.filter(t => t.id !== oldRecord.id) });
        break;
    }
  }
  
  private updateBlocosTempo(eventType: string, newRecord: any, oldRecord: any) {
    const store = useAppStore.getState();
    const blocosTempo = [...store.blocosTempo];
    
    switch (eventType) {
      case 'INSERT':
        useAppStore.setState({ blocosTempo: [...blocosTempo, newRecord] });
        break;
      case 'UPDATE':
        useAppStore.setState({ blocosTempo: blocosTempo.map(b => b.id === newRecord.id ? newRecord : b) });
        break;
      case 'DELETE':
        useAppStore.setState({ blocosTempo: blocosTempo.filter(b => b.id !== oldRecord.id) });
        break;
    }
  }
  
  private updateRefeicoes(eventType: string, newRecord: any, oldRecord: any) {
    const store = useAppStore.getState();
    const refeicoes = [...store.refeicoes];
    
    switch (eventType) {
      case 'INSERT':
        useAppStore.setState({ refeicoes: [...refeicoes, newRecord] });
        break;
      case 'UPDATE':
        useAppStore.setState({ refeicoes: refeicoes.map(r => r.id === newRecord.id ? newRecord : r) });
        break;
      case 'DELETE':
        useAppStore.setState({ refeicoes: refeicoes.filter(r => r.id !== oldRecord.id) });
        break;
    }
  }
  
  private updateMedicamentos(eventType: string, newRecord: any, oldRecord: any) {
    const store = useAppStore.getState();
    const medicamentos = [...store.medicamentos];
    
    switch (eventType) {
      case 'INSERT':
        useAppStore.setState({ medicamentos: [...medicamentos, newRecord] });
        break;
      case 'UPDATE':
        useAppStore.setState({ medicamentos: medicamentos.map(m => m.id === newRecord.id ? newRecord : m) });
        break;
      case 'DELETE':
        useAppStore.setState({ medicamentos: medicamentos.filter(m => m.id !== oldRecord.id) });
        break;
    }
  }
  
  private updateRegistrosHumor(eventType: string, newRecord: any, oldRecord: any) {
    const store = useAppStore.getState();
    const registrosHumor = [...store.registrosHumor];
    
    switch (eventType) {
      case 'INSERT':
        useAppStore.setState({ registrosHumor: [...registrosHumor, newRecord] });
        break;
      case 'UPDATE':
        useAppStore.setState({ registrosHumor: registrosHumor.map(r => r.id === newRecord.id ? newRecord : r) });
        break;
      case 'DELETE':
        useAppStore.setState({ registrosHumor: registrosHumor.filter(r => r.id !== oldRecord.id) });
        break;
    }
  }
}

// Exportar uma instância única
export const supabaseRealtime = new SupabaseRealtime(); 