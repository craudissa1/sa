'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { dataMigrationService } from '../lib/dataMigration';
import { supabaseSync } from '../lib/supabaseSync';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isMigrating: boolean;
  
  // Setters
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsMigrating: (isMigrating: boolean) => void;
  
  // Métodos de autenticação
  signIn: (email: string, password: string) => Promise<{ error: any | null; success: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null; success: boolean }>;
  signInWithGoogle: () => Promise<{ error: any | null; success: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null; success: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null; success: boolean }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any | null; success: boolean }>;
  
  // Manipulação de dados
  handleDataMigration: (user: User) => Promise<void>;
  
  // Gerenciamento de sessão
  updateServerSession: (event: string, session: Session) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isMigrating: false,
      
      // Setters
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsMigrating: (isMigrating) => set({ isMigrating }),
      
      // Métodos de autenticação
      signIn: async (email, password) => {
        try {
          console.log('Tentando login com:', email);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Erro de autenticação do Supabase:', error);
            
            // Convertendo erro para um formato mais amigável
            let errorMessage = '';
            
            if (error.message === 'Invalid login credentials') {
              errorMessage = 'Email ou senha inválidos. Verifique suas credenciais.';
            } else if (error.message.includes('Email not confirmed')) {
              errorMessage = 'Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada.';
            } else {
              errorMessage = error.message || 'Ocorreu um erro durante o login.';
            }
            
            return { 
              error: { 
                ...error, 
                message: errorMessage 
              }, 
              success: false 
            };
          }

          if (!data.session) {
            return { 
              error: { 
                message: 'Sessão não foi criada. Verifique suas credenciais.' 
              }, 
              success: false 
            };
          }
          
          // Login bem-sucedido
          console.log('Login bem-sucedido, sessão criada');
          return { error: null, success: true };
        } catch (error) {
          console.error('Erro inesperado durante login:', error);
          return { 
            error: { 
              message: error instanceof Error ? error.message : 'Erro inesperado durante o login' 
            }, 
            success: false 
          };
        }
      },
      
      signUp: async (email, password) => {
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
      },
      
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
      },
      
      requestPasswordReset: async (email) => {
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
      },
      
      updatePassword: async (newPassword) => {
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
      },
      
      signInWithGoogle: async () => {
        try {
          // Capturar o parâmetro de redirecionamento se existir na URL atual
          const url = new URL(window.location.href);
          const redirectPath = url.searchParams.get('redirect') || '/dashboard';
          
          // Importante: mantemos /auth/callback como caminho de callback para o Supabase
          // pois a lógica de processamento do token está no route.ts desse caminho
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT || `${window.location.origin}/auth/callback?redirect=${redirectPath}`,
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
      },
      
      resendConfirmationEmail: async (email) => {
        try {
          const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
          });

          if (error) {
            return { error, success: false };
          }

          return { error: null, success: true };
        } catch (error) {
          return { error, success: false };
        }
      },
      
      // Migração de dados
      handleDataMigration: async (user) => {
        const { isMigrating } = get();
        if (isMigrating) return;
        
        set({ isMigrating: true });
        
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
              
              // Aqui poderia disparar alguma notificação/toast
            } else {
              console.error('Erro ao migrar dados para o Supabase');
              
              // Aqui poderia disparar alguma notificação/toast de erro
            }
          } else {
            console.log('Usuário já possui dados no Supabase.');
          }
          
          // Iniciar o serviço de sincronização com o usuário atual
          supabaseSync.setUser(user);
        } catch (error) {
          console.error('Erro durante a migração de dados:', error);
        } finally {
          set({ isMigrating: false });
        }
      },
      
      // Atualização de sessão no servidor
      updateServerSession: async (event, session) => {
        try {
          await fetch('/api/auth/update-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event, session }),
          });
        } catch (error) {
          console.error('Erro ao atualizar sessão no servidor:', error);
        }
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      // Apenas persiste informações não sensíveis
      partialize: (state) => ({
        user: state.user ? { 
          id: state.user.id,
          email: state.user.email,
          user_metadata: state.user.user_metadata
        } : null
      })
    }
  )
);
