// 'use client'; // Opcional aqui, depende se LoginForm é client component

import { Metadata } from 'next';
import LoginForm from '../components/auth/LoginForm'; // Mantenha o caminho correto

export const metadata: Metadata = {
  title: 'Login | Painel Neurodivergentes', // Pode manter ou ajustar se o nome do app mudou
  description: 'Acesse sua conta para gerenciar seu painel personalizado',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Bem-vindo(a) de volta
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Acesse sua conta para continuar sua jornada
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}