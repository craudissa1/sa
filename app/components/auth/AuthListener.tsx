'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Componente que escuta eventos de autenticação do Supabase
 * Útil para depurar problemas de autenticação
 */
export default function AuthListener() {
  useEffect(() => {
    // Função para lidar com mudanças de estado de autenticação
    const handleAuthChange = (event: AuthChangeEvent, session: Session | null) => {
      console.log('[AuthListener] Evento de autenticação:', event, session ? 'Sessão válida' : 'Sem sessão');
      
      // Verificar hash na URL que pode conter tokens
      if (typeof window !== 'undefined' && window.location.hash) {
        console.log('[AuthListener] Hash detectado:', window.location.hash);
        
        // Se tivermos um token na URL e ocorrer um evento SIGNED_IN, fazer log
        if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
          console.log('[AuthListener] Login com token na URL detectado e processado');
        }
      }
    };

    // Inscrever no evento de mudança de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Verificar e logar o estado atual da sessão
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[AuthListener] Estado atual da sessão:', session ? 'Autenticado' : 'Não autenticado');
    };
    
    checkSession();

    // Limpar inscrição ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Componente não renderiza nada visualmente
  return null;
}
