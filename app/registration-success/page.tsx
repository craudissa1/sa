import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Registro Concluído | Painel Neurodivergentes',
  description: 'Sua conta foi criada com sucesso',
};

export default function RegistrationSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Registro Concluído!
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Verifique seu email para confirmar sua conta.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Enviamos um link de confirmação para o seu email. Por favor, clique no link para ativar sua conta.
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Não recebeu o email? Verifique sua pasta de spam ou tente fazer login novamente para reenviar o email de confirmação.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ir para Login
            </Link>
            
            <Link
              href="/"
              className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para Página Inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 