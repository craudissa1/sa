import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { useAppStore } from '../store';

// Tipos para os eventos de sincronização
type SyncEvent = 'create' | 'update' | 'delete';
type SyncEntity = 'tasks' | 'time_blocks' | 'meals' | 'medications' | 'mood_logs' | 'user_configurations';
type SyncStatus = 'pending' | 'completed' | 'failed';

interface SyncOperation {
  id: string;
  entity: SyncEntity;
  event: SyncEvent;
  data: any;
  status: SyncStatus;
  timestamp: number;
  userId: string;
  retryCount: number;
  error?: string;
}

// Classe para gerenciar a sincronização
class SupabaseSync {
  private syncQueue: SyncOperation[] = [];
  private isSyncing = false;
  private maxRetries = 3;
  private syncInterval: NodeJS.Timeout | null = null;
  private currentUser: User | null = null;

  constructor() {
    // Inicializar a fila de sincronização do localStorage se disponível
    if (typeof window !== 'undefined') {
      const savedQueue = localStorage.getItem('supabase_sync_queue');
      if (savedQueue) {
        try {
          this.syncQueue = JSON.parse(savedQueue);
        } catch (e) {
          console.error('Erro ao carregar fila de sincronização:', e);
          localStorage.removeItem('supabase_sync_queue');
        }
      }
    }
  }

  // Definir o usuário atual
  setUser(user: User | null) {
    this.currentUser = user;
    
    // Iniciar sincronização se houver usuário
    if (user) {
      this.startSyncInterval();
    } else {
      this.stopSyncInterval();
    }
  }

  // Adicionar operação à fila de sincronização
  queueOperation(entity: SyncEntity, event: SyncEvent, data: any): string {
    if (!this.currentUser) {
      console.error('Tentativa de sincronização sem usuário autenticado');
      return '';
    }

    const operation: SyncOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      entity,
      event,
      data,
      status: 'pending',
      timestamp: Date.now(),
      userId: this.currentUser.id,
      retryCount: 0
    };

    this.syncQueue.push(operation);
    this.saveQueue();
    this.processQueue();
    return operation.id;
  }

  // Processar a fila de sincronização
  private async processQueue() {
    if (this.isSyncing || !this.currentUser || this.syncQueue.length === 0) return;
    
    this.isSyncing = true;
    
    // Ordenar fila por timestamp
    const sortedQueue = [...this.syncQueue].sort((a, b) => a.timestamp - b.timestamp);
    
    for (const operation of sortedQueue) {
      if (operation.status !== 'pending') continue;
      
      try {
        await this.executeSyncOperation(operation);
        operation.status = 'completed';
      } catch (error) {
        console.error(`Erro ao sincronizar ${operation.entity}:`, error);
        operation.retryCount++;
        
        if (operation.retryCount >= this.maxRetries) {
          operation.status = 'failed';
          operation.error = error instanceof Error ? error.message : 'Erro desconhecido';
        }
      }
    }
    
    // Limpar operações completadas
    this.syncQueue = this.syncQueue.filter(op => op.status === 'pending' || op.status === 'failed');
    this.saveQueue();
    this.isSyncing = false;
  }

  // Executar operação de sincronização
  private async executeSyncOperation(operation: SyncOperation) {
    const { entity, event, data } = operation;
    
    switch (event) {
      case 'create':
        await this.createEntity(entity, data);
        break;
      case 'update':
        await this.updateEntity(entity, data);
        break;
      case 'delete':
        await this.deleteEntity(entity, data.id);
        break;
    }
  }

  // Criar entidade no Supabase
  private async createEntity(entity: SyncEntity, data: any) {
    const { data: result, error } = await supabase
      .from(entity)
      .insert([{ ...data, user_id: this.currentUser?.id }])
      .select();
    
    if (error) throw error;
    
    // Atualizar store local com dados do servidor
    if (result && result.length > 0) {
      this.updateLocalStore(entity, 'create', result[0]);
    }
  }

  // Atualizar entidade no Supabase
  private async updateEntity(entity: SyncEntity, data: any) {
    const { id, ...updateData } = data;
    const { data: result, error } = await supabase
      .from(entity)
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    // Atualizar store local com dados do servidor
    if (result && result.length > 0) {
      this.updateLocalStore(entity, 'update', result[0]);
    }
  }

  // Remover entidade no Supabase
  private async deleteEntity(entity: SyncEntity, id: string) {
    const { error } = await supabase
      .from(entity)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Atualizar store local
    this.updateLocalStore(entity, 'delete', { id });
  }

  // Atualizar store local baseado no resultado da sincronização
  private updateLocalStore(entity: SyncEntity, event: SyncEvent, data: any) {
    const store = useAppStore.getState();
    
    if (event === 'create' || event === 'update') {
      switch (entity) {
        case 'tasks':
          if (event === 'create') {
            useAppStore.setState({ tarefas: [...store.tarefas, data] });
          } else {
            useAppStore.setState({ tarefas: store.tarefas.map(t => t.id === data.id ? data : t) });
          }
          break;
        case 'time_blocks':
          if (event === 'create') {
            useAppStore.setState({ blocosTempo: [...store.blocosTempo, data] });
          } else {
            useAppStore.setState({ blocosTempo: store.blocosTempo.map(b => b.id === data.id ? data : b) });
          }
          break;
        // Implementar outros casos...
      }
    } else if (event === 'delete') {
      switch (entity) {
        case 'tasks':
          useAppStore.setState({ tarefas: store.tarefas.filter(t => t.id !== data.id) });
          break;
        case 'time_blocks':
          useAppStore.setState({ blocosTempo: store.blocosTempo.filter(b => b.id !== data.id) });
          break;
        // Implementar outros casos...
      }
    }
  }

  // Salvar fila no localStorage
  private saveQueue() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase_sync_queue', JSON.stringify(this.syncQueue));
    }
  }

  // Iniciar intervalo de sincronização
  private startSyncInterval() {
    if (this.syncInterval) return;
    
    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, 5000); // Sincroniza a cada 5 segundos
  }

  // Parar intervalo de sincronização
  private stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Verificar conectividade
  async checkConnectivity() {
    try {
      // Tentar uma operação simples com o Supabase
      const { error } = await supabase.from('health_check').select('count').single();
      return !error;
    } catch (e) {
      console.error('Erro ao verificar conectividade:', e);
      return false;
    }
  }

  // Forçar sincronização
  async forceSyncAll() {
    if (!this.currentUser) return false;
    
    await this.processQueue();
    return this.syncQueue.filter(op => op.status === 'pending').length === 0;
  }
}

// Exportar uma única instância do serviço
export const supabaseSync = new SupabaseSync();

// Hook para conectar o serviço de sincronização ao contexto de autenticação
export const useSyncWithAuth = () => {
  const currentUser = useAppStore(state => state.currentUser);
  
  // Atualizar o usuário no serviço de sincronização
  if (supabaseSync) {
    supabaseSync.setUser(currentUser);
  }
}; 