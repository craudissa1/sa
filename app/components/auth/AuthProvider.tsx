'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { useAuthStore } from '../../stores/authStore';

/**
 * Provider que inicializa a autenticação e gerencia os listeners de estado de autenticação
 * Agora utiliza Zustand para gerenciamento de estado em vez de Context API
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Inicializar autenticação e configurar listeners
  useEffect(() => {
    const { setSession, setUser, setIsLoading, handleDataMigration, updateServerSession } = useAuthStore.getState();
    setIsLoading(true); // Inicia como carregando

    let initialSessionChecked = false;
    let authListenerProcessedFirstEvent = false;
    let authTimeout: NodeJS.Timeout | undefined;

    const checkLoadingDone = () => {
      // Só define isLoading como false se ambas as operações iniciais (getSession e o primeiro onAuthStateChange)
      // tiverem sido processadas. Isso ajuda a garantir que a sessão está estabilizada.
      if (initialSessionChecked && authListenerProcessedFirstEvent) {
        setIsLoading(false);
        console.log("AuthProvider: Autenticação inicial finalizada.");
        if (authTimeout) clearTimeout(authTimeout);
      }
    };
    
    // Timeout de segurança para evitar que o app fique preso em estado de loading
    authTimeout = setTimeout(() => {
      console.log("AuthProvider: Timeout de segurança atingido, forçando isLoading = false");
      setIsLoading(false);
    }, 3000);

    // 1. Obter a sessão atual ao montar
    supabase.auth.getSession().then(({ data, error }: { 
      data: { session: Session | null }; 
      error: Error | null 
    }) => {
      if (error) {
        console.error('AuthProvider: Erro ao obter sessão inicial:', error.message);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        // A migração de dados será gerenciada pelo StoreInitializer
        // quando user existir e isLoading for false
      }
      initialSessionChecked = true;
      checkLoadingDone(); // Verifica se pode parar o loading
    }).catch((err: Error) => {
      console.error('AuthProvider: Exceção ao obter sessão inicial:', err);
      initialSessionChecked = true; // Marcar como checado mesmo em erro para não bloquear checkLoadingDone
      checkLoadingDone();
    });

    // 2. Configurar o ouvinte de alterações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (
      event: AuthChangeEvent,
      session: Session | null
    ) => {
      console.log(`AuthProvider: Evento de autenticação recebido: ${event}`);
      
      // Para eventos SIGNED_IN, especialmente após OAuth, definir isLoading como false imediatamente
      if (event === 'SIGNED_IN') {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false); // Forçar isLoading para false imediatamente
        console.log("AuthProvider: Login detectado, forçando isLoading = false");
        
        if (session) {
          await updateServerSession(event, session);
        }
      } else {
        // Para outros eventos, seguir o fluxo normal
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          await updateServerSession(event, session);
        }
      }

      // Se for o primeiro evento de autenticação processamos e consideramos para finalizar o loading
      if (!authListenerProcessedFirstEvent) {
        authListenerProcessedFirstEvent = true;
        checkLoadingDone(); // Verifica se pode parar o loading
      }

      // Redirecionar para login quando o usuário faz logout
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    // Limpar o ouvinte ao desmontar o componente
    return () => {
      if (authTimeout) clearTimeout(authTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [router]); // Adicionando router como dependência para corrigir o warning do ESLint

  return <>{children}</>;
}

/**
 * Hook de compatibilidade para aplicações existentes
 * Permite que componentes que usavam o useAuth() continuem funcionando
 * sem necessidade de refatoração, porém agora usando Zustand por baixo
 */
export function useAuth() {
  const auth = useAuthStore();
  return {
    user: auth.user,
    session: auth.session,
    loading: auth.isLoading, // Para manter compatibilidade com o nome 'loading' do AuthContext original
    isLoading: auth.isLoading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
    requestPasswordReset: auth.requestPasswordReset,
    updatePassword: auth.updatePassword,
    resendConfirmationEmail: auth.resendConfirmationEmail,
  };
}
