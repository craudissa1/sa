'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ProcessTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processando autenticação...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Verificar se temos um token no fragmento da URL (hash)
        const hash = window.location.hash;
        
        // Usando uma regex mais robusta para extrair tokens do formato complexo de hash
        // Este formato específico '#access_token=xxx&expires_at=yyy&...' precisa de tratamento especial
        const accessTokenMatch = hash.match(/[#&]access_token=([^&]+)/);
        const refreshTokenMatch = hash.match(/[#&]refresh_token=([^&]+)/);
        
        const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
        const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;
        
        console.log('Detectando tokens na URL', { 
          hashPresente: !!hash,
          hashLength: hash.length,
          accessTokenEncontrado: !!accessToken,
          refreshTokenEncontrado: !!refreshToken
        });
        
        // Verificar para onde redirecionar após autenticação
        const redirectPath = searchParams?.get('redirect') || '/dashboard';
        
        if (accessToken) {
          // Fluxo com token no hash
          setMessage('Token detectado. Processando sessão...');
          console.log('Iniciando processamento de sessão com tokens encontrados');
          
          try {
            // Tentar decodificar o token se estiver codificado
            const decodedAccessToken = decodeURIComponent(accessToken);
            const decodedRefreshToken = refreshToken ? decodeURIComponent(refreshToken) : '';
            
            // Definir a sessão manualmente usando o token do hash
            const { error } = await supabase.auth.setSession({
              access_token: decodedAccessToken,
              refresh_token: decodedRefreshToken,
            });
          
            if (error) {
              console.error('Erro ao definir sessão:', error);
              throw error;
            }
          } catch (sessionError) {
            console.error('Erro ao processar tokens:', sessionError);
            // Tentar uma abordagem alternativa - tratando o hash completo
            console.log('Tentando alternativa com detectSessionInUrl');
            
            // Se a primeira abordagem falhar, tentar refresh forçado que usa detectSessionInUrl
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              throw refreshError;
            }
          }
          
          // Verificar se temos uma sessão válida
          const { data } = await supabase.auth.getSession();
          console.log('Resultado da getSession:', data.session ? 'Sessão válida encontrada' : 'Sessão não encontrada');
          
          if (data.session) {
            // Verificar se o usuário já possui um perfil
            const userId = data.session.user.id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            // Se não existe perfil, criar um
            if (!profile) {
              const { error } = await supabase.from('profiles').insert([
                {
                  id: userId,
                  nome_completo: data.session.user.user_metadata.full_name || '',
                  idioma: 'pt-BR',
                  tema_visual: 'system',
                  created_at: new Date().toISOString(),
                },
              ]);

              if (error) {
                console.error('Erro ao criar perfil:', error);
              }
            }
            
            // Sessão configurada, redirecionar
            setMessage('Autenticação concluída. Redirecionando...');
            router.push(redirectPath);
          } else {
            throw new Error('Não foi possível obter uma sessão válida após configurar o token');
          }
        } else {
          console.log('Nenhum token encontrado no hash. Hash completo:', hash);
          // Tentar verificar se existe sessão atualmente (pode ter sido processada automaticamente)
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            // Sessão já foi configurada automaticamente pelo cliente do Supabase
            console.log('Sessão já existe mesmo sem processamento manual do token');
            const redirectPath = searchParams?.get('redirect') || '/dashboard';
            setMessage('Sessão encontrada. Redirecionando...');
            router.push(redirectPath);
            return;
          } else {
            // Token não encontrado e não temos sessão
            throw new Error('Token de acesso não encontrado na URL e nenhuma sessão ativa');
          }
        }
      } catch (err: any) {
        console.error('Erro no processamento do token:', err);
        setError(err.message || 'Ocorreu um erro durante a autenticação');
        
        // Capturar mais informações para diagnóstico
        console.error('Detalhes completos do erro:', {
          mensagem: err.message,
          stack: err.stack,
          url: window.location.href,
          hash: window.location.hash
        });
        
        // Redirecionar para login após um tempo
        setTimeout(() => router.push('/login'), 5000);
      }
    }

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        {!error ? (
          <>
            <div className="mb-6 text-blue-500 inline-flex items-center justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Processando Autenticação
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 text-red-500 text-5xl inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
              ×
            </div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Erro de Autenticação
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-6">
              {error}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Redirecionando para a página de login em alguns segundos...
            </p>
          </>
        )}
      </div>
    </div>
  );
} 