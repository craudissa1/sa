import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store';
import { supabaseSync } from '../lib/supabaseSync';

// Hook para monitorar o estado da conexão com o Supabase
export function useSupabaseStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  
  const currentUser = useAppStore((state) => state.currentUser);

  // Verificar se há alterações pendentes
  const checkPendingChanges = useCallback(async () => {
    if (!currentUser) {
      setHasPendingChanges(false);
      return;
    }
    
    // Verificar se há operações pendentes no localStorage
    const syncQueue = localStorage.getItem('supabase_sync_queue');
    if (syncQueue) {
      try {
        const queue = JSON.parse(syncQueue);
        const pendingOperations = queue.filter(
          (op: any) => op.status === 'pending' && op.userId === currentUser.id
        );
        setHasPendingChanges(pendingOperations.length > 0);
      } catch (e) {
        console.error('Erro ao verificar operações pendentes:', e);
        setHasPendingChanges(false);
      }
    } else {
      setHasPendingChanges(false);
    }
  }, [currentUser]);
  
  // Sincronizar alterações pendentes
  const syncPendingChanges = useCallback(async () => {
    if (!currentUser || !isOnline || isSyncing) return;
    
    setIsSyncing(true);
    
    
    try {
      const success = await supabaseSync.forceSyncAll();
      if (success) {
        setHasPendingChanges(false);
      }
    } catch (error) {
      console.error('Erro ao sincronizar alterações pendentes:', error);
    } finally {
      setIsSyncing(false);
      
    }
  }, [currentUser, isOnline, isSyncing]);

  // Monitorar o estado da conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      
      // Tentar sincronizar quando voltar online
      if (currentUser) {
        syncPendingChanges();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar periodicamente se há mudanças pendentes
    const checkPendingChangesInterval = setInterval(() => {
      checkPendingChanges();
    }, 10000); // A cada 10 segundos
    
    // Verificar o estado inicial
    checkPendingChanges();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(checkPendingChangesInterval);
    };
  }, [currentUser, checkPendingChanges, syncPendingChanges]);
  
  return {
    isOnline,
    isSyncing,
    hasPendingChanges,
    syncPendingChanges
  };
} 