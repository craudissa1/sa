"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../store";
import { supabaseRealtime } from "../../lib/supabaseRealtime";
import { supabaseSync } from "../../lib/supabaseSync";

const StoreInitializer = () => {
  const { user, session, loading } = useAuth();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const fetchInitialData = useAppStore((state) => state.fetchInitialData);
  const fetchConfiguracao = useAppStore((state) => state.fetchConfiguracao);
  

  // Gerenciar usuário atual e carregar dados iniciais
  useEffect(() => {
    if (user) {
      console.log("StoreInitializer: Usuário encontrado, configurando usuário atual e carregando dados iniciais.", user.id);
      setCurrentUser(user);
      fetchInitialData(user.id);
      fetchConfiguracao(user.id);
      
      // Definir status inicial de sincronização
      
      
      // Configurar o serviço de sincronização
      supabaseSync.setUser(user);
    } else if (!loading && !session) {
      console.log("StoreInitializer: Nenhuma sessão de usuário, limpando usuário atual.");
      setCurrentUser(null);
      supabaseSync.setUser(null);
      
      // Limpar o estado da aplicação
      useAppStore.setState({
        tarefas: [],
        blocosTempo: [],
        refeicoes: [],
        medicamentos: [],
        registrosHumor: [],
        configuracao: null,
        currentUser: null
      });
    }
  }, [user, session, loading, setCurrentUser, fetchInitialData, fetchConfiguracao]);

  // Gerenciar subscrições em tempo real
  useEffect(() => {
    // Inicializar subscrições em tempo real
    supabaseRealtime.initialize(user);
    
    // Limpar subscrições quando o componente for desmontado
    return () => {
      console.log("StoreInitializer: Limpando subscrições em tempo real.");
      supabaseRealtime.cleanupSubscriptions();
    };
  }, [user]);

  // Monitorar estado da conexão
  useEffect(() => {
    const handleOnline = () => {
      console.log("StoreInitializer: Conexão online detectada.");
      
      
      // Tentar sincronizar dados pendentes
      if (user) {
        supabaseSync.forceSyncAll().catch(err => 
          console.error("Erro ao sincronizar dados pendentes:", err)
        );
      }
    };
    
    const handleOffline = () => {
      console.log("StoreInitializer: Conexão offline detectada.");
      
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Inicializar o estado da aplicação apenas no lado do cliente
  useEffect(() => {
    useAppStore.setState({
      tarefas: [],
      blocosTempo: [],
      refeicoes: [],
      medicamentos: [],
      registrosHumor: [],
      configuracao: null,
      currentUser: null,
    });
  }, []);

  return null;
};

export default StoreInitializer;
