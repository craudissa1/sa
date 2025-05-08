"use client";

import React from 'react';
import { useSupabaseStatus } from '../../hooks/useSupabaseStatus';
import { useAppStore } from '../../store';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const SupabaseStatusIndicator = () => {
  const { isOnline, isSyncing, hasPendingChanges, syncPendingChanges } = useSupabaseStatus();
  
  
  // Determinar a cor do indicador
  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (isSyncing) return 'text-amber-500 animate-pulse';
    if (hasPendingChanges) return 'text-amber-500';
    return 'text-green-500';
  };
  
  // Determinar o ícone a ser exibido
  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (isSyncing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return <Wifi className="h-4 w-4" />;
  };
  
  // Determinar a mensagem de status
  const getStatusMessage = () => {
    if (!isOnline) return 'Offline';
    if (isSyncing) return 'Sincronizando...';
    if (hasPendingChanges) return 'Alterações pendentes';
    return 'Online';
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => isOnline && hasPendingChanges && syncPendingChanges()}
        disabled={!isOnline || isSyncing || !hasPendingChanges}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${getStatusColor()} ${
          isOnline && hasPendingChanges 
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' 
            : 'cursor-default'
        }`}
        title={hasPendingChanges ? 'Clique para sincronizar alterações pendentes' : 'Status da conexão'}
      >
        <span className="flex-shrink-0">{getStatusIcon()}</span>
        <span className="hidden sm:inline">{getStatusMessage()}</span>
      </button>
    </div>
  );
}; 