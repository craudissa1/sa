'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import StoreInitializer from '../components/utils/StoreInitializer';
import { supabase } from '../lib/supabaseClient';
import AuthListener from '../components/auth/AuthListener';

// Usar a instância centralizada do cliente Supabase

// Contexto de autenticação
export const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

// Hook para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Obter sessão inicial e configurar ouvinte para mudanças na autenticação
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão:', error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Lidar com o caso de tokens na URL (hash) para OAuth
    if (typeof window !== 'undefined') {
      // Se temos hash com token, tentamos processar
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log('AuthProvider: Hash com access_token detectado, processando...');
        
        // Tentar extrair tokens de forma mais robusta
        const accessTokenMatch = window.location.hash.match(/[#&]access_token=([^&]+)/);
        const refreshTokenMatch = window.location.hash.match(/[#&]refresh_token=([^&]+)/);
        
        if (accessTokenMatch) {
          try {
            const accessToken = decodeURIComponent(accessTokenMatch[1]);
            const refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : '';
            
            // Tentativa de setar a sessão manualmente
            (async () => {
              try {
                const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
                
                if (error) {
                  console.error('Erro ao definir sessão:', error);
                } else {
                  console.log('Sessão definida com sucesso via hash token');
                  router.refresh();
                }
              } catch (e) {
                console.error('Erro ao processar tokens do hash:', e);
              }
            })();
          } catch (e) {
            console.error('Erro ao decodificar tokens:', e);
          }
        }
      }
    }
    
    // Configurar ouvinte para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("AuthProvider: Evento de autenticação recebido:", event);
        
        if (event === 'SIGNED_IN') {
          console.log("AuthProvider: Login detectado, forçando isLoading = false");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Forçar a atualização do router para refletir o novo estado de autenticação
        router.refresh();
      }
    );

    // Limpar ouvinte quando o componente for desmontado
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  // Método para fazer logout
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Método para atualizar a sessão
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, refreshSession }}>
      <StoreInitializer />
      <AuthListener />
      {children}
    </AuthContext.Provider>
  );
}
