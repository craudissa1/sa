'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AuthProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    // Esta função processa o callback de autenticação do Supabase
    const handleAuthCallback = async () => {
      // Obter o hash do URL que contém o token e outras informações de autenticação
      const hashParams = window.location.hash;
      
      if (hashParams) {
        try {
          // O Supabase processa o callback automaticamente, mas podemos verificar
          // explicitamente para informar o usuário
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Erro no callback de autenticação:', error.message);
            // Redirecionar para a página de login com mensagem de erro
            router.push('/login?error=auth_callback_failed');
            return;
          }
          
          if (data.session) {
            console.log('Autenticação bem-sucedida!');
            
            // Verificar se há um redirect URL na query string
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirectTo');
            
            // Redirecionar para a página solicitada ou para a home
            if (redirectTo && !redirectTo.includes('auth') && !redirectTo.includes('login')) {
              router.push(decodeURIComponent(redirectTo));
            } else {
              router.push('/dashboard');
            }
          } else {
            // Sessão não encontrada, redirecionar para login
            router.push('/login');
          }
        } catch (error) {
          console.error('Erro ao processar callback de autenticação:', error);
          router.push('/login?error=auth_callback_error');
        }
      } else {
        // Se não houver hash, algo está errado
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            Processando sua autenticação...
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Por favor, aguarde enquanto processamos seu login.
          </p>
        </div>
      </div>
    </div>
  );
}
