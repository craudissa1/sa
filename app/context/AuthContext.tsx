'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createClientComponentClient, 
  Session, 
  User 
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import StoreInitializer from '../components/utils/StoreInitializer';

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
  const supabase = createClientComponentClient();

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

    // Configurar ouvinte para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Forçar a atualização do router para refletir o novo estado de autenticação
      router.refresh();
    });

    // Limpar ouvinte quando o componente for desmontado
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router, supabase]);

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
      {children}
    </AuthContext.Provider>
  );
}
