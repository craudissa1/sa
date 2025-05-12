"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppStore } from "../../store";
import { supabaseRealtime } from "../../lib/supabaseRealtime";
import { supabaseSync } from "../../lib/supabaseSync";
import { useFinancasStore } from "../../stores/financasStore";
// Importar outras stores conforme necessário

const StoreInitializer = () => {
  const { user, loading } = useAuth(); // loading equivale a isAuthLoading
  const session = useAuth().session;
  
  // Funções e estados do App Store
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const fetchInitialData = useAppStore((state) => state.fetchInitialData);
  const fetchConfiguracao = useAppStore((state) => state.fetchConfiguracao);
  
  // Funções das outras stores
  const { fetchFinancasData, setCurrentUser: setCurrentUserFinancas } = useFinancasStore.getState();
  // Adicionar outras stores conforme necessário

  // Gerenciar usuário atual e carregar dados iniciais
  useEffect(() => {
    console.log("StoreInitializer Effect: user:", user?.id, "loading:", loading);
    
    // Primeiro sincronizar o currentUser nas stores individuais
    if (user !== useFinancasStore.getState().currentUser) {
      setCurrentUserFinancas(user);
    }
    
    // Só busca dados se o usuário existir E a autenticação não estiver carregando
    if (user && !loading) {
      console.log("StoreInitializer: Autenticação pronta. Buscando dados das stores...", user.id);
      setCurrentUser(user);
      
      // Chamar funções de fetch com um pequeno atraso para garantir que o token está propagado
      setTimeout(() => {
        fetchInitialData(user.id);
        fetchConfiguracao(user.id);
        fetchFinancasData(user.id);
        // Chamar funções de fetch de outras stores aqui
        
        // Configurar o serviço de sincronização
        supabaseSync.setUser(user);
      }, 100); // Pequeno atraso para garantir propagação do token
      
    } else if (!loading && !session) {
      console.log("StoreInitializer: Sem usuário e autenticação finalizada. Limpando stores.");
      setCurrentUser(null);
      setCurrentUserFinancas(null);
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
      
      // Limpar outras stores
      useFinancasStore.setState({
        categorias: [],
        transacoes: [],
        envelopes: [],
        pagamentosRecorrentes: [],
        currentUser: null
      });
    }
  }, [user, session, loading, setCurrentUser, fetchInitialData, fetchConfiguracao, fetchFinancasData, setCurrentUserFinancas]);

  // Gerenciar subscrições em tempo real
  useEffect(() => {
    // Só inicializar subscrições quando user existir E autenticação estiver pronta
    if (user && !loading) {
      console.log("StoreInitializer: Inicializando subscrições em tempo real para o usuário", user.id);
      supabaseRealtime.initialize(user);
    }
    
    // Limpar subscrições quando o componente for desmontado
    return () => {
      console.log("StoreInitializer: Limpando subscrições em tempo real.");
      supabaseRealtime.cleanupSubscriptions();
    };
  }, [user, loading]);

  // Monitorar estado da conexão
  useEffect(() => {
    const handleOnline = () => {
      console.log("StoreInitializer: Conexão online detectada.");
      
      // Tentar sincronizar dados pendentes apenas se usuário estiver autenticado E loading for false
      if (user && !loading) {
        console.log("StoreInitializer: Tentando sincronizar dados pendentes...");
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
  }, [user, loading]);

  // Inicializar o estado da aplicação apenas no lado do cliente - primeira renderização
  useEffect(() => {
    console.log("StoreInitializer: Inicializando estado base da aplicação.");
    useAppStore.setState({
      tarefas: [],
      blocosTempo: [],
      refeicoes: [],
      medicamentos: [],
      registrosHumor: [],
      configuracao: null,
      currentUser: null,
    });
    
    // Inicialização de outras stores pode ser feita aqui se necessário
  }, []);

  return null;
};

export default StoreInitializer;
