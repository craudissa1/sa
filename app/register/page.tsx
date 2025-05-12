'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuthStore } from '../stores/authStore';
import { LogOut } from 'lucide-react';

// Metadata deve ser definida em um arquivo separado ou usando layout.tsx
// pois não pode ser usado com 'use client'

export default function RegisterPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  
  useEffect(() => {
    // Esperar o estado de carregamento inicial terminar
    if (!isLoading && user) {
      setShowRedirectMessage(true);
      
      // Redirecionar após um pequeno delay para visibilidade da mensagem
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (showRedirectMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <div className="mb-6 text-green-500 text-5xl inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20">
            ✓
          </div>
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Você já possui uma conta!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Você já está autenticado no sistema. Redirecionando para a página inicial...
          </p>
          <button 
            onClick={() => router.push('/')} 
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
          >
            Ir para a Página Inicial
          </button>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={async () => {
                const { signOut } = useAuthStore.getState();
                await signOut();
                setShowRedirectMessage(false);
              }}
              className="inline-flex items-center text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors focus:outline-none"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair e criar outra conta</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Crie sua conta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Comece sua jornada com ferramentas personalizadas para seu cérebro único
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 