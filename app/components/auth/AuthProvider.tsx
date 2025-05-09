'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { dataMigrationService } from '../../lib/dataMigration';
import { supabaseSync } from '../../lib/supabaseSync';

// Tipo para o contexto de autenticação
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; success: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null; success: boolean }>;
  signInWithGoogle: () => Promise<{ error: any | null; success: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null; success: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null; success: boolean }>;
};

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const router = useRouter();

  // Função para migrar os dados do localStorage para o Supabase
  const handleDataMigration = useCallback(async (user: User) => {
    if (isMigrating) return;
    setIsMigrating(true);

    try {
      console.log('Verificando migração de dados para o usuário:', user.id);
      dataMigrationService.setUserId(user.id);
      
      // Verificar se o usuário já tem dados no Supabase
      const jaTemDados = await dataMigrationService.usuarioTemDadosNoSupabase();
      
      if (!jaTemDados) {
        console.log('Iniciando migração de dados para o Supabase...');
        
        // Iniciar a migração de dados
        const migrouComSucesso = await dataMigrationService.migrarTodosDados();
        
        if (migrouComSucesso) {
          console.log('Dados migrados com sucesso para o Supabase!');
          
          // Atualizar componente UI com feedback
          // Você pode adicionar um toast ou notificação aqui
        } else {
          console.error('Erro ao migrar dados para o Supabase');
          
          // Atualizar componente UI com feedback de erro
          // Você pode adicionar um toast ou notificação aqui
        }
      } else {
        console.log('Usuário já possui dados no Supabase.');
      }
      
      // Iniciar o serviço de sincronização com o usuário atual
      supabaseSync.setUser(user);
    } catch (error) {
      console.error('Erro durante a migração de dados:', error);
    } finally {
      setIsMigrating(false);
    }
  }, [isMigrating]);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    // Inicializar a autenticação
    const initAuth = async () => {
      setIsLoading(true);

      try {
        // Obter a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);

        // Se o usuário estiver autenticado, iniciar a migração de dados
        if (session?.user && !isMigrating) {
          handleDataMigration(session.user);
        }

        // Configurar o ouvinte de alterações de autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(`Auth event: ${event}`);
          setSession(session);
          setUser(session?.user || null);

          // Atualizar a cache do servidor
          if (session) {
            await fetch('/api/auth/update-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ event, session }),
            });
          }

          // Quando o usuário faz login, verificar se é necessário migrar os dados
          if (event === 'SIGNED_IN' && session?.user) {
            handleDataMigration(session.user);
          }
        });

        // Atualizar o estado de carregamento
        setIsLoading(false);

        // Limpar o ouvinte ao desmontar o componente
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [router, handleDataMigration, isMigrating]);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Função para criar conta
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Função para solicitar reset de senha
  const requestPasswordReset = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Função para atualizar senha
  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Função para login com Google
  const signInWithGoogle = async () => {
    try {
      // Importante: mantemos /auth/callback como caminho de callback para o Supabase
      // pois a lógica de processamento do token está no route.ts desse caminho
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT || `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Valor do contexto
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    requestPasswordReset,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
